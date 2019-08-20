/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-06-08 15:14:24
 * @version $Id$
 */
$(function(){
    var searchURL = window.location.search;//获取路径
    var id = searchURL.replace('?', '').split('&');
    $.toast.prototype.defaults.duration="1000";//设置默认时间为1s
    $("input[name='good_id']").val(id);
    
    $("#form_declaration").submit(function(e){
    	  e.preventDefault();
        var datas=$(this).serialize();
        var order_number=$("input[name='order_number']").val();
        var quantity=$("input[name='quantity']").val();
        var good_name=$("input[name='good_name']").val();
        if(order_number==""){
           $.toast("报单编号不能为空","text"); 
        }else if(quantity==""){
           $.toast("报单数量不能为空","text");
        }else if(good_name==""){
           $.toast("报单货品属性不能为空","text");  
        }else{
	         $.ajax({
     		      url:"/api/v1/reception/SubmitOrderInfo",
        		  dataType:"json",
        		  type:"post",
              data:datas,
        		  success:function(res){
                console.log(res);
        		  	 if(res.code=="201"){
        		       $.toast("报单提交成功",function(){
        		    	   window.location.href="index_wap.html";
        		       })
        		     }else{
        		       $.toast(res.msg,"text");	
        		     }  
        		   },
        		   error:function(error){
        		 	     console.log(error);
                  if(!error.responseJSON.msg.order_number){
                    $.toast("提交失败，请重新提交","text");
                  }else{
                    $.toast(error.responseJSON.msg.order_number,"text");
                  }     
        		  }     

     	     })
       }
	     return false;

    })

    $.ajax({
       url:'/api/v1/reception/getgoodname/'+id,
       dataType:'json',
       type:'get',
       success:function(res){
          console.log(res);
             $(".declaration_rule").text(res.data.rule);//报单填写规则
             $(".Details_common").text(res.data.explain);//抢购说明
             /*货品名称*/
             $("#good_name").select({
               title: "选择货品属性",
               closeText:"关闭",
               items: res.data.good_name
             });
       },
       error:function(error){
          console.log(error)
       }
    })	
})
