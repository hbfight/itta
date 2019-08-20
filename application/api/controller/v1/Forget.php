<?php
namespace app\api\controller\v1;
use app\api\controller\BaseController;
use src\Send;//引入短信接口
use think\Request;
use app\api\validate\Phovalidate;
use app\api\model\User;

class Forget extends BaseController{
        public function forget(){
        $info = request()->post();//获取页面传过来的值
        $validate = new Phovalidate();
        $result = $validate->batch()->check($info);//传值进行验证
        if($result){
            $result=User::pdzc($_POST['username']);//调用模型判断是否注册
             if($result){
                 session('username',$_POST['username']);
                 $send = new Send();//调用短信接口
                 $send->sms();
                 return json([
                     "code"=>201,
                     "msg"=>"ok"
                 ]);
             }else{
                 return json([
                     "code"=>400,
                     "msg"=>"手机未注册"
                 ]);
             }
        }else{
            return json([
                "code"=>400,
                "msg"=>"手机格式输入有误"
            ]);
        }
    }
}