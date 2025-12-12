<template>
  <div v-loading="isLoading" class="patient-cb">

    <div v-if="!isDetail" class="records-shell">
      <h1>就诊记录</h1>
      <section class="digCont">
        <article class="digItem" v-for="item in digList" :key="item.diagId">
          <div class="item-badge" v-if="unreadCounters[item.diagId]">
            {{ unreadCounters[item.diagId] }}
          </div>
          <div class="item-meta">
            <div>
              <p class="label">诊断医生</p>
              <p class="value">{{ item.doctorName }}</p>
            </div>
            <div>
              <p class="label">诊断患者</p>
              <p class="value">{{ item.patientName }}</p>
            </div>
            <div>
              <p class="label">诊断时间</p>
              <p class="value">{{ item.createTime }}</p>
            </div>
          </div>
          <p class="result">诊断结果：{{ item.diagnosisResult }}</p>
          <div class="card-actions">
            <el-button :disabled="!item.canFeedback" type="primary" size="small" @click="gotoDetail(item)">
              查看详情
            </el-button>
          </div>
        </article>
      </section>
      <el-empty v-if="digList.length === 0" description="暂无诊断记录" class="records-empty" />
    </div>

    <div v-if="isDetail">
      <el-button style="margin: 1rem;" @click="isDetail = false; Object.assign(detaileDig, {})">返回</el-button>
      <CallComuni :diag-id="detaileDig.diagId.toString()"></CallComuni>
      <MedicalAdvice :diag-id="detaileDig.diagId.toString()"></MedicalAdvice>
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
  diagId: string;
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  doctorTitle: string; // 这个字段看起来可能是误写，正常医生职称不会写成“太太”
  patientId: string;
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

const unreadCounters = reactive<Record<string, number>>(Object.assign({}, comunicationStore.unreadCounters));

watch(comunicationStore.unreadCounters, () => {
  Object.assign(unreadCounters, comunicationStore.unreadCounters)
})


//  获取患者诊断记录列表
const getPatientDiagnosis = async () => {
  isLoading.value = true
  await DoAxiosWithErro<DiagnosticType[]>(
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
    })
}

// 跳转到诊断详情
const gotoDetail = (item: DiagnosticType) => {
  Object.assign(detaileDig, item);
  isDetail.value = true
}

onMounted(() => {
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

.records-shell {
  width: 100%;
  padding: 2rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.records-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #eff6ff, #fdf2f8);
  border-radius: 20px;
  padding: 1.5rem 2rem;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.1);

  .eyebrow {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #7c8db5;
    font-size: 0.8rem;
  }

  h2 {
    margin: 0.4rem 0;
    font-size: 2rem;
    color: #1f2933;
  }

  .subtext {
    margin: 0;
    color: #64748b;
  }
}

.digCont {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
}

.digItem {
  position: relative;
  padding: 1.25rem 1.5rem;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 15px 40px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.15);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.item-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  min-width: 28px;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background: #f97316;
  color: #fff;
  font-size: 0.75rem;
  text-align: center;
  font-weight: 600;
}

.item-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;

  .label {
    margin: 0;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #94a3b8;
  }

  .value {
    margin: 0.15rem 0 0;
    font-size: 1rem;
    color: #111827;
    font-weight: 600;
  }
}

.result {
  margin: 0;
  font-size: 0.95rem;
  color: #334155;
  line-height: 1.6;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
}

.records-empty {
  background: #fff;
  border-radius: 18px;
  padding: 3rem 0;
}

@media (max-width: 768px) {
  .records-shell {
    padding: 1rem;
  }

  .records-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
