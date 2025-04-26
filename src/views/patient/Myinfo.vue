<template>
  <h2>我的信息</h2>
  <div id="card" class="light-shadow cardHover" v-loading="loading">
    <el-avatar :size="160" :src="myInfo.avatar" style="float: left; margin: 0  50px 0 20px;"></el-avatar>
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
        <p><span class="label">身份证号:</span><span class="detail">{{ myInfo.IDCard }}</span></p>
      </div>
    </div>
    <!-- <p><span class="label">症状:</span><span class="detail">{{ myInfo.description }}</span></p> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { getUesrInfo } from '@/api/patient/myInfo';
import { ElAvatar } from 'element-plus';

const loading = ref(true);
const myInfo = reactive({
  avatar: '/src/assets/me.png',
  name: '默认患者',
  gender: 1,
  age: 18,
  region: '默认地区',
  address: '默认地址',
  phone: '默认手机号',
  email: '默认邮箱',
  IDCard: '默认身份证号',
})

onMounted(async () => {
  const getInfo: object = await getUesrInfo();
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

  #main-msg {
    display: flex;

    .right {
      margin-left: 30%;
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
