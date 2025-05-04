<template>
  <div>
    <el-scrollbar height="100%">
      <FrequencyData ref="chartsFrequency" style="float: left; height: 40vh;"></FrequencyData>
      <AgeData ref="chartsAge" style="float: left; height: 40vh;"></AgeData>
      <GenderData ref="chartsGender" style="float: left; height: 40vh;"></GenderData>
      <!-- <DoctorData style="float: left; height: 40vh;"></DoctorData> -->
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import FrequencyData from '@/components/Charts/FrequencyData.vue';
import AgeData from '@/components/Charts/AgeData.vue';
import GenderData from '@/components/Charts/GenderData.vue';
import DoctorData from '@/components/Charts/DoctorData.vue';
import { ElScrollbar } from 'element-plus';
import { onMounted } from 'vue';
import { getChartsDataAge, getChartsDataDoctor, getChartsDataFrequency, getChartsDataGender } from '@/api/doctor/charts';
const chartsAge = ref(null);
const chartsDoctor = ref(null);
const chartsGender = ref(null);
const chartsFrequency = ref(null);


onMounted(async () => {
  const ageData = await getChartsDataAge();
  chartsAge.value.updateOption(ageData);
  getChartsDataDoctor();
  const frequencyData = await getChartsDataFrequency();
  chartsFrequency.value.updateOption(frequencyData?.keys, frequencyData?.values);
  const genderData = await getChartsDataGender();
  chartsGender.value.updateOption(genderData?.keys, genderData?.values);
})
</script>

<style></style>
