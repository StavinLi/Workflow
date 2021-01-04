<template>
    <el-drawer :append-to-body="true" title="条件设置" :visible.sync="$store.state.conditionDrawer" direction="rtl" class="condition_copyer" size="550px" :before-close="saveCondition"> 
        <select v-model="conditionConfig.priorityLevel" class="priority_level">
            <option v-for="item in conditionsConfig.conditionNodes.length" :value="item" :key="item">优先级{{item}}</option>
        </select>
        <div class="demo-drawer__content">
            <div class="condition_content drawer_content">
                <p class="tip">当审批单同时满足以下条件时进入此流程</p>
                <ul>
                    <li v-for="(item,index) in conditionConfig.conditionList" :key="index">
                        <span class="ellipsis">{{item.type==1?'发起人':item.showName}}：</span>
                        <div v-if="item.type==1">
                            <p :class="conditionConfig.nodeUserList.length > 0?'selected_list':''" @click.self="addConditionRole" style="cursor:text">
                                <span v-for="(item1,index1) in conditionConfig.nodeUserList" :key="index1">
                                    {{item1.name}}<img src="@/assets/images/add-close1.png" @click="$func.removeEle(conditionConfig.nodeUserList,item1,'targetId')">
                                </span>
                                <input type="text" placeholder="请选择具体人员/角色/部门" v-if="conditionConfig.nodeUserList.length == 0" @click="addConditionRole">
                            </p>
                        </div>
                        <div v-else-if="item.columnType == 'String' && item.showType == 3">
                            <p class="check_box">
                                <a :class="$func.toggleStrClass(item,item1.key)&&'active'" @click="toStrChecked(item,item1.key)"
                                v-for="(item1,index1) in JSON.parse(item.fixedDownBoxValue)" :key="index1">{{item1.value}}</a>
                            </p>
                        </div>
                        <div v-else>
                            <p>
                                <select v-model="item.optType" :style="'width:'+(item.optType==6?370:100)+'px'" @change="changeOptType(item)">
                                    <option value="1">小于</option>
                                    <option value="2">大于</option>
                                    <option value="3">小于等于</option>
                                    <option value="4">等于</option>
                                    <option value="5">大于等于</option>
                                    <option value="6">介于两个数之间</option>
                                </select>
                                <input v-if="item.optType!=6" type="text" :placeholder="'请输入'+item.showName" v-enter-number="2" v-model="item.zdy1">
                            </p>
                            <p v-if="item.optType==6">
                                <input type="text" style="width:75px;" class="mr_10" v-enter-number="2" v-model="item.zdy1">
                                <select style="width:60px;" v-model="item.opt1">
                                    <option value="<">&lt;</option>
                                    <option value="≤">≤</option>
                                </select>
                                <span class="ellipsis" style="display:inline-block;width:60px;vertical-align: text-bottom;">{{item.showName}}</span>
                                <select style="width:60px;" class="ml_10" v-model="item.opt2">
                                    <option value="<">&lt;</option>
                                    <option value="≤">≤</option>
                                </select>
                                <input type="text" style="width:75px;" v-enter-number="2" v-model="item.zdy2">
                            </p>
                        </div>
                        <a v-if="item.type==1" @click="conditionConfig.nodeUserList= [];$func.removeEle(conditionConfig.conditionList,item,'columnId')">删除</a>
                        <a v-if="item.type==2" @click="$func.removeEle(conditionConfig.conditionList,item,'columnId')">删除</a>
                    </li>
                </ul>
                <el-button type="primary" @click="addCondition">添加条件</el-button>
                <el-dialog title="选择条件" :visible.sync="conditionVisible" width="480px" append-to-body class="condition_list">
                    <p>请选择用来区分审批流程的条件字段</p>
                    <p class="check_box">
                        <a :class="$func.toggleClass(conditionList,{columnId:0},'columnId')&&'active'" @click="$func.toChecked(conditionList,{columnId:0},'columnId')">发起人</a>
                        <a v-for="(item,index) in conditions" :key="index" :class="$func.toggleClass(conditionList,item,'columnId')&&'active'" 
                        @click="$func.toChecked(conditionList,item,'columnId')">{{item.showName}}</a>
                    </p>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="conditionVisible = false">取 消</el-button>
                        <el-button type="primary" @click="sureCondition">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
            <el-dialog title="选择成员" :visible.sync="conditionRoleVisible" width="600px" append-to-body class="promoter_person">
                <div class="person_body clear">
                    <div class="person_tree l">
                        <input type="text" placeholder="搜索成员" v-model="conditionRoleSearchName" @input="getDebounceData($event,activeName)">
                        <el-tabs v-model="activeName" @tab-click="handleClick">
                            <el-tab-pane label="组织架构" name="1"></el-tab-pane>
                            <el-tab-pane label="角色列表" name="2"></el-tab-pane>
                        </el-tabs>
                        <p class="ellipsis tree_nav" v-if="activeName==1&&!conditionRoleSearchName">
                            <span @click="getDepartmentList(0)" class="ellipsis">天下</span>
                            <span v-for="(item,index) in departments.titleDepartments" class="ellipsis" 
                            :key="index+'a'" @click="getDepartmentList(item.id)">{{item.departmentName}}</span>   
                        </p>
                        <ul style="height: 360px;" v-if="activeName==1">
                            <li v-for="(item,index) in departments.childDepartments" :key="index+'b'" class="check_box">
                                <a :class="$func.toggleClass(conditionDepartmentList,item)&&'active'" @click="$func.toChecked(conditionDepartmentList,item)">
                                    <img src="@/assets/images/icon_file.png">{{item.departmentName}}</a>
                                <i @click="getDepartmentList(item.id)">下级</i>
                            </li>
                            <li v-for="(item,index) in departments.employees" :key="index+'c'" class="check_box">
                                <a :class="$func.toggleClass(conditionEmployessList,item)&&'active'" @click="$func.toChecked(conditionEmployessList,item)" :title="item.departmentNames">
                                    <img src="@/assets/images/icon_people.png">{{item.employeeName}}</a>
                            </li>
                        </ul>
                        <ul style="height: 360px;" v-if="activeName==2">
                            <li v-for="(item,index) in roles" :key="index+'c'" class="check_box">
                                <a :class="$func.toggleClass(conditionRoleList,item,'roleId')&&'active'" @click="$func.toChecked(conditionRoleList,item,'roleId')" :title="item.description">
                                    <img src="@/assets/images/icon_role.png">{{item.roleName}}</a>
                            </li>
                        </ul>
                    </div>
                    <div class="has_selected l">
                        <p class="clear">已选（{{conditionDepartmentList.length+conditionEmployessList.length+conditionRoleList.length}}）
                            <a @click="conditionDepartmentList=[];conditionEmployessList=[];conditionRoleList=[]">清空</a>
                        </p>
                        <ul>
                            <li v-for="(item,index) in conditionRoleList" :key="index+'e'">
                                <img src="@/assets/images/icon_role.png">
                                <span>{{item.roleName}}</span>
                                <img src="@/assets/images/cancel.png" @click="$func.removeEle(conditionRoleList,item,'roleId')">
                            </li>
                            <li v-for="(item,index) in conditionDepartmentList" :key="index+'e1'">
                                <img src="@/assets/images/icon_file.png">
                                <span>{{item.departmentName}}</span>
                                <img src="@/assets/images/cancel.png" @click="$func.removeEle(conditionDepartmentList,item)">
                            </li>
                            <li v-for="(item,index) in conditionEmployessList" :key="index+'e2'">
                                <img src="@/assets/images/icon_people.png">
                                <span>{{item.employeeName}}</span>
                                <img src="@/assets/images/cancel.png" @click="$func.removeEle(conditionEmployessList,item)">
                            </li>
                        </ul>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="conditionRoleVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sureConditionRole">确 定</el-button>
                </span>
            </el-dialog>
            <div class="demo-drawer__footer clear">
                <el-button type="primary" @click="saveCondition">确 定</el-button>
                <el-button @click="$store.commit('updateCondition',false)">取 消</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script>
