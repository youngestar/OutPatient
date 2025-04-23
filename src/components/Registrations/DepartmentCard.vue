<template>
  <CardView v-loading="loading" @handleclick="handleclick" style="text-align: center;" :cardsprops="departs"
    :myCard="DepartCard">
  </CardView>
</template>

<script lang="ts" setup>
import { getDepartmentRegistrations } from '@/api/patient/registrations';
import DepartCard from '@/components/DepartCard.vue'
import CardView from '@/views/CardView.vue'
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router'
import { type department } from '@/api/patient/registrations';

const loading = ref(true);
const router = useRouter();
const departs = reactive([

]);

const handleclick = (department: department) => {
  router.push({
    name: "clinic",
    params: {
      department: department.name,
    },
    query: {
      departmentName: department.name,
      departmentId: department.id,
    }
  })
}

onMounted(async () => {
  const newDepartments = await getDepartmentRegistrations();
  loading.value = false;
  Object.assign(departs, newDepartments);
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
