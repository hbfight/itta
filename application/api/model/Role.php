<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/21
 * Time: 12:07
 */

namespace app\api\model;


use think\Model;
use traits\model\SoftDelete;

class Role extends Model
{
    use SoftDelete;
    protected $deleteTime = 'delete_time';
}