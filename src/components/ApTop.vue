<template>
  <div class="ap-top">
    <el-button type="primary" @click="backpage">科室</el-button>
    <el-button type="primary" @click="backpage">门诊</el-button>
    <el-button type="primary" @click="backpage">医生</el-button>
  </div>
</template>

<script lang="ts" setup>

const backpage = () => {
  console.log('backpage')
}

</script>

<style lang="scss" scoped>
.ap-top{
  height: 2rem;
  width: 100px;
  margin: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>