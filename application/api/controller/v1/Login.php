<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/5/21
 * Time: 9:26
 */

namespace app\api\controller\v1;


use app\api\controller\BaseController;
use app\api\model\Manager as ManagerModel;
use app\api\model\Permission;
use app\api\service\Backstage as BackstageService;
use app\api\validate\UserInfo;
use app\lib\exception\ManagerException;
use app\lib\exception\SuccessMessage;
use think\Controller;
use think\Exception;
use think\Session;

class Login extends Controller
{
    public function test(){
        return $this->fetch();
    }
    /**
     * @return \think\response\Json
     * 登录接口
     */
    public function getLogin(){
        //数据校验
        $validate = new UserInfo();
        $validate->goCheck();
        //获取表单传递的数据
        $shuju = $validate->getFormInfo(input('post.'));
        $shuju['mg_pwd']  = md5($shuju['mg_pwd']);
        //查询管理员
        $admin = ManagerModel::getManager($shuju);
//        dump($admin->getData());
//        exit;
        //用户不存在抛出异常
        if(!$admin){
           throw new ManagerException([
               'code' =>400,
               'msg'  =>'用户名或密码有误',
           ]);
        }else{
            //持久化用户信息Session
            Session::set('admin',$admin);
        }
        return json(new SuccessMessage());
    }

    /**
     * 退出登录
     */
    public function logout(){
        //清除session
        Session::clear();
        //页面跳转
        $this -> redirect('admin/manager/login');
    }

    /**
     * @return array
     * 首页右侧列表
     */

    public function backStage(){
        return BackstageService::index();
    }
}