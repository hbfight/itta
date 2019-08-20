<?php
namespace app\api\validate;

use app\api\validate\BaseValidate;

class Phovalidate extends BaseValidate
{
    protected $rule=[
        'username'=>'isMobile'
    ];
}

