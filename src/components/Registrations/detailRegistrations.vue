<script setup lang="ts">
import { reactive } from 'vue';

const patientData = reactive({
  num: '1',
  name: '默认患者',
  gender: '男',
  age: 18,
  id: '001',
  description: '请阐释症状,例:患者头部发热',
  registerTime: '2025-05-01',
  department: '内科',
  clinicRoom: '门诊1',
  state: '待执行',
  note: '无',
});
</script>

<template>
  <div id="detail-registrations">
    <div id="card">
      <h2>患者信息</h2>
      <div id="main-msg">
        <div class="left">
          <h3>详细信息</h3>
          <p><span class="label">当前序号:</span><span class="detail">{{ patientData.num }}</span></p>
          <p><span class="label">姓名:</span><span class="detail">{{ patientData.name }}</span></p>
          <p><span class="label">性别:</span><span class="detail">{{ patientData.gender }}</span></p>
          <p><span class="label">年龄:</span><span class="detail">{{ patientData.age }}</span></p>
          <p><span class="label">病历号:</span><span class="detail">{{ patientData.id }}</span></p>
          <p><span class="label">挂号时间:</span><span class="detail">{{ patientData.registerTime }}</span></p>
          <p><span class="label">科室名:</span><span class="detail">{{ patientData.department }}</span></p>
          <p><span class="label">诊室名:</span><span class="detail">{{ patientData.clinicRoom }}</span></p>
          <p><span class="label">当前状态:</span><el-tag class="detail" type="warning">{{ patientData.state }}</el-tag></p>
          <p><span class="label">备注:</span><span class="detail">{{ patientData.note }}</span></p>
          <p><span class="label">症状:</span><span class="detail">{{ patientData.description }}</span></p>
        </div>
        <div class="right">
          <h3>对话历史</h3>
          <p><span class="label">当前序号:</span><span class="detail">{{ patientData.num }}</span></p>
          <p><span class="label">姓名:</span><span class="detail">{{ patientData.name }}</span></p>
          <p><span class="label">性别:</span><span class="detail">{{ patientData.gender }}</span></p>
          <p><span class="label">年龄:</span><span class="detail">{{ patientData.age }}</span></p>
          <p><span class="label">病历号:</span><span class="detail">{{ patientData.id }}</span></p>
          <p><span class="label">挂号时间:</span><span class="detail">{{ patientData.registerTime }}</span></p>
          <p><span class="label">科室名:</span><span class="detail">{{ patientData.department }}</span></p>
          <p><span class="label">诊室名:</span><span class="detail">{{ patientData.clinicRoom }}</span></p>
          <p><span class="label">当前状态:</span><el-tag class="detail" type="warning">{{ patientData.state }}</el-tag></p>
          <p><span class="label">备注:</span><span class="detail">{{ patientData.note }}</span></p>
          <p><span class="label">症状:</span><span class="detail">{{ patientData.description }}</span></p>
        </div>
        <div class="bottom">
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

    .right {
      margin-left: 30%;
    }
  }

  p {
    display: flex;
    margin: 1px 0;

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
