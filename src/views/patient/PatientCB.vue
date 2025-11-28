<template>
  <div v-loading="isLoading" class="patient-cb">

    <div v-if="!isDetail">
      <h1>就诊记录：</h1>
      <div class="digCont">
        <div class="digItem" v-for="item in digList" :key="item.diagId">
          <p>诊断医生：{{ item.doctorName }}</p>
          <p>诊断结果：{{ item.diagnosisResult }}</p>
          <p>诊断时间：{{ item.createTime }}</p>
          <el-button :disabled="!item.canFeedback" style="margin: 1rem;" @click="gotoDetail(item)">查看详情</el-button>
          <!-- 消息红点 -->
          <div class="red-point" v-if="unreadCounters[item.diagId]">
            {{ unreadCounters[item.diagId] }}
          </div>
        </div>
        <el-empty description="暂无诊断记录" v-if="digList.length === 0" />
      </div>
    </div>

    <div v-if="isDetail">
      <el-button style="margin: 1rem;" @click="isDetail = false; Object.assign(detaileDig, {})">返回</el-button>
      <CallComuni :diag-id="detaileDig.diagId"></CallComuni>
      <MedicalAdvice :diag-id="detaileDig.diagId"></MedicalAdvice>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MedicalAdvice from '@/components/CallBAck/MedicalAdvice.vue'
import CallComuni from '@/components/CallBAck/CallComuni.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { DoAxiosWithErro } from '@/api'
import { useUserStore } from '@/stores/user'
import { useComunicationStore } from '@/stores/comunication'

type DiagnosticType = {
  diagId: number;
  appointmentId: number;
  doctorId: number;
  doctorName: string;
  doctorTitle: string; // 这个字段看起来可能是误写，正常医生职称不会写成“太太”
  patientId: number;
  patientName: string;
  diagnosisResult: string;
  examination: string; // 体温12度显然不符合人体正常体温，可能是数据录入错误
  prescription: string;
  advice: string;
  canFeedback: boolean;
  createTime: string; // 如果需要更精确的类型，可以使用Date类型
  updateTime: string; // 如果需要更精确的类型，可以使用Date类型
};

const isDetail = ref(false)
const isLoading = ref(false)

// 诊断详情
const detaileDig = reactive(<DiagnosticType>{})
const digList = reactive(<DiagnosticType[]>[])

const userStore = useUserStore()
const comunicationStore = useComunicationStore()

const unreadCounters = reactive(Object.assign({}, comunicationStore.unreadCounters));

watch(comunicationStore.unreadCounters, () => {
  Object.assign(unreadCounters, comunicationStore.unreadCounters)
})


//  获取患者诊断记录列表
const getPatientDiagnosis = async () => {
  isLoading.value = true
  await DoAxiosWithErro(
    '/medical/patient/diagnoses-list',
    'get',
    { patientId: userStore.userInfo!.patientId },
    true,
    false
  )
    .then((data) => {
      digList.splice(0, digList.length, ...data)
    })
    .finally(() => {
      isLoading.value = false
      console.log(digList)
    })
}

// 跳转到诊断详情
const gotoDetail = (item: DiagnosticType) => {
  Object.assign(detaileDig, item);
  isDetail.value = true
  console.log(detaileDig)
}

onMounted(() => {
  console.log('mounted')
  getPatientDiagnosis()
})


</script>

<style lang="scss" scoped>
.patient-cb {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.digCont {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .digItem {
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

    p {
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
