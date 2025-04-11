<template>
    <div class="doctor-card">
      <div class="doctor-avatar">
        <img src="https://via.placeholder.com/100" alt="医生头像" />
      </div>
      <div class="doctor-info">
        <h3 class="doctor-name">张医生</h3>
        <p class="doctor-title">主任医师</p>
        <p class="doctor-department">心内科</p>
        <p class="doctor-description">擅长心血管疾病的诊断与治疗</p>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  // 这里可以添加逻辑代码，例如从API获取医生信息
  </script>
  
  <style lang="scss" scoped>
  .doctor-card {
    width: 300px;
    background: vars.$card-bg-doctor;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .doctor-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 16px;
  }
  
  .doctor-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .doctor-info {
    text-align: center;
    width: 100%;
  }
  
  .doctor-name {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 4px;
    color: #303133;
  }
  
  .doctor-title {
    font-size: 14px;
    color: #606266;
    margin-bottom: 4px;
  }
  
  .doctor-department {
    font-size: 14px;
    color: #606266;
    margin-bottom: 8px;
  }
  
  .doctor-description {
    font-size: 12px;
    color: #909399;
    line-height: 1.5;
  }
  </style>