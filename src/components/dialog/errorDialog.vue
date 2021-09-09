<template>
  <el-dialog title="提示" :visible.sync="visibleDialog">
    <div class="ant-confirm-body">
      <i class="anticon anticon-close-circle" style="color: #f00;"></i>
      <span class="ant-confirm-title">当前无法发布</span>
      <div class="ant-confirm-content">
        <div>
          <p class="error-modal-desc">以下内容不完善，需进行修改</p>
          <div class="error-modal-list">
            <div class="error-modal-item" v-for="(item,index) in list" :key="index">
              <div class="error-modal-item-label">流程设计</div>
              <div class="error-modal-item-content">{{item.name}} 未选择{{item.type}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visibleDialog = false">我知道了</el-button>
      <el-button type="primary" @click="visibleDialog = false">前往修改</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ["list", "visible"],
  data(){
    return {
      visibleDialog: false,
    }
  },
  watch:{
    visible(val){
      this.visibleDialog = val
    },
    visibleDialog(val){
      this.$emit('update:visible',val)
    }
  }
}
</script>

<style>

</style>