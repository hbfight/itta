<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/25
 * Time: 12:08
 */

namespace app\api\model;


use think\Model;
use traits\model\SoftDelete;

class Address extends Model
{
    use SoftDelete;
    protected $deleteTime = 'delete_time';

    protected $hidden = ['delete_time'];
    //添加地址
    public static function createAddress($info){
            $res=self::create($info);
            if($res){
                return 1;
            }else{
                return 0;
            }
            
    }

    //获取下单列表地址10条地址信息
    public static function getAddressList($page,$pagesize){
        $data = self::limit(($page-1)*$pagesize,$pagesize)->order('id','asc')->select();
        $arr = [];
        foreach ($data as $k=>$v){
            $arr[$k] = $v->toArray();
        }
        return $arr;
    }


}