/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-06-11 17:10:52
 * @version $Id$
 */

 
$(function(){
          var page=1; //当前页数
          var pagesize=10; //每页显示条数 
          var nav_ids="order_tab1";
          var statusvalue=0; //默认为0显示全部数据
          $.toast.prototype.defaults.duration="1000";
          /* 全部数据初始化加载 */
          order_details_ajax(page,nav_ids,statusvalue);
          /* 全部数据接口方法 */
          function order_details_ajax(page,navid,statusvalue){
            $.ajax({
               url:"/api/v1/reception/OrderDetailed/"+page+"/"+pagesize,
               dataType:"json",
               type:"get",
               success:function(res){      
                  console.log(res);
                  $(".weui-loadmore").hide();         
                  if(res.data.length<=0 || res.data=="没有数据"){
                  	  $(".order_more_data").show();
                      $(".order_more_data").html("暂无数据");
                      $(document.body).destroyInfinite();
                      return false;
                  }else if(res.data.length<pagesize){  
                      order_details_body(res,navid);
                      $(".order_more_data").show();
                      $(".order_more_data").html("没有数据了");
                      $(document.body).destroyInfinite();
                      return false;
                  }else{
                     //全部数据
                     order_details_body(res,navid);
                  }                   
                  
               },
               error:function(error){
                  console.log(error);
                  $(".weui-loadmore").hide();
               	  $(document.body).destroyInfinite();
                  $.toast("抱歉,出错了","text");


               }
            })

          }  
          /* 已报单，已结算接口方法 */
          function order_details_status_ajax(page,navid,status){
          	 $.ajax({
          	 	 url:"/api/v1/reception/SubmitOrderStatus/"+status+"/"+page+"/"+pagesize,
          	 	 dataType:"json",
          	 	 type:"get",
          	 	 success:function(res){
                   $(".weui-loadmore").hide();
                   console.log(res);
                   if(res.data.length<=0 || res.data=="没有数据啦"){
                   	  $(".order_more_data").show();
                   	  $(".order_more_data").html("暂无数据");
                      $(document.body).destroyInfinite();
                      return false;
                   }else if(res.data.length<pagesize){
                   	  order_details_body1(res,navid);
                      $(".order_more_data").show();
                      $(".order_more_data").html("没有数据了");
                      $(document.body).destroyInfinite();
                      return false;
                   }else{
                      order_details_body1(res,navid);

                   }
          	 	 },
          	 	 error:function(XMLHttpRequest,textStatus,errorThrown){
                 console.log(error);
          	 	 	 $(document.body).destroyInfinite();
          	 	 	 $.toast("抱歉,出错了","text");
          	 	 	 
          	 	 }
          	 })
          }

          /* 全部数据拼接 */
          function order_details_body(data,navid){
              var html='';
              for(var i=0;i<data.data.length;i++){
                  html+='<div class="order_details_con">';
                  html+='<div class="weui-cell order_details_cell">';
                  html+='<div class="weui-cell_bd ">';
                  html+='<p class="order_number">订单号：<span>'+data.data[i].order_number+'</span></p>';
                  html+='<p class="order_time">提交时间：<span>'+data.data[i].create_time+'</span></p>';
                  html+='</div>';
                  html+='<div class="weui-cell_ft">';
                  if(data.data[i].is_status=="1"){
                     html+='<p class="order_status">已报单</p>';
                  }else if(data.data[i].is_status=="2"){
                     html+='<p class="order_status">已结算</p>';
                  }else if(data.data[i].is_status=="3"){
                     html+='<p class="order_status_close">已取消</p>';
                  }
                 html+='</div>';
                 html+='</div>';
                 html+='<div class="weui-panel weui-panel-access">';
                 html+='<div class="weui-panel__bd">';
                 html+='<a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">';
                 html+='<div class="weui-media-box__hd order_media_img">';
                 if(data.data[i].robbing==null || data.data[i].robbing==undefined){
                   html+='<img class="weui-media-box__thumb" src="" alt="">';
                 }else{
                   html+='<img class="weui-media-box__thumb" src="'+data.data[i].robbing.img+'">';
                 }
                 
                 html+='</div>';
                 html+='<div class="weui-media-box__bd">';
                 html+='<h4 class="weui-media-box__title order_details-title">'+data.data[i].good_name+'</h4>';
                 if(data.data[i].mode=="0"){
                    html+='<p class="order_mode">自行垫付</p>';
                 }else if(data.data[i].mode=="1"){
                    html+='<p class="order_mode">货到付款</p>';
                 }else if(data.data[i].mode=="2"){
                    html+='<p class="order_mode">现货直邮</p>';
                 }   
                 html+='<div class="weui-media-box__desc">';
                 html+='<div class="order_con_main order_con_mainp1">';
                 html+='<p>购买数量</p>';
                 html+='<p>预估结算金额</p>';
                 html+='</div>';
                 html+='<div class="order_con_main d_center">';
                 html+='<p class="order_con_mainnumber">'+data.data[i].quantity+'</p>';
                 html+='<p class="order_con_main_price">￥'+data.data[i].estimate_price+'</p>';
                 html+='</div>';
                 html+='</div>';
                 html+='</div>';
                 html+='</a>';
                 html+='</div>';
                 html+='</div>';
                 html+='</div>';                
              }
              $("#"+navid).append(html);
          }
          /* 已报单，已结算数据拼接 */
          function order_details_body1(data,navid){
              var html='';
              for(var i=0;i<data.data.length;i++){           
                  html+='<div class="order_details_con">';
                  html+='<div class="weui-cell order_details_cell">';
                  html+='<div class="weui-cell_bd ">';
                  html+='<p class="order_number">订单号：<span>'+data.data[i].order_number+'</span></p>';
                  html+='<p class="order_time">提交时间：<span>'+data.data[i].create_time+'</span></p>';
                  html+='</div>';
                  html+='<div class="weui-cell_ft">';
                  if(data.data[i].is_status=="1"){
                     html+='<p class="order_status">已报单</p>';
                  }else if(data.data[i].is_status=="2"){
                     html+='<p class="order_status">已结算</p>';
                  }else if(data.data[i].is_status=="3"){
                     html+='<p class="order_status_close">已取消</p>';
                  }                 
                 html+='</div>';
                 html+='</div>';
                 html+='<div class="weui-panel weui-panel-access">';
                 html+='<div class="weui-panel__bd">';
                 html+='<a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">';
                 html+='<div class="weui-media-box__hd order_media_img">';
                 if(data.data[i].robbing==null || data.data[i].robbing==undefined){
                    html+='<img class="weui-media-box__thumb" src="" alt="img">';
                 }else{
                    html+='<img class="weui-media-box__thumb" src="'+data.data[i].robbing.img+'">';
                 }
                 html+='</div>';
                 html+='<div class="weui-media-box__bd">';
                 html+='<h4 class="weui-media-box__title order_details-title">'+data.data[i].good_name+'</h4>';
                 if(data.data[i].mode=="0"){
                    html+='<p class="order_mode">自行垫付</p>';
                 }else if(data.data[i].mode=="1"){
                    html+='<p class="order_mode">货到付款</p>';
                 }else if(data.data[i].mode=="2"){
                    html+='<p class="order_mode">现货直邮</p>';
                 }                 
                 html+='<div class="weui-media-box__desc">';
                 html+='<div class="order_con_main order_con_mainp1">';
                 html+='<p>购买数量</p>';
                 html+='<p>预估结算金额</p>';                
                 html+='</div>';
                 html+='<div class="order_con_main d_center">';
                 html+='<p class="order_con_mainnumber">'+data.data[i].quantity+'</p>';
                 html+='<p class="order_con_main_price">￥'+data.data[i].estimate_price+'</p>';
                 html+='</div>';
                 html+='</div>';
                 html+='</div>';
                 html+='</a>';
                 html+='</div>';
                 html+='</div>';
                 html+='</div>';
                  
              }      
              
              $("#"+navid).append(html);
          }
          
          /* tab点击选中展示数据 */
          $(".navbar_item").click(function(){
              $(".order_more_data").hide();
              nva_ids = $(this).find("span").text();              
              statusvalue=$(this).attr("value");
              page=1;
              $("#"+nva_ids).html("");
              $(document.body).infinite();
              if(statusvalue=="0"){
                $(".weui-loadmore").show();
                order_details_ajax(page,nva_ids,statusvalue);
                
              }else{
                $(".weui-loadmore").show();
                order_details_status_ajax(page,nva_ids,statusvalue);
                
              }
                 
              
          })
          
          /* 滚动加载更多 */
          var loading = false;  
          $(document.body).infinite().on("infinite", function() {
            if(loading) return;
            loading = true;
            nav_ids=$(".weui-bar__item--on").find("span").text();
            setTimeout(function() {
              $(".order_more_data").show();
              page=page+1;
              
              if(statusvalue=="0"){
                 console.log('0');
                 order_details_ajax(page,nav_ids,statusvalue);
                 
              }else{
                 console.log("1");
                 order_details_status_ajax(page,nva_ids,statusvalue);
                
              }
              
              loading = false;
            }, 300);   
          });

         

})

