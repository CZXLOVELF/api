<template>
    <el-container>
        <el-header>
            <el-row>
                <el-col :span="12">
                    <div>
                        公司名啥的
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="header-right">
                        <el-button>注销</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <Slider></Slider>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import Slider from '@/views/Slider'
    export default {
        name: "Index",
        data() {
            return {}
        },
        components:{
            Slider
        },
    }
</script>

<style scoped>
    .el-container{
        height: 100%;
        width: 100%;
    }
    .el-header {
        color: #333;
        background-color: #fff;
        box-shadow: 0 0 1px rgba(0,0,0,0.25);
        line-height: 60px;
    }
    .header-right{
        box-sizing: border-box;
        padding-right: 60px;
        text-align: right;
    }
    .el-aside {
        color: #333;
        height: 100%;
    }

    .el-main {
        color: #333;
        padding: 0;
        width: 100%;
    }
    .el-aside::-webkit-scrollbar{
        width: 4px;
        height: 0;
    }
    /*轨道*/
    .el-aside::-webkit-scrollbar-track{
        background: #F2F2F2;
    }
    /*滑块*/
    .el-aside::-webkit-scrollbar-thumb{
        border-radius: 2px;
        background: #C2C2C2;
    }
</style>