<template>
  <div class="ap-top">
    <el-button type="primary" @click="backpage">上一级</el-button>
    <el-button type="primary" @click="backpage">添加</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ElButton } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const backpage = () => {
  if (route.params.department) {
    router.back()
  } else {
    router.push({
      name: 'home',
    })
  }
}
</script>

<style lang="scss" scoped>
.ap-top {
  height: 2rem;
  width: 85%;
  margin: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
