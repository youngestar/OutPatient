<template>
  <div class="profile-page" v-loading="loading">
    <header class="page-head">
      <h2>我的信息</h2>
      <el-button type="primary" @click="openEdit">修改个人资料</el-button>
    </header>

    <section class="profile-card">
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
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem 2rem;
  min-height: 100%;
  box-sizing: border-box;
}

.profile-page {
  margin: 0 auto;
}

.page-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #eef2ff, #fdf2f8);
  border-radius: 20px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.1);

  .eyebrow {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #7c8db5;
    font-size: 0.8rem;
  }

  h2 {
    margin: 0.35rem 0;
    font-size: 2rem;
    color: #1f2933;
  }

  .subtext {
    margin: 0;
    color: #64748b;
  }
}

.profile-card {
  border-radius: 18px;
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.08);
  background-color: #fff;
  padding: 1.75rem 2rem;
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  box-sizing: border-box;
}

.avatar-panel {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  text-align: center;
  min-width: 210px;

  .avatar {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }

  .upload-btn {
    cursor: pointer;
    display: inline-block;
    margin-top: 0.5rem;
    padding: 0.4rem 0.9rem;
    background: #409eff;
    color: #fff;
    border-radius: 10px;
    border: 1px solid #fff;
    font-weight: 600;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #66b1ff;
    }
  }
}

.info-panel {
  flex: 1;
  display: flex;
  gap: 2.5rem;
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
  padding: 2rem 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
}

.label {
  width: 88px;
  flex: 0 0 88px;
  color: #64748b;
  font-weight: 600;
}

.value {
  color: #0f172a;
  font-weight: 600;
  word-break: break-word;
}

@media (max-width: 768px) {
  .profile-page {
    padding: 1rem;
  }

  .page-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .profile-card {
    flex-direction: column;
    padding: 1.25rem;
    gap: 1.25rem;
  }

  .avatar-panel {
    min-width: unset;
    width: 100%;
  }

  .info-panel {
    flex-direction: column;
    gap: 0.5rem;
  }

  .label {
    width: 76px;
    flex-basis: 76px;
  }
}
</style>
