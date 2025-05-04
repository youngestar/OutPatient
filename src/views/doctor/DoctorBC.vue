<template>
    <div class="patient-cb">
      
      <div v-if="!isDetail" style="width: 100%; height: 100%">
        <h1>就诊记录：</h1>
        <div class="digCont">
          <div class="digItem" v-for="item in digList" :key="item.diagId">
            <p>诊断患者：{{item.patientName}}</p>
            <p>诊断结果：{{item.diagnosisResult}}</p>
            <p>诊断时间：{{item.createTime}}</p>
            <el-button :disabled="!item.canFeedback" style="margin: 1rem;" @click="gotoDetail(item)">查看详情</el-button>
            <!-- 消息红点 -->
            <div class="red-point" v-if="unreadCounters[item.diagId]">
              {{ unreadCounters[item.diagId] }}
            </div>
          </div>
          <!-- 空白内容 -->
          <el-empty description="暂无诊断记录" v-if="digList.length === 0" />
      </div>
      </div>

      <div v-if="isDetail" style="width: 100%; height: 100%">
        <el-button style="margin: 1rem;" @click="isDetail = false; Object.assign(digItem, {})">返回</el-button>
        <CallComuni :diag-id="digItem.diagId"></CallComuni>
        <MedicalAdvice :diag-id="digItem.diagId"></MedicalAdvice>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import MedicalAdvice from '@/components/CallBAck/MedicalAdvice.vue'
  import CallComuni from '@/components/CallBAck/CallComuni.vue'
  import { onMounted, reactive, ref, watch } from 'vue'
  import { useUserStore } from '@/stores/user'
  import { DoAxiosWithErro } from '@/api'
  import { useComunicationStore } from '@/stores/comunication'

  const isDetail = ref(false)
  const isLoading = ref(false)

  const digList = reactive([])
  const digItem = reactive({
    diagId: '',
    doctorId: '',
    doctorName: '',
    diagnosisResult: '',
    createTime: '',
    canFeedback: false
  })

  const userStore = useUserStore()
  const comunicationStore = useComunicationStore()

  const unreadCounters = reactive(Object.assign({}, comunicationStore.unreadCounters));

  watch(comunicationStore.unreadCounters,() => {
    Object.assign(unreadCounters, comunicationStore.unreadCounters)
  })


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
  const gotoDetail = (item) => {
    Object.assign(digItem, item)
    isDetail.value = true
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
  .digCont{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .digItem{
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 40%;
    height: 10rem;
    margin: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
    p{
      margin: 5px;
      font-size: 16px;
    }
  }
}

.red-point {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  background-color: red;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
  </style>