<template>
   <el-dialog title="选择角色" :visible.sync="visibleDialog" width="600px" append-to-body class="promoter_person">
      <div class="person_body clear">
          <div class="person_tree l">
              <input type="text" placeholder="搜索角色" v-model="searchVal" @input="getDebounceData($event,2)">
              <ul>
                  <li v-for="(item,index) in roles" :key="index+'b'" class="check_box not"
                      :class="$func.toggleClass(checkedRoleList,item,'roleId')&&'active'" @click="checkedRoleList=[item]">
                      <a :title="item.description"><img src="@/assets/images/icon_role.png">{{item.roleName}}</a>
                  </li>
              </ul>
          </div>
          <div class="has_selected l">
              <p class="clear">已选（{{total}}）
                  <a @click="delList">清空</a>
              </p>
              <ul>
                  <li v-for="(item,index) in checkedRoleList" :key="index+'e'">
                      <img src="@/assets/images/icon_role.png">
                      <span>{{item.roleName}}</span>
                      <img src="@/assets/images/cancel.png" @click="$func.removeEle(checkedRoleList,item,'roleId')">
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
  props:['visible','data'],
  watch:{
    visible(val){
      this.visibleDialog = this.visible
      if(val){
        this.getRoleList();
        this.searchVal = "";
        this.checkedRoleList = this.data.map(({name,targetId})=>({
          roleName: name,
          roleId: targetId
        }));
      }
    },
    visibleDialog(val){
      this.$emit('update:visible',val)
    }
  },
  computed:{
    total(){
      return this.checkedRoleList.length
    }
  },
  data(){
    return {
      checkedRoleList: [],
    }
  },
  methods:{
    saveDialog(){
      let checkedList = this.checkedRoleList.map(item=>({
        type: 2,
        targetId: item.roleId,
        name: item.roleName
      }))
      this.$emit('change',checkedList)
    },
    delList(){
      this.checkedRoleList=[];
    }
  }
}
</script>

<style>
@import "../../css/dialog.css";
</style>