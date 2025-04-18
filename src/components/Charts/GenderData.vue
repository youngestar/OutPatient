<template>
  <div ref="chartRef" style="width: 600px; height: 400px;"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts/core';
import { GridComponent, type GridComponentOption } from 'echarts/components';
import { LineChart, type LineSeriesOption } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// 注册 ECharts 组件
echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);

// 定义 ECharts 选项类型
type EChartsOption = echarts.ComposeOption<
  GridComponentOption | LineSeriesOption
>;

// 引用 DOM 元素
const chartRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (chartRef.value) {
    // 初始化 ECharts 实例
    const myChart = echarts.init(chartRef.value);

    // 定义 ECharts 配置选项
    const option: EChartsOption = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true
        }
      ]
    };

    // 设置 ECharts 选项
    myChart.setOption(option);
  }
});
</script>
