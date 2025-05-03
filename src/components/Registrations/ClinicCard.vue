<template>
  <CardView v-loading="loading" :cardsprops="clinics" :myCard="DepartCard" @handleclick="handleclick">
  </CardView>
</template>

<script lang="ts" setup>
import DepartCard from '@/components/DepartCard.vue'
import CardView from '@/views/CardView.vue'
import { getClinicRegistrations, type clinic } from '@/api/patient/registrations';
import { reactive, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'

const loading = ref(true);
const router = useRouter();
const route = useRoute();
const clinics = reactive([

])

const handleclick = (clinic: clinic) => {
  router.push({
    name: "clinicDoctor",
    params: {
      department: route.query.departmentName as string,
      clinic: clinic.name,
    },
    query: {
      departmentId: route.query.departmentId,
      departmentName: route.query.departmentName,
      clinicId: clinic.id,
      clinicName: clinic.name,
    }
  })
}

onMounted(async () => {
  const newClinics = await getClinicRegistrations(route.query.departmentId);
  loading.value = false;
  clinics.splice(0, clinics.length, ...newClinics);
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
