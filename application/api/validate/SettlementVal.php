<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/29
 * Time: 9:23
 */

namespace app\api\validate;


class SettlementVal extends BaseValidate
{
    protected $rule = [
        'actual_price' => "require|isNotEmpty",
        'business_rm'  => "max:250",
        'id'           => "require"
    ];
}