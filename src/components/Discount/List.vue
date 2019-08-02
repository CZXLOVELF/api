<template>
    <div class="main">
        <div class="header-box">
            <el-form :inline="true" :model="pages">
                <el-form-item>
                    <el-button @click="addBtn">添加折扣</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="body-box">
            <el-table
                    :data="listData"
                    style="width: 100%">
                <el-table-column
                        prop="name"
                        label="折扣名称">
                </el-table-column>
                <el-table-column
                        prop="adminRemark"
                        label="简介">
                </el-table-column>
                <el-table-column
                        prop="updateTime"
                        label="上传时间">
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
                title="添加折扣"
                :visible.sync="dialogVisible"
                width="30%"
                @close="handleClose">
            <div>
                <el-form :model="indexBannerForm"
                         :rules="indexBannerRule"
                         ref="indexBannerForm"
                         label-width="130px">
                    <el-form-item label="折扣名称" prop="name">
                        <el-input v-model="indexBannerForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="折扣额度" prop="discountPrice">
                        <el-input v-model.number="indexBannerForm.discountPrice">
                            <template slot="append">￥</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="折扣率" prop="discountRatio">
                        <el-input v-model.number="indexBannerForm.discountRatio" type="number">
                            <template slot="append">%</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="起始时间" prop="time">
                        <el-date-picker
                                v-model="indexBannerForm.time"
                                type="datetimerange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="活动简介" prop="adminRemark">
                        <el-input v-model="indexBannerForm.adminRemark"
                                  type="textarea"
                                  autosize
                                  placeholder="请输入内容"
                                  resize="none"></el-input>
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
            let discountPrice =(rule, value, callback) => {
                if (value&&this.indexBannerForm.discountRatio) {
                    return callback(new Error('只能选择一种折扣方式'));
                }else {
                    callback();
                }
            };
            let discountRatio = (rule, value, callback) => {
                if (value>100) {
                    return callback(new Error('折扣率不得高于100'));
                }else if(value&&this.indexBannerForm.discountPrice){
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
                    id:'',
                    adminRemark:'',
                    endTime:'',
                    name:'',
                    startTime:'',
                    discountPrice:"",
                    discountRatio:"",
                    time:[]
                },
                indexBannerRule:{
                    name: [
                        { required: true, message: '请填写活动名称', trigger: 'blur' }
                    ],
                    time: [
                        { required: true, message: '请选择起始时间', trigger: 'change' }
                    ],
                    adminRemark: [
                        { required: true, message: '请填写活动简介', trigger: 'blur' }
                    ],
                    discountPrice: [
                        { required: false,trigger: 'blur' ,validator: discountPrice,},
                    ],
                    discountRatio:[
                        { required: false,trigger: 'blur' ,validator: discountRatio,},
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
                this.axios.post('/background/event/getDiscountList', this.pages).then((res) => {
                    if (res.code === 10000) {
                        this.total = Number(res.data.total);
                        this.currentPage = Number(res.data.current);
                        this.listData = res.data.records;
                    }
                })
            },
            addBtn(){
                this.indexBannerForm.id = "";
                this.dialogVisible = true
            },
            editBtn(id){
                this.dialogVisible = true;
                this.axios.post('/background/event/getDiscountById',{id}).then((res)=>{
                    if(res.code===10000){
                        this.indexBannerForm = res.data;
                        this.indexBannerForm.time = [];
                        this.indexBannerForm.time[0] = this.indexBannerForm.startTime;
                        this.indexBannerForm.time[1] = this.indexBannerForm.endTime;
                    }
                })
            },
            addSub(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url;
                        if(this.indexBannerForm.id){
                            url = '/background/event/updateDiscountById'
                        }else {
                            url = '/background/event/addDiscount'
                        }
                        this.indexBannerForm.startTime = this.indexBannerForm.time[0];
                        this.indexBannerForm.endTime = this.indexBannerForm.time[1];
                        this.axios.post(url,this.indexBannerForm).then((res)=>{
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
