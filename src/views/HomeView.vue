<script setup>
import { RouterLink } from 'vue-router';
import LogIn from '@/components/LogIn.vue';
import { reactive } from 'vue';
import RegiSter from '@/components/RegiSter.vue';
const data = reactive({
  isShow:'login'
})
const handleT = (mess) =>{
    data.isShow = mess
}

</script>

<template>
  <div class="Index">
    INDE
    <router-link to="/">home</router-link>
    <router-link to="/patient">patient</router-link>
    <router-link to="/doctor">doctor</router-link>
    <router-link to="/admin">admin</router-link>
    <div class="login">
      <log-in @turnLoR="handleT" v-show="data.isShow === 'login'"></log-in>
       <regi-ster @turnLoR="handleT" v-show="data.isShow === 'register'" ></regi-ster>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Index{
  width: 100vw;
  height: 100vh;
}
.login{
  width: 500px;
  height: 400px;
  padding:1rem;
  background: vars.$card-bg;
  border-radius: 1rem;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%,-40%);
}
</style>