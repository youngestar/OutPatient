<template>
  <div v-loading="isLoading" class="patient-cb">

    <div v-if="!isDetail" class="records-shell main-shell utility-gap">
      <header class="records-head">
        <div>
          <p class="eyebrow">DIAGNOSIS</p>
          <h2>我的诊断</h2>
        </div>
      </header>
      <section class="digCont card-grid">
        <article class="digItem surface-card" v-for="item in digList" :key="item.diagId">
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
      <el-empty v-if="digList.length === 0" description="暂无诊断记录" class="records-empty surface-card" />
    </div>

    <div v-if="isDetail" class="detail-shell main-shell utility-gap">
      <header class="page-head">
        <div>
          <p class="eyebrow">DETAIL</p>
          <h2>诊断详情</h2>
          <p class="subtext">医生：{{ detaileDig.doctorName }} · 时间：{{ detaileDig.createTime }}</p>
        </div>
        <el-button type="default" @click="isDetail = false; Object.assign(detaileDig, {})">返回列表</el-button>
      </header>
      <el-scrollbar class="detail-scroll surface-card">
        <section class="detail-panels">
          <CallComuni :diag-id="detaileDig.diagId.toString()"></CallComuni>
          <MedicalAdvice :diag-id="detaileDig.diagId.toString()"></MedicalAdvice>
        </section>
      </el-scrollbar>
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
}

.digCont {
  width: 100%;
}

.digItem {
  position: relative;
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-primary);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.item-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  min-width: 28px;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background: var(--color-warning);
  color: #fff;
  font-size: 0.75rem;
  text-align: center;
  font-weight: 600;
}

.item-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-3);

  .label {
    margin: 0;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-muted);
  }

  .value {
    margin: 0.15rem 0 0;
    font-size: 1rem;
    color: var(--color-text);
    font-weight: 600;
    word-break: break-word;
  }
}

.result {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text);
  line-height: 1.6;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
}

.records-empty {
  padding: var(--space-8) 0;
}

.detail-shell {
  width: 100%;
  height: 100%;
}

.detail-scroll {
  max-height: 100%;
  padding: var(--space-4);
}

.detail-panels {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

@media (max-width: 768px) {
  .detail-scroll {
    padding: var(--space-3);
  }
}
</style>
