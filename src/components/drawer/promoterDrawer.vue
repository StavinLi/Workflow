<!--
 * @Date: 2022-08-04 16:29:35
 * @LastEditors: StavinLi
 * @LastEditTime: 2022-09-21 11:17:15
 * @FilePath: /Workflow/src/components/drawer/promoterDrawer.vue
-->
<template>
    <el-drawer :append-to-body="true" title="发起人" :visible.sync="promoterDrawer" direction="rtl" class="set_promoter" size="550px" :before-close="savePromoter"> 
        <div class="demo-drawer__content">
            <div class="promoter_content drawer_content">
                <p>{{$func.arrToStr(flowPermission)?$func.arrToStr(flowPermission):'所有人'}}</p>
                <el-button type="primary" @click="addPromoter">添加/修改发起人</el-button>
            </div>
            <div class="demo-drawer__footer clear">
                <el-button type="primary" @click="savePromoter">确 定</el-button>
                <el-button @click="closeDrawer">取 消</el-button>
            </div>
            <employees-dialog 
                :isDepartment="true"
                :visible.sync="promoterVisible"
                :data.sync="checkedList"
                @change="surePromoter"
            />
        </div>
    </el-drawer>
</template>
<script>
import employeesDialog from '../dialog/employeesDialog.vue'
import { mapState, mapMutations } from 'vuex'
export default {
    components: { employeesDialog },
    data() {
        return {
            flowPermission: [],
            promoterVisible: false,
            checkedList: [],
        }
    },
    computed: {
        ...mapState(['promoterDrawer', 'flowPermission1']),
    },
    watch: {
        flowPermission1(val) {
            this.flowPermission = val.value
        }
    },
    methods: {
        ...mapMutations(['setPromoter', 'setFlowPermission']),
        addPromoter() {
            this.checkedList = this.flowPermission
            this.promoterVisible = true;
        },
        surePromoter(data) {
            this.flowPermission = data;
            this.promoterVisible = false;
        },
        savePromoter() {
            this.setFlowPermission({
                value: this.flowPermission,
                flag: true,
                id: this.flowPermission1.id
            })
            this.closeDrawer()
        },
        closeDrawer() {
            this.setPromoter(false)
        }
    }
}
</script>
<style lang="less">
.set_promoter {
    .promoter_content {
        padding: 0 20px;

        .el-button {
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