<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/6/4
 * Time: 17:39
 */

namespace app\api\validate;





class CodeValidate extends BaseValidate
{
    protected $rule = [
        ["code","require|CodeCompare","验证码不能为空|验证码不正确"]
    ];
}