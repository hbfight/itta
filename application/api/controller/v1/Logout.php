<?php
namespace app\api\controller\v1;

use app\api\controller\BaseController;
use think\Session;
class Logout extends BaseController{
    static public function logout(){//注销登陆(只需要清除session账号)
        
        Session::delete('username');//清除账号

        if(!session::has('username')){
            return json([
                "code" => 201,
                "msg"  => "ok"
            ]);
        }else{
            return json([
                "code" => 400,
                "msg"  => "失败"
            ]);
        }
    }
}