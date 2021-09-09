<template>
    <el-drawer :append-to-body="true" title="发起人" :visible.sync="$store.state.promoterDrawer" direction="rtl" class="set_promoter" size="550px" :before-close="savePromoter"> 
        <div class="demo-drawer__content">
            <div class="promoter_content drawer_content">
                <p>{{$func.arrToStr(flowPermission)?$func.arrToStr(flowPermission):'所有人'}}</p>
                <el-button type="primary" @click="addPromoter">添加/修改发起人</el-button>
            </div>
            <div class="demo-drawer__footer clear">
                <el-button type="primary" @click="savePromoter">确 定</el-button>
                <el-button @click="closeDrawer">取 消</el-button>
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
                                <a :class="$func.toggleClass(checkedDepartmentList,item)&&'active'" @click="$func.toChecked(checkedDepartmentList,item)">
                                    <img src="@/assets/images/icon_file.png">{{item.departmentName}}</a>
                                <i @click="getDepartmentList(item.id)">下级</i>
                            </li>
                            <li v-for="(item,index) in departments.employees" :key="index+'c'" class="check_box">
                                <a :class="$func.toggleClass(checkedEmployessList,item)&&'active'" @click="$func.toChecked(checkedEmployessList,item)" :title="item.departmentNames">
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
                                <img src="@/assets/images/cancel.png" @click="$func.removeEle(checkedDepartmentList,item)">
                            </li>
                            <li v-for="(item,index) in checkedEmployessList" :key="index+'e'">
                                <img src="@/assets/images/icon_people.png">
                                <span>{{item.employeeName}}</span>
                                <img src="@/assets/images/cancel.png" @click="$func.removeEle(checkedEmployessList,item)">
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
</template>
<script>
import mixins from './mixins'
export default {
    mixins: [ mixins],
    data(){
        return {
            flowPermission: [],
            promoterVisible: false,
            promoterSearchName: "",
            checkedDepartmentList: [],
            checkedEmployessList: [],
        }
    },
    computed:{
        flowPermission1(){
            return this.$store.state.flowPermission.value
        }
    },
    watch:{
        flowPermission1(val){
            this.flowPermission = val
        }
    },
    methods:{
        addPromoter() {
            this.promoterVisible = true;
            this.getDepartmentList();
            this.promoterSearchName = "";
            this.checkedEmployessList = [];
            this.checkedDepartmentList = [];
            for (var i = 0; i < this.flowPermission.length; i++) {
                var { type, name, targetId } = this.flowPermission[i];
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
            this.flowPermission = [];
            this.checkedDepartmentList.map(item => {
                this.flowPermission.push({
                    type: 3,
                    targetId: item.id,
                    name: item.departmentName
                })
            });
            this.checkedEmployessList.map(item => {
                this.flowPermission.push({
                    type: 1,
                    targetId: item.id,
                    name: item.employeeName
                })
            });
            this.promoterVisible = false;
        },
        savePromoter() {
            this.$store.commit('updateFlowPermission',{
                value:this.flowPermission,
                flag:true,
                id:this.$store.state.flowPermission.id
            })
            this.closeDrawer()
        },
        closeDrawer(){
            this.$store.commit('updatePromoter',false)
        }
    }
}
</script>
<style lang="less">
.set_promoter{
    .promoter_content {
        padding: 0 20px;
        .el-button{
            margin-bottom: 20px;
        }
        p {
            padding: 18px 0;
            font-size: 14px;
            line-height: 20px;
            color: #000000;
        }
    }
}
</style>