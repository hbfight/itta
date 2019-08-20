<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/6/1
 * Time: 10:48
 */

namespace app\api\controller\v1;


use app\api\controller\BaseController;
use app\api\model\RobbingInfo;
use app\api\model\User;
use app\api\service\ReceptionService;
use app\api\validate\CodeService;
use app\api\validate\NumberCodeValidate;
use app\api\validate\NumberValidate;
use app\api\validate\PasswordValidate;
use app\lib\exception\ParameterException;
use app\lib\exception\SuccessMessage;
use src\Send;
use think\Db;

class Reception extends BaseController
{
    //发送短信
    public function SendSms(){
        //检验用户账号
        (new NumberValidate())->goCheck();
        $send = new Send();

        $send->sms();
        //dump(session('phone'));

        return json([
            'code' => 201,
            'msg'  => 'ok'
        ]);
    }
    //用户注册步骤一
    public function MemberRegisterO(){
        return ReceptionService::memberregister_o();
    }

    //用户注册步骤二
    public function MemberRegisterT(){
        return ReceptionService::memberregister_t();
    }

    //获取商品的所有时间段
    public function getShopAllDate(){
        return ReceptionService::getRobDate();
    }
    public function getDateTime(){
       return ReceptionService::getDateTimes();
    }
    //商品的抢购状态转换
    public function Fast(){
        return ReceptionService::StatusChange();
    }
    public function ReRobStart($time,$start,$page,$pagesize){
        $info = ReceptionService::RobStart($time,$start,$page,$pagesize);

            return json([
                'code' => 201,
                'msg'  => "ok",
                'data' => $info
            ]);


    }
    public function GetNowTimeGoodInfo($time){

            return RobbingInfo::getNowtime($time);
    }
    //抢购
    public function RobShop($id){
        return ReceptionService::rob_shop($id);
    }

    //获取抢购商品的详情信息
    public function GoodDetails($id){
        return ReceptionService::good_getails($id);
    }
    //提交报单信息
    public function SubmitOrderInfo(){
        return ReceptionService::SubmitOrder();
    }
    //根据订单状态查询明细信息
    public function SubmitOrderStatus($status,$page,$pagesize){
        return ReceptionService::getOrderDetailedStatus($status,$page,$pagesize);
    }
    //订单明细
    public function OrderDetailed($page,$pagesize){
        return ReceptionService::getOrderDetailed($page,$pagesize);
    }
    //获取个人订单总和
    public function GetOrderPeace(){
        return ReceptionService::Peace();
    }

    public function getGoodName($good_id){
        $info = RobbingInfo::field('good_name,explain,rule')->where('good_id',$good_id)->find();
        if($info){
            $info['good_name'] = unserialize($info['good_name']);

        }else{
            throw new ParameterException();
        }

        return json([
            "code"=>201,
            "msg" =>"ok",
            "data"=>$info
        ]);



    }


}