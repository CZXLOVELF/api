<template>
    <div>
        <div class="header-box">
            <el-button @click="addBtn">添加书本</el-button>
            <el-button @click="classificationBtn">添加分类</el-button>
            <el-button>价格排序</el-button>
            <el-button>时间排序</el-button>
            <el-button>批量上架</el-button>
            <el-button>批量下架</el-button>
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
                        label="封面图">
                    <template slot-scope="scope">
                        <div class="img-box">
                            <img :src="scope.row.image">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="title"
                        label="书名">
                </el-table-column>
                <el-table-column
                        prop="author"
                        label="作者">
                </el-table-column>
                <el-table-column
                        prop="publishingHouse"
                        label="出版商">
                </el-table-column>
                <el-table-column
                        prop="price"
                        label="价格">
                </el-table-column>
                <el-table-column
                        prop="nowPrice"
                        label="现价">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="上传时间">
                </el-table-column>
                <el-table-column
                        prop="eventName"
                        label="参与活动">
                </el-table-column>
                <el-table-column
                        label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small">下架</el-button>
                        <el-button type="text" size="small">详情</el-button>
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
    </div>
</template>

<script>
    export default {
        name: "List",
        data() {
            return {
                listForm:{
                },
                listData:[],
                total:null,
                pages:{
                    page:1,
                    size:10
                },
                currentPage:null
            }
        },
        watch:{
            pages:{
                handler(){
                    this.show()
                },
                deep:true
            }
        },
        mounted() {
            this.show()
        },
        methods:{
            show(){
                this.axios.post('/background/manage/getBookList',{...this.listForm,...this.pages}).then((res)=>{
                    if(res.code===10000){
                        this.total = Number(res.data.total);
                        this.currentPage=Number(res.data.current);
                        this.listData=res.data.records;
                    }
                })
            },
            handleSelectionChange(){

            },
            handleSizeChange(val){
                this.pages.size = val
            },
            handleCurrentChange(val){
                this.pages.page = val
            },
            addBtn(){
                this.$emit('cut','add')
            },
            classificationBtn(){
                this.$emit('cut','classification')
            }
        }
    }
</script>

<style scoped>
*{
    box-sizing: border-box;
}
    .main{
        padding: 20px;
    }
    .header-box{

    }
    .body-box{
        padding-top: 20px;
    }
    .img-box{
        width: 80px;
        height: 80px;
    }
.img-box img{
    width: 100%;
    height: 100%;
}
    .footer-box{
        text-align: right;
        padding: 20px;
    }
</style>