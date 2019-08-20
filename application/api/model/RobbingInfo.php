<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/23
 * Time: 20:05
 */

namespace app\api\model;


use app\lib\exception\ParameterException;
use think\Model;
use traits\model\SoftDelete;
use think\Db;
use think\helper\Time;
class RobbingInfo extends Model
{
    use SoftDelete;
    protected $deleteTime = 'delete_time';

    public static function invoke()
    {
        $id = request()->param('good_id');
        return self::get($id);
    }


//获取抢购信息
    public static function getShopInfo($page,$pagesize){
        //获取10条抢购信息：返回的是数组对象集
        $data = self::limit(($page-1)*$pagesize,$pagesize)
        ->order('rob_time desc')
        ->select();
        
        $arr =[];
        foreach ($data as $k=>$v){
            $arr[$k] = $v->toArray();
        }
        
        //将地址反序列
        foreach($arr as $k=>$v){
            $arr[$k]['address'] = unserialize($arr[$k]['address']);
            
        }
        
        
        
        return $arr;
    }
    
    public static function ro_de($good_id){
        $relust=self::destroy(['good_id'	=>	$good_id]);
        return $relust;
    }

    //获取抢购中的状态
    public static function getRobStart($time,$start,$page,$pagesize){
        $todayStart= strtotime(date('Y-m-d 00:00:00', $time)); //2016-11-01 00:00:00

        $todayEnd= strtotime(date('Y-m-d 23:59:59', time())); //2016-11-01 23:59:59
        $data = self::
        where(['rob_time'=>['=',$time],'is_status'=>['=',$start],'type'=>['=','1'],'declaration'=>['=','0']])
            ->limit(($page-1)*$pagesize,$pagesize)
            ->select();
        $data1 = self::where('type','eq','2')
            ->where('rob_time',['>=',$todayStart],['<=',$time+1])
            ->where('declaration','eq','0')
            ->select()->toArray();
//        echo $todayStart."<br>".$time;
        

        $arr =[];
        foreach ($data as $k=>$v){
            $arr[$k] = $v->toArray();
        }
//        dump($arr);
//        exit;
        //将地址反序列
        foreach($arr as $k=>$v){
            $arr[$k]['address'] = unserialize($arr[$k]['address']);
        }

        if(empty($arr)){
            return null;
        }
          foreach($arr as $v){
                array_push($data1,$v);
          }
//      dump($data1);
//        exit;
//            if($data1){
//                return null;
//            }
        for($i=0 ; $i<count($data1);$i++){
            if($data1[$i]['type'] == '1'){
                return $data1;
            }
        }

    }

    //获取一条商品的详情信息
    public static function getOneInfo($id){
        return self::where('good_id',$id)->find();;
    }

    //更新抢购信息
    public static function updateOneInfo($id,$info){
           return self::where('good_id','eq',$id)->update($info);
    }

    public static function getShopInfo1($page,$pagesize){
        //获取10条抢购信息：返回的是数组对象集
        $data = self::limit(($page-1)*$pagesize,$pagesize)
            ->order('create_time desc')
            ->select();

        $arr =[];
        foreach ($data as $k=>$v){
            $arr[$k] = $v->toArray();
        }
        //将地址反序列
        foreach($arr as $k=>$v){
            $arr[$k]['address'] = unserialize($arr[$k]['address']);
        }


        return $arr;
    }

