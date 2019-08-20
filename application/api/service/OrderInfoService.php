<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/29
 * Time: 22:57
 */

namespace app\api\service;


use app\api\model\Order;

class OrderInfoService
{
    /**
     * @param $lookup   需要查找的字段信息:lookup参数可是3中值:estimate_price、quantity,1~4
     * @param $page     分页
     * @param $pagesize 每页条数
     * @return array
     */
   //根据结算状态和预估结算金额进行排序查询
    public static function sortQuery($lookup,$page,$pagesize){

        $order = new Order();

        //根据预估结算金额进行排序查询
        if($lookup=='estimate_price'){

            return $order->sortQuery($lookup,$page,$pagesize);
        }elseif($lookup == "default"){
            return $order->sortQuery($lookup,$page,$pagesize);
        }
        elseif(self::is_status($lookup))
        {

                return $order->OrderIs_statusQuery($lookup,$page,$pagesize);
        }
    }

    //根据结算状态和预估结算金额进行排序查询
    public static function sortQuery1($lookup,$page,$pagesize,$good_id,$condition){

        $order = new Order();

        //根据预估结算金额进行排序查询
        if($lookup=='estimate_price'){

            return $order->sortQuery1($lookup,$page,$pagesize,$good_id,$condition);
        }elseif($lookup == "default"){
            return $order->sortQuery1($lookup,$page,$pagesize,$good_id,$condition);
        }
        elseif(self::is_status($lookup))
        {

            return $order->OrderIs_statusQuery1($lookup,$page,$pagesize,$good_id,$condition);
        }
    }

    //判断填写的参数是否存在type数组中
    private static function is_status($str){
        $type = array( "1", "2", "3","4");
        if(in_array($str,$type)){
            return true;
        }else{
            return false;
        }
    }
}