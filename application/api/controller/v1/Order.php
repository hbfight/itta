<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/27
 * Time: 17:10
 */

namespace app\api\controller\v1;


use app\api\controller\BaseController;
use app\api\service\OrderInfoService;
use app\api\validate\OrderInfo;
use app\api\model\Order as OrderModel;
use app\api\validate\SettlementVal;
use app\lib\exception\ParameterException;
use app\lib\exception\SuccessMessage;

class Order extends BaseController
{

    //报单信息列表
    public function OrderList($sort,$page,$pagesize){
            //获取报单信息
            $result = OrderModel::getOrderInfo($sort,$page,$pagesize);
            $total_number = OrderModel::count();
            $total_page=ceil($total_number/$pagesize);
            if(!$result){
               throw new ParameterException([
                   "msg"=>"获取失败"
               ]);
            }
            return json([
                "code" => "201",
                "msg"  => "ok",
                "data" => $result,
                "total_number" => $total_number,
                "total_page"   => $total_page
            ]);
    }

    //根据结算状态和预估结算金额进行排序查询
    public function orderSortQuery($lookup,$page,$pagesize){

        //如果状态是1，则获取所有信息的条数
        if($lookup=='4'){
            $info1=OrderModel::select();
        }elseif($lookup == 'default'){
            $info1=OrderModel::order('create_time desc')
                ->select();
        }elseif($lookup == 'estimate_price'){
            $info1=OrderModel::order('estimate_price desc')
                ->select();
        }else{
            $info1=OrderModel::where('is_status','eq',$lookup)
                ->select();
        }

        $info = OrderInfoService::sortQuery($lookup,$page,$pagesize);
        //分页总条数和总页数
        $total_number = count($info1);
        $total_page=ceil($total_number/$pagesize);

        return json([
            "code" => 201,
            "msg"  => 'ok',
            "data" => $info,
            "total_number" => $total_number,
            "total_page"   => $total_page,
        ]);
    }


    //生成报单信息
    public function placeOrder(){
        //数据校验
        $validate = new OrderInfo();
        $validate->goCheck();
        //获取表单信息
        $info = $validate->getDataByRule(input('post.'));
        $username = session('username');

        //添加报单信息
        $result = OrderModel::createOrderInfo($info);
        if(!$result){
            throw new ParameterException([
                "msg" => "提交报单失败，请确认参数"
            ]);
        }
        return json((new SuccessMessage()));
    }


    //获取一条报单信息
    public function getOneOrder($id){
        $result = OrderModel::getOneInfo($id);
        if(!$result){
            throw new ParameterException();
        }
        return json([
            "code" => 201,
            "msg"  => "ok",
            "data" => $result
        ]);
    }

    //结算
    public function settlement(){
        //数据验证
        $validate = new SettlementVal();
        $validate->goCheck();
        //获取提交数据
        $info = $validate->getDataByRule(input('post.'));
        //结算状态
        $info['is_status'] = '2';

        $result = OrderModel::addSettlement($info,$info['id']);
        if (!$result){
            throw new ParameterException();
        }
        return json(new SuccessMessage());

    }
    //取消结算
    public function cancel($id,$status){
        //商家备注填更新
        if(request()->isPost()){

            if($status == "chexiao"){ //撤销

                $result = OrderModel::delSettlement($id);
            }elseif($status == "quxiao"){//取消
                $result = OrderModel::cancel($id);

            }
        }

        if(!$result){
            throw new ParameterException();
        }
        return json(new SuccessMessage());
    }





}