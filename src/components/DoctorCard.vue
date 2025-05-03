<template>
  <div class="doctor-card">
    <div class="doctor-avatar">
      <img :src="avatar" alt="医生头像" />
    </div>
    <div class="doctor-info">
      <h3 class="doctor-name">{{ name }}</h3>
      <p class="doctor-title">{{ title }}</p>
      <p class="doctor-department">{{ deptName }}</p>
      <el-scrollbar height="250px">
        <p class="doctor-description">{{ introduction }}</p>
      </el-scrollbar>
    </div>
    <div id="button">
      <el-button type="primary" @click.stop="getSchedule()">
        获取排班
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElButton, ElScrollbar } from 'element-plus';
import { useRoute } from 'vue-router';
import router from '@/router';
const route = useRoute();
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
  doctorId: {
    type: Number,
    required: true,
  },
})

const getSchedule = () => {
  router.push({
    name: "clinicDoctorSchedule",
    params: {
      department: route.query.departmentName as string,
      clinic: route.query.clinicName as string,
      doctor: props.name
    },
    query: {
      doctorId: props.doctorId,
      title: props.title,
    }
  })
}

</script>

<style lang="scss" scoped>
.doctor-card {
  position: relative;
  height: 500px;
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
