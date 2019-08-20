<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/21
 * Time: 12:13
 */

namespace app\api\service;


use app\api\model\Manager as ManagerModel;
use app\api\model\Permission;
//后台Backstage
class Backstage
{
    //管理员登录
    public static function index(){
        //获得管理员

        $admin   = session('admin');

        //判断是否是超级管理员admin，是admin就获得全部权限
        if($admin['mg_name']==='admin'){
            //获得全部权限
            $ps_infoA = Permission::where('ps_level','0')->select();
            $ps_infoB =Permission::where('ps_level','1')->select();
        } else{
            //获得管理员角色
            //获得管理员角色对应的操作权限的id信息
            $ps_ids = ManagerModel::alias('m')
                ->join('__ROLE__ r','m.role_id=r.role_id')
                ->where('m.mg_id',$mg_id)
                ->value('r.role_ps_ids');

            //根据"权限id"信息获得权限的详细信息(1、2级分别获取)
            $ps_infoA = Permission::where('ps_id','in',$ps_ids)
                ->where('ps_level','0')
                ->select();

            $ps_infoB =Permission::where('ps_id','in',$ps_ids)
                ->where('ps_level','1')
                ->select();
        }

        return [
            'code' => 201,
            'msg'  => 'ok',
            'data' => ['ps_infoA'=>$ps_infoA,'ps_infoB'=>$ps_infoB]
        ];
    }
}