/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-06-11 21:23:28
 * @version $Id$
 */

    $(function(){
            var searchURL = window.location.search;//获取路径
            var good_id = searchURL.replace('?', '').split('&');
            var storage=window.localStorage;
            var userphone=storage.getItem("username");
            $.toast.prototype.defaults.duration="1500";//设置默认时间为1s
            
            details_ajax();
            
           
            console.log(userphone);
            function details_ajax(){
               $.ajax({
                  url:"/api/v1/reception/GoodDetails/"+good_id,
                  dataType:"json",
                  type:"get",
                  success:function(res){
                     console.log(res);
                     $("#details_title").text(res.data.title);
                     if(res.data.is_status=="1"){
                        $(".Details_status").text("已开抢");
                        $("#details_submit").addClass("Details_bottom_btn");
                        Details_info();
                     }else if(res.data.is_status=="2"){
                        $(".Details_status").text("疯抢中");
                        $("#details_submit").addClass("Details_bottom_btn");
                        Details_info();
                     }else if(res.data.is_status=="3"){
                        $(".Details_status").text("即将开始");
                     }
                     var esm_price=res.data.settle_price - res.data.price;
                     $("#estimate_price").text(esm_price);
                     $("#details_price").text(res.data.price);
                     $("#settle_price").text(res.data.settle_price);
                     var robtime=timestampToTime(res.data.rob_time)
                     $("#rob_time").text(robtime);
                     if(res.data.return_time=="0"){
                        $("#return_time").text("当天回款");
                     }else{
                        $("#return_time").text(res.data.return_time+" 天");
                     }
                    
                     $("#rob_href").attr("href",res.data.rob_href);
                     $("#rob_href").find("span").text(res.data.rob_href);
                     if(res.data.voucher_href==""){
                        $("#voucher_href_con").hide();
                     }else{
                        $("#voucher_href").attr("href",res.data.voucher_href);
                        $("#voucher_href").find("span").text(res.data.voucher_href);
                      }
                     if(res.data.code=="" || res.data.code==null){
                       $("#code_con").hide();
                     }else{
                       $("#code").text(res.data.code);
                     }                     
                     $("#Details_btn_go").attr("href",res.data.rob_href);
                     $("#address").text(res.data.address[0]);
                     $("#address1").text(res.data.address1);
                     $("#address_prompt").text(res.data.address_prompt);
                     if(res.data.explain==null || res.data.explain==""){
                        $("#detailes_expain").hide();
                     }else{
                       $("#explain").text(res.data.explain);
                     }
                     if(res.data.channel=="1"){
                        $("#rob_href_logo").addClass("rob_href_logo1");
                     }else if(res.data.channel=="2"){
                       $("#rob_href_logo").addClass("rob_href_logo2");
                     }else if(res.data.channel=="3"){
                       $("#rob_href_logo").addClass("rob_href_logo3");
                     }else if(res.data.channel=="4"){
                       $("#rob_href_logo").addClass("rob_href_logo4");
                     }else if(res.data.channel=="5"){
                       $("#rob_href_logo").addClass("rob_href_logo5");
                     }else if(res.data.channel=="6"){
                       $("#rob_href_logo").addClass("rob_href_logo6");
                     }
                  },
                  error:function(error){
                     console.log(error.responseJSON);
                    
                  }
               })
            }

            /* copy  */ 
            var clipboard = new ClipboardJS('.Details_copy');         
             clipboard.on('success', function(e) {
                 console.log(e);
                 $.toast("已复制","text");
             });         
             clipboard.on('error', function(e) {
                 /*$.toast("复制失败,请重新复制","text");*/
             });
            /* 时间搓转换成时间日期 */
           function timestampToTime(timestamp) {
                var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                Y = date.getFullYear() + '-';
                M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                D = date.getDate() + ' ';
                h = date.getHours() < 10 ? '0'+ date.getHours() : date.getHours();
                m = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
                s = date.getSeconds(); 
                return Y+M+D+""+h+":"+m;
           } 
           /* 判断是否登陆进行跳转到下一页面或去登陆页面 */
           function Details_info(){
              $("#details_submit").click(function(){
                 if(!userphone){
                    $.toast("你还没有登陆呢,马上为你跳转登陆页","text",function(){
                          window.location.href="logins.html";     
                    })
                 }else{
                    $("#details_submit").attr("href","declaration.html?"+good_id);
                    $("#details_submit").addClass("Details_bottom_btn");
                 }
              })
           }
       })

