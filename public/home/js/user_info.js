/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-06-12 10:37:13
 * @version $Id$
 */

$(function(){
         var a=0; 
         var storage=window.localStorage;
         $.toast.prototype.defaults.duration="10000";//设置默认时间为1s
    		/* 支付宝账号点击确定关闭事件 */
    		$("#apliay_close").click(function(){
               var name=$("#username").val();
               var useralipay=$("#useralipay").val();
               var useralipay_reg=/^[\u0391-\uFFE5A-Za-z]+$/; //姓名验证
               var phonealipay_reg=/^(?:\w+\.?)*\w+@(?:\w+\.)+\w+|\d{9,11}$/; //账号验证
               if(name=="" || useralipay==""){
                  $.toast("支付宝姓名或者账号不能为空","text");
               }else if(!useralipay_reg.test(name)){
                  $.toast("支付宝姓名格式输入有误,请重新输入","text");
               }else if(!phonealipay_reg.test(useralipay)){
                  $.toast("支付宝账号格式输入有误,请重新输入","text");
               }else{
                  alipay_ajax(name,useralipay);
               }
               
    		})
        /* 添加支付宝账号接口方法 */
        function alipay_ajax(username,alipaynumber){
           $.ajax({
              url:"/api/v1/oyupdate/add_up",
              dataType:"json",
              type:"post",
              data:{text3:username,text4:alipaynumber},
              success:function(res){
                 if(res.code=="201"){
                     $.toast("添加成功",function(){
                       $.closePopup();
                     })
                     location.reload();
                  } 
              },
              error:function(XMLHttpRequest,textStatus,errorThrown){
                 $.toast("添加失败","text");
              }
           })
        }
        /* 添加地址点击确定关闭事件 */
        $("#user_info_addresclose").click(function(){
              var address_name=$("#address_name").val();
            	var address_city=$("#city-picker").val();
            	var address_info=$("#address_info").val();
              var address_details=address_city +" " + address_info;
              if(address_name==""){
                    $.toast("用户姓名不能为空","text");             
              }else if(address_city==""){
                   $.toast("省,市,区县不能为空","text");
              }else if(address_info==""){
                   $.toast("详细地址不能为空","text");     
            	}else{
                   address_ajax(address_name,address_details);
            	}
        })
        /* 添加地址接口方法*/
        function address_ajax(address,info){
            $.ajax({
               url:"/api/v1/oyupdate/pro_up",
               dataType:"json",
               type:"post",
               data:{text1:address,text2:info},
               success:function(res){
                  if(res.code=="201"){
                     $.toast("添加地址成功",function(){
                       $.closePopup();
                     })
                     location.reload();
                  }else{
                     $.toast("添加地址失败,请重新添加","text");
                     $.closePopup();
                  }
               },
               error:function(XMLHttpRequest,textStatus,errorThrown){
                  $.toast("添加失败","text");
               }
            })
        }

        /* 添加收货地址 */
    	$("#city-picker").cityPicker({
            title: "请选择收货地址"
        });


        /* 退出登录接口 */
        $("#close_wap_btn").click(function(){
            $.ajax({
               url:"/api/v1/logout/logout",
               dataType:"json",
               type:"get",
               success:function(res){
                  if(res.code=="201"){
                     /* 退出清除缓存 */
                     storage.removeItem("username");
                     storage.removeItem("password");
                     $.toast("你已退出",1000,function(){
                        window.location.href="logins.html";
                     })
                  }else{
                     $.toast(res.msg,"text");
                  }
               },
               error:function(error){
                  $.toast("出错了","text");
               }

            })
        })

    	/* 查询用户电话号码 */
    	ajax_phone();
    	function ajax_phone(){
           $.ajax({
              url:"/api/v1/phone/phone",
              dataType:"json",
              type:"get",
              success:function(res){
                if(res.code=="201"){
                    var userphone=res.data;
                    $("#user_info_phone").text(userphone.substring(0,3)+"****"+userphone.substring(8,11));
                }else{
                    $.toast("手机号不存在,请登陆","text",function(){
                       window.location.href="logins.html";
                    });
                }
              },
              error:function(error){
                 console.log(error) 
                
              }

           })
        }
        /* 查询地址是否已添加 */
        ajax_select_add();
        function ajax_select_add(){
          $.ajax({
            url:"/api/v1/phone/select_add",
            dataType:"json",
            type:"get",
            success:function(res){
               console.log(res);
               if(res.data[0]=="" || res.data[1]==""){
               	   
               }else{
                 var stra;
                 var str = res.data[1];
                 str = str.split(' ');//先按照空格分割成数组
                 var lastStr = str[str.length - 1];
                 str.pop();//删除数组最后一个元素
                 stra = str.join(' ');//
                 $("#input_select").hide();
               	 $("#user_address").append('<p class="user_info_usertext">'+res.data[0]+'</p><p class="user_info_usertext">'+res.data[1]+'</p>')
                 $("#user_address").attr("data-target","#address_user");
                 $("#username_address").val(res.data[0]);
                 $("#user_address_z").val(stra);
                 $("#user_address_info").val(lastStr);

               }
            },
            error:function(error){
               console.log(error);
             
               
            }
          })
        }

        /* 查询支付宝是否已添加 */
        ajax_select_alipay();
        function ajax_select_alipay(){
          $.ajax({
            url:"/api/v1/phone/select_alipay",
            dataType:"json",
            type:"get",
            success:function(res){
               
               if(res.data[0]=="" || res.data[1]=="0"){
               	  
               }else{
               	  $("#user_alipay").hide();
               	  $("#body_alipay").append('<p class="user_info_usertext">'+res.data[0]+'</p><p class="user_info_usertext">'+res.data[1]+'</p>')
               }
            },
            error:function(error){
               console.log(error);
               
               
            }
         })
       }


})

