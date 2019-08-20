<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/23
 * Time: 20:01
 */

namespace app\api\controller\v1;


use app\api\controller\BaseController;
use app\api\model\Address;
use app\api\model\RobbingInfo;
use app\api\service\OrderInfoService;
use app\api\service\ShopInfoService;
use app\api\validate\AddAddressRule;
use app\api\validate\ShopAddInfo;
use app\lib\exception\ParameterException;
use app\lib\exception\SuccessMessage;
use app\api\model\Order as OrderModel;

use lib\Upload;



class Shopinfo extends BaseController
{
    //抢购信息列表
    public function shopList($page,$pagesize){

        header('Access-Control-Allow-Origin:*');
        //获取抢购信息
        $info = RobbingInfo::getShopInfo($page,$pagesize);
        
        //分页总条数和总页数
        $total_number = RobbingInfo::count();

        $total_page=ceil($total_number/$pagesize);
        return json([
                "code" => 201,
                "msg"  => 'ok',
                "data" => $info,
                "total_number" => $total_number,
                "total_page"   => $total_page
        ]);
    }
    //单个商品订单列表
    public function robDetails($id,$page,$pagesize){

        $info = OrderModel::limit(($page-1)*$pagesize,$pagesize)->where('good_id','eq',$id)->select()->toArray();
        //分页总条数和总页数
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

    //根据结算状态和预估结算金额进行排序查询
    public function RobSortQuery($lookup,$page,$pagesize,$good_id,$condition){

        //如果状态是1，则获取所有信息的条数
        if($lookup=='4'){
            $info1=OrderModel::select();
        }elseif($lookup == 'default'){
            $info1=OrderModel::order('create_time desc')
                ->select();
        }elseif($lookup == 'estimate_price'){
            $info1=OrderModel::order('estimate_price desc')
                ->select();
        }else{
            $info1=OrderModel::where('is_status','eq',$lookup)
                ->select();
        }

        $info = OrderInfoService::sortQuery1($lookup,$page,$pagesize,$good_id,$condition);
//        dump($info);
//        exit;
        //分页总条数和总页数
        $total_number = count($info);
        $total_page=ceil($total_number/$pagesize);

        return json([
            "code" => 201,
            "msg"  => 'ok',
            "data" => $info,
            "total_number" => $total_number,
            "total_page"   => $total_page,
        ]);
    }

    //删除抢购商品信息
    public function delRob(RobbingInfo $robbingInfo,$good_id){
     $result = $robbingInfo::ro_de($good_id);
     if(!$result){
        throw new ParameterException();
     }
     return json([
         'code' => 201,
         'msg'  => '删除成功'
     ]);
    }
    //抢购列表信息检索查询
    public function searchQuery($lookup,$page,$pagesize){
        //如果状态是1，则获取所有信息的条数
        if($lookup=='4'){
            $info1=RobbingInfo::select();
        }elseif(strlen($lookup) == 21){


            $start = substr($lookup,0,strrpos($lookup,','));

            $end = substr($lookup,11,strrpos($lookup,','));
            $info1=RobbingInfo::where('rob_time',['>=',$start],['<=',$end])->select();
        }
        elseif($lookup == 'default'){
            $info1=RobbingInfo::order('create_time desc')
                ->select();
        }elseif($lookup == 'number'){
            $info1=RobbingInfo::order('number desc')
                ->select();
        }elseif($lookup == 'settle_price'){
            $info1=RobbingInfo::order('settle_price desc')
                ->select();
        }else{
            $info1=RobbingInfo::where('store_name','eq',$lookup)
                ->select();
        }
        $info = ShopInfoService::getSearchInfo($lookup,$page,$pagesize);

            //分页总条数和总页数
            $total_number = count($info1);
            $total_page=ceil($total_number/$pagesize);
            return json([
                "code" => 201,
                "msg"  => 'ok',
                "data" => $info,
                "total_number" => $total_number,
                "total_page"   => $total_page
            ]);
    }
    public function checkDateTime($data){
        if(date('Y-m-d',strtotime($data)) == $data){
            return true;
        }else{
            return false;
        }
    }

    public function type($str){
            $info = ['0','1','2','3','4','5'];
            if(is_array($str,$info)){
                return true;
            }else{
                return false;
            }
    }

    //图片上传
    public function imgUpload(){
        header('content-type:text/html;charset=utf-8');

        $upload = new Upload('myfile','uplodas');
        $dest=$upload->uploadFile();
        if(!$dest){
            throw new ParameterException([
                'msg' =>'图片上传失败'
            ]);
        }
        return json(['code'=>201,'msg'=>'ok','data'=>$dest]);
    }


    //添加抢购信息
    public function shopAdd(){
        //数据验证
        $validate = new ShopAddInfo();
        $validate->goCheck();
        //获取post上传的数据
        $info = $validate->getDataByRule(input('post.'));
        $address1=strstr($info['address'][0],'-');
        $info['address1']=substr($address1,1);
        $info['address'][0]=strstr($info['address'][0],'-',true);
        $info['address'] = serialize($info['address']);
        $info['good_name'] = serialize($info['good_name']);
        $info['rob_time'] = strtotime($info['rob_time']);
        $info['num'] = $info['number'];
        //添加数据
        $result = RobbingInfo::add($info);


        if(!$result){
            throw new ParameterException([
                'msg'=>"数据添加失败",
            ]);
        }
        return json((new SuccessMessage()));
    }
    //修改抢购信息
    public function shopEdit($id){
        //数据验证
        $validate = new ShopAddInfo();
        $validate->goCheck();
        //获取post上传的数据
        $info = $validate->getDataByRule(input('post.'));
        $address1=strstr($info['address'][0],'-');
        $info['address'][0]=strstr($info['address'][0],'-',true);
        $address1=substr($address1,1);
        $info['address'] = serialize($info['address']);
        $info['address1']=$address1;
        $info['good_name'] = serialize($info['good_name']);
        $info['rob_time'] = strtotime($info['rob_time']);
//        dump($info);
//        exit;

        //添加数据
        $result = RobbingInfo::updateOneInfo($id,$info);
        if(!$result){
            throw new ParameterException([
                'msg'=>"数据更新失败",
            ]);
        }
        return json((new SuccessMessage()));
    }
    //获取一条需要展示在修改页面的抢购信息
    public function getEditInfo($id){

        $info = RobbingInfo::getOneInfo($id);
//         var_dump($info);exit;
        $info['address1'] = $info['address1'];
        $info['address'] = unserialize($info['address']);
        $info['good_name'] = unserialize($info['good_name']);
 
        return json([
            "code" => 201,
            "msg"  => 'ok',
            "data" => $info
        ]);
    }



    //地址列表
    public function addressList($page,$pagesize){


        //获取地址信息
        $info = Address::getAddressList($page,$pagesize);
        $total_number = Address::count();
        $total_page=ceil($total_number/$pagesize);

        return json([
            "code" => 201,
            "msg"=> "ok",
            "date" => $info,
            "total_number" => $total_number,
            "total_page"   => $total_page
        ]);

    }

    //添加地址
    public function addAddress(){
        //数据验证
        $validate = new AddAddressRule();
        $validate->goCheck();
        //获取post上传的数据
        //$info = $validate->getDataByRule(input('post.'));
        //$info=$_REQUEST;
        $info=request()->post();
        $address=$info['address'];
        $address1=$info['address1'];
        //var_dump($info);exit;
        //添加数据
        $result=Address::createAddress($info);
        
        if(!$result){
            throw new ParameterException([
                'msg'=>"数据添加失败",
            ]);
        }
        return json((new SuccessMessage()));
    }


    //删除下单地址列表地址
    public function delAddress($id){
        $result = Address::destroy($id);
        if(!$result){
            return json([
                'code' => 400,
                'msg'  =>'删除失败'
            ]);
        }
        return json([
            'code' => 201,
            'msg'  =>'删除成功',
        ]);
    }


}