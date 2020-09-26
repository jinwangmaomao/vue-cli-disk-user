<template>
  <!-- 主页的导航栏 -->
  <div>
    <div>
      <router-view></router-view>
    </div>
    <div>
      <!-- 首页导航栏 -->
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      id="el-menu-fixed"
      mode="horizontal"
      @select="handleSelect"
      router="router"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="index">主页</el-menu-item>
      <el-menu-item index="category">类别</el-menu-item>
      <el-col :span="12">
      </el-col>
      <el-col :span="12" class="block">
        <el-dropdown>
      <span class="el-dropdown-link">
        <div class="demo-basic--circle">
        <div><el-avatar :size="50" :src="index.userIcon"></el-avatar></div>
      </div>
      </span>
          <el-dropdown-menu slot="dropdown" class="dropdown">
            <el-dropdown-item disabled class="el-name">{{index.userName}}</el-dropdown-item>
            <a href="#/home/modifyinformation"><el-dropdown-item divided>修改个人信息</el-dropdown-item></a>
            <a href="#/home/changepassword"><el-dropdown-item style="text-align: center">修改密码</el-dropdown-item></a>
            <a href="#" @click="exit"><el-dropdown-item style="text-align: center">退出登录</el-dropdown-item></a>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-menu>
    </div>
    <br>
    <br>
    <br>
  </div>
</template>

<script>
    export default {
      name: "Home",
      data() {
        return {
          ken: '',
          activeIndex: this.$route.path,
          index:[],
        };
      },
      mounted() {
        // 设置bar浮动阈值为 #fixedBar 至页面顶部的距离
        this.offsetTop = document.querySelector('#el-menu-fixed').offsetTop;
        // 开启滚动监听
        window.addEventListener('scroll', this.handleScroll);
      },
      methods: {
        handleSelect(key, keyPath) {
          console.log(key, keyPath);
        },
        handleScroll() {
          var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
          if (scrollTop >= this.offsetTop) {
            this.isFixed = true;
          } else {
            this.isFixed = false;
          }
        },
        /**
         * 退出登录
         * @author LIY
         * date 2020-09-20
         * param
                null
         * @return null
         */
        exit() {
          // console.log(this.ken)
          this.$http.get("http://47.104.249.85:8085/NetWorkDisk/user/quit",{
            params: {
              token: this.ken,
            }
          }).then(result=>{
            // console.log(result.data)
            let code = result.data.code;
            if(code === 100){
              localStorage.removeItem("token");
              this.$message.success(result.data.information);
              window.location.href = "http://localhost:8080/#/"
            } else if(code === 101) {
              this.$message.error(result.data.information);
            } else if(code === 103) {
              this.$message.error(result.data.information);
            }else {
              this.$message.error(result.data.information);
            }
          })
        },
      },
      destroyed() {
        // 离开页面 关闭监听 不然会报错
        window.removeEventListener('scroll', this.handleScroll);
      },
      created() {
        this.ken = localStorage.getItem("token");
        // console.log(this.ken)
        this.$http.get("http://47.104.249.85:8085/NetWorkDisk/user/index",{
          params: {
            token: this.ken,
          }
        }).then(result=>{
          // console.log(result.data)
          this.index = result.data.information.user;
        })
        window.location.href = "http://localhost:8080/#/index"
      }
    }
</script>

<style scoped>
  a {
    text-decoration: none;
  }
  .el-name {
    font-size: 14px;
    text-align: center;
  }
  .el-menu-demo {
    margin-left: -9px;
    position: fixed;
    top: 0;
    width: 100%;
  }
  .block {
    margin-top: 5px;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
    margin-right: -2900%;
    display: inline-block;
  }
  .dropdown {
    margin-right: -65%;
    display: inline-block;
  }
</style>
