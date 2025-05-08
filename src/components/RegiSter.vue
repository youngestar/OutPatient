<script setup>
import { DoAxios, DoAxiosWithErro } from '@/api';
import { reactive, ref, defineEmits } from 'vue'
import { ElMessage } from 'element-plus';
import axios from 'axios';
//   import { FormInstance, FormRules } from 'element-plus' // 不需要类型导入

const ruleFormRef = ref('')
const isfetching = ref(false);
const isdetailed = ref(true);

const sendButton = reactive({
  value: "发送请求",
  refresh: 0,
  disable: false
})

const ruleForm = reactive({
  pass: '',
  checkPass: '',
  username: '',
  email: '',
  checkcode: '',
  phone: '',
  idCard: '',
  name: '',
  address: '',
  gender: '',
  region: ''
})
const emit = defineEmits(["turnLoR"])

const handleturn = () => {
  emit('turnLoR', 'login');
}

const handleSend = async () => {
  sendButton.disable = true;
  try {
    await DoAxios(`/auth/email`, 'get', {
      email: ruleForm.email
    }, false);
    ElMessage({
      message: '发送成功',
      type: 'success'
    })
    sendButton.disable = true;
    sendButton.refresh = 60;
    sendButton.value = '重发'
    const timer = setInterval(() => {
      sendButton.refresh = sendButton.refresh - 1;
      if (sendButton.refresh === 0) {
        clearInterval(timer);
        sendButton.value = '重新发送'
        sendButton.disable = false;
      }
    }, 1000);
  } catch (e) {
    sendButton.disable = false;
    ElMessage({
      message: e,
      type: 'error'
    })
  }
}

const checkUserName = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入昵称"))
  }
  DoAxios('/auth/IsExists', 'get', {
    username: value
  }, false).then((res) => {
    if(!res) {
      callback();
    } else {
      callback(new Error("该昵称已被注册"))
    }
  }).catch(rject => {
    callback(rject);
  })
}

const checkEmail = (rule, value, callback) => {
  const reg = /^[0-9A-Za-z._%]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/;

  // 如果没有输入值，提示“请输入绑定邮箱”
  if (!value) {
    return callback(new Error("请输入绑定邮箱"));
  }

  // 如果邮箱格式不正确，提示“请输入正确的邮箱地址”
  if (!reg.test(value)) {
    return callback(new Error("请输入正确的邮箱地址"));
  }

  // 异步请求，检查邮箱是否已注册
  DoAxios('/auth/IsExists', 'get', {
    value
  })
    .then((res) => {
      console.log(res);
      callback();
    })
    .catch(err => {
      callback(err);
    })
};





const checkCode = (rule, value, callback) => {
  if (value === '') {
    return callback(new Error("请输入验证码"))
  }
  callback();
}

const checkPhone = (rule, value, callback) => {
  const reg = /^1[23456789]\d{9}$/;
  if (value === '') {
    return callback(new Error("请输入手机号"))
  }
  if (!reg.test(value)) {
    return callback(new Error("请输入正确的手机号"))
  }
  callback();
}

const checkIDcard = (rule, value, callback) => {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (value === '') {
    return callback(new Error("请输入身份证号"))
  }
  if (!reg.test(value)) {
    return callback(new Error("请输入正确的身份证号"))
  }
  callback();
}

const checkName = (rule, value, callback) => {
  if (value === '') {
    return callback(new Error("请输入姓名"))
  }
  callback();
}

const checkAddress = (rule, value, callback) => {
  if (value === '') {
    return callback(new Error("请输入地址"))
  }
  callback();
}

const checkGender = (rule, value, callback) => {
  if (value === '') {
    return callback(new Error("请选择性别"))
  }
  callback();
}

const checkRegion = (rule, value, callback) => {
  if (value === '') {
    return callback(new Error("请选择地区"))
  }
  callback();
}

const checkAge = (rule, value, callback) => {
  if (value === '') {
    return callback(new Error("请输入年龄"))
  }
  if (value > 200 && value < 0) {
    return callback(new Error("请输入正确的"))
  }
  callback();
}

const validatePass = (rule, value, callback) => {
  const reg = /^(?=.*[a-zA-Z])(?=.*[\d])[a-zA-Z\d]{6,10}$/;
  if (value === '') {
    return callback(new Error('请输入密码'));
  }
  if (!reg.test(value)) {
    return callback(new Error("密码是至少各包含一个数字和英文的8位字符串"));
  }
  if (ruleForm.checkPass !== '') {
    ruleFormRef.value?.validateField("checkPass");
  }
  callback();
};


const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== ruleForm.pass) {
    callback(new Error("两次输入密码不一致!"))
  } else {
    callback()
  }
}



const rules = reactive({
  pass: [{ validator: validatePass, trigger: 'change' }],
  checkPass: [{ validator: validatePass2, trigger: 'change' }],
  username: [{ validator: checkUserName, trigger: "blur" }],
  email: [{ validator: checkEmail, trigger: "blur" }],
  checkcode: [{ validator: checkCode, trigger: 'change' }],
  phone: [{ validator: checkPhone, trigger: 'change' }],
  idCard: [{ validator: checkIDcard, trigger: 'change' }],
  name: [{ validator: checkName, trigger: 'change' }],
  address: [{ validator: checkAddress, trigger: 'change' }],
  gender: [{ validator: checkGender, trigger: 'change' }],
  region: [{ validator: checkRegion, trigger: 'change' }],
  age: [{ validator: checkAge, trigger: 'change' }]
})

