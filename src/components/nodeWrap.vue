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
                        <div class="text" v-if="nodeConfig.type==0">{{$func.arrToStr(flowPermission)?$func.arrToStr(flowPermission):'所有人'}}</div>
                        <div class="text" v-if="nodeConfig.type==1">
                            <span class="placeholder" v-if="!$func.setApproverStr(nodeConfig)">请选择{{placeholderList[nodeConfig.type]}}</span>
                            {{$func.setApproverStr(nodeConfig)}}
                        </div>
                        <div class="text" v-if="nodeConfig.type==2">
                            <span class="placeholder" v-if="!$func.copyerStr(nodeConfig)">请选择{{placeholderList[nodeConfig.type]}}</span>
                            {{$func.copyerStr(nodeConfig)}}
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
                                    <div class="content" @click="setPerson(item.priorityLevel)">{{$func.conditionStr(nodeConfig,index)}}</div>
                                    <div class="error_tip" v-if="isTried&&item.error">
                                        <i class="anticon anticon-exclamation-circle" style="color: rgb(242, 86, 67);"></i>
                                    </div>
                                </div>
                                <addNode :childNodeP.sync="item.childNode"></addNode>
                            </div>
                        </div>
                        <nodeWrap v-if="item.childNode" :nodeConfig.sync="item.childNode"></nodeWrap>
                        <div class="top-left-cover-line" v-if="index==0"></div>
                        <div class="bottom-left-cover-line" v-if="index==0"></div>
                        <div class="top-right-cover-line" v-if="index==nodeConfig.conditionNodes.length-1"></div>
                        <div class="bottom-right-cover-line" v-if="index==nodeConfig.conditionNodes.length-1"></div>
                    </div>
                </div>
                <addNode :childNodeP.sync="nodeConfig.childNode"></addNode>
            </div>
        </div>
        <nodeWrap v-if="nodeConfig.childNode" :nodeConfig.sync="nodeConfig.childNode"></nodeWrap>
    </div>
</template>
<script>
import { mapState, mapMutations} from '_vuex@3.6.2@vuex'
export default {
    props: ["nodeConfig", "flowPermission"],
    data() {
        return {
            placeholderList: ["发起人", "审核人", "抄送人"],
            isInputList: [],
            isInput: false,
        }
    },
    mounted() {
        if (this.nodeConfig.type == 1) {
            this.nodeConfig.error = !this.$func.setApproverStr(this.nodeConfig)
        } else if (this.nodeConfig.type == 2) {
            this.nodeConfig.error = !this.$func.copyerStr(this.nodeConfig)
        } else if (this.nodeConfig.type == 4) {
            for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
                this.nodeConfig.conditionNodes[i].error = this.$func.conditionStr(this.nodeConfig, i) == "请设置条件" && i != this.nodeConfig.conditionNodes.length - 1
            }
        }
    },
    computed: {
        ...mapState(['isTried','flowPermission1','approverConfig1','copyerConfig1','conditionsConfig1']),
    },
    watch: {
        flowPermission1(data) {
            if (data.flag&&data.id === this._uid) {
                this.$emit('update:flowPermission',data.value)
            }
        },
        approverConfig1(data) {
            if (data.flag&&data.id === this._uid) {
                this.$emit('update:nodeConfig',data.value)
            }
        },
        copyerConfig1(data) {
            if (data.flag&&data.id === this._uid) {
                this.$emit('update:nodeConfig',data.value)
            }
        },
        conditionsConfig1(data) {
            if (data.flag&&data.id === this._uid) {
                this.$emit('update:nodeConfig',data.value)
            }
        },
    },
    methods: {
        ...mapMutations([
            'setPromoter',
            'setApprover',
            'setCopyer',
            'setCondition',
            'setFlowPermission',
            'setApproverConfig',
            'setCopyerConfig',
            'setConditionsConfig'
        ]),
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
                this.nodeConfig.conditionNodes[i].error = this.$func.conditionStr(this.nodeConfig, i) == "请设置条件" && i != this.nodeConfig.conditionNodes.length - 1
            }
            this.$emit("update:nodeConfig", this.nodeConfig);
        },
        delTerm(index) {
            this.nodeConfig.conditionNodes.splice(index, 1)
            this.nodeConfig.conditionNodes.map((item, index) => {
                item.priorityLevel = index + 1
                item.nodeName = `条件${index + 1}`
            });
            for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
                this.nodeConfig.conditionNodes[i].error = this.$func.conditionStr(this.nodeConfig, i) == "请设置条件" && i != this.nodeConfig.conditionNodes.length - 1
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
                this.setPromoter(true)
                this.setFlowPermission({
                    value:this.flowPermission,
                    flag:false,
                    id:this._uid
                })
            } else if (type == 1) {
                this.setApprover(true)
                this.setApproverConfig({
                    value: {...JSON.parse(JSON.stringify(this.nodeConfig)),
                    ...{settype:this.nodeConfig.settype ? this.nodeConfig.settype : 1}},
                    flag:false,
                    id:this._uid
                })
            } else if (type == 2) {
                this.setCopyer(true)
                this.setCopyerConfig({
                    value:JSON.parse(JSON.stringify(this.nodeConfig)),
                    flag:false,
                    id:this._uid
                })
            } else {
                this.setCondition(true)
                this.setConditionsConfig({
                    value:JSON.parse(JSON.stringify(this.nodeConfig)),
                    priorityLevel,
                    flag:false,
                    id:this._uid
                })
            }
        },
        arrTransfer(index, type = 1) {//向左-1,向右1
            this.nodeConfig.conditionNodes[index] = this.nodeConfig.conditionNodes.splice(index + type, 1, this.nodeConfig.conditionNodes[index])[0];
            this.nodeConfig.conditionNodes.map((item, index) => {
                item.priorityLevel = index + 1
            })
            for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
                this.nodeConfig.conditionNodes[i].error = this.$func.conditionStr(this.nodeConfig, i) == "请设置条件" && i != this.nodeConfig.conditionNodes.length - 1
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
.promoter_person .el-dialog__body {
    padding: 10px 20px 14px 20px;
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
</style>