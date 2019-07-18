<template>
    <div>
        <el-form ref="form"
                 size="small"
                 :model="form"
                 :rules="formRule"
                 label-width="80px"
                 class="add-form">
            <el-form-item label="书名" prop="title">
                <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="作者" prop="author">
                <el-input v-model="form.author"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="classifyId">
                <el-input v-show="false" v-model="form.classifyId"></el-input>
                <el-input @focus="dialogVisible=true" v-model="form.classifyName"></el-input>
            </el-form-item>
            <el-form-item label="出版商" prop="publishingHouse">
                <el-input v-model="form.publishingHouse"></el-input>
            </el-form-item>
            <el-form-item label="单价" prop="price">
                <el-input v-model="form.price"></el-input>
            </el-form-item>
            <el-form-item label="图片" prop="image">
                <el-upload
                        action=""
                        class="avatar-uploader"
                        :http-request="uploadImg"
                        :show-file-list="false">
                    <img v-if="form.image" :src="form.image" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">添加</el-button>
            </el-form-item>
        </el-form>
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%">
            <el-tree
                    ref="tree"
                    show-checkbox
                    node-key="id"
                    highlight-current
                    :check-strictly="true"
                    class="tree"
                    :props="props1"
                    :load="loadNode1"
                    lazy
                    @check-change="handleClick" >
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="classBtn">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "add",
        data() {
            return {
                form:{
                    author:'',
                    title:'',
                    classifyId:'',
                    image:'',
                    price:'',
                    publishingHouse:'',
                    classifyName:'',
                },
                formRule:{
                    title: [
                        { required: true, message: '请填写分类名称', trigger: 'blur' }
                    ],
                    author: [
                        { required: true, message: '请填写分类名称', trigger: 'blur' }
                    ],
                    classifyId: [
                        { required: true, message: '请填写分类名称', trigger: 'change' }
                    ],
                    image: [
                        { required: true, message: '请填写分类名称', trigger: 'change' }
                    ],
                    price: [
                        { required: true, message: '请填写分类名称', trigger: 'blur' }
                    ],
                    publishingHouse: [
                        { required: true, message: '请填写分类名称', trigger: 'blur' }
                    ],
                },
                dialogVisible:false,
                getData:{
                    page:1,
                    size:999999
                },
                props1: {
                    label: 'title',
                    children: 'zones',
                },
            }
        },
        methods:{
            show(classifyId,resolve){
                this.axios.post('/background/manage/getBookClassifyList',{...this.getData,classifyId}).then((res)=>{
                    if(res.code===10000){
                        return resolve(res.data.records);
                    }
                })
            },
            loadNode1(node, resolve) {
                this.node=node;
                this.resolve=resolve;
                if (node.level === 0) {
                    node.childNodes=[];
                    this.show(0,resolve);
                }
                if(node.data){
                    node.childNodes=[];
                    this.show(node.data.id,resolve);
                }
            },
            handleClick(data,checked){
                if(checked){
                    this.$refs.tree.setCheckedNodes([data]);
                }
            },
            classBtn(){
                if(this.$refs.tree.getCheckedNodes().length!==0){
                    this.form.classifyId = this.$refs.tree.getCheckedNodes()[0].id;
                    this.form.classifyName = this.$refs.tree.getCheckedNodes()[0].title;
                }else {
                    this.form.classifyId='';
                    this.form.classifyName=''
                }
                this.dialogVisible = false
            },
            uploadImg(param){
                let fileObj = param.file;
                let form = new FormData();
                form.append("file", fileObj);
                this.axios.post('/background/manage/uploadBookImage',form).then((res)=>{
                    if(res.code===10000){
                        this.form.image = res.data;
                    }
                })
            },
            onSubmit(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.axios.post('/background/manage/addBook',this.form).then((res)=>{
                            if(res.code===10000){
                                this.$message({
                                    message: res.msg,
                                    type: 'success'
                                });
                                this.$emit('cut','list')
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
    .add-form {
        width: 600px;
        margin: 0 auto;
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
