<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/6/5
 * Time: 9:17
 */

namespace app\api\validate;


class SubmitOrderValidate extends BaseValidate
{
    protected $rule = [
        ['mode','require','货品纪要方式必选'],
        ['order_number','require|max:20',"订单号必填|订单号最大长度为20"],
        ['quantity','require',"报单数量不能为空"],
        ['good_name','require','货品名称必填'],
        ['remarks','max:210','备注最大长度210'],
        ['good_id','isPositiveInteger','必须是正整数']
    ];
}