<template>
    <div class="chat-container">
      <div class="chat-header">
        <h2>医患交流</h2>
      </div>
      <div class="chat-messages" ref="chatMessages">
        <div v-for="(message, index) in messages" :key="index" :class="['message', message.sender]">
          <div class="message-avatar">
            <img :src="message.avatar" alt="头像" />
          </div>
          <div class="message-content">
            <div class="message-sender">{{ message.sender === 'patient' ? '患者' : '医生' }}</div>
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
  
  const messages = ref([
    {
      sender: 'doctor',
      text: '您好！请问有什么可以帮助您的吗？',
      avatar: '/src/assets/doctor.png',
    },
  ]);
  
  const newMessage = ref('');
  const chatMessages = ref<HTMLElement | null>(null);
  
  const sendMessage = () => {
    if (newMessage.value.trim() === '') return;
  
    // 添加患者消息
    messages.value.push({
      sender: 'patient',
      text: newMessage.value,
      avatar: '/src/assets/me.png',
    });
  
    // 清空输入框
    newMessage.value = '';
  
    // 滚动到底部
    scrollToBottom();
  
    // 模拟医生回复
    setTimeout(() => {
      const doctorResponses = [
        '我明白了，您目前的症状是什么？',
        '好的，我正在分析您的情况。',
        '建议您尽快来医院进行详细检查。',
        '请告诉我您的具体症状和持续时间。',
        '我正在为您准备进一步的建议。',
      ];
  
      // 随机选择一个医生回复
      const randomResponse = doctorResponses[Math.floor(Math.random() * doctorResponses.length)];
  
      messages.value.push({
        sender: 'doctor',
        text: randomResponse,
        avatar: '/src/assets/doctor.png',
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
    scrollToBottom();
  });
  </script>
  
  <style scoped>
  .chat-container {
    width: 100%;
    max-width: 600px;
    height: 600px;
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
  
  .message.patient {
    justify-content: flex-end;
  }
  
  .message.patient .message-avatar {
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
  
  .message.patient .message-content {
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
    overflow-y: auto;
    min-height: 60px;
    max-height: 120px;
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