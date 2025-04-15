<template>
  <div>
    <el-scrollbar height="100%">
      <FrequencyData style="float: left;"></FrequencyData>
      <AgeData style="float: left;"></AgeData>
      <SatisfactionData style="float: left;"></SatisfactionData>
      <DoctorData style="float: left;"></DoctorData>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import FrequencyData from '@/components/Charts/FrequencyData.vue';
import AgeData from '@/components/Charts/AgeData.vue';
import SatisfactionData from '@/components/Charts/SatisfactionData.vue';
import DoctorData from '@/components/Charts/DoctorData.vue';
import { ElScrollbar } from 'element-plus';
</script>

<style></style>
