/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-05-29 21:32:58
 * @version $Id$
 */


$(function(){
      var num=1; //当前页数
      var pagecount=5; //当前页条数
      var currentnum; //总条数
      var storage=window.localStorage;
      storage.removeItem("username_member"); //删除本地缓存
      storage.removeItem("username_shop"); //删除本地缓存

      /* 时间控件选择 */
      layui.use('laydate', function(){
        var laydate = layui.laydate;
        //执行一个laydate时间控件实例
        laydate.render({
          elem: '#start' //指定元素
          ,range:true
              ,done:function(value,date,endDate){
                 console.log(date);
                 console.log(endDate);
                 var startDate,startyer,startmonth,startday;
                 var endDates,endyear,endmonth,endday;
                 /*开始时间*/
                 startyear=date.year;
                 startmonth=date.month;
                 startday=date.date;
                 if(startmonth<10){
                 	startmonth="0"+startmonth;
                 }
                 if(startday<10){
                 	startday="0"+startday;
                 }
                 startDate=startyear+"-"+startmonth+"-"+startday;
                 
                 /* 结束时间 */
                 endyear=endDate.year;
                 endmonth=endDate.month;
                 endDay=endDate.date;
                 if(endmonth<10){
                    endmonth="0"+endmonth;
                 }
                 if(endDay<10){
                 	endDay="0"+endDay;
                 }


                 endDates=endyear+"-"+endmonth+"-"+endDay;
                 /* 开始-结束时间拼接一起 */
                 var startTime=Date.parse(startDate)/1000;
                 var endTime=Date.parse(endDates)/1000;
                 console.log(startTime);
                 console.log(endTime);
                 if(startTime==endTime){
                    return;
                 }else{
                 	var datetime=startTime+","+endTime;
                    num=1;
                    shoppage_search(datetime,num,pagecount);
                 }
              
              }
        });
      });   

      layui.use('layer', function(){
          var layer = layui.layer;
          layer.load();
          
      });
        shoppage(1,5);//数据进入默认加载每页5条  
         /* 初始化加载数据 */
        function shoppage(num,pagecount){
            $.ajax({
                url:"/api/v1/shopinfo/shoplist/"+num+"/"+pagecount,
                dataType:'json',
                type:'get',
                success:function(res){
                    console.log(res);
                    if(res.data==""){
                      layer.closeAll('loading');
                      $("#shoplist_tbodynone").show();
                      $("#shoplist_page").hide();
                    }else{
                      currentnum=res.total_number;
                      shoplistpage(currentnum);
                    }
                 },error:function(error){
                     layer.closeAll('loading');
                     console.log(error);
                  }
            });
        }
        

        /* ajax分页时获取数据 */
        function ajaxpage(num){
               $.ajax({
                     url:"/api/v1/shopinfo/shoplist/"+num+"/"+pagecount,
                     dataType:'json',
                     type:'get',
                     success:function(msg){
                        layer.closeAll('loading');
                        $("#shoplist_tbody").html("");
                        console.log(msg);
                        shoplist(msg);  
                     },error(error){
                        layer.closeAll('loading');
                        console.log(error);
                     }
               });
        }
        /*公共 table表格数据拼接方法 */
        function shoplist(data){
          var html='';
          if(data.data!=null || data.data != undefined){
          	 if(data.data.length=="0"){
          	 	$("#shoplist_tbodynone").show();
          	 }else{
                for(var i=0;i<data.data.length;i++){
                     
                     html+='<tr>';
                     html+='<td>';
                     html+='<div>'+data.data[i].good_id+'</div>';
                     html+='</td>';
                     html+='<td>';
                     html+='<div class="rushbuy_con">';
                     html+='<div>';
                     html+='<img src="'+data.data[i].img+'" class="rushbuy_conimg" />'; //字段图片
                     html+='</div>';
                     html+='<div class="rushbuy_condiv">';

                     html+='<h5 class="rushbuy_conh5 ovhidden" title="'+data.data[i].title+'">'+data.data[i].title+'</h5>';//名称
                     html+='<p class="rushbuy_contime ovhidden">抢购时间:<span>'+timestampToTime(data.data[i].rob_time)+'</span></p>';
                     html+='<p class="rushbuy_conhref ovhidden">抢购链接:<a href="">'+data.data[i].rob_href+'</a></p>'
                     html+='</div>';  
                     html+='</div>';
                     html+='</td>';
                     html+='<td>';
                     html+='<div class="shoplist_address_over">';
                     for(var j=0;j<data.data[i].address.length;j++){
                        html+='<p class="rushbuy_address shopaddno as'+j+'" title="'+data.data[i].address[j]+'">'+data.data[i].address[j]+'</p>';
                     }
                     html+='</div>';
                     html+='</td>';
                     html+='<td>'+data.data[i].number+'</td>';
                     html+='<td>'+data.data[i].price+'</td>';
                     html+='<td>'+data.data[i].settle_price+'</td>';
                     html+='<td>';
                     html+='<a title="报单列表" href="shoplist_order.html?'+data.data[i].good_id+'">报单列表</a>';
                     html+='<a title="查看" href="shopedit.html?'+data.data[i].good_id+'">&nbsp;编辑&nbsp;</a>';
                     html+='<a title="删除" class="shoplist_del" id="'+data.data[i].good_id+'">删除&nbsp;</a>';
                     if(data.data[i].declaration=="0"){
                        html+='<a title="关闭报单" class="user_declaration close_switch" id="'+data.data[i].good_id+'">关闭报单</a>';
                     }else{
                        html+='<a title="开启报单" class="user_declaration open_switch" id="'+data.data[i].good_id+'">开启报单</a>';
                     }
                     
                     html+='</td>';
                     html+='</tr>';
                  }
                  $("#shoplist_tbody").append(html);
                  $("#shoplist_tbodynone").hide();
                  declaration();//关闭报单信息 
                  declaration_ok();//开启报单信息
                  /*添加货品-删除*/
                  $(".shoplist_del").click(function(){
                     var _this=$(this);
                     var goodid=_this.attr("id");
                       
                     layer.confirm('确认要删除吗,删除后将不能恢复？',function(index){
                     //发异步删除数据
                     $.ajax({
                        url:'/api/v1/shopinfo/delrob/'+goodid,
                        dataType:'json',
                        type:"get",
                        success:function(res){
                          _this.parent().parent("tr").remove();
                          if($("#shoplist_tbody").find("tr").length==0){
                             $("#shoplist_tbody").hide();
                             $("#shoplist_tbodynone").show();
                          }else{
                             $("#shoplist_tbody").show();
                          }
                          layer.msg('已删除!',{icon:1,time:1000});
                        },
                        error:function(error){
                          
                          layer.msg('删除失败',{icon:1,time:1000});
                        }
                     })
                   
                         
                     });
                  })
                  
                }
           
           }else{
           	 $("#shoplist_tbodynone").show();
           } 
          
        }

        /* 默认分页数据加载方法 */
        function shoplistpage(currentnum){
          $('#shoplistpage').jqPaginator({
             totalCounts:currentnum, //总条数
             visiblePages: 10, //页面显示多少页数
             currentPage:num, //当前页
             pageSize:pagecount, //每页显示条数
             activeClass:'active',
             first: '<li class="first"><a href="javascript:void(0);">首页</a></li>',
             prev: '<li class="prev"><a href="javascript:void(0);"><<</a></li>',
             next: '<li class="next"><a href="javascript:void(0);">>></a></li>',
             last: '<li class="last"><a href="javascript:void(0);">尾页</a></li>',
             page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
             onPageChange: function (num, type) {
                 $("#address_currentnum").text(currentnum);
                 ajaxpage(num);
                 $(".input-page").val("");
                 /* 选择跳转页面 */
                 $("#input-page").click(function(){
                      var re = /^[1-9]+[0-9]*]*$/;
                      var nums = $(".input-page").val();
                      var apagelenth = $("#shoplistpage li.page");
                      for(var i=0;i<apagelenth.length;i++){
                         if(apagelenth[i].innerText==nums){
                             apagelenth[i].className=['page'+" "+'active'];
                         }else{
                             apagelenth[i].className="page";
                         }
                      }
                      if(!re.test(nums)){
                          return;  
                      }else{
                          ajaxpage(nums);
                      }
                           
                  })
             }
          });
        }

        /* 条件分页数据加载方法 */
        function shoplistpage_search(date,currentnum){
          $('#shoplistpage').jqPaginator({
             totalCounts:currentnum, //总条数
             visiblePages: 10, //页面显示多少页数
             currentPage:num, //当前页
             pageSize:pagecount, //每页显示条数
             activeClass:'active',
             first: '<li class="first"><a href="javascript:void(0);">首页</a></li>',
             prev: '<li class="prev"><a href="javascript:void(0);"><<</a></li>',
             next: '<li class="next"><a href="javascript:void(0);">>></a></li>',
             last: '<li class="last"><a href="javascript:void(0);">尾页</a></li>',
             page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
             onPageChange: function (num, type) {
                 $("#address_currentnum").text(currentnum);
                 searchshoplist_ajax(date,num,pagecount);
                 $(".input-page").val("");
                 /* 选择跳转页面 */
                 $("#input-page").click(function(){
                      var re = /^[1-9]+[0-9]*]*$/;
                      num = $(".input-page").val();
                      var apagelenth = $("#shoplistpage li.page");
                      for(var i=0;i<apagelenth.length;i++){
                         if(apagelenth[i].innerText==nums){
                             apagelenth[i].className=['page'+" "+'active'];
                         }else{
                             apagelenth[i].className="page";
                         }
                      }
                      if(!re.test(num)){
                        return;  
                      }else{
                        searchshoplist_ajax(date,num,pagecount);
                      }
                           
                  })
             }
          });
        }
        
       
        /* 搜索条件接口数据 */
        function searchshoplist_ajax(date,num,pagecount){
        	 $.ajax({
        	 	 url:"/api/v1/shopinfo/searchquery/"+date+"/"+num+"/"+pagecount,
        	 	 dataType:"json",
        	 	 type:"get",
        	 	 success:function(res){
                     console.log(res);
                     $("#shoplist_tbody").html("");
                     shoplist(res);
        	 	 },
        	 	 error:function(error){
                     console.log(error);
        	 	 }
        	 })
        }
         
        
       /* 限制地址得字数  */
       $("p.rushbuy_address").each(function(){
          var maxwidth=10;
          console.log($(this).text().length);
          if($(this).text().length>maxwidth){
             $(this).text($(this).text().substring(0,maxwidth));
             $(this).html($(this).html() + "...");
          }
       }) 
       
       /* 条件初始化加载数据 */
        function shoppage_search(date,num,pagecount){
            $.ajax({
                     url:"/api/v1/shopinfo/searchquery/"+date+"/"+num+"/"+pagecount,
                     dataType:'json',
                     type:'get',
                     success:function(res){
                        currentnum=res.total_number;
                         console.log(currentnum);
                         if(currentnum=="0"){
                         	currentnum=5;
                         	console.log(currentnum);
                         	shoplistpage_search(date,currentnum);
                         }
                            shoplistpage_search(date,currentnum);
                     }
               });
        } 

        /* 默认排序,保单,预估结算金额 */
       $("#shoplist_paixu").change(function(){
              var selectval=$(this).val();
              num=1;
              shoppage_search(selectval,num,pagecount);
              
       }) 

       $("#shoplist_type").change(function(){
       	    var selectType=$(this).val();
       	    num=1;
       	    shoppage_search(selectType,num,pagecount);
           
       })
        /* 关闭当前报单信息 */
        function declaration(){
          $(".close_switch").click(function(){
              var _this=$(this);
              var declaration_id=_this.attr("id");
              console.log(declaration_id);
              layer.confirm('确认要关闭报单吗？',function(index){
                $.ajax({
                   url:"/api/v1/oyupdate/de_switch",
                   data:{id:declaration_id},
                   dataType:"json",
                   type:"get",
                   success:function(res){
                     console.log(res)
                     _this.text("开启报单");
                     layer.msg('已关闭报单!',{icon:1,time:1000});
                   },
                   error:function(error){
                      console.log(error)
                      layer.msg('关闭报单失败!',{icon:1,time:1000});
                   }
                })
              })  
         })
       }
       /* 开启当前报单信息 */
        function declaration_ok(){
          $(".open_switch").click(function(){
              var _this=$(this);
              var declaration_id=_this.attr("id");
              console.log(declaration_id);
              layer.confirm('确认要开启报单吗？',function(index){
                $.ajax({
                   url:"/api/v1/oyupdate/de_switch",
                   data:{id:declaration_id},
                   dataType:"json",
                   type:"get",
                   success:function(res){
                     console.log(res)
                     _this.text("关闭报单");
                     layer.msg('已开启报单!',{icon:1,time:1000});
                   },
                   error:function(error){
                      console.log(error)
                      layer.msg('开启报单失败!',{icon:1,time:1000});
                   }
                })
              })  
         })
       }
        
        function order_status(id){
              $.ajax({
                 url:"/api/v1/oyupdate/order_status",
                 data:{id:id},
                 dataType:"json",
                 type:"get",
                 success:function(res){
                   console.log(res)
                 },
                 error:function(error){
                   console.log(error)
                 }
              })
         
       }


       /* 时间戳转化成时间 */
       function timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        Y = date.getFullYear() + '-';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        D = (date.getDate() < 10 ? '0' +(date.getDate()) : date.getDate());
        h = date.getHours() < 10 ? '0'+ date.getHours() : date.getHours();
        m = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
        s = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds();
        return Y+M+D+" "+h+":"+m+":"+s;
      }
})