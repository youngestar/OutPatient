<template>
  <div>
    <DoctorCard></DoctorCard>
  </div>
</template>

<script lang="ts" setup>
import DoctorCard from '../DoctorCard.vue';
import CardView from '@/views/CardView.vue'
import { useRouter } from 'vue-router'

const router = useRouter();
const clinic = [
  {
    name: '门诊1',
    desc: '在岗医生：张三',
  },
  {
    name: '门诊2',
    desc: '在岗医生：李四',
  },
]

const handleclick = (departmentName: string, clinicName: string) => {
  router.push({
    name: "crudClinic",
    params: {
      department: departmentName,
      clinic: clinicName,
    }
  })
}

const props = defineProps({
  myCard: {
    type: Object,
    required: true
  },
  cardsprops: {
    type: Array,
    required: true
  },
});
</script>

<style lang="scss" scoped>
.medical-ap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
