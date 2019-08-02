<template>
    <div class="main">
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
                        prop="info"
                        label="操作">
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
    </div>
</template>

<script>
    export default {
        name: "AdminManageEvent",
        data() {
            return {
                listData: [],
                total: null,
                pages: {
                    page: 1,
                    size: 10,
                },
                currentPage: null,
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
                this.axios.post('/background/manage/getAdminManageEvent', this.pages).then((res) => {
                    if (res.code === 10000) {
                        this.total = Number(res.data.total);
                        this.currentPage = Number(res.data.current);
                        this.listData = res.data.records;
                    }
                })
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
