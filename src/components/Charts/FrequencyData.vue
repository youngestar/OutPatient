<template>
  <div ref="chartRef" style="width: 600px; height: 400px;"></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import * as echarts from 'echarts/core';
import { GridComponent, type GridComponentOption } from 'echarts/components';
import { BarChart, type BarSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

// 注册需要的组件
echarts.use([GridComponent, BarChart, CanvasRenderer]);

// 定义 ECharts 选项类型
type EChartsOption = echarts.ComposeOption<GridComponentOption | BarSeriesOption>;

// 获取 DOM 元素的引用
const chartRef = ref<HTMLDivElement | null>(null);
let myChart: echarts.ECharts | null = null;
let pendingData: { names: string[]; values: number[] } | null = null;
const FALLBACK_LABEL = '暂无数据';

// 为每个柱子配置不同的颜色
const barColors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622'];

const option: EChartsOption = {
  title: {
    text: '就诊时间分布',
    left: 'center'
  },
  xAxis: {
    type: 'category',
    data: [FALLBACK_LABEL]
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [0],
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      },
      itemStyle: {
        color: (params: { dataIndex: number }) => barColors[params.dataIndex % barColors.length]
      }
    }
  ]
};

const applyDataToChart = (names: string[], values: number[]) => {
  if (!myChart) {
    pendingData = { names, values };
    return;
  }
  myChart.setOption({
    xAxis: {
      type: 'category',
      data: names,
    },
    series: [
      {
        type: 'bar',
        data: values,
      },
    ],
  });
};

onMounted(() => {
  if (!chartRef.value) {
    return;
  }
  myChart = echarts.init(chartRef.value);
  myChart.setOption(option);
  if (pendingData) {
    const { names, values } = pendingData;
    pendingData = null;
    applyDataToChart(names, values);
  }
});

const normalizePayload = (names: unknown, values: unknown) => {
  const safeNames = Array.isArray(names) ? names.map(name => String(name ?? '')) : [];
  const safeValues = Array.isArray(values) ? values.map(item => Number(item) || 0) : [];
  const normalizedNames = safeNames.length ? safeNames : [FALLBACK_LABEL];
  const normalizedValues = normalizedNames.map((_, index) => safeValues[index] ?? 0);
  return { names: normalizedNames, values: normalizedValues };
};

// 修改 frequencyOption 函数的参数类型为数组
const updateOption = (names: unknown, values: unknown) => {
  const payload = normalizePayload(names, values);
  applyDataToChart(payload.names, payload.values);
};

onBeforeUnmount(() => {
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
  pendingData = null;
});

defineExpose({
  updateOption
});

</script>

<style scoped></style>
