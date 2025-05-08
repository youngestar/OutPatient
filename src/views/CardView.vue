<template>
  <div class="card-view">
    <component v-for="(card) in paginatedData" :key="card" :is="props.myCard"
      v-bind="typeof card === 'object' ? card : {}" @click="handleclick(card)" />
    <el-pagination class="add-card" layout="prev, pager, next" background size="large"
      v-model:current-page="currentPage" :total="props.cardsprops.length" :page-size="pageSize"
      v-show="props.cardsprops.length >= pageSize" />
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, computed } from 'vue';
import { ref } from 'vue';

// 分页组件相关
const currentPage = ref(1);
const pageSize = ref(12); // 每页显示的数量
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return props.cardsprops.slice(start, end);
});

const props = defineProps({
  myCard: {
    type: Object,
    required: true
  },
  cardsprops: {
    type: Array,
    required: true
  },
});

const emit = defineEmits(['backpage', 'nextpage', 'handleclick']);
const handleclick = (item: any) => {
  emit('handleclick', item);
}

</script>

<style lang="scss" scoped>
.card-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  row-gap: 20px;
  column-gap: 4%;
}

.add-card {
  width: 100%;
  position: relative;
  right: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px auto;
  margin-bottom: 10px;
  gap: 5%;
}
</style>
