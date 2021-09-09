<template>
   <el-dialog title="选择成员" :visible.sync="visibleDialog" width="600px" append-to-body class="promoter_person">
      <div class="person_body clear">
          <div class="person_tree l">
              <input type="text" placeholder="搜索成员" v-model="searchVal" @input="getDebounceData($event)">
              <p class="ellipsis tree_nav" v-if="!searchVal">
                  <span @click="getDepartmentList(0)" class="ellipsis">天下</span>
                  <span v-for="(item,index) in departments.titleDepartments" class="ellipsis" 
                  :key="index+'a'" @click="getDepartmentList(item.id)">{{item.departmentName}}</span>   
              </p>
              <ul>
                  <li v-for="(item,index) in departments.childDepartments" :key="index+'b'" class="check_box" :class="{not: !isDepartment}">
                      <a v-if="isDepartment" :class="$func.toggleClass(checkedDepartmentList,item)&&'active'" @click="$func.toChecked(checkedDepartmentList,item)">
                          <img src="@/assets/images/icon_file.png">{{item.departmentName}}</a>
                      <a v-else><img src="@/assets/images/icon_file.png">{{item.departmentName}}</a>
                      <i @click="getDepartmentList(item.id)">下级</i>
                  </li>
                  <li v-for="(item,index) in departments.employees" :key="index+'c'" class="check_box">
                      <a :class="$func.toggleClass(checkedEmployessList,item)&&'active'" @click="$func.toChecked(checkedEmployessList,item)" :title="item.departmentNames">
                          <img src="@/assets/images/icon_people.png">{{item.employeeName}}</a>
                  </li>
              </ul>
          </div>
          <div class="has_selected l">
              <p class="clear">已选（{{total}}）
                  <a @click="delList">清空</a>
              </p>
              <ul>
                  <template v-if="isDepartment">
                    <li v-for="(item,index) in checkedDepartmentList" :key="index+'d'">
                        <img src="@/assets/images/icon_file.png">
                        <span>{{item.departmentName}}</span>
                        <img src="@/assets/images/cancel.png" @click="$func.removeEle(checkedDepartmentList,item)">
                    </li>
                  </template>
                  <li v-for="(item,index) in checkedEmployessList" :key="index+'e'">
                      <img src="@/assets/images/icon_people.png">
                      <span>{{item.employeeName}}</span>
                      <img src="@/assets/images/cancel.png" @click="$func.removeEle(checkedEmployessList,item)">
                  </li>
              </ul>
          </div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="$emit('update:visible',false)">取 消</el-button>
          <el-button type="primary" @click="saveDialog">确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
import mixins from './mixins'
export default {
  mixins: [ mixins],
  props:['visible','data','isDepartment'],
  watch:{
    visible(val){
      this.visibleDialog = this.visible
      if(val){
        this.getDepartmentList();
        this.searchVal = "";
        this.checkedEmployessList = this.data.filter(item=>item.type===1).map(({name,targetId})=>({
          employeeName: name,
          id: targetId
        }));
        this.checkedDepartmentList = this.data.filter(item=>item.type===3).map(({name,targetId})=>({
          departmentName: name,
          id: targetId
        }));
      }
    },
    visibleDialog(val){
      this.$emit('update:visible',val)
    }
  },
  computed:{
    total(){
      return this.checkedDepartmentList.length + this.checkedEmployessList.length
    }
  },
  data(){
    return {
      checkedDepartmentList: [],
      checkedEmployessList: [],
    }
  },
  methods:{
    saveDialog(){
      let checkedList = [...this.checkedDepartmentList,...this.checkedEmployessList].map(item=>({
        type: item.employeeName ? 1: 3,
        targetId: item.id,
        name: item.employeeName || item.departmentName
      }))
      this.$emit('change',checkedList)
    },
    delList(){
      this.checkedDepartmentList=[];
      this.checkedEmployessList=[]
    }
  }
}
</script>

<style>
@import "../../css/dialog.css";
</style>