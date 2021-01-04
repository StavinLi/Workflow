<template>
    <el-drawer :append-to-body="true" title="审批人设置" :visible.sync="$store.state.approverDrawer" direction="rtl" class="set_promoter" size="550px" :before-close="saveApprover"> 
        <div class="demo-drawer__content">
            <div class="drawer_content">
                <div class="approver_content">
                    <el-radio-group v-model="approverConfig.settype" class="clear" @change="changeType">
                        <el-radio :label="1">指定成员</el-radio>
                        <el-radio :label="2">主管</el-radio>
                        <el-radio :label="4">发起人自选</el-radio>
                        <el-radio :label="5">发起人自己</el-radio>
                        <el-radio :label="7">连续多级主管</el-radio>
                    </el-radio-group>
                    <el-button type="primary" @click="addApprover" v-if="approverConfig.settype==1">添加/修改成员</el-button>
                    <p class="selected_list" v-if="approverConfig.settype==1">
                        <span v-for="(item,index) in approverConfig.nodeUserList" :key="index">{{item.name}}
                            <img src="@/assets/images/add-close1.png" @click="$func.removeEle(approverConfig.nodeUserList,item,'targetId')">
                        </span>
                        <a v-if="approverConfig.nodeUserList.length!=0" @click="approverConfig.nodeUserList=[]">清除</a>
                    </p>
                </div>
                <div class="approver_manager" v-if="approverConfig.settype==2">
                    <p>
                        <span>发起人的：</span>
                        <select v-model="approverConfig.directorLevel">
                            <option v-for="item in directorMaxLevel" :value="item" :key="item">{{item==1?'直接':'第'+item+'级'}}主管</option>
                        </select>
                    </p>
                    <p class="tip">找不到主管时，由上级主管代审批</p>
                </div>
                <div class="approver_self" v-if="approverConfig.settype==5">
                    <p>该审批节点设置“发起人自己”后，审批人默认为发起人</p>
                </div>
                <div class="approver_self_select" v-show="approverConfig.settype==4">
                    <el-radio-group v-model="approverConfig.selectMode" style="width: 100%;">
                        <el-radio :label="1">选一个人</el-radio>
                        <el-radio :label="2">选多个人</el-radio>
                    </el-radio-group>
                    <h3>选择范围</h3>
                    <el-radio-group v-model="approverConfig.selectRange" style="width: 100%;" @change="changeRange">
                        <el-radio :label="1">全公司</el-radio>
                        <el-radio :label="2">指定成员</el-radio>
                        <el-radio :label="3">指定角色</el-radio>
                    </el-radio-group>
                    <el-button type="primary" @click="addApprover" v-if="approverConfig.selectRange==2">添加/修改成员</el-button>
                    <el-button type="primary" @click="addRoleApprover" v-if="approverConfig.selectRange==3">添加/修改角色</el-button>
                    <p class="selected_list" v-if="approverConfig.selectRange==2||approverConfig.selectRange==3">
                        <span v-for="(item,index) in approverConfig.nodeUserList" :key="index">{{item.name}}
                            <img src="@/assets/images/add-close1.png" @click="$func.removeEle(approverConfig.nodeUserList,item,'targetId')">
                        </span>
                        <a v-if="approverConfig.nodeUserList.length!=0&&approverConfig.selectRange!=1" @click="approverConfig.nodeUserList=[]">清除</a>
                    </p>
                </div>
                <div class="approver_manager" v-if="approverConfig.settype==7">
                    <p>审批终点</p>
                    <p style="padding-bottom:20px">
                        <span>发起人的：</span>
                        <select v-model="approverConfig.examineEndDirectorLevel">
                            <option v-for="item in directorMaxLevel" :value="item" :key="item">{{item==1?'最高':'第'+item}}层级主管</option>
                        </select>
                    </p>
                </div>
                <div class="approver_some" v-if="(approverConfig.settype==1&&approverConfig.nodeUserList.length>1)||approverConfig.settype==2||(approverConfig.settype==4&&approverConfig.selectMode==2)">
                    <p>多人审批时采用的审批方式</p>
                    <el-radio-group v-model="approverConfig.examineMode" class="clear">
                        <el-radio :label="1">依次审批</el-radio>
                        <br/>
                        <el-radio :label="2" v-if="approverConfig.settype!=2">会签(须所有审批人同意)</el-radio>
                    </el-radio-group>
                </div>
                <div class="approver_some" v-if="approverConfig.settype==2||approverConfig.settype==7">
                    <p>审批人为空时</p>
                    <el-radio-group v-model="approverConfig.noHanderAction" class="clear">
                        <el-radio :label="1">自动审批通过/不允许发起</el-radio>
                        <br/>
                        <el-radio :label="2">转交给审核管理员</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class="demo-drawer__footer clear">
                <el-button type="primary" @click="saveApprover">确 定</el-button>
                <el-button @click="closeDrawer">取 消</el-button>
            </div>
            <el-dialog title="选择成员" :visible.sync="approverVisible" width="600px" append-to-body class="promoter_person">
                <div class="person_body clear">
                    <div class="person_tree l">
                        <input type="text" placeholder="搜索成员" v-model="approverSearchName" @input="getDebounceData($event)">
                        <p class="ellipsis tree_nav" v-if="!approverSearchName">
                            <span @click="getDepartmentList(0)" class="ellipsis">天下</span>
                            <span v-for="(item,index) in departments.titleDepartments" class="ellipsis" 
                            :key="index+'a'" @click="getDepartmentList(item.id)">{{item.departmentName}}</span>   
                        </p>
                        <ul>
                            <li v-for="(item,index) in departments.childDepartments" :key="index+'b'" class="check_box not">
                                <a><img src="@/assets/images/icon_file.png">{{item.departmentName}}</a>
                                <i @click="getDepartmentList(item.id)">下级</i>
                            </li>
                            <li v-for="(item,index) in departments.employees" :key="index+'c'" class="check_box">
                                <a :class="$func.toggleClass(approverEmplyessList,item)&&'active'" @click="$func.toChecked(approverEmplyessList,item)" :title="item.departmentNames">
                                    <img src="@/assets/images/icon_people.png">{{item.employeeName}}</a>
                            </li>
                        </ul>
                    </div>
                    <div class="has_selected l">
                        <p class="clear">已选（{{approverEmplyessList.length}}）
                            <a @click="approverEmplyessList=[]">清空</a>
                        </p>
                        <ul>
                            <li v-for="(item,index) in approverEmplyessList" :key="index+'e'">
                                <img src="@/assets/images/icon_people.png">
                                <span>{{item.employeeName}}</span>
                                <img src="@/assets/images/cancel.png" @click="$func.removeEle(approverEmplyessList,item)">
                            </li>
                        </ul>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="approverVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sureApprover">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="选择角色" :visible.sync="approverRoleVisible" width="600px" append-to-body class="promoter_person">
                <div class="person_body clear">
                    <div class="person_tree l">
                        <input type="text" placeholder="搜索角色" v-model="approverRoleSearchName" @input="getDebounceData($event,2)">
                        <ul>
                            <li v-for="(item,index) in roles" :key="index+'b'" class="check_box not"
                                :class="$func.toggleClass(roleList,item,'roleId')&&'active'" @click="roleList=[item]">
                                <a :title="item.description"><img src="@/assets/images/icon_role.png">{{item.roleName}}</a>
                            </li>
                        </ul>
                    </div>
                    <div class="has_selected l">
                        <p class="clear">已选（{{roleList.length}}）
                            <a @click="roleList=[]">清空</a>
                        </p>
                        <ul>
                            <li v-for="(item,index) in roleList" :key="index+'e'">
                                <img src="@/assets/images/icon_role.png">
                                <span>{{item.roleName}}</span>
                                <img src="@/assets/images/cancel.png" @click="$func.removeEle(roleList,item,'roleId')">
                            </li>
                        </ul>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="approverRoleVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sureApprover">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </el-drawer>
