<template>
    <div>
        <div class="header-box">
            <el-form :inline="true" :model="pages">
                <el-form-item>
                    <el-button @click="addBtn">添加书本</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="classificationBtn">添加分类</el-button>
                </el-form-item>
                <el-form-item>
                    <el-dropdown @command="price">
                        <el-button type="primary">
                            价格排序<i class="el-icon-arrow-down el-icon--center"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="ascEnums">升序</el-dropdown-item>
                            <el-dropdown-item command="descEnums">降序</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>
                <el-form-item>
                    <el-dropdown @command="time">
                        <el-button type="primary">
                            时间<i class="el-icon-arrow-down el-icon--center"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="ascEnums">升序</el-dropdown-item>
                            <el-dropdown-item command="descEnums">降序</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>
                <el-form-item>
                    <el-button @click="shelves">批量上架</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="Undercarriage">批量下架</el-button>
                </el-form-item>
                <el-form-item label="书本名称">
                    <el-input v-model="pages.title" type="text"></el-input>
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
                    <template slot-scope="scope">
                        <el-tag class="tag" @click="discount(scope.row.id)" type="success">
                            {{eventName(scope.row.eventName)}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   size="small"
                                   @click="shelves(scope.row.id)"
                                   v-if="scope.row.onlineState==='下架'">上架
                        </el-button>
                        <el-button type="text"
                                   size="small"
                                   @click="Undercarriage(scope.row.id)"
                                   v-if="scope.row.onlineState==='上架'">下架
                        </el-button>
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
                listForm: {},
                listData: [],
                total: null,
                pages: {
                    page: 1,
                    size: 10,
                    ascEnums: [],
                    descEnums: [],
                    title: ''
                },
                currentPage: null,
                selIds: [],
            }
        },
        watch: {
            pages: {
                handler(n) {
                    console.log(n);
                    this.show()
                },
                deep: true
            }
        },
        computed: {
            eventName() {
                return function (name) {
                    if (name) {
                        return name
                    } else {
                        return "请选择折扣事件"
                    }
                }
            }
        },
        mounted() {
            this.show()
        },
        methods: {
            show() {
                this.axios.post('/background/manage/getBookList', {...this.listForm, ...this.pages}).then((res) => {
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
            price(comm) {
                if (comm === 'ascEnums') {
                    this.pages.descEnums = [];
                    this.pages.ascEnums = ['PRICE'];
                } else if (comm === 'descEnums') {
                    this.pages.ascEnums = [];
                    this.pages.descEnums = ['PRICE'];
                }
            },
            time(comm) {
                if (comm === 'ascEnums') {
                    this.pages.descEnums = [];
                    this.pages.ascEnums = ['CREATE_TIME'];
                } else if (comm === 'descEnums') {
                    this.pages.ascEnums = [];
                    this.pages.descEnums = ['CREATE_TIME'];
                }
            },
            shelves(data) {
                let form = new FormData();
                if (typeof data === 'string') {
                    data = [data];
                    form.append("ids", data);
                } else {
                    form.append("ids", this.selIds);
                }
                this.axios.post('/background/manage/pushBookByIds', form).then((res) => {
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
                let form = new FormData();
                if (typeof data === 'string') {
                    data = [data];
                    form.append("ids", data);
                } else {
                    form.append("ids", this.selIds);
                }
                this.axios.post('/background/manage/dropBookByIds', form).then((res) => {
                    if (res.code === 10000) {
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        this.show()
                    }
                })
            },
            discount(id) {
                console.log(id);
            },
            handleSizeChange(val) {
                this.pages.size = val
            },
            handleCurrentChange(val) {
                this.pages.page = val
            },
            addBtn() {
                this.$emit('cut', 'add')
            },
            classificationBtn() {
                this.$emit('cut', 'classification')
            },

        }
    }
</script>

<style scoped>
    * {
        box-sizing: border-box;
    }

    .main {
        padding: 20px;
    }

    .header-box {

    }

    .body-box {
        padding-top: 20px;
    }

    .img-box {
        width: 80px;
        height: 80px;
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
</style>