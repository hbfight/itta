<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/6/1
 * Time: 15:43
 */

namespace app\api\validate;


class PasswordValidate extends BaseValidate
{
    protected $rule = [
        ['password','require|isNotEmpty|length:6,18','密码必须填|密码不能为空|密码长度6~18位'],
        ['password2','confirm:password','密码不一致']
    ];
}