<template>
  <!-- 类别界面 -->
  <div style="margin-top: 90px">
    <div style="display: inline-block; text-align: left; width: 100%; margin-bottom: 10px">
      <!-- 新建类别 -->
      <el-button style="width: 140px; font-size: 16px" icon="el-icon-folder-add" @click="newCategory">新建类别</el-button>
      <!-- 搜索类别 -->
      <el-input
        placeholder="请输入内容"
        v-model="input"
        clearable
        style="width: 300px; margin-left: 100px">
      </el-input>
      <el-button icon="el-icon-search" @click="searchName"></el-button>
  </div>
    <!-- 类别列表 -->
    <el-table
      :data="tableData.records"
      style="width: 100%">
      <el-table-column
        prop="typeId"
        label="序号"
        width="400px"
        type="index">
      </el-table-column>
      <el-table-column
        label="类别"
        width="500px"
        prop="typeName">
        <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium"><i class="el-icon-folder"></i> &nbsp; {{ scope.row.typeName }}</el-tag>
            </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" style="font-size: 20px">
        <template slot-scope="scope">
          <!-- 修改类别的名称 -->
          <el-button
            size="medium"
            style="margin-right: 40px;"
            @click="handleEdit(scope.row.typeId,scope.row.typeName)">修改名称</el-button>
          <!-- 删除类别 -->
          <el-button
            size="medium"
            type="danger"
            @click="handleDelete(scope.row.typeId)">删除类别</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @current-change="changePage"
      :page-size="tableData.size"
      layout="prev, pager, next"
      :total="tableData.total" style="margin-top: 5%">
    </el-pagination>
  </div>
</template>

<script>
    export default {
        name: "Category",
      data() {
        return {
          tableData: [],
          categoryName: "",
          changeName: "",
          pagination: 1,
          input: "",
          count: 0,
          page: "",
        }
      },
      methods: {
        /**
         * 修改类别名称
         * @author LIY
         * date 2020-09-22
         * param
                typeId:类别的ID
         * @return null
         */
        handleEdit(typeId) {
          var ken = localStorage.getItem("token")
          this.$prompt('请输入要修改的类别名称：', '修改类别名称', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(({ value }) => {
            this.changeName = value
            this.$http.put("http://47.104.249.85:8085/NetWorkDisk/type/renewal",{
              Token: ken,
              TypeId: typeId,
              Name: this.changeName,
            }).then(result=>{
              // console.log(result.data)
              let code = result.data.code;
              if(code === 100){
                this.$message.success(result.data.information);
                this.addObject();
              } else if(code === 101) {
                this.$message.error(result.data.information);
              } else if(code === 103) {
                this.$message.error(result.data.information);
              }else {
                this.$message.error(result.data.information);
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });
        },
        /**
         * 删除类别
         * @author LIY
         * date 2020-09-22
         * param
                typeId:类别的ID
         * @return null
         */
        handleDelete(typeId) {
          var ken = localStorage.getItem("token")
          this.$http.delete("http://47.104.249.85:8085/NetWorkDisk/type/delete",{
            params: {
              token: ken,
              typeId: typeId
            }
          }).then(result=>{
            // console.log(result)
            let code = result.data.code;
            if(code === 100){
              this.$message.success(result.data.information);
            } else if(code === 101) {
              this.$message.error(result.data.information);
            } else if(code === 103) {
              this.$message.error(result.data.information);
            }else {
              this.$message.error(result.data.information);
            }
            this.addObject();
          })
        },
        /**
         * 新建类别
         * @author LIY
         * date 2020-09-22
         * param
                null
         * @return null
         */
        newCategory() {
          var ken = localStorage.getItem("token")
          this.$prompt('请输入新增的类别：', '新增类别', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(({value}) => {
            this.categoryName = value
            this.$http.post("http://47.104.249.85:8085/NetWorkDisk/type/newly", {
              Token: ken,
              Name: this.categoryName
            }).then(result=>{
              let code = result.data.code;
              // console.log(code)
              if(code === 100){
                this.$message.success(result.data.information);
                this.$message({
                  type: 'success',
                  message: '你新增的类别是: ' + value,
                });
              } else if(code === 101) {
                this.$message.error(result.data.information);
              } else if(code === 103) {
                this.$message.error(result.data.information);
              }else {
                this.$message.error(result.data.information);
              }
              this.addObject()
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });
        },
        /**
         * 搜索类别
         * @author LIY
         * date 2020-09-22
         * param
                null
         * @return null
         */
        searchName() {
          var ken = localStorage.getItem("token")
          this.$http.get("http://47.104.249.85:8085/NetWorkDisk/type/list",{
            params: {
              token: ken,
              typeName: this.input
            }
          }).then(result=>{
            this.tableData = result.data.information.records
          })
        },
        /**
         * 分页翻页
         * @author LIY
         * date 2020-09-22
         * param
                number:点击的页数
         * @return null
         */
        changePage(number) {
          var ken = localStorage.getItem("token")
          console.log(number)
          this.pagination = number
          this.$http.get("http://47.104.249.85:8085/NetWorkDisk/type/list",{
            params: {
              token: ken,
              pagination: this.pagination,
            }
          }).then(result=>{
            console.log(result.data)
            this.tableData = result.data.information
          })
        },
        /**
         * 获取所有的类别
         * @author LIY
         * date 2020-09-22
         * param
                null
         * @return null
         */
        addObject() {
          var ken = localStorage.getItem("token")
          this.$http.get("http://47.104.249.85:8085/NetWorkDisk/type/index",{
            params: {
              token: ken
            }
          }).then(result=>{
            console.log(result.data.information);
            this.$http.get("http://47.104.249.85:8085/NetWorkDisk/type/list",{
              params: {
                token: ken,
                pagination: this.pagination,
                typeName: this.input
              }
            }).then(result=>{
              console.log(result.data)
              this.tableData = result.data.information
            })
          })
        },
      },
      created() {
        this.addObject();
      }
    }
</script>

<style scoped>

</style>
