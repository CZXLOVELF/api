<template>
    <el-menu
            :default-active="$route.name"
            class="slider"
            background-color="#F5F5F5"
            text-color="#0D0D0D"
            active-text-color="#BF291B"
            router>
        <el-menu-item index="home" >
            <i class="el-icon-menu"></i> 首页
        </el-menu-item>
        <el-submenu index="1">
            <template slot="title">
                <i class="el-icon-document"></i>
                <span>数据管理</span>
            </template>
            <el-menu-item index="book">书本列表</el-menu-item>
            <el-menu-item index="superiorList">优品列表</el-menu-item>
            <el-menu-item index="slideshow">首页</el-menu-item>
            <el-menu-item index="MenuItem">菜单选项</el-menu-item>
            <el-menu-item index="acquisition">收书页</el-menu-item>
            <el-menu-item index="Discount">折扣</el-menu-item>
            <el-menu-item index="FreeShipping">包邮券</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
            <template slot="title">
                <i class="el-icon-document"></i>
                <span>添加数据</span>
            </template>
            <el-menu-item index="userList">添加书本</el-menu-item>
            <el-menu-item index="superiorList">添加书本分类</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
            <template slot="title">
                <i class="el-icon-star-on"></i>
                <span>图表</span>
            </template>
             <el-menu-item index="visitor">用户分布</el-menu-item>
             <el-menu-item index="newMember">用户数据</el-menu-item>
        </el-submenu>
        <el-submenu index="4">
            <template slot="title">
                <i class="el-icon-edit"></i>
                <span>编辑</span>
            </template>
             <el-menu-item index="uploadImg">上传图片</el-menu-item>
             <el-menu-item index="vueEdit">文本编辑</el-menu-item>
        </el-submenu>
        <el-submenu index="5">
            <template slot="title">
                <i class="el-icon-setting"></i>
                <span>维护</span>
            </template>
            <el-menu-item index="adminSet" >管理员账号</el-menu-item>
            <el-menu-item index="adminList" >操作日志</el-menu-item>
        </el-submenu>
        <el-submenu index="6">
            <template slot="title">
                <i class="el-icon-warning"></i>
                <span>说明</span>
            </template>
             <el-menu-item index="explain">说明</el-menu-item>
        </el-submenu>
    </el-menu>
</template>

<script>
    export default {
        name: "Slider",
        data() {
            return {}
        },
    }
</script>

<style scoped>
.slider{
    height: 100%;
}

</style>