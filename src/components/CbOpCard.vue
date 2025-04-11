<template>
    <div class="department-card">
      <h3 class="department-title">{{ props.depart.name }}</h3>
      <div class="department-content">
        <p>{{ props.depart.desc }}</p>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  // 这里可以添加逻辑代码

  const props = defineProps({
    depart: {
      type: Object,
      required: true
    },
  })
  </script>
  
  <style lang="scss" scoped>
  .department-card {
    width: 20%;
    height: 25%;
    background: vars.$card-bg-depart;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 16px;
    display: flex;
    flex-direction: column;
  }
  
  .department-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 12px;
    color: #303133;
    text-align: center;
    border-bottom: 1px solid #e4e7ed;
    padding-bottom: 8px;
  }
  
  .department-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #606266;
  }
  </style>