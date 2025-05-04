<template>
  <div class="ap-top">
    <div id="patient">
      <el-button type="primary" @click="backpage" v-show="route.params.department">上一级</el-button>
      <div v-if="route.query.departmentId && !route.query.doctorId" id="searchInput"
        style="position: relative; bottom: 2.5px;">
        <el-input v-model="searchContent" style="width: 240px;height: 40px;"
          :placeholder="route.query.clinicId ? '在全部医生中搜索' : '在全部门诊中搜索'" :prefix-icon="Search"
          @keyup.enter="handleSearch" />
        <el-button type="primary" style="height: 40px;" @click="handleSearch">
          <el-icon size="large">
            <Search />
          </el-icon>
        </el-button>
      </div>
    </div>
    <div id="admin" v-if="props.cardType === 'admin'">
      <el-button type="primary" @click="createNewItem">添加</el-button>
    </div>
  </div>
  <el-dialog v-model="doctorDialogTableVisible" title="请填写医生信息" width="800">
    <DoctorForm :optionType="optionType"></DoctorForm>
  </el-dialog>
  <el-dialog v-model="scheduleDialogTableVisible" title="请填写排班信息" width="800">
    <ScheduleForm :optionType="optionType" :clinicId="route.query.clinicId" :doctorId="route.query.doctorId">
    </ScheduleForm>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DoctorForm from '@/components/Admin/DoctorForm.vue';
import ScheduleForm from './Admin/ScheduleForm.vue';
import { ElButton, ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue';
import { useRouter, useRoute } from 'vue-router'
import { useHospitalStore } from '@/stores/hospitalData'

const props = defineProps({
  cardType: {
    type: String,
    required: true
  }
})
const emit = defineEmits(['changeLoading'])
const hospitalStore = useHospitalStore();
const router = useRouter()
const route = useRoute()
const doctorDialogTableVisible = ref(false);
const scheduleDialogTableVisible = ref(false);
const optionType = ref("create")
const searchContent = ref('')
const backpage = () => {
  if (route.params.department) {
    router.back()
  } else {
    return
  }
}

// 搜索处理函数
const handleSearch = async () => {
  emit('changeLoading')
  try {
    if (route.query.clinicId) {
      await hospitalStore.searchForDoctor(searchContent.value)
    }
    else if (route.query.departmentId) {
      await hospitalStore.searchForClinic(searchContent.value)
    }
  } catch (error) {
    console.log(error)
  } finally {
    emit('changeLoading')
  }
}

// 添加处理函数
const createNewItem = async () => {
  if (!route.query.departmentId && !route.query.clinicId && !route.query.doctorId) {
    const newName = prompt('请输入新科室的名称')
    if (!newName) {
      return
    }
    await hospitalStore.createDepart(newName)
    ElMessage({
      message: '添加科室成功',
      type: 'success',
    })
  } else if (!route.query.clinicId && route.query.departmentId) {
    const newName = prompt('请输入新门诊的名称')
    if (!newName) {
      return
    }
    await hospitalStore.createClinic(Number(route.query.departmentId), newName)
    ElMessage({
      message: '添加门诊成功',
      type: 'success',
    })
  }
  // 新增医生
  else if (route.query.clinicId && route.query.departmentId) {
    optionType.value = "create"
    doctorDialogTableVisible.value = true
  }
  // 新增排班
  else if (route.query.doctorId) {
    optionType.value = "create"
    scheduleDialogTableVisible.value = true
  }
  else {
    console.log('失败')
  }
}
</script>

<style lang="scss" scoped>
.ap-top {
  height: 2rem;
  width: 85%;
  margin: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  #patient {
    display: flex;
    justify-content: space-between;
    gap: 5vw;
  }
}
</style>
