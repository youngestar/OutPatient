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
import { getChartsDataAge, getChartsDataDoctor, getChartsDataFrequency, getChartsDataGender } from '@/api/doctor/charts';
import { getUesrInfo } from '@/api/patient/myInfo';

const loading = ref(true);
const chartsAge = ref(null);
const chartsDoctor = ref(null);
const chartsGender = ref(null);
const chartsFrequency = ref(null);


onMounted(async () => {
  const doctorId = (await getUesrInfo()).doctorId;

  // 创建所有需要并行执行的 Promise
  const [ageData, frequencyData, genderData] = await Promise.all([
    getChartsDataAge(doctorId), // 年龄数据
    getChartsDataFrequency(doctorId), // 频率数据
    getChartsDataGender(doctorId), // 性别数据
  ]);

  // 分别更新图表
  chartsAge.value?.updateOption(ageData);
  chartsFrequency.value?.updateOption(frequencyData?.keys, frequencyData?.values);
  chartsGender.value?.updateOption(genderData?.keys, genderData?.values);
  loading.value = false;
})
</script>

<style></style>
