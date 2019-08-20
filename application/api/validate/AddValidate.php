<?php
namespace app\api\validate;

use app\api\validate\BaseValidate;

class AddValidate extends BaseValidate
{
    protected $rule = [
        //'text2'  =>  'require|max:5',
        ['text1','require','必填'],
        ['text2','require|max:40','地址必填|地址长度不能超过40']
    ];
}

