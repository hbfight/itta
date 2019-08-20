<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/20
 * Time: 21:55
 */

namespace app\admin\controller;

use think\Controller;
use think\Db;
use think\Request;
use think\Session;

class Admin extends Controller
{
    //登录页面
    public function login(){
        return $this->fetch();
    }
    //后台首页
    public function index(){
        return $this->fetch();
    }

    //后台首页右侧frame
    public function welcome(){
        return $this->fetch();
    }

    //抢购信息列表
    public function shoplist(){
        return $this->fetch();
    }
    public function shoplist_order(){
        return $this->fetch();
    }
    //添加抢购信息
    public function shopadd(){
        $info = Db::name('address')->where('delete_time','null')->select();
        $this->assign('info',$info);
        return $this->fetch();
    }
    //修改抢购信息
    public function shopedit(){
        $info = Db::name('address')->where('delete_time','null')->select();
        $this->assign('info',$info);
        return $this->fetch();
    }
    //会员管理列表
    public function memberlist(){
        return $this->fetch();
    }
    public function memberlist_edit(){
        return $this->fetch();
    }
    public function settlement_order(){
        return $this->fetch();
    }
    public function settlement(){
        return $this->fetch();
    }
    //下单地址管理
    public function addresslist(){
        return $this->fetch();
    }
    //报单订单列表
    public function order(){
        return $this->fetch();
    }
    //添加地址栏
    public function addAdd(){
        return $this->fetch();
    }

    //省、市、县地区数据
    public function region(){
        return config('json.region');
    }

    //短信测试页面
    public function test(){
        return $this->fetch();
    }
    //oy修改个人信息
    public function oy_update(){  
        return $this->fetch();
    }
    //登陆验证
    public function land(){
        return $this->fetch();
    }
    //忘记密码
    public function forget(){
        return $this->fetch();
    }
    //验证验证码
    public function vercode(){
        return $this->fetch();
    }
    //更改密码
    public function passup(){
        return $this->fetch();
    }

}