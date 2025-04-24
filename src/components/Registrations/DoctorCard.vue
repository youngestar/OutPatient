<template>
  <CardView v-loading="loading" :cardsprops="doctors" :myCard="DoctorCard">
  </CardView>
</template>

<script lang="ts" setup>
import DoctorCard from '../DoctorCard.vue';
import CardView from '@/views/CardView.vue'
import type { doctor } from '@/api/patient/registrations';
import { getDoctorRegistrations } from '@/api/patient/registrations';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router'

const loading = ref(true);
const route = useRoute();
const doctors = reactive<doctor[]>([

])

onMounted(async () => {
  const newDoctors = await getDoctorRegistrations(route.query.departmentId, route.query.clinicId);
  loading.value = false;
  console.log(newDoctors);
  Object.assign(doctors, newDoctors);
})
</script>

<style lang="scss" scoped>
.medical-ap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
