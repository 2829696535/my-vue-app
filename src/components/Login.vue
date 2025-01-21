<template>
    <el-container class="login-container">
      <el-main style="display: flex; justify-content: center; align-items: center;">
        <el-form class="login-form" :model="loginForm" :rules="rules" @submit.prevent="login">
          <h3 class="login-title">登录</h3>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-button type="primary" native-type="submit">登录</el-button>
        </el-form>
      </el-main>
    </el-container>
  </template>
  
  <script>
  import axios from 'axios';
  import { ElMessage } from 'element-plus';
  import { useRouter } from 'vue-router';
  
  export default {
    data() {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        
       
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      login() {
        const self = this;
        axios.post('http://localhost:8080/index/login',this.loginForm)
         .then(function (response) {
            if (response.data.code === 0) {
              sessionStorage.setItem('username', self.loginForm.username);
              const router = useRouter();
              sessionStorage.setItem('role',response.data.user.role);
            window.location.href = '/home'
            } else {
              ElMessage.error(response.data.msg);
            }
          })
         .catch(function (error) {
            ElMessage.error('登录失败，请检查网络或联系管理员');
            console.error('登录错误:', error);
          });
      }
    }
  };
  </script>
  
<style scoped lang="less">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('@/assets/images/background.png');
  background-size: cover;
  background-position: center;
}

.login-form {
  width: 350px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.login-form:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
  font-weight: 500;
}

.el-button {
  width: 100%;
  margin-top: 20px;
  height: 40px;
  font-size: 16px;
  transition: all 0.2s ease;
}

.el-button:hover {
  transform: scale(1.02);
}
</style>