    /**
     * @param $lookup    四种排序查询方式：报单数量、预估结算金额、时间段、品牌网站（京东、苏宁、淘宝..）
     * @param $page      第几页
     * @param $pagesize  每页显示条数
     * @return array
     */
    //模糊查询指定列表信息
    public static function getLikeInfo($lookup,$page,$pagesize){

        if($lookup == "default"){
            $data = self::limit(($page-1)*$pagesize,$pagesize)
                ->order('create_time desc')
                ->select();

            $arr =[];
            foreach ($data as $k=>$v){
                $arr[$k] = $v->toArray();
            }
            //将地址反序列
            foreach($arr as $k=>$v){
                $arr[$k]['address'] = unserialize($arr[$k]['address']);
            }
        }else{
            $info = self::limit(($page-1)*$pagesize,$pagesize)->order("$lookup desc")
                ->select();

            $arr =[];
            foreach ($info as $k=>$v){
                $arr[$k] = $v->toArray();
            }
            //将地址反序列
            foreach($arr as $k=>$v){
                $arr[$k]['address'] = unserialize($arr[$k]['address']);
            }
        }


        return $arr;
    }
    //根据时间段查询
    public static function getTime($start,$end,$page,$pagesize){


        $info = self::where('rob_time',['>=',$start],['<=',$end])
            ->limit(($page-1)*$pagesize,$pagesize)
            ->order("rob_time desc")
            ->select();
        $arr =[];
        foreach ($info as $k=>$v){
            $arr[$k] = $v->toArray();
        }
//        dump($arr);
//        exit;
        $arr =[];
        foreach ($info as $k=>$v){
            $arr[$k] = $v->toArray();
        }
        //将地址反序列
        foreach($arr as $k=>$v){
            $arr[$k]['address'] = unserialize($arr[$k]['address']);
        }

        return $arr;
    }
    //根据网店名称模糊查询
    public static function queryStoreName($lookup,$page,$pagesize){

        if($lookup == '4'){
            $data = self::limit(($page-1)*$pagesize,$pagesize)
                ->order('create_time desc')
                ->select();

            $arr =[];
            foreach ($data as $k=>$v){
                $arr[$k] = $v->toArray();
            }
            //将地址反序列
            foreach($arr as $k=>$v){
                $arr[$k]['address'] = unserialize($arr[$k]['address']);
            }

        }else{
            $info = self::where('store_name','eq',$lookup)->limit(($page-1)*$pagesize,$pagesize)->order("$lookup desc")
                ->select();
            $arr =[];
            foreach ($info as $k=>$v){
                $arr[$k] = $v->toArray();
            }
            //将地址反序列
            foreach($arr as $k=>$v){
                $arr[$k]['address'] = unserialize($arr[$k]['address']);
            }
            //return $arr;
        }
        return $arr;


    }

    //添加抢购信息
    public static function add($info){
        return self::create($info);
    }


    //获取指定字段信息
    public static function getField($id,$field){
        $FieldInfo = self::field($field)->find($id)->getData();
        return $FieldInfo;
    }


    public static function  unique_array_2d($array2D,$stkeep=false,$ndformat=true)
    {
        // 判断是否保留一级数组键 (一级数组键可以为非数字)
        if($stkeep) $stArr = array_keys($array2D);

        // 判断是否保留二级数组键 (所有二级数组键必须相同)
        if($ndformat) $ndArr = array_keys(end($array2D));

        //降维,也可以用implode,将一维数组转换为用逗号连接的字符串
        foreach ($array2D as $v){
            $v = join(",",$v);
            $temp[] = $v;
        }

        //去掉重复的字符串,也就是重复的一维数组
        $temp = array_unique($temp);

        //再将拆开的数组重新组装
        foreach ($temp as $k => $v)
        {
            if($stkeep) $k = $stArr[$k];
            if($ndformat)
            {
                $tempArr = explode(",",$v);
                foreach($tempArr as $ndkey => $ndval) $output[$k][$ndArr[$ndkey]] = $ndval;
            }
            else $output[$k] = explode(",",$v);
        }

        return $output;
    }
    //获取所有抢的时间段
    public static function getAllData(){
        $todayStart= strtotime(date('Y-m-d 00:00:00', time())); //2016-11-01 00:00:00
        $result = self::field('rob_time,is_status,type')->order('rob_time asc')->where('rob_time','>',$todayStart-1)->select()->toArray();
        $re_ss=session('re_ss',$result);
        if(empty($result)){
            return json([
                'code' => 201,
                'msg'  => "没有数据",
            ]);
        }


//        $arr =[];
//        foreach ($result as $k=>$v){
//
//            $arr[$k] = $v->toArray();
//        }
        $info = self::test($result);
//        dump($info);
//        exit;


//        $info = [];
//        foreach($arrs as $v){
//            array_push($info,$v);
//        };
        $arra = [];
        for($i=0 ; $i<count($info);$i++){
            if($info[$i]['2'] == '1'){
                array_push($arra,$info[$i]);

            }
        }

        return json([
            'code' => 201,
            'msg'  => "ok",
            'data' => $arra
        ]);
    }
    public static function getDateTime_m($todayStart,$todayEnd){
        //var_dump($todayStart);exit;
        $result = self::field('rob_time,is_status,type,declaration')
            ->order('rob_time asc')
            ->where('rob_time',['>',$todayStart],['<',$todayEnd])
            ->where('declaration','eq','0')
            ->select()
            ->toArray();

        if(empty($result)){

            return json([
                'code' => 201,
                'msg'  => "没有数据",
            ]);
        }

//        $arr =[];
//        foreach ($result as $k=>$v){
//
//            $arr[$k] = $v;
//        }


        $info = self::test($result);


//        dump($info);
//        exit;
        $arra = [];
        for($i=0 ; $i<count($info);$i++){
            if($info[$i]['2'] == '1' && $info[$i]['3'] == '0'){
                array_push($arra,$info[$i]);

            }
        }

        return json([
            'code' => 201,
            'msg'  => "ok",
            'data' => $arra
        ]);

    }
    public static function test($array2D){

        if(empty($array2D)){
            return json([
                'code'=>201,
                'msg'=>'ok',
                'data'=>''
            ]);
        }
        
        $flag=array();
        foreach($array2D as $arr2){
            $flag[]=$arr2["type"];
        }
        array_multisort($flag, SORT_ASC, $array2D);


            foreach ($array2D as $v){
                $v=join(',',$v); //降维,也可以用implode,将一维数组转换为用逗号连接的字符串
                $temp[]=$v;
            }

            $arrs = [];
            $arrs1 = [];


            //去除数组
            foreach($temp as $k=>$v){
                    if(!in_array(substr($v,0,10),$arrs)){

                            array_push($arrs,substr($v,0,10));
                            array_push($arrs1,$v);
                    }

            }


            foreach ($arrs1 as $k => $v){
                $arrs1[$k]=explode(',',$v); //再将拆开的数组重新组装
            }


            return $arrs1;


    }

