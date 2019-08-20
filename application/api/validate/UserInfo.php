<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/21
 * Time: 9:29
 */

namespace app\api\validate;

//管理员验证信息
class UserInfo extends BaseValidate
{
    protected $rule = [
        'mg_name' => 'require',
        'mg_pwd'  => 'require'
    ];
}