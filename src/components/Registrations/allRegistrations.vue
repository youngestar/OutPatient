<script setup lang="ts">
import { ElScrollbar } from 'element-plus';
import RegistrationCard from './RegistrationCard.vue';
import { useRouter } from 'vue-router';
import { onMounted, reactive, type Reactive } from 'vue';
import { doctorGetRegistrations } from '@/api/doctor/registrations';
import { getUesrInfo } from '@/api/patient/myInfo';
import type { Registration } from '@/api/doctor/registrations';

const router = useRouter();
const registrations: Reactive<Registration[]> = reactive([])
const goToDetail = (id: string) => {
  router.push({
    name: "detailRegistrations",
    params: {
      id: id,
    }
  })
}
onMounted(async () => {
  const userInfo = await getUesrInfo();
  const doctorId = userInfo?.userId;
  console.log(doctorId)
  const getRegistrations = await doctorGetRegistrations(doctorId);
  console.log(getRegistrations)
  Object.assign(registrations, getRegistrations);
})
</script>

<template>
  <el-scrollbar>
    <RegistrationCard v-for="(item, index) in registrations" :key="index" @click="goToDetail(item.id)">
    </RegistrationCard>
    <RegistrationCard @click="goToDetail('1')"></RegistrationCard>
  </el-scrollbar>
</template>

<style></style>
