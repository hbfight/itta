<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/29
 * Time: 0:58
 */

namespace app\api\service;


use app\api\model\RobbingInfo;

class ShopInfoService
{
    /**
     * @param $lookup   需要查找的字段信息   lookup有四个状态值，两个时间格式的拼接，以逗号拼接、number、settle_price、
     * @param $page     分页
     * @param $pagesize 每页条数
     * @return array
     */
    public static function getSearchInfo($lookup,$page,$pagesize){

        $robbinginfo = new RobbingInfo();

        if(strlen($lookup)==21){    //根据时间格式进行判断，两个时间段拼接在一起长度为21
            //date_default_timezone_set("Asia/Shanghai");
            $lookup = explode(",",$lookup);

            $start = $lookup['0'];
            $end = $lookup['1'];
            return $robbinginfo->getTime($start,$end,$page,$pagesize);
        }elseif($lookup == "default"){
            return $robbinginfo->getLikeInfo($lookup,$page,$pagesize);
        }
        elseif($lookup == "number") //根据报单数量进行排序查询
        {
            return $robbinginfo->getLikeInfo($lookup,$page,$pagesize);
        }
        elseif($lookup == "settle_price")//根据预估金额进行排序查询
        {
            return $robbinginfo->getLikeInfo($lookup,$page,$pagesize);
        }
        elseif(self::type($lookup))      //根据店名进行搜索查询
        {
            return $robbinginfo->queryStoreName($lookup,$page,$pagesize);
        }
    }

    private static function type($str){
        $type = array( "1", "2", "3","4");
        if(in_array($str,$type)){
            return true;
        }else{
            return false;
        }
    }
}