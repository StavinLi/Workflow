<!--
 * @Date: 2022-08-04 16:29:35
 * @LastEditors: StavinLi
 * @LastEditTime: 2022-09-21 11:25:18
 * @FilePath: /Workflow/src/components/dialog/roleDialog.vue
-->
<template>
   <el-dialog title="选择角色" :visible.sync="visibleDialog" width="600px" append-to-body class="promoter_person">
      <div class="person_body clear">
          <div class="person_tree l">
              <input type="text" placeholder="搜索角色" v-model="searchVal" @input="getDebounceData($event,2)">
              <selectBox :list="list" />
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
  props: ['visible', 'data'],
  watch: {
    visible(val) {
      this.visibleDialog = this.visible
      if (val) {
        this.getRoleList();
        this.searchVal = "";
        this.checkedRoleList = this.data.map(({ name, targetId }) => ({
          roleName: name,
          roleId: targetId
        }));
      }
    },
    visibleDialog(val) {
      this.$emit('update:visible', val)
    }
  },
  computed: {
    total() {
      return this.checkedRoleList.length
    },
    list() {
      return [{
        type: 'role',
        not: true,
        data: this.roles,
        isActive: (item) => this.$func.toggleClass(this.checkedRoleList, item, 'roleId'),
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        change: (item) => this.checkedRoleList = [item]
      }]
    },
    resList() {
      return [{
        type: 'role',
        data: this.checkedRoleList,
        cancel: (item) => this.$func.removeEle(this.checkedRoleList, item, 'roleId')
      }]
    }
  },
  data() {
    return {
      checkedRoleList: [],
    }
  },
  methods: {
    saveDialog() {
      let checkedList = this.checkedRoleList.map(item => ({
        type: 2,
        targetId: item.roleId,
        name: item.roleName
      }))
      this.$emit('change', checkedList)
    },
    delList() {
      this.checkedRoleList = [];
    }
  }
}
</script>

<style>
@import "../../css/dialog.css";
</style>