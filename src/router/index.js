import Vue from 'vue'
import Router from 'vue-router'
import Home from "../components/Home";
import Login from "../components/Login";
import Signin from "../components/Signin";
import ChangePassword from "../components/ChangePassword";
import ModifyInformation from "../components/ModifyInformation";
import Category from "../components/Category";
import Index from "../components/Index";

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', component: Login},
    {path: '/home', component: Home,
      children: [
        {path: 'changepassword', component: ChangePassword},
        {path: 'modifyinformation', component: ModifyInformation},
        {path: '/category', component: Category},
        {path: '/index', component: Index},
      ]
    },
    {path: '/signin', component: Signin},
  ]
})
