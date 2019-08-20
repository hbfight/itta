/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-06-06 11:14:26
 * @version $Id$
 */
 $(function(){
          var countdown=60;//倒计时60秒；
          var searchURL = window.location.search;//获取路径
          var num = searchURL.replace('?', '').split('&');
          var statusnum=0;
          $.toast.prototype.defaults.duration="1200";//设置默认时间为1s
          var myreg=/^[1][3,4,5,,67,8][0-9]{9}$/;//手机号正侧
          var mycode=/^\d{4}/;
          //根据num的值来判断注册或修改密码
          if(num=="0"){ //注册
             document.title="注册";
             $(".register_h5title").text("注册");
          }else{ //修改密码
             document.title="忘记密码";
             $(".register_h5title").text("忘记密码");
             $(".regist_code").attr("id","up_codebtn");
          }

          //注册是点击调用
          $("#codebtn").click(function(){
              var phone=$("input[name='username']").val();
              var obj = $("#codebtn");
              if(phone==""){
                 $.toast("手机号不能为空", "text");
              }else if(!myreg.test(phone)){
                 $.toast("请输入正确的手机号","text"); 
              }else{   
                  ajax_code(phone,obj);
              }  
          })

          //忘记密码时调用
          $("#up_codebtn").click(function(){
             var phone=$("input[name='username']").val(); 
             var obj = $("#up_codebtn");
             if(phone==""){
                 $.toast("手机号不能为空", "text");
              }else if(!myreg.test(phone)){
                 $.toast("请输入正确的手机号","text");
              }else{
                 ajax_upcode(phone,obj);
              }
               
          })
              
          
          
          /* 忘记密码获取验证码接口 */
          function ajax_upcode(phone,obj){
             $.ajax({
                url:"/api/v1/forget/forget",
                data:{username:phone},
                dataType:"json",
                type:"post",
                success:function(res){
                   console.log(res);
                   if(res.code=="201"){
                       $.toast("验证码已发送", "text");
                       statusnum=1;
                       settime(obj);
                   }else{
                       $.toast(res.msg, "text");
                   }
                },
                error:function(error){
                   console.log(error);
                }

             })
          }
          /* 忘记密码判断验证码是否正确接口再进行下一步跳转 */
          function ajax_re_upcode(phone,code){
             $.ajax({
                url:"/api/v1/vercode/vercode",
                dataType:"json",
                type:"post",
                data:{username:phone,code:code},
                success:function(res){
                	
                  console.log(res);
                  console.log(res.code);
                  if(res.code=="201"){
                     $.toast("验证成功,进入下一步","text",function(){
                        window.location.href="register_pwd.html?"+num;
                     });
                  }else{
                    $.toast(res.msg, "text");
                  }
                },
                error:function(XMLHttpRequest,textStatus,errorThrown){
  
                   console.log(XMLHttpRequest)
                   console.log(textStatus);
                   console.log(errorThrown);
                   $.toast("请输入正确的手机号或验证码", "text");
                }
             })
          }

          
          /* 下一步点击跳转 */
          $("#register_btn").click(function(){
              var code=$("input[name='code']").val();
              var phone=$("input[name='username']").val();
              
              if(phone=="" || code==""){
                 $.toast("手机号或验证码不能为空", "text");
              }else if(!myreg.test(phone)){
                 $.toast("请输入正确的手机号", "text");
              }else if(!mycode.test(code)){
                 $.toast("请输入正确的验证码,验证码为四位数", "text");  
              }else{
               /* if(statusnum !="0"){ */
                  if(num=="0"){
                     ajax_register(code,phone);
                  }else{
                     ajax_re_upcode(phone,code)
                  }
                /*} */
             }
              
           })

          /* 注册获取验证码接口 */
          function ajax_code(phone,obj){
             $.ajax({
               url:'/api/v1/reception/sendsms',
               data:{username:phone},
               dataType:'json',
               type:"post",
               success:function(res){
                  console.log(res);
                  if(res.code="201"){
                     $.toast("验证码已发送", "text");
                     statusnum=1;
                     settime(obj);
                  }else{
                     $.toast(res.msg, "text");
                  }
               },
               error:function(error){
                  var msgerror=error.responseJSON.msg.username;
                  $.toast(msgerror, "text");
               }
            })
          }

          /* 注册判断验证码是否正确接口再进行下一步跳转 */
          function ajax_register(code,phone){
              $.ajax({
                  url:'/api/v1/reception/memberregister_o',
                  data:{code:code,username:phone},
                  dataType:'json',
                  type:"post",
                  success:function(res){
                     console.log(res);
                     if(res.code=="201"){
                       $.toast("验证成功,进入下一步",function(){
                       	  window.location.href="register_pwd.html?"+num;
                       });
                       
                     }else{
                       $.toast(res.msg, "text");
                     }
                  },
                  error:function(XMLHttpRequest,textStatus,errorThrown){
                     console.log(XMLHttpRequest);
                     console.log(textStatus);
                     console.log(errorThrown);
                     $.toast("请输入正确的手机号或验证码", "text");
                  }
               })
           }
       
          //发送验证码倒计时
          function settime(obj) {
                 if (countdown == 0) { 
                     obj.removeClass("regist_codes");
                     obj.attr('disabled',false); 
                     obj.text("获取验证码");
                     countdown = 60; 
                     return;
                 } else {
                     obj.addClass("regist_codes");
                     obj.attr('disabled',true);
                     obj.text("重新发送(" + countdown + ")");
                     countdown--; 
                 } 
                 setTimeout(function() {settime(obj) },1000) 
          }

       

          $("input[name='code']").bind('input propertychange',function(){
              var username=$("input[name='username']").val();
              var usercode=$("input[name='code']").val();
              if(username==""){
                 $("#register_btn").removeClass("register_submit");
                 
              }else{
                 if(usercode.length=='4'){
                   $("#register_btn").addClass("register_submit");
                 }else{
                   $("#register_btn").removeClass("register_submit");
                 } 
              }
          })

           $("input[name='username']").keyup(function(){  
              $(this).val($(this).val().replace(/[^0-9.]/g,''));  
           }).bind("paste",function(){  //CTR+V事件处理  
              $(this).val($(this).val().replace(/[^0-9.]/g,''));   
           }).css("ime-mode", "disabled"); //CSS设置输入法不可用

           $("input[name='code']").keyup(function(){  
              $(this).val($(this).val().replace(/[^0-9.]/g,''));  
           }).bind("paste",function(){  //CTR+V事件处理  
              $(this).val($(this).val().replace(/[^0-9.]/g,''));   
           }).css("ime-mode", "disabled"); //CSS设置输入法不可用

           
})