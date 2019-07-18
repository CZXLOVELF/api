<template>
    <div>
        <div class="add-tree">
            <span>书本分类</span>
            <i class="el-icon-plus" @click="addBtn"></i>
        </div>
        <el-tree
                ref="tree"
                class="tree"
                :props="props1"
                :load="loadNode1"
                lazy>
             <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
                  type="text"
                  size="mini"
                  @click="() => append(data)">
            添加
          </el-button>
          <el-button
                  type="text"
                  size="mini"
                  @click="() => remove(node, data)">
            删除
          </el-button>
        </span>
      </span>
        </el-tree>
        <el-dialog
                title="新增"
                :visible.sync="treeDialog"
                width="30%">
            <el-form :model="addForm" :rules="addRule" ref="addForm" label-width="100px">
                <el-form-item label="分类名称" prop="title">
                    <el-input v-model="addForm.title" placeholder="请输入分类名称"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="treeDialog = false">取 消</el-button>
                <el-button type="primary" @click="subBtn('addForm')">确 定</el-button>
             </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "classification",
        data() {
            return {
                getData:{
                    page:1,
                    size:999999
                },
                props1: {
                    label: 'title',
                    children: 'zones',
                },
                treeDialog:false,
                addForm:{
                    title:'',
                    classifyId:null
                },
                addRule:{
                    title: [
                        { required: true, message: '请填写分类名称', trigger: 'blur' }
                    ],
                },
                node:null,
                resolve:null
            }
        },
        mounted() {
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
            append(data) {
                this.addForm.classifyId=data.id;
                this.treeDialog=true
            },

            remove(node, data) {
                console.log(node);
                console.log(data);
            },
            handleNodeClick(){

            },
            addBtn(){
                this.addForm.classifyId=0;
                this.treeDialog=true
            },
            subBtn(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.axios.post('/background/manage/addBookClassify',this.addForm).then((res)=>{
                            if(res.code===10000){
                                this.$message({
                                    message: res.msg,
                                    type: 'success'
                                });
                                this.node.childNodes = [];
                                this.loadNode1(this.node, this.resolve);
                                this.treeDialog=false
                            }
                        });
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
    *{
        box-sizing: border-box;
    }
.tree{
    width: 300px;
}
.add-tree{
    width: 300px;
    line-height: 16px;
    padding: 20px 15px;
    font-size: 16px;
    border: 1px solid #ddd;
    vertical-align: bottom;
    display: flex;
    justify-content: space-between;
}
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
.add-ico{

}
</style>
