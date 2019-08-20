<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------
use think\Route;
//发送短信
Route::post('admin/admin/sms','admin/admin/sms');
//测试页面
Route::get('admin/admin/test','admin/admin/test');

Route::get('home/home/ceshi','home/home/ceshi');

Route::any('admin/admin/oy_update','admin/admin/oy_update',['method'=>'get|post']);
Route::any('admin/admin/land','admin/admin/land',['method'=>'get|post']);

Route::get('test1','admin/admin/test1');
Route::post('admin/admin/uploads','admin/admin/uploads');
Route::get('admin/admin/forget','admin/admin/forget');
Route::get('admin/admin/passup','admin/admin/passup');
Route::get('admin/admin/vercode','admin/admin/vercode');
Route::get('admin/admin/qqlogin','admin/admin/qqlogin');
//添加抢购信息


//后台需要返回的页面
Route::Group('',function(){
    //后台首页
    Route::get('index','admin/admin/index');
    //首页右侧frame
    Route::get('welcome','admin/admin/welcome');

    //抢购信息列表
    Route::get('shoplist','admin/admin/shoplist');
//    Route::get('robdetails','admin/admin/robDetails');

    Route::get('shopadd','admin/admin/shopadd');
    Route::get('shopedit','admin/admin/shopedit');
    //报单订单列表
    Route::get('order','admin/admin/order');
    //会员管理列表
    Route::get('memberlist','admin/admin/memberlist');
    Route::get('memberlist_edit','admin/admin/memberlist_edit');

    Route::get('settlement','admin/admin/settlement');
    //下单地址管理
    Route::get('addresslist','admin/admin/addresslist');
    //添加地址栏
    Route::get('addAdd','admin/admin/addAdd');
    //省、市、县地区数据
    Route::get('region','admin/admin/region');
    Route::get('settlement_order','admin/admin/settlement_order');
    Route::get('shoplist_order','admin/admin/shoplist_order');


},['after_behavior'=>['\app\admin\behavior\CheckLogin']]);





Route::get('login','admin/admin/login');



//抢购信息列表接口
Route::get('api/:version/shopinfo/shoplist/:page/:pagesize','api/:version.Shopinfo/shopList',[],['page'=>'[1-9]\d*','pagesize'=>'[1-9]\d*']);
Route::get('api/:version/shopinfo/robdetails/:id/:page/:pagesize','api/:version.Shopinfo/robDetails',[],['page'=>'[1-9]\d*','pagesize'=>'[1-9]\d*']);
Route::get('api/:version/shopinfo/robsortquery/:lookup/:page/:pagesize/:good_id/:condition','api/:version.Shopinfo/RobSortQuery');
//删除抢购商品信息
Route::get('api/:version/shopinfo/delrob/:good_id','api/:version.Shopinfo/delRob',[],['page'=>'[1-9]\d*','pagesize'=>'[1-9]\d*']);

//排序搜索抢购信息列表
Route::get('api/:version/shopinfo/searchquery/:lookup/:page/:pagesize','api/:version.Shopinfo/searchQuery');
//添加抢单地址
Route::post('api/:version/shopinfo/create_address','api/:version.Shopinfo/addAddress');
//地址列表
Route::get('api/:version/shopinfo/address/:page/:pagesize','api/:version.Shopinfo/addressList',[],['page'=>'[1-9]\d*','pagesize'=>'[1-9]\d*']);
//删除下单地址列表地址
Route::get('api/:version/shopinfo/:id','api/:version.Shopinfo/delAddress',[],['id'=>'[1-9]\d*']);

//图片上传接口
Route::post('api/:version/shoinfo/upload','api/:version.Shopinfo/imgUpload');
//查询抢购信息
//Route::get('api/:version/shopinfo/lookup','api/:version.Shopinfo/lookup');
//添加抢购信息
Route::post('api/:version/shopinfo/add','api/:version.Shopinfo/shopAdd');
Route::post('api/:version/shopinfo/edit/:id','api/:version.Shopinfo/shopEdit');
//获取一条需要修改的抢购信息
Route::get('api/:version/shopinfo/getEditInfo/:id','api/:version.Shopinfo/getEditInfo');
//登录接口
Route::post('api/:version/login','api/:version.Login/getLogin');
//首页右侧列表
Route::get('api/:version/backstage','api/:version.Login/backStage');


//报单订单信息列表
Route::get('api/:version/order/:sort/:page/:pagesize','api/:version.Order/OrderList',[],['page'=>'[1-9]\d*','pagesize'=>'[1-9]\d*']);
//生成报单信息
Route::post('api/:version/order/placeorder','api/:version.Order/placeOrder');
//结算
Route::post('api/:version/order/settlement','api/:version.Order/settlement');
//取消结算
Route::post('api/:version/order/cancel/:id/:status','api/:version.Order/cancel');
//获取一条报单信息
Route::get('api/:version/order/getoneorder/:id','api/:version.Order/getOneOrder');
//报单列表检索查询
Route::get('api/:version/order/ordersortquery/:lookup/:page/:pagesize','api/:version.Order/orderSortQuery');



