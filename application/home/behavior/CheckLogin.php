<?php
namespace app\home\controller;
use traits\controller\Jump;
class CheckLogin
{
    //use引入Jump，就可以使得当前的类使用Jump trait里边的方法了
    //其中就有下边要使用的redirect()方法
    use Jump;
    /**
     * @param $params
     * 每个行为默认的执行方法run
     */
    public function run(&$params)
    {
        //判断用户是否登录系统
        if(!session('?username')){
            //没有登录系统,页面跳转到登陆页
            //定义登录后的会跳地址
            session('back_url',$params);
            $this -> redirect('login');
        }
    }
}