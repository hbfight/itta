<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/28
 * Time: 10:18
 */

namespace app\api\controller\v1;


use app\api\controller\BaseController;
use app\api\model\Order;
use app\api\model\User;
use app\api\service\UserInfoService;
use app\api\validate\SettlementVal;
use app\lib\exception\ParameterException;
use app\lib\exception\SuccessMessage;


class Uservip extends BaseController
{
        public static function UserListInfo($page,$pagesize){
            //获取报单信息
            $result = User::getUserInfo($page,$pagesize);

//            dump($result['0']['order']['0']['is_status']);
//            exit;
//            dump($result);
//            exit;
            //总条数
            $total_number = User::count();
            //总页数
            $total_page=ceil($total_number/$pagesize);
            if(!$result){
                json([
                    'code'=>201,
                    'msg'=>'没有数据',
                    'data'=>''
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




        //单个用户的所有保单信息
        public function user_Order_Info($username,$page,$pagesize){
            $info = Order::limit(($page-1)*$pagesize,$pagesize)->where('username','eq',$username)->select()->toArray();

            $total_number = count($info);

            $total_page=ceil($total_number/$pagesize);

            if (empty($info)){
                return json([
                    "code" => 201,
                    "msg"  => '没有数据'
                ]);
            }
            return json([
                "code" => 201,
                "msg"  => 'ok',
                "data" => $info,
                "total_number" => $total_number,
                "total_page"   => $total_page


            ]);
        }
        public function delUser($user_id,User $user){
            $result = $user::destroy($user_id);
            if(!$result){
                throw new ParameterException();
            }
            return json([
                'code' => 201,
                'msg'  => '删除成功'
            ]);
        }



    //根据结算状态和预估结算金额进行排序查询
    public function UserSortQuery($lookup,$page,$pagesize){

        $info = UserInfoService::sortQuery($lookup,$page,$pagesize);
        //分页总条数和总页数
        if($lookup == '4'){

            $total_number = User::count();
        }else{
            $total_number = count($info);
        }

        $total_page=ceil($total_number/$pagesize);

        return json([
            "code" => 201,
            "msg"  => 'ok',
            "data" => $info,
            "total_number" => $total_number,
            "total_page"   => $total_page,
        ]);
    }

    public function UserScreenQuery($lookup,$number){
        $info = UserInfoService::ScreenQuery($lookup,$number);

        return json([
            "code" => 201,
            "msg"  => 'ok',
            "data" => $info,

        ]);
    }



}