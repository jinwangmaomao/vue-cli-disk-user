<template>
  <!-- 文件界面 -->
  <div>
    <div style="text-align: left; margin-top: 50px; display: inline-block; width: 50%">
      <el-input
        placeholder="请输入内容"
        v-model="input"
        style="width: 300px; display: inline-block"
        clearable>
      </el-input>
      <el-button plain icon="el-icon-search" @click="searchName"></el-button>
    </div>
    <!-- 上传文件 -->
    <div style="text-align: left; display: inline-block; width: 20%">
    <el-button type="primary" @click="dialog = true" style="margin-top: 50px">上传文件</el-button>
    <el-drawer
      title="上传文件"
      :visible.sync="dialog"
      direction="ltr"
      custom-class="demo-drawer"
      ref="drawer" @click="">
        <!-- 选择新建的文件的类别 -->
        <div class="demo-drawer__content">
          <el-form style="margin-top: 50px">
            <el-form-item>
              <el-select v-model="myHeader.TypeId" placeholder="请选择类别">
                <el-option
                  v-for="item in typeDate"
                  :key="item.typeId"
                  :label="item.typeName"
                  :value="item.typeId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-upload
                class="upload-demo"
                ref="upload"
                action="http://47.104.249.85:8085/NetWorkDisk/file/uploads"
                :data="myHeader"
                :before-remove="beforeRemove"
                multiple
                :on-success="success"
                :file-list="fileList"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary" icon="el-icon-upload" style="margin-top: 50px">点击上传</el-button>
                <el-button size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                <div class="el-upload__tip" style="display: inline-block; width: 50%"></div>
              </el-upload>
          </el-form-item>
        </el-form>
        </div>
    </el-drawer>
  </div>
    <!-- 文件列表 -->
    <div class="infinite-list-wrapper" style="overflow:auto; margin-top: 50px">
      <ul
        class="list"
        v-infinite-scroll="load"
        :infinite-scroll-disabled="disabled"
        style="list-style: none"
       >
        <li class="list-item" style="height: 50px" v-for="i in tableData.records">
          <el-row>
            <el-col :span="4"><div class="grid-content bg-purple">{{i.fileName + i.filePostfix}}</div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple-none"></div></el-col>
            <el-col :span="4"><div class="grid-content bg-purple-none"></div></el-col>
            <el-col :span="4"><div class="grid-content bg-purple-light">{{i.fileSize + 1 + "kb"}}</div></el-col>
            <el-col :span="2"><div><el-button type="primary" plain @click="downLoad(i.fileId)">下载文件</el-button></div></el-col>
            <el-col :span="4"><div><el-button type="danger" plain @click="delFile(i.fileId)">删除文件</el-button></div></el-col>
          </el-row>
        </li>
      </ul>
      <p v-if="loading"></p>
      <p v-if="noMore">没有更多了</p>
    </div>
  </div>
</template>

<script>
    export default {
      name: "Index",
      data() {
        return {
          fileList: [],
          tableData: [],
          ken: "",
          dialog: false,
          myHeader: {
            Token: "",
            TypeId: "",
          },
          input: "",
          typeDate:[],
          code: "",
          message: "",
          loading: false,
          count: 10,
          page: 1,
        };
      },

      created() {
        this.index();
      },

      methods: {
        /**
         * 上传文件后移除
         * @author LIY
         * date 2020-09-23
         * param
                file:上传的文件
         * @return null
         */
        beforeRemove(file) {
          return this.$confirm(`确定移除 ${file.name}？`);
        },
        cancelForm() {
          this.dialog = false;
        },
        /**
         * 将从数据库调取的数据渲染到页面上
         * @author LIY
         * date 2020-09-23
         * param
                null
         * @return null
         */
        index() {
          this.myHeader.Token = localStorage.getItem("token")
          this.$http.get("http://47.104.249.85:8085/NetWorkDisk/type/index",{
            params: {
              token: this.myHeader.Token,
            }
          }).then(result=>{
            console.log(result.data)
            this.typeDate = result.data.information;
          })
        },
        /**
         * 文件上传后弹出的提示框信息
         * @author LIY
         * date 2020-09-23
         * param
                result:上传文件后返回的信息
         * @return null
         */
        success(result) {
          this.dialog = false
          // console.log(result)
          let code = result.code
          if (code === 100) {
            this.$message.success(result.information)
          } else if(code === 101) {
          this.$message.error(result.data.information);
          } else if(code === 103) {
            this.$message.error(result.data.information);
          }else {
            this.$message.error(result.data.information);
          }
          this.index();
        },
        /**
         * 文件列表显示文件的无限滚动
         * @author LIY
         * date 2020-09-23
         * param
                null
         * @return null
         */
        load () {
          this.loading = true
          if (this.count !== this.tableData.total) {
            this.count += 2
          }
          this.$http.get("http://47.104.249.85:8085/NetWorkDisk/file/list",{
            params: {
              Token: this.myHeader.Token,
              PageSize: this.count,
            }
          }).then(result=>{
            this.tableData = result.data.information
            // console.log(this.tableData.size)
            // console.log(this.tableData.total)
          })
          setTimeout(() => {
            this.page += 1
            this.loading = false
          },1000)
        },
        /**
         * 文件搜索
         * @author LIY
         * date 2020-09-23
         * param
         null
         * @return null
         */
        searchName() {
          this.$http.get("http://47.104.249.85:8085/NetWorkDisk/file/list",{
            params: {
              Token: this.myHeader.Token,
              PageSize: this.count,
              FileName: this.input
            }
          }).then(result=>{
            this.tableData = result.data.information
          })
        },
        /**
         * 文件下载
         * @author LIY
         * date 2020-09-24
         * param
                fileId:当前下载的文件的ID
         * @return null
         */
        downLoad(fileId) {
          console.log(fileId);
          window.location.href="http://47.104.249.85:8085/NetWorkDisk/file/down?Token=" + this.myHeader.Token + "&FileId=" + fileId;
        },
        /**
         * 文件删除
         * @author LIY
         * date 2020-09-24
         * param
                null
         * @return null
         */
        delFile(fileId) {
          console.log(fileId);
          this.$http.delete("http://47.104.249.85:8085/NetWorkDisk/file/delete",{
            params: {
              Token: this.myHeader.Token,
              FileId: fileId
            }
          }).then(result=>{
            // console.log(result.data)
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
            this.tableData = result.data.information
          })
        },
        /**
         * 文件上传到服务器
         * @author LIY
         * date 2020-09-23
         * param
                null
         * @return null
         */
        submitUpload() {
          this.$refs.upload.submit();
          this.index();
        },
      },
      computed: {
        noMore() {
          return this.count >= this.tableData.total
        },
        disabled () {
          return this.loading || this.noMore
        }
      },
    }
</script>

<style scoped>
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple-light {
    text-align: left;
  }
  .bg-purple {
    text-align: left;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
</style>
