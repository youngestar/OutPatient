<template>
  <CardView v-loading="loading" :cardsprops="schedules.map((item) => { return { ...item, cardType: 'admin' } })"
    :myCard="ScheduleCard" style="text-align: center; height: 100%; min-height: 72vh;">
  </CardView>
</template>

<script lang="ts" setup>
import ScheduleCard from '@/components/Registrations/ScheduleCard.vue';
import CardView from '@/views/CardView.vue'
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useHospitalStore } from '@/stores/hospitalData';
import { ElMessage } from 'element-plus';

const loading = ref(true);
const hospitalStore = useHospitalStore();
const route = useRoute();
const schedules = hospitalStore.schedules;

onMounted(async () => {
  hospitalStore.getSchedules(Number(route.query.doctorId), route.query.title, "2025-04-07", "2025-04-17").then(() => {
    console.log(schedules);
    loading.value = false;
    ElMessage.success('获取排班成功');
  }).catch(() => {
    loading.value = false;
    ElMessage.error('获取排班失败');
  })
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
