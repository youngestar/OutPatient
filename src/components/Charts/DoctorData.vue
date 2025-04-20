<template>
  <div ref="chartRef" style="width: 600px; height: 400px;"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts/core';
import { GridComponent, type GridComponentOption } from 'echarts/components';
import { LineChart, type LineSeriesOption } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// 注册需要的组件
echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);

// 定义 ECharts 选项类型
type EChartsOption = echarts.ComposeOption<GridComponentOption | LineSeriesOption>;

// 获取 DOM 元素的引用
const chartRef = ref<HTMLDivElement | null>(null);

const option: EChartsOption = {
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      areaStyle: {}
    }
  ]
};

onMounted(() => {
  if (chartRef.value) {
    const myChart = echarts.init(chartRef.value);
    myChart.setOption(option);
  }
});
</script>

<style scoped></style>
