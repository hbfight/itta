/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-05-30 16:43:21
 * @version $Id$
 */

 /* input输入跳转到对应的页数 */
                       $("#input-page").click(function(){
                           var apagelenth=$("#addresslistpage li.page");
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