<template>
  <!-- 注册界面 -->
  <div>
    用户名(邮箱)：<el-input
    placeholder="请输入内容"
    v-model="email"
    clearable
    style="width: 300px">
  </el-input>
    <br><br><br>
    <!-- 注册界面密码框 -->
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    密码：<el-input placeholder="请输入密码" v-model="password" show-password style="width: 300px"></el-input>
    <br><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <span style="font-size: 14px; color: red">*必须是6-20位的字母、数字（这里字母、数字是指任意组合，没有必须均包含）</span>
    <br><br><br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <!-- 输入昵称 -->
    昵称：<el-input
    placeholder="请输入内容"
    v-model="name"
    clearable
    style="width: 300px">
  </el-input>
    <br><br>
    <!-- 上传头像 -->
    <div>
      <p>上传头像</p>
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
      <!-- 确认注册，跳转到登录页面 -->
      <div>
        <el-button size="big" @click="register">确认注册</el-button>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Signin",
      data() {
        return {
          email: '',
          password: '',
          name: '',
          imageUrl: ''
        }
      },
      methods: {
        /**
         * 头像上传后跳出的提示框信息
         * @author LIY
         * date 2020-09-19
         * param
                result:上传头像后返回的信息
         * @return null
         */
        handleAvatarSuccess(result) {
          // console.log(result);
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
        register(){
          this.$http.post("http://47.104.249.85:8085/NetWorkDisk/user/register", {
              Email: this.email,
              Password: this.password,
              Name: this.name,
              Icon: this.imageUrl,
            }
          ).then(result=>{
            // console.log(result.data)
            let code = result.data.code;
            if(code === 100){
              this.$message.success(result.data.information);
              window.location.href = "http://localhost:8080/#/"
            } else if (code === 101) {
              this.$message.error(result.data.information);
            } else if (code === 103) {
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
    width: 180px;
    height: 180px;
    margin: 0 auto;
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
