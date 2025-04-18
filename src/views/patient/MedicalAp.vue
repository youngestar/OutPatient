<template>
  <div class="medical-ap">
    <ApTop></ApTop>
    <div style="flex: 1;">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ApTop from '@/components/ApTop.vue'
import { RouterView } from 'vue-router'
</script>

<style lang="scss" scoped>
.medical-ap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
