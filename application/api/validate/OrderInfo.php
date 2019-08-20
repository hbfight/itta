<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/27
 * Time: 17:15
 */

namespace app\api\validate;


class OrderInfo extends BaseValidate
{
    /**
     * @var array
     * mode             提交方式
     * order_number     订单编号
     * number           货品数量
     * good_name        货品名称
     * remarks          会员备注
     */
    protected $rule = [
        'mode' =>'require|isNotEmpty',
        'order_number' =>'require|isNotEmpty',
        'number' =>'require|isNotEmpty',
        'good_name' =>'require|isNotEmpty',
        'remarks' =>'max:200'
    ];
}