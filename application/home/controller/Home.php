<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/6/1
 * Time: 16:31
 */

namespace app\home\controller;


use think\Controller;

class Home extends Controller
{
    //注册页面一
    public function register(){
        return $this->fetch();
    }
    //注册页面二
    public function register_pwd(){
        return $this->fetch();
    }

    public function logins(){
        return $this->fetch();
    }

    public function ceshi(){
        return $this->fetch();
    }

    //移动首页
    public function index_wap(){
        return $this->fetch();
    }
    //抢购详情页
    public function Details(){
        return $this->fetch();
    }
    //报单页
    public function declaration(){
        return $this->fetch();
    }
    //我的页面
    public function user(){
        return $this->fetch();
    }
    //我的个人资料页面
    public function user_info(){
        return $this->fetch();
    }
    //订单明细
    public function order_details(){
        return $this->fetch();
    }
    //结算明细
    public function settlement_details(){
        return $this->fetch();
    }

}