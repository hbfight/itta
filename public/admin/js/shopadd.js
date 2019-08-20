/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-05-31 16:51:13
 * @version $Id$
 */
 $(function(){
        var times=new Date();
        var timeYear=times.getFullYear();
        var timeMonth=times.getMonth()+1;
        var timeDay=times.getDate();
        var timehours=times.getHours();
        var timeminets=times.getMinutes();
        var timescound=times.getSeconds();
        var lay_dateday=timeYear+"-"+timeMonth+"-"+timeDay+" "+timehours+":"+timeminets+":"+timescound;
        console.log(lay_dateday);
        //加载时间控件
        layui.use('laydate', function(){
           var laydate = layui.laydate;
            //执行一个laydate时间控件实例
            laydate.render({
              elem: '#startadd' //指定元素
              ,min: lay_dateday
              ,max: '2098-8-18 12:30:00'
              ,type:'datetime'
              
              
            });
        });

        /* 图片文件上传 */    
        layui.use('upload', function(){
        var upload = layui.upload;
        //执行实例
        var uploadInst = upload.render({
             elem: '#file_img' //绑定元素
             ,url: '/api/v1/shoinfo/upload' //上传接口
             ,field:'myfile'
             ,method:'post'
             ,before: function(obj){
                //预读本地文件示例，不支持ie8
                obj.preview(function(index, file, result){
                  $('#demo1').attr('src', result); //图片链接（base64）
                });
              }
             ,done: function(res){
               
               
               //上传完毕回调
               $("input[name='img']").val(res.data);
             }
             ,error: function(index,upload,error){ 
               //请求异常回调
             }
           });
        });

        /* form  */
        layui.use(['form','layer'], function(){
            $ = layui.jquery;
          var form = layui.form
          ,layer = layui.layer;
        
          //自定义验证规则
          form.verify({
            nikename: function(value){
              if(value.length < 5){
                return '昵称至少得5个字符啊';
              }
            }
            ,shopaddnumber:[/(.+){1,12}$/,'请输入正确的报单数量']
            ,shopaddnumber_x:[/^\d+(?=\.{0,1}\d+$|$)/,'请输入正确得下单金额']
            ,shopaddnumber_y:[/^\d+(?=\.{0,1}\d+$|$)/,'请输入正确得预估结算金额']
            
          });

          //监听提交
          form.on('submit(shopadd)', function(data){
            var shopadd=$("#rushbuy_add_body").serialize();
            
            //发异步，把数据提交给php
            $.ajax({
               url:"/api/v1/shopinfo/add",
               data:shopadd,
               dataType:"json",
               type:"post",
               success:function(res){
                  
                  if(res.code=="201"){
                      layer.msg('添加成功',{icon:1},function(){
                         window.location.href="shoplist.html";
                      });
                  }else{
                     layer.msg('添加失败',{icon:1});
                  }
               },
               error:function(error){
                 layer.msg(error.responseText,{icon:1});
               }
            })
            return false;

            
          });
          
          
        });

       


      var i=0;
      var g=0;
      /*   货品属性添加 */
      $("#add_btnshopname").click(function(){
           $(".addshop_goodname").show();
           g++;
           goodnametable(g);
      })
       /*  货品属性添加  */
      function goodnametable(i){
         var tr='<tr>';
         tr+='<td>';
         tr+='<input type="text" id="good_name'+i+'" name="good_name[]" required="" lay-verify="" class="layui-input layui-input-table" placeholder="请输入货品属性">';
         tr+='</td>';
         tr+='<td>';
         tr+='<a title="删除" class="good_namedel" href="javascript:;">删除</a>';
         tr+='</td>';
         tr+='</tr>';
         $(".shopnametbody").append(tr);
           /*添加货品-删除*/
           $(".good_namedel").click(function(){
              var _this=$(this);
              layer.confirm('确认要删除吗？',function(index){
              //发异步删除数据
              _this.parent().parent("tr").remove();
              if($("tbody.shopnametbody").find("tr").length==0){
                  $(".addshop_goodname").hide();
              }else{
                  $(".addshop_goodname").show();
              }
                  layer.msg('已删除!',{icon:1,time:1000});
              });
           })
      }
      /*  下单地址选择  */ 
      $("#add_btnshopaddress").click(function(){
      	    var addressoption= $('#address option:selected').val();
      	    var addressvalue=$('#address option:selected').text();
      	    if(addressoption!="0"){ //判断值等于0不添加
                i++;
                $("#shopnametableaddress").show();
                addresstable(addressvalue,i); //调用添加地址方法
            }
      })
      /* 下单地址添加方法 */
      function addresstable(address,i){
      	  var tr='<tr class="traddress">';
      	      tr+='<td>';
              tr+='<input type="text" id="addres'+i+'" name="address[]" class="shop_input-address" >'
              tr+='</td>'
      	      tr+='<td>';
      	      tr+='<span title="删除" class="address_del">删除</span>'
              tr+='</td>'              
      	      tr+='</tr>';
      	  $(".address_tbody").append(tr);
          for(var j=0;j<i;j++){
               
             $("input[id='addres"+i+"']").val(address); 
          }

           /*添加地址-删除*/
           $(".address_del").click(function(){
              var _this=$(this);
                
              layer.confirm('确认要删除吗？',function(index){
              //发异步删除数据
                 _this.parent().parent("tr").remove();
                 if($("tbody.address_tbody").find("tr").length==0){
                    $("#shopnametableaddress").hide();
                    $('#address-select').prop('selectedIndex', 0);
                 }else{
                   $("#shopnametableaddress").show();
                 }
                 layer.msg('已删除!',{icon:1,time:1000});
              });
           })
      }  

})
    

