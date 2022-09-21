<!-- eslint-disable vue/no-template-key -->
<!--
 * @Date: 2022-08-26 17:18:14
 * @LastEditors: StavinLi
 * @LastEditTime: 2022-09-21 11:17:23
 * @FilePath: /Workflow/src/components/selectBox.vue
-->
<template>
  <ul class="select-box">
    <template v-for="elem in list">
      <template v-if="elem.type === 'role'">
        <li v-for="item in elem.data" :key="item.roleId" 
          class="check_box"
          :class="{active: elem.isActive && elem.isActive(item), not: elem.not}" 
          @click="elem.change(item)">
          <a :title="item.description" :class="{active: elem.isActiveItem && elem.isActiveItem(item)}">
            <img src="@/assets/images/icon_role.png">{{item.roleName}}
          </a>
        </li>
      </template>
      <template v-if="elem.type === 'department'">
        <li v-for="item in elem.data" :key="item.id" class="check_box" :class="{not: !elem.isDepartment}">
          <a v-if="elem.isDepartment" 
            :class="elem.isActive(item) && 'active'" 
            @click="elem.change(item)">
              <img src="@/assets/images/icon_file.png">{{item.departmentName}}</a>
          <a v-else><img src="@/assets/images/icon_file.png">{{item.departmentName}}</a>
          <i @click="elem.next(item)">下级</i>
        </li>
      </template>
      <template v-if="elem.type === 'employee'">
        <li v-for="item in elem.data" :key="item.id" class="check_box">
            <a :class="elem.isActive(item) && 'active'" 
              @click="elem.change(item)" 
              :title="item.departmentNames">
              <img src="@/assets/images/icon_people.png">{{item.employeeName}}
            </a>
        </li>
      </template>
    </template>
  </ul>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style lang="less">
.select-box {
  height: 420px;
  overflow-y: auto;

  li {
    padding: 5px 0;

    i {
      float: right;
      padding-left: 24px;
      padding-right: 10px;
      color: #3195f8;
      font-size: 12px;
      cursor: pointer;
      background: url(~@/assets/images/next_level_active.png) no-repeat 10px center;
      border-left: 1px solid rgb(238, 238, 238);
    }

    a.active+i {
      color: rgb(197, 197, 197);
      background-image: url(~@/assets/images/next_level.png);
      pointer-events: none;
    }

    img {
      width: 14px;
      vertical-align: middle;
      margin-right: 5px;
    }
  }
}
</style>