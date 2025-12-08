<template>
  <div v-loading="isLoading" style="width: 100%; height: 100%">
    <!-- 预约列表 -->
    <div class="listContainer" v-if="!isShowChat">
      <el-table v-if="appoimentList.length > 0" :data="appoimentList" style="width: 100%">
        <el-table-column prop="appointmentId" label="预约ID" style="flex: 1" />
        <el-table-column prop="patientName" label="患者姓名" style="flex: 1" />
        <el-table-column prop="doctorName" label="医生姓名" style="flex: 1" />
        <el-table-column prop="deptName" label="科室" style="flex: 1" />
        <el-table-column prop="clinicName" label="诊所" style="flex: 1" />
        <el-table-column prop="appointmentDate" label="预约日期" style="flex: 1" />
        <el-table-column prop="timeSlot" label="时间段" style="flex: 1" />
        <el-table-column prop="statusDesc" label="状态" style="flex: 1" />
        <el-table-column label="操作" style="flex: 1">
          <template #default="scope">
            <el-button :disabled="scope.row.status !== 0"
              @click="isShowChat = true; appoimentId = scope.row.appointmentId">AI咨询</el-button>
          </template>
        </el-table-column>
        <el-table-column label="取消操作" style="flex: 1">
          <template #default="scope">
            <el-button :disabled="scope.row.status !== 0"
              @click="cancelAppoiment(scope.row.appointmentId)">取消预约</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-else description="暂无预约记录"></el-empty>
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
