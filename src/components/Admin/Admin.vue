<template>
    <el-container>
        <el-header>
            <el-button class="out-to"
                       @click="cut('list')"
                       v-show="dynamic!=='list'">返回</el-button>
            <span>管理员列表</span>
        </el-header>
        <el-main>
            <component
                    :is="dynamic"
                    @cut="cut"
            ></component>
        </el-main>
    </el-container>
</template>

<script>
import list from './List'
    export default {
        name: "Admin",
        data() {
            return {
                dynamic:'list'
            }
        },
        components:{
            list
        },
        methods:{
            cut(dynamic){
                this.dynamic = dynamic
            }
        }
    }
</script>

<style scoped>
    .el-container{
        padding: 0;
        width: 100%;
    }
    .el-main{
        width: 100%;
    }
    .el-header{
        text-align: center;
        background: #F6F6F6;
        line-height: 60px;
        position: relative;
    }
    .out-to{
        position: absolute;
        left: 30px;
        top: 10px;
    }
</style>