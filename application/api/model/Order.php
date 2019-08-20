<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/27
 * Time: 17:41
 */

namespace app\api\model;


use app\lib\exception\ParameterException;
use think\Model;
use traits\model\SoftDelete;

class Order extends Model
{
    use SoftDelete;
    protected $deleteTime = "delete_time";

    public function user(){
        return $this->hasOne('User','username','username');
    }
    public function robbing(){
        return $this->hasOne('RobbingInfo','good_id','good_id');
    }

    //获取报单信息列表
    public static function getOrderInfo($sort,$page,$pagesize){
       $info = self::with('user')->limit(($page-1)*$pagesize,$pagesize)
            ->order("create_time $sort")
            ->select();
       $arr = [];
       foreach($info as $k=>$v){
           $arr[$k] = $v->toArray();
       }
        // dump($arr);
        // exit;
       return $arr;
    }

    //获取一条报单信息
    public static function getOneInfo($id){

        return self::get($id);
    }

    //添加报单信息
    public static function createOrderInfo($info){
        return self::create($info);
    }
    //更新结算数据
    public static function addSettlement($info,$id){
        return self::where(['id'=>$id])->update($info);
    }
    //撤回结算
    public static function delSettlement($id){

        return self::update(['id'=>$id,'actual_price'=>'0.00','is_status'=>'1']);
    }
    //取消报单
    public static function cancel($id){
        $business_rm = request()->param();
        return  self::update(['id'=>$id,'business_rm'=>$business_rm['business_rm'],'is_status'=>'3']);
    }


    //根据预估结算金额进行排序
    public static function sortQuery($lookup,$page,$pagesize){
        if($lookup == "default"){
            $data = self::with('robbing')->limit(($page-1)*$pagesize,$pagesize)
                ->order('create_time desc')
                ->select();
            $arr =[];
            foreach ($data as $k=>$v){
                $arr[$k] = $v->toArray();
            }
        }else {
            $info = self::with('robbing')->limit(($page - 1) * $pagesize, $pagesize)->order("$lookup desc")
                ->select();
            $arr = [];
            foreach ($info as $k => $v) {
                $arr[$k] = $v->toArray();
            }
        }

            return $arr;
    }

    //根据预估结算金额进行排序
    public static function sortQuery1($lookup,$page,$pagesize,$good_id,$condition){
        if($condition == 1){
            if($lookup == "default"){
                $data = self::with('robbing')->limit(($page-1)*$pagesize,$pagesize)
                    ->where('good_id',$good_id)
                    ->order('create_time desc')
                    ->select();
                $arr =[];
                foreach ($data as $k=>$v){
                    $arr[$k] = $v->toArray();
                }
            }else {
                $info = self::with('robbing')->limit(($page - 1) * $pagesize, $pagesize)->order("$lookup desc")
                    ->where('good_id',$good_id)
                    ->select();
                $arr = [];
                foreach ($info as $k => $v) {
                    $arr[$k] = $v->toArray();
                }
            }
        }elseif($condition == 2){
            if($lookup == "default"){
                $data = self::with('robbing')->limit(($page-1)*$pagesize,$pagesize)
                    ->where('username',$good_id)
                    ->order('create_time desc')
                    ->select();
                $arr =[];
                foreach ($data as $k=>$v){
                    $arr[$k] = $v->toArray();
                }
            }else {
                $info = self::with('robbing')->limit(($page - 1) * $pagesize, $pagesize)->order("$lookup desc")
                    ->where('username',$good_id)
                    ->select();
                $arr = [];
                foreach ($info as $k => $v) {
                    $arr[$k] = $v->toArray();
                }
            }
        }else{
            throw new ParameterException();
        }


            return $arr;
    }
    //根据结算状态进行筛查
    public static function OrderIs_statusQuery($lookup,$page,$pagesize){
        if($lookup == '4'){
            $data = self::limit(($page-1)*$pagesize,$pagesize)
                ->order('create_time desc')
                ->select();
            $arr =[];
            foreach ($data as $k=>$v){
                $arr[$k] = $v->toArray();
            }
        }else{
            $info = self::with('robbing')->where('is_status','eq',$lookup)->limit(($page-1)*$pagesize,$pagesize)->order("$lookup desc")
                ->select();
            $arr =[];
            foreach ($info as $k=>$v){
                $arr[$k] = $v->toArray();
            }
        }

        return $arr;
    }
    //根据结算状态进行筛查
    public static function OrderIs_statusQuery1($lookup,$page,$pagesize,$good_id,$condition){
        if($condition == 1){
            if($lookup == '4'){
                $data = self::limit(($page-1)*$pagesize,$pagesize,$good_id)
                    ->where('good_id',$good_id)
                    ->order('create_time desc')
                    ->select();
                $arr =[];
                foreach ($data as $k=>$v){
                    $arr[$k] = $v->toArray();
                }
            }else{
                $info = self::with('robbing')->where('is_status','eq',$lookup)->limit(($page-1)*$pagesize,$pagesize)
                    ->where('good_id',$good_id)
                    ->order("$lookup desc")
                    ->select();
                $arr =[];
                foreach ($info as $k=>$v){
                    $arr[$k] = $v->toArray();
                }
            }
        }elseif($condition == 2){
            if($lookup == '4'){
                $data = self::limit(($page-1)*$pagesize,$pagesize,$good_id)
                    ->where('username',$good_id)
                    ->order('create_time desc')
                    ->select();
                $arr =[];
                foreach ($data as $k=>$v){
                    $arr[$k] = $v->toArray();
                }
            }else{
                $info = self::with('robbing')->where('is_status','eq',$lookup)->limit(($page-1)*$pagesize,$pagesize)
                    ->where('username',$good_id)
                    ->order("$lookup desc")
                    ->select();
                $arr =[];
                foreach ($info as $k=>$v){
                    $arr[$k] = $v->toArray();
                }
            }
        }else{
            throw new ParameterException();
        }


        return $arr;
    }

    //全部筛查（默认创建时间倒叙排序）
    public static function defaultOrderSort($page,$pagesize){
        $info = self::with('robbinginfo')->limit(($page-1)*$pagesize,$pagesize)
            ->order("create_time desc")
            ->select();
        $arr = [];
        foreach($info as $k=>$v){
            $arr[$k] = $v->toArray();
        }
        return $arr;
    }

    public function getIs_status(){

    }













}