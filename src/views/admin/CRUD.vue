<template>
  <el-scrollbar>
    <div class="medical-ap">
      <ApCrudTop></ApCrudTop>
      <div style="flex: 1;">
        <RouterView></RouterView>
      </div>
    </div>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import ApCrudTop from '@/components/Admin/ApCrudTop.vue'
import { RouterView } from 'vue-router'
import { ElScrollbar } from 'element-plus';
</script>

<style lang="scss" scoped>
.medical-ap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
