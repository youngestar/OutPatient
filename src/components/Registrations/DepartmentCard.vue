<template>
  <CardView @handleclick="handleclick('1')" style="text-align: center;" :cardsprops="departs" :myCard="DepartCard">
  </CardView>
</template>

<script lang="ts" setup>
import DepartCard from '@/components/DepartCard.vue'
import CardView from '@/views/CardView.vue'
import { useRouter } from 'vue-router'

const router = useRouter();
const departs = [
  {
    name: '内科',
    desc: '内科疾病诊断与治疗',
  },
  {
    name: '外科',
    desc: '外科疾病诊断与治疗',
  },
  {
    name: '妇产科',
    desc: '妇产科疾病诊断与治疗',
  },
  {
    name: '儿科',
    desc: '儿科疾病诊断与治疗',
  },
  {
    name: '皮肤科',
    desc: '皮肤科疾病诊断与治疗',
  },
  {
    name: '皮肤科',
    desc: '皮肤科疾病诊断与治疗',
  },
  {
    name: '皮肤科',
    desc: '皮肤科疾病诊断与治疗',
  },
  {
    name: '皮肤科',
    desc: '皮肤科疾病诊断与治疗',
  },
  {
    name: '皮肤科',
    desc: '皮肤科疾病诊断与治疗',
  },
  {
    name: '皮肤科',
    desc: '皮肤科疾病诊断与治疗',
  },
]

const handleclick = (departmentName: string) => {
  router.push({
    name: "clinic",
    params: {
      department: departmentName,
    }
  })
}
</script>

<style lang="scss" scoped>
.medical-ap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
