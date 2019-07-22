<template>
    <div class="main">
        <div class="header-box">
            <el-form :inline="true" :model="pages">
                <el-form-item>
                    <el-button @click="addBtn">添加优品</el-button>
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
                <el-form-item label="优品名称">
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
                        <el-carousel :interval="4000" type="card" height="70px">
                            <el-carousel-item v-for="(d,i) of scope.row.image" :key="i">
                                <img :src="d.image">
                            </el-carousel-item>
                        </el-carousel>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="title"
                        label="书名">
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
                        <el-tag class="tag" @click="discount(scope.row.id,scope.row.discountEventId)" type="success">
                            {{eventName(scope.row.eventName)}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        width="175"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button type="success"
                                   size="small"
                                   @click="shelves(scope.row.id)"
                                   v-if="scope.row.onlineState==='下架'">上架
                        </el-button>
                        <el-button type="danger"
                                   size="small"
                                   @click="Undercarriage(scope.row.id)"
                                   v-if="scope.row.onlineState==='上架'">下架
                        </el-button>
                        <el-button type="primary" @click="detailsBtn(scope.row.id)" size="small">详情</el-button>
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
                title="折扣活动"
                :visible.sync="discountDia"
                width="40%"
                @close="handleClose('discountForm')">
            <div class="dialog-box">
                <el-form ref="discountForm"
                         :model="discountForm"
                         label-width="120px">
                    <el-form-item label="活动名称" prop="id">
                        <el-select v-model="discountForm.id"
                                   filterable placeholder="请选择，可搜索"
                                   @change="selectId">
                            <el-option
                                    v-for="item in discountList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="折扣额度" prop="discountPrice">
                        <el-input disabled v-model="discountForm.discountPrice">
                            <template slot="append">￥</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="折扣率" prop="discountRatio">
                        <el-input disabled v-model="discountForm.discountRatio">
                            <template slot="append">%</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item  label="活动起止时间" prop="time">
                        <el-date-picker
                                disabled
                                v-model="discountForm.time"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="活动简介" prop="adminRemark">
                        <el-input
                                disabled
                                type="textarea"
                                resize="none"
                                :autosize="true"
                                v-model="discountForm.adminRemark">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="discountDia = false">取 消</el-button>
            <el-button type="primary" @click="subBtn">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
                title="优品详情"
                :visible.sync="detailsDia"
                width="40%"
                @close="handleClose('bookDetails')">
            <div class="dialog-box">
                <el-form ref="bookDetails"
                         :model="bookDetails"
                         :rules="bookDetailsRule"
                         label-width="140px">
                    <el-form-item label="优品名" prop="title">
                        <el-input
                                type="text"
                                v-model="bookDetails.title">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="单价" prop="price">
                        <el-input
                                type="text"
                                v-model="bookDetails.price">
                            <template slot="append">￥</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="同分类下推荐权重" prop="classifyRecommendWeight">
                        <el-input
                                type="text"
                                v-model="bookDetails.classifyRecommendWeight">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="同分类下排序权重" prop="classifySort">
                        <el-input
                                type="text"
                                v-model="bookDetails.classifySort">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="书金抵扣额度" prop="deductionPrice">
                        <el-input
                                type="text"
                                v-model="bookDetails.deductionPrice">
                            <template slot="append">￥</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="书金抵扣比率" prop="deductionRatio">
                        <el-input
                                type="text"
                                maxlength="2"
                                v-model="bookDetails.deductionRatio">
                            <template slot="append">%</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="推荐权重" prop="recommendWeight">
                        <el-input
                                type="text"
                                v-model="bookDetails.recommendWeight">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="排序权重" prop="sort">
                        <el-input
                                type="text"
                                v-model="bookDetails.sort">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="分类" prop="classifyId">
                        <classInput
                                :classifyId.sync="bookDetails.classifyId"
                                :classify.sync="bookDetails.classify"
                                :url="classUrl"
                        ></classInput>
                    </el-form-item>
                    <el-form-item label="轮播图" prop="addImage">
                        <div class="rotary">
                            <div class="rotary-image-box"
                                 v-for="(d,i) of bookDetails.image"
                                 :key="i" >
                                <img class="rotary-image"
                                     :src="d.image">
                                <div class="delete-btn" @click="deleteBtn(d)"></div>
                                <el-form :model="d" class="form" size="mini">
                                    <el-form-item>
                                        <el-input v-model="d.playSecond" class="transparent">
                                            <template slot="prepend">秒</template>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-input v-model="d.sort" class="transparent">
                                            <template slot="prepend">排序</template>
                                        </el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="rotary-image-box"
                                 v-for="(d,l) of bookDetails.addImage"
                                 :key="-(l+1)" >
                                <img class="rotary-image"
                                     :src="d.image">
                                <div class="delete-btn" @click="deleteBtn(d)"></div>
                                <el-form :model="d" class="form" size="mini">
                                    <el-form-item>
                                        <el-input v-model="d.playSecond" class="transparent">
                                            <template slot="prepend">秒</template>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-input v-model="d.sort" class="transparent">
                                            <template slot="prepend">排序</template>
                                        </el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <el-upload
                                    class="upload-box"
                                    :action="upLoadUrl"
                                    :show-file-list="false"
                                    :with-credentials="true"
                                    :on-success="handleAvatarSuccess">
                                <i class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="detailsDia = false">取 消</el-button>
            <el-button type="primary" @click="detailSubBtn('bookDetails')">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
    import classInput from '@/views/class'
    export default {
        name: "List",
        data() {
            let addImage = (rule, value, callback) => {
                if (value.length===0&&this.bookDetails.image.length===0) {
                    return callback(new Error('请选择轮播图'));
                }else {
                    callback();
                }
            };
            return {
                upLoadUrl:'http://120.78.157.105:8080/background/manage/uploadSuperiorProductImage',
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
                discountDia:false,
                detailsDia:false,
                discountForm:{
                    adminRemark: "",
                    createTime: "",
                    discountPrice: null,
                    discountRatio: null,
                    time:[],
                    endTime: "",
                    freeShopping: "",
                    id: "",
                    maxNumber: null,
                    mininum: null,
                    name: "",
                    startTime: "",
                    state: "",
                    updateTime: "",
                    userLevel: null
                },
                discountList:[],
                bookId:null,
                bookDetails: {
                    classify: '',
                    classifyId: null,
                    classifyRecommendWeight: null,
                    classifySort: null,
                    createTime: null,
                    deductionPrice: null,
                    deductionRatio: null,
                    discountEventId: null,
                    eventName: null,
                    id: null,
                    image: [],
                    addImage: [],
                    nowPrice: null,
                    onlineState: null,
                    price: null,
                    recommendWeight: null,
                    sort: null,
                    star: null,
                    title: null,
                    updateTime: null,
                    removeImage:[]
                },
                dialogImageUrl: '',
                dialogImg: false,
                classUrl:'/background/manage/getSuperiorProductClassifyList',
                bookDetailsRule:{
                    title: [
                        { required: true, message: '请填写优品名称', trigger: 'blur' }
                    ],
                    price: [
                        { required: true, message: '请填写优品单价', trigger: 'blur' }
                    ],
                    classifyRecommendWeight: [
                        { required: true, message: '请填写同分类下推荐权重', trigger: 'blur' }
                    ],
                    classifySort: [
                        { required: true, message: '请填写同分类下排序权重', trigger: 'blur' }
                    ],
                    deductionPrice: [
                        { required: true, message: '请填写优品金抵扣额度', trigger: 'blur' }
                    ],
                    deductionRatio: [
                        { required: true, message: '请填写优品金抵扣比率', trigger: 'blur' }
                    ],
                    addImage: [
                        { required: true, validator: addImage, trigger: ['blur','change'] }
                    ],
                    recommendWeight: [
                        { required: true, message: '请填写推荐权重', trigger: 'blur' }
                    ],
                    sort: [
                        { required: true, message: '请填写排序权重', trigger: 'blur' }
                    ],
                    classifyId:[
                        { required: true, message: '请选择优品分类', trigger: ['blur','change'] }
                    ],
                }
            }
        },
        components:{
            classInput
        },
        watch: {
            pages: {
                handler() {
                    this.show()
                },
                deep: true
            },
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
            this.show();
            this.axios.post('/background/event/getDiscountList',{page:1,size:99999}).then((res)=>{
                if(res.code===10000){
                    this.discountList = res.data.records;
                }
            })
        },
        methods: {
            show() {
                this.axios.post('/background/manage/getSuperiorProductList', {...this.listForm, ...this.pages}).then((res) => {
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
                let ids = null;
                if (typeof data === 'string') {
                    ids = [data];
                } else {
                    ids = this.selIds
                }
                this.axios.post('/background/manage/pushSuperiorProductByIds', {ids}).then((res) => {
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
                let ids = null;
                if (typeof data === 'string') {
                    ids = [data];
                } else {
                    ids = this.selIds
                }
                this.axios.post('/background/manage/dropSuperiorProductByIds', {ids}).then((res) => {
                    if (res.code === 10000) {
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        this.show()
                    }
                })
            },
            getDiscount(id){
                this.bookDetails.discountEventId = id;
                this.axios.post('/background/event/getDiscountById',{id}).then((res)=>{
                    if(res.code===10000){
                        this.discountForm = res.data;
                        this.discountForm.time = [res.data.startTime,res.data.endTime];
                    }
                });
            },
            discount(id,discountEventId) {
                this.discountDia = true;
                if(discountEventId){
                    this.getDiscount(discountEventId)
                }
                this.details(id);
            },
            detailsBtn(id){
                this.details(id);
                this.detailsDia = true
            },
            details(id){
                this.axios.post('/background/manage/getSuperiorProductById',{id}).then((res)=>{
                    if(res.code===10000){
                        this.bookDetails = {...this.bookDetails,...res.data};
                    }
                })
            },
            selectId(id){
                this.getDiscount(id);
            },
            handleClose(Form){
                this.$refs[Form].resetFields();
                this.bookDetails.addImage = [];
                this.bookDetails.removeImage = []
            },
            subBtn(formName){
                let form = new FormData();
                if(this.bookDetails.removeImage.length===0){
                    delete this.bookDetails.removeImage
                }
                for (let i in this.bookDetails) {
                    if(i==='image'||i==='addImage')
                        continue;
                    form.append(i, this.bookDetails[i]);
                }
                for (let n in this.bookDetails.image) {
                    for(let m in this.bookDetails.image[n]){
                        form.append('image['+[n]+'].'+m, this.bookDetails.image[n][m]);
                    }
                }
                for (let n in this.bookDetails.addImage) {
                    for(let m in this.bookDetails.addImage[n]){
                        form.append('addImage['+[n]+'].'+m, this.bookDetails.addImage[n][m]);
                    }
                }

                this.axios.post('/background/manage/updateSuperiorProductById', form).then((res)=>{
                    if(res.code===10000){
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        this.show();
                        if(formName==='bookDetails'){
                            this.detailsDia = false
                        }else {
                            this.discountDia = false
                        }
                    }
                });
            },
            handleAvatarSuccess(response){
                let rotary = {
                    id: "",
                    image: response.data,
                    playSecond: "5",
                    sort: "0",
                };
                this.bookDetails.addImage.push(rotary)
            },
            detailSubBtn(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.subBtn(formName)
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },
            handleSizeChange(val) {
                this.pages.size = val
            },
            handleCurrentChange(val) {
                this.pages.page = val
            },
            deleteBtn(data){
                if(data.id){
                    let index = this.bookDetails.image.findIndex((res)=>{
                        return res.image ===data.image
                    });
                    this.bookDetails.image.splice(index,1);
                    this.bookDetails.removeImage.push(data.id);
                }else {
                    let index = this.bookDetails.addImage.findIndex((res)=>{
                        return res.image ===data.image
                    });
                    this.bookDetails.addImage.splice(index,1)
                }
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
        width: 100%;
    }

    .header-box {

    }

    .body-box {
        width: 100%;
        padding-top: 20px;
    }

    .img-box img {
        width: 75px;
        height: 70px;
        margin: 0 5px;
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
    /deep/ .el-upload {
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
        width: 148px;
        height: 148px;
        line-height: 148px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .el-carousel__item img{
        width: 100%;
        height: 100%;
    }
    .rotary{
        display: flex;
        flex-wrap: wrap;
    }
    .rotary-image-box{
        position: relative;
        width: 148px;
        height: 148px;
        margin-right: 10px;
        margin-bottom: 10px;
    }
    .rotary-image{
        border-radius: 5px;
        height: 148px;
        width: 148px;
    }
    .delete-btn{
        position: absolute;
        width: 15px;
        height: 15px;
        background: #fd5454;
        margin: 5px;
        top: 0;
        right: 0;
        border-radius: 100%;
        cursor: pointer;
        min-height: 0;
    }
    .delete-btn::after{
        position: absolute;
        content: "";
        width: 60%;
        left: 20%;
        height: 2px;
        border-radius: 2px;
        background: #fff;
        top: 50%;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
    }
    .form{
        width: 120px;
        margin: 0 auto;
        position: absolute;
        bottom: 0;
        left: 13px;
        display: none;
        transition: all 2s;
    }
    .el-form-item--mini.el-form-item{
        margin-bottom: 2px;
    }
    .transparent{
        opacity:0.8
    }
    .rotary-image-box:hover .form{
        display: block;
    }
</style>