</template>
<script>
import mixins from './mixins'
export default {
    mixins: [ mixins],
    props: ['directorMaxLevel'],
    data(){
        return {
            approverConfig:{},
            approverVisible: false,
            approverRoleVisible: false,
            approverEmplyessList: [],
            approverSearchName: "",
            approverRoleSearchName: "",
            roleList: [],
        }
    },
     computed:{
        approverConfig1(){
            return this.$store.state.approverConfig.value
        }
    },
    watch:{
        approverConfig1(val){
            this.approverConfig = val;
        }
    },
    methods:{
        changeRange() {
            this.approverConfig.nodeUserList = [];
        },
        changeType(val) {
            this.approverConfig.nodeUserList = [];
            this.approverConfig.examineMode = 1;
            this.approverConfig.noHanderAction = 2;
            if (val == 2) {
                this.approverConfig.directorLevel = 1;
            } else if (val == 4) {
                this.approverConfig.selectMode = 1;
                this.approverConfig.selectRange = 1;
            } else if (val == 7) {
                this.approverConfig.examineEndDirectorLevel = 1
            }
        },
        addApprover() {
            this.approverVisible = true;
            this.approverSearchName = "";
            this.getDepartmentList();
            this.approverEmplyessList = [];
            for (var i = 0; i < this.approverConfig.nodeUserList.length; i++) {
                var { name, targetId } = this.approverConfig.nodeUserList[i];
                this.approverEmplyessList.push({
                    employeeName: name,
                    id: targetId
                });
            }
        },
        addRoleApprover() {
            this.approverRoleVisible = true;
            this.approverRoleSearchName = "";
            this.getRoleList();
            this.roleList = [];
            for (var i = 0; i < this.approverConfig.nodeUserList.length; i++) {
                var { name, targetId } = this.approverConfig.nodeUserList[i];
                this.roleList.push({
                    roleName: name,
                    roleId: targetId
                });
            }
        },
        sureApprover() {
            this.approverConfig.nodeUserList = [];
            if (this.approverConfig.settype == 1 || (this.approverConfig.settype == 4 && this.approverConfig.selectRange == 2)) {
                this.approverEmplyessList.map(item => {
                    this.approverConfig.nodeUserList.push({
                        type: 1,
                        targetId: item.id,
                        name: item.employeeName
                    })
                });
                this.approverVisible = false;
            } else if (this.approverConfig.settype == 4 && this.approverConfig.selectRange == 3) {
                this.roleList.map(item => {
                    this.approverConfig.nodeUserList.push({
                        type: 2,
                        targetId: item.roleId,
                        name: item.roleName
                    })
                });
                this.approverRoleVisible = false;
            }
        },
        saveApprover() {
            this.approverConfig.error = !this.$func.setApproverStr(this.approverConfig)
            this.$store.commit('updateApproverConfig',{
                value:this.approverConfig,
                flag:true,
                id:this.$store.state.approverConfig.id
            })
            this.$emit("update:nodeConfig", this.approverConfig);
            this.closeDrawer()
        },
        closeDrawer(){
            this.$store.commit('updateApprover',false)
        }
    }
}
</script>