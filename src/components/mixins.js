export default {
  data(){
    return {
      activeName: "1",
      departments: {},
      roles: [],
    }
  },
  methods:{
    handleClick() {
      this.copyerSearchName = "";
      this.conditionRoleSearchName = "";
      if (this.activeName == 1) {
          this.getDepartmentList();
      } else {
          this.getRoleList();
      }
    },
    getRoleList() {
      this.$axios.get(`${process.env.BASE_URL}roles.json`).then(res => {
          this.roles = res.data.list;
      })
    },
    getDepartmentList(parentId = 0) {
        this.$axios.get(`${process.env.BASE_URL}departments.json?parentId=${parentId}`).then(res => {
            this.departments = res.data;
        })
    },
    getDebounceData(event, type = 1) {
      this.$func.debounce(function () {
          if (event.target.value) {
              if (type == 1) {
                  this.departments.childDepartments = [];
                  this.$axios.get(`${process.env.BASE_URL}employees.json?searchName=${event.target.value}&pageNum=1&pageSize=30`).then(res => {
                      this.departments.employees = res.data.list
                  })
              } else {
                  this.$axios.get(`${process.env.BASE_URL}roles.json?searchName=${event.target.value}&pageNum=1&pageSize=30`).then(res => {
                      this.roles = res.data.list
                  })
              }
          } else {
              type == 1 ? this.getDepartmentList() : this.getRoleList();
          }
      }.bind(this))()
    },
  }
}