<template>
  <div>
    <h2>订单管理</h2>
    <!-- 搜索框 -->
    <el-form :inline="true" class="search-container">
      <el-form :model="queryParams" size="medium" class="custom-font">
        <el-row>
          <el-col :span="4">
            <el-form-item label="订单名" class="custom-font">
              <el-input v-model="queryParams.orderName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="价格" class="custom-font">
              <el-input v-model="queryParams.price"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="顾客名" class="custom-font">
              <el-input v-model="queryParams.customerName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="车牌号" class="custom-font">
              <el-input v-model="queryParams.carCard"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
          <el-button type="primary" @click="searchOrders" icon="Search">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-col :span="4">
        <el-button @click="showAddDialog" icon="Plus">添加订单</el-button>
      </el-col>
    </el-form>
    <!-- 订单列表 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="orderName" label="订单名"></el-table-column>
      <el-table-column prop="customerName" label="客户名称"></el-table-column>
      <el-table-column prop="carCard" label="车牌号"></el-table-column>
      <el-table-column prop="orderPrice" label="订单金额"></el-table-column>
      <el-table-column prop="orderDate" label="建单日期"></el-table-column>
      <el-table-column prop="dealDate" label="完单日期"></el-table-column>
      <el-table-column prop="orderState" label="订单状态"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="text" @click="watchOrder(scope.row)" icon="View">詳情</el-button>
          <el-button type="text" @click="editOrder(scope.row)" icon="Edit">编辑</el-button>
          <el-button type="text" @click="deleteOrder(scope.row.orderId)" icon="Delete">删除</el-button>
         
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next"
      :total="total"></el-pagination>
    <!-- 订单添加/编辑对话框 -->
    <el-dialog title="新增订单" v-model="showDialog" width="80%">
      <el-form :model="newOrder" label-width="80px">
        <el-row>
          <el-col :span="4">
            <el-form-item label="员工名称">
              <el-input v-model="username" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="订单金额">
              <el-input-number v-model="newOrder.amount" :precision="1" :step="0.1" :max="90000000" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="手机号">
              <el-input v-model="newOrder.customerPhoneNumber" style="width: 240px" placeholder="请输入客户手机号" clearable
                @blur="handlePhoneNumberBlur" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="客户名">
              <el-input v-model="newOrder.customerName" disabled style="width: 240px" placeholder="请输入客户名" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="车牌号">
              <el-input v-model="newOrder.carCard" style="width: 240px" placeholder="请输入车牌号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="订单状态">
              <el-input v-model="newOrder.status" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" @click="saveOrder" icon="Check">
                添加订单
              </el-button>
              <el-button @click="closeDialog" icon="Close">取消</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog title="订单詳情" v-model="showOrder" width="50%">
      <el-col>
        <el-progress type="circle" :percentage="persintOrder" />
      </el-col>
    </el-dialog>

    <!-- 编辑订单对话框 -->
    <el-dialog title="编辑订单" v-model="showEditDialog" width="80%">
      <el-form :model="editOrderData" label-width="80px">
        <el-row>
          <el-col :span="4">
            <el-form-item label="员工名称">
              <el-input v-model="username" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="订单金额">
              <el-input-number v-model="editOrderData.amount" :precision="1" :step="0.1" :max="90000000" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="手机号">
              <el-input v-model="editOrderData.customerPhoneNumber" style="width: 240px" placeholder="请输入客户手机号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="客户名">
              <el-input v-model="editOrderData.customerName" style="width: 240px" placeholder="请输入客户名" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="车牌号">
              <el-input v-model="editOrderData.carCard" style="width: 240px" placeholder="请输入车牌号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="订单状态">
              <el-select v-model="editOrderData.status" placeholder="请选择状态">
                <el-option label="未建立" value="未建立"></el-option>
                <el-option label="进行中" value="进行中"></el-option>
                <el-option label="已完成" value="已完成"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" @click="updateOrder" icon="Check">
                保存修改
              </el-button>
              <el-button @click="closeEditDialog" icon="Close">取消</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage, ElMessageBox, ElDialog } from 'element-plus';

