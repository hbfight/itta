<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/30
 * Time: 10:33
 */

namespace app\api\service;


use app\api\model\User;

class UserInfoService
{
    //根据结算状态和预估结算金额进行排序查询
    public static function sortQuery($lookup,$page,$pagesize){

        $user = new User();
        //根据预估结算金额进行排序查询

        if(self::is_status($lookup)){

            return $user->UserIs_statusQuery($lookup,$page,$pagesize);
        }
//        elseif($lookup == 'username')
//        {
//            return $user->UserScreenQuery($lookup,$page,$pagesize);
//        }
//        elseif($lookup == 'payment_ac')
//        {
//            return $user->sortQuery($lookup,$page,$pagesize);
//        }
//        elseif(self::is_status($lookup))
//        {
//            //默认全部筛查
//            if($lookup == '3'){
//                return $user->defaultUserSort($page,$pagesize);
//
//            }else{
//                //根据结算状态进行筛查
//                return $user->UserIs_statusQuery($lookup,$page,$pagesize);
//            }
//
//        }
    }


    public static function ScreenQuery($lookup,$number){
            $user = new User();
            if($lookup == 'username'){

                return $user::getUsername($lookup,$number);
            }elseif($lookup == 'receipt'){
                return $user::getUsername($lookup,$number);
            }
    }

    //判断填写的参数是否存在type数组中
    private static function is_status($str){
        //1已结算   2未结算
        $type = array( "1", "4");
        if(in_array($str,$type)){
            return true;
        }else{
            return false;
        }
    }
}