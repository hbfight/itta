/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-06-06 11:40:53
 * @version $Id$
 */
     
$(function () {
	      var count=1; 
        var time=$("#phptime").text(); //获取后台时间
        var tm=3; //1
        var Time_status=false; //设置默认为false表示当天没有已开抢的时间或没到已开枪的时间
        var dateType=false;//设置默认为false有类型为普通的数据
        var timeft=true; //设置默认显示结束倒计时数据
        var timefts=false;
        var status2=true;
        var f=0;//判断时间数据没有已开去抢时高亮显示
        /*var timenew=timestampToTimes(time);*/
        var page=1; //当前页
        var pagesize=5; //每页显示条数
        var storage=window.localStorage;
        var times_nav; //获取服务器返回的当前时间
        var status_nav=2; //获取当前状态 
        var mySwiper;
        var indexnav; //设置swiper索引值
        /*  获取当前时间并进行转换  */
        var datetimea=new Date();
        var dayY=datetimea.getFullYear();
        var dayM=datetimea.getMonth()+1;
        var dayM_s=(datetimea.getMonth()+1 < 10 ? '0'+(datetimea.getMonth()+1) : datetimea.getMonth()+1);
        var dayD=datetimea.getDate();

        var Dnewdate=dayY+"-"+dayM+"-"+dayD;
        var Dnewdate_c=dayY+"-"+dayM_s+"-"+dayD+' ';
        var Dnewdate_d=dayY+"/"+dayM_s+"/"+dayD+' ';//兼容苹果时间
        /* 获取当天时间措 */
        var timevalueok=Dnewdate_d+"00:00:00";
        console.log(timevalueok);
        var yddateok = new Date(timevalueok); //获取选中得时间
        var YD_timeok=yddateok.getTime()/1000
        var Dnewdate_a=new Date(Dnewdate);
        var Dnewdate_s=Dnewdate_a.getTime()/1000;
        var tm_datetimea=datetimea.getTime()/1000;
        
        /* 轮询方法 */
       /* (function longPolling() {
            $.ajax({
               url: "/api/v1/reception/fast",
               data: {"timed": Date.parse(time)/1000},
               dataType: "json",
               timeout: 5000,//5秒超时，可自定义设置
               success: function (msg) {
                    console.log(msg);
                    if (msg.msg == "ok") { // 请求成功
                        longPolling();
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (textStatus == "timeout") { // 请求超时
                            longPolling(); // 递归调用
                    } else { // 其他错误，如网络错误等
                            longPolling();
                    }
                 }
            });
        })();*/

         var yd_ajax=1;
        /* 菜单显示隐藏 */
        $("#header_time").click(function(e){
           e.stopPropagation();
           $("body").addClass("body_position");
           var tbody=$(".index_main").css("display");
           /*if(yd_ajax=="1"){
             YD_ajax();
           }*/
          
           $(".index_main").toggle();
        })
         /* 点击外面关闭时间菜单 */
        $(document).bind("click",function(e){ 
            var target = $(e.target); 
            if(target.closest(".index_main_table").length == 0){ 
              $(".index_main").hide();
              $("body").removeClass("body_position");
            }else{
              $("body").removeClass("body_position");
            } 
        })
        /* index 内容拼接方法 */
        function index_wapconone(data,sta){
             $(".weui-loadmore").hide();             
             dateType=false;
             var html="";
             for(var i=0;i<data.data.length;i++){
             	 var pricemoney=data.data[i].settle_price - data.data[i].price;
             	 var numbers=(data.data[i].number/data.data[i].num)*100;
                 html+='<div class="weui-panel weui-panel_access">'
                 html+='<div class="weui-panel__bd">';
                 html+='<a href="Details.html?'+data.data[i].good_id+'" class="weui-media-box apding weui-media-box_appmsg">';
                 html+='<div class="weui-media-box__hd index_media_img">'
                 html+='<img class="weui-media-box__thumb" src="'+data.data[i].img+'">'
                 html+='</div>'; 
                 html+='<div class="weui-media-box__bd">';
                 html+='<h4 class="weui-media-box__title index_media_title">'+data.data[i].title+'</h4>'
                 if(data.data[i].type=="1"){
                     html+='<p class="index_con_status">普通</p>';
                     dateType=true;
                 }else if(data.data[i].type=="2"){
                     html+='<p class="index_con_status">置顶</p>';
                 }else if(data.data[i].type=="3"){
                     html+='<p class="index_con_status">长期</p>';
                 }
                 html+='<div style="position: relative;">';
                 html+='<div id="c1" class="index_progress">';
                 html+='<div class="progress" style="width:'+numbers.toFixed(0)+'%">'+numbers+'</div>';
                 html+='</div>';
                 html+='<div class="index_progress_num">';
                 html+='<span class="progress_money">下单金额:<span>'+data.data[i].price+'</span></span>';
                 html+='<span class="progress_num">剩余<span class="progress_number">'+numbers.toFixed(0)+'%</span></span>';
                 html+='</div>';
                 html+='</div>';
                 html+='<div class="index_con_sub">';
                 html+='<div class="index_con_text" style="display:inline-block;">';
                 html+='<span class="index_con_price">￥<strong>'+pricemoney+'<strong></span>';
                 html+='<span class="index_con_price_span">预计佣金</span>';
                 html+='</div>';
                 html+='<div class="index_con_button">';
                 if(sta=="1"){
                     html+='<button class="weui-btn a_btn index_con_btn" id="'+data.data[i].good_id+'">疯抢中</button>';
                 }else if(sta=="2"){
                     html+='<button class="weui-btn a_btn index_con_btn" id="'+data.data[i].good_id+'">立即抢购</button>';
                 }else if(sta=="3"){
                     html+='<button class="weui-btn a_btn index_con_btn3s" id="'+data.data[i].good_id+'">即将开始</button>';
                 }
                 html+='</div>';
                 html+='</div>';
                 html+='</div>';
                 html+='</a>';
                 html+='</div>';  
                 html+='</div>';
                 move(numbers);//默认加载进度条*/
              }   
              $("#tab").append(html); 
              
              $(".a_btn").click(function(){
              	  var id=$(this).attr("id");
              	  window.location.href="Details.html?"+id;
              });
              if(dateType){
                 $(".index_nodate_img").remove();
                 $("#tab").show();
                 $(".index_nodate").remove();
                 $(".container").removeClass("containers");
                 $(".index_downtime").removeClass("opacitys");
              }else{ 
                 $("#tab").hide();
                 index_nodates();
              }
        }
        //默认执行导航时间数据展示
       /* navtime_ajax();*/
        function navtime_ajax(){
        	 $.ajax({
        	 	url:"/api/v1/reception/getdatetime",/*/api/v1/reception/getshopalldate*/
        	 	dataType:"json",
        	 	type:"get",
        	 	success:function(res){
                    console.log(res);
                    if(res.data=="" || res.data==undefined){
                       timeft=false;
                       timefts=true;
                       navsliders_no(5);
                       $(".container").addClass("containers");
                       $(".index_downtime").addClass("opacitys");
                       index_nodate();   
                    }else{ 
                       $(".container").removeClass("containers");
                       $(".index_downtime").removeClass("opacitys");
                       for(var i=0;i<res.data.length;i++){
                          if(res.data[i][1]=="2"){
                               status2=false;
                          }
                       }
                       console.log("status2:"+status2);
                       if(status2){
                         console.log("3");
                         index_navtime(res,3);
                       }else{
                         console.log("2")
                         index_navtime(res,2);
                       }
                      
                    }
        	 	},
        	 	error:function(error){
        	 		console.log(error);
        	 	}
        	 })
        }
        /* 暂无数据是加载信息 */
        function index_nodate(){
           var htmla='<div class="index_nodate_img">';
               htmla+='<h1 class="index_nodate_titlea">暂无</h1>';
               htmla+='<h2 class="index_nodate_title">今日暂无抢购</h2>';
               htmla+='<p class="index_nodate_text">右上角选择时间抢购</p>';
               htmla+='</div>';
           $("#tab").append(htmla)
        }
        /*  当天无数据时 */
        function index_nodates(){
           $(".index_downtime").addClass("opacitys");
           $(".container").addClass("containers"); 
           var htmla='<div class="index_nodate_img">';
               htmla+='<h1 class="index_nodate_titlea">暂无</h1>';
               htmla+='<h2 class="index_nodate_title">今日暂无抢购</h2>';
               htmla+='<p class="index_nodate_text">右上角选择时间抢购</p>';
               htmla+='</div>';
           $("#weuitabbdcon").append(htmla);
        }
        /* index nav导航时间拼接方法  */
        function index_navtime(data,tm){
        	var datalength=data.data.length;
        	var html='';
        	for(var i=0;i<data.data.length;i++){
              var timenav=timestampToTime(data.data[i][0]);
        	    html+='<div class="swiper-slide weui-navbar__item navtime_a" a="1" val="'+data.data[i][1]+'" value="'+data.data[i][0]+'" id="tabs'+data.data[i][1]+'" href="#tab'+count+'">';
        	    html+='<div class="navbar_item" value="'+data.data[i][1]+'">';
        	    html+='<p class="weui_nav_time">'+timestampToTime(data.data[i][0])+'</p>';
        	    if(data.data[i][1]=="3"){
                   html+='<p class="weui_nav_status">即将开始</p>';
        	    }else if(data.data[i][1]=="1"){
                   html+='<p class="weui_nav_status">疯抢中</p>';
        	    }else if(data.data[i][1]=="2"){
                   html+='<p class="weui_nav_status" val="2">已开抢</p>';
                   /* 进入入首页加载的数据status==2 */
                   if(tm=="2"){
                    $("#tab").html("");
                    times_nav=data.data[i][0];
                    var timesstatus2=data.data[i][1];
                    navtime_con_ajax(times_nav,timesstatus2,page,pagesize);
                   }
        	    }
        	    html+='</div>';
        	    html+='</div>';
        	} 
        	$("#navtime").append(html); 
          $("#navtime").parent(".swiper-container").attr("id","swiper_YDa");
          $("#navtime").css({"transform":"translate3d(0px, 0px, 0px)","transition-duration":"0ms"}); 
          
            var indexlength=$(".swiper-wrapper .swiper-slide").length;
            var indexlength_d=indexlength-1;
            var indexlength_s=indexlength-2; 
            $(".swiper-slide").each(function(index,val){
               var _this=$(this); 
               /* 如果当前天数没有已开抢,默认显示第一个时间数据 */
               if(_this.attr("val")=="2"){
                   Time_status=true;   
               } 
               if(_this.attr("val")=="2"){
                   if(indexlength-index=="2"){
                     indexnav=index-2;
                     navsliders(1);
                     if(indexlength=="2"){
                       navsliders_Y(2);
                     }else if(indexlength_s==indexlength-2){
                       if(index=="2"){
                       }else{
                         navsliders_Y(1);
                       }     
                     }else{
                       navsliders_Y(1);
                     }
                   }else if(indexlength-index=="1"){
                     console.log("1");
                     if(indexlength>1){
                       navsliders(2);
                     }
                     if(index=="2"){//导航时间为3条数据index=2； 
                     }else if(indexlength_d==indexlength-1){
                        if(indexlength=="2"){
                          navsliders_Y(1);
                        } 
                     }else{
                        navsliders_Y(1);
                     }   
                   }else{  
                     console.log("2")
                     if(indexlength-index==indexlength_d){
                        navsliders_Y(1);
                     }else if(indexlength-index==indexlength){
                       navsliders_Y(2);
                     }
                   }
                  indexnav=index-2;
               }else{
                  /*console.log("no");
                  if(indexlength>1 && indexlength<3){
                     navsliders_Y(1);
                     return false;
                  }else if(indexlength>2){
                     console.log("23");
                     return false;
                  }else{
                     navsliders_Y(2);
                  }
                  indexnav=index-2;*/
               }
            })
        	  /* 导航时间Swiper滑动 */
            mySwiper=$("#swiper_YDa").swiper({
               freeMode: true, 
               slidesPerView : 5,
               /*observer:true,*/
               initialSlide:indexnav
            });              
            /* 没有已开抢状态进行时间最近判断来高亮显示展示数据 */
            $(".weui-navbar__item").each(function(index,val){
                var sthis=$(this);
                if(sthis.attr("value") < tm_datetimea){
                    f++;
                    sthis.attr("a",f);
                    sthis.addClass("as"+f);
                }else if(sthis.attr("value") > tm_datetimea){
                    f++;
                    sthis.attr("a",f);
                    sthis.addClass("as"+f);
                }
            })
            
            /* 如何tm等于3 */ 
            var timesa;   
            var timestatusfirst;
            
            if(tm=="3"){
               /* 没有已开抢状态进行时间最近判断来高亮显示展示数据 */
               if($(".as"+f).attr("a")==f){
                  $(".as"+f).addClass("weui-bar__item--on");
                   timesa=$(".swiper-slide.weui-bar__item--on").attr("value");
                   timestatusfirst=$(".swiper-slide.weui-bar__item--on").attr("val");
               }else{
                 
                  $(".swiper-slide:first-child").addClass("weui-bar__item--on");
                  timesa=$(".swiper-slide:first-child").attr("value");
                  timestatusfirst=$(".swiper-slide:first-child").attr("val");
               }
               
               $("#tab").html("");
               navtime_con_ajax(timesa,timestatusfirst,page,pagesize);
            }else{
              if(Time_status){
                 $("#tabs2").addClass("weui-bar__item--on");
                 $("#tabs2").addClass("swiper-slide-active");
              }else{
                 
                /* tm不等于3时判断来高亮显示展示数据 */
                if($(".as"+f).attr("a")==f){
                   $(".as"+f).addClass("weui-bar__item--on");
                   timesa=$(".swiper-slide.weui-bar__item--on").attr("value");
                   timestatusfirst=$(".swiper-slide.weui-bar__item--on").attr("val");
                }else{
                   $(".swiper-slide:first-child").addClass("weui-bar__item--on");
                   timesa=$(".swiper-slide:first-child").attr("value");
                   timestatusfirst=$(".swiper-slide:first-child").attr("val");
                }
                /* 天数时间点击判断timesa是否为undefined */
                if(timesa==undefined){
                    timeft=false;
                    timefts=true;
                    $("#tab").html("");
                    navsliders_no(5);
                    $(".container").addClass("containers");
                    $(".index_downtime").addClass("opacitys");
                    index_nodate();
                 }else{
                    $("#tab").html("");
                    navtime_con_ajax(timesa,timestatusfirst,page,pagesize);
                }
              }
             
            }   

            /* 导航时间点击跳转对应的内容 */
            $(".navtime_a").click(function(e){
                $(".weui-loadmore").show();
                f=0;
                $("#tab").html("");
                $(".index_nodate").remove();
        	      var _this=$(this);
            	  times_nav=_this.attr("value");
            	  status_nav=_this.find("div").attr("value");
            	  page=1;
                $("#zai").html("");
                e.preventDefault();
                navtime_con_ajax(times_nav,status_nav,page,pagesize);
                $(document.body).infinite();
            })
        }
        //根据时间获取时间段的内容数据
        function navtime_con_ajax(time,status,page,pagesize){
        	$.ajax({
        		url:"/api/v1/reception/rerobstart/"+time+"/"+status+"/"+page+"/"+pagesize,
        		dataType:"json",
        		type:"get",
        		success:function(res){
             
              if(res.data==null){  /*res.data.length <="0"*/
                $(".weui-loadmore").hide();
                $("#zai").html("暂无数据");
                $(document.body).destroyInfinite();
              }else{ 
                $(".container").removeClass("containers");
                $(".index_downtime").removeClass("opacitys");
                $("#tab").html("");
                index_wapconone(res,status);
        			}
        		},
        		error:function(HMLHttpRequest,textStatus,errorThrown){
        			console.log(HMLHttpRequest);
        			console.log(textStatus);
        			console.log(errorThrown);
        		}
        	})
        }
        /* 如果为false，侧表示今天没有已开抢的信息 */
        if(Time_status=="false"){
           $(".swiper-slide:first-child").addClass("weui-bar__item--on");
           $(".swiper-slide:first-child").addClass("swiper-slide-active");
           var first_time=$(".swiper-slide:first-child").attr("value");
           var first_status=$(".swiper-slide:first-child").attr("val");
           navtime_con_ajax(first_time,first_status,page,pagesize);
        }
        //进度条
        function move(prossers){ 
          var width =0;//默认为0
          var temp = setInterval(go, 50);   //每0.05秒执行一次go函数
          function go(){
            if(width >=prossers){
                clearInterval(temp);     //停止setInterval
            }else{  
                width++;
            }
          }
        }

        /* 当天无抢购时间添加假时间数据*/
        function navsliders_no(fornum){
            var j=8;
            var htmls='';
            for(var i=0;i<fornum;i++){
                htmls+='<div class="swiper-slide weui-navbar__item navtime_a" value="">';
                htmls+='<div class="navbar_items">';
                htmls+='<p class="weui_nav_time">'+j+':00</p>';
                htmls+='<p class="weui_nav_status">即将开始</p>';
                htmls+='</div>';
                htmls+='</div>';
                j=j+2;
            }
            $("#navtime").append(htmls);
            $("#navtime").parent().addClass("indexnavno");
            $("#navtime").css({"transform":"translate3d(0px, 0px, 0px)","transition-duration":"0ms"}); 
            $(".indexnavno").swiper({
               freeMode: true, 
               slidesPerView : 5,
              
            });           
        }
        /* 设置开抢时间居中 */
        function navsliders(fornum){
            var htmls='';
            for(var i=0;i<fornum;i++){
                htmls+='<div class="swiper-slide" value=""></div>';
            }
            $("#navtime").append(htmls);
        }
        /* slide最前面插入数据方法 */
        function navsliders_Y(fronums){
           for(var i=0;i<fronums;i++){
              $('<div class="swiper-slide" value=""></div>').insertBefore($(".swiper-slide:first-child"));
           }
        }
      
       YD_ajax(); //默认加载顶部隐藏天数时间日期
       /* 顶部时间日期展示接口 */
       function YD_ajax(){
          $.ajax({
             url:"/api/v1/reception/getshopalldate",
             dataType:"json",
             type:"get",
             success:function(res){
               console.log(res);
               yd_ajax=2;
               if(res.msg=="没有数据"){
                 $(".weui-loadmore").hide();
                 $("#table_time").show();
                 $("#YD_body").append("<p class='table_time_no'>暂无数据</p>");
               }else{
                 $(".weui-loadmore").hide();
                 YD_body(res);
               }
               
             },
             error:function(error){
               yd_ajax=1;
               console.log(error);
             }
          })
       }
       /* 时间日期选择拼接方法 */
       function YD_body(data){
           var html='<ul id="table_time">';
           for(var i=0;i<data.data.length;i++){
              //数据库返回得时间是否小于当前日期如果小于当前时间侧不显示
              if(data.data[i][0]<Dnewdate_s){ 
                
              }else{ //否则显示大于当前时间日期
                html+='<li>';
                html+='<a href="javascript:;" id="'+timestampTimeYMD(data.data[i][0])+'" value="'+timestampTimeYMD_a(data.data[i][0])+'" class="YD_time">'+timestampToTimeYMD(data.data[i][0])+'日</a>';
                html+='</li>';
              }
           }
            html+='</ul>';
           $("#YD_body").append(html);
           /* 清除重复的数据 */
           var li = $("#YD_body li").map(function() {
            return $(this).html();
           }).get();
           $.unique(li);
           $("#YD_body li").remove();
           $.each(li, function(index, val) {
             $("#YD_body ul").append('<li>'+val+'</li')
           });
           /* 给第一个添加默认颜色 */
           $("#YD_body li:first-child").addClass("index_on");
           /* 点击获取当天日期下得导航时间 */
           $("#table_time li").click(function(){ 
              $(".weui-loadmore").show();
              $("#zai").hide(); 
              page=1; 
              $(".container").removeClass(".containers"); 
              $("body").removeClass(".body_position");
               var timevalue = $(this).find("a").attr("id");
               var timevalue_o=$(this).find("a").attr("value");//兼容苹果时间转换
               
               var timetext=$(this).find("a").text();
               var timevalue_s=timevalue_o+"00:00:00"; //默认设置为年月日00:00:00;
               
               var YD_date = new Date(timevalue_s); //获取选中得时间
               var YD_time=YD_date.getTime()/1000 //时间转换
               if(timevalue==Dnewdate_c){
                   $(".header_time_text").text("今天")//选中得时间为今天,默认显示今天
               }else{
                  $(".header_time_text").text(timetext)//选中得时间值在首页显示出来
               }
               $(this).addClass("index_on"); //选中添加样式
               $(this).siblings().removeClass("index_on"); //删除其他样式
               $(".index_nodate").remove();
               /* 根据日期来显示对应得数据 */
               if(YD_time>Dnewdate_s){
                  status2=true;
                  timeft=false;
                  tm=3;
                  if(timefts){

                  }else{
                    mySwiper.destroy(false); 
                  }
                  
                  YD_nav_ajax(YD_time); //显示当天后得数据
               }else{
                  tm=2;
                  timeft=true;
                  status2=false;
                  var tas=setInterval(function(){
                       getTimer();
                  },1000);
                  YD_nav_ajax(YD_time);//显示当天数据                  
               }
               $(".index_main").hide();
               $(document.body).infinite();
           })
           if($("ul#table_time").has("li").length>0){
              
           }else{
             $("#table_time").append("<p class='table_time_no'>暂无数据</p>"); 
           }           
       }
       /* 根据时间日期展示当天时间内容 */
       YD_nav_ajax(YD_timeok);
       function YD_nav_ajax(timevalue){ 
         $.ajax({
            url:"/api/v1/reception/GetNowTimeGoodInfo/"+timevalue,
            dataType:"json",
            type:"get",
            success:function(res){
              $(".weui-loadmore").hide();
              if(res.msg=="没有数据"){
                 timeft=false;
                 timefts=true;
                 navsliders_no(5);
                 $(".container").addClass("containers");
                 $(".index_downtime").addClass("opacitys");
                 index_nodate();
              }else{
                 $("#navtime").html("");
                 if(status2){
                  index_navtime(res,3);
                 }else{
                  index_navtime(res,2);
                 }
              }
              
            },
            error:function(error){
              $(".weui-loadmore").hide();
              console.log(error)
              
            }
         })   
       }
        /* 时间倒计时开始执行 */
        var tas=setInterval(function(){
            getTimer();
          },1000);
        function getTimer(){
           var nav_endtime;
           //获取当天最晚时间
           var day_endtime=new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1);
           var daytime=day_endtime.getTime()/1000; //时间转换
           var dates=new Date(); //获取当前时间
           var cha,hour,minute,seconds;
           /* 根据true,false判断获取的时间 */
           var firstTimes = $(".swiper-slide:first-child").attr("value");//第一个时间值
           if(status2){
             if(firstTimes>dates.getTime()/1000){
               nav_endtime=firstTimes;
             }else{
               nav_endtime=$(".swiper-slide.as"+f).next().attr("value");
             }
             
           }else{
             if(Time_status){
                nav_endtime=$("#tabs2").next().attr("value");//获取当前开抢后一个时间
             }else{
               if(firstTimes>dates.getTime()/1000){
                  nav_endtime=firstTimes;
               }else{
                  nav_endtime=$(".swiper-slide.as"+f).next().attr("value");
               }
              
             }
           }
          
           if(nav_endtime==undefined || nav_endtime==""){
              
              if(timeft){
                  if(Time_status){
                     cha=daytime-dates.getTime()/1000;
                  }else{
                     if(nav_endtime==undefined || nav_endtime==""){
                        cha=daytime-dates.getTime()/1000;
                     }else{
                        cha=nav_endtime-dates/1000;
                     } 
                  }     
                               
                  if(cha < "1"){ 
                     setTimeout(function(){
                          YD_nav_ajax(YD_timeok);       
                          window.location.reload();
                       },1000)
                  }
                  hour=parseInt(cha/60/60%24);
                  minute=parseInt(cha/60%60);
                  seconds=parseInt(cha%60);
                  if(minute<=9) minute='0'+ minute;
                  if(seconds<=9) seconds='0'+ seconds;
                  if(hour<=9) hour='0'+ hour;
                  $("#t_hour").text(hour);
                  $("#t_minute").text(minute);
                  $("#t_second").text(seconds);
              }else{  
                  $("#t_hour").text("00");
                  $("#t_minute").text("00");
                  $("#t_second").text("00");
                  clearInterval(tas);
              }
           }else{
              if(nav_endtime < dates/1000){
                $("#t_hour").text("00");
                $("#t_minute").text("00");
                $("#t_second").text("00");
                clearInterval(tas)
              }else{ 
                if(timeft){
                    cha=nav_endtime-dates/1000;
                    
                    if(cha < "1"){   
                       setTimeout(function(){
                          YD_nav_ajax(YD_timeok);       
                          window.location.reload();
                       },1000)
                      
                    }
                    hour=parseInt(cha/60/60%24);
                    minute=parseInt(cha/60%60);
                    seconds=parseInt(cha%60);
                    if(minute<=9) minute='0'+ minute;
                    if(seconds<=9) seconds='0'+ seconds;
                    if(hour<=9) hour='0'+ hour;
                    $("#t_hour").text(hour);
                    $("#t_minute").text(minute);
                    $("#t_second").text(seconds);
                }else{
                    $("#t_hour").text("00");
                    $("#t_minute").text("00");
                    $("#t_second").text("00");
                    clearInterval(tas)
                }
              }
           }       
        }
        /* 时间搓转换成时间小时,分-时间格式 */
        function timestampToTime(timestamp) {
           var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
           Y = date.getFullYear() + '-';
           M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
           D = date.getDate() + ' ';
           h = date.getHours() < 10 ? '0'+ date.getHours() : date.getHours();
           m = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
           s = date.getSeconds();
           return h+":"+m;  
        } 

        /* 时间搓转换成时间月,日-时间格式*/
        function timestampToTimeYMD(timestamp) {
           var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
           Y = date.getFullYear() + '-';
           M = (date.getMonth()+1) + '月'; /*< 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1)*/
           D = date.getDate();
           h = date.getHours() < 10 ? '0'+ date.getHours() : date.getHours();
           m = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
           s = date.getSeconds();
           return M+D;
        } 

         function timestampTimeYMD_a(timestamp) {
           var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
           Y = date.getFullYear() + '/';
           M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
           D = date.getDate() + ' ';
           h = date.getHours() < 10 ? '0'+ date.getHours() : date.getHours();
           m = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
           s = date.getSeconds();
           return Y+M+D;
        } 

        function timestampTimeYMD(timestamp) {
           var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
           Y = date.getFullYear() + '-';
           M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
           D = date.getDate() + ' ';
           h = date.getHours() < 10 ? '0'+ date.getHours() : date.getHours();
           m = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
           s = date.getSeconds();
           return Y+M+D;
        } 
        /* 滚动加载更多数据 */
        var loading = false;  //状态标记
        $(document.body).infinite().on("infinite", function() {
          if(loading) return;
          loading = true;
          status_nav=$(".swiper-slide.weui-bar__item--on").attr("val");
          times_nav=$(".swiper-slide.weui-bar__item--on").attr("val");
          console.log(times_nav);
          console.log(status_nav);
          setTimeout(function() {
            $("#zai").show();
            page=page+1;
            navtime_con_ajax(times_nav,status_nav,page,pagesize);
            loading = false;
          },500);  
        });



});


