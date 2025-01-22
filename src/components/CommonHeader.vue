<template>
    <div class="header">
        <div class="l-content">
            <el-button size="small" @click = "handclick">
                <component class="icons" is="menu"></component>
            </el-button>
            <el-breadcrumb separator="/" class="bread">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="r-content">
            <el-dropdown>
    <span class="el-dropdown-link">
     <img :src="getImageUrl('user')" class="user"/>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>个人中心</el-dropdown-item>
        <el-dropdown-item @click="logout">退出</el-dropdown-item>
        
      </el-dropdown-menu>
    </template>
  </el-dropdown>
        </div>


    </div>
</template>
<script setup>
import { User } from '@element-plus/icons-vue';
import { ref, computed } from 'vue'
import{useAllDataStore} from '@/stores/index.js'
const getImageUrl = (user) => {
    return new URL(`../assets/images/${user}.png`,import.meta.url).href;
}

const handclick = () => {
    const store = useAllDataStore()
    const isCollapse = computed(()=> store.state.isCollapse)
  
    store.state.isCollapse = !store.state.isCollapse
}
const logout=()=>{
sessionStorage.clear();
window.location.href = '/'
}
</script>
<style lang="less" scoped>
.header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #545c64;
    border: none;
    margin: 0;
    padding: 0;
}

.l-content, .r-content {
    border: none;
    margin: 0;
    padding: 0;
}
.icons{
    width: 20px;
    height: 20px;
}
.r-content{
   .user{
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
.l-content{
    display: flex;
    align-items: center;
   .el-button{
    margin-right: 20px;
  }
}
:deep(.bread span){
  color: #fff !important;
  cursor:pointer !important;
}
</style>
