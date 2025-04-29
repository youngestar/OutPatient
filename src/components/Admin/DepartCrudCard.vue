<template>
  <div class="department-card">
    <h3 class="department-title">{{ props.name }}</h3>
    <div class="department-content">
      <p v-if="props.state === 0" style="color:#FF3B30; font-weight: bold;">暂时关闭</p>
      <p v-else-if="props.state === 1" style="font-weight: bold;">
        正常开放</p>
      <p v-else>发生故障</p>
    </div>
    <div id="btns">
      <el-button type="primary" @click.stop="updateName">修改</el-button>
      <el-button type="danger" @click.stop="deleteItem">删除</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useHospitalStore } from '@/stores/hospitalData';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';

const route = useRoute();
const hospitalStore = useHospitalStore();
const updateName = async () => {
  const newName = prompt('请输入新科室的名称', props.name);
  if (!newName) {
    return;
  }
  if (!route.query.departmentId) {
    await hospitalStore.updateDepart(props.id, newName);
  } else {
    await hospitalStore.updateClinic(props.id, newName);
  }
  ElMessage({
    message: '修改成功',
    type: 'success',
  });
}

const deleteItem = async () => {
  if (!route.query.departmentId) {
    await hospitalStore.deleteDepart(props.id);
  } else {
    await hospitalStore.deleteClinic(props.id);
  }
  ElMessage({
    message: '删除成功',
    type: 'success',
  })
}
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  state: {
    type: Number,
    required: true
  },
  id: {
    type: Number,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.department-card {
  cursor: pointer;
  width: 300px;
  height: 200px;
  background: vars.$card-bg-depart;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.department-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #303133;
  text-align: center;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
}

.department-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #606266;
}

#btns {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
