<template>
  <div ref="chartRef" style="width: 600px; height: 400px;"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
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

onMounted(() => {
  if (chartRef.value) {
    const myChart = echarts.init(chartRef.value);

    // 为每个柱子配置不同的颜色
    const barColors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622'];

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
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          itemStyle: {
            normal: {
              color: function (params) {
                return barColors[params.dataIndex];
              }
            }
          }
        }
      ]
    };

    myChart.setOption(option);
  }
});
</script>

<style scoped></style>