    public static function getNowtime($time){
        


        $a_date = date('Y-m-d',$time);
        $time = strtotime($a_date);
        $end = $time+86400;

        
        //获取当天时间段的所有抢购商品

        $result = self::field('rob_time,is_status,type,declaration')
            ->where('rob_time',['>=',$time],['<=',$end])
            ->where('declaration','eq','0')
            ->order('rob_time asc')
            ->select()
            ->toArray();
        
          if(empty($result)){
              return json([
                  'code' => 201,
                  'msg'  => "没有数据",
              ]);
          }  
//        $result = self::field('rob_time,is_status,type,declaration')
//            ->order('rob_time asc')
//            ->where('rob_time',['>',$todayStart],['<',$todayEnd])
//            ->where('declaration','eq','0')
//            ->select()
//            ->toArray();
//        $arr =[];
//        foreach ($result as $k=>$v){
//            $arr[$k] = $v->toArray();
//        }

        $arrs =self::test($result);


        $arra = [];

        for($i=0 ; $i<count($arrs);$i++){
            if($arrs[$i]['2'] == '1' && $arrs[$i]['3'] == '0'){
                array_push($arra,$arrs[$i]);
            }
        }

        

        $arrss = $arra;
        $flag=array();
        foreach($arrss as $arr2){
            $flag[]=$arr2[0];
        }
        array_multisort($flag, SORT_ASC, $arrss);
//         $aa=microtime(true);
        $ti=time();
        foreach ($arra as $k=>$v){//变化抢购状态
            
            if($v[0]<=$ti && $v[1]==3){
                $res=self::where('rob_time','elt',$ti)->where('is_status','eq',2)->update(['is_status'=>1]);
                $re=self::where('rob_time','eq',$v[0])->update(['is_status'=>2]);

            }
        }
        $bb=microtime(true);
//         $cc=$bb-$aa;
//         echo $cc;
        return json([
            'code' => 201,
            'msg'  => "ok",
            'data' => $arra
        ]);

    }
    //报单开关查询
    public static function declaration($id){
        $result=self::where('good_id',$id)->value('declaration');
        return $result;
    }
    //报单开关修改
    public static function modify_order($id,$declaration){
        if($declaration==0){
            $result=self::where('good_id',$id)->update(['declaration'=>1]);
            return $result;
        }else{
            $result=self::where('good_id',$id)->update(['declaration'=>0]);
            return $result;
        }
        
    }

}