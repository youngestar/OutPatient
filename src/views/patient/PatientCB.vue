<template>
  <div class="patient-cb">
    <CallComuni></CallComuni>
    <MedicalAdvice></MedicalAdvice>
  </div>
</template>

<script lang="ts" setup>
import MedicalAdvice from '@/components/CallBAck/MedicalAdvice.vue'
import CallComuni from '@/components/CallBAck/CallComuni.vue'

</script>

<style lang="scss" scoped>
.patient-cb{
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
</style>