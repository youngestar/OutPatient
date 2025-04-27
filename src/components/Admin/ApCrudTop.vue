<template>
  <div class="ap-top">
    <el-button type="primary" @click="backpage">上一级</el-button>
    <el-button type="primary" @click="createNewItem">添加</el-button>
  </div>
  <el-dialog v-model="dialogTableVisible" title="请填写医生信息" width="800">
    <DoctorForm :optionType="optionType"></DoctorForm>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DoctorForm from './DoctorForm.vue';
import { ElButton, ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useHospitalStore } from '@/stores/hospitalData'

const hospitalStore = useHospitalStore();
const router = useRouter()
const route = useRoute()
const dialogTableVisible = ref(false);
const optionType = ref("create")
const backpage = () => {
  if (route.params.department) {
    router.back()
  } else {
    router.push({
      name: 'home',
    })
  }
}

const createNewItem = async () => {
  if (!route.query.departmentId && !route.query.clinicId) {
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
  else if (route.query.clinicId && route.query.departmentId) {
    optionType.value = "create"
    dialogTableVisible.value = true
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
}
</style>
