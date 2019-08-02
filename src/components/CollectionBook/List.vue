<template>
    <div class="main">
        <div class="header-box">
            <el-form :inline="true" :model="pages">
                <el-form-item>
                    <el-button @click="addBtn">添加轮播图</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="shelves">批量激活</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="Undercarriage">批量禁用</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="body-box">
            <el-table
                    :data="listData"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        label="轮播图">
                    <template slot-scope="scope">
                        <div class="img-box">
                            <img :src="scope.row.image">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="playSecond"
                        label="轮播时间/秒">
                </el-table-column>
                <el-table-column
                        prop="jump"
                        label="路径">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="上传时间">
                </el-table-column>
                <el-table-column
                        width="175"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button type="success"
                                   size="small"
                                   @click="shelves(scope.row.id)"
                                   v-if="scope.row.state==='禁用'">激活
                        </el-button>
                        <el-button type="danger"
                                   size="small"
                                   @click="Undercarriage(scope.row.id)"
                                   v-if="scope.row.state==='活跃'">禁用
                        </el-button>
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
                title="添加轮播图"
                :visible.sync="dialogVisible"
                width="30%"
                @close="handleClose">
            <div>
                <el-form :model="indexBannerForm"
                         :rules="indexBannerRule"
                         ref="indexBannerForm"
                         label-width="150px">
                    <el-form-item label="轮播图轮播时间" prop="playSecond">
                        <el-input v-model="indexBannerForm.playSecond"></el-input>
                    </el-form-item>
                    <el-form-item label="跳转页面" prop="jump">
                        <el-select v-model="indexBannerForm.jump" placeholder="请选择活动区域">
                            <el-option v-for="(d,i) of jumpUrl" :label="d.info" :value="d.id" :key="i"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="轮播图" prop="image">
                        <el-upload
                                class="avatar-uploader"
                                :with-credentials="true"
                                :action="uploadIndexBanner"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess">
                            <img v-if="indexBannerForm.image" :src="indexBannerForm.image" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
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
                jumpUrl:[],
                uploadIndexBanner:'http://120.78.157.105:8080/background/banner/uploadAcquisitionBanner',
                indexBannerForm:{
                    id:'',
                    playSecond:'',
                    jump:'',
                    image:''
                },
                indexBannerRule:{
                    playSecond: [
                        { required: true, message: '请填写轮播时间', trigger: 'blur' }
                    ],
                    jump: [
                        { required: true, message: '请选择跳转路径', trigger: 'change' }
                    ],
                    image: [
                        { required: true, message: '请选择轮播图', trigger: 'change' }
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
            this.axios.post('/background/manage/getWeChatPagePath').then((res)=>{
                if(res.code===10000){
                    this.jumpUrl = res.data;
                }
            })
        },
        methods: {
            show() {
                this.axios.post('/background/banner/getAcquisitionBannerList', this.pages).then((res) => {
                    if (res.code === 10000) {
                        this.total = Number(res.data.total);
                        this.currentPage = Number(res.data.current);
                        this.listData = res.data.records;
                    }
                })
            },
            handleSelectionChange(sel) {
                this.selIds = [];
                for (let i of sel) {
                    this.selIds.push(i.id)
                }
            },
            shelves(data) {
                let ids = null;
                if (typeof data === 'string') {
                    ids = [data];
                } else {
                    ids = this.selIds
                }
                this.axios.post('/background/banner/pushAcquisitionBanner', {ids}).then((res) => {
                    if (res.code === 10000) {
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        this.show()
                    }
                })
            },
            Undercarriage(data) {
                let ids;
                if (typeof data === 'string') {
                    ids = [data];
                } else {
                    ids = this.selIds
                }
                this.axios.post('/background/banner/dropAcquisitionBanner', {ids}).then((res) => {
                    if (res.code === 10000) {
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        this.show()
                    }
                })
            },
            addBtn(){
                this.indexBannerForm.id = "";
                this.dialogVisible = true
            },
            editBtn(id){
                this.dialogVisible = true;
                this.axios.post('/background/banner/getAcquisitionBannerById',{id}).then((res)=>{
                    if(res.code===10000){
                        this.indexBannerForm = res.data
                    }
                })
            },
            addSub(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url;
                        if(this.indexBannerForm.id){
                            url = '/background/banner/updateAcquisitionBanner'
                        }else {
                            url = '/background/banner/addAcquisitionBanner'
                        }
                        this.axios.post(url,this.indexBannerForm).then((res)=>{
                            if(res.code===10000){
                                this.show();
                                this.$message({
                                    message: res.msg,
                                    type: 'success'
                                });
                                this.dialogVisible = false;
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
