<script setup lang="ts">
import { ElScrollbar } from 'element-plus';
import RegistrationCard from './RegistrationCard.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const goToDetail = (id: string) => {
  router.push({
    name: "detailRegistrations",
    params: {
      id: id,
    }
  })
}
</script>

<template>
  <el-scrollbar>
    <RegistrationCard @click="goToDetail('1')"></RegistrationCard>
  </el-scrollbar>
</template>

<style></style>
