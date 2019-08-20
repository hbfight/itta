<?php
namespace app\api\controller\v1;
use app\api\controller\BaseController;
use app\api\model\Oyupdate;
use app\api\model\User;

class Phone extends BaseController{
    public function Phone(){
        if(session('username')==""){//手机号存在与否
            return json([
                'code'=>400,
                'msg'=>'手机号不存在'
            ]);
        }else{
            $username=session('username');//拿出存在服务器的手机号
            return json([
                'code'=>201,
                'msg'=>'OK',
                'data'=>$username
            ]);
        }
    }
    
    public function select_adds(){//查询个人地址信息

        $request=User::select_add();
        return json([
            'code'=>201,
            'msg'=>'OK',
            'data'=>$request
        ]);
    }
    
    public function select_alipays(){//查询个人支付宝信息
        $request=User::select_alipay();
        return json([
            'code'=>201,
            'msg'=>'OK',
            'data'=>$request
        ]);
    }
    
}