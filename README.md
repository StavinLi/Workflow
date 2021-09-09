

### workflow钉钉审批流程设置

workflow钉钉审批流程设置，基于vue开发。QQ交流群：639251756
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191116144905578.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Mjg1MTkz,size_16,color_FFFFFF,t_70 )
-  [线上开源地址 https://github.com/StavinLi/Workflow](https://github.com/StavinLi/Workflow) github点个星吧！
-  [预览地址 http://stavinli.gitee.io/workflow/#/approval/setting](http://stavinli.gitee.io/workflow/#/approval/setting) 
-------------------
 

#### 项目介绍
- UI钉钉风格
- 技术点
1. 组件自调用+递归处理，按树状结局处理审批流程问题
- 主要功能点
2. 界面缩放
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191116145339223.jpg)
```javascript
<div class="zoom">
	<div :class="'zoom-out'+ (nowVal==50?' disabled':'')" @click="zoomSize(1)"></div>
    <span>{{nowVal}}%</span>
    <div :class="'zoom-in'+ (nowVal==300?' disabled':'')" @click="zoomSize(2)"></div>
</div>
```
3. 节点设置（包括审批人、发起人、抄送人、条件设置）
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200304140232374.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Mjg1MTkz,size_16,color_FFFFFF,t_70#pic_center)
```javascript
<el-drawer title="审批人设置" :visible.sync="approverDrawer" direction="rtl" class="set_promoter" size="550px" :before-close="saveApprover"> 
    <div class="demo-drawer__content">
        <div class="drawer_content">
            <div class="approver_content">
                <el-radio-group v-model="approverConfig.settype" class="clear" @change="changeType">
                    <el-radio :label="1">指定成员</el-radio>
                    <el-radio :label="2">主管</el-radio>
                    <el-radio :label="4">发起人自选</el-radio>
                    <el-radio :label="5">发起人自己</el-radio>
                    <el-radio :label="7">连续多级主管</el-radio>
                </el-radio-group>
                ...
```
5. 节点新增
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191116145355289.png)
```javascript
<div class="add-node-btn">
    <el-popover placement="right-start" v-model="visible">
          <div class="add-node-popover-body">
              <a class="add-node-popover-item approver" @click="addType(1)">
                  <div class="item-wrapper">
                      <span class="iconfont"></span>
                  </div>
                  <p>审批人</p>
              </a>
              <a class="add-node-popover-item notifier" @click="addType(2)">
                  <div class="item-wrapper">
                      <span class="iconfont"></span>
                  </div>
                  <p>抄送人</p>
              </a>
              <a class="add-node-popover-item condition" @click="addType(4)">
                  <div class="item-wrapper">
                      <span class="iconfont"></span>
                  </div>
                  <p>条件分支</p>
              </a>
          </div>
          ...
```
5.错误校验
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200304140011896.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Mjg1MTkz,size_16,color_FFFFFF,t_70)
```javascript
let {type,error,nodeName,conditionNodes} = childNode
if (type == 1 || type == 2) {
    if (error) {
        this.tipList.push({ name: nodeName, type: ["","审核人","抄送人"][type] })
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
```
6.模糊搜索匹配人员、职位、角色
```javascript
<input type="text" placeholder="搜索成员" v-model="searchVal" @input="getDebounceData($event,activeName)">
<input type="text" placeholder="搜索角色" v-model="searchVal" @input="getDebounceData($event,2)">
<input type="text" placeholder="请选择具体人员/角色/部门" v-if="conditionConfig.nodeUserList.length == 0" @click="addConditionRole">
```
#### 项目安装

> git clone https://github.com/StavinLi/Workflow.git 点个赞吧！

#### 项目运行
> 1.环境依赖  `npm i`

> 2.本地运行 `npm run serve` 

> 3.打包运行 `npm run build` 
