<template>
  <!-- 登录界面 -->
    <div style="color: dodgerblue">
      <div style="font-weight: bold; font-size: 50px">INet登录</div>
      <br><br><br>
      <!-- 登录界面用户名框 -->
      用户名：<el-input
      placeholder="请输入内容"
      v-model="account"
      clearable
      style="width: 300px">
    </el-input>
      <br>
      <br>
      <br>
      <!-- 登录界面密码框 -->
      密码：&nbsp;&nbsp;&nbsp;<el-input placeholder="请输入密码" v-model="password" show-password style="width: 300px"></el-input>
      <br>
      <br>
      <br>
      <div>
        <el-button plain @click="login">登录</el-button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
       <!-- 链接到注册界面 -->
        <a href="#/signin" style="text-decoration: none">
          <el-button plain>注册</el-button>
        </a>
      </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
      data() {
        return {
          account: '',
          password: '',
        }
      },
      methods: {
        /**
         * 登录账号
         * @author LIY
         * date 2020-09-18
         * param
                null
         * @return null
         */
          login(){
            this.$http.post("http://47.104.249.85:8085/NetWorkDisk/user/login",{
              Account: this.account,
              Password: this.password,
            }).then(result=>{
              let code = result.data.code;
              // 、console.log(result.data)
              if(code === 100){
                this.$message.success(result.data.information.msg);
                localStorage.setItem("token",result.data.information.token);
                window.location.href = "http://localhost:8080/#/Home"
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

</style>
