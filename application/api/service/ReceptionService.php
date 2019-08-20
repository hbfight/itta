<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/6/1
 * Time: 11:31
 */

namespace app\api\service;


use app\api\model\Order;
use app\api\model\RobbingInfo;
use app\api\model\User;
use app\api\validate\CodeService;
use app\api\validate\CodeValidate;
use app\api\validate\NumberCodeValidate;
use app\api\validate\PasswordValidate;
use app\api\validate\SubmitOrderValidate;
use app\lib\exception\ParameterException;
use app\lib\exception\SuccessMessage;
use think\Session;

class ReceptionService
{

        //用户注册步骤一
        public static function memberregister_o(){
            //用户名校验
           (new CodeValidate())->goCheck();
            if(request()->post('username') == session('phone')){
                //存储要注册的用户名
                $username = request()->post('username');
                session('username',$username);
                //清除验证码
                Session::delete('tel_code');
                return json([
                    "code" => 201,
                    "msg"  => "ok"
                ]);
            }else{
                return json([
                    'code' => 400,
                    'msg'  => "请该手机号先发送短信"
                ]);
            }
        }
        //用户注册步骤二
        public static function memberregister_t(){
            //密码校验
            $validate = new PasswordValidate();
            $validate->goCheck();
            $info = [];
            //获取要注册的信息
            $info =request()->param() ;
            $username = session('username');
            $info['username'] = $username;
            $info['password'] = md5($info['password']);
            //添加注册信息
            $result = User::insertUser($info);
            if(!$result){
                throw new ParameterException([
                    "code" => 400,
                    "msg"  => "服务器维护中，请稍后再试"
                ]);
            };
            return json(new SuccessMessage());
        }
        //获取所有时间段
        public static function getRobDate(){
            return RobbingInfo::getAllData();

        }
        //获取当天的时间段
        public static function getDateTimes(){
            $todayStart= strtotime(date('Y-m-d 00:00:00', time())); //2016-11-01 00:00:00
            $todayEnd= strtotime(date('Y-m-d 23:59:59', time())); //2016-11-01 23:59:59
            //$todayStart='1111';

            return RobbingInfo::getDateTime_m($todayStart,$todayEnd);
        }
        //改变商品抢购状态
        public static function StatusChange(){

//            if(!$_GET['timed']) exit();
            date_default_timezone_set("PRC");
            set_time_limit(0);//无限请求超时时间
//        $timed = $_GET['timed'];
            while (true) {
                sleep(1); // 休眠3秒，模拟处理业务等
                $time = time();
                $rob = new RobbingInfo();
                //判断抢购时间是否小于当前时间，小于当前时间将秒杀状态从3（即将开抢状态）改成2（已开抢状态）
                $result = $rob->where(["rob_time"=>['<=',$time],"is_status"=>['=',3]])->select()->toArray();
                if($result){
                    //抢购状态为2的转变1（已开抢状态）
                    $rob->where(["rob_time"=>['<=',$time],"is_status"=>['=',2]])->update(["is_status"=>1]);
                    //定义存贮要要抢购商品的id
                    $good_id = [];
                    foreach($result as $k=>$v){
                        array_push($good_id,$result[$k]['good_id']);
                    }
                    //将即将开抢商品状态改为2(正在抢购中)
                    $rob->where('good_id','in',$good_id)->update(["is_status"=>2]);

                    return json([
                        "code" =>201,
                        "msg"  =>"ok"
                    ]);
                }else{
                    // 模拟没有数据变化，将休眠 hold住连接
                    sleep(1);
                    exit();
                }
            }
        }
        //抢购中的状态
        public static function RobStart($time,$start,$page,$pagesize){
          return  RobbingInfo::getRobStart($time,$start,$page,$pagesize);
        }


        //获取抢购商品的详情信息
        public static function good_getails($id){
            $info = RobbingInfo::getOneInfo($id);
            $info['address'] = unserialize($info['address']);
            $info['address1'] = $info['address1'];
//             var_dump($info);exit;
            if($info['number'] <= 0){
                throw new ParameterException([
                    "code" =>402,
                    "msg"  =>"对不起，货品已抢完",
                ]);
            }
            return json([
                "code" => 201,
                "msg"  => "ok",
                "data" => $info
            ]);
        }

        //报单信息
        public static function SubmitOrder(){
            //数据校验
            $validate = new SubmitOrderValidate();
            $validate->goCheck();

            //获取需要提交的报单数据
            $info = request()->post();
            //获取订单用户名
            $username = session('username');

            $info['username'] = $username;

            //计算商品的预估结算金额和预估佣金
            $id = $info['good_id'];      //商品id
            $RobInfo = RobbingInfo::getField($id,'settle_price,price');
//            $info['commission_price'] = $RobInfo['settle_price'] - $RobInfo['price'];

            if($info['mode']=='0' || $info['mode']=='2'){
                //现货直邮和自己垫付
                $info['estimate_price'] = $info['quantity']*$RobInfo['settle_price'];
            }else{
                //货到付款
                $info['estimate_price'] = $info['quantity']*($RobInfo['settle_price'] - $RobInfo['price']);
            }
            //生成订单
            $result = Order::createOrderInfo($info);

            if(!$result){
                throw new ParameterException([
                    "code" => 402,
                    "msg"  => "系统维护中，请稍后再试"
                ]);
            }else{
                return json(new SuccessMessage());
            }
        }



        //订单明细
        public static function getOrderDetailed($page,$pagesize){
            $order = new Order();
            $username = session('username');

            $info = $order->with('robbing')->limit(($page-1)*$pagesize,$pagesize)->where('username','eq',$username)->select()->toArray();
//            dump($info);
//            exit;
            if(!$info){
                return json([
                    "code" => 201,
                    "msg"  =>'ok',
                    "data" =>'没有数据'
                ]);
            }
            return json([
                "code" => 201,
                "msg"  =>'ok',
                "data" =>$info
            ]);
        }
        //订单明细状态
        public static function getOrderDetailedStatus($status,$page,$pagesize){
            $order = new Order();
            $username = session('username');

            $info = $order->where(['username'=>$username,'is_status'=>$status])->select()->toArray();
            $total = count($info);
            $pages = ceil(($total/$pagesize));  //总页数
            if($page>$pages){
                return json([
                    "code" => 201,
                    "msg"  =>'ok',
                    "data" =>"没有数据啦"
                ]);
            }else{
                $shuju = $order->with('robbing')->limit(($page-1)*$pagesize,$pagesize)->where(['username'=>$username,'is_status'=>$status])->select()->toArray();

                if(!$shuju){
                    throw new ParameterException();
                }
                return json([
                    "code" => 201,
                    "msg"  =>'ok',
                    "data" =>$shuju
                ]);
            }

           
        }
        //获取个人订单总和数据
        public static function Peace(){
            $order = new Order();
            $username = session('username');
            $info = [];
            $info['estimate_price']=$order->where('username','eq',$username)->column('sum(estimate_price)');
            $info['actual_price']=$order->where('username','eq',$username)->column('sum(actual_price)');

            return json([
                "code" => 201,
                "msg"  =>'ok',
                "data" =>$info
            ]);
        }


}