<template>
  <el-container>
    <el-header style="padding: 0 20px; display: flex; align-items: center;">
      <el-input
        v-model="searchQuery"
        placeholder="搜索服务名称"
        style="width: 300px; margin-right: 20px;"
        clearable
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button type="success" @click="handleOpenDialog">新增服务</el-button>
    </el-header>

    <!-- 新增服务弹窗 -->
      <el-dialog
        v-model="dialogVisible"
        title="新增服务"
        width="600px"
      >
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="100px"
      >
        <el-form-item label="服务名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入服务名称" />
        </el-form-item>
        <el-form-item label="服务描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入服务描述"
          />
        </el-form-item>
        <el-form-item label="服务价格" prop="price">
          <el-input-number 
            v-model="form.price"
            :min="0"
            :precision="2"
            :controls-position="right"
            placeholder="请输入服务价格"
          />
        </el-form-item>
        <el-form-item label="初始状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="启用">启用</el-radio>
            <el-radio label="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAdd">确定</el-button>
      </span>
    </el-dialog>

    <el-main>
      <el-table
        :data="serviceList"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column
          prop="name"
          label="服务名称"
          width="200"
        />
        <el-table-column
          prop="description"
          label="服务描述"
        />
        <el-table-column
          prop="price"
          label="价格"
          width="120"
          :formatter="(row) => `¥${row.price.toFixed(2)}`"
        />
        <el-table-column
          prop="status"
          label="状态"
          width="120"
        >
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'danger'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200"
        >
          <template #default="{ row }">
            <el-button type="text" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" @click="handleDetail(row)">详情</el-button>
            <el-button
              type="text"
              :style="{ color: row.status === '启用' ? '#F56C6C' : '#67C23A' }"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === '启用' ? '停用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="margin-top: 20px; text-align: right;"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
      />
    </el-main>
  </el-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      searchQuery: '',
      loading: false,
      serviceList: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      dialogVisible: false,
      form: {
        name: '',
        description: '',
        price: 0,
        status: '启用'
      },
      rules: {
        name: [
          { required: true, message: '请输入服务名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入服务描述', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入服务价格', trigger: 'blur' },
          { type: 'number', message: '价格必须为数字', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async fetchServices() {
      this.loading = true
      try {
        const response = await axios.get('/api/services', {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
            search: this.searchQuery
          }
        });
        this.serviceList = response.data.list;
        this.total = response.data.total;
      } catch (error) {
        console.error('获取服务列表失败:', error);
        this.$message.error('获取服务列表失败');
      } finally {
        this.loading = false
      }
    },
    handleSearch() {
      this.currentPage = 1
      this.fetchServices()
    },
    handleOpenDialog() {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form?.clearValidate()
      })
    },
    async handleAdd() {
      try {
        // 验证表单
        const valid = await this.$refs.form.validate();
        if (!valid) return;
        
        // 提交表单
        const res = await axios.post('/api/services', this.form);
        if (res.data.code === 200) {
          // 提示成功
          this.$message.success('新增服务成功');
          
          // 关闭弹窗
          this.dialogVisible = false;
          
          // 重置表单
          this.$refs.form.resetFields();
          
          // 刷新列表
          this.fetchServices();
        } else {
          this.$message.error(res.data.msg || '新增服务失败');
        }
      } catch (error) {
        console.error('新增服务失败:', error);
        this.$message.error(error.response?.data?.message || '新增服务失败');
      }
    },
    handleEdit(row) {
      // 编辑服务逻辑
    },
    handleDetail(row) {
      // 查看详情逻辑
    },
    handleToggleStatus(row) {
      // 切换状态逻辑
    },
    handlePageChange(page) {
      this.currentPage = page
      this.fetchServices()
    }
  },
  mounted() {
    this.fetchServices()
  }
}
</script>

<style scoped>
.el-header {
  background: #fff;
  border-bottom: 1px solid #ebeef5;
}
</style>
