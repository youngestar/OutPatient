<template>
  <div class="doctor-card">
    <div class="doctor-avatar">
      <img :src="avatar" alt="医生头像" />
    </div>
    <div class="doctor-info">
      <h3 class="doctor-name">{{ name }}</h3>
      <p class="doctor-title">{{ title }}</p>
      <p class="doctor-department">{{ deptName }}</p>
      <p class="doctor-description">{{ introduction }}</p>
    </div>
    <div id="button">
      <el-button type="primary">
        预约挂号
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElButton } from 'element-plus';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  deptName: {
    type: String,
    required: true,
  },
  introduction: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
.doctor-card {
  position: relative;
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
  margin-bottom: 50px;
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

#button {
  position: absolute;
  bottom: 20px;
}
</style>
