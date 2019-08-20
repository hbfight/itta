/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-06-29 14:46:40
 * @version $Id$
 */
$(function(){
	    var num=1;
      var pagesize=10;
      var pagenum;
      var currentnum;
      var storage=window.localStorage;
      layui.use('layer', function(){
          var layer = layui.layer;
          layer.load();
          
      });
      ajaxinit();//初始化加载页面
      function ajaxinit(){ 
        $.ajax({
          url:"/api/v1/uservip/userlist/"+num+"/"+pagesize,
              dataType:"json",
              type:"get",
              success:function(res){
                layer.closeAll('loading');
                console.log(res);
                if(res.data=="" || res.data==null){
                  $("#shoplist_tbodynone").show();
                  $(".memberlist_page").hide();
                }else{
                    currentnum=res.total_number;
                    memberlist_tbody(res);
                }
               
                /*page_memberelist(currentnum)*/
              },
              error:function(error){
                console.log(error);
              }
        })
      }  

      /* memberlist接口方法 */
      function memberlist(num){
          $.ajax({
              url:"/api/v1/uservip/userlist/"+num+"/"+pagesize,
              dataType:"json",
              type:"get",
              success:function(res){
                $("#memberlist_tbody").html("");
                memberlist_tbody(res);
              },
              error:function(error){
                console.log(error);
              }
          })
      }
      /* 拼接方法 */
      function memberlist_tbody(data){
           var html="";
           for(i=0;i<data.data.length;i++){
               html+='<tr>';
               html+='<td>'+data.data[i].user_id+'</td>';
               html+='<td>'+data.data[i].username+'</td>';
               html+='<td>'+data.data[i].create_time+'</td>';
               html+='<td>';
               html+='<p>'+data.data[i].receipt_name+'</p>';
               html+='<p>'+data.data[i].payment_ac+'</p>'
               html+='</td>'
               html+='<td>';
               html+='<p>'+data.data[i].address_name+'</p>';
               if(data.data[i].user_address==null){
                  html+='<p class="shoplist_address_over"></p>';
               }else{
                  html+='<p title="'+data.data[i].user_address+'" class="shoplist_address_over">'+data.data[i].user_address+'</p>';
               }
               html+='</td>';
               var anumprice=0, //总实际结算佣金
                   enumprice=0; //总预估结算佣金
               for(var j=0;j<data.data[i].order.length;j++){
                  anumprice += Math.floor(data.data[i].order[j].actual_price);
                  if(data.data[i].order[j].is_status=="1"){
                    enumprice += Math.floor(data.data[i].order[j].estimate_price);
                  }else{

                  }
               }
               html+='<td>'+anumprice.toFixed(2)+'</td>';
               html+='<td>'+enumprice.toFixed(2)+'</td>';
               html+='<td class="td-manage">';
               html+='<a title="报单列表" href="settlement_order.html?'+data.data[i].username+'">报单列表</a>';
               html+='<a title="编辑"  class="memberlist_edit"  href="javascript:0;" val="'+anumprice.toFixed(2)+'" value="'+enumprice.toFixed(2)+'" id="'+data.data[i].user_id+'">&nbsp;编辑&nbsp;</a>';
               html+='<a title="删除" class="memberlist_del"  href="javascript:;" id="'+data.data[i].user_id+'">&nbsp;删除&nbsp;</a>';
               html+='</td>';
               html+='</tr>';
           }
           $("#memberlist_tbody").append(html);  
           memberlist_edit();  //编辑方法
           del();//调用删除方法
           
      }

      setTimeout(function(){
        if(currentnum==""){
          page_memberelist(1);
        }else{
          page_memberelist(currentnum);
        }
      },1500)
      /* 分页方法  */
      function page_memberelist(currentnum){
        $('#memberlistpage').jqPaginator({
                   /*totalPages: pagenum,*/
            totalCounts:currentnum, //总条数
            currentPage:num, //当前页数
            pageSize:pagesize, //当前页的条数
            visiblePages:10, //设置最多显示的页码数
            activeClass:'active',
            first: '<li class="first"><a href="javascript:void(0);">首页</a></li>',
            prev: '<li class="prev"><a href="javascript:void(0);"><<</a></li>',
            next: '<li class="next"><a href="javascript:void(0);">>></a></li>',
            last: '<li class="last"><a href="javascript:void(0);">尾页</a></li>',
            page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
            onPageChange: function (num) {
                memberlist(num);
                console.log(currentnum);
                $("#address_currentnum").text(currentnum);
                /* 输入页数点击跳转到对应的页面 */
                $(".member_btn1").click(function(){
                    var re = /^[1-9]+[0-9]*]*$/;
                    num = $(".input-page").val();
                    var apagelenth = $("#memberlistpage li.page");
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
                             memberlist(num);
                           }
                       })  
                      
                   }
        });

      }



       /* 第一个选择条件查询 */
      $("#memberlist_select_1").change(function(){
           var select1 = $(this).val();
           num=1;
           $(".memberlist_page").show();
           search_ajaxinit(select1,num);
           $(".input-page").val("");
      })
 
      /*  第二个选择条件查询  */
      $(".member_btn_submit").click(function(){
         var select2 = $('#memberlist_select_2 option:selected').val();
         var inputval = $("input[name='username']").val(); 
         if(select2 == "0"){
           layer.msg("请选择条件",{icon:2,time:2000});
         }else{
            if(inputval == ""){
               layer.msg("会员账号或支付宝账号不能为空",{icon:2,time:2000});
            }else{
              $.ajax({
                   url:"/api/v1/uservip/userscreenquery/"+select2+"/"+inputval,
                   dataType:"json",
                   type:"get",
                   success:function(res){
                      console.log(res);
                      $("#memberlist_tbody").html("");
                      reperic_tobdy(res);
                      $(".memberlist_page").hide();
                   },
                   error:function(error){
                      console.log(error)

                   }
                })
            } 
         }  
      })

      /* 条件查询分页方法  */
      function searchpage_memberelist(date,currentnum){
           $('#memberlistpage').jqPaginator({
                   totalCounts:currentnum, //总条数
                   currentPage:num, //当前页数
                   pageSize:pagesize, //当前页的条数
                   visiblePages:10, //设置最多显示的页码数
                   activeClass:'active',
                   first: '<li class="first"><a href="javascript:void(0);">首页</a></li>',
                   prev: '<li class="prev"><a href="javascript:void(0);"><<</a></li>',
                   next: '<li class="next"><a href="javascript:void(0);">>></a></li>',
                   last: '<li class="last"><a href="javascript:void(0);">尾页</a></li>',
                   page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
                   onPageChange: function (num) {
                       search_memberlist(date,num);
                       $("#address_currentnum").text(currentnum);
                       /* 输入页数点击跳转到对应的页面 */
                       $(".member_btn1").click(function(){
                           var re = /^[1-9]+[0-9]*]*$/;
                           num = $(".input-page").val();
                           var apagelenth = $("#memberlistpage li.page");
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
                             search_memberlist(date,num);
                           }
                       })  
                      
                   }
                });

      }

      /* 条件查询初始化加载方法 */
      function search_ajaxinit(date,num){
        $.ajax({
          url:"/api/v1/uservip/usersortquery/"+date+"/"+num+"/"+pagesize,
              dataType:"json",
              type:"get",
              success:function(res){
                console.log(res);
                currentnum=res.total_number;
                searchpage_memberelist(date,currentnum)
              },
              error:function(error){
                console.log(error);
              }
        })
      }
      /* 条件查询分页时调用接口方法 */
      function search_memberlist(date,num){
          $.ajax({
              url:"/api/v1/uservip/usersortquery/"+date+"/"+num+"/"+pagesize,
              dataType:"json",
              type:"get",
              success:function(res){
                $("#memberlist_tbody").html("");
                memberlist_tbody(res);
              },
              error:function(error){
                console.log(error);
              }
          })
      }

      /* 条件查询无分页拼接 */
      function reperic_tobdy(data){
        var html ='<tr>';
        html+='<td>'+data.data.user_id+'</td>';
        html+='<td>'+data.data.username+'</td>';
        html+='<td>'+data.data.create_time+'</td>';
        html+='<td>';
        html+='<p>'+data.data.receipt_name+'</p>';
        html+='<p>'+data.data.receipt+'</p>'
        html+='</td>'
        html+='<td>';
        html+='<p>'+data.data.address_name+'</p>';
        if(data.data.user_address==null){
          html+='<p></p>';
        }else{
          html+='<p>'+data.data.user_address+'</p>';
        }
        html+='</td>';
        var anumprice=0, //总实际结算佣金
            enumprice=0; //总预估结算佣金
        for(var j=0;j<data.data.order.length;j++){
           anumprice += Math.floor(data.data.order[j].actual_price);
           if(data.data.order[j].is_status=="1"){
             enumprice += Math.floor(data.data.order[j].estimate_price);
           }else{
           }
        }
        html+='<td>'+anumprice.toFixed(2)+'</td>';
        html+='<td>'+enumprice.toFixed(2)+'</td>';
        html+='<td class="td-manage">';
        html+='<a title="报单列表" href="settlement_order.html?'+data.data[i].username+'">报单列表</a>';
        html+='<a title="编辑" class="memberlist_edit" href="javascript:0;" val="'+anumprice.toFixed(2)+'" value="'+enumprice.toFixed(2)+'" id="'+data.data[i].user_id+'">&nbsp;编辑&nbsp;</a>';
        html+='<a title="删除" class="memberlist_del"  href="javascript:;" id="'+data.data.user_id+'">&nbsp;删除&nbsp;</a>';
        html+='</td>';
        html+='</tr>';
           
        $("#memberlist_tbody").append(html);
        del(); //删除方法
        memberlist_edit();//编辑方法
       
      }

      function memberlist_edit(){
        $(".memberlist_edit").click(function(){
           var anumprice_l=$(this).attr("val");
           var enumprice_l=$(this).attr("value");
           var id=$(this).attr("id");
           console.log(anumprice_l);
           console.log(enumprice_l);
           window.localStorage.setItem("member_anumprice",anumprice_l);
           window.localStorage.setItem("member_enumprice",enumprice_l);
           window.location.href="memberlist_edit.html?"+id;
        })
      }
    
      /* 删除方法 */
      function del(){
         $(".memberlist_del").click(function(){
            var _this=$(this);
            var userid=_this.attr("id");
            layer.confirm('确认要删除吗,删除后将不能恢复？',function(index){
                //发异步删除数据
                $.ajax({
                    url:'/api/v1/uservip/deluser/'+userid,
                    dataType:'json',
                    type:"get",
                    success:function(res){
                        console.log(res);
                        _this.parent().parent("tr").remove();
                        if($("#memberlist_tbody").find("tr").length==0){
                             $("#memberlist_tbody").hide();
                        }else{
                             $("#memberlist_tbody").show();
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

     
})
