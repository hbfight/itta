<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/21
 * Time: 10:14
 */

namespace app\api\model;


use think\Model;
use traits\model\SoftDelete;

class Manager extends Model
{
    use SoftDelete;
    //设置软删除对应的数据表"删除字段"
    protected $deleteTime = 'delete_time';
    public static function getManager($shuju){
           $result = self::where($shuju)->find();
           return $result;
    }

    //关联管理表和角色表
    public function role(){
         return  $this->hasOne('Role','role_id','role_id',['__MANAGER__'=>'m','__ROLE__'=>'r'],'join');

    }
}