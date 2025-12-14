<template>
  <div class="profile-page main-shell utility-gap" v-loading="loading">
    <header class="page-head">
      <div>
        <p class="eyebrow">PROFILE</p>
        <h2>我的信息</h2>
      </div>
      <el-button type="primary" @click="openEdit">修改个人资料</el-button>
    </header>

    <section class="profile-card surface-card">
      <div class="avatar-panel">
        <input type="file" id="file" @change="handleUP" style="display: none;" />
        <el-avatar :src="myInfo.avatar" :size="150" class="avatar"></el-avatar>
        <label for="file" class="upload-btn">修改头像</label>
        <el-button v-if="newAvatar" type="success" plain size="small" @click="uploadAvatar">保存修改</el-button>
      </div>

      <div class="info-panel">
        <div class="info-col">
          <div class="field"><span class="label">姓名</span><span class="value">{{ myInfo.name }}</span></div>
          <div class="field"><span class="label">性别</span><span class="value">{{ myInfo.gender === 0 ? '未知' :
            myInfo.gender === 1 ? '男' : myInfo.gender === 2 ? '女' : '错误' }}</span></div>
          <div class="field"><span class="label">年龄</span><span class="value">{{ myInfo.age }}</span></div>
          <div class="field"><span class="label">地区</span><span class="value">{{ myInfo.region }}</span></div>
          <div class="field"><span class="label">详细住址</span><span class="value">{{ myInfo.address }}</span></div>
        </div>
        <div class="info-col">
          <div class="field"><span class="label">手机号</span><span class="value">{{ myInfo.phone }}</span></div>
          <div class="field"><span class="label">邮箱</span><span class="value">{{ myInfo.email }}</span></div>
          <div class="field"><span class="label">身份证号</span><span class="value">{{ myInfo.idCard }}</span></div>
        </div>
      </div>
    </section>

    <el-dialog v-model="dialogTableVisible" title="请填写新的信息" width="800" @closed="clearEditInitial">
      <UserForm :initial="editInitial" @submit="changeInfo"></UserForm>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { getUesrInfo, updateUserAvatar } from '@/api/patient/myInfo';
import { ElAvatar, ElMessage } from 'element-plus';
import UserForm from './UserForm.vue';

defineOptions({
  name: 'PatientMyInfoView',
});

interface MyInfoState {
  avatar: string;
  name: string;
  gender: number;
  age: number;
  region: string;
  address: string;
  phone: string;
  email: string;
  idCard: string;
}

type EditableInfo = Pick<MyInfoState, 'name' | 'gender' | 'age' | 'region' | 'address' | 'phone' | 'idCard'>;

const dialogTableVisible = ref(false);
const loading = ref(true);
const newAvatar = ref(false);
const editInitial = ref<EditableInfo | null>(null);
const myInfo = reactive<MyInfoState>({
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

const openEdit = () => {
  editInitial.value = {
    name: myInfo.name,
    gender: myInfo.gender,
    age: myInfo.age,
    region: myInfo.region,
    address: myInfo.address,
    phone: myInfo.phone,
    idCard: myInfo.idCard,
  };
  dialogTableVisible.value = true;
}

const clearEditInitial = () => {
  editInitial.value = null;
}

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

const changeInfo = (formData: EditableInfo) => {
  Object.assign(myInfo, formData);
  dialogTableVisible.value = false;
}

onMounted(async () => {
  const getInfo = await getUesrInfo();
  loading.value = false;
  Object.assign(myInfo, getInfo);
})
</script>

<style scoped lang="scss">
.profile-page {
  width: 100%;
  min-height: 100%;
}

.profile-card {
  display: flex;
  gap: var(--space-6);
  align-items: flex-start;
  box-sizing: border-box;
}

.avatar-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: center;
  text-align: center;
  min-width: 220px;

  .avatar {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }

  .upload-btn {
    cursor: pointer;
    display: inline-block;
    margin-top: 0.5rem;
    padding: 0.4rem 0.9rem;
    background: var(--color-primary);
    color: #fff;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.7);
    font-weight: 600;
    transition: transform 0.15s ease, filter 0.15s ease;

    &:hover {
      filter: brightness(1.05);
      transform: translateY(-1px);
    }
  }
}

.info-panel {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-6);
}

.info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: var(--space-3) 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
}

.label {
  width: 88px;
  flex: 0 0 88px;
  color: var(--color-text-muted);
  font-weight: 600;
}

.value {
  color: var(--color-text);
  font-weight: 600;
  word-break: break-word;
}

@media (max-width: 768px) {
  .profile-card {
    flex-direction: column;
    gap: var(--space-4);
  }

  .avatar-panel {
    min-width: unset;
    width: 100%;
  }

  .info-panel {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }

  .label {
    width: 76px;
    flex-basis: 76px;
  }
}
</style>
