/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-05-30 17:01:12
 * @version $Id$
 */
$(function(){
      var num=1;
      var pagesize=10;
      var storage=window.localStorage;
      storage.removeItem("username_member");
      storage.removeItem("username_shop");
      /* layui时间控件  */
      layui.use('laydate', function(){
        var laydate = layui.laydate;
        //执行一个laydate时间控件实例
        laydate.render({
          elem: '#start' //指定元素
          ,range: true
        });
      });

      layui.use('layer', function(){
          var layer = layui.layer;
          layer.load();
          
      });

      /* 限制要展示的字体 */
        $('.rushbuy_conh5').each(function() {  
          var maxwidth = 15;  
          if($(this).text().length > maxwidth) {  
             $(this).text($(this).text().substring(0, maxwidth));  
             $(this).html($(this).html() + "...");  
          } 
       })  

       $(".rushbuy_address").each(function(){
          var maxwidth=15;
          if($(this).text().length>maxwidth){
          	 $(this).text($(this).text().substring(0,maxwidth));
          	 $(this).html($(this).html() + "...");
          }
       }) 
      
       orderlist(num);
       /* 全部报单信息 */
       function orderlist(num){
         $.ajax({
            url:"/api/v1/order/asc/"+num+"/"+pagesize,
            dataType:"json",
            type:"get",
            success:function(res){
                console.log(res);
                if(res.data="" || res.data==null){
                  layer.closeAll('loading');
                  $("#shoplist_tbodynone").show();
                  $("#order_page").hide();
                }else{
                  currentnum=res.total_number;
                  page_orderlist(num,currentnum);
                }
                
            },
            error:function(error){
                layer.closeAll('loading');
                console.log(error);
            }
         })
       }
     
       function order_ajax(num){
          $.ajax({
            url:"/api/v1/order/asc/"+num+"/"+pagesize,
            dataType:"json",
            type:"get",
            success:function(res){
              layer.closeAll('loading');
              console.log(res.data);
              order_tbody(res);
            },
            error:function(error){
              layer.closeAll('loading');
              console.log(error)
            }
          })
       }
       /* 报单订单列表拼接方法  */
       function order_tbody(data){
            var html='';
            for(i=0;i<data.data.length;i++){
               html+='<tr class="is_status'+data.data[i].is_status+'">'
               html+='<td>'+data.data[i].id+'</td>';
               html+='<td>'+data.data[i].create_time+'</td>';
               if(data.data[i].mode=="0"){
                  html+='<td>自行垫付</td>';
               }else if(data.data[i].mode=="1"){
                  html+='<td>货到付款</td>';
               }else if(data.data[i].mode=="2"){
                  html+='<td>现货直邮</td>'; 
               }else{

               }
               html+='<td>'+data.data[i].order_number+'</td>';
               html+='<td>'+data.data[i].quantity+'</td>';
               html+='<td>'+data.data[i].good_name+'</td>';
               html+='<td>'+data.data[i].remarks+'</td>';
               html+='<td>'+data.data[i].username+'</td>';
               html+='<td>';
               if(data.data[i].user==null || data.data[i].user==undefined){
                   html+='<p></p>';
                   html+='<p></p>'
               }else{
                   html+='<p>'+data.data[i].user.receipt_name+'</p>';
                   html+='<p>'+data.data[i].user.payment_ac+'</p>'
               }
              
               html+='</td>';
               var price_money;
               var price_1;
               if(data.data[i].robbinginfo==null || data.data[i].robbinginfo==undefined){
                     html+='<td>'+data.data[i].estimate_price+'</td>';
               }else{
                   if(data.data[i].mode=="1"){
                      html+='<td>'+data.data[i].estimate_price+'</td>';
                   }else{
                      html+='<td>'+data.data[i].estimate_price+'</td>';
                   }
               }
               if(data.data[i].is_status=="1"){
                  html+='<td>'+data.data[i].actual_price+'</td>';
                  html+='<td>';
                  html+='<a href="javascript:;" class="order_jishua" id="'+data.data[i].id+'">结算</a>';
                  html+='<a href="javascript:;" class="order_quxiao" id="'+data.data[i].id+'">取消</a>';
               }else if(data.data[i].is_status=="2"){
                 html+='<td>'+data.data[i].actual_price+'</td>';
                 html+='<td>';
                  html+='<a href="javascript:;" class="order_tablist" id="'+data.data[i].id+'">已结算</a>';
                  html+='<a href="javascript:;" class="order_del" id="'+data.data[i].id+'">撤回</a>';  
               }else if(data.data[i].is_status=="3"){
                 html+='<td>'+data.data[i].actual_price+'</td>';
                 html+='<td>';
                 html+='<a href="javascript:;" class="order_tablist" id="'+data.data[i].id+'">已取消</a>';
                 html+='<a href="javascript:;" class="order_del" id="'+data.data[i].id+'">撤回</a>';
               }
               html+='</td>';
               html+='</tr>';
            }
            $("#order_tbody").html(html);//拼接字符存入tbody

            /* 撤回事件调用 */
            $(".order_del").bind("click", function(){
                 var _this=$(this);
                 var id=_this.attr("id");
                 member_del(_this,id)
            })
            /* 结算调用 */
            $(".order_jishua").bind("click",function(){
                var id=$(this).attr("id");
                x_admin_show('结算','settlement.html?'+id,520,480);
            });
            /*  取消调用  */
            $(".order_quxiao").bind("click",function(){
                var id=$(this).attr("id");
                opensettquxiao();
                opensettle_ajax(id);
                  
            })
            /* 已结算,已取消 */
            $(".order_tablist").bind("click",function(){
                var id = $(this).attr("id");
                opensett();
                opensettle_ajax(id)
                
            })
       }
       
        /* 分页方法  */
       function page_orderlist(num,currentnum){
           $('#orderlistpage').jqPaginator({
                   totalCounts:currentnum,
                   visiblePages:10,
                   currentPage:num,
                   pageSize:pagesize,
                   activeClass:'active',
                   first: '<li class="first"><a href="javascript:void(0);">首页</a></li>',
                   prev: '<li class="prev"><a href="javascript:void(0);"><<</a></li>',
                   next: '<li class="next"><a href="javascript:void(0);">>></a></li>',
                   last: '<li class="last"><a href="javascript:void(0);">尾页</a></li>',
                   page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
                   onPageChange: function (num, type) {
                       order_ajax(num);
                       $(".input-page").val("");
                       $("#address_currentnum").text(currentnum);
                        /* 选择跳转页面 */
                        $(".order_btn2").click(function(){
                        	 console.log("2");
                             var re = /^[1-9]+[0-9]*]*$/;
                             num = $(".input-page").val();
                             var apagelenth = $("#orderlistpage li.page");
                             for(var i=0;i<apagelenth.length;i++){
                                if(apagelenth[i].innerText==num){
                                    apagelenth[i].className=['page'+" "+'active'];
                                }else{
                                    apagelenth[i].className="page";
                                }
                             }
                             if(!re.test(num)){
                               return;  
                             }else{
                               order_ajax(num);
                             }
                                  
                         })
                   }
                });

       }
       
      /*用户-撤回方法*/
      function member_del(obj,id){
          layer.confirm('确认要撤回吗？',function(index){
              //发异步撤回
              settlement_ajaxquxiao(id);
             /* $(obj).parents("tr").remove();*/
              layer.msg('已撤回!',{icon:1,time:1000});
                 order_ajax(num);
              
          });
      }

      /* 已结算，已取消弹出层 */
      function opensett(){
          layer.open({
            type: 1, 
            area:['520px','480px'],
            content: '<div id="opensett_div"><p class="opensett_p"><span>订单号:</span><span class="opensett_span" id="order_number"></span></p><p class="opensett_p"><span>会员账号:</span><span class="opensett_span" id="username"></span></p><p class="opensett_p" id=""><span>支付宝姓名:</span><span class="opensett_span" id="payment_name"></span></p><p class="opensett_p"><span>支付宝账号:</span><span class="opensett_span" id="payment_ac"></span></p><p class="opensett_p"><span>货品名称:</span><span class="opensett_span" id="good_name"></span></p><p class="opensett_p"><span>货品数量:</span><span class="opensett_span" id="quantity"></span></p><p class="opensett_p"><span>货品交易方式:</span><span class="opensett_span" id="mode"></span></p><p class="opensett_p"><span>订单预估结算金额:</span><span class="opensett_span" id="estimate_price"></span></p><p class="opensett_actual" style="display:none;"><span>实际结算金额:</span><span class="opensett_spans" id="actual_price"></span></p><p class="opensett_ps" ><span>商家备注:</span><span class="opensett_spans" id="business_rm"></span></p><p class="opensett_ps"><span>订单状态:</span><span class="opensett_spans" id="is_status"></span></p></div>' 
          });
      }
      /* 取消弹出层 */
      function opensettquxiao(){
          layer.open({
            type: 1, 
            title:['取消结算'],
            area:['520px','480px'],
            content: '<div id="opensett_div"><p class="opensett_p" id="goodid" style="display:none;"></p><p class="opensett_p"><span>订单号:</span><span class="opensett_span" id="order_number"></span></p><p class="opensett_p"><span>会员账号:</span><span class="opensett_span" id="username"></span></p><p class="opensett_p" id=""><span>支付宝姓名:</span><span class="opensett_span" id="payment_name"></span></p><p class="opensett_p"><span>支付宝账号:</span><span class="opensett_span" id="payment_ac"></span></p><p class="opensett_p"><span>货品名称:</span><span class="opensett_span" id="good_name"></span></p><p class="opensett_p"><span>货品数量:</span><span class="opensett_span" id="quantity"></span></p><p class="opensett_p"><span>货品交易方式:</span><span class="opensett_span" id="mode"></span></p><p class="opensett_p"><span>订单预估结算金额:</span><span class="opensett_span" id="estimate_price"></span></p><form class="layui-form" id="quxiao"><p class="opensett_ps" ><span>商家备注:</span><input type="text" name="business_rm" class="layui-input input-business_rm"></p><p class="opensett_ps"><p table_jiesua_btn><button   class="layui-btn table_jiesua_btnok" lay-filter="quxiao" lay-submit="">确定取消</button></p></form></div>' 
          });
      }

      /* 撤回接口 */
      function settlement_ajaxquxiao(id){
         $.ajax({
             url:"/api/v1/order/cancel/"+id+"/chexiao",
             dataType:"json",
             type:"post",
             success:function(res){
                 console.log(res);
             },
             error:function(error){
                console.log(error);
             }
          })
      }

      /* 已结算，已取消接口*/
      function opensettle_ajax(id){
         $.ajax({
             url:"/api/v1/order/getoneorder/"+id,
             dataType:"json",
             type:"get",
             success:function(res){
                 $("#goodid").text(res.data.id);
                 $("#order_number").text(res.data.order_number);
                 $("#username").text(res.data.username);
                 $("#payment_name").text(res.data.payment_name);
                 $("#payment_ac").text(res.data.payment_ac);
                 $("#good_name").text(res.data.good_name);
                 $("#quantity").text(res.data.quantity);
                 if(res.data.mode=="0"){
                   $("#mode").text("自行垫付");
                 }else if(res.data.mode=="1"){
                   $("#mode").text("货到付款");
                 }else if(res.data.mode=="2"){
                   $("#mode").text("现货直邮");
                 }
                 $("#estimate_price").text(res.data.estimate_price);
                 
                 $("#business_rm").text(res.data.business_rm);
                 if(res.data.is_status=="2"){
                   $(".opensett_actual").show();
                   $("#actual_price").text(res.data.actual_price);
                   $("#is_status").text("已结算");
                 }else if(res.data.is_status=="3"){
                   $("#is_status").text("已取消");
                 }
             },
             error:function(error){
                 console.log(error);
             }
          })
      }
      
      layui.use(['form','layer'], function(){
          $ = layui.jquery;
          var form = layui.form
          ,layer = layui.layer;  

          //监听提交
          form.on('submit(quxiao)', function(data){
            var shunju=$("#quxiao").serialize();
            var id=$("#goodid").text();
           
            //发异步，把数据提交给php
            quxiao_ajax(id,shunju);
            
          });
           /* 取消提交接口方法 */
           function quxiao_ajax(id,shunju){
               $.ajax({
                     url:"/api/v1/order/cancel/"+id+"/quxiao",
                     data:shunju,
                     dataType:"json",
                     type:"post",
                     success:function(res){
                         if(res.code=="201"){
                            layer.msg('取消成功',{icon:1,time:1000},function(){
                                var index = parent.layer.getFrameIndex(window.name);
                                //关闭当前frame
                                parent.layer.close(index);
                                order_ajax(num);
                               
                            })
                         }else{
                            layer.msg('取消失败',{icon:1,time:1000})
                         }
                     },
                     error:function(error){
                        console.log(error);
                        layer.msg('取消失败',{icon:1,time:1000})
                     }
                  });
           }
     
     })

      /* 条件选择接口 */
      function searchorder_ajax(date,num){
          $.ajax({
            url:"/api/v1/order/ordersortquery/"+date+"/"+num+"/"+pagesize,
            dataType:"json",
            type:"get",
            success:function(res){
              currentnum=res.total_number;
              page_orderlist_search(date,currentnum);
            },
            error:function(error){
              console.log(error)
            }
          })
       }
       /* 条件分页方法  */
       function page_orderlist_search(date,currentnum){
           $('#orderlistpage').jqPaginator({
                   totalCounts:currentnum,
                   visiblePages: 10,
                   currentPage:num,
                   pageSize:pagesize,
                   activeClass:'active',
                   first: '<li class="first"><a href="javascript:void(0);">首页</a></li>',
                   prev: '<li class="prev"><a href="javascript:void(0);"><<</a></li>',
                   next: '<li class="next"><a href="javascript:void(0);">>></a></li>',
                   last: '<li class="last"><a href="javascript:void(0);">尾页</a></li>',
                   page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
                   onPageChange: function (num, type) { 
                       console.log(date,num);
                       searchorder_ajaxbody(date,num);
                       $(".input-page").val("");
                       $("#address_currentnum").text(currentnum);
                       /* 选择页数来跳转页面 */
                        $(".order_btn1").click(function(){
                           
                             var re = /^[1-9]+[0-9]*]*$/;
                             num = $(".input-page").val();
                             var apagelenth = $("#orderlistpage li.page");
                             for(var i=0;i<apagelenth.length;i++){
                                if(apagelenth[i].innerText==num){
                                    apagelenth[i].className=['page'+" "+'active'];
                                }else{
                                    apagelenth[i].className="page";
                                }
                             }
                             if(!re.test(num)){
                               return;  
                             }else{
                               searchorder_ajaxbody(date,num);
                             }
                                  
                         })
                   }
                });

       }
       function searchorder_ajaxbody(date,num){
          $.ajax({
            url:"/api/v1/order/ordersortquery/"+date+"/"+num+"/"+pagesize,
            dataType:"json",
            type:"get",
            success:function(res){
               console.log(res);
               $("#order_tbody").html("");
               order_tbody(res);
            },
            error:function(error){
               console.log(error)
            }
          })
       }

       $("#order_selectstatus").change(function(){
            var selectstatus = $(this).val();
            num=1;
            searchorder_ajax(selectstatus,num);
            $(".input-page").val("");
       })

       $("#order_paixu").change(function(){
            var selectpaixu = $(this).val();
            num=1;
            searchorder_ajax(selectpaixu,num);
            $(".input-page").val("");
       })
      
      

})  
