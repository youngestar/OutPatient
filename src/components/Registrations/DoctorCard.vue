<template>
  <CardView style="height: 100%; min-height: 100vh;" v-loading="loading"
    :cardsprops="doctors.map(doctor => ({ ...doctor, cardType: 'doctor' }))" :myCard="DoctorCard">
  </CardView>
</template>

<script lang="ts" setup>
import DoctorCard from '../DoctorCard.vue';
import CardView from '@/views/CardView.vue'
import { useHospitalStore } from '@/stores/hospitalData'
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router'

const hospitalStore = useHospitalStore();
const loading = ref(true);
const route = useRoute();
const doctors = hospitalStore.doctors;

onMounted(async () => {
  await hospitalStore.getDoctors(Number(route.query.departmentId), Number(route.query.clinicId));
  loading.value = false;
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
