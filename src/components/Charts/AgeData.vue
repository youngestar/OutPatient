<template>
  <div ref="chartRef" style="width: 600px; height: 400px;"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
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

onMounted(() => {
  if (chartRef.value) {
    // 仅在组件挂载时初始化一次 ECharts 实例
    myChart = echarts.init(chartRef.value);
    myChart.setOption(option);
  }
});

// 修改 updateOption 函数的参数类型为数组
const updateOption = (data: { value: number; name: string }[]) => {
  if (!myChart) {
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

defineExpose({
  updateOption
});
</script>

<style scoped></style>
