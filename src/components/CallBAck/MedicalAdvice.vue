<template>
  <div v-loading="isLoading" element-loading-text="加载中" class="card">
    <el-table :data="detail" style="width: 100%">
        <el-table-column prop="diagId" label="预约ID" style="flex: 1" />
        <el-table-column prop="doctorName" label="医生姓名" style="flex: 1" />
        <el-table-column prop="doctorTitle" label="医生职称" style="flex: 1" />
        <el-table-column prop="diagnosisResult" label="诊断结果" style="flex: 1" />
        <el-table-column prop="examination" label="检查结果" style="flex: 1" />
        <el-table-column prop="prescription" label="处方" style="flex: 1" />
      </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { DoAxiosWithErro } from '@/api'

interface DiagnosisDetail {
  diagId: number
  appointmentId: number
  doctorId: number
  doctorName: string
  doctorTitle: string
  patientId: number
  patientName: string
  diagnosisResult: string
  examination: string
  prescription: string
  advice: string
  canFeedback: boolean
  createTime: string
  updateTime: string
}

const props = defineProps({
  diagId: {
    type: Number,
    required: true
  }
})

const isLoading = ref(false)

const detail = reactive(<DiagnosisDetail[]>[])

// 获取诊断详情
const getDetal = async () => {
  isLoading.value = true
  DoAxiosWithErro(`/medical/diagnoses/${props.diagId}`,'get',{},true).then(res => {
    detail.push(res)
  }).finally(() =>{
    isLoading.value = false
  })
}

onMounted(() => {
  getDetal()
})


</script>

<style lang="scss" scoped>
.card {
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>

