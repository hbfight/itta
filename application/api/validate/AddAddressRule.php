<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/25
 * Time: 12:10
 */

namespace app\api\validate;


class AddAddressRule extends BaseValidate
{
    protected $rule = [
        'address' => 'require|isNotEmpty|max:300'
    ];
}