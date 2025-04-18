<template>
  <div>
    <el-scrollbar height="100%">
      <FrequencyData style="float: left;"></FrequencyData>
      <AgeData style="float: left;"></AgeData>
      <GenderData style="float: left;"></GenderData>
      <DoctorData style="float: left;"></DoctorData>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import FrequencyData from '@/components/Charts/FrequencyData.vue';
import AgeData from '@/components/Charts/AgeData.vue';
import GenderData from '@/components/Charts/GenderData.vue';
import DoctorData from '@/components/Charts/DoctorData.vue';
import { ElScrollbar } from 'element-plus';
import { onMounted } from 'vue';
import { getChartsDataAge, getChartsDataDoctor, getChartsDataFrequency, getChartsDataGender } from '@/api/doctor/charts';

onMounted(() => {
  getChartsDataAge();
  getChartsDataDoctor();
  getChartsDataFrequency();
  getChartsDataGender();
})
</script>

<style></style>
