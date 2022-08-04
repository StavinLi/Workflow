import { getRoles, getDepartments, getEmployees } from '@/plugins/api.js'
export default {
  data() {
    return {
      visibleDialog: false,
      searchVal: "",
      activeName: "1",
      departments: {},
      roles: [],
    }
  },
  methods: {
    async getRoleList() {
      let { data: { list } } = await getRoles()
      this.roles = list;
    },
    async getDepartmentList(parentId = 0) {
      let { data } = await getDepartments({ parentId })
      this.departments = data;
    },
    getDebounceData(event, type = 1) {
      this.$func.debounce(async function () {
        if (event.target.value) {
          let data = {
            searchName: event.target.value,
            pageNum: 1,
            pageSize: 30
          }
          if (type == 1) {
            this.departments.childDepartments = [];
            let res = await getEmployees(data)
            this.departments.employees = res.data.list
          } else {
            let res = await getRoles(data)
            this.roles = res.data.list
          }
        } else {
          type == 1 ? await this.getDepartmentList() : await this.getRoleList();
        }
      }.bind(this))()
    },
  }
}