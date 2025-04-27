<script setup lang="ts">
import { useHospitalStore } from '@/stores/hospitalData'
import { useRoute } from 'vue-router'
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

const hospitalStore = useHospitalStore()
const route = useRoute()
const props = defineProps({
  optionType: {
    type: String,
    required: true
  },
  doctorId: {
    type: Number,
    required: false,
  },
  userId: {
    type: Number,
    required: false,
  }
})

// 表单数据类型
interface FormData {
  username: string
  password: string
  email: string
  phone: string
  name: string
  title: string
  introduction: string
}

// 表单数据
const formData = reactive<FormData>({
  username: '',
  password: '',
  email: '',
  phone: '',
  name: '',
  title: '',
  introduction: ''
})

// 表单验证规则
const rules = reactive<FormRules<FormData>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 16, message: '长度在4到16个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在6到20个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  title: [
    { required: true, message: '请输入职称', trigger: 'blur' }
  ],
  introduction: [
    { required: true, message: '请输入个人简介', trigger: 'blur' },
    { max: 500, message: '最多输入500个字符', trigger: 'blur' }
  ]
})

const formRef = ref<FormInstance>()

// 提交处理
const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (valid) {
    // 这里处理提交逻辑
    if (props.optionType === "create") {
      const res = await hospitalStore.createDoctor(formData.username, formData.password, formData.email, formData.phone, Number(route.query.clinicId), formData.name, formData.title, formData.introduction)
      if (res) {
        ElMessage({
          message: '添加医生成功',
          type: 'success',
        })
      }
      return
    }
    else if (props.optionType === "update") {
      if (!props.doctorId || !props.userId) {
        ElMessage({
          message: '医生ID与用户ID不能为空',
          type: 'error',
        })
        return
      }
      const res = await hospitalStore.updateDoctor(props.doctorId, props.userId, formData.username, formData.password, formData.email, formData.phone, Number(route.query.clinicId), formData.name, formData.title, formData.introduction)
      if (res) {
        ElMessage({
          message: '更新医生信息成功',
          type: 'success',
        })
      }
      return
    }
  }
}
</script>


<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" style="max-width: 800px">
    <el-row :gutter="20">
      <!-- 左列 -->
      <el-col :span="12">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" type="password" show-password />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" type="email" />
        </el-form-item>

      </el-col>

      <!-- 右列 -->
      <el-col :span="12">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>

        <el-form-item label="职称" prop="title">
          <el-input v-model="formData.title" />
        </el-form-item>

        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="formData.phone" />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 单独占满一行 -->
    <el-form-item label="个人简介" prop="introduction">
      <el-input v-model="formData.introduction" type="textarea" :autosize="{ minRows: 3 }" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>
