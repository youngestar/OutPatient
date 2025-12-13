<template>
  <div class="department-card" @click="emit('click')">
    <h3 class="department-title">{{ props.name }}</h3>
    <div class="department-content">
      <p v-if="props.state === 0" style="color:#FF3B30; font-weight: bold;">暂时关闭</p>
      <p v-else-if="props.state === 1" style="font-weight: bold;">
        正常开放</p>
      <p v-else>发生故障</p>
    </div>
    <div id="btns" v-if="props.cardType === 'admin'">
      <el-button type="success" @click.stop="() => { timeTableVisible = true; }"
        v-if="route.query.departmentId">自动排班</el-button>
      <el-button type="primary" @click.stop="updateName">修改</el-button>
      <el-button type="danger" @click.stop="deleteItem">删除</el-button>
    </div>
  </div>
  <el-dialog v-model="timeTableVisible" title="请填写选择排班时间信息" width="800">
    <TimeForm optionType="autoUpdate" @autoUpdate="autoUpdate"></TimeForm>
  </el-dialog>
</template>

<script lang="ts" setup>
import TimeForm from './TimeForm.vue';
import { ref } from 'vue';
import { useHospitalStore } from '@/stores/hospitalData';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute } from 'vue-router';
import { autoUpdateSchedules } from '@/api/admin/registrations';

const route = useRoute();
const hospitalStore = useHospitalStore();
const timeTableVisible = ref(false);
const emit = defineEmits(['click']);
const props = defineProps({
  cardType: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  state: {
    type: Number,
    required: true
  },
  id: {
    type: String,
    required: true
  }
})

const resolveDepartmentId = (): string | undefined => {
  const deptId = route.query.departmentId;
  if (Array.isArray(deptId)) {
    const firstValue = deptId[0];
    return typeof firstValue === 'string' && firstValue.length > 0 ? firstValue : undefined;
  }
  return typeof deptId === 'string' && deptId.length > 0 ? deptId : undefined;
};
const autoUpdate = async (startDate: string, endDate: string) => {
  const res = await autoUpdateSchedules(startDate, endDate, props.id);
  if (res) {
    ElMessage({
      message: `时段${startDate}-${endDate}的排班已自动创建`,
      type: 'success',
    });
  }
}
const updateName = async () => {
  let newName = '';
  try {
    const res = await ElMessageBox.prompt('请输入新名称', '修改名称', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue: props.name,
      inputPlaceholder: '请输入名称',
    });
    newName = res.value.trim();
  } catch {
    return;
  }
  if (!newName) return;

  const departmentId = resolveDepartmentId();
  if (!departmentId) {
    await hospitalStore.updateDepart(props.id, newName);
  } else {
    await hospitalStore.updateClinic(props.id, newName, departmentId);
  }
  ElMessage({
    message: '修改成功',
    type: 'success',
  });
}

const deleteItem = async () => {
  const departmentId = resolveDepartmentId();
  try {
    const targetLabel = departmentId ? '门诊' : '科室';
    await ElMessageBox.confirm(`确定要删除${targetLabel}“${props.name}”吗？此操作不可恢复。`, '删除确认', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    });
  } catch {
    return;
  }
  if (!departmentId) {
    await hospitalStore.deleteDepart(props.id);
  } else {
    await hospitalStore.deleteClinic(props.id, departmentId);
  }
  ElMessage({
    message: '删除成功',
    type: 'success',
  })
}
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
