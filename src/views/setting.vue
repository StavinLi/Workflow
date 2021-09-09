<template>
	<div>
		<div class="fd-nav">
			<div class="fd-nav-left">
				<div class="fd-nav-back" @click="toReturn"><i class="anticon anticon-left"></i></div>
				<div class="fd-nav-title">{{workFlowDef.name}}</div>
			</div>
			<!-- <div class="fd-nav-center">
                <div class="fd-nav-container">
                    <div class="ghost-bar" style="transform: translateX(300px);"></div>
                    <div class="fd-nav-item"><span class="order-num">1</span>基础设置</div>
                    <div class="fd-nav-item"><span class="order-num">2</span>表单设计</div>
                    <div class="fd-nav-item active"><span class="order-num">3</span>流程设计</div>
                    <div class="fd-nav-item"><span class="order-num">4</span>高级设置</div>
                </div>
            </div> -->
			<div class="fd-nav-right">
				<!-- <button type="button" class="ant-btn button-preview"><span>预 览</span></button> -->
				<button type="button" class="ant-btn button-publish" @click="saveSet"><span>发 布</span></button>
			</div>
		</div>
		<div class="fd-nav-content">
			<section class="dingflow-design">
				<div class="zoom">
					<div :class="'zoom-out'+ (nowVal==50?' disabled':'')" @click="zoomSize(1)"></div>
					<span>{{nowVal}}%</span>
					<div :class="'zoom-in'+ (nowVal==300?' disabled':'')" @click="zoomSize(2)"></div>
				</div>
				<div class="box-scale" id="box-scale" :style="'transform: scale('+nowVal/100+'); transform-origin: 50% 0px 0px;'">
					<nodeWrap :nodeConfig.sync="nodeConfig" :flowPermission.sync="flowPermission"
						:isTried.sync="isTried" :tableId="tableId"></nodeWrap>
					<div class="end-node">
						<div class="end-node-circle"></div>
						<div class="end-node-text">流程结束</div>
					</div>
				</div>
			</section>
		</div>
		<el-dialog title="提示" :visible.sync="tipVisible">
			<div class="ant-confirm-body">
				<i class="anticon anticon-close-circle" style="color: #f00;"></i>
				<span class="ant-confirm-title">当前无法发布</span>
				<div class="ant-confirm-content">
					<div>
						<p class="error-modal-desc">以下内容不完善，需进行修改</p>
						<div class="error-modal-list">
							<div class="error-modal-item" v-for="(item,index) in tipList" :key="index">
								<div class="error-modal-item-label">流程设计</div>
								<div class="error-modal-item-content">{{item.name}} 未选择{{item.type}}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="tipVisible = false">我知道了</el-button>
				<el-button type="primary" @click="tipVisible = false">前往修改</el-button>
			</span>
		</el-dialog>
		<promoterDrawer />
		<approverDrawer  :directorMaxLevel="directorMaxLevel"/>
		<copyerDrawer />
		<conditionDrawer />
	</div>
</template>
<script>
import promoterDrawer from '@/components/drawer/promoterDrawer'
import approverDrawer from '@/components/drawer/approverDrawer'
import copyerDrawer from '@/components/drawer/copyerDrawer'
import conditionDrawer from '@/components/drawer/conditionDrawer'
export default {
	components:{promoterDrawer,approverDrawer,copyerDrawer,conditionDrawer},
	data() {
		return {
			isTried: false,
			tipList: [],
			tipVisible: false,
			nowVal: 100,
			processConfig: {},
			nodeConfig: {},
			workFlowDef: {},
			flowPermission: [],
			directorMaxLevel: 0,
			tableId: "",
		};
	},
	created() {
		this.$axios.get(`${process.env.BASE_URL}data.json`, {
			workFlowDefId: this.$route.params.workFlowDefId
		}).then(({data}) => {			
			this.processConfig = data;
			let {nodeConfig,flowPermission,directorMaxLevel,workFlowDef,tableId} = data
			this.nodeConfig = nodeConfig;
			this.flowPermission = flowPermission;
			this.directorMaxLevel = directorMaxLevel;
			this.workFlowDef = workFlowDef
			this.tableId = tableId
		})
	},
	methods: {
		toReturn() {
			//window.location.href = ""
		},
		reErr({childNode}) {
			if (childNode) {
				let {type,error,nodeName,conditionNodes} = childNode
				if (type == 1 || type == 2) {
					if (error) {
						this.tipList.push({ name: nodeName, type: ["审核人","抄送人"][type=1] })
					}
					this.reErr(childNode)
				} else if (type == 3) {
					this.reErr(childNode)
				} else if (type == 4) {
					this.reErr(childNode)
					for (var i = 0; i < conditionNodes.length; i++) {
						if (conditionNodes[i].error) {
							this.tipList.push({ name: conditionNodes[i].nodeName, type: "条件" })
						}
						this.reErr(conditionNodes[i])
					}
				}
			} else {
				childNode = null
			}
		},
		saveSet() {
			this.isTried = true;
			this.tipList = [];
			this.reErr(this.nodeConfig);
			if (this.tipList.length != 0) {
				this.tipVisible = true;
				return;
			}
			this.processConfig.flowPermission = this.flowPermission
			console.log(JSON.stringify(this.processConfig))
			// this.$axios.post("", this.processConfig).then(res => {
			//     if (res.code == 200) {
			//         this.$message.success("设置成功");
			//         setTimeout(function () {
			//             window.location.href = ""
			//         }, 200)
			//     }
			// })
		},
		zoomSize(type) {
			if (type == 1) {
				if (this.nowVal == 50) {
					return;
				}
				this.nowVal -= 10;
			} else {
				if (this.nowVal == 300) {
					return;
				}
				this.nowVal += 10;
			}
		}
	}
};
</script>
<style>
@import "../css/workflow.css";
.error-modal-list {
	width: 455px;
}
</style>