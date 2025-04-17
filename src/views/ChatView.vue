<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>AI助手</h2>
    </div>
    <div class="chat-messages" ref="chatMessages">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.sender]">
        <div class="message-avatar">
          <img :src="message.avatar" alt="头像" />
        </div>
        <div class="message-content">
          <div class="message-sender">{{ message.sender === 'user' ? '你' : 'AI助手' }}</div>
          <div class="message-text">{{ message.text }}</div>
        </div>
      </div>
    </div>
    <div class="chat-input">
      <textarea
        v-model="newMessage"
        @keypress.enter="sendMessage"
        placeholder="输入消息..."
        class="textarea-field"
        rows="3"
      ></textarea>
      <button @click="sendMessage" class="send-button">发送</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { DoAxiosWithErro } from '@/api/index';
import { useUserStore } from "@/stores/user";

const messages = ref([
  {
    sender: 'ai',
    text: '你好！有什么我可以帮助你的吗？',
    avatar: '/src/assets/AIavator.png',
  },
]);

const userStore = useUserStore();

const newMessage = ref('');

const chatMessages = ref<HTMLElement | null>(null);
const sessionId = ref<number | null>(null);

const sendMessage = () => {
  if (newMessage.value.trim() === '') return;

  // 添加用户消息
  messages.value.push({
    sender: 'user',
    text: newMessage.value,
    avatar: '/src/assets//me.png',
  });

  // 清空输入框
  newMessage.value = '';

  // 滚动到底部
  scrollToBottom();

  // 模拟AI回复
  setTimeout(() => {
    const aiResponses = [
      '我明白了，你想要了解什么？',
      '好的，我正在处理你的请求。',
      '请提供更多信息，我会尽力帮助你。',
      '看起来你有一个很好的问题！',
      '我正在思考如何最好地回答你的问题。',
    ];

    // 随机选择一个AI回复
    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

    messages.value.push({
      sender: 'ai',
      text: randomResponse,
      avatar: '/src/assets/AIavator.png',
    });

    scrollToBottom();
  }, 1000);
};

const scrollToBottom = () => {
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
  }
};

onMounted(() => {
  DoAxiosWithErro('/api/appointment/ai-consult/connect','post',{
    sessionId:sessionId.value,
    appointmentId:388,
    patientId: userStore.userInfo.patientId as number | null,
  },true).then((res)=>{
    console.log(res)
  });
  scrollToBottom();
});
</script>

<style scoped>
.chat-container {
  width: 100%;
  height: 100%;
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
  text-align: center;
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

.send-button:hover {
  background-color: #3a5bd9;
}
</style>