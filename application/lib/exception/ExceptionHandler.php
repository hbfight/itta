<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/21
 * Time: 10:52
 */

namespace app\lib\exception;

use think\Request;
use think\exception\Handle;

class ExceptionHandler extends Handle
{
    /**
     * $code、$msg 、$errorCode返回给客户端的信息
     */
    private $code;
    private $msg;
    private $errorCode;

    public function render(\Exception $e){
        //客户端行为错误抛出的异常:自定义的异常
        if($e instanceof BaseException){
            $this->code = $e->code;   //$e->code是从BaseException类中拿到的下面两个一样
            $this->msg = $e->msg;
            $this->errorCode = $e->errorCode;
        }else{
            //服务器自身异常（代码问题）
            if(config('app_debug')){
                return parent::render($e);
            }else{
                $this->code = 500;
                $this->msg = '服务器内部错误，不想告诉你';
                $this->errorCode = 999;
            }
        }

        $request = Request::instance();

        //定义成员数组
        $result = [
            'msg' => $this->msg,
            'error_code' => $this->errorCode,
            'request_url' => $request->url()
        ];
        return json($result, $this->code);
    }

}