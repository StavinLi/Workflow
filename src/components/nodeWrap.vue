<template>
    <div>
        <div class="node-wrap" v-if="nodeConfig.type!=4">
            <div class="node-wrap-box" :class="(nodeConfig.type==0?'start-node ':'')+(isTried&&nodeConfig.error?'active error':'')">
                <div>
                    <div class="title" :style="'background: rgb('+ ['87, 106, 149','255, 148, 62','50, 150, 250'][nodeConfig.type] +');'">
                        <span class="iconfont" v-show="nodeConfig.type==1"></span>
                        <span class="iconfont" v-show="nodeConfig.type==2"></span>
                        <span v-if="nodeConfig.type==0">{{nodeConfig.nodeName}}</span>
                        <input type="text" class="ant-input editable-title-input" v-if="nodeConfig.type!=0&&isInput"
                        @blur="blurEvent()" @focus="$event.currentTarget.select()" v-focus
                        v-model="nodeConfig.nodeName" :placeholder="placeholderList[nodeConfig.type]">
                        <span class="editable-title" @click="clickEvent()" v-if="nodeConfig.type!=0&&!isInput">{{nodeConfig.nodeName}}</span>
                        <i class="anticon anticon-close close" v-if="nodeConfig.type!=0" @click="delNode()"></i>
                    </div>
                    <div class="content" @click="setPerson">
                        <div class="text" v-if="nodeConfig.type==0">{{arrToStr(flowPermission)?arrToStr(flowPermission):'所有人'}}</div>
                        <div class="text" v-if="nodeConfig.type==1">
                            <span class="placeholder" v-if="!setApproverStr(nodeConfig)">请选择{{placeholderList[nodeConfig.type]}}</span>
                            {{setApproverStr(nodeConfig)}}
                        </div>
                        <div class="text" v-if="nodeConfig.type==2">
                            <span class="placeholder" v-if="!copyerStr(nodeConfig)">请选择{{placeholderList[nodeConfig.type]}}</span>
                            {{copyerStr(nodeConfig)}}
                        </div>
                        <i class="anticon anticon-right arrow"></i>
                    </div>
                    <div class="error_tip" v-if="isTried&&nodeConfig.error">
                        <i class="anticon anticon-exclamation-circle" style="color: rgb(242, 86, 67);"></i>
                    </div>
                </div>
            </div>
            <addNode :childNodeP.sync="nodeConfig.childNode"></addNode>
        </div>
        <div class="branch-wrap" v-if="nodeConfig.type==4">
            <div class="branch-box-wrap">
                <div class="branch-box">
                    <button class="add-branch" @click="addTerm">添加条件</button>
                    <div class="col-box" v-for="(item,index) in nodeConfig.conditionNodes" :key="index">
                        <div class="condition-node">
                            <div class="condition-node-box">
                                <div class="auto-judge" :class="isTried&&item.error?'error active':''">
                                    <div class="sort-left" v-if="index!=0" @click="arrTransfer(index,-1)">&lt;</div>
                                    <div class="title-wrapper">
                                        <input type="text" class="ant-input editable-title-input" v-if="isInputList[index]"
                                        @blur="blurEvent(index)" @focus="$event.currentTarget.select()" v-focus v-model="item.nodeName">
                                        <span class="editable-title" @click="clickEvent(index)" v-if="!isInputList[index]">{{item.nodeName}}</span>
                                        <span class="priority-title" @click="setPerson(item.priorityLevel)">优先级{{item.priorityLevel}}</span>
                                        <i class="anticon anticon-close close" @click="delTerm(index)"></i>
                                    </div>
                                    <div class="sort-right" v-if="index!=nodeConfig.conditionNodes.length-1"
                                        @click="arrTransfer(index)">&gt;</div>
                                    <div class="content" @click="setPerson(item.priorityLevel)">{{conditionStr(item,index)}}</div>
                                    <div class="error_tip" v-if="isTried&&item.error">
                                        <i class="anticon anticon-exclamation-circle" style="color: rgb(242, 86, 67);"></i>
                                    </div>
                                </div>
                                <addNode :childNodeP.sync="item.childNode"></addNode>
                            </div>
                        </div>
                        <nodeWrap v-if="item.childNode && item.childNode" :nodeConfig.sync="item.childNode" :tableId="tableId"
                        :isTried.sync="isTried" :directorMaxLevel="directorMaxLevel"></nodeWrap>
                        <div class="top-left-cover-line" v-if="index==0"></div>
                        <div class="bottom-left-cover-line" v-if="index==0"></div>
                        <div class="top-right-cover-line" v-if="index==nodeConfig.conditionNodes.length-1"></div>
                        <div class="bottom-right-cover-line" v-if="index==nodeConfig.conditionNodes.length-1"></div>
                    </div>
                </div>
                <addNode :childNodeP.sync="nodeConfig.childNode"></addNode>
            </div>
        </div>
        <el-drawer title="发起人" :visible.sync="promoterDrawer" direction="rtl" class="set_promoter" size="550px" :before-close="savePromoter"> 
            <div class="demo-drawer__content">
                <div class="promoter_content drawer_content">
                    <p>{{arrToStr(flowPermission1)?arrToStr(flowPermission1):'所有人'}}</p>
                    <el-button type="primary" @click="addPromoter">添加/修改发起人</el-button>
                </div>
                <div class="demo-drawer__footer clear">
                    <el-button type="primary" @click="savePromoter">确 定</el-button>
                    <el-button @click="promoterDrawer = false">取 消</el-button>
                </div>
                <el-dialog title="选择成员" :visible.sync="promoterVisible" width="600px" append-to-body class="promoter_person">
                    <div class="person_body clear">
                        <div class="person_tree l">
                            <input type="text" placeholder="搜索成员" v-model="promoterSearchName" @input="getDebounceData($event)">
                            <p class="ellipsis tree_nav" v-if="!promoterSearchName">
                                <span @click="getDepartmentList(0)" class="ellipsis">天下</span>
                                <span v-for="(item,index) in departments.titleDepartments" class="ellipsis" 
                                :key="index+'a'" @click="getDepartmentList(item.id)">{{item.departmentName}}</span>   
                            </p>
                            <ul>
                                <li v-for="(item,index) in departments.childDepartments" :key="index+'b'" class="check_box">
                                    <a :class="toggleClass(checkedDepartmentList,item)&&'active'" @click="toChecked(checkedDepartmentList,item)">
                                        <img src="@/assets/images/icon_file.png">{{item.departmentName}}</a>
                                    <i @click="getDepartmentList(item.id)">下级</i>
                                </li>
                                <li v-for="(item,index) in departments.employees" :key="index+'c'" class="check_box">
                                    <a :class="toggleClass(checkedEmployessList,item)&&'active'" @click="toChecked(checkedEmployessList,item)" :title="item.departmentNames">
                                        <img src="@/assets/images/icon_people.png">{{item.employeeName}}</a>
                                </li>
                            </ul>
                        </div>
                        <div class="has_selected l">
                            <p class="clear">已选（{{checkedDepartmentList.length+checkedEmployessList.length}}）
                                <a @click="checkedDepartmentList=[];checkedEmployessList=[]">清空</a>
                            </p>
                            <ul>
                                <li v-for="(item,index) in checkedDepartmentList" :key="index+'d'">
                                    <img src="@/assets/images/icon_file.png">
                                    <span>{{item.departmentName}}</span>
                                    <img src="@/assets/images/cancel.png" @click="removeEle(checkedDepartmentList,item)">
                                </li>
                                <li v-for="(item,index) in checkedEmployessList" :key="index+'e'">
                                    <img src="@/assets/images/icon_people.png">
                                    <span>{{item.employeeName}}</span>
                                    <img src="@/assets/images/cancel.png" @click="removeEle(checkedEmployessList,item)">
                                </li>
                            </ul>
                        </div>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="promoterVisible = false">取 消</el-button>
                        <el-button type="primary" @click="surePromoter">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
        </el-drawer>
        <el-drawer title="审批人设置" :visible.sync="approverDrawer" direction="rtl" class="set_promoter" size="550px" :before-close="saveApprover"> 
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
                                <img src="@/assets/images/add-close1.png" @click="removeEle(approverConfig.nodeUserList,item,'targetId')">
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
                                <img src="@/assets/images/add-close1.png" @click="removeEle(approverConfig.nodeUserList,item,'targetId')">
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
                    <el-button @click="approverDrawer = false">取 消</el-button>
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
                                    <a :class="toggleClass(approverEmplyessList,item)&&'active'" @click="toChecked(approverEmplyessList,item)" :title="item.departmentNames">
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
                                    <img src="@/assets/images/cancel.png" @click="removeEle(approverEmplyessList,item)">
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
                                    :class="toggleClass(roleList,item,'roleId')&&'active'" @click="roleList=[item]">
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
                                    <img src="@/assets/images/cancel.png" @click="removeEle(roleList,item,'roleId')">
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
        <el-drawer title="抄送人设置" :visible.sync="copyerDrawer" direction="rtl" class="set_copyer" size="550px" :before-close="saveCopyer"> 
            <div class="demo-drawer__content">
                <div class="copyer_content drawer_content">
                    <el-button type="primary" @click="addCopyer">添加成员</el-button>
                    <p class="selected_list">
                        <span v-for="(item,index) in copyerConfig.nodeUserList" :key="index">{{item.name}}
                            <img src="@/assets/images/add-close1.png" @click="removeEle(copyerConfig.nodeUserList,item,'targetId')">
                        </span>
                        <a v-if="copyerConfig.nodeUserList&&copyerConfig.nodeUserList.length!=0" @click="copyerConfig.nodeUserList=[]">清除</a>
                    </p>
                    <el-checkbox-group v-model="ccSelfSelectFlag" class="clear">
                        <el-checkbox :label="1">允许发起人自选抄送人</el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="demo-drawer__footer clear">
                    <el-button type="primary" @click="saveCopyer">确 定</el-button>
                    <el-button @click="copyerDrawer = false">取 消</el-button>
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
                                    <a :class="toggleClass(copyerEmployessList,item)&&'active'" @click="toChecked(copyerEmployessList,item)" :title="item.departmentNames">
                                        <img src="@/assets/images/icon_people.png">{{item.employeeName}}</a>
                                </li>
                            </ul>
                            <ul style="height: 360px;" v-if="activeName==2">
                                <li v-for="(item,index) in roles" :key="index+'c'" class="check_box">
                                    <a :class="toggleClass(copyerRoleList,item,'roleId')&&'active'" @click="toChecked(copyerRoleList,item,'roleId')" :title="item.description">
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
                                    <img src="@/assets/images/cancel.png" @click="removeEle(copyerRoleList,item,'roleId')">
                                </li>
                                <li v-for="(item,index) in copyerEmployessList" :key="index+'e1'">
                                    <img src="@/assets/images/icon_people.png">
                                    <span>{{item.employeeName}}</span>
                                    <img src="@/assets/images/cancel.png" @click="removeEle(copyerEmployessList,item)">
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
        <el-drawer title="条件设置" :visible.sync="conditionDrawer" direction="rtl" class="condition_copyer" size="550px" :before-close="saveCondition"> 
            <select v-model="conditionConfig.priorityLevel">
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
                                        {{item1.name}}<img src="@/assets/images/add-close1.png" @click="removeEle(conditionConfig.nodeUserList,item1,'targetId')">
                                    </span>
                                    <input type="text" placeholder="请选择具体人员/角色/部门" v-if="conditionConfig.nodeUserList.length == 0" @click="addConditionRole">
                                </p>
                            </div>
                            <div v-else-if="item.columnType == 'String' && item.showType == 3">
                                <p class="check_box">
                                    <a :class="toggleStrClass(item,item1.key)&&'active'" @click="toStrChecked(item,item1.key)"
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
                            <a v-if="item.type==1" @click="conditionConfig.nodeUserList= [];removeEle(conditionConfig.conditionList,item,'columnId')">删除</a>
                            <a v-if="item.type==2" @click="removeEle(conditionConfig.conditionList,item,'columnId')">删除</a>
                        </li>
                    </ul>
                    <el-button type="primary" @click="addCondition">添加条件</el-button>
                    <el-dialog title="选择条件" :visible.sync="conditionVisible" width="480px" append-to-body class="condition_list">
                        <p>请选择用来区分审批流程的条件字段</p>
                        <p class="check_box">
                            <a :class="toggleClass(conditionList,{columnId:0},'columnId')&&'active'" @click="toChecked(conditionList,{columnId:0},'columnId')">发起人</a>
                            <a v-for="(item,index) in conditions" :key="index" :class="toggleClass(conditionList,item,'columnId')&&'active'" 
                            @click="toChecked(conditionList,item,'columnId')">{{item.showName}}</a>
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
                                    <a :class="toggleClass(conditionDepartmentList,item)&&'active'" @click="toChecked(conditionDepartmentList,item)">
                                        <img src="@/assets/images/icon_file.png">{{item.departmentName}}</a>
                                    <i @click="getDepartmentList(item.id)">下级</i>
                                </li>
                                <li v-for="(item,index) in departments.employees" :key="index+'c'" class="check_box">
                                    <a :class="toggleClass(conditionEmployessList,item)&&'active'" @click="toChecked(conditionEmployessList,item)" :title="item.departmentNames">
                                        <img src="@/assets/images/icon_people.png">{{item.employeeName}}</a>
                                </li>
                            </ul>
                            <ul style="height: 360px;" v-if="activeName==2">
                                <li v-for="(item,index) in roles" :key="index+'c'" class="check_box">
                                    <a :class="toggleClass(conditionRoleList,item,'roleId')&&'active'" @click="toChecked(conditionRoleList,item,'roleId')" :title="item.description">
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
                                    <img src="@/assets/images/cancel.png" @click="removeEle(conditionRoleList,item,'roleId')">
                                </li>
                                <li v-for="(item,index) in conditionDepartmentList" :key="index+'e1'">
                                    <img src="@/assets/images/icon_file.png">
                                    <span>{{item.departmentName}}</span>
                                    <img src="@/assets/images/cancel.png" @click="removeEle(conditionDepartmentList,item)">
                                </li>
                                <li v-for="(item,index) in conditionEmployessList" :key="index+'e2'">
                                    <img src="@/assets/images/icon_people.png">
                                    <span>{{item.employeeName}}</span>
                                    <img src="@/assets/images/cancel.png" @click="removeEle(conditionEmployessList,item)">
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
                    <el-button @click="conditionDrawer = false">取 消</el-button>
                </div>
            </div>
        </el-drawer>
        <nodeWrap v-if="nodeConfig.childNode && nodeConfig.childNode" :nodeConfig.sync="nodeConfig.childNode" :tableId="tableId"
        :isTried.sync="isTried" :directorMaxLevel="directorMaxLevel"></nodeWrap>
    </div>
