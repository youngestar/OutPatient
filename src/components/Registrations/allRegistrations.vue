<script setup lang="ts">
import { ElScrollbar, ElEmpty } from 'element-plus';
import RegistrationCard from './RegistrationCard.vue';
import { useRouter } from 'vue-router';
import { onMounted, ref, reactive, type Reactive } from 'vue';
import { doctorGetRegistrations } from '@/api/doctor/registrations';
import { getUesrInfo } from '@/api/patient/myInfo';
import type { Registration } from '@/api/doctor/registrations';

const loading = ref(true);
const router = useRouter();
const registrations: Reactive<Registration[]> = reactive([])
const goToDetail = (name: string, doctorId: number, appointmentId: number) => {
  router.push({
    name: "detailRegistrations",
    params: {
      name: name,
    },
    query: {
      doctorId: doctorId,
      appointmentId: appointmentId,
    },
  })
}
onMounted(async () => {
  const userInfo = await getUesrInfo();
  const doctorId = userInfo?.doctorId;
  const getRegistrations = await doctorGetRegistrations(doctorId);
  registrations.splice(0, registrations.length, ...getRegistrations);
  loading.value = false;
})
</script>

<template>
  <el-scrollbar v-loading="loading">
    <RegistrationCard v-for="(item, index) in registrations" :key="index"
      @click="goToDetail(item.patientName, item.doctorId, item.appointmentId)" v-bind="item">
    </RegistrationCard>
    <el-empty v-if="registrations.length === 0" description="还没有挂号记录"
      style="width: 100%; height: 80vh; background-color: #fff;" />
  </el-scrollbar>
</template>

<style></style>
