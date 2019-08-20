<?php

namespace app\api\controller\v1;

use app\api\controller\BaseController;
use app\api\model\User;

class Land extends BaseController{
    static public function land(){
        $lang_name=$_POST['lang_name'];//接收的账号密码
        $lang_pass=$_POST['lang_pass'];

        $result=User::land($lang_name, $lang_pass);

        if($result){
            session('username',$lang_name);//存储用户的账号以便使用
            return json([
                "code"=>201,
                "msg"=>"OK",
                "data"=>$result
            ]);
        }else{
            return json([
                "code"=>400,
                "msg"=>"失败",
                "data"=>$result
            ]);
        }

    }
}