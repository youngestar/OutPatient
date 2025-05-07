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
          <el-button type="primary" size="large" @click="updateSchedule">
            更新排班
          </el-button>
          <el-dialog v-model="scheduleDialogTableVisible" title="请填写排班信息" width="800">
            <ScheduleForm :optionType="optionType" :clinicId="route.query.clinicId" :doctorId="route.query.doctorId">
            </ScheduleForm>
          </el-dialog>
          <el-button type="danger" size="large" @click="deleteSchedule">
            取消排班
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, type Ref, defineProps, onMounted } from 'vue';
import { ElAvatar, ElMessage, ElDialog } from 'element-plus';
import { createRegistrations } from '@/api/patient/registrations';
import type { UserInfo } from '@/stores/user';
import { useHospitalStore } from '@/stores/hospitalData';
import { useRoute } from 'vue-router';
import ScheduleForm from '@/components/Admin/ScheduleForm.vue';

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

const props = defineProps({
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

const route = useRoute();
const hospitalStore = useHospitalStore();
const scheduleDialogTableVisible = ref(false);
const optionType = ref('update');

const createSchedule = async () => {
  try {
    const res = await createRegistrations(user.value.patientId, props.scheduleId)
    if (res) {
      ElMessage.success('预约成功')
    } else {
      ElMessage.error('预约失败, 您是否已经预约过该时段?')
    }
  } catch (error) {
    ElMessage.error('预约失败, 请稍后再试')
    throw error
  }

}

const updateSchedule = () => {
  optionType.value = "update"
  scheduleDialogTableVisible.value = true
}

const deleteSchedule = async () => {
  const res = await hospitalStore.deleteSchedule(props.scheduleId)
  if (res) {
    ElMessage.success('删除排班成功')
  } else {
    ElMessage.error('删除排班失败')
  }
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
