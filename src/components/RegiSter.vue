<script setup>
import { DoAxios, DoAxiosWithErro } from '@/api';
import { reactive, ref , defineEmits} from 'vue'
import { ElMessage } from 'element-plus';
//   import { FormInstance, FormRules } from 'element-plus' // 不需要类型导入

const ruleFormRef = ref('')
const isfetching = ref(false);

const sendButton = reactive({
  value:"发送请求",
  refresh:0,
  disable:false
})

const ruleForm = reactive({
  pass: '',
  checkPass: '',
  name:'',
  email:'',
  checkcode:''
})
const emit = defineEmits(["turnLoR"])

const handleturn = () => {
  emit('turnLoR','login');
}

const handleSend = async () => {
  const fromData = new FormData();
  sendButton.disable = true;
  try{
    fromData.append('to',ruleForm.email)
    const response = await DoAxios('/api/users/email','post',fromData,false);
    console.log(response)
    ElMessage({
      message:'发送成功',
      type:'success'
    })
    sendButton.disable = true;
    sendButton.refresh = 60;
    sendButton.value = '重发'
    const timer = setInterval(()=>{
      sendButton.refresh = sendButton.refresh - 1;
      if(sendButton.refresh === 0) {
        clearInterval(timer);
        sendButton.value = '重新发送'
        sendButton.disable = false;
      }
    },1000);
  } catch(e){
    sendButton.disable = false;
    ElMessage({
      message:e,
      type:'error'
    })
  }
} 

const checkName = (rule,value,callback) => {
  if(!value) {
   return callback(new Error("请输入昵称"))
  }
  DoAxios('/api/users/IsExists','get',{
    type:'username',
    value
  }).then(()=> {
    callback();
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
  DoAxios('/api/users/IsExists', 'get', {
    type: 'email',
    value
  })
  .then(()=>{
    callback();
  })
  .catch(err => {
    callback(err);
  })
};





const checkCode = (rule,value,callback) => {
  if(value === '') {
    return callback(new Error("请输入验证码"))
  }
  callback();
}

const validatePass = (rule, value, callback) => {
  const reg = /^(?=.*[a-zA-Z])(?=.*[\d])[a-zA-Z\d]{6,10}$/;
  if (value === '') {
    return callback(new Error('Please input the password'));
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
    callback(new Error('Please input the password again'))
  } else if (value !== ruleForm.pass) {
    callback(new Error("Two inputs don't match!"))
  } else {
    callback()
  }
}



const rules = reactive({
  pass: [{ validator: validatePass, trigger: 'change' }],
  checkPass: [{ validator: validatePass2, trigger: 'change' }],
  name: [{validator: checkName, trigger:"blur"}],
  email:[{validator:checkEmail,trigger:"blur"}],
  checkcode:[{validator:checkCode,trigger:'change'}]
})

const submitForm = () => {
  console.log("tiger")
  const formEl = ruleFormRef.value;
  if (!formEl) {
    console.log("undefind is err");
    return;
  }
  formEl.validate(async(valid) => {
    if (valid) {
      const formdata = new FormData();
      formdata.append('logName',ruleForm.name)
      formdata.append('password',ruleForm.pass)
      formdata.append('email',ruleForm.email)
      formdata.append('checkCode',ruleForm.checkcode)
      isfetching.value = true
      await DoAxiosWithErro('/api/users/register','post',formdata,false).finally(()=> {
        isfetching.value = false
      });
      ElMessage({
        message:'注册成功！',
        type:'success'
      })
      handleturn();
    }
  })
}

const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}

const sendMessage = async () => {
  const formEl = ruleFormRef.value;
  const validateList = ['email','name'];

  const validationPromises = validateList.map(item => {
    return new Promise((resolve, reject) => {
      formEl.validateField(item, (validata) => {
        console.log(validata); // 打印验证结果
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
      <el-form
      ref="ruleFormRef"
      style="max-width: 600px; padding: 0 2rem;"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
    >
      <el-form-item label="昵称" prop="name">
        <el-input v-model="ruleForm.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input v-model="ruleForm.pass" type="password" show-password autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码确认" prop="checkPass">
        <el-input
          v-model="ruleForm.checkPass"
          type="password"
          show-password
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email" autocomplete="off" />
      </el-form-item>
      <el-form-item class="checkcode" label="验证码" prop="checkcode">
        <el-input class="code"  v-model="ruleForm.checkcode" autocomplete="off" />
        <el-button class="but" @click="sendMessage" :disabled="sendButton.disable">
          <span v-show="sendButton.disable && sendButton.refresh">{{ sendButton.refresh }}秒后</span>
          {{ sendButton.value }}
        </el-button>
      </el-form-item>
      <el-form-item class="sub">
        <el-button type="primary" @click="submitForm" :disabled="isfetching">
          注册
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="turn">已有账号，请前往<el-link @click="handleturn" class="link" type="primary">登录</el-link></div>
  </div>
</template>

<style lang="scss" scoped>
.login{
  font-weight: bolder;
  text-shadow: 1px 1px 1px rgb(232, 230, 228);
  h3{
      font-size: 2rem;
      font-weight: bold;
      margin:0.5rem 0 1rem 0;
      text-align: center;
  }
  .sub{
    padding:0.5rem 32%;
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
  .checkcode{
    .but{
      position: absolute;
      right: 5rem;
    }
    .code{
      width: 200px;
    }
  }
}
</style>