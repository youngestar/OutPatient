<template>
    <div class="patient-cb">
      
      <div v-if="!isDetail" style="width: 100%; height: 100%">
        <h1>就诊记录：</h1>
        <div class="digCont">
          <div class="digItem" v-for="item in digList" :key="item.diagId">
            <p>诊断医生：{{item.doctorName}}</p>
            <p>诊断结果：{{item.diagnosisResult}}</p>
            <p>诊断时间：{{item.createTime}}</p>
            <el-button :disabled="!item.canFeedback" style="margin: 1rem;" @click="gotoDetail(item)">查看详情</el-button>
          </div>
          <el-empty description="暂无诊断记录" v-if="digList.length === 0" />
      </div>
      </div>

      <div v-if="isDetail" style="width: 100%; height: 100%">
        <CallComuni></CallComuni>
        <MedicalAdvice></MedicalAdvice>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import MedicalAdvice from '@/components/CallBAck/MedicalAdvice.vue'
  import CallComuni from '@/components/CallBAck/CallComuni.vue'
  import { onMounted, reactive, ref } from 'vue'
  import { useUserStore } from '@/stores/user'
  import { DoAxiosWithErro } from '@/api'

  const isDetail = ref(false)
  const isLoading = ref(false)

  const digList = reactive([])

  const userStore = useUserStore()


  const getList = async () => {
    isLoading.value = true
    DoAxiosWithErro(`/medical/doctor/${userStore.userInfo!.doctorId}/diagnoses`,'get',{},true)
    .then(res => {
      digList.push(...res)
    })
    .finally(() => {
      isLoading.value = false
    })
  }
  
  onMounted(() => {
    getList()
  })

  </script>
  
  <style lang="scss" scoped>
  .patient-cb{
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
  </style>