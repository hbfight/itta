<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/28
 * Time: 10:42
 */

namespace app\api\model;


use app\api\controller\v1\Uservip;
use think\Model;
use traits\model\SoftDelete;

class User extends Model
{
    use SoftDelete;
    protected $deleteTime = 'delete_time';

    public static function invoke()
    {
        $id = request()->param('user_id');
        return self::get($id);
    }

    //获取会员用户信息
    public static function getUserInfo($page,$pagesize){
        $info = self::with('order')->limit(($page-1)*$pagesize,$pagesize)
            ->order('create_time desc')
            ->select();


        $arr = [];
        foreach($info as $k=>$v){
            $arr[$k] = $v->toArray();
        }
//        dump($info);
//        exit;
        return $arr;
    }
    public function order(){
        return $this->hasMany('Order','username','username');
    }


    //根据结算状态进行筛查
    public static function UserIs_statusQuery($lookup,$page,$pagesize){


        if($lookup == '4'){

            $info = self::with('order')->limit(($page-1)*$pagesize,$pagesize)
                ->order('create_time desc')
                ->select();

            $arr = [];
            foreach($info as $k=>$v){
                $arr[$k] = $v->toArray();
            }
            return $arr;
        }else{
            $info = self::with(['order'=>function($query) use($lookup){
                    $query->where('is_status','eq',$lookup);
                    }])
                    ->select();

            //$arr用来存放数组对象集合
            $arr = [];
            //用来存储order不为空
            $arrs = [];
            foreach($info as $k=>$v){
                $arr[$k] = $v->toArray();
            }

            for($i=0;$i<count($arr);$i++){
                if(count($arr[$i]['order'])){
                    array_push($arrs,$arr[$i]);
                }
            }

            return $arrs;
        }

    }

    public static function getUsername($lookup,$number){
        $info = self::with('order')->where($lookup,'eq',$number)->order('create_time desc')->find();
        return $info;

    }

    //筛选查询
    public static function UserScreenQuery($lookup,$page,$pagesize){
        dump($lookup);
        exit;
        $info = self::with('order')->order('create_time desc')->where('username','eq',$lookup)->find();

        dump($info);
        exit;
        return $arr;
    }

    //添加会员
    public static function insertUser($info){
        $user = new User($info);
        return $user->allowField(['username','password'])->save();
    }
    
    /**************************************************************/
    //登陆
    public static function land($name,$pass){
        $pass=md5($pass);//对用户密码进行md加密
        $info= self::where(array("username"=>$name,"password"=>$pass))->find();
        return $info;
    }

    //判断是否注册
    public static function pdzc($name){
        $re=self::where('username',$name)->find();
        return $re;
    }
    //修改个人信息姓名地址
    public static function perupdate($text1,$text2){
        $username=session('username');//取出登陆人的手机号
        $info = self::where('username',$username)->update(array('address_name'=>$text1,'user_address'=>$text2));
        return $info;
    }
    //修改个人支付宝信息
    public  static function upadd($text3,$text4){
        $username=session('username'); 
        $info = self::where('username',$username)->update(array('receipt_name'=>$text3,'payment_ac'=>$text4));   
        return $info;
    }
    //验证修改密码是否相等
    public static function forget($pass,$name){
        $pass=md5($pass);
        $re=db('user')->where('username',$name)->setField('password',$pass);
        return $pass;
    }
    //查询个人姓名地址
    public static function select_add(){
        $username=self::where('username',session('username'))->select();
        $address_name=$username[0]['address_name'];
        $user_address=$username[0]['user_address'];
        
        $slect_in=array(0=>$address_name,1=>$user_address);
        
        return $slect_in;
    }
    //查询个人支付宝信息
    public static function select_alipay(){
        $username=self::where('username',session('username'))->select();
        $alipay_name=$username[0]['receipt_name'];
        $alipay_address=$username[0]['payment_ac'];
        
        $slect_Alipay=array(0=>$alipay_name,1=>$alipay_address);
        
        return $slect_Alipay;
    }
    //会员编辑查询
    public static function edit_member($user_id){
        $information=self::where(['user_id'=>$user_id])->select();
        return $information;
    }
    //会员编辑修改支付宝信息
    public static function edit($user_id,$receipt_name,$payment_ac,$password,$password1){
        if(!empty($password)){
            $edit=self::where(['user_id'=>$user_id])->update(array('receipt_name'=>$receipt_name,'payment_ac'=>$payment_ac,'password'=>md5($password)));
            return $edit;
        }else{
            $edit=self::where(['user_id'=>$user_id])->update(array('receipt_name'=>$receipt_name,'payment_ac'=>$payment_ac));
            return $edit;
        }
    }
}