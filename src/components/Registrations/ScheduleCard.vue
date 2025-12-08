<template>
  <article class="schedule-card surface-card">
    <header class="schedule-card__header">
      <div class="schedule-card__title">
        <p class="eyebrow">号源信息 · 编号 {{ props.scheduleId }}</p>
        <h3>{{ props.doctorName }}</h3>
        <p class="subtitle">{{ props.doctorTitle }}</p>
      </div>
      <div class="schedule-card__quota">
        <span class="status-pill" :class="props.canBook ? 'is-success' : 'is-warning'">
          {{ props.canBook ? '可预约' : '不可预约' }}
        </span>
        <strong>{{ props.remainingQuota }}</strong>
        <small>剩余号源</small>
      </div>
    </header>

    <div class="schedule-card__body">
      <el-avatar class="schedule-card__avatar" :size="96"
        :src="props.doctorAvatar ? props.doctorAvatar : '/src/assets/doctor.png'" />
      <div class="schedule-card__info-grid">
        <div class="info-row">
          <span class="label">医生编号</span>
          <span class="value">{{ props.doctorId }}</span>
        </div>
        <div class="info-row">
          <span class="label">挂号日期</span>
          <span class="value">{{ props.scheduleDate }}</span>
        </div>
        <div class="info-row">
          <span class="label">时间段</span>
          <span class="value">{{ props.timeSlot }}</span>
        </div>
        <div class="info-row">
          <span class="label">职称</span>
          <span class="value">{{ props.doctorTitle }}</span>
        </div>
        <div class="info-row" v-if="props.doctorIntroduction">
          <span class="label">简介</span>
          <span class="value muted">{{ props.doctorIntroduction }}</span>
        </div>
      </div>
    </div>

    <footer class="schedule-card__actions" v-if="props.cardType === 'doctor'">
      <el-button type="primary" size="large" @click="createSchedule" :disabled="!props.canBook">
        立即预约
      </el-button>
    </footer>
    <footer class="schedule-card__actions" v-else-if="props.cardType === 'admin'">
      <div class="admin-actions">
        <el-button type="primary" size="large" @click="updateSchedule">
          更新排班
        </el-button>
        <el-button type="danger" size="large" @click="deleteSchedule">
          取消排班
        </el-button>
      </div>
      <el-dialog v-model="scheduleDialogTableVisible" title="请填写排班信息" width="800">
        <ScheduleForm @submit="adminUpdateSchedule" :optionType="optionType" :clinicId="route.query.clinicId"
          :doctorId="route.query.doctorId" :scheduleId="props.scheduleId">
        </ScheduleForm>
      </el-dialog>
    </footer>
  </article>
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
    const res = await createRegistrations(user.value.patientId, props.scheduleId);
    if (res) {
      ElMessage.success('预约成功');
    }
  } catch (error) {
    ElMessage.error('预约失败，请稍后重试');
    console.error(error);
  }
}

const updateSchedule = () => {
  optionType.value = "update"
  scheduleDialogTableVisible.value = true
}

const adminUpdateSchedule = async (submitData) => {
  console.log(props)
  const res = await hospitalStore.updateSchedule(
    props.scheduleId,
    props.doctorId,
    route.query.clinicId,
    submitData.scheduleDate,
    submitData.timeSlot,
    submitData.maxPatients,
    submitData.currentPatients,
    submitData.status,
    route.query.name,
    route.query.title,
    route.query.introduction,
    route.query.avatar,
  )
  if (res) {
    ElMessage.success('排班设置更新成功')
  }
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
.schedule-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.schedule-card__header {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.schedule-card__title h3 {
  margin: 4px 0;
  font-size: 24px;
  color: var(--color-text);
}

.schedule-card__title .subtitle {
  color: var(--color-text-muted);
  margin-top: 2px;
}

.eyebrow {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.schedule-card__quota {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-items: flex-end;
}

.schedule-card__quota strong {
  font-size: 28px;
  color: var(--color-text);
  line-height: 1;
}

.schedule-card__quota small {
  color: var(--color-text-muted);
}

.schedule-card__body {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-4);
  align-items: center;
}

.schedule-card__avatar {
  border: 4px solid var(--color-primary-soft);
}

.schedule-card__info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-3);
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
}

.value {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
}

.value.muted {
  font-weight: 400;
  color: var(--color-text-muted);
}

.schedule-card__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}

.admin-actions {
  display: flex;
  gap: var(--space-3);
}

@media (max-width: 640px) {
  .schedule-card__body {
    grid-template-columns: 1fr;
  }

  .schedule-card__quota {
    align-items: flex-start;
    text-align: left;
  }
}
</style>
