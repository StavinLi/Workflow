<template>
  <el-dialog title="选择成员" :visible.sync="visibleDialog" width="600px" append-to-body class="promoter_person">
      <div class="person_body clear">
          <div class="person_tree l">
              <input type="text" placeholder="搜索成员" v-model="searchVal" @input="getDebounceData($event,activeName)">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                  <el-tab-pane label="组织架构" name="1"></el-tab-pane>
                  <el-tab-pane label="角色列表" name="2"></el-tab-pane>
              </el-tabs>
              <p class="ellipsis tree_nav" v-if="activeName==1&&!searchVal">
                  <span @click="getDepartmentList(0)" class="ellipsis">天下</span>
                  <span v-for="(item,index) in departments.titleDepartments" class="ellipsis" 
                  :key="index+'a'" @click="getDepartmentList(item.id)">{{item.departmentName}}</span>   
              </p>
              <selectBox :list="list" style="height: 360px;"/>
          </div>
          <selectResult :total="total" @del="delList" :list="resList"/>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="$emit('update:visible',false)">取 消</el-button>
          <el-button type="primary" @click="saveDialog">确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
import selectBox from '../selectBox.vue';
import selectResult from '../selectResult.vue';
import mixins from './mixins'
export default {
  components: { selectBox, selectResult },
  mixins: [mixins],
  props: ['visible', 'data', 'isDepartment'],
  watch: {
    visible(val) {
      this.visibleDialog = this.visible
      if (val) {
        this.activeName = "1";
        this.getDepartmentList();
        this.searchVal = "";
        this.checkedEmployessList = this.data.filter(item => item.type === 1).map(({ name, targetId }) => ({
          employeeName: name,
          id: targetId
        }));
        this.checkedRoleList = this.data.filter(item => item.type === 2).map(({ name, targetId }) => ({
          roleName: name,
          roleId: targetId
        }));
        this.checkedDepartmentList = this.data.filter(item => item.type === 3).map(({ name, targetId }) => ({
          departmentName: name,
          id: targetId
        }));
      }
    },
    visibleDialog(val) {
      this.$emit('update:visible', val)
    }
  },
  computed: {
    total() {
      return this.checkedEmployessList.length + this.checkedRoleList.length + this.checkedDepartmentList.length
    },
    list() {
      if (this.activeName === '2') {
        return [{
          type: 'role',
          not: false,
          data: this.roles,
          isActiveItem: (item) => this.$func.toggleClass(this.checkedRoleList, item, 'roleId'),
          change: (item) => this.$func.toChecked(this.checkedRoleList, item, 'roleId')
        }]
      } else {
        return [{
          isDepartment: this.isDepartment,
          type: 'department',
          data: this.departments.childDepartments,
          isActive: (item) => this.$func.toggleClass(this.checkedDepartmentList, item),
          change: (item) => this.$func.toChecked(this.checkedDepartmentList, item),
          next: (item) => this.getDepartmentList(item.id)
        }, {
          type: 'employee',
          data: this.departments.employees,
          isActive: (item) => this.$func.toggleClass(this.checkedEmployessList, item),
          change: (item) => this.$func.toChecked(this.checkedEmployessList, item),
        }]
      }
    },
    resList() {
      let data = [{
        type: 'role',
        data: this.checkedRoleList,
        cancel: (item) => this.$func.removeEle(this.checkedRoleList, item, 'roleId')
      }, {
        type: 'employee',
        data: this.checkedEmployessList,
        cancel: (item) => this.$func.removeEle(this.checkedEmployessList, item)
      }]
      if (this.isDepartment) {
        data.splice(1, 0, {
          type: 'department',
          data: this.checkedDepartmentList,
          cancel: (item) => this.$func.removeEle(this.checkedDepartmentList, item)
        })
      }
      return data
    }
  },
  data() {
    return {
      checkedRoleList: [],
      checkedEmployessList: [],
      checkedDepartmentList: []
    }
  },
  methods: {
    handleClick() {
      this.searchVal = "";
      this.conditionRoleSearchName = "";
      if (this.activeName == 1) {
        this.getDepartmentList();
      } else {
        this.getRoleList();
      }
    },
    saveDialog() {
      let checkedList = [...this.checkedRoleList, ...this.checkedEmployessList, ...this.checkedDepartmentList].map(item => ({
        type: item.employeeName ? 1 : (item.roleName ? 2 : 3),
        targetId: item.id || item.roleId,
        name: item.employeeName || item.roleName || item.departmentName
      }))
      this.$emit('change', checkedList)
    },
    delList() {
      this.checkedEmployessList = [];
      this.checkedRoleList = [];
      this.checkedDepartmentList = []
    }
  }
}
</script>

<style>
@import "../../css/dialog.css";
</style>