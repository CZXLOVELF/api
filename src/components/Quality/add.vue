<template>
    <div>
        <el-form ref="form"
                 size="small"
                 :model="form"
                 :rules="formRule"
                 label-width="80px"
                 class="add-form">
            <el-form-item label="商品名" prop="title">
                <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="单价" prop="price">
                <el-input v-model="form.price"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="classifyId">
                <el-input v-show="false" v-model="form.classifyId"></el-input>
                <el-input @focus="dialogVisible=true" v-model="form.classifyName"></el-input>
            </el-form-item>
            <el-form-item label="图片" prop="image">
                <el-upload
                        action=""
                        :http-request="uploadImg"
                        list-type="picture-card"
                        :on-preview="handlePictureCardPreview"
                        :before-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogImg">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">添加</el-button>
            </el-form-item>
        </el-form>
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%">
            <div class="dialog-box">
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
            </div>
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
                    title:'',
                    classifyId:'',
                    files:[],
                    price:'',
                    classifyName:'',
                },
                formRule:{
                    title: [
                        { required: true, message: '请填写商品名', trigger: 'blur' }
                    ],
                    classifyId: [
                        { required: true, message: '请选择分类', trigger: 'change' }
                    ],
                    files: [
                        { required: true, message: '请选择图片', trigger: 'change' }
                    ],
                    price: [
                        { required: true, message: '请填写价格', trigger: 'blur' }
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
                dialogImageUrl: '',
                dialogImg: false
            }
        },
        methods:{
            show(classifyId,resolve){
                this.axios.post('/background/manage/getSuperiorProductClassifyList',{...this.getData,classifyId}).then((res)=>{
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
                this.axios.post('/background/manage/uploadSuperiorProductImage',{file:param.file}).then((res)=>{
                    if(res.code===10000){
                        this.form.files.push(res.data);
                    }
                })
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogImg = true;
            },
            handleRemove(file, fileList){
                let index = fileList.findIndex((res)=>{
                    return res.uid === file.uid;
                });
                this.form.files.splice(index,1)
            },
            onSubmit(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let form = new FormData();
                        for (let i in this.form) {
                            form.append(i, this.form[i]);
                        }
                        this.axios.post('/background/manage/addSuperiorProduct',form).then((res)=>{
                            if(res.code===10000){
                                this.$message({
                                    message: res.msg,
                                    type: 'success'
                                });
                                this.$emit('cut','list')
                            }else {
                                this.$message.error(res.msg);
                            }
                        }).catch((err)=>{
                            this.$message.error('添加失败，请检查');
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
    .dialog-box{
        height: 300px;
        overflow-y: auto;
    }
</style>
