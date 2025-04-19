<script lang="ts" setup>
import { useUserStore } from '@/stores/user';
import { reactive, defineEmits, ref } from 'vue'
import { useRouter } from 'vue-router';

const Login = ref(null);
const logining = ref(false);
const router = useRouter();
const userstor = useUserStore();

// do not use same name with ref
const form = reactive({
  name: '',
  password: undefined,
})
const emit = defineEmits(['turnLoR'])

const handelturn = () => {
  emit('turnLoR','register')
}

const handleLogin = async () => {
  if(logining.value) return;
  try{
    const userInfo = {
      account:form.name as string,
      password:form.password as string
    };
    logining.value = true;
    await userstor.login(userInfo);
    if(userstor.isLoggedIn && userstor.userInfo.role === 0){
      router.push({name:'patient'});
      return
    }
    if(userstor.isLoggedIn && userstor.userInfo.role === 1){
      router.push({name:'doctor'});
      return
    }
    if(userstor.isLoggedIn && userstor.userInfo.role === 2){
      router.push({name:'admin'});
      return
    }
  }  finally {
    logining.value = false;
  }
  
}
</script>
<template>
    <div class="login">
        <h3>登录</h3>
        <el-form ref="Login" :model="form" label-width="auto" style="max-width: 600px; padding: 0 2rem;">
            <el-form-item label="昵称">
                <el-input  v-model="form.name" />
            </el-form-item>
            <el-form-item label="密码" prop="pass">
                <el-input show-password v-model="form.password" type="password" />
            </el-form-item>
            <div class="button">
                <el-button :disabled="logining" @click="handleLogin" class="sub" type="primary" :loading="false">
                Submit
                </el-button>
            </div>
        </el-form>
        <div class="turn">还没有账号？请前往<el-link @click="handelturn" class="link" type="primary">注册</el-link></div>
    </div>
  </template>
  

  <style lang="scss" scoped>
  .login{
    // padding: 4rem;
    font-weight: bolder;
    text-shadow: 1px 1px 1px rgb(232, 230, 228);
    h3{
        font-size: 2rem;
        font-weight: bold;
        margin:2rem 0;
        text-align: center;
    }
    .button{
      width: 100%;
      display: flex;
      justify-content: center;
    }
    .sub{
        width:6rem;
        height: 2rem;
    }
    .turn{
      position: absolute;
      right: 1rem;
      bottom: 1rem;
    }
    .link{
      margin:0 0 5px 2px;
      font-size: 1rem;
    }
  }
  </style>