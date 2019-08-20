<?php
namespace app\api\controller\v1;

use app\api\controller\BaseController;
use app\api\validate\PasswordValidate;
use app\api\model\User;


class Passup extends BaseController{
    public static function passup(){
        
        $info=request()->post();
        
        $validate=new PasswordValidate();
        $re=$validate->batch()->check($info);//验证是否满足密码相等
        
        if($re){
            $result=User::forget(request()->post('password'),session('phone'));
            
            if($result){
                return json([
                    "code"=>201,
                    "msg"=>"OK",
                    "data"=>'OK'
                ]);
            }else{
                return json([
                    "code"=>400,
                    "msg"=>"失败",
                    "data"=>'失败'
                ]);
            }
        }else{
            return json([
                "code"=>400,
                "msg"=>"失败",
                "data"=>'密码格式有误'
            ]);
        }



        
    }
}