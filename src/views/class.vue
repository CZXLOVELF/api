<template>
    <div>
        <div>
            <el-input v-show="false" v-model="form.classifyId"></el-input>
            <el-input @focus="dialogVisible=true" v-model="form.classify"></el-input>
        </div>
        <el-dialog
                @opened="openDia"
                append-to-body
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
        name: "class",
        data(){
            return{
                dialogVisible:false,
                form:{
                    classifyId:'',
                    classify:''
                },
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
        props:{
            classifyId:{
                type:String,
                default:''
            },
            classify:{
                type:String,
                default:''
            },
            url:String,
        },
        watch:{
            classifyId(n){
                this.form.classifyId = n
            },
            classify(n){
                this.form.classify = n
            }
        },
        methods:{
            openDia(){
                if(this.classifyId){
                    this.$refs.tree.setCheckedKeys([this.classifyId])
                }
            },
            show(classifyId,resolve){
                this.axios.post(this.url,{...this.getData,classifyId}).then((res)=>{
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
                    this.form.classify = this.$refs.tree.getCheckedNodes()[0].title;
                }else {
                    this.form.classifyId='';
                    this.form.classify=''
                }
                this.$emit('update:classifyId', this.form.classifyId);
                this.$emit('update:classify', this.form.classify);
                this.dialogVisible = false
            },
        }
    }
</script>

<style scoped>
    .dialog-box{
        height: 300px;
        overflow-y: auto;
    }
</style>
