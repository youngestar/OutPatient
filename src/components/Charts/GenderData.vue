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
let myChart: echarts.ECharts | null = null;

// 为每个柱子配置不同的颜色
const barColors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622'];

const option: EChartsOption = {
  title: {
    text: '患者性别分布',
    left: 'center'
  },
  xAxis: {
    type: 'value'
  },
  yAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  series: [
    {
      data: [],
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

onMounted(() => {
  if (chartRef.value) {
    myChart = echarts.init(chartRef.value);
    myChart.setOption(option);
  }
});

// 修改 frequencyOption 函数的参数类型为数组
const updateOption = (names: string[], values: number[]) => {
  if (myChart) {
    option.yAxis.data = names;
    option.series[0].data = values;
    // 直接使用已初始化的 ECharts 实例更新配置
    myChart.setOption(option);
  }
};

defineExpose({
  updateOption
});

</script>

<style scoped></style>
