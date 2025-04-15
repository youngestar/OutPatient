<template>
  <div class="card-view">
    <component v-for="(card, index) in props.cardsprops" :key="index" :is="props.myCard" v-bind="cardsprops[index]"
      @click="handleclick(cardsprops[index])" />
    <div class="add-card">
      <el-button type="primary" circle style="font-size: 20px;" @click="backpage">
        {{ "<" }} </el-button>
          <el-button type="primary" circle style="font-size: 20px;" @click="nextpage">></el-button>
    </div>

  </div>
</template>

<script lang="ts" setup>
import CbOpCard from '@/components/CbOpCard.vue';
import DepartmentCard from '@/components/DepartmentCard.vue';
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs';
import { defineProps, defineEmits } from 'vue';

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

const backpage = () => {
  emit('backpage');
}

const nextpage = () => {
  emit('nextpage');
}

const handleclick = (item) => {
  emit('handleclick', item);
}

</script>

<style lang="scss" scoped>
.card-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  row-gap: 1%;
  column-gap: 4%;
}

.add-card {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10%;
}
</style>
