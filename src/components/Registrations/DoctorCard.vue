<template>
  <CardView style="height: 100%; min-height: 100vh;" v-loading="loading"
    :cardsprops="doctors.map(doctor => { return { ...doctor, cardType: 'doctor' } })" :myCard="DoctorCard">
  </CardView>
</template>

<script lang="ts" setup>
import DoctorCard from '@/components/DoctorCard.vue';
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
  doctors.splice(0, doctors.length, ...newDoctors);
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
