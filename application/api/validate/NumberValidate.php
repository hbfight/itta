<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/6/1
 * Time: 14:42
 */

namespace app\api\validate;


class NumberValidate extends BaseValidate
{
    protected $rule = [
        ['username', 'require|isMobile|unique:user', '用户不能为空|请输入正确的手机格式|用户名已注册'],
    ];

}