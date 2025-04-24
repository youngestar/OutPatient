<template>
  <div class="ap-top">
    <el-button type="primary" @click="backpage">上一级</el-button>
    <el-button type="primary" @click="createNewItem">添加</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ElButton } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useHospitalStore } from '@/stores/hospitalData'

const hospitalStore = useHospitalStore();
const router = useRouter()
const route = useRoute()
const backpage = () => {
  if (route.params.department) {
    router.back()
  } else {
    router.push({
      name: 'home',
    })
  }
}

const createNewItem = () => {
  if (!route.query.departmentId && !route.query.clinicId) {
    const newName = prompt('请输入新科室的名称')
    if (!newName) {
      return
    }
    hospitalStore.createDepart(newName)
  } else if (!route.query.clinicId && route.query.departmentId) {
    const newName = prompt('请输入新门诊的名称')
    if (!newName) {
      return
    }
    hospitalStore.createClinic(Number(route.query.departmentId), newName)
  }
  else if (route.query.clinicId && route.query.departmentId) {
    const newName = prompt('请输入新医生的名称')
    if (!newName) {
      return
    }
    const newtitle = prompt('请输入新医生的职称')
    if (!newtitle) {
      return
    }
    const newintroduction = prompt('请输入新医生的介绍')
    if (!newintroduction) {
      return
    }
    hospitalStore.createDoctor(Number(route.query.clinicId), newName, newtitle, newintroduction)
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
