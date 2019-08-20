<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/21
 * Time: 9:16
 */

namespace app\api\validate;


use app\lib\exception\ParameterException;
use think\Request;
use think\Validate;

class BaseValidate extends Validate
{
    //参数校验
    public function goCheck(){
        //获取http传入的参数
        $request = Request::instance();
        $params  = $request->param();

        //数据校验
        $result = $this->batch()->check($params);
        //异常处理
        if(!$result){
            $e = new ParameterException(
                [
                    'msg' => $this->error,
                ]
            );
            throw $e;
        }
        else{
            return true;
        }
    }

    //获取表单传递的信息
    public function getFormInfo($arrays){
        //定义一个数组来保存表单提交上的参数信息
        $newArray = [];
        //保存要处理的key，key对用这数据库的字段名
        foreach ($this->rule as $key => $value)
        {
            $newArray[$key] = $arrays[$key];
        }
        return $newArray;
    }

    /*****************自定义的校验规则***********************/
    //手机号码检测
    protected function isMobile($value)
    {
        $rule = '^1(3|4|5|7|8)[0-9]\d{8}$^';
        $result = preg_match($rule, $value);
        if ($result) {
            return true;
        } else {
            return false;
        }
    }
    //最多保留两位小数
    protected function isMoney($value)
    {
        if(is_numeric($value)){
            $rule = '/^\d+(\.\d{1,2})?$/';
            $result = preg_match($rule, $value);
            if ($result) {
                return true;
            } else {
                return "最多保留两位小数";
            }
        }else{
            return "必须为数字";
        }

    }
    //比较验证码
    public function CodeCompare($value){

        if(session('tel_code') == $value){
            return true;
        }else{
            return false;
        }
    }

    //验证参数不能为空
    protected function isNotEmpty($value, $rule = '', $data = '', $field = '')
    {
        if (empty($value))
        {
            return "不能为空";
        }
        else
        {
            return true;
        }
    }
    //必须是正整形
    protected function isPositiveInteger($value, $rule = '', $data = '', $field = '')
    {
        if (is_numeric($value) && is_int($value + 0) && ($value + 0) > 0)
        {
            return true;
        }
        else
        {
            return false;
            //            return $field.'必须是正整数';
        }
    }

    public function getDataByRule($arrays)
    {


        //数组是用来保存定义规则参数值，
        $newArray = [];
        //通过遍历的方式将校验的参数值保存到$newArray中
        foreach ($this->rule as $key => $value)
        {
            $newArray[$key] = $arrays[$key];
        }
        return $newArray;
    }
    
    //--------------------------------------------------


}