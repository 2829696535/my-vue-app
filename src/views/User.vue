<template>
  <div>
    <!-- 内联样式示例 -->
    <h2 class="page-title">
      <el-icon><Setting /></el-icon>
      <span>用户管理</span>
    </h2>
    <!-- 使用 CSS 类示例 -->
    <!--     <user-form @user-saved="fetchUsers" :user="selectedUser" class="custom-font" /> -->
    <user-table @edit-user="handleEditUser" class="custom-font" />
    <el-row>
      <el-form :model="queryParams" size="medium" class="custom-font">
        <el-row>

          <el-col :span="8">
          <el-form-item label="用户名" class="custom-font">
            <el-input v-model="queryParams.username" placeholder="请输入用户名">
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          </el-col>
          <el-col :span="6" :offset="2">
          <el-form-item label="角色" class="custom-font">
            <el-input v-model="queryParams.role" placeholder="请输入角色">
              <template #prefix>
                <el-icon><Key /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          </el-col>
          <el-col :span="3" :offset="3">
        <el-button type="primary" @click="handleQuery" icon="Search">搜索用户</el-button>
          </el-col>

        </el-row>
      </el-form>
    </el-row>
    <el-row>

      <el-button type="success" @click="dialogFormVisible = true" icon="Plus">新增用户</el-button>


    </el-row>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="username" label="用户名" show-overflow-tooltip>
        <template #header>
          <el-icon><User /></el-icon> 用户名
        </template>
      </el-table-column>
      <el-table-column prop="password" label="密码" show-overflow-tooltip>
        <template #header>
          <el-icon><Lock /></el-icon> 密码
        </template>
      </el-table-column>
      <el-table-column prop="role" label="权限" show-overflow-tooltip>
        <template #header>
          <el-icon><Key /></el-icon> 权限
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="时间" show-overflow-tooltip>
        <template #header>
          <el-icon><Clock /></el-icon> 时间
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="text" @click="editUser(scope.row)" class="custom-font" icon="Edit">编辑</el-button>
          <el-button type="text" @click="deleteUser(scope.row.id)" class="custom-font" icon="Delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total"
      class="custom-font"></el-pagination>
  </div>
  <el-dialog v-model="dialogFormVisible" title="Shipping address" width="500">
    <el-form :model="form">
      <el-form-item label="Name" :label-width="formLabelWidth">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="Password" :label-width="formLabelWidth">
        <el-input v-model="form.password" />
      </el-form-item>

      <el-form-item label="Role" :label-width="formLabelWidth">
        <el-select v-model="form.role" placeholder="Please select a zone">
          <el-option label="工人" value="worker" />
          <el-option label="顾客" value="user" />
          <el-option label="管理员" value="admin" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false" icon="Close">Cancel</el-button>
        <el-button type="primary" @click="updateUser" icon="Check">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  UserFilled,
  User,
  Key,
  Lock,
  Clock,
  Search,
  Plus,
  Edit,
  Delete,
  Close,
  Check,
  Setting,
  Menu,
  Avatar
} from '@element-plus/icons-vue'
import axios from 'axios';


export default {
  name: 'UserManagement',
  components: {},
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: '140px',
      form: {
        username: '',
        password: '',
        role: '',

      },
      selectedUser: {},
      userForm: {},
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度至少为 6 个字符', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { message: '请输入正确的权限', trigger: 'blur' }
        ]
      },
      userList: [],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      queryParams: {
        username: "",
        role: '',
      },
    };
  },
  methods: {
    insertUser() {
      this.dialogFormVisible = false;
      axios.post('http://localhost:8080/api/insertUser', this.form)
        .then((response) => {
          if (response.data.code == 200) {
            ElMessage.success('添加成功');
          }
        })
        .catch(() => {
          ElMessage.error('获取用户列表失败，请检查网络或联系管理员');
        });
    },
    updateUser() {
      this.dialogFormVisible = false;
      axios.post('http://localhost:8080/api/updateUser', this.form)
        .then((response) => {
          if (response.data.code == 0) {
            ElMessage.success('修改成功');
            this.fetchUsers();
          }
        })
        .catch(() => {
          ElMessage.error('修改用户失败，请检查网络或联系管理员');
        });
    },
    handleQuery() {
      this.fetchUsers();

    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    },
    fetchUsers() {
      let params = {
        page: this.currentPage,
        pagesize: this.pageSize,
        username: this.queryParams.username,
        role: this.queryParams.role,
      };
      axios.post('http://localhost:8080/api/userlist', params)
        .then((response) => {
          this.total = response.data.total;
          this.tableData = response.data.list;
        })
        .catch(() => {
          ElMessage.error('获取用户列表失败，请检查网络或联系管理员');
        });
    },
    handleEditUser(user) {
      this.selectedUser = user;
    },

    resetForm() {
      this.userForm = { ...this.selectedUser };
      this.$refs.userFormRef.resetFields();
    },
    editUser(user) {
      this.form = { ...user };
      this.dialogFormVisible = true;
    },
    deleteUser(id) {
      ElMessageBox.confirm('确认删除该用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          axios.get(`http://localhost:8080/api/deleteUser/${id}`)
            .then((res) => {
              if (res.data.code == 0) {
                ElMessage.success('用户删除成功');
                this.fetchUsers();
              }
            })
            .catch(() => {
              ElMessage.error('用户删除失败，请检查网络或联系管理员');
            });
        })
        .catch(() => {
          // 用户取消删除操作
        });
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.fetchUsers();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.fetchUsers();
    }
  },
  mounted() {
    this.fetchUsers();
  }
};
</script>

<style>
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
