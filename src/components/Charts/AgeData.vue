<template>
  <div ref="chartRef" style="width: 600px; height: 400px;"></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  type TitleComponentOption,
  TooltipComponent,
  type TooltipComponentOption,
  LegendComponent,
  type LegendComponentOption
} from 'echarts/components';
import { PieChart, type PieSeriesOption } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// 注册所需组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
]);

// 定义 ECharts 选项类型
type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | PieSeriesOption
>;

// 获取 DOM 元素引用
const chartRef = ref<HTMLDivElement | null>(null);

const option: EChartsOption = {
  title: {
    text: '患者年龄分布',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 0, name: 'Search Engine' },
        { value: 0, name: 'Direct' },
        { value: 0, name: 'Email' },
        { value: 0, name: 'Union Ads' },
        { value: 0, name: 'Video Ads' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};

// 定义 ECharts 实例变量
let myChart: echarts.ECharts | null = null;
let pendingData: { value: number; name: string }[] | null = null;
const FALLBACK_DATA = [{ value: 0, name: '暂无数据' }];

const applyDataToChart = (data: { value: number; name: string }[]) => {
  if (!myChart) {
    pendingData = data;
    return;
  }
  myChart.setOption({
    series: [
      {
        type: 'pie',
        radius: '50%',
        data,
      },
    ],
  });
};

const normalizeData = (data: unknown) => {
  if (!Array.isArray(data)) {
    return FALLBACK_DATA;
  }
  const converted = data
    .map(item => ({
      name: typeof item?.name === 'string' && item.name ? item.name : '未知',
      value: typeof item?.value === 'number' ? item.value : Number(item?.value) || 0,
    }))
    .filter(item => item.name);
  return converted.length ? converted : FALLBACK_DATA;
};

onMounted(() => {
  if (!chartRef.value) {
    return;
  }
  myChart = echarts.init(chartRef.value);
  myChart.setOption(option);
  if (pendingData) {
    applyDataToChart(pendingData);
    pendingData = null;
  }
});

// 修改 updateOption 函数的参数类型为数组
const updateOption = (data: unknown) => {
  const normalized = normalizeData(data);
  applyDataToChart(normalized);
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
