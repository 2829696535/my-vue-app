<template>
    <el-aside :width="width">
        <el-menu background-color="#545c64" text-color="#fff" :collapse="isCollapse">
            <h3 v-if="!isCollapse">通用后台管理</h3>
            <h3 v-if="isCollapse">后台</h3>
            <el-menu-item :index="home" :key="home"  @click="clickMenu('/home')">
                <component class="icons" is="house"></component>
                <span>首页</span>
            </el-menu-item>
            <el-menu-item   v-if="userRole==='admin'"  :index="order" :key="order" @click="clickMenu('/order')">
                <component class="icons" is="Tickets"></component>
                <span>订单管理</span>
            </el-menu-item>
            <el-menu-item v-if="userRole==='admin'" :index="user" :key="user" @click="clickMenu('/user')">
                <component class="icons" is="user"></component>
                <span>用户管理</span>
            </el-menu-item>
            <el-menu-item v-if="userRole==='admin'" :index="service" :key="service" @click="clickMenu('/service')">
                <component class="icons" is="MessageBox"></component>
                <span>服务管理</span>
            </el-menu-item>
            <!-- <el-menu-item v-if="userRole==='adamin'" :index="service" :key="service" @click="clickMenu('/service') ">
                <component class="icons" is="MessageBox"></component>
                <span>服务管理</span>
            </el-menu-item> -->
            
             <el-menu-item v-if="userRole==='worker'" :index="service" :key="service" @click="clickMenu('/service')">
                <component class="icons" is="MessageBox"></component>
                <span>订单开工</span>
            </el-menu-item>
            <el-menu-item v-if="userRole==='worker'" :index="service" :key="service" @click="clickMenu('/service')">
                <component class="icons" is="MessageBox"></component>
                <span>配件使用</span>
            </el-menu-item>
            <el-menu-item v-if="userRole==='worker'" :index="service" :key="service" @click="clickMenu('/service')">
                <component class="icons" is="MessageBox"></component>
                <span>联系店长</span>
            </el-menu-item>
            <el-menu-item v-if="userRole==='worker'" :index="service" :key="service" @click="clickMenu('/service')">
                <component class="icons" is="MessageBox"></component>
                <span>联系店长</span>
            </el-menu-item>
        </el-menu>
    </el-aside>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAllDataStore } from '@/stores/index.js';
import { useRouter } from 'vue-router';
const router = useRouter();
const store = useAllDataStore();
const isCollapse = computed(() => store.state.isCollapse);
const width = computed(() => store.state.isCollapse? '64px' : '180px');

const clickMenu = (path) => {
    router.push(path);
};
const userRole = sessionStorage.getItem("role")
alert(userRole)
</script>

<style lang="less" scoped>
.icons {
    width: 18px;
    height: 18px;
    margin-right: 5px;
}
.el-menu {
    border-right: none;
    h3 {
        line-height: 48px;
        color: #fff;
        text-align: center;
    }
}
.el-aside {
    height: 100%;
    background-color: #545c64;
}
</style>