</template>
<script>
export default {
    props: ["nodeConfig", "flowPermission", "directorMaxLevel", "isTried", "tableId"],
    data() {
        return {
            placeholderList: ["发起人", "审核人", "抄送人"],
            isInputList: [],
            isInput: false,
            promoterVisible: false,
            promoterDrawer: false,
            departments: {},
            checkedDepartmentList: [],
            checkedEmployessList: [],
            promoterSearchName: "",
            flowPermission1: this.flowPermission,
            approverDrawer: false,
            approverVisible: false,
            approverRoleVisible: false,
            approverConfig: {},
            approverEmplyessList: [],
            approverSearchName: "",
            roles: [],
            roleList: [],
            approverRoleSearchName: "",
            copyerDrawer: false,
            copyerVisible: false,
            copyerConfig: {},
            copyerSearchName: "",
            activeName: "1",
            copyerEmployessList: [],
            copyerRoleList: [],
            ccSelfSelectFlag: [],
            conditionDrawer: false,
            conditionVisible: false,
            conditionConfig: {},
            conditionsConfig: {
                conditionNodes: [],
            },
            bPriorityLevel: "",
            conditions: [],
            conditionList: [],
            conditionRoleVisible: false,
            conditionRoleSearchName: "",
            conditionDepartmentList: [],
            conditionEmployessList: [],
            conditionRoleList: [],
        }
    },
    mounted() {
        if (this.nodeConfig.type == 1) {
            this.nodeConfig.error = !this.setApproverStr(this.nodeConfig)
        } else if (this.nodeConfig.type == 2) {
            this.nodeConfig.error = !this.copyerStr(this.nodeConfig)
        } else if (this.nodeConfig.type == 4) {
            for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
                this.nodeConfig.conditionNodes[i].error = this.conditionStr(this.nodeConfig.conditionNodes[i], i) == "请设置条件" && i != this.nodeConfig.conditionNodes.length - 1
            }
        }
    },
    methods: {
        clickEvent(index) {
            if (index || index === 0) {
                this.$set(this.isInputList, index, true)
            } else {
                this.isInput = true;
            }
        },
        blurEvent(index) {
            if (index || index === 0) {
                this.$set(this.isInputList, index, false)
                this.nodeConfig.conditionNodes[index].nodeName = this.nodeConfig.conditionNodes[index].nodeName ? this.nodeConfig.conditionNodes[index].nodeName : "条件"
            } else {
                this.isInput = false;
                this.nodeConfig.nodeName = this.nodeConfig.nodeName ? this.nodeConfig.nodeName : this.placeholderList[this.nodeConfig.type]
            }
        },
        conditionStr(item, index) {
            var { conditionList, nodeUserList } = item;
            if (conditionList.length == 0) {
                return (index == this.nodeConfig.conditionNodes.length - 1) && this.nodeConfig.conditionNodes[0].conditionList.length != 0 ? '其他条件进入此流程' : '请设置条件'
            } else {
                let str = ""
                for (var i = 0; i < conditionList.length; i++) {
                    var { columnId, columnType, showType, showName, optType, zdy1, opt1, zdy2, opt2, fixedDownBoxValue } = conditionList[i];
                    if (columnId == 0) {
                        if (nodeUserList.length != 0) {
                            str += '发起人属于：'
                            str += nodeUserList.map(item => { return item.name }).join("或") + " 并且 "
                        }
                    }
                    if (columnType == "String" && showType == "3") {
                        if (zdy1) {
                            str += showName + '属于：' + this.dealStr(zdy1, JSON.parse(fixedDownBoxValue)) + " 并且 "
                        }
                    }
                    if (columnType == "Double") {
                        if (optType != 6 && zdy1) {
                            var optTypeStr = ["", "<", ">", "≤", "=", "≥"][optType]
                            str += `${showName} ${optTypeStr} ${zdy1} 并且 `
                        } else if (optType == 6 && zdy1 && zdy2) {
                            str += `${zdy1} ${opt1} ${showName} ${opt2} ${zdy2} 并且 `
                        }
                    }
                }
                return str ? str.substring(0, str.length - 4) : '请设置条件'
            }
        },
        dealStr(str, obj) {
            let arr = [];
            let list = str.split(",");
            for (var elem in obj) {
                list.map(item => {
                    if (item == elem) {
                        arr.push(obj[elem].value)
                    }
                })
            }
            return arr.join("或")
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
        addCondition() {
            this.conditionList = [];
            this.conditionVisible = true;
            this.$axios.get("/conditions.json?tableId=" + this.tableId).then(res => {
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
        changeOptType(item) {
            if (item.optType == 1) {
                item.zdy1 = 2;
            } else {
                item.zdy1 = 1;
                item.zdy2 = 2;
            }
        },
        sureCondition() {
            //1.弹窗有，外面无+
            //2.弹窗有，外面有不变
            for (var i = 0; i < this.conditionList.length; i++) {
                var { columnId, showName, columnName, showType, columnName, columnType, fixedDownBoxValue } = this.conditionList[i];
                if (this.toggleClass(this.conditionConfig.conditionList, this.conditionList[i], "columnId")) {
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
            for (var i = this.conditionConfig.conditionList.length - 1; i >= 0; i--) {
                if (!this.toggleClass(this.conditionList, this.conditionConfig.conditionList[i], "columnId")) {
                    this.conditionConfig.conditionList.splice(i, 1);
                }
            }
            this.conditionConfig.conditionList.sort(function (a, b) { return a.columnId - b.columnId; });
            this.conditionVisible = false;
        },
        saveCondition() {
            this.conditionDrawer = false;
            var a = this.conditionsConfig.conditionNodes.splice(this.bPriorityLevel - 1, 1)//截取旧下标
            this.conditionsConfig.conditionNodes.splice(this.conditionConfig.priorityLevel - 1, 0, a[0])//填充新下标
            this.conditionsConfig.conditionNodes.map((item, index) => {
                item.priorityLevel = index + 1
            });
            for (var i = 0; i < this.conditionsConfig.conditionNodes.length; i++) {
                this.conditionsConfig.conditionNodes[i].error = this.conditionStr(this.conditionsConfig.conditionNodes[i], i) == "请设置条件" && i != this.conditionsConfig.conditionNodes.length - 1
            }
            this.$emit("update:nodeConfig", this.conditionsConfig);
        },
        getDebounceData(event, type = 1) {
            this.$func.debounce(function () {
                if (event.target.value) {
                    if (type == 1) {
                        this.departments.childDepartments = [];
                        this.$axios.get(`/employees.json?searchName=${event.target.value}&pageNum=1&pageSize=30`).then(res => {
                            this.departments.employees = res.data.list
                        })
                    } else {
                        this.$axios.get(`/roles.json?searchName=${event.target.value}&pageNum=1&pageSize=30`).then(res => {
                            this.roles = res.data.list
                        })
                    }
                } else {
                    type == 1 ? this.getDepartmentList() : this.getRoleList();
                }
            }.bind(this))()
        },
        handleClick() {
            this.copyerSearchName = "";
            this.conditionRoleSearchName = "";
            if (this.activeName == 1) {
                this.getDepartmentList();
            } else {
                this.getRoleList();
            }
        },
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
            this.copyerConfig.error = !this.copyerStr(this.copyerConfig);
            this.$emit("update:nodeConfig", this.copyerConfig);
            this.copyerDrawer = false;
        },
        copyerStr(nodeConfig) {
            if (nodeConfig.nodeUserList.length != 0) {
                return this.arrToStr(nodeConfig.nodeUserList)
            } else {
                if (nodeConfig.ccSelfSelectFlag == 1) {
                    return "发起人自选"
                }
            }
        },
        changeRange(val) {
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
        setApproverStr(nodeConfig) {
            if (nodeConfig.settype == 1) {
                if (nodeConfig.nodeUserList.length == 1) {
                    return nodeConfig.nodeUserList[0].name
                } else if (nodeConfig.nodeUserList.length > 1) {
                    if (nodeConfig.examineMode == 1) {
                        return this.arrToStr(nodeConfig.nodeUserList)
                    } else if (nodeConfig.examineMode == 2) {
                        return nodeConfig.nodeUserList.length + "人会签"
                    }
                }
            } else if (nodeConfig.settype == 2) {
                let level = nodeConfig.directorLevel == 1 ? '直接主管' : '第' + nodeConfig.directorLevel + '级主管'
                if (nodeConfig.examineMode == 1) {
                    return level
                } else if (nodeConfig.examineMode == 2) {
                    return level + "会签"
                }
            } else if (nodeConfig.settype == 4) {
                if (nodeConfig.selectRange == 1) {
                    return "发起人自选"
                } else {
                    if (nodeConfig.nodeUserList.length > 0) {
                        if (nodeConfig.selectRange == 2) {
                            return "发起人自选"
                        } else {
                            return '发起人从' + nodeConfig.nodeUserList[0].name + '中自选'
                        }
                    } else {
                        return "";
                    }
                }
            } else if (nodeConfig.settype == 5) {
                return "发起人自己"
            } else if (nodeConfig.settype == 7) {
                return '从直接主管到通讯录中级别最高的第' + nodeConfig.examineEndDirectorLevel + '个层级主管'
            }
        },
        saveApprover() {
            this.approverConfig.error = !this.setApproverStr(this.approverConfig)
            this.$emit("update:nodeConfig", this.approverConfig);
            this.approverDrawer = false;
        },
        addPromoter() {
            this.promoterVisible = true;
            this.getDepartmentList();
            this.promoterSearchName = "";
            this.checkedEmployessList = [];
            this.checkedDepartmentList = [];
            for (var i = 0; i < this.flowPermission1.length; i++) {
                var { type, name, targetId } = this.flowPermission1[i];
                if (type == 1) {
                    this.checkedEmployessList.push({
                        employeeName: name,
                        id: targetId
                    });
                } else if (type == 3) {
                    this.checkedDepartmentList.push({
                        departmentName: name,
                        id: targetId
                    });
                }
            }
        },
        surePromoter() {
            this.flowPermission1 = [];
            this.checkedDepartmentList.map(item => {
                this.flowPermission1.push({
                    type: 3,
                    targetId: item.id,
                    name: item.departmentName
                })
            });
            this.checkedEmployessList.map(item => {
                this.flowPermission1.push({
                    type: 1,
                    targetId: item.id,
                    name: item.employeeName
                })
            });
            this.promoterVisible = false;
        },
        savePromoter() {
            this.$emit("update:flowPermission", this.flowPermission1);
            this.promoterDrawer = false;
        },
        arrToStr(arr) {
            if (arr) {
                return arr.map(item => { return item.name }).toString()
            }
        },
        toggleStrClass(item, key) {
            let a = item.zdy1 ? item.zdy1.split(",") : []
            return a.some(item => { return item == key });
        },
        toStrChecked(item, key) {
            let a = item.zdy1 ? item.zdy1.split(",") : []
            var isIncludes = this.toggleStrClass(item, key);
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
        toggleClass(arr, elem, key = 'id') {
            return arr.some(item => { return item[key] == elem[key] });
        },
        toChecked(arr, elem, key = 'id') {
            var isIncludes = this.toggleClass(arr, elem, key);
            !isIncludes ? arr.push(elem) : this.removeEle(arr, elem, key);
        },
        removeEle(arr, elem, key = 'id') {
            var includesIndex;
            arr.map((item, index) => {
                if (item[key] == elem[key]) {
                    includesIndex = index
                }
            });
            arr.splice(includesIndex, 1);
        },
        getRoleList() {
            this.$axios.get("/roles.json").then(res => {
                this.roles = res.data.list;
            })
        },
        getDepartmentList(parentId = 0) {
            this.$axios.get("/departments.json?parentId=" + parentId).then(res => {
                this.departments = res.data;
            })
        },
        delNode() {
            this.$emit("update:nodeConfig", this.nodeConfig.childNode);
        },
        addTerm() {
            let len = this.nodeConfig.conditionNodes.length + 1
            this.nodeConfig.conditionNodes.push({
                "nodeName": "条件" + len,
                "type": 3,
                "priorityLevel": len,
                "conditionList": [],
                "nodeUserList": [],
                "childNode": null
            });
            for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
                this.nodeConfig.conditionNodes[i].error = this.conditionStr(this.nodeConfig.conditionNodes[i], i) == "请设置条件" && i != this.nodeConfig.conditionNodes.length - 1
            }
            this.$emit("update:nodeConfig", this.nodeConfig);
        },
        delTerm(index) {
            this.nodeConfig.conditionNodes.splice(index, 1)
            for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
                this.nodeConfig.conditionNodes[i].error = this.conditionStr(this.nodeConfig.conditionNodes[i], i) == "请设置条件" && i != this.nodeConfig.conditionNodes.length - 1
            }
            this.$emit("update:nodeConfig", this.nodeConfig);
            if (this.nodeConfig.conditionNodes.length == 1) {
                if (this.nodeConfig.childNode) {
                    if (this.nodeConfig.conditionNodes[0].childNode) {
                        this.reData(this.nodeConfig.conditionNodes[0].childNode, this.nodeConfig.childNode)
                    } else {
                        this.nodeConfig.conditionNodes[0].childNode = this.nodeConfig.childNode
                    }
                }
                this.$emit("update:nodeConfig", this.nodeConfig.conditionNodes[0].childNode);
            }
        },
        reData(data, addData) {
            if (!data.childNode) {
                data.childNode = addData
            } else {
                this.reData(data.childNode, addData)
            }
        },
        setPerson(priorityLevel) {
            var { type } = this.nodeConfig;
            if (type == 0) {
                this.promoterDrawer = true;
                this.flowPermission1 = this.flowPermission;
            } else if (type == 1) {
                this.approverDrawer = true;
                this.approverConfig = JSON.parse(JSON.stringify(this.nodeConfig))
                this.approverConfig.settype = this.approverConfig.settype ? this.approverConfig.settype : 1
            } else if (type == 2) {
                this.copyerDrawer = true;
                this.copyerConfig = JSON.parse(JSON.stringify(this.nodeConfig))
                this.ccSelfSelectFlag = this.copyerConfig.ccSelfSelectFlag == 0 ? [] : [this.copyerConfig.ccSelfSelectFlag]
            } else {
                this.conditionDrawer = true
                this.bPriorityLevel = priorityLevel;
                this.conditionsConfig = JSON.parse(JSON.stringify(this.nodeConfig))
                this.conditionConfig = this.conditionsConfig.conditionNodes[priorityLevel - 1]
            }
        },
        arrTransfer(index, type = 1) {//向左-1,向右1
            this.nodeConfig.conditionNodes[index] = this.nodeConfig.conditionNodes.splice(index + type, 1, this.nodeConfig.conditionNodes[index])[0];
            this.nodeConfig.conditionNodes.map((item, index) => {
                item.priorityLevel = index + 1
            })
            for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
                this.nodeConfig.conditionNodes[i].error = this.conditionStr(this.nodeConfig.conditionNodes[i], i) == "请设置条件" && i != this.nodeConfig.conditionNodes.length - 1
            }
            this.$emit("update:nodeConfig", this.nodeConfig);
        }
    }
}
</script>
<style>
.error_tip {
    position: absolute;
    top: 0px;
    right: 0px;
    transform: translate(150%, 0px);
    font-size: 24px;
}
.add-node-popover-body {
    display: flex;
}
.promoter_content {
    padding: 0 20px;
}
.condition_content .el-button,
.copyer_content .el-button,
.approver_self_select .el-button,
.promoter_content .el-button,
.approver_content .el-button {
    margin-bottom: 20px;
}
.promoter_content p {
    padding: 18px 0;
    font-size: 14px;
    line-height: 20px;
    color: #000000;
}
.promoter_person .el-dialog__body {
    padding: 10px 20px 14px 20px;
}
.person_body {
    border: 1px solid #f5f5f5;
    height: 500px;
}
.person_tree {
    padding: 10px 12px 0 8px;
    width: 280px;
    height: 100%;
    border-right: 1px solid #f5f5f5;
}
.person_tree input {
    padding-left: 22px;
    width: 210px;
    height: 30px;
    font-size: 12px;
    border-radius: 2px;
    border: 1px solid #d5dadf;
    background: url(~@/assets/images/list_search.png) no-repeat 10px center;
    background-size: 14px 14px;
    margin-bottom: 14px;
}
.tree_nav span {
    display: inline-block;
    padding-right: 10px;
    margin-right: 5px;
    max-width: 6em;
    color: #38adff;
    font-size: 12px;
    cursor: pointer;
    background: url(~@/assets/images/jiaojiao.png) no-repeat right center;
}
.tree_nav span:last-of-type {
    background: none;
}
.person_tree ul,
.has_selected ul {
    height: 420px;
    overflow-y: auto;
}
.person_tree li {
    padding: 5px 0;
}
.person_tree li i {
    float: right;
    padding-left: 24px;
    padding-right: 10px;
    color: #3195f8;
    font-size: 12px;
    cursor: pointer;
    background: url(~@/assets/images/next_level_active.png) no-repeat 10px
        center;
    border-left: 1px solid rgb(238, 238, 238);
}
.person_tree li a.active + i {
    color: rgb(197, 197, 197);
    background-image: url(~@/assets/images/next_level.png);
    pointer-events: none;
}
.person_tree img {
    width: 14px;
    vertical-align: middle;
    margin-right: 5px;
}
.has_selected {
    width: 276px;
    height: 100%;
    font-size: 12px;
}
.has_selected ul {
    height: 460px;
}
.has_selected p {
    padding-left: 19px;
    padding-right: 20px;
    line-height: 37px;
    border-bottom: 1px solid #f2f2f2;
}
.has_selected p a {
    float: right;
}
.has_selected ul li {
    margin: 11px 26px 13px 19px;
    line-height: 17px;
}
.has_selected li span {
    vertical-align: middle;
}
.has_selected li img:first-of-type {
    width: 14px;
    vertical-align: middle;
    margin-right: 5px;
}
.has_selected li img:last-of-type {
    float: right;
    margin-top: 2px;
    width: 14px;
}
el-radio-group {
    padding: 20px 0;
}
.approver_content {
    padding-bottom: 10px;
    border-bottom: 1px solid #f2f2f2;
}
.approver_content .el-radio,
.approver_some .el-radio,
.approver_self_select .el-radio {
    width: 27%;
    margin-bottom: 20px;
}
.copyer_content .el-checkbox {
    margin-bottom: 20px;
}
.el-checkbox__label {
    font-size: 12px;
}
.condition_content,
.copyer_content,
.approver_self_select,
.approver_manager,
.approver_content,
.approver_some {
    padding: 20px 20px 0;
}
.approver_manager p:first-of-type,
.approver_some p {
    line-height: 19px;
    font-size: 14px;
    margin-bottom: 14px;
}

.approver_manager p {
    line-height: 32px;
}
.approver_manager select {
    width: 420px;
    height: 32px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
}
.approver_manager p.tip {
    margin: 10px 0 22px 0;
    font-size: 12px;
    line-height: 16px;
    color: #f8642d;
}
.approver_self {
    padding: 28px 20px;
}
.selected_list {
    margin-bottom: 20px;
    line-height: 30px;
}
.selected_list span {
    margin-right: 10px;
    padding: 3px 6px 3px 9px;
    line-height: 12px;
    white-space: nowrap;
    border-radius: 2px;
    border: 1px solid rgba(220, 220, 220, 1);
}
.selected_list img {
    margin-left: 5px;
    width: 7px;
    height: 7px;
    cursor: pointer;
}
.approver_self_select h3 {
    margin: 5px 0 20px;
    font-size: 14px;
    font-weight: bold;
    line-height: 19px;
}
.condition_copyer .el-drawer__body select {
    position: absolute;
    top: 11px;
    right: 30px;
    width: 100px;
    height: 32px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
}
.condition_content p.tip {
    margin: 20px 0;
    width: 510px;
    text-indent: 17px;
    line-height: 45px;
    background: rgba(241, 249, 255, 1);
    border: 1px solid rgba(64, 163, 247, 1);
    color: #46a6fe;
    font-size: 14px;
}
.condition_content ul {
    max-height: 500px;
    overflow-y: scroll;
    margin-bottom: 20px;
}
.condition_content li > span {
    float: left;
    margin-right: 8px;
    width: 70px;
    line-height: 32px;
    text-align: right;
}
.condition_content li > div {
    display: inline-block;
    width: 370px;
}
.condition_content li:not(:last-child) > div > p {
    margin-bottom: 20px;
}
.condition_content li > div > p:not(:last-child) {
    margin-bottom: 10px;
}
.condition_content li > a {
    float: right;
    margin-right: 10px;
    margin-top: 7px;
}
.condition_content li select,
.condition_content li input {
    width: 100%;
    height: 32px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
}
.condition_content li select + input {
    width: 260px;
}
.condition_content li select {
    margin-right: 10px;
    width: 100px;
}
.condition_content li p.selected_list {
    padding-left: 10px;
    border-radius: 4px;
    min-height: 32px;
    border: 1px solid rgba(217, 217, 217, 1);
}
.condition_content li p.check_box {
    line-height: 32px;
}
.condition_list .el-dialog__body {
    padding: 16px 26px;
}
.condition_list p {
    color: #666666;
    margin-bottom: 10px;
}
.condition_list p.check_box {
    margin-bottom: 0;
    line-height: 36px;
}
</style>