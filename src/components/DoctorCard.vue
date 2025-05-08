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
    <div id="button" v-if="props.cardType === 'doctor'">
      <el-button type="primary" @click.stop="getSchedule()">
        获取排班
      </el-button>
    </div>
    <div id="button" v-else-if="props.cardType === 'admin'">
      <el-button type="info" @click.stop="getCrudSchedule()">
        获取排班
      </el-button>
      <el-button type="primary" @click.stop="dialogTableVisible = true">
        修改
      </el-button>
      <el-button type="danger" @click.stop="deleteDoctor(doctorId)">
        删除
      </el-button>
      <el-dialog v-model="dialogTableVisible" title="请填写医生信息" width="800">
        <DoctorForm :optionType="optionType" :doctor-id="doctorId" :user-id="userId"></DoctorForm>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElButton, ElScrollbar } from 'element-plus';
import DoctorForm from '@/components/Admin/DoctorForm.vue';
import { useHospitalStore } from '@/stores/hospitalData';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import router from '@/router';
const dialogTableVisible = ref(false);
const optionType = ref("update")
const hospitalStore = useHospitalStore();
const route = useRoute();
const props = defineProps({
  cardType: {
    type: String,
    required: true,
  },
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
  userId: {
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
      name: props.name,
      introduction: props.introduction,
      avatar: props.avatar,
    }
  })
}

const getCrudSchedule = () => {
  router.push({
    name: "crudClinicDoctorSchedule",
    params: {
      department: route.query.departmentName as string,
      clinic: route.query.clinicName as string,
      doctor: props.name
    },
    query: {
      doctorId: props.doctorId,
      clinicId: route.query.clinicId as string,
      title: props.title,
      name: props.name,
      introduction: props.introduction,
      avatar: props.avatar,
    }
  })
}

const deleteDoctor = async (doctorId: number) => {
  const res = await hospitalStore.deleteDoctor(doctorId)
  if (res) {
    ElMessage({
      message: '删除医生成功',
      type: 'success',
    })
  } else {
    ElMessage({
      message: '删除医生失败',
      type: 'error',
    })
  }
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
