<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>AI助手</h2>
      <el-button v-if="couldSend" class="over-button" @click="overAichat(sessionId)" type="danger" size="big">停止对话</el-button>
    </div>
    <div class="chat-messages" ref="chatMessages">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.sender]">
        <div class="message-avatar">
          <img :src="message.avatar" alt="头像" />
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
    <div v-if="couldSend" class="chat-input">
      <textarea
        v-model="newMessage"
        @keypress.enter="sendMessage"
        placeholder="输入消息..."
        class="textarea-field"
        rows="3"
      ></textarea>
      <button :disabled="isLoading" @click="sendMessage" class="send-button">发送</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue';
import { DoAxios, DoAxiosWithErro } from '@/api/index';
import { useUserStore } from "@/stores/user";
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { ElMessage,} from 'element-plus';

const props = defineProps({
  appoimentId: {
    type: Number,
    required: true,
  },
  couldSend: {
    type: Boolean,
    default: true,
  }
})

const messages = reactive([
  {
    sender: 'ai',
    text: '你好！有什么我可以帮助你的吗？',
    avatar: '/src/assets/AIavator.png',
  },
]);

const userStore = useUserStore();
const isLoading = ref<boolean>(false);
const newMessage = ref('');

const chatMessages = ref<HTMLElement | null>(null);
const sessionId = ref<string | null>(null);
const fetchsource = ref<AbortController | null>(new AbortController());

const sendMessage = async () => {
  if (newMessage.value.trim() === '') {
    ElMessage({
      message: '消息不能为空',
      type: 'warning',
    })
    return
  };

  const userMessae = {
    sender: 'user',
    text: newMessage.value,
    avatar: '/src/assets/me.png',
  }

  messages.push(userMessae);

  isLoading.value = true;
  DoAxios('/appointment/ai-consult/send','post',{
    patientId: userStore.userInfo!.userId as number,
    question: newMessage.value,
    appointmentId: props.appoimentId,
    sessionId: sessionId.value
  },true).then(()=> {
    // 清空输入框
    newMessage.value = '';
    messages.push({
      sender: 'ai',
      text: newMessage.value,
      avatar: '/src/assets/AIavator.png',
    })

    scrollToBottom();

    ElMessage({
      message: '发送成功',
      type: 'success',
    })
  }).catch(() => {
    isLoading.value = false;
    ElMessage({
      message: '发送失败，请重新发送',
      type: 'error',
    })
    messages.pop();
  })
};

const scrollToBottom = () => {
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
  }
};

const handleStreamMessage = (value: string) => {
  if(messages[messages.length - 1].sender === 'user'){
    messages.push({
      sender: 'ai',
      text: newMessage.value,
      avatar: '/src/assets/AIavator.png',
    })
    return
  }
  messages[messages.length - 1].text = messages[messages.length - 1].text + value;
  scrollToBottom();
}

const initFetchES = () => {
  fetchEventSource('/api/appointment/ai-consult/connect', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'sa-token-authorization':userStore.userToken
      },
      body: JSON.stringify({
        patientId: userStore?.userInfo!.userId as number,
        appointmentId: 2,
        question: newMessage.value,
      }),
      signal: fetchsource.value?.signal,
      onmessage(ev) {
        const data = JSON.parse(ev.data);
        if(data.content === "连接已建立"){
          sessionId.value = data.sessionId;
          DoAxiosWithErro('/appointment/ai-consult/history','get',{
            sessionId: data.sessionId
          },true).then((res) => {
            console.log(res);
          })
          return
        }
        if(data.event === "message") {
          handleStreamMessage(data.content)
        }
        if(data.event === "complete") {
          isLoading.value = false;
          return
        }
      },
      onopen(response) {
      // 连接建立时的回调
      if(response.ok){
        ElMessage({
          message: '连接成功',
          type: 'success',
        })
      } else{
        ElMessage({
          message: '连接失败',
          type: 'error',
        })
      }
      },
      onerror(err) {
      // 连接出现异常时的回调
      ElMessage({
        message: '连接失败',
        type: 'error',
      })
      }
    });
}

const overAichat = (sessionId: string | null) => {
  DoAxios(`/appointment/ai-consult/end?sessionId=${sessionId}`,'post',{},true).then(() => {
    ElMessage({
      message: '聊天记录保存成功',
      type: 'success',
    })
  }).catch(() =>{
    ElMessage({
      message: '聊天记录保存失败',
      type: 'error',
    })
  })
}

onMounted(async () => {
    initFetchES();
});


onUnmounted(() => {
  if(fetchsource.value){
      fetchsource.value.abort();
    }
})
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
  .over-button{
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
  border: 4px solid #f3f3f3; /* Light grey */
  border-top: 4px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 2s linear infinite;
  margin-top: 5px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
  resize: none; /* 禁止用户手动调整大小 */
  overflow-y: auto; /* 添加滚动条 */
  min-height: 60px; /* 设置最小高度 */
  max-height: 120px; /* 设置最大高度 */
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