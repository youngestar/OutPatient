<template>
  <div class="ap-top">
    <el-button type="primary" @click="backpage">上一级</el-button>
    <el-button type="primary" @click="createNewItem">添加</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ElButton, ElMessage } from 'element-plus'
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
    const username = prompt('请输入账户名')
    if (!username) {
      return
    }
    const password = prompt('请输入密码')
    if (!password) {
      return
    }
    const email = prompt('请输入邮箱')
    if (!email) {
      return
    }
    const phone = prompt('请输入手机号')
    if (!phone) {
      return
    }
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
    hospitalStore.createDoctor(username, password, email, phone, Number(route.query.clinicId), newName, newtitle, newintroduction)
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
