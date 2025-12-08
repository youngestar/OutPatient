<template>
  <div id="card" class="light-shadow cardHover">
    <h2>患者信息</h2>
    <div id="main-msg">
      <div class="left">
        <p><span class="label">序号:</span><span class="detail">{{ appointmentId }}</span></p>
        <p><span class="label">病历号:</span><span class="detail">{{ scheduleId }}</span></p>
        <p><span class="label">病人姓名:</span><span class="detail">{{ patientName }}</span></p>
        <p><span class="label">是否初诊:</span><el-tag class="detail" type="warning">{{ isRevisit === 0 ? "是" : "否"
        }}</el-tag></p>
        <p><span class="label">就诊状态:</span><el-tag class="detail" type="warning">{{ status === 0 ? "待就诊" : status === 1
          ? "已就诊" : status === 2 ? "已取消" : "出错了"
            }}</el-tag></p>
      </div>
      <div class="right">
        <p><span class="label">挂号时间:</span><span class="detail">{{ appointmentDate }}</span></p>
        <p><span class="label">科室名:</span><span class="detail">{{ deptName }}</span></p>
        <p><span class="label">诊室名:</span><span class="detail">{{ clinicName }}</span></p>
        <p><span class="label">就诊医生:</span><span class="detail">{{ doctorName }}</span></p>
      </div>
    </div>
    <p><span class="label">备注:</span><span class="detail">{{ statusDesc }}</span></p>
  </div>
</template>
<script setup lang="ts">
import { defineProps } from "vue";
import { ElTag, } from "element-plus";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  appointmentId: {
    type: String,
    required: true,
<<<<<<< HEAD
    default: "",
=======
    default: "1",
>>>>>>> 1add95f6ae00358a3bcfe1bd651114acffb4ef55
  },
  scheduleId: {
    type: String,
    required: true,
    default: "001",
  },
  patientName: {
    type: String,
    required: true,
    default: "默认患者",
  },
  isRevisit: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: Number,
    required: true,
    default: 18,
  },
  description: {
    type: String,
    required: true,
    default: "请阐释症状,例:患者头部发热",
  },
  appointmentDate: {
    type: String,
    required: true,
    default: "2025-05-01",
  },
  deptName: {
    type: String,
    required: true,
    default: "内科",
  },
  clinicName: {
    type: String,
    required: true,
    default: "门诊1",
  },
  doctorName: {
    type: String,
    required: true,
    default: "待执行",
  },
  statusDesc: {
    type: String,
    required: true,
    default: "无",
  },
});
</script>

<style lang="scss" scoped>
#card {
  float: left;
  min-height: 200px;
  width: 42%;
  margin: 10px 2%;
  min-width: 400px;
  padding: 20px;
  background: vars.$card-bg-depart;
  border-radius: 10px;
  color: #303133;
  cursor: pointer;

  h2 {
    border-bottom: 1px solid black;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  #main-msg {
    display: flex;

    .right {
      margin-left: 20%;
    }
  }

  p {
    display: flex;
    margin: 5px 0;

    .label {
      width: 70px;
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
