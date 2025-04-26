<script setup lang="ts">
import { onMounted, reactive, type Reactive, ref } from 'vue';
import { doctorGetDetailRegistration } from '@/api/doctor/registrations';
import { useRoute } from 'vue-router';
import { ElTag, ElButton } from 'element-plus';
import { type detailRegistration } from '@/api/doctor/registrations';
import ChatView from '@/views/ChatView.vue';

const patientData: Reactive<detailRegistration> = reactive({
  doctorId: 0,
  appointmentId: 0,
  scheduleId: "无",
  patientName: "无",
  isRevisit: 0,
  status: 0,
  description: "无",
  appointmentDate: "无",
  deptName: "无",
  clinicName: "无",
  doctorName: "无",
  statusDesc: "无",
  aiConsultSessionId: "无",
});
const loading = ref(true);
const route = useRoute();

onMounted(async () => {
  const newPatientData = await doctorGetDetailRegistration(route.query.doctorId, route.query.appointmentId);
  Object.assign(patientData, newPatientData);
  loading.value = false;
})
</script>

<template>
  <div id="detail-registrations">
    <div id="card" v-loading="loading">
      <h2>患者信息</h2>
      <div id="main-msg">
        <div class="left">
          <h3 style="font-size: 30px;">详细信息</h3>
          <p><span class="label">序号:</span><span class="detail">{{ patientData.appointmentId }}</span></p>
          <p><span class="label">病历号:</span><span class="detail">{{ patientData.scheduleId }}</span></p>
          <p><span class="label">病人姓名:</span><span class="detail">{{ patientData.patientName }}</span></p>
          <p><span class="label">是否初诊:</span><el-tag class="detail" type="warning">{{ patientData.isRevisit === 0 ? "是"
            : "否"
              }}</el-tag></p>
          <p><span class="label">就诊状态:</span><el-tag class="detail" type="warning">{{ patientData.status === 0 ? "待就诊" :
            patientData.status ===
              1
              ? "已就诊" : patientData.status === 2 ? "已取消" : "出错了"
              }}</el-tag></p>
          <p><span class="label">挂号时间:</span><span class="detail">{{ patientData.appointmentDate }}</span></p>
          <p><span class="label">科室名:</span><span class="detail">{{ patientData.deptName }}</span></p>
          <p><span class="label">诊室名:</span><span class="detail">{{ patientData.clinicName }}</span></p>
          <p><span class="label">就诊医生:</span><span class="detail">{{ patientData.doctorName }}</span></p>
          <div class="bottom">
            <el-button type="success">完成就诊</el-button>
            <el-button type="danger">取消就诊</el-button>
          </div>
        </div>
        <div class="right">
          <h3 style="font-size: 30px;">对话历史</h3>
          <chat-view :appointmentId="1" :couldSend="false"></chat-view>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#card {
  float: left;
  min-height: 720px;
  width: 96.5%;
  min-width: 400px;
  padding: 20px;
  background: vars.$card-bg-depart;
  border-radius: 10px;
  color: #303133;

  h2 {
    border-bottom: 1px solid black;
    padding-bottom: 10px;
    margin-bottom: 10px;
    font-size: 40px;
  }

  #main-msg {
    display: flex;

    .left {
      font-size: large;
      width: 30%;
    }

    .right {
      margin-left: 30%;
    }
  }

  .bottom {
    margin: 0 auto;
    margin-top: 150px;
    display: flex;
    justify-content: space-between;

    .el-button {
      width: 90px;
      height: 30px;
      font-size: 15px;
    }
  }

  p {
    display: flex;
    margin: 10px 0;

    .label {
      width: 120px;
      text-align: left;
    }

    .detail {
      font-weight: bold;
      margin-left: 20px;
      color: #606266;
    }
  }
}
</style>
