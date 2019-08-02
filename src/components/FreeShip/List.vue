<template>
    <div class="main">
        <div class="header-box">
            <el-form :inline="true" :model="pages">
                <el-form-item>
                    <el-button @click="addBtn">添加包邮卷</el-button>
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
                        prop="expireTime"
                        label="过期时间">
                </el-table-column>
                <el-table-column
                        prop="deductionPrice"
                        label="折扣额度">
                </el-table-column>
                <el-table-column
                        prop="deductionRatio"
                        label="折扣率">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        width="175"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="editBtn(scope.row.id)" size="small">修改</el-button>
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
                title="添加包邮卷"
                :visible.sync="dialogVisible"
                width="30%"
                @close="handleClose">
            <div>
                <el-form :model="indexBannerForm"
                         :rules="indexBannerRule"
                         ref="indexBannerForm"
                         label-width="130px">
                    <el-form-item label="折扣额度" prop="deductionPrice">
                        <el-input v-model.number="indexBannerForm.deductionPrice">
                            <template slot="append">￥</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="折扣率" prop="deductionRatio">
                        <el-input v-model.number="indexBannerForm.deductionRatio">
                            <template slot="append">%</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="过期时间" prop="expireTime">
                        <el-date-picker
                                v-model="indexBannerForm.expireTime"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addSub('indexBannerForm')">确 定</el-button>
              </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "List",
        data() {
            let deductionPrice =(rule, value, callback) => {
                if (value&&this.indexBannerForm.deductionRatio) {
                    return callback(new Error('只能选择一种折扣方式'));
                }else {
                    callback();
                }
            };
            let deductionRatio = (rule, value, callback) => {
                if (value>100) {
                    return callback(new Error('折扣率不得高于100'));
                }else if(value&&this.indexBannerForm.deductionPrice){
                    return callback(new Error('只能选择一种折扣方式'));
                }{
                    callback();
                }
            };
            return {
                listData: [],
                total: null,
                pages: {
                    page: 1,
                    size: 10,
                },
                currentPage: null,
                selIds: [],
                dialogVisible:false,
                indexBannerForm:{
                    deductionPrice:"",
                    deductionRatio:"",
                    expireTime:''
                },
                indexBannerRule:{
                    deductionPrice: [
                        { required: false, validator: deductionPrice, trigger: 'blur' },
                    ],
                    deductionRatio: [
                        { required: false, validator: deductionRatio, trigger: 'blur' },
                    ],
                    expireTime: [
                        { required: true, message: '请选择起始时间', trigger: 'change' }
                    ],
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
                this.axios.post('/background/manage/getFreeShippingList', this.pages).then((res) => {
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
                this.dialogVisible = true;
                this.axios.post('/background/event/getDiscountById',{id}).then((res)=>{
                    if(res.code===10000){
                        this.indexBannerForm = res.data;
                    }
                })
            },
            addSub(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.axios.post('/background/manage/addFreeShipping',this.indexBannerForm).then((res)=>{
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
            handleAvatarSuccess(res){
                if(res.code===10000){
                    this.indexBannerForm.image = res.data
                }
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
</style>
