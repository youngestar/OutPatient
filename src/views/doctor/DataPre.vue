<template>
  <el-scrollbar v-loading="loading">
    <FrequencyData ref="chartsFrequency" style="float: left; height: 40vh;"></FrequencyData>
    <AgeData ref="chartsAge" style="float: left; height: 40vh;"></AgeData>
    <GenderData ref="chartsGender" style="float: left; height: 40vh;"></GenderData>
    <!-- <DoctorData style="float: left; height: 40vh;"></DoctorData> -->
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import FrequencyData from '@/components/Charts/FrequencyData.vue';
import AgeData from '@/components/Charts/AgeData.vue';
import GenderData from '@/components/Charts/GenderData.vue';
import { ElScrollbar } from 'element-plus';
import { onMounted } from 'vue';
import { getChartsDataAge, getChartsDataFrequency, getChartsDataGender } from '@/api/doctor/charts';
import { getUesrInfo } from '@/api/patient/myInfo';

const loading = ref(true);
type AgeChartExpose = { updateOption: (data: { value: number; name: string }[]) => void }
type BarChartExpose = { updateOption: (names: string[], values: number[]) => void }
const chartsAge = ref<AgeChartExpose | null>(null);
const chartsGender = ref<BarChartExpose | null>(null);
const chartsFrequency = ref<BarChartExpose | null>(null);


onMounted(async () => {
  const userInfo = await getUesrInfo();
  const doctorId = userInfo?.doctorId;
  if (!doctorId) {
    loading.value = false;
    return;
  }

  // 创建所有需要并行执行的 Promise
  const [ageData, frequencyData, genderData] = await Promise.all([
    getChartsDataAge(doctorId), // 年龄数据
    getChartsDataFrequency(doctorId), // 频率数据
    getChartsDataGender(doctorId), // 性别数据
  ]);

  console.log(ageData, frequencyData, genderData);
  // 分别更新图表
  if (ageData) {
    chartsAge.value?.updateOption(ageData);
  }
  if (frequencyData) {
    chartsFrequency.value?.updateOption(frequencyData.keys, frequencyData.values);
  }
  if (genderData) {
    chartsGender.value?.updateOption(genderData.keys, genderData.values);
  }
  loading.value = false;
})
</script>

<style></style>
