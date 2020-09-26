<template>
  <!-- 修改密码界面 -->
  <div style="margin-top: 80px">
    <!-- 页头，返回主页 -->
  <el-page-header @back="goBack" content="修改密码">
  </el-page-header>
    <!-- 修改密码 -->
  <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="旧密码" style="width:550px; margin: 20px auto">
      <el-input show-password v-model="ruleForm.oldPass" style="width: 500px"></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="pass" style="width:550px; margin: 20px auto">
      <el-input type="password" show-password v-model="ruleForm.pass" style="width: 500px"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPass" style="width:550px; margin: 20px auto">
      <el-input type="password" v-model="ruleForm.checkPass" style="width: 500px"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
  </div>
</template>

<script>
    export default {
      name: "ChangePassword",
      data() {
        var validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'));
          } else {
            if (this.ruleForm.checkPass !== '') {
              this.$refs.ruleForm.validateField('checkPass');
            }
            callback();
          }
        };
        var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.ruleForm.pass) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
        return {
          ruleForm: {
            oldPass: '',
            pass: '',
            checkPass: '',
          },
          rules: {
            pass: [
              { validator: validatePass, trigger: 'blur' }
            ],
            checkPass: [
              { validator: validatePass2, trigger: 'blur' }
            ],
          }
        };
      },
      methods: {
        /**
         * 返回主页
         * @author LIY
         * date 2020-09-20
         * param
                null
         * @return null
         */
        goBack() {
          window.location.href = "http://localhost:8080/#/index"
        },
        /**
         * 提交修改的密码
         * @author LIY
         * date 2020-09-20
         * param
                null
         * @return null
         */
        submitForm() {
          var ken = localStorage.getItem("token")
          // console.log(ken)
          this.$http.put("http://47.104.249.85:8085/NetWorkDisk/user/update",{
            Token: ken,
            OldPassword: this.ruleForm.oldPass,
            NewPassword: this.ruleForm.pass,
          }).then(result=>{
            // console.log(this.ruleForm.oldPass)
            let code = result.data.code;
            if(code === 100){
              this.$message.success(result.data.information);
              window.location.href = "http://localhost:8080/#/index"
            } else if(code === 101) {
              this.$message.error(result.data.information);
            } else if(code === 103) {
              this.$message.error(result.data.information);
            } else {
              this.$message.error(result.data.information);
            }
          })
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        }
      }
    }
</script>

<style scoped>

</style>
