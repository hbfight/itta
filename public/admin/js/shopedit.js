/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-06-01 16:02:12
 * @version $Id$
 */
$(function(){

        /* 获取id报单接口 */
      var id;  
      var searchURL = window.location.search;//获取路径
      id = searchURL.replace('?', '').split('&');
      $("#goodids").text(id);
        //加载时间控件
        layui.use('laydate', function(){
           var laydate = layui.laydate;
            //执行一个laydate时间控件实例
            laydate.render({
              elem: '#startadd' //指定元素
              ,type: 'datetime'
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
             ,error: function(index,upload){
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
              ,shopaddnumber: [/(.+){1,12}$/, '请输入正确的数字']  
            });
            //监听提交
            form.on('submit(shopadd)', function(data){
              var shopadd=$("#rushbuy_add_body").serialize();
              console.log(shopadd);
              var good_id=$("#goodids").text();
              console.log(good_id);
              //发异步，把数据提交给php
              $.ajax({
                 url:"/api/v1/shopinfo/edit/"+good_id,
                 data:shopadd,
                 dataType:"json",
                 type:"post",
                 success:function(res){
                    console.log(res);
                    if(res.code=="201"){
                        layer.msg('编辑成功',{icon:1,time:1000},function(){
                           window.location.href="shoplist.html";
                        });
                        
                    }else{
                       
                       layer.msg('编辑失败',{icon:1});
                    }
                 },
                 error:function(error){
                    console.log(error);
                    console.log(error.responseText);
                    layer.msg(error.responseText,{icon:1});
                   
                 }
              }) 
              return false; 
            });
        });

      var i=0;
      /* 货品属性添加 */
      /*$("#add_btnshopname").click(function(){
      	   console.log("1");
           i++;
           goodnametable_edit(i);
      })*/
      $("#add_btnshopname").bind("click",function(){
           $("#shopnametable").show();
           i++;
           goodnametable_edit(i);
      })
      
      /* 货品属性添加方法 */
      function goodnametable_edit(i){
         var tr='<tr>';
         tr+='<td>';
         tr+='<input type="text" id="good_name'+i+'" name="good_name[]" class="layui-input layui-input-table" placeholder="请输入货品属性">';
         tr+='</td>';
         tr+='<td>';
         tr+='<a title="删除" class="shopsup_del" href="javascript:;">删除</a>';
         tr+='</td>';
         tr+='</tr>';
         $(".shopnametbody").append(tr);
         //删除货品属性  
         $(".shopsup_del").click(function(){
           var _thissub=$(this);
           layer.confirm('确认要删除吗？',function(index){
              //发异步删除数据
              _thissub.parents("tr").remove();
              if($("tbody.shopnametbody").find("tr").length==0){
                  $("#shopnametable").hide();
                  /*$('#address-select').prop('selectedIndex', 0);*/
              }else{
                 $("#shopnametable").show();
              }
              layer.msg('已删除!',{icon:1,time:1000});
           });
         })
      }
      /*  货品属性编辑展示方法  */
      function goodnametable(goodname,i){
          var tr='';
        for(var a=0;a<goodname.length;a++){
         tr +='<tr>';
         tr+='<td>';
         tr+='<input type="text" id="good_name'+i+'" name="good_name[]" value="'+goodname[a]+'"  class="layui-input layui-input-table">';
         tr+='</td>';
         tr+='<td>';
         tr+='<a title="删除" class="shopsup_del" href="javascript:;">删除</a>';
         tr+='</td>';
         tr+='</tr>';
       }
         $(".shopnametbody").append(tr);
         //删除货品属性  
         $(".shopsup_del").click(function(){
           var _thissub=$(this);
           layer.confirm('确认要删除吗？',function(index){
              //发异步删除数据
              _thissub.parents("tr").remove();
              if($("tbody.shopnametbody").find("tr").length==0){
                  $("#shopnametable").hide();
                  /*$('#address-select').prop('selectedIndex', 0);*/
              }else{
                 $("#shopnametable").show();
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
              tr+='<input type="text" id="addres'+i+'" name="address[]" class="shop_input-address">'
              tr+='</td>'
      	      tr+='<td>';
      	      tr+='<span title="删除" class="address_del">删除</span>'
              tr+='</td>'              
      	      tr+='</tr>';
      	  $(".address_tbody").append(tr);
          for(var j=0;j<i;j++){
             $("input[id='addres"+i+"']").val(address); 
          }
          add_del();
      }

      /* 下单地址编辑展示方法 */
      function addresstable_edit(dataaddress,add1,i){
          var datalength=dataaddress.length;
          var tr='';
          for(var a=0;a<datalength;a++){
              tr+='<tr class="traddress">';
              tr+='<td>';
              tr+='<input type="text" id="addres'+i+'" name="address[]" class="shop_input-address" value="'+dataaddress[a]+'" >'
              tr+='</td>'
              tr+='<td>';
              tr+='<span title="删除" class="address_del">删除</span>'
              tr+='</td>'              
              tr+='</tr>';
           }   
          $(".address_tbody").append(tr);
          var onevalue=$(".traddress:first-child input").val()+"-"+add1;
          $(".traddress:first-child input").val(onevalue);
          add_del();
          
      }
       /*添加地址-删除*/
      function add_del(){
        $(".address_del").click(function(){
            var _this=$(this);
           layer.confirm('确认要删除吗？',function(index){
              //发异步删除数据
              _this.parents("tr").remove();
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
      
      /* 根据Id获取数据进行编辑 */
      shopedit(id);
      function shopedit(id){
         $.ajax({
             url:"/api/v1/shopinfo/getEditInfo/"+id,
             dataType:"json",
             type:"get",
             success:function(res){
               console.log(res);
               $("input[name='title']").val(res.data.title);  //抢购标题
               $("input[name='number']").val(res.data.number); //报单数量
               $("input[name='price']").val(res.data.price); //下单金额
               $("input[name='settle_price']").val(res.data.settle_price); //预结算金额
               var robtime=timestampToTime(res.data.rob_time)
               $("input[name='rob_time']").val(robtime); //抢购时间
               $("select[name='return_time'] option:selected").val(res.data.return_time);
               var return_time=res.data.return_time;
               return_times(return_time);
               
               /* 抢购类型  */
               var type=res.data.type;
               types(type);
               /* end  */
               /* 购买渠道 */
               var channel = res.data.channel;
               channels(channel);
               
               /* end */
               $("input[name='img']").val(res.data.img); //图片
               $("#demo1").attr("src",res.data.img);
               $("input[name='rob_href']").val(res.data.rob_href); //购买链接
               $("input[name='voucher_href']").val(res.data.voucher_href); //领卷链接
               $("input[name='code']").val(res.data.code); //购买代码
               $("input[name='address_prompt']").val(res.data.address_prompt);
               $("#explain").val(res.data.explain); //抢购说明
               $("#rule").val(res.data.rule);  //报单填写规则
               $("input[name='good_name']").val(res.data.good_name);//货品属性名称
               console.log(res.data.address.length);
               addresstable_edit(res.data.address,res.data.address1,i);
               goodnametable(res.data.good_name,i);
             },
             error:function(error){
               console.log(error);
             }
         })
      }
      /* 抢购类型方法  */
      function types(type){
         $("select[name='type'] option[value='"+type+"']").remove();
         if(type=="1"){
            $("select[name='type']").prepend('<option value="'+type+'" selected>普通</option>');
         }else if(type="2"){
            $("select[name='type']").prepend('<option value="'+type+'" selected>置顶</option>');
         }else{
            $("select[name='type']").prepend('<option value="'+type+'" selected>长期</option>');
         }
      }
       /* 购买渠道方法 */
      function channels(channel){
        $("select[name='channel'] option[value='"+channel+"']").remove();
        if(channel=="1"){
            
           $("select[name='channel']").prepend('<option value="'+channel+'" selected>京东</option>');
        }else if(channel=="2"){
        
         $("select[name='channel']").prepend('<option value="'+channel+'" selected>天猫</option>');
        }else if(channel=="3"){
           
           $("select[name='channel']").prepend('<option value="'+channel+'" selected>苏宁</option>');
        }else if(channel=="4"){
        
           $("select[name='channel']").prepend('<option value="'+channel+'" selected>国美</option>');
        }else if(channel=="5"){
        
           $("select[name='channel']").prepend('<option value="'+channel+'" selected>淘宝</option>');
        }
      }
     
      /* 回款时间方法  */
      function return_times(return_time){
         $("select[name='return_time'] option[value='"+return_time+"']").remove();
         if(return_time=="0"){
            
             $("select[name='return_time']").prepend('<option value="'+return_time+'" selected>当天回款</option>');
         }else if(return_time=="1"){
           
            $("select[name='return_time']").prepend('<option value="'+return_time+'" selected>1天</option>');
         }else if(return_time=="2"){
            
            $("select[name='return_time']").prepend('<option value="'+return_time+'" selected>2天</option>'); 
         }else if(return_time=="3"){
           
           $("select[name='return_time']").prepend('<option value="'+return_time+'" selected>3天</option>');
         }else if(return_time=="4"){
           
            $("select[name='return_time']").prepend('<option value="'+return_time+'" selected>4天</option>');
         }else if(return_time=="5"){
            
            $("select[name='return_time']").prepend('<option value="'+return_time+'" selected>5天</option>');
         }else if(return_time=="6"){
            
            $("select[name='return_time']").prepend('<option value="'+return_time+'" selected>6天</option>');
         }else if(return_time=="7"){
           
           $("select[name='return_time']").prepend('<option value="'+return_time+'" selected>7天</option>');
         }else if(return_time=="8"){
           
           $("select[name='return_time']").prepend('<option value="'+return_time+'" selected>8天</option>');
         }else if(return_time=="9"){
          
            $("select[name='return_time']").prepend('<option value="'+return_time+'" selected>9天</option>');
         }else if(return_time=="10"){
           
            $("select[name='return_time']").prepend('<option value="'+return_time+'" selected>10天</option>');
         }
      }

      function timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        Y = date.getFullYear() + '-';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        D = (date.getDate() < 10 ? '0' +(date.getDate()) : date.getDate());
        h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
        m = (date.getMinutes() < 10 ? '0' +(date.getMinutes()) : date.getMinutes());
        s = (date.getSeconds() < 10 ? '0' +(date.getSeconds()) : date.getSeconds());
        return Y+M+D+" "+h+":"+m+":"+s;
    }
    
})
