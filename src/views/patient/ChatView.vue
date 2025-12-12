<template>
  <div v-loading="isLoading" style="width: 100%; height: 100%">
    <!-- 预约列表 -->
    <div class="listContainer" v-if="!isShowChat">
      <section class="appointment-panel">
        <header class="panel-header">
          <div>
            <p class="eyebrow">AI 咨询预约</p>
            <h2>挂号记录</h2>
          </div>
          <el-button type="primary" plain @click="getAppoimentList" :loading="isLoading">刷新列表</el-button>
        </header>
        <el-card class="table-shell" shadow="never">
          <el-table v-if="appoimentList.length > 0" :data="appoimentList">
            <el-table-column prop="appointmentId" label="预约ID" min-width="140" />
            <el-table-column prop="doctorName" label="医生" min-width="120" />
            <el-table-column prop="deptName" label="科室" min-width="120" />
            <el-table-column prop="clinicName" label="诊室" min-width="120" />
            <el-table-column prop="appointmentDate" label="日期" min-width="130" />
            <el-table-column prop="timeSlot" label="时间段" min-width="130" />
            <el-table-column prop="statusDesc" label="状态" min-width="110" />
            <el-table-column label="操作" min-width="140">
              <template #default="scope">
                <el-button size="small" type="primary" :disabled="scope.row.status !== 0"
                  @click="handleAiConsult(scope.row.appointmentId)">AI 咨询</el-button>
              </template>
            </el-table-column>
            <el-table-column label="取消" min-width="120">
              <template #default="scope">
                <el-button size="small" type="danger" plain :disabled="scope.row.status !== 0"
                  @click="cancelAppoiment(scope.row.appointmentId)">取消预约</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-else description="暂无预约记录" />
        </el-card>
      </section>
    </div>

    <!-- Ai助手界面 -->
    <div v-if="isShowChat" style="width: 100%; height: 100%">
      <el-button style="margin: 1rem;" @click="isShowChat = false">返回</el-button>
      <ChatView :could-send="true" :appoiment-id="appoimentId"></ChatView>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ChatView from '@/views/ChatView.vue';
import { DoAxiosWithErro } from '@/api';
import { useUserStore } from '@/stores/user';
import { onMounted, reactive, ref } from 'vue';

type AppointmentType = {
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  deptId: string | null; // 允许 deptId 为 null
  deptName: string;
  clinicId: string | null; // 允许 clinicId 为 null
  clinicName: string;
  scheduleId: string;
  appointmentDate: string; // 格式为 'YYYY-MM-DD'
  timeSlot: string; // 格式为 'HH:MM-HH:MM'
  isRevisit: 0 | 1; // 是否复诊，0 表示否，1 表示是
  status: 0 | 1 | 2 | 3; // 状态码，具体含义需要根据业务定义
  statusDesc: string; // 状态描述
  canCancel: boolean; // 是否可以取消预约
  aiConsultSessionId: string | null; // AI 咨询会话 ID，允许为 null
  createTime: string; // 创建时间，格式为 'YYYY-MM-DDTHH:MM:SS'
};

const isLoading = ref(false);
const isShowChat = ref(false);
const userStore = useUserStore();
const patientId = userStore.userInfo!.patientId;

const appoimentId = ref('');
const appoimentList = reactive(<AppointmentType[]>[]);

const getAppoimentList = () => {
  isLoading.value = true;
  appoimentList.splice(0, appoimentList.length)
  DoAxiosWithErro<AppointmentType[]>(
    '/appointment/patient',
    'get',
    { patientId },
    true,
    false
  )
    .then((res) => {
      appoimentList.splice(0, appoimentList.length, ...res)
    })
    .finally(() => {
      isLoading.value = false;
    })
}

const handleAiConsult = (appointmentId: string) => {
  isShowChat.value = true;
  appoimentId.value = appointmentId;
};

const cancelAppoiment = (id: string) => {
  DoAxiosWithErro(
    '/appointment/cancel',
    'post',
    { appointmentId: id, patientId },
    true,
    true
  )
    .then(() => {
      getAppoimentList();
    })
    .finally(() => {
      isLoading.value = false;
    })
}

onMounted(() => {

  getAppoimentList();
})

</script>

<style></style>
<style lang="scss" scoped>
.listContainer {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
}

.appointment-panel {
  width: 100%;
  background: var(--color-surface, #fff);
  border-radius: 20px;
  padding: 1.75rem 2rem;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  h2 {
    margin: 0.3rem 0;
    font-size: 1.8rem;
    color: var(--color-text, #1f2933);
  }

  .eyebrow {
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-text-muted, #94a3b8);
    font-size: 0.8rem;
    margin: 0;
  }

  .subtext {
    margin: 0;
    color: var(--color-text-muted, #64748b);
  }
}

.table-shell {
  border-radius: 16px;
  overflow: hidden;

  :deep(.el-table) {
    font-size: 0.95rem;
  }

  :deep(.el-table__header-wrapper th) {
    background: #f8fafc;
    color: #475569;
    font-weight: 600;
  }
}

@media (max-width: 768px) {
  .appointment-panel {
    padding: 1.25rem;
  }

  .panel-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .listContainer {
    padding: 1rem;
  }
}
</style>