import xins from './mixins'
export default {
    mixins: [ xins],
    data(){
        return {
            conditionVisible: false,
            conditionsConfig: {
                conditionNodes: [],
            },
            conditionConfig: {},
            PriorityLevel:"",
            conditionRoleSearchName: "",
            conditionDepartmentList: [],
            conditionEmployessList: [],
            conditionRoleList: [],
            conditions: [],
            conditionList: [],
            conditionRoleVisible: false,
        }
    },
    computed:{
        conditionsConfig1(){
            return this.$store.state.conditionsConfig
        },
    },
    watch:{
        conditionsConfig1(val){
            this.conditionsConfig = val.value;
            this.PriorityLevel = val.priorityLevel
            this.conditionConfig = val.priorityLevel
            ?this.conditionsConfig.conditionNodes[val.priorityLevel - 1]
            :{nodeUserList:[],conditionList:[]}
        },
    },
    methods:{
        changeOptType(item) {
            if (item.optType == 1) {
                item.zdy1 = 2;
            } else {
                item.zdy1 = 1;
                item.zdy2 = 2;
            }
        },
        toStrChecked(item, key) {
            let a = item.zdy1 ? item.zdy1.split(",") : []
            var isIncludes = this.$func.toggleStrClass(item, key);
            if (!isIncludes) {
                a.push(key)
                item.zdy1 = a.toString()
            } else {
                this.removeStrEle(item, key);
            }
        },
        removeStrEle(item, key) {
            let a = item.zdy1 ? item.zdy1.split(",") : []
            var includesIndex;
            a.map((item, index) => {
                if (item == key) {
                    includesIndex = index
                }
            });
            a.splice(includesIndex, 1);
            item.zdy1 = a.toString()
        }, 
        addCondition() {
            this.conditionList = [];
            this.conditionVisible = true;
            this.$axios.get(`${process.env.BASE_URL}conditions.json?tableId=${this.tableId}`).then(res => {
                this.conditions = res.data;
                if (this.conditionConfig.conditionList) {
                    for (var i = 0; i < this.conditionConfig.conditionList.length; i++) {
                        var { columnId } = this.conditionConfig.conditionList[i]
                        if (columnId == 0) {
                            this.conditionList.push({ columnId: 0 })
                        } else {
                            this.conditionList.push(this.conditions.filter(item => { return item.columnId == columnId; })[0])
                        }
                    }
                }
            })
        },
        sureCondition() {
            //1.弹窗有，外面无+
            //2.弹窗有，外面有不变
            for (var i = 0; i < this.conditionList.length; i++) {
                var { columnId, showName, columnName, showType, columnType, fixedDownBoxValue } = this.conditionList[i];
                if (this.$func.toggleClass(this.conditionConfig.conditionList, this.conditionList[i], "columnId")) {
                    continue;
                }
                if (columnId == 0) {
                    this.conditionConfig.nodeUserList == [];
                    this.conditionConfig.conditionList.push({
                        "type": 1,
                        "columnId": columnId,
                        "showName": '发起人'
                    });
                } else {
                    if (columnType == "Double") {
                        this.conditionConfig.conditionList.push({
                            "showType": showType,
                            "columnId": columnId,
                            "type": 2,
                            "showName": showName,
                            "optType": "1",
                            "zdy1": "2",
                            "opt1": "<",
                            "zdy2": "",
                            "opt2": "<",
                            "columnDbname": columnName,
                            "columnType": columnType,
                        })
                    } else if (columnType == "String" && showType == "3") {
                        this.conditionConfig.conditionList.push({
                            "showType": showType,
                            "columnId": columnId,
                            "type": 2,
                            "showName": showName,
                            "zdy1": "",
                            "columnDbname": columnName,
                            "columnType": columnType,
                            "fixedDownBoxValue": fixedDownBoxValue
                        })
                    }
                }
            }
            ////3.弹窗无，外面有-
            for (let i = this.conditionConfig.conditionList.length - 1; i >= 0; i--) {
                if (!this.$func.toggleClass(this.conditionList, this.conditionConfig.conditionList[i], "columnId")) {
                    this.conditionConfig.conditionList.splice(i, 1);
                }
            }
            this.conditionConfig.conditionList.sort(function (a, b) { return a.columnId - b.columnId; });
            this.conditionVisible = false;
        },
        saveCondition() {
            this.$store.commit('updateCondition',false)
            var a = this.conditionsConfig.conditionNodes.splice(this.PriorityLevel - 1, 1)//截取旧下标
            this.conditionsConfig.conditionNodes.splice(this.conditionConfig.priorityLevel - 1, 0, a[0])//填充新下标
            this.conditionsConfig.conditionNodes.map((item, index) => {
                item.priorityLevel = index + 1
            });
            for (var i = 0; i < this.conditionsConfig.conditionNodes.length; i++) {
                this.conditionsConfig.conditionNodes[i].error = this.$func.conditionStr(this.conditionsConfig, i) == "请设置条件" && i != this.conditionsConfig.conditionNodes.length - 1
            }
            this.$store.commit('updateConditionsConfig',{
                value:this.conditionsConfig,
                flag:true,
                id:this.$store.state.conditionsConfig.id
            })
        },
        addConditionRole() {
            this.conditionRoleSearchName = "";
            this.conditionRoleVisible = true;
            this.activeName = "1";
            this.getDepartmentList();
            this.conditionDepartmentList = [];
            this.conditionEmployessList = [];
            this.conditionRoleList = [];
            for (var i = 0; i < this.conditionConfig.nodeUserList.length; i++) {
                var { type, name, targetId } = this.conditionConfig.nodeUserList[i];
                if (type == 1) {
                    this.conditionEmployessList.push({
                        employeeName: name,
                        id: targetId
                    });
                } else if (type == 2) {
                    this.conditionRoleList.push({
                        roleName: name,
                        roleId: targetId
                    });
                } else if (type == 3) {
                    this.conditionDepartmentList.push({
                        departmentName: name,
                        id: targetId
                    });
                }
            }
        },
        sureConditionRole() {
            this.conditionConfig.nodeUserList = [];
            this.conditionRoleList.map(item => {
                this.conditionConfig.nodeUserList.push({
                    type: 2,
                    targetId: item.roleId,
                    name: item.roleName
                })
            });
            this.conditionDepartmentList.map(item => {
                this.conditionConfig.nodeUserList.push({
                    type: 3,
                    targetId: item.id,
                    name: item.departmentName
                })
            });
            this.conditionEmployessList.map(item => {
                this.conditionConfig.nodeUserList.push({
                    type: 1,
                    targetId: item.id,
                    name: item.employeeName
                })
            });
            this.conditionRoleVisible = false;
        },
        
    }
}
</script>

<style>

</style>