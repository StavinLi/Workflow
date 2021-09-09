<template>
    <el-drawer :append-to-body="true" title="抄送人设置" :visible.sync="$store.state.copyerDrawer" direction="rtl" class="set_copyer" size="550px" :before-close="saveCopyer"> 
        <div class="demo-drawer__content">
            <div class="copyer_content drawer_content">
                <el-button type="primary" @click="addCopyer">添加成员</el-button>
                <p class="selected_list">
                    <span v-for="(item,index) in copyerConfig.nodeUserList" :key="index">{{item.name}}
                        <img src="@/assets/images/add-close1.png" @click="$func.removeEle(copyerConfig.nodeUserList,item,'targetId')">
                    </span>
                    <a v-if="copyerConfig.nodeUserList&&copyerConfig.nodeUserList.length!=0" @click="copyerConfig.nodeUserList=[]">清除</a>
                </p>
                <el-checkbox-group v-model="ccSelfSelectFlag" class="clear">
                    <el-checkbox :label="1">允许发起人自选抄送人</el-checkbox>
                </el-checkbox-group>
            </div>
            <div class="demo-drawer__footer clear">
                <el-button type="primary" @click="saveCopyer">确 定</el-button>
                <el-button @click="closeDrawer">取 消</el-button>
            </div>
            <employees-role-dialog 
                :visible.sync="copyerVisible"
                :data.sync="checkedList"
                @change="sureCopyer"
            />
        </div>
    </el-drawer>
</template>
<script>
import employeesRoleDialog from '../dialog/employeesRoleDialog.vue'
export default {
    components:{
        employeesRoleDialog
    },
    data(){
        return {
            copyerConfig: {},
            ccSelfSelectFlag: [],
            copyerVisible: false,
            checkedList: [],
        }
    },
    computed:{
        copyerConfig1(){
            return this.$store.state.copyerConfig.value
        }
    },
    watch:{
        copyerConfig1(val){
            this.copyerConfig = val;
            this.ccSelfSelectFlag = this.copyerConfig.ccSelfSelectFlag == 0 ? [] : [this.copyerConfig.ccSelfSelectFlag]
        }
    },
    methods:{
        addCopyer() {
            this.copyerVisible = true;
            this.checkedList = this.copyerConfig.nodeUserList
        },
        sureCopyer(data) {
            this.copyerConfig.nodeUserList = data;
            this.copyerVisible = false;
        },
        saveCopyer() {
            this.copyerConfig.ccSelfSelectFlag = this.ccSelfSelectFlag.length == 0 ? 0 : 1;
            this.copyerConfig.error = !this.$func.copyerStr(this.copyerConfig);
            this.$store.commit('updateCopyerConfig',{
                value:this.copyerConfig,
                flag:true,
                id:this.$store.state.copyerConfig.id
            })
            this.closeDrawer();
        },
        closeDrawer(){
            this.$store.commit('updateCopyer',false)
        },     
    }
}
</script>

<style lang="less">
.set_copyer{
    .copyer_content{
        padding: 20px 20px 0;
        .el-button{
            margin-bottom: 20px;
        }
        .el-checkbox {
            margin-bottom: 20px;
        }
    }
}
</style>