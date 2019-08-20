<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/24
 * Time: 12:05
 */

namespace app\api\validate;


use app\lib\exception\ParameterException;

class ShopAddInfo extends BaseValidate
{
    protected $rule = [
        'title'=>'require|isNotEmpty',
        'number'=>'require|isNotEmpty|max:4',
        'price'=>'require|isMoney|isNotEmpty',
        'settle_price'=>'require|number|isMoney|isNotEmpty',
        'type'=>'require|isNotEmpty',
        'rob_time'=>'require|isNotEmpty',
        'return_time'=>'require',
        'channel'=>'require|isNotEmpty',
        'rob_href'=>'require|isNotEmpty',


        'address'=>'require|checkAddress',
        'address_prompt'=>'require|isNotEmpty',
        'explain' =>'max:200',
        'rule'=>'require|isNotEmpty',
        'good_name'=>'require|isNotEmpty|checkAddress',
        'img'=>'require|isNotEmpty'
    ];


    protected function checkAddress($values){


            //判断地址参数是否是数组
            if(!is_array($values)){
                throw new ParameterException([
                    'msg' => '地址参数不正确'
                ]);
            }



            foreach ($values as $value){


                    $this->checkAddressKey($value);

            }
            return true;
    }

    //验证地址数组里面的key值
    protected function checkAddressKey($value){


            if(mb_strlen($value,'UTF8')>150){
                throw new ParameterException([
                    'msg' => '地址最大长度为150'
                ]);
            }

            if (empty($value))
            {
                throw new ParameterException(
                    [
                        'msg' => '地址不能为空'
                    ]);
            }
    }




}

