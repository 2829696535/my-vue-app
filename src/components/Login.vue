<template>
  <el-container class="login-container">
    <el-main style="display: flex; justify-content: center; align-items: center;">
      <div class="auth-container" v-if="islogin == 'login'">
        <el-form class="login-form" :model="loginForm" :rules="rules" @submit.prevent="login">
          <h3 class="login-title">登录</h3>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-button type="primary" native-type="submit">登录</el-button>
          <div class="text-center mt-3">
            <el-link type="primary" @click="islogin = 'register'">没有账号？立即注册</el-link>
          </div>
        </el-form>
      </div>
      <div class="auth-container" v-if="islogin == 'register'">
        <el-form class="register-form" :model="registerForm" :rules="registerRules" @submit.prevent="register">
          <h3 class="register-title">注册</h3>
          <el-form-item prop="username">
            <el-input v-model="registerForm.username" placeholder="请输入用户名" @blur="checkUserName"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="registerForm.password" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请确认密码"></el-input>
          </el-form-item>
          <el-button type="success" native-type="submit">注册</el-button>
          <div class="text-center mt-3">
            <el-link type="primary" @click="islogin = 'login'">已有账号？返回登录</el-link>
          </div>
        </el-form>
      </div>
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
      islogin: "login",
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
        registerRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 4, max: 16, message: '用户名长度在4到16个字符', trigger: 'blur' },
            { validator: this.checkUserName, trigger: 'blur' }
          ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度在6到20个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: this.validateConfirmPassword, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    checkUserName() {
      let params = {
        username: this.registerForm.username
      }
      axios.post('http://localhost:8080/index/checkUserName', params)
        .then(response => {
          if (response.data.isHas === false) {}
           else {
            ElMessage.error("用户名已存在");
            this.registerForm.username = "";
          }
        })
        .catch(error => {
          ElMessage.error('用户名验证失败');
          console.error('验证错误:', error);
          return false;
        });
    },
      validateConfirmPassword(rule, value, callback) {
    if (value !== this.registerForm.password) {
      callback(new Error('两次输入密码不一致'));
    } else {
      callback();
    }
  },
  login() {
    const self = this;
    axios.post('http://localhost:8080/index/login', this.loginForm)
      .then(function (response) {
        if (response.data.code === 0) {
          sessionStorage.setItem('username', self.loginForm.username);
          const router = useRouter();
          sessionStorage.setItem('role', response.data.user.role);
          window.location.href = '/home'
        } else {
          ElMessage.error(response.data.msg);
        }
      })
      .catch(function (error) {
        ElMessage.error('登录失败，请检查网络或联系管理员');
        console.error('登录错误:', error);
      });
  },
  register() {
    const self = this;
    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      ElMessage.error('两次输入密码不一致');
      return;
    }

    axios.post('http://localhost:8080/index/register', this.registerForm)
      .then(function (response) {
        if (response.data.code === 0) {
          ElMessage.success('注册成功');
          self.registerForm = {
            username: '',
            password: '',
            confirmPassword: ''
          };
          self.islogin = 'login';
        } else {
          ElMessage.error(response.data.msg);
        }
      })
      .catch(function (error) {
        ElMessage.error('注册失败，请检查网络或联系管理员');
        console.error('注册错误:', error);
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

.auth-container {
  width: 400px;
}

.login-form,
.register-form {
  width: 100%;
  padding: 30px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.login-form:hover,
.register-form:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.register-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
  font-weight: 500;
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

.text-center {
  text-align: center;
}

.mt-3 {
  margin-top: 1rem;
}
</style>
