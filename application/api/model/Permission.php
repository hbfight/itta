<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/21
 * Time: 12:06
 */

namespace app\api\model;


use think\Model;
use traits\model\SoftDelete;

class Permission extends Model
{
    use SoftDelete;
    protected $deleteTime = 'delete_time';

}