<!-- eslint-disable vue/no-template-key -->
<!--
 * @Date: 2022-08-26 16:29:24
 * @LastEditors: StavinLi
 * @LastEditTime: 2022-09-21 11:17:24
 * @FilePath: /Workflow/src/components/selectResult.vue
-->
<template>
  <div class="select-result l">
    <p class="clear">已选（{{total}}）
        <a @click="$emit('del')">清空</a>
    </p>
    <ul>
        <template v-for="({type, data, cancel}) in list">
          <template v-if="type === 'role'">
            <li v-for="item in data" :key="item.roleId">
                <img src="@/assets/images/icon_role.png">
                <span>{{item.roleName}}</span>
                <img src="@/assets/images/cancel.png" @click="cancel(item)">
            </li>
          </template>
          <template v-if="type === 'department'">
            <li v-for="item in data" :key="item.id">
                <img src="@/assets/images/icon_file.png">
                <span>{{item.departmentName}}</span>
                <img src="@/assets/images/cancel.png" @click="cancel(item)">
            </li>
          </template>
          <template v-if="type === 'employee'">
            <li v-for="item in data" :key="item.id">
                <img src="@/assets/images/icon_people.png">
                <span>{{item.employeeName}}</span>
                <img src="@/assets/images/cancel.png" @click="cancel(item)">
            </li>
          </template>
        </template>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0
    },
    list: {
      type: Array,
      default: () => [{ type: 'role', data: [], cancel: function () { } }]
    }
  }
}
</script>

<style lang="less">
.select-result {
  width: 276px;
  height: 100%;
  font-size: 12px;

  ul {
    height: 460px;
    overflow-y: auto;

    li {
      margin: 11px 26px 13px 19px;
      line-height: 17px;

      span {
        vertical-align: middle;
      }

      img {
        &:first-of-type {
          width: 14px;
          vertical-align: middle;
          margin-right: 5px;
        }

        &:last-of-type {
          float: right;
          margin-top: 2px;
          width: 14px;
        }
      }
    }
  }

  p {
    padding-left: 19px;
    padding-right: 20px;
    line-height: 37px;
    border-bottom: 1px solid #f2f2f2;

    a {
      float: right;
    }
  }
}
</style>