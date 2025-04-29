<template>
  <div class="department-card">
    <h3 class="department-title">{{ props.name }}</h3>
    <div class="department-content">
      <p v-if="props.state === 0" style="color:#FF3B30; font-weight: bold;">暂时关闭</p>
      <p v-else-if="props.state === 1" style="font-weight: bold;">
        正常开放</p>
      <p v-else>发生故障</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 这里可以添加逻辑代码
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  state: {
    type: Number,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.department-card {
  cursor: pointer;
  width: 300px;
  height: 200px;
  background: vars.$card-bg-depart;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.department-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #303133;
  text-align: center;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
}

.department-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #606266;
}
</style>
