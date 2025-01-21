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
}

.common-layout {
    height: 100%;
}

.lay-container {
    display: flex; /* 使用 flex 布局 */
    height: 100%;
}

.right-container {
    display: flex;
    flex-direction: column;
    flex: 1; /* 占据剩余空间 */
}

.el-header {
    background-color: black;
    height: 60px; /* 设置头部高度 */
}

.right-main {
    flex: 1; /* 占据剩余空间 */
    overflow: auto; /* 如果内容过多，允许滚动 */
    padding: 20px; /* 设置内边距 */
}
</style>