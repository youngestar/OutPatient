<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>AI助手</h2>
      <el-button v-if="couldSend && !hasRecorded" class="over-button"
        @click="overAichat(chatHistoryStore.getId(appoimentId))" type="danger" size="large">停止对话</el-button>
    </div>
    <div class="chat-messages" ref="chatMessages">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.sender]">
        <div class="message-avatar">
          <img :src="avatars[message.sender === 'user' ? 0 : 1]" alt="头像" />
        </div>
        <div class="message-content">
          <div class="message-sender">{{ message.sender === 'user' ? '你' : 'AI助手' }}</div>
          <div class="message-text">
            {{ message.text }}
            <div class="loading" v-if="message.sender === 'ai' && isLoading && index === messages.length - 1"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="couldSend && !hasRecorded" class="chat-input">
      <textarea v-model="newMessage" @keypress.enter="sendMessage" placeholder="输入消息..." class="textarea-field"
        rows="3"></textarea>
      <button :disabled="isLoading" @click="sendMessage" class="send-button">发送</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue';
import { DoAxios, DoAxiosWithErro } from '@/api/index';
import { useUserStore } from '@/stores/user';
import { useChatHistoryStore } from '@/stores/ChatHistory';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { ElMessage } from 'element-plus';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';
type ChatHistoryEntry = {
  role: string;
  content: string;
};

const props = defineProps({
  appoimentId: {
    type: String,
    required: true,
  },
  couldSend: {
    type: Boolean,
    default: true,
  },
});

const avatars = ['/src/assets/me.png', '/src/assets/AIavator.png'];

const messages = reactive([
  {
    sender: 'ai',
    text: '你好！有什么我可以帮助你的吗？',
  },
]);

const userStore = useUserStore();
const chatHistoryStore = useChatHistoryStore();

const isLoading = ref(false);
const hasRecorded = ref(false);
const newMessage = ref('');
const chatMessages = ref<HTMLElement | null>(null);
const fetchSource = ref<AbortController | null>(null);

const scrollToBottom = () => {
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
  }
};

const pushHistory = (historyList: ChatHistoryEntry[]) => {
  historyList.forEach((item, index) => {
    if (index === 0) {
      return;
    }
    messages.push({
      sender: item.role === 'user' ? 'user' : 'ai',
      text: item.content,
    });
  });
  scrollToBottom();
};

const handleStreamMessage = (value: string) => {
  const last = messages[messages.length - 1];
  if (!last || last.sender === 'user') {
    messages.push({
      sender: 'ai',
      text: value,
    });
  } else {
    last.text += value;
  }
  scrollToBottom();
};

const getPatientId = () => Number(userStore.userInfo?.patientId ?? 0);

const sendMessage = async () => {
  const trimmed = newMessage.value.trim();
  if (!trimmed) {
    ElMessage.warning('消息不能为空');
    return;
  }

  const patientId = getPatientId();
  if (!patientId) {
    ElMessage.error('缺少患者信息');
    return;
  }

  messages.push({
    sender: 'user',
    text: trimmed,
  });
  scrollToBottom();

  isLoading.value = true;
  try {
    await DoAxios(
      '/appointment/ai-consult/send',
      'post',
      {
        patientId,
        question: trimmed,
        appointmentId: props.appoimentId,
        sessionId: chatHistoryStore.getId(props.appoimentId),
      },
      true,
      true
    );
    newMessage.value = '';
    ElMessage.success('发送成功');
  } catch {
    messages.pop();
    ElMessage.error('发送失败，请重新发送');
  } finally {
    isLoading.value = false;
  }
};

const getHistory = (sessionId: string) => {
  DoAxiosWithErro<{ messageHistory?: ChatHistoryEntry[] }>(
    '/appointment/ai-consult/history',
    'get',
    { sessionId },
    true
  ).then((res) => {
    const history: ChatHistoryEntry[] = Array.isArray(res?.messageHistory) ? res.messageHistory : [];
    pushHistory(history);
  });
};

const loadMessageHistory = () => {
  DoAxiosWithErro<ChatHistoryEntry[]>(
    '/appointment/message/history',
    'get',
    { appointmentId: props.appoimentId },
    true
  ).then((res) => {
    const historyList: ChatHistoryEntry[] = Array.isArray(res) ? res : [];
    pushHistory(historyList);
  });
};

