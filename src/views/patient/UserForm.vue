<script setup lang="ts">
import { updateUserInfo } from '@/api/patient/myInfo';
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

// 表单数据类型
interface PersonalInfo {
  name: string
  gender: number
  age: number
  region: string
  address: string
  phone: string
  idCard: string
}

// 提交数据
const emit = defineEmits(['submit'])

// 表单数据
const formData = reactive<PersonalInfo>({
  name: '',
  gender: 0,
  age: 0,
  region: '',
  address: '',
  phone: '',
  idCard: ''
})


// 验证规则
const rules = reactive<FormRules<PersonalInfo>>({
  name: [
    { required: true, message: '姓名不能为空', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度2-10个字符', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  age: [
    { required: true, message: '年龄不能为空', trigger: 'blur' },
    { type: 'number', min: 0, max: 150, message: '年龄需在0-150之间', trigger: 'blur' }
  ],
  region: [
    { required: true, message: '请选择所在地区', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '详细地址不能为空', trigger: 'blur' },
    { min: 5, message: '至少输入5个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '无效的手机号码', trigger: 'blur' }
  ],
  idCard: [
    { required: true, message: '身份证号不能为空', trigger: 'blur' },
    {
      pattern: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])\d{3}[\dXx]$/,
      message: '无效的身份证号码',
      trigger: 'blur'
    }
  ]
})

const formRef = ref<FormInstance>()

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    updateUserInfo(
      formData.name,
      formData.gender,
      formData.age,
      formData.region,
      formData.address,
      formData.phone,
      formData.idCard
    ).then((res) => {
      if (res.name) {
        ElMessage.success('信息提交成功')
        emit('submit', formData)
      } else {
        ElMessage.error('信息提交失败，请稍后重试')
      }
    })
    resetForm()
  } catch (error) {
    ElMessage.error('请完善表单信息')
  }
}

const resetForm = () => {
  formRef.value?.resetFields()
}
</script>

<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" style="max-width: 900px">
    <el-row :gutter="30">
      <!-- 左列 -->
      <el-col :span="12">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入真实姓名" />
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-select v-model="formData.gender" placeholder="请选择性别">
            <el-option label="男" :value="1" />
            <el-option label="女" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="formData.age" :min="0" :max="150" controls-position="right" />
        </el-form-item>
        <el-form-item label="所在地区" prop="region">
          <el-input v-model="formData.region" placeholder="请输入地区" />
        </el-form-item>
      </el-col>

      <!-- 右列 -->
      <el-col :span="12">
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="formData.address" placeholder="街道门牌信息" />
        </el-form-item>

        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="formData.phone" placeholder="11位手机号码" />
        </el-form-item>

        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="formData.idCard" placeholder="18位身份证号码" maxlength="18" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.el-select,
.el-cascader {
  width: 100%;
}

.el-input-number {
  width: 100%;
  text-align: left;
}
</style>
