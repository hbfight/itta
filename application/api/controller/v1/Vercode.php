<?php
namespace app\api\controller\v1;

use app\api\controller\BaseController;

class Vercode extends BaseController{
    
    static public function vercode(){
            $for=request()->post('code');
            $forpass=request()->post('username');
            if($for==session('tel_code')&&$forpass==session('username')){//判断验证码是否正确 和获取验证码的设计号是否一致
                session('tel_code', null);//判断成功后清除短信session
                return json([  
                    "code"=>201,
                    "msg"=>"OK",
                    "data"=>'OK'  
                ]);  
            }else{
                return json([
                    "code"=>400,
                    "msg"=>"失败"
                ]);
            }
         
    }
}