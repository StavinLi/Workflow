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
              <selectBox :list="list"/>
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
        this.getDepartmentList();
        this.searchVal = "";
        this.checkedEmployessList = this.data.filter(item => item.type === 1).map(({ name, targetId }) => ({
          employeeName: name,
          id: targetId
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
      return this.checkedDepartmentList.length + this.checkedEmployessList.length
    },
    list() {
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
    },
    resList() {
      let data = [{
        type: 'employee',
        data: this.checkedEmployessList,
        cancel: (item) => this.$func.removeEle(this.checkedEmployessList, item)
      }]
      if (this.isDepartment) {
        data.unshift({
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
      checkedDepartmentList: [],
      checkedEmployessList: [],
    }
  },
  methods: {
    saveDialog() {
      let checkedList = [...this.checkedDepartmentList, ...this.checkedEmployessList].map(item => ({
        type: item.employeeName ? 1 : 3,
        targetId: item.id,
        name: item.employeeName || item.departmentName
      }))
      this.$emit('change', checkedList)
    },
    delList() {
      this.checkedDepartmentList = [];
      this.checkedEmployessList = []
    }
  }
}
</script>

<style>
@import "../../css/dialog.css";
</style>