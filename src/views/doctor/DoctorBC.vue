<template>
  <div class="patient-cb" v-loading="isLoading">

    <div v-if="!isDetail" class="records-shell">
      <h2>我的诊断</h2>
      <section class="digCont">
        <article class="digItem" v-for="item in digList" :key="item.diagId">
          <div class="item-badge" v-if="unreadCounters[item.diagId]">
            {{ unreadCounters[item.diagId] }}
          </div>
          <div class="item-meta">
            <div>
              <p class="label">患者姓名</p>
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
      <el-empty v-if="digList.length === 0" description="还没有诊断记录" class="records-empty" />
    </div>

    <div v-if="isDetail" class="detail-shell">
      <el-scrollbar class="detail-scroll">
        <div class="detail-header">
          <div>
            <h3>诊断详情</h3>
            <p class="subtext">患者：{{ digItem.patientName }} · 时间：{{ digItem.createTime }}</p>
          </div>
          <el-button type="default" @click="isDetail = false; Object.assign(digItem, {})">返回列表</el-button>
        </div>
        <section class="detail-panels">
          <CallComuni :diag-id="digItem.diagId"></CallComuni>
          <MedicalAdvice :diag-id="digItem.diagId"></MedicalAdvice>
        </section>
      </el-scrollbar>
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
import { ElScrollbar } from 'element-plus'

const isDetail = ref(false)
const isLoading = ref(false)

type DiagnoseItem = {
  diagId: string
  doctorId: string
  doctorName: string
  diagnosisResult: string
  createTime: string
  canFeedback: boolean
  patientName?: string
}

const digList = reactive<DiagnoseItem[]>([])
const digItem = reactive<DiagnoseItem>({
  diagId: '',
  doctorId: '',
  doctorName: '',
  diagnosisResult: '',
  createTime: '',
  canFeedback: false
})

const userStore = useUserStore()
const comunicationStore = useComunicationStore()

const unreadCounters = reactive<Record<string, number>>(Object.assign({}, comunicationStore.unreadCounters));

watch(comunicationStore.unreadCounters, () => {
  Object.assign(unreadCounters, comunicationStore.unreadCounters)
})


const getList = async () => {
  isLoading.value = true
  const doctorId = userStore.userInfo?.doctorId
  if (!doctorId) {
    isLoading.value = false
    return
  }
  DoAxiosWithErro<DiagnoseItem[]>(
    '/medical/doctor/diagnoses-list',
    'get',
    { doctorId },
    true,
    false
  )
    .then(res => {
      digList.push(...res)
    })
    .finally(() => {
      isLoading.value = false
    })
}
const gotoDetail = (item: DiagnoseItem) => {
  Object.assign(digItem, item)
  isDetail.value = true
}
onMounted(() => {
  getList()
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
  background: linear-gradient(135deg, #eef2ff, #fdf2f8);
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

.detail-shell {
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  box-sizing: border-box;
}

.detail-scroll {
  max-height: 100%;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.12);
  padding: 1.5rem;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h3 {
    margin: 0;
    font-size: 1.5rem;
    color: #1f2933;
  }

  .subtext {
    margin: 0.4rem 0 0;
    color: #64748b;
  }
}

.detail-panels {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
