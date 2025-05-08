<template>
  <el-input v-model="doctorName" style="width: 240px;height: 40px;" placeholder="搜索医生" :prefix-icon="Search"
    @keyup.enter="searchDoctor" />
  <el-button type="primary" style="height: 40px;" @click="searchDoctor">
    <el-icon size="large">
      <Search />
    </el-icon>
  </el-button>
  <CardView style="height: 100%; min-height: 100vh;" v-loading="loading"
    :cardsprops="doctors.map((item) => { return { ...item, cardType: 'admin' } })" :myCard="DoctorCard">
  </CardView>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import CardView from '@/views/CardView.vue'
import { useHospitalStore } from '@/stores/hospitalData'
import { ElInput, ElIcon } from 'element-plus'
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router'
const doctorName = ref('');
const hospitalStore = useHospitalStore();
const loading = ref(true);
const route = useRoute();
const doctors = hospitalStore.doctors;

const searchDoctor = () => {
  // if (doctorName.value === '') {
  //   hospitalStore.getAllDoctors();
  // } else {
  //   hospitalStore.getDoctorByName(doctorName.value);
  // }
}

onMounted(async () => {
  // hospitalStore.getAllDoctors().then((res) => {
  //   console.log(res)
  // }).catch((err) => {
  //   console.error(err);
  // });
  // loading.value = false;
})
</script>

<style lang="scss" scoped>
.medical-ap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
