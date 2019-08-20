<?php

namespace app\api\controller\v1;

use app\api\controller\BaseController;
use app\api\validate\AddValidate;
use think\Request;
use app\api\model\User;
use app\api\model\RobbingInfo;
use app\api\validate\BaseValidate;
use app\api\validate\PasswordValidate;
class Oyupdate extends BaseController{
    
    public function pro_up($text1,$text2){//修改个人联系姓名和地址
        
            $text1=$_POST['text1'];//接收表单中的传值
            $text2=$_POST['text2']; 
            
            $info=request()->post();
            
            
            $validate = new AddValidate();
            $result = $validate->batch()->check($info);//传值进行验证
            
            if($result){
            
            $result=User::perupdate($text1,$text2);//调取模型进行操作

        if(!$result){
            return json([//失败返回json
                "code"=>400,
                "msg"=>"失败",
                "data"=>$result
            ]);
        }else{
            return json([//成功返回json
                "code"=>201,
                "msg"=>"OK",
                "data"=>$result
            ]);
        }
            }else{
                return json([//失败返回json
                    "code"=>400,
                    "msg"=>"失败",
                    "data"=>$result
                ]);
            }
        
    }
    
    public function add_up($text3,$text4){

        $text3=$_POST['text3'];//接收表单中的传值
        $text4=$_POST['text4'];

        $info=request()->post();//验证器
        $a=array('text1'=>$text3,'text2'=>$text4);
        $validate = new AddValidate();
        $result = $validate->batch()->check($a);//传值进行验证

        if($result){

                $result=User::upadd($text3,$text4);//调取模型进行操作
                if(!$result){
                    return json([//失败返回json
                        "code"=>400,
                        "msg"=>"失败",
                        "data"=>$result
                    ]);
                }else{
                    return json([//成功返回json
                        "code"=>201,
                        "msg"=>"OK",
                        "data"=>$result
                    ]);
                }  
        }else{

            return json([//失败返回json
                "code"=>400,
                "msg"=>"失败",
                "data"=>$result
            ]);
        }
        
        
        
    }
    
    //后台会员管理编辑-查询信息  
    public function edit_member($user_id,$actual_price,$estimate_price){
        $user_id=$_GET['user_id'][0];
        //$user_id=33;
        $User=new User();
        $result=$User->edit_member($user_id);
        return json([
            "code"=>201,
            "msg"=>"OK",
            "data"=>$result
        ]);
    }
    //后台会员管理编辑-修改支付宝姓名  支付宝账号
    public function edit($user_id){
        $res=request()->post();
        $user_id=$res['user_id'][0];//获取id
        $receipt_name=$res['receipt_name'];
        $payment_ac=$res['payment_ac'];
        $password=$res['password'];
        $password1=$res['password1'];
        if(!empty($password) || !empty($password1)){
            $data=array('password'=>$password,'password2'=>$password1);//验证器
            $validate=new PasswordValidate();
            $re=$validate->check($data);
            if(!$re){
                return json([//失败返回json
                    "code"=>400,
                    "msg"=>"密码格式有误",
                    "data"=>$re
                ]);
            }
        }
        $User=new User();
        $result=$User->edit($user_id,$receipt_name,$payment_ac,$password,$password1);
                return json([//成功返回json
                    "code"=>201,
                    "msg"=>"OK",
                    "data"=>$result
                ]);
    }
    //报单开关
    public function de_switch($id){
        $RobbingInfo=new RobbingInfo();
        $result=$RobbingInfo->declaration($id);//返回declaration状态
        $declaration=$result;
        if($result==0){//等于0则改为1
            $res=$RobbingInfo->modify_order($id,$declaration);
            return json([//失败返回json
                "code"=>201,
                "msg"=>"OK",
                "data"=>"取消报单"
            ]);
        }else{
            $res=$RobbingInfo->modify_order($id,$declaration);
            return json([//失败返回json
                "code"=>201,
                "msg"=>"OK",
                "data"=>"开启报单"
            ]);
        }
    }
    
}