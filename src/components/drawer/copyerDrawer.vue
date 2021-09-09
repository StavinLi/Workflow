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
            <el-dialog title="选择成员" :visible.sync="copyerVisible" width="600px" append-to-body class="promoter_person">
                <div class="person_body clear">
                    <div class="person_tree l">
                        <input type="text" placeholder="搜索成员" v-model="copyerSearchName" @input="getDebounceData($event,activeName)">
                        <el-tabs v-model="activeName" @tab-click="handleClick">
                            <el-tab-pane label="组织架构" name="1"></el-tab-pane>
                            <el-tab-pane label="角色列表" name="2"></el-tab-pane>
                        </el-tabs>
                        <p class="ellipsis tree_nav" v-if="activeName==1&&!copyerSearchName">
                            <span @click="getDepartmentList(0)" class="ellipsis">天下</span>
                            <span v-for="(item,index) in departments.titleDepartments" class="ellipsis" 
                            :key="index+'a'" @click="getDepartmentList(item.id)">{{item.departmentName}}</span>   
                        </p>
                        <ul style="height: 360px;" v-if="activeName==1">
                            <li v-for="(item,index) in departments.childDepartments" :key="index+'b'" class="check_box not">
                                <a><img src="@/assets/images/icon_file.png">{{item.departmentName}}</a>
                                <i @click="getDepartmentList(item.id)">下级</i>
                            </li>
                            <li v-for="(item,index) in departments.employees" :key="index+'c'" class="check_box">
                                <a :class="$func.toggleClass(copyerEmployessList,item)&&'active'" @click="$func.toChecked(copyerEmployessList,item)" :title="item.departmentNames">
                                    <img src="@/assets/images/icon_people.png">{{item.employeeName}}</a>
                            </li>
                        </ul>
                        <ul style="height: 360px;" v-if="activeName==2">
                            <li v-for="(item,index) in roles" :key="index+'c'" class="check_box">
                                <a :class="$func.toggleClass(copyerRoleList,item,'roleId')&&'active'" @click="$func.toChecked(copyerRoleList,item,'roleId')" :title="item.description">
                                    <img src="@/assets/images/icon_role.png">{{item.roleName}}</a>
                            </li>
                        </ul>
                    </div>
                    <div class="has_selected l">
                        <p class="clear">已选（{{copyerEmployessList.length+copyerRoleList.length}}）
                            <a @click="copyerEmployessList=[];copyerRoleList=[]">清空</a>
                        </p>
                        <ul>
                            <li v-for="(item,index) in copyerRoleList" :key="index+'e'">
                                <img src="@/assets/images/icon_role.png">
                                <span>{{item.roleName}}</span>
                                <img src="@/assets/images/cancel.png" @click="$func.removeEle(copyerRoleList,item,'roleId')">
                            </li>
                            <li v-for="(item,index) in copyerEmployessList" :key="index+'e1'">
                                <img src="@/assets/images/icon_people.png">
                                <span>{{item.employeeName}}</span>
                                <img src="@/assets/images/cancel.png" @click="$func.removeEle(copyerEmployessList,item)">
                            </li>
                        </ul>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="copyerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sureCopyer">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </el-drawer>
</template>

<script>
import xins from './mixins'
export default {
    mixins: [ xins],
    data(){
        return {
            copyerConfig: {},
            ccSelfSelectFlag: [],
            copyerVisible: false,
            copyerSearchName: "",
            copyerEmployessList: [],
            copyerRoleList: [],
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
            this.copyerSearchName = "";
            this.copyerVisible = true;
            this.activeName = "1";
            this.getDepartmentList();
            this.copyerEmployessList = [];
            this.copyerRoleList = [];
            for (var i = 0; i < this.copyerConfig.nodeUserList.length; i++) {
                var { type, name, targetId } = this.copyerConfig.nodeUserList[i];
                if (type == 1) {
                    this.copyerEmployessList.push({
                        employeeName: name,
                        id: targetId
                    });
                } else if (type == 2) {
                    this.copyerRoleList.push({
                        roleName: name,
                        roleId: targetId
                    });
                }
            }
        },
        sureCopyer() {
            this.copyerConfig.nodeUserList = [];
            this.copyerEmployessList.map(item => {
                this.copyerConfig.nodeUserList.push({
                    type: 1,
                    targetId: item.id,
                    name: item.employeeName
                })
            });
            this.copyerRoleList.map(item => {
                this.copyerConfig.nodeUserList.push({
                    type: 2,
                    targetId: item.roleId,
                    name: item.roleName
                })
            });
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