const submitForm = () => {
  const formEl = ruleFormRef.value;
  if (!formEl) {
    console.log("undefind is err");
    return;
  }
  formEl.validate(async (valid) => {
    if (valid) {
      const formdata = {
        username: ruleForm.username,
        password: ruleForm.pass,
        email: ruleForm.email,
        verifyCode: ruleForm.checkcode,
        phone: ruleForm.phone,
        idCard: ruleForm.idCard,
        name: ruleForm.name,
        address: ruleForm.address,
        gender: ruleForm.gender,
        region: ruleForm.region,
        age: ruleForm.age
      }
      isfetching.value = true
      console.log(formdata);
      await DoAxiosWithErro('/auth/register', 'post', formdata, false).finally(() => {
        isfetching.value = false
      });
      ElMessage({
        message: '注册成功！',
        type: 'success'
      })
      handleturn();
    }
  })
}

const resetForm = (formEl) => {
  if (!formEl) return
  isdetailed.value = true;
  formEl.resetFields()
}

const sendMessage = async () => {
  const formEl = ruleFormRef.value;
  const validateList = ['email', 'name'];

  const validationPromises = validateList.map(item => {
    return new Promise((resolve, reject) => {
      formEl.validateField(item, (validata) => {
        if (validata) {
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
  });

  Promise.all(validationPromises).then(() => {
    
    handleSend();  // 验证通过后发送消息
  })
};


</script>

<template>
  <div class="login">
    <h3>注册</h3>
    <el-form ref="ruleFormRef" style="max-width: 600px; padding: 0 2rem;" :model="ruleForm" status-icon :rules="rules"
      label-width="auto" class="demo-ruleForm">
      <el-form-item v-show="!isdetailed" label="姓名" prop="name">
        <el-input v-model="ruleForm.name" autocomplete="off" />
      </el-form-item>
      <el-form-item v-show="!isdetailed" label="年龄" prop="age">
        <el-input-number v-model="ruleForm.age" :min="0" :max="150" />
      </el-form-item>
      <el-form-item v-show="!isdetailed" label="身份证号" prop="idCard">
        <el-input v-model="ruleForm.idCard" autocomplete="off" />
      </el-form-item>
      <el-form-item v-show="!isdetailed" label="地区" prop="region">
        <el-input v-model="ruleForm.region" autocomplete="off" />
      </el-form-item>
      <el-form-item v-show="!isdetailed" label="详细地址" prop="address">
        <el-input v-model="ruleForm.address" autocomplete="off" />
      </el-form-item>
      <el-form-item v-show="!isdetailed" label="邮箱" prop="email">
        <el-input v-model="ruleForm.email" autocomplete="off" />
      </el-form-item>
      <el-form-item v-show="!isdetailed" class="checkcode" label="验证码" prop="checkcode">
        <el-input class="code" v-model="ruleForm.checkcode" autocomplete="off" />
        <el-button class="but" @click="sendMessage" :disabled="sendButton.disable">
          <span v-show="sendButton.disable && sendButton.refresh">{{ sendButton.refresh }}秒后</span>
          {{ sendButton.value }}
        </el-button>
      </el-form-item>
      <el-form-item v-show="isdetailed" label="昵称" prop="username">
        <el-input v-model="ruleForm.username" autocomplete="off" />
      </el-form-item>
      <el-form-item v-show="isdetailed" label="性别" prop="gender">
        <el-radio-group v-model="ruleForm.gender">
          <el-radio label=1>男</el-radio>
          <el-radio label=2>女</el-radio>
          <el-radio label=0>未知</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="isdetailed" label="密码" prop="pass">
        <el-input v-model="ruleForm.pass" type="password" show-password autocomplete="off" />
      </el-form-item>
      <el-form-item v-show="isdetailed" label="密码确认" prop="checkPass">
        <el-input v-model="ruleForm.checkPass" type="password" show-password autocomplete="off" />
      </el-form-item>
      <el-form-item v-show="isdetailed" label="手机号" prop="phone">
        <el-input v-model="ruleForm.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item class="sub">
        <el-button v-if="!isdetailed" type="primary" @click="submitForm" :disabled="isfetching">
          注册
        </el-button>
        <el-button v-if="isdetailed" type="primary" @click="isdetailed = !isdetailed">完成</el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="turn">已有账号，请前往<el-link @click="handleturn" class="link" type="primary">登录</el-link></div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  font-weight: bolder;
  text-shadow: 1px 1px 1px rgb(232, 230, 228);

  h3 {
    font-size: 2rem;
    font-weight: bold;
    margin: 0.5rem 0 1rem 0;
    text-align: center;
  }

  .sub {
    padding: 0.5rem 32%;
  }

  .turn {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
  }

  .link {
    margin: 0 0 5px 2px;
    font-size: 1rem;
  }

  .checkcode {
    .but {
      position: absolute;
      right: 5rem;
    }

    .code {
      width: 200px;
    }
  }
}
</style>
