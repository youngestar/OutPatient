<template>
  <div class="medical-ap">
    <ApTop></ApTop>
    <div style="flex: 1;">
      <CardView @handleclick="handleclick" :cardsprops="departs" :myCard="DepartCard"></CardView>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ApTop from '@/components/ApTop.vue'
import DepartCard from '@/components/DepartCard.vue'
import DoctorCard from '@/components/DoctorCard.vue'
import CardView from '@/views/CardView.vue'

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

const handleclick = (item) => {
  console.log(item);
}
</script>

<style lang="scss" scoped>
.medical-ap{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>