const checkHasRecord = async (appointmentId: string) => {
  const res = await DoAxiosWithErro<boolean>(
    `/appointment/ai-consult/exists?appointmentId=${appointmentId}`,
    'get',
    {},
    true
  );
  hasRecorded.value = !!res;
  return hasRecorded.value;
};

const initFetchES = () => {
  fetchSource.value?.abort();
  const controller = new AbortController();
  fetchSource.value = controller;
  const patientId = getPatientId();
  if (!patientId) {
    ElMessage.error('缺少患者信息');
    controller.abort();
    return;
  }

  // 从 store 读取 token，若为空则回退到 localStorage（容错）
  const tokenValue = userStore.userToken || localStorage.getItem('userToken') || '';

  fetchEventSource(`${API_BASE}/appointment/ai-consult/connect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      satoken: tokenValue,
      Authorization: tokenValue ? `Bearer ${tokenValue}` : undefined, // === 新增：同时带 Authorization ===
    },
    body: JSON.stringify({
      patientId,
      appointmentId: props.appoimentId,
      question: newMessage.value,
      sessionId: chatHistoryStore.getId(props.appoimentId),
    }),
    signal: controller.signal,
    onmessage(event) {
      const data = JSON.parse(event.data);
      if (data.content === '连接已建立') {
        chatHistoryStore.addId(props.appoimentId, data.sessionId);
        return;
      }
      if (data.event === 'message') {
        handleStreamMessage(data.content);
      }
      if (data.event === 'complete') {
        isLoading.value = false;
      }
    },
    async onopen(response) {
      if (response.ok) {
        ElMessage.success('连接成功');
      } else {
        ElMessage.error('连接失败');
      }
    },
    onerror() {
      ElMessage.error('连接失败');
      controller.abort();
    },
  });
};

const overAichat = (sessionId: string | null) => {
  if (!sessionId) {
    ElMessage.warning('会话尚未建立');
    return;
  }
  DoAxios('/appointment/ai-consult/end', 'post', { sessionId }, true, true)
    .then(() => {
      ElMessage.success('聊天记录保存成功');
    })
    .catch(() => {
      ElMessage.error('聊天记录保存失败');
    });
};

onMounted(async () => {
  if (!props.couldSend) {
    loadMessageHistory();
    return;
  }

  const recorded = await checkHasRecord(props.appoimentId);
  if (!recorded) {
    initFetchES();
    const existingSession = chatHistoryStore.getId(props.appoimentId);
    if (existingSession) {
      getHistory(existingSession);
    }
  } else {
    loadMessageHistory();
  }
});

onUnmounted(() => {
  fetchSource.value?.abort();
});
</script>

<style lang="scss" scoped>
.chat-container {
  width: 100%;
  height: 90%;
  margin: 0 auto;
  background-color: #f5f7fa;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.chat-header {
  background-color: #4a6cf7;
  color: white;
  padding: 15px;
  position: relative;
  text-align: center;

  .over-button {
    position: absolute;
    right: 1rem;
    top: 1rem;
  }
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  display: flex;
  max-width: 80%;
  margin-bottom: 10px;
}

.message.user {
  justify-content: flex-end;
}

.message.user .message-avatar {
  order: 2;
}

.loading {
  border: 4px solid #f3f3f3;
  /* Light grey */
  border-top: 4px solid #3498db;
  /* Blue */
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 2s linear infinite;
  margin-top: 5px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 10px;
}

.message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content {
  background-color: white;
  padding: 10px 15px;
  border-radius: 18px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 80%;
  word-wrap: break-word;
}

.message.user .message-content {
  background-color: #4a6cf7;
  color: white;
  border-radius: 18px 18px 0 18px;
}

.message-sender {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 4px;
}

.message-text {
  font-size: 14px;
}

.chat-input {
  padding: 15px;
  background-color: white;
  display: flex;
  border-top: 1px solid #e0e0e0;
}

.textarea-field {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
  resize: none;
  /* 禁止用户手动调整大小 */
  overflow-y: auto;
  /* 添加滚动条 */
  min-height: 60px;
  /* 设置最小高度 */
  max-height: 120px;
  /* 设置最大高度 */
}

.send-button {
  background-color: #4a6cf7;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 12px 20px;
  margin-left: 10px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.send-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
