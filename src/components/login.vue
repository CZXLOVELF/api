<template>
    <div class="body">
        <div class="login-box">
            <h1>后台管理系统</h1>
            <div class="login">
                <el-form :model="loginForm"
                         :rules="loginRules"
                         ref="loginForm"
                         label-width="50px"
                         size="small"
                         class="login-form">
                    <el-form-item label="账号" prop="userName">
                        <el-input v-model="loginForm.userName"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" @keyup.enter.native="submitForm('loginForm')" v-model="loginForm.password"></el-input>
                    </el-form-item>
                        <el-button class="sub-btn" type="primary" @click="submitForm('loginForm')">登录</el-button>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "login",
        data() {
            return {
                loginForm:{
                    userName:'',
                    password:''
                },
                loginRules:{
                    userName: [
                        { required: true, message: '请填写账号', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请填写密码', trigger: 'blur' }
                    ],
                }
            }
        },
        methods:{
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.axios.post('/background/manage/login',this.loginForm).then((res)=>{
                            if(res.code===10000){
                                console.log(res);
                                window.sessionStorage.setItem('admin',res.data);
                                this.$router.push({path: '/index', name: 'index'});
                            }else {
                                this.$message.error(res.msg);
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        }
    }
</script>

<style scoped>
    *{
        box-sizing: border-box;
    }
    .body{
        background-color: #324057;
        width: 100%;
        height: 100%;
        display: flex;
    }
    .login-box{
        text-align: center;
        height: 350px;
        width: 370px;
        margin: auto;
    }
    .login-box h1{
        color: #fff;
    }
    .login{
        padding: 20px;
        background: #fff;
        border-radius: 5px;
    }
    .sub-btn{
        margin-top: 30px;
        width: 100%;
    }
</style>