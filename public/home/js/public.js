/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-06-11 21:32:03
 * @version $Id$
 */
$(function(){
	 $.toast.prototype.defaults.duration="1500";
	 var storage=window.localStorage;
	 var userphone=storage.getItem("username");
	 console.log(storage.getItem("username"));
	 if(!userphone){
        $.toast("你还没有登陆呢,马上为你跳转登陆页","text",function(){
             window.location.href="logins.html";          
        })
	 }else{
	 	
	 }
})
