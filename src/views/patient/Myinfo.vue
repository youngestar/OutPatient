<template>
  <div id="card" class="light-shadow cardHover">
    <h2>我的信息</h2>
    <el-avatar :size="160" :src="'/src/assets/me.png'" style="float: left; margin: 0  50px 0 20px;"></el-avatar>
    <div id="main-msg">
      <div class="left">
        <p><span class="label">姓名:</span><span class="detail">{{ name }}</span></p>
        <p><span class="label">性别:</span><span class="detail">{{ gender }}</span></p>
        <p><span class="label">年龄:</span><span class="detail">{{ age }}</span></p>
        <p><span class="label">地区:</span><span class="detail">{{ id }}</span></p>
        <p><span class="label">详细住址:</span><span class="detail">{{ id }}</span></p>
      </div>
      <div class="right">
        <p><span class="label">手机号:</span><span class="detail">{{ registerTime }}</span></p>
        <p><span class="label">邮箱:</span><span class="detail">{{ department }}</span></p>
        <p><span class="label">身份证号:</span><span class="detail">{{ clinicRoom }}</span></p>
      </div>
    </div>
    <!-- <p><span class="label">症状:</span><span class="detail">{{ description }}</span></p> -->
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { Clock, ShoppingCart, Delete } from '@element-plus/icons-vue';
import { ElAvatar } from 'element-plus';
const props = defineProps({
  num: {
    type: Number,
    required: true,
    default: 1,
  },
  name: {
    type: String,
    required: true,
    default: '默认患者',
  },
  gender: {
    type: String,
    required: true,
    default: '男',
  },
  age: {
    type: Number,
    required: true,
    default: 18,
  },
  id: {
    type: String,
    required: true,
    default: '001',
  },
  description: {
    type: String,
    required: true,
    default: '请阐释症状,例:患者头部发热',
  },
  registerTime: {
    type: String,
    required: true,
    default: '2025-05-01',
  },
  department: {
    type: String,
    required: true,
    default: '内科',
  },
  clinicRoom: {
    type: String,
    required: true,
    default: '门诊1',
  },
  state: {
    type: String,
    required: true,
    default: "待执行",
  },
  note: {
    type: String,
    required: true,
    default: "无",
  },
});
</script>

<style scoped lang="scss">
#card {
  height: 95%;
  width: 96.5%;
  min-width: 400px;
  padding: 20px;
  background-color: vars.$card-bg-depart;
  border-radius: 10px;

  h2 {
    font-size: 40px;
    border-bottom: 1px solid black;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

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
