<template>
  <h2>我的信息</h2>
  <div id="card" class="light-shadow cardHover" v-loading="loading">
    <div id="avatar">
      <input type="file" id="file" @change="handleUP" style="display: none;" />
      <el-avatar :src="myInfo.avatar" :size="160" style="background-color: #fff;"></el-avatar>
      <label for="file">修改头像</label>
      <el-button type="success" size="small" v-if="newAvatar" @click="uploadAvatar"
        style="border: 1px #fff solid; width: 68px; border-radius: 5px; margin: auto; margin-top: 15px;">
        保存修改
      </el-button>
    </div>
    <div id="main-msg">
      <div class="left">
        <p><span class="label">姓名:</span><span class="detail">{{ myInfo.name }}</span></p>
        <p><span class="label">性别:</span><span class="detail">{{ myInfo.gender === 0
          ? '未知'
          : myInfo.gender === 1
            ? '男'
            : myInfo.gender === 2
              ? '女'
              : '错误'
        }}</span></p>
        <p><span class="label">年龄:</span><span class="detail">{{ myInfo.age }}</span></p>
        <p><span class="label">地区:</span><span class="detail">{{ myInfo.region }}</span></p>
        <p><span class="label">详细住址:</span><span class="detail">{{ myInfo.address }}</span></p>
      </div>
      <div class="right">
        <p><span class="label">手机号:</span><span class="detail">{{ myInfo.phone }}</span></p>
        <p><span class="label">邮箱:</span><span class="detail">{{ myInfo.email }}</span></p>
        <p><span class="label">身份证号:</span><span class="detail">{{ myInfo.idCard }}</span></p>
      </div>
    </div>
    <!-- <p><span class="label">症状:</span><span class="detail">{{ myInfo.description }}</span></p> -->
    <el-button type="info" style="position: relative; right: 80px;;width: 15%; margin: 0 45%; margin-top: 120px;"
      @click="() => { dialogTableVisible = true }">修改个人资料
    </el-button>
    <el-dialog v-model="dialogTableVisible" title="请填写更新后用户信息" width="800">
      <UserForm @submit="changeInfo"></UserForm>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { getUesrInfo, updateUserAvatar } from '@/api/patient/myInfo';
import { ElAvatar, ElMessage } from 'element-plus';
import UserForm from './UserForm.vue';

const dialogTableVisible = ref(false);
const loading = ref(true);
const newAvatar = ref(false);
const myInfo = reactive({
  avatar: '/src/assets/me.png',
  name: '默认患者',
  gender: 1,
  age: 18,
  region: '默认地区',
  address: '默认地址',
  phone: '默认手机号',
  email: '默认邮箱',
  idCard: '默认身份证号',
})

const handleUP = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
    ElMessage.error('不支持该文件类型，请选择 JPEG、PNG 格式的图片');
    return;
  }

  // 文件大小检查（这里假设最大文件大小为 2MB）
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    ElMessage.error('文件大小超过限制，请选择小于 2MB 的图片');
    return;
  }
  myInfo.avatar = URL.createObjectURL(file);
  newAvatar.value = true;
}

const uploadAvatar = async () => {
  const file = (document.getElementById('file') as HTMLInputElement).files?.[0];
  if (!file) return;
  updateUserAvatar(file).then((res) => {
    if (res) {
      ElAvatar.src = URL.createObjectURL(file);
      ElAvatar.alt = '头像';
      newAvatar.value = false;
      ElMessage.success('头像修改成功');
    }
  }).catch((err) => {
    console.error(err);
  });
}

const changeInfo = (formData) => {
  Object.assign(myInfo, formData);
}

onMounted(async () => {
  const getInfo = await getUesrInfo();
  loading.value = false;
  Object.assign(myInfo, getInfo);
})
</script>

<style scoped lang="scss">
h2 {
  font-size: 40px;
  border-bottom: 1px solid black;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

#card {
  height: 95%;
  width: 96.5%;
  min-width: 400px;
  padding: 20px;
  background-color: vars.$card-bg-depart;
  border-radius: 10px;

  #avatar {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    float: left;
    margin-left: 20px;
    margin-right: 60px;

    label {
      cursor: pointer;
      margin: auto;
      margin-top: 15px;
      width: 80px;
      height: 30px;
      background-color: #409eff;
      color: #fff;
      line-height: 30px;
      border-radius: 8px;
      border: #fff 1px solid;
      text-align: center;
      font-weight: bolder;
      font-size: 14px;

      &:hover {
        background-color: #66b1ff;
      }
    }
  }

  #main-msg {
    display: flex;

    .right {
      margin-left: 30%;
      width: 40%;
    }
  }

  p {
    display: flex;
    font-size: 20px;
    margin: 50px 0;

    .label {
      max-width: 100px;
      text-align: left;
    }

    .detail {
      font-weight: bold;
      margin-left: 20px;
    }
  }
}
</style>
