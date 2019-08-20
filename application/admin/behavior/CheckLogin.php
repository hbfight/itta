<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/22
 * Time: 10:37
 */

namespace app\admin\behavior;


class CheckLogin
{
    /**
     * @param $params
     * 每个行为默认的执行方法run
     */
    public function run(&$params)
    {
        //判断用户如果没有登录系统，就跳转到登录页面去
        $admin = session('admin');
        if(empty($admin)){
            //跳转到登录页面去,该方式会造成右下角的iframe自己跳转
            //return redirect('admin/manager/login');

            //下述：top 会找到整个页面，而非iframe
            $url = url('admin/admin/login');
            echo <<<eof
            <script type="text/javascript">
                window.top.location.href="$url";
            </script>
eof;
            exit;
        }
    }
}