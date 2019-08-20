/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-05-30 16:49:51
 * @version $Id$
 */



$(function(){
         var num=1;//当前页数
         var pagecount=15;//当前页数显示的条数
         var storage=window.localStorage;
         storage.removeItem("username_member");
         storage.removeItem("username_shop");
         layui.use('layer', function(){
           var layer = layui.layer;
           layer.load();
          
         });
          ajaxlist(num,10); //初始化加载数据
          function ajaxlist(num,pagecount){
             $.ajax({
                url:"/api/v1/shopinfo/address/"+num+"/"+pagecount,
                dataType:"json",
                type:"get",
                success:function(res){

                   var currentnum=res.total_number;
                   page_address(currentnum);
                },error:function(XMLHttpRequest,StatusText,errorThrown){
                   layer.closeAll('loading');
                   console.log(XMLHttpRequest);
                   console.log(StatusText);
                   console.log(errorThrown);
                }
             })
          }
         function addreslisttable(num){
           $.ajax({
              url:"/api/v1/shopinfo/address/"+num+"/"+pagecount,
              dataType:"json",
              type:"get",
              success:function(res){
                 console.log(res);
                 layer.closeAll('loading');
                 $("#addresslist_tbody").html("");
                 addresslist(res);//拼接方法
              },
              error:function(XMLHttpRequest, textStatus, errorThrown){
                 layer.closeAll('loading');
                 console.log(errorThrown);
              }
           });
         }
           /* addresslist字符串拼接方法 */
           function addresslist(data){
              var html='';
              for(var i=0;i<data.date.length;i++){
                html+='<tr>';
                html+='<td style="text-align:center;width:15%;">'+data.date[i].id+'</td>';
                html+='<td><span>'+data.date[i].address+'<span><span>&nbsp;'+data.date[i].address1+'</span></td>';
                html+='<td style="text-align:center;width:25%">'+data.date[i].create_time+'</td>';
                html+='<td style="text-align:center;width:15%;">';
                html+='<a title="删除" class="addresslist_del" href="javascript:;" id="'+data.date[i].id+'">删除</a>'
                html+='</td>';
                html+='</tr>';
               }
               $("#addresslist_tbody").append(html);
                /* 绑定删除事件 */
               $(".addresslist_del").bind("click", function(){
                   var _this=$(this);
                   var id=_this.attr("id");
                   console.log(id);
                   member_del(_this,id)
 
                 });
           }
           /*用户-删除*/
          function member_del(obj,id){
              layer.confirm('确认要删除吗？',function(index){
                 //发异步删除数据
                 $.ajax({
                    url:"/api/v1/shopinfo/"+id,
                    dataType:"json",
                    type:"get",
                    success:function(res){
                       console.log(res);
                       if(res.code=="201"){
                         $(obj).parents("tr").remove();
                         layer.msg('已删除!',{icon:1,time:1000}); 
                       }
                    },
                    error:function(XMLHttpRequest,textStatus,errorThrown){
                       console.log(textStatus);
                    }
                 })
                 
             });
          }
           /* 分页方法 */
          function page_address(currentnum){
              $('#addresslistpage').jqPaginator({
                   totalCounts:currentnum, //总条数
                   currentPage:num, //当前页数
                   visiblePages:10, //设置最多显示的页码数
                   pageSize:pagecount, //每页显示条数
                   activeClass:'active',
                   first: '<li class="first"><a href="javascript:void(0);">首页</a></li>',
                   prev: '<li class="prev"><a href="javascript:void(0);"><<</a></li>',
                   next: '<li class="next"><a href="javascript:void(0);">>></a></li>',
                   last: '<li class="last"><a href="javascript:void(0);">尾页</a></li>',
                   page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
                   onPageChange: function (num, type) {
                       addreslisttable(num);
                       $(".input-page").val("");
                       $("#address_currentnum").text(currentnum);
                       
                   }
                });
          }
         
           /* input输入跳转到对应的页数 */
          $("#input-page").click(function(){
              var apagelenth = $("#addresslistpage li.page");
              nums = $(".input-page").val();
              for(var i=0;i<apagelenth.length;i++){
                 if(apagelenth[i].innerText==nums){
                     apagelenth[i].className=['page'+" "+'active'];
                 }else{
                     apagelenth[i].className="page";
                 }
              }
              var re = /^[1-9]+[0-9]*]*$/;
              if(!re.test(nums)){
                return;  
              }else{
                addreslisttable(nums);
              }  
          })

})
      


