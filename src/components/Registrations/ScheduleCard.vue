<template>
  <div id="card" class="light-shadow cardHover">
    <h2>号源信息</h2>
    <el-avatar id="avatar" :size="120" :src="props.doctorAvatar ? props.doctorAvatar : '/src/assets/doctor.png'">
    </el-avatar>
    <div id="main-msg">
      <div class="left">
        <p><span class="label">医生编号:</span><span class="detail">{{ props.doctorId }}</span></p>
        <p><span class="label">医生名:</span><span class="detail">{{ props.doctorName
            }}</span></p>
        <p><span class="label">挂号序号:</span><span class="detail">{{ props.scheduleId }}</span></p>
        <p><span class="label">是否可预约:</span><span class="detail"><el-tag class="detail" size="large" type="warning">{{
          props.canBook
            === true ? '是' : '否'
              }} </el-tag></span></p>
      </div>
      <div class="right">
        <p><span class="label">医生职称:</span><span class="detail">{{ props.doctorTitle }}</span></p>
        <p><span class="label">剩余号源:</span><span class="detail">{{ props.remainingQuota }}</span></p>
        <!-- <p><span class="label">诊室名:</span><span class="detail">{{ props.doctorIntroduction }}</span></p> -->
        <p><span class="label">挂号日期:</span><span class="detail">{{ props.scheduleDate }}</span></p>
        <p><span class="label">时间段:</span><span class="detail">{{ props.timeSlot }}</span></p>
        <div id="btn" v-if="props.cardType === 'doctor'">
          <el-button type="info" size="large" @click="createSchedule" :disabled="!props.canBook">
            立即预约
          </el-button>
        </div>
        <div id="btn" v-else-if="props.cardType === 'admin'">
          <el-button type="primary" size="large">
            更新排班
          </el-button>
          <el-button type="danger" size="large">
            取消排班
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type schedule } from '@/api/patient/registrations';
import { ref, type Ref, defineProps, onMounted } from 'vue';
import { ElAvatar } from 'element-plus';
import { createRegistrations } from '@/api/patient/registrations';
import type { UserInfo } from '@/stores/user';
const user: Ref<UserInfo> = ref({
  userId: 0,
  patientId: 0,
  username: '',
  email: '',
  phone: '',
  avatar: '',
  name: '',
  gender: 0,
  age: 0,
  idCard: '',
  region: '',
  address: '',
  role: 0,
  createTime: '',
  updateTime: '',
  token: '',
});
const props: schedule = defineProps({
  cardType: {
    type: String,
    required: true,
  },
  scheduleId: {
    type: Number,
    required: true,
  },
  doctorId: {
    type: Number,
    required: true,
  },
  doctorName: {
    type: String,
    required: true,
  },
  doctorTitle: {
    type: String,
    required: true,
  },
  doctorIntroduction: {
    type: String,
    required: true,
  },
  doctorAvatar: {
    type: String,
    required: true,
  },
  scheduleDate: {
    type: String,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  remainingQuota: {
    type: Number,
    required: true,
  },
  canBook: {
    type: Boolean,
    required: true,
  }
});

const createSchedule = () => {
  createRegistrations(user.value.patientId, props.scheduleId)
}

onMounted(() => {
  const userInfoString = localStorage.getItem('userInfo');
  if (userInfoString) {
    user.value = JSON.parse(userInfoString) as UserInfo;
  }
})
</script>

<style lang="scss" scoped>
#card {
  float: left;
  min-height: 200px;
  width: 95%;
  margin: 10px 5%;
  min-width: 400px;
  padding: 20px;
  background: vars.$card-bg-depart;
  border-radius: 10px;
  color: #303133;

  h2 {
    border-bottom: 1px solid black;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  #avatar {
    float: left;
    margin: 40px;
  }

  #main-msg {
    display: flex;
    justify-content: space-between;
    width: 75%;
  }

  p {
    display: flex;
    margin: 10px 0;
    font-size: 20px;

    .label {
      width: 150px;
      font-weight: bolder;
      text-align: left;
    }

    .detail {
      font-weight: bold;
      margin-left: 20px;
      color: #606266;
    }
  }

  #btn {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
}
</style>
