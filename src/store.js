import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        promoterDrawer: false,
        flowPermission: [],
        approverDrawer: false,
        approverConfig:{},
        copyerDrawer: false,
        copyerConfig:{},
        conditionDrawer: false,
        conditionsConfig:{
            conditionNodes: [],
        },
    },
    mutations: {
        updatePromoter(status,promoterDrawer){
            status.promoterDrawer = promoterDrawer
        },
        updateFlowPermission(status,flowPermission){
            status.flowPermission = flowPermission
        },
        updateApprover(status,approverDrawer){
            status.approverDrawer = approverDrawer
        },
        updateApproverConfig(status,approverConfig){
            status.approverConfig = approverConfig
        },
        updateCopyer(status,copyerDrawer){
            status.copyerDrawer = copyerDrawer
        },
        updateCopyerConfig(status,copyerConfig){
            status.copyerConfig = copyerConfig
        },
        updateCondition(status,conditionDrawer){
            status.conditionDrawer = conditionDrawer
        },
        updateConditionsConfig(status,conditionsConfig){
            status.conditionsConfig = conditionsConfig
        },
    },
    actions: {}
})