export default {
  name: 'OrderManagement',
  data() {
    return {
      username: sessionStorage.getItem('username'),
      tableData: [],
      queryParams: {
        price: "",
        orderName: '',
        customerName: "",
        carCard: "",
      },
      orders: [],
      searchQuery: '',
      currentPage: 1,
      pageSize: 10,
      showDialog: false,
      persintOrder:25,
      showOrder:false,
      isEdit: false,
      dialogTitle: '',
      newOrder: {
        carCard: "",
        customerPhoneNumber: "",
        customerName: '',
        amount: 0.0,
        status: '未建立',
        username: sessionStorage.getItem('username'),
      },
      total: 0,
      showEditDialog: false,
      editOrderData: {
        carCard: "",
        customerPhoneNumber: "",
        customerName: '',
        amount: 0.0,
        status: '未建立',
        username: sessionStorage.getItem('username'),
      }
    };
  },
  methods: {
    handlePhoneNumberBlur(event) {
      // 这里可以添加你想要执行的逻辑，例如验证手机号的有效性或进行其他操作
      let params = {
        phoneNumber: this.newOrder.customerPhoneNumber
      };
      axios.post('http://localhost:8080/Order/getCustomerInfo', params)
        .then((response) => {
         
        })
        .catch(() => {
          ElMessage.error('获取列表失败，请检查网络或联系管理员');
        });
    },
    fetchOrders() {
      let params = {
        page: this.currentPage,
        pagesize: this.pageSize,
        username: sessionStorage.getItem('username'),
        customerName: this.queryParams.customerName,
        price: this.queryParams.price,
        orderName: this.queryParams.orderName,
        carCard: this.queryParams.carCard,
      };
      axios.post('http://localhost:8080/Order/allList', params)
        .then((response) => {
          this.total = response.data.total;
          this.tableData = response.data.list;
        })
        .catch(() => {
          ElMessage.error('获取列表失败，请检查网络或联系管理员');
        });
    },
    searchOrders() {
      this.fetchOrders();
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.fetchOrders();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.fetchOrders();
    },
    showAddDialog() {
      //添加
      // 确保此处逻辑正确
      this.showDialog = true;
      this.dialogTitle = '添加订单';
    },
    editOrder(order) {
      this.showEditDialog = true;
      this.editOrderData = { 
        ...order,
        amount: order.orderPrice || 0.0,
        customerPhoneNumber: order.phone || "",
        status: order.orderState || '未建立'
      };
    },
    saveOrder() {
      let params = {
        username: this.newOrder.username,
        price: this.newOrder.amount,
        customerName: this.newOrder.customerName,
        phone: this.newOrder.customerPhoneNumber,
        carCard: this.newOrder.carCard,
      };
      axios.post('http://localhost:8080/Order/create', params)
        .then((response) => {
          if (response.data.code == 0) {
            ElMessage.success("添加成功");
          }
        })
        .catch(() => {
          ElMessage.error('获取用户列表失败，请检查网络或联系管理员');
        });


    },
    deleteOrder(orderId) {
      try {
        ElMessageBox.confirm('确定要删除该订单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        axios.delete(`/api/orders/${orderId}`);
        this.fetchOrders();
        ElMessage.success('订单删除成功');
      } catch (error) {
        ElMessage.error('订单删除失败，请检查网络或联系管理员');
      }
    },
    watchOrder(orderId) {
     this.showOrder=true ;
     axios.delete(`/api/orders/${orderId}`).then((response) => {
          if (response.data.code == 0) {
            ElMessage.success("添加成功");
          }
        })
        .catch(() => {
          ElMessage.error('获取用户列表失败，请检查网络或联系管理员');
        });

        
    },
    closeDialog() {
      this.showDialog = false;
      this.isEdit = false;
      this.dialogTitle = '';
      this.newOrder = {
        carCard: "",
        customerPhoneNumber: "",
        customerName: '',
        amount: 0.0,
        status: '未建立',
        username: sessionStorage.getItem('username'),
      };
    },
    updateOrder() {
      let params = {
        ...this.editOrderData,
        price: this.editOrderData.amount,
        phone: this.editOrderData.customerPhoneNumber
      };
      axios.post('http://localhost:8080/Order/update', params)
        .then((response) => {
          if (response.data.code === 0) {
            ElMessage.success('订单更新成功');
            this.fetchOrders();
            this.closeEditDialog();
          } else {
            ElMessage.error(response.data.msg || '更新失败');
          }
        })
        .catch((error) => {
          ElMessage.error('更新失败，请检查网络或联系管理员');
          console.error(error);
        });
    },
    closeEditDialog() {
      this.showEditDialog = false;
      this.editOrderData = {
        carCard: "",
        customerPhoneNumber: "",
        customerName: '',
        amount: 0.0,
        status: '未建立',
        username: sessionStorage.getItem('username'),
      };
    }
  },
  created() {
    this.fetchOrders();
  }
};
</script>

<style scoped>
.search-container {
  margin-bottom: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.custom-font {
  font-size: 13px;
}

.el-table {
  margin-top: 12px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.el-table::before {
  height: 0;
}

.el-dialog {
  border-radius: 8px;
}

.el-dialog__header {
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
}

.el-dialog__body {
  padding: 16px;
}

.el-form-item {
  margin-bottom: 12px;
}

.el-pagination {
  margin-top: 12px;
  text-align: right;
}

.el-button {
  margin-right: 8px;
}

.el-col {
  padding: 0 8px;
}

/* 按钮图标样式 */
.el-button [class*="el-icon"] {
  margin-right: 4px;
}
</style>
