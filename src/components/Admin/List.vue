<template>
    <div class="main">
        <div class="header-box">
            <el-form :inline="true" :model="pages">
                <el-form-item>
                    <el-button @click="addBtn">添加管理员</el-button>
                </el-form-item>
                <el-form-item label="电话号码">
                    <el-input type="text" v-model="pages.phone" placeholder="请输入电话号码"></el-input>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input type="text" v-model="pages.userName" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="用户状态">
                    <el-select v-model="pages.state" placeholder="请选择状态">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="活跃" value="ACTIVE"></el-option>
                        <el-option label="禁用" value="DEATH"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div class="body-box">
            <el-table
                    :data="listData"
                    style="width: 100%">
                <el-table-column
                        prop="id"
                        label="ID">
                </el-table-column>
                <el-table-column
                        prop="userName"
                        label="用户名">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="联系电话">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        prop="state"
                        label="状态">
                </el-table-column>
                <el-table-column
                        width="175"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button type="danger"
                                   size="small"
                                   @click="Undercarriage(scope.row.id)"
                                   v-if="scope.row.state==='活跃'">禁用
                        </el-button>
                        <el-button type="primary" @click="editBtn(scope.row.id)" size="small">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="footer-box">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 50, 100]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
        <el-dialog
                title="添加管理员"
                :visible.sync="dialogVisible"
                width="30%"
                @close="handleClose">
            <div>
                <el-form :model="indexBannerForm"
                         :rules="indexBannerRule"
                         ref="indexBannerForm"
                         label-width="130px">
                    <el-form-item label="用户名" prop="userName">
                        <el-input v-model="indexBannerForm.userName">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="indexBannerForm.password">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phone">
                        <el-input v-model="indexBannerForm.phone">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="验证码" prop="code">
                        <el-input v-model="indexBannerForm.code" class="register-code">
                        </el-input>
                        <el-button @click="getRegisterCode">获取验证码</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addSub('indexBannerForm')">确 定</el-button>
              </span>
        </el-dialog>
        <el-dialog
                title="管理员详情"
                :visible.sync="dialogDetails"
                width="30%">
            <div>
                <el-form
                         label-width="130px">
                    <el-form-item label="ID：">
                        {{detailsData.id}}
                    </el-form-item>
                    <el-form-item label="用户名：">
                        {{detailsData.userName}}
                    </el-form-item>
                    <el-form-item label="手机号：">
                        {{detailsData.phone}}
                    </el-form-item>
                    <el-form-item label="状态：">
                        {{detailsData.state}}
                    </el-form-item>
                    <el-form-item label="创建时间：">
                        {{detailsData.createTime}}
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogDetails = false">取 消</el-button>
              </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "List",
        data() {
            let phone = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机号不能为空'));
                }else if(!(/^[1][3,4,5,7,8,][0-9]{9}$/.test(value))){
                    return callback(new Error('请输入正确手机号'));
                }else {
                    callback();
                }
            };
            let password = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('密码不能为空'));
                }else if(value.length<8||value.length>16){
                    return callback(new Error('密码至少8-16个字符'));
                }else {
                    callback();
                }
            };
            return {
                listData: [],
                total: null,
                pages: {
                    page: 1,
                    size: 10,
                    phone:'',
                    state:'',
                    userName:''
                },
                currentPage: null,
                selIds: [],
                dialogVisible:false,
                dialogDetails:false,
                indexBannerForm:{
                    userName:'',
                    password:'',
                    phone:'',
                    code:''
                },
                detailsData:{},
                indexBannerRule:{
                    userName: [
                        { required: true, message: '请填写用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true,validator:password, trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, validator:phone, trigger: 'blur' }
                    ],
                    code:[
                        { required: true, message: '请填写验证码', trigger: 'blur' }
                    ]
                }
            }
        },
        watch: {
            pages: {
                handler() {
                    this.show()
                },
                deep: true
            },
        },
        mounted() {
            this.show();
        },
        methods: {
            show() {
                this.axios.post('/background/manage/getAccountList', this.pages).then((res) => {
                    if (res.code === 10000) {
                        this.total = Number(res.data.total);
                        this.currentPage = Number(res.data.current);
                        this.listData = res.data.records;
                    }
                })
            },
            addBtn(){
                this.dialogVisible = true
            },
            editBtn(id){
                this.dialogDetails = true;
                this.axios.post('/background/manage/getAdminById',{id}).then((res)=>{
                    if(res.code===10000){
                        this.detailsData = res.data;
                    }
                })
            },
            Undercarriage(id) {
                this.axios.post('/background/manage/delete', {id}).then((res) => {
                    if (res.code === 10000) {
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        this.show()
                    }
                })
            },
            getRegisterCode(){
                this.axios.post('/background/manage/getRegisterCode',{phone:this.indexBannerForm.phone}).then((res)=>{
                    console.log(res);
                })
            },
            addSub(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.axios.post('/background/manage/register',this.indexBannerForm).then((res)=>{
                                if(res.code===10000){
                                    this.show();
                                    this.$message({
                                        message: res.msg,
                                        type: 'success'
                                    });
                                    this.dialogVisible = false;
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
            handleClose(){
                this.$refs.indexBannerForm.resetFields();
            },
            handleSizeChange(val) {
                this.pages.size = val
            },
            handleCurrentChange(val) {
                this.pages.page = val
            },
        }
    }
</script>

<style scoped>
    * {
        box-sizing: border-box;
    }

    .main {
        width: 100%;
    }

    .header-box {

    }

    .body-box {
        width: 100%;
        padding-top: 20px;
    }

    .img-box {
        width: 120px;
        height: 60px;
    }

    .img-box img {
        width: 100%;
        height: 100%;
    }

    .footer-box {
        text-align: right;
        padding: 20px;
    }

    .tag {
        cursor: pointer;
    }
    .dialog-box{
        height: 300px;
        overflow-y: auto;
        box-sizing: border-box;
        padding: 20px;
    }
    /deep/.avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .register-code{
        width: 255px;
        margin-right: 30px;
    }
</style>