//会员列表信息
Route::get('api/:version/uservip/userlist/:page/:pagesize','api/:version.Uservip/UserListInfo');
Route::get('api/:version/uservip/user_order_info/:username/:page/:pagesize','api/:version.Uservip/user_Order_Info');
Route::get('api/:version/uservip/deluser/:user_id','api/:version.Uservip/delUser',[],['page'=>'[1-9]\d*','pagesize'=>'[1-9]\d*']);

//用户列表检索查询
Route::get('api/:version/uservip/usersortquery/:lookup/:page/:pagesize','api/:version.Uservip/UserSortQuery');
Route::get('api/:version/uservip/userscreenquery/:lookup/:number','api/:version.Uservip/UserScreenQuery');


/*************************前端接口******************************************/
//会员注册步骤一
Route::post('api/:version/reception/memberregister_o','api/:version.Reception/MemberRegisterO');
//会员注册步骤二
Route::post('api/:version/reception/memberregister_t','api/:version.Reception/MemberRegisterT');
//发送短信
Route::post('api/:version/reception/sendsms','api/:version.Reception/SendSms');
//秒杀抢购信息展示
Route::get('api/:version/reception/fast','api/:version.Reception/Fast');
Route::get('api/:version/reception/getshopalldate','api/:version.Reception/getShopAllDate');
Route::get('api/:version/reception/getdatetime','api/:version.Reception/getDateTime');
//获取序列化后的商品名称
Route::get('api/:version/reception/getgoodname/:good_id','api/:version.Reception/getGoodName');
//展示
Route::get('api/:version/reception/rerobstart/:time/:start/:page/:pagesize','api/:version.Reception/ReRobStart');
//抢购
Route::get('api/:version/reception/robshop/:id','api/:version.Reception/RobShop');
//获取抢购商品的详情信息
Route::get('api/:version/reception/GoodDetails/:id','api/:version.Reception/GoodDetails');
//提交报单信息
Route::post('api/:version/reception/SubmitOrderInfo','api/:version.Reception/SubmitOrderInfo');
//订单明细
Route::get('api/:version/reception/OrderDetailed/:page/:pagesize','api/:version.Reception/OrderDetailed');
//根据订单状态查询明细信息
Route::get('api/:version/reception/SubmitOrderStatus/:status/:page/:pagesize','api/:version.Reception/SubmitOrderStatus');
//获取个人订单总和数据
Route::get('api/:version/reception/GetOrderPeace','api/:version.Reception/GetOrderPeace');
Route::get('api/:version/reception/GetNowTimeGoodInfo/:time','api/:version.Reception/GetNowTimeGoodInfo');


//更新个人信息1
Route::post('api/:version/oyupdate/pro_up','api/:version.Oyupdate/pro_up');
//更新个人信息2
Route::post('api/:version/oyupdate/add_up','api/:version.Oyupdate/add_up');
//前台登陆
Route::post('api/:version/land/land','api/:version.Land/land');
//忘记密码-发送短信
Route::post('api/:version/forget/forget','api/:version.Forget/forget');
//忘记密码-验证验证码输出
Route::post('api/:version/vercode/vercode','api/:version.Vercode/vercode');
//忘记密码-修改密码
Route::post('api/:version/passup/passup','api/:version.Passup/passup');
//注销登陆
Route::get('api/:version/logout/logout','api/:version.Logout/logout');
//查询个人信息
Route::get('api/:version/phone/phone','api/:version.Phone/phone');
Route::get('api/:version/phone/select_add','api/:version.Phone/select_adds');
Route::get('api/:version/phone/select_alipay','api/:version.Phone/select_alipays');
//会员管理编辑查询
Route::get('api/:version/oyupdate/edit_member','api/:version.Oyupdate/edit_member');
Route::post('api/:version/oyupdate/edit','api/:version.Oyupdate/edit');
//报单开关
Route::get('api/:version/oyupdate/de_switch','api/:version.Oyupdate/de_switch');















/*****************************前端页面***********************************************/
//登录页面
Route::get('/','home/home/index_wap');
Route::get('register','home/home/register');
Route::get('register_pwd','home/home/register_pwd');
Route::get('logins','home/home/logins');
Route::get('index_wap','home/home/index_wap');
Route::get('Details','home/home/Details');
Route::get('declaration','home/home/declaration');
Route::get('user','home/home/user');
Route::get('user_info','home/home/user_info');
Route::get('order_details','home/home/order_details');
Route::get('settlement_details','home/home/settlement_details');



