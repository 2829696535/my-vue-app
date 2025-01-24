<template>
  <div>
    <h2 class="page-title">
      <el-icon>
        <Setting />
      </el-icon>
      <span>订单管理</span>
    </h2>
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
              <el-input v-model="queryParams.carCard" placeholder="请选择车牌号" />
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
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="orderName" label="订单名" show-overflow-tooltip>
        <template #header>
          <el-icon>
            <Document />
          </el-icon> 订单名
        </template>
      </el-table-column>
      <el-table-column prop="customerName" label="客户名称" show-overflow-tooltip>
        <template #header>
          <el-icon>
            <User />
          </el-icon> 客户名称
        </template>
      </el-table-column>
      <el-table-column prop="carCard" label="车牌号" show-overflow-tooltip>
        <template #header>
          <el-icon>
            <Van />
          </el-icon> 车牌号
        </template>
      </el-table-column>
      <el-table-column prop="orderPrice" label="订单金额" show-overflow-tooltip>
        <template #header>
          <el-icon>
            <Money />
          </el-icon> 订单金额
        </template>
      </el-table-column>
      <el-table-column prop="orderDate" label="建单日期" show-overflow-tooltip>
        <template #header>
          <el-icon>
            <Calendar />
          </el-icon> 建单日期
        </template>
      </el-table-column>
      <el-table-column prop="dealDate" label="完单日期" show-overflow-tooltip>
        <template #header>
          <el-icon>
            <Timer />
          </el-icon> 完单日期
        </template>
      </el-table-column>
      <el-table-column prop="orderState" label="订单状态" show-overflow-tooltip>
        <template #header>
          <el-icon>
            <Flag />
          </el-icon> 订单状态
        </template>
      </el-table-column>
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
    <el-dialog title="新增订单" v-model="showDialog" width="50%" :modal-style="{ borderRadius: '0' }" class="custom-dialog">
      <el-form :model="newOrder" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="员工名称">
              <el-input v-model="username" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="选择服务">
              <el-checkbox-group v-model="newOrder.selectedServices" @change="calculateTotalPrice">
                <el-checkbox-button v-for="service in services" :key="service.value" :label="service.value">
                  {{ service.label }} (¥{{ service.price }})
                </el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单金额">
              <el-input v-model="newOrder.amount" disabled :max="90000000" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号">
              <el-input v-model="newOrder.customerPhoneNumber" style="width: 240px" placeholder="请输入客户手机号" clearable
                @blur="handlePhoneNumberBlur" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户名">
              <el-input v-model="newOrder.customerName" disabled style="width: 240px" placeholder="请输入客户名" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车牌号">
              <el-select v-model="newOrder.carCard" placeholder="请选择车牌号" style="width: 240px">
                <el-option v-for="car in carNumbers" :key="car" :label="car" :value="car">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单状态">
              <el-input v-model="newOrder.status" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
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
    <el-dialog title="编辑订单" v-model="showEditDialog" width="50%" :modal-style="{ borderRadius: '0' }"
      class="custom-dialog">
      <el-form :model="editOrderData" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="员工名称">
              <el-input v-model="username" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单金额">
              <el-input-number v-model="editOrderData.amount" :precision="1" :step="0.1" :max="90000000" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号">
              <el-input v-model="editOrderData.customerPhoneNumber" style="width: 240px" placeholder="请输入客户手机号"
                clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户名">
              <el-input v-model="editOrderData.customerName" style="width: 240px" placeholder="请输入客户名" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车牌号">
              <el-select v-model="editOrderData.carCard" placeholder="请选择车牌号" style="width: 240px">
                <el-option v-for="car in carNumbers" :key="car" :label="car" :value="car">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单状态">
              <el-select v-model="editOrderData.status" placeholder="请选择状态">
                <el-option label="未建立" value="未建立"></el-option>
                <el-option label="进行中" value="进行中"></el-option>
                <el-option label="已完成" value="已完成"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
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
import {
  Document,
  User,
  Van,
  Money,
  Calendar,
  Timer,
  Flag,
  Setting
} from '@element-plus/icons-vue'

export default {
  name: 'OrderManagement',
  data() {
    return {
      username: sessionStorage.getItem('username'),
      tableData: [],
      carNumbers: [],
      services: [],
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
      persintOrder: 25,
      showOrder: false,
      isEdit: false,
      dialogTitle: '',
      newOrder: {
        carCard: "",
        customerPhoneNumber: "",
        customerName: '',
        amount: 0.0,
        status: '未建立',
        username: sessionStorage.getItem('username'),
        selectedServices: []
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
    getusername() {
      const username = sessionStorage.getItem('username');
      if (username == null || username == "") {
        window.location.href = '/'
      }
    },
    handlePhoneNumberBlur(event) {
      let params = {
        phoneNumber: this.newOrder.customerPhoneNumber
      };
      axios.post('http://localhost:8080/Order/getCustomerInfo', params)
        .then((response) => {
          this.newOrder.customerName = response.data.customerName
          this.carNumbers = response.data.carInfo.map(item => `${item.carName}|${item.car_card}`);
        })
        .catch(() => {
          
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
        carCard: this.newOrder.carCard.split('|')[1],
        services: this.newOrder.selectedServices
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
      this.showOrder = true;
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
    },
    getService() {
      axios.post("http://localhost:8080/Service/getService").then((res) => {
        this.services = res.data.data.map(item => ({
          value: item.service_name,
          label: item.service_name,
          price: item.service_price
        }));
      }).catch(error => {
        console.error('获取服务列表失败:', error);
        ElMessage.error('获取服务列表失败');
      });
    },
    calculateTotalPrice() {
      this.newOrder.amount = this.newOrder.selectedServices.reduce((total, serviceId) => {
        const service = this.services.find(s => s.value === serviceId);
        return total + (service?.price || 0);
      }, 0);
    }
  },
  created() {
    this.getusername();
    this.getService();
    this.fetchOrders();
  }
};
</script>

<style>
.custom-dialog .el-dialog__body {
  max-width: 800px;
  min-width: 800px;
  margin: 0 auto;
}

.el-table.warning-row {
  background: rgb(159, 14, 14);
}

.el-table.success-row {
  background: #600cba;
}

/* 页面标题 */
.page-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #409EFF;
  margin-bottom: 20px;
}

/* 自定义字体类 */
.custom-font {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 16px;
  font-weight: 500;
}

/* 表头图标样式 */
.el-table__header th .el-icon {
  font-size: 18px;
  margin-right: 6px;
}

/* 表头样式 */
.el-table__header th {
  background-color: #409EFF !important;
  color: white !important;
  font-weight: bold;
  border-right: 1px solid #c0c4cc !important;
  border-bottom: 1px solid #c0c4cc !important;
}

/* 最后列表头去掉右边框 */
.el-table__header th:last-child {
  border-right: none;
}

/* 表头内容样式 */
.el-table__header th .cell {
  display: flex !important;
  align-items: center;
  gap: 8px;
  color: white !important;
}

/* 单元格样式 */
.el-table__body td {
  border-right: 1px solid #c0c4cc !important;
  border-bottom: 1px solid #c0c4cc !important;
  box-shadow: inset 0 -1px 0 rgba(0,0,0,0.1);
}

/* 最后列去掉右边框 */
.el-table__body td:last-child {
  border-right: none;
}

/* 最后行去掉下边框 */
.el-table__body tr:last-child td {
  border-bottom: none;
}

/* 行hover效果 */
.el-table__body tr:hover>td {
  background-color: #f5f7fa !important;
}
</style>