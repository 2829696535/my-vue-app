<script setup>
import CommonAside from '@/components/CommonAside.vue'
import CommonHeader from '@/components/CommonHeader.vue'
import { RouterView } from 'vue-router';
</script>

<template>
    <div class="common-layout">
        <el-container class="lay-container">
            <!-- 侧边栏 -->
            <common-aside  class="leftas"/>
            <!-- 右侧内容区域 -->
            <el-container class="right-container">
                <!-- 头部 -->
                <el-header class="el-header">
                    <common-header />
                </el-header>
                <!-- 主要内容 -->
                <el-main class="right-main">
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<style scoped lang="less">
/* 全局样式 */
html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: #545c64;
}

.common-layout {
    height: 100%;
    background-color: #545c64;
}

.lay-container {
    display: flex;
    height: 100%;
}

.right-container {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.el-header {
    background-color: transparent;
    height: 60px;
    padding: 0;
    margin: 0;
    border: none;
}

.right-main {
    flex: 1;
    overflow: auto;
    padding: 20px;
    background-color: #fff;
    margin: 20px;
    border-radius: 4px;
}
</style>
