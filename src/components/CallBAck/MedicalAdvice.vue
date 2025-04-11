<template>
    <div class="medical-order">
      <div class="order-header">
        <h2>医嘱信息</h2>
        <el-button type="primary" @click="refreshOrders">刷新</el-button>
      </div>
      
      <el-table :data="orders" style="width: 100%" border>
        <el-table-column prop="orderId" label="医嘱编号" width="120" />
        <el-table-column prop="patientName" label="患者姓名" width="120" />
        <el-table-column prop="doctorName" label="医生姓名" width="120" />
        <el-table-column prop="orderType" label="医嘱类型" width="120">
          <template #default="scope">
            <el-tag :type="getOrderTypeTag(scope.row.orderType)">
              {{ scope.row.orderType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="医嘱内容" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusTag(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  
  // 模拟医嘱数据
  const orders = ref([
    {
      orderId: 'MO20240315001',
      patientName: '张三',
      doctorName: '李医生',
      orderType: '用药',
      content: '阿莫西林 0.5g 每日三次',
      createTime: '2024-03-15 09:30:00',
      status: '已执行'
    },
    {
      orderId: 'MO20240315002',
      patientName: '李四',
      doctorName: '王医生',
      orderType: '检查',
      content: '血常规检查',
      createTime: '2024-03-15 10:15:00',
      status: '待执行'
    },
    {
      orderId: 'MO20240315003',
      patientName: '王五',
      doctorName: '赵医生',
      orderType: '治疗',
      content: '输液治疗',
      createTime: '2024-03-15 11:00:00',
      status: '已执行'
    },
    {
      orderId: 'MO20240315004',
      patientName: '孙六',
      doctorName: '钱医生',
      orderType: '其他',
      content: '其他医嘱',
      createTime: '2024-03-15 11:30:00',
      status: '已取消'
    }
  ])
  
  // 获取医嘱类型对应的标签样式
  const getOrderTypeTag = (type: string) => {
    const typeMap: Record<string, string> = {
      '用药': 'success',
      '检查': 'warning',
      '治疗': 'info',
      '其他': ''
    }
    return typeMap[type] || ''
  }
  
  // 获取状态对应的标签样式
  const getStatusTag = (status: string) => {
    const statusMap: Record<string, string> = {
      '已执行': 'success',
      '待执行': 'warning',
      '已取消': 'danger'
    }
    return statusMap[status] || ''
  }
  
  // 刷新医嘱列表
  const refreshOrders = () => {
    ElMessage.success('医嘱列表已刷新')
    // 这里可以添加实际的刷新逻辑
  }
  </script>
  
  <style lang="scss" scoped>
  .medical-order {
    padding: 20px;
    background: vars.$card-bg;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
  
      h2 {
        margin: 0;
        color: #303133;
      }
    }
  
    :deep(.el-table) {
      margin-top: 20px;
    }
  }
  </style>