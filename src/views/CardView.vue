<template>
  <section class="card-view">
    <component v-for="card in paginatedData" :key="card" :is="props.myCard"
      v-bind="typeof card === 'object' ? card : {}" @click="handleclick(card)" />
    <el-pagination class="card-pagination" layout="prev, pager, next" background size="large"
      v-model:current-page="currentPage" :total="props.cardsprops.length" :page-size="pageSize"
      v-show="props.cardsprops.length >= pageSize" />
  </section>
</template>

<script lang="ts" setup>
import { type Component, type PropType, computed, defineEmits, defineProps, ref } from 'vue';

// 分页组件相关
const currentPage = ref(1);
const pageSize = ref(12); // 每页显示的数量
const paginatedData = computed<CardPayload[]>(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return props.cardsprops.slice(start, end);
});

const props = defineProps({
  myCard: {
    type: Object as PropType<Component>,
    required: true
  },
  cardsprops: {
    type: Array as PropType<CardPayload[]>,
    required: true
  },
});

type CardPayload = Record<string, unknown> | string | number | boolean | null | undefined;

const emit = defineEmits(['backpage', 'nextpage', 'handleclick']);
const handleclick = (item: CardPayload) => {
  emit('handleclick', item);
}

</script>

<style lang="scss" scoped>
.card-view {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.card-pagination {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: var(--space-4);
}
</style>
