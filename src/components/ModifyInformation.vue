<template>
  <!-- 修改个人信息界面 -->
  <div style="margin-top: 80px">
    <!-- 页头，返回主页 -->
    <el-page-header @back="goBack" content="修改个人信息">
    </el-page-header>
    <!-- 修改头像 -->
  上传头像
  <el-upload
    class="avatar-uploader"
    action="http://47.104.249.85:9797/FigureBed/hcy/uploading"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload">
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
    <br><br>
    <!-- 修改用户名 -->
    用户名：
    <el-input
      placeholder="请输入内容"
      v-model="input"
      style="width: 300px"
      clearable>
    </el-input>
    <br><br><br><br>
    <!-- 提交修改信息 -->
    <el-button plain @click="submitForm">提交</el-button>
  </div>
</template>

<script>
    export default {
        name: "ModifyInformation",
      data() {
        return {
          imageUrl: '',
          input: ''
        };
      },
      created() {
          var ken = localStorage.getItem("token")
          this.$http.get("http://47.104.249.85:8085/NetWorkDisk/user/index",{
            params: {
              token: ken
            }
          }).then(result => {
            // console.log(result.data.information)
            this.imageUrl = result.data.information.user.userIcon;
            this.input = result.data.information.user.userName;
          })
      },
      methods: {
        /**
         * 返回主页
         * @author LIY
         * date 2020-09-21
         * param
                null
         * @return null
         */
        goBack() {
          window.location.href = "http://localhost:8080/#/index"
        },
        /**
         * 头像上传后跳出的提示框信息
         * @author LIY
         * date 2020-09-22
         * param
                result:上传头像后返回的信息
         * @return null
         */
        handleAvatarSuccess(result) {
          // console.log(result)
          let code = result.code;
          if(code === 100){
            this.imageUrl = result.information
            this.$message.success(result.message);
          } else if (code === 101) {
            this.$message.error(result.message);
          } else if (code === 103) {
            this.$message.error(result.message);
          } else {
            this.$message.error(result.message);
          }
        },
        /**
         * 上传头像
         * @author LIY
         * date 2020-09-19
         * param
                file:上传的文件
         * @return null
         */
        beforeAvatarUpload(file) {
          const isJPG = file.type === 'image/jpeg';
          const isLt2M = file.size / 1024 / 1024 < 2;

          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
          }
          return isJPG && isLt2M;
        },
        /**
         * 注册成功
         * @author LIY
         * date 2020-09-19
         * param
         null
         * @return null
         */
        submitForm() {
          var ken = localStorage.getItem("token")
          this.$http.put("http://47.104.249.85:8085/NetWorkDisk/user/personal",{
            Token: ken,
            Name: this.input,
            Icon: this.imageUrl
          }).then(result=>{
            // console.log(result.data)
            let code = result.data.code;
            if (code === 100){
              this.$message.success(result.data.information);
              window.location.href = "http://localhost:8080/#/home"
            } else if(code === 101) {
              this.$message.error(result.data.information);
            } else if(code === 103) {
              this.$message.error(result.data.information);
            } else {
              this.$message.error(result.data.information);
            }
          })
        }
      }
    }
</script>

<style scoped>
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 200px;
    margin: 10px auto;
  }
  .avatar-uploader:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
