define('main', ['jquery', 'angularjs','YS'], function(require, exports, module) {//1.被绑定的conf
 var app = angular.module("main", []);
 //过滤集合 
 app.filter("htmlfil",["$sce",function($sce){
    //过滤html    
        return function(text){ return $sce.trustAsHtml(text);};
    }]);  
     
//标准过滤格式    
  app.filter("myfil",["fac",function(fac){ 
        return function(data,item){ 
            var newarr = [];
            angular.forEach(data, function(value, key){
                if(value.pid==item){
                    newarr.push(value);
                }
            }); 
                return newarr; 
        };
    }]);
 //1. main_ctrl  最外层的ctrl
 app.controller('main_ctrl', ['$scope','fac',function($scope,fac){ 
 $scope.cd={};
 $scope.getmenu = [];
 $.ajax({  
         type : "post",  
         /*url : window.root+"json/auth/menutree_select.json",*/
          url : window.root+"open/menutree_select?token="+fac.getstore('ystoken'),  
          data : {debug:0},  
          async:false,
          success : function(re){  
             $scope.getmenu.data = re.data;
             $scope.cd = re.arr;
          }  
     });
  
// 判断登录状态
$scope.we = '';
 $.ajax({  
         type : "post",  
          url : window.root+"open/islogin?token="+fac.getstore('ystoken'), 
          async:false,
          success : function(k){           
          // var obj = eval("("+k+")");
           $scope.we = k.code;

          }
     });


  YS('bootstrap');
  YS('form');
  YS('qqface');
   YS('laypage');
   setTimeout(function(){
        YS('laydate');
      },1000);
  YS('slimScroll',function() {
        $('.sidebar-collapse').slimScroll({
            height: '100%',
            railOpacity: 0.9,
            alwaysVisible: false
        }); 
  });
  //  YS('shCircleLoader',function() {
  //   $('#loader').shCircleLoader({color:'#2AA2D4'});
  // });
    YS('layer');
  $scope.ysmid = $scope.$id;
 	// $scope.getmenu = {
 	// 	done:function(re,sco){
  //     debugger;
  //     $scope.cd=re.arr;
  //     YS('slimScroll',function(){
  //       $('.sidebar-collapse').slimScroll({
  //           height: '100%',
  //           railOpacity: 0.9,
  //            color: '#ffcc00',
  //           alwaysVisible: false
  //       });
  //     }); 
 
 	// 	}
 	// };
  //    fac.ysfetch($scope,'getmenu');

// 推出登录
  $scope.lgout = {
    done:function(re,sco){
      fac.unsetstore('ystoken');
      window.location.href = "/admin.php";
    }
  }; 
    fac.ysfetch($scope,'lgout');


 $scope.findchk = function(id,inje){
    var arr = inje.split(',');
    var a = false;
    arr.map(function(el){
      if(id==el){a = true;}
    });
    return a;
 };


function getpage(){
  var url = location.href.split('#');
  url = url[1]||'/zpindex';
  if(url.indexOf("?") > 0 ){
      fac.setstore('hash',fac.hashtoobj(url.split('?')[1]));
      url = url.split('?')[0];
  } 
  var arr = url.split('/');
  arr.shift(); 
  url = './html/'+arr.join('_');  
 
  return url+'.html?time='+fac.time();
}

$scope.body = {url:getpage()};
window.onhashchange = function(){   
  $scope.body.url = getpage();
  // dosetmenu($scope);
  $scope.$apply();
  
};
 $scope.mainshow = 0;

// $scope.menufind = function(str){
//   var a = location.href.split('#/');  
//  var ax= a[1]==str?'active_bg':''; 
//  return ax;
// };

// $scope.chkmenu = function(val){
//   val.cls = val.cls==''||val.cls==undefined?'active':'';
// };

//jq代码
// $("#scNav").on("click", ".nav_li", function () { 
//             $("#scNav>li").attr("class", "nav_li");
//             var cl = $(this).children("a").attr("class"); 
//             $(".sc_nav_list li").removeClass("active_bg");
//             $(this).addClass("active_bg"); 
//         });
//     $(".sc_nav_list>li").on("click", function () { 
//       $(this).addClass('acitve').siblings().removeClass('acitve');
//     });


 }]); 
 //2. com_ctrl   公共ctrl
 app.controller('com_ctrl', ['$scope','fac','hdl',function($scope,fac,hdl){
  $scope.yscid = $scope.$id; 

   // 公共编辑更新一条
   YS("city", function() {
                $scope.city = function(e){
                  SelCity(this,e);
                };
            });

  $scope.com_update = {
      time:0,
      params:{}, 
      data:{},
    done:function(re,sco){
      layer.msg('更新成功');
    }
  }; 
  
  fac.ysfetch($scope,'com_update'); 

  // 公共列表无分页
  $scope.com_list = {time:0,params:{},data:{}};  
  fac.ysfetch($scope,'com_list');
  $scope.com_list2 = {time:0,params:{},data:{}};  
  fac.ysfetch($scope,'com_list2');

  $scope.com_list3 = {time:0,params:{},data:{}};  
  fac.ysfetch($scope,'com_list3');

  $scope.com_list4 = {time:0,params:{},data:{}};  
  fac.ysfetch($scope,'com_list4');

  $scope.com_list5 = {time:0,params:{},data:{}};  
  fac.ysfetch($scope,'com_list5');

  $scope.com_list6 = {time:0,params:{},data:{}};  
  fac.ysfetch($scope,'com_list6');
 // 公共分页列表
  $scope.com_list_page = {time:0,params:{},data:{}}; 
  fac.ysfetch($scope,'com_list_page'); 
  $scope.com_list_page2 = {time:0,params:{},data:{}}; 
  fac.ysfetch($scope,'com_list_page2'); 

$scope.com_list_page3 = {time:0,params:{},data:{}}; 
  fac.ysfetch($scope,'com_list_page3');

  $scope.com_detail = {time:0,params:{},data:{}}; 
  fac.ysfetch($scope,'com_detail');
    $scope.com_detail2 = {time:0,params:{},data:{}}; 
  fac.ysfetch($scope,'com_detail2');
  $scope.com_detail3 = {time:0,params:{},data:{}}; 
  fac.ysfetch($scope,'com_detail3');
 // 公共删除
  $scope.com_del = {time:0,params:{},data:{}};  
  fac.ysfetch($scope,'com_del'); 

   // 公共增加和编辑
  $scope.com_editadd = {time:0,params:{},data:{}}; 
  fac.ysfetch($scope,'com_editadd');
 
// 公共增加和编辑
  $scope.com_editadd2 = {time:0,params:{},data:{}}; 
  fac.ysfetch($scope,'com_editadd2');

// 公共增加和编辑
  $scope.com_editadd3 = {time:0,params:{},data:{}}; 
  fac.ysfetch($scope,'com_editadd3');

// 公共增加和编辑
  $scope.com_editadd4 = {time:0,params:{},data:{}}; 
  fac.ysfetch($scope,'com_editadd4');

var a = location.href.split('#');
 url = a[1]||'/zpindex';

if(url.indexOf("?") > 0 ){
      fac.setstore('hash',fac.hashtoobj(url.split('?')[1]));
      url = url.split('?')[0];
  } 



var urlarr = url.split('/');
urlarr.shift(); 
var t = urlarr.join('_');    
   var module= hdl[t];
   for(var k in module){
    if(k=='init'){
      hdl[t][k]($scope);
    }else{
    var key = t+'_'+k; 
    $scope[key] = angular.copy(module[k]); 
    fac.ysfetch($scope,key);
    }
   }
//默认出事状态，第一页0；
 $scope.value ={};
 $scope.tapshow = 0;



  $scope.toggleshow = 0;

//默认页面是编辑状态，0，非编辑，1编辑状态
 $scope.editstatus = 0; 

 }]);

// 日期插件
app.directive('layerdateone',['fac', function(fac){ 
    return { 
        link: function($scope, iElm, iAttrs, controller) {
            iElm.on("click",function(){
 var cscope = fac.getscope_byid($scope,$scope.yscid); 
        var arr = iAttrs.layerdateone.split('.'); 

                laydate.skin('molv');
                 laydate({ 
            format: 'YYYY-MM-DD hh:mm', // hh:mm:ss 分隔符可以任意定义，该例子表示只显示年月
            festival: true, //显示节日
            istime: true,
            istoday: true,
            choose: function(datas){ //选择日期完毕的回调 
                cscope[arr[0]][arr[1]][arr[2]] = datas;
            }
        });
             });
        }
    };
}]);




  //公共方法，编辑状态的切换
 app.directive('editstatus',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){ 
             var cscope = fac.getscope_byid($scope,$scope.yscid); 
               cscope.editstatus = iAttrs.editstatus;
               cscope.$apply();
        });
     }
   };
}]);
 

 //推出登录
 app.directive('lgout',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){ 
             var mscope = fac.getscope_byid($scope,$scope.ysmid); 
              mscope.lgout.done = function(re,sco){
                layer.msg('成功退出登录');
                mscope.we = '0';
              };
               mscope.lgout.time = fac.time();
               mscope.$apply();
        });
     }
   };
}]);
 

// 公共删除方法 
 app.directive('comdelone',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller){
        iElm.on("click",function(){ 
           var cscope = fac.getscope_byid($scope,$scope.yscid); 
           var obj = iAttrs.comdelone;
           var theid = iAttrs.theid||'id';
           var tip = iAttrs.tip?iAttrs.tip:'您确定要删除么？';
           var layercon = layer.confirm(tip, {
            btn: ['确定','取消'] //按钮
          }, function(){
             // // 触发时间时间戳  
          cscope[obj].params[theid] = $scope.value[theid]; 
           cscope[obj].done = function(re){
              if(re.code == 1){
                $scope.value.isdel=1;
                layer.msg("删除成功");
              }else{
                layer.msg("删除失败");
              }
              layer.close(layercon);
             };
           cscope[obj].time = fac.time(); 
           cscope.$apply(); 
          }); 
        });
     }
   };
}]);
// // 公共删除方法 
//  app.directive('comdeloneimg',['fac', function(fac){ 
// return { 
//     link: function($scope, iElm, iAttrs, controller){
//         iElm.on("click",function(){ 
//            var cscope = fac.getscope_byid($scope,$scope.yscid); 
//            var arr = iAttrs.comdeloneimg.split('.');
//         cscope[arr[0]][arr[1]][arr[2]]= iAttrs.value;
//         $scope.value[arr[2]] = iAttrs.value; 
//            cscope[arr[0]].time = fac.time(); 
//            cscope.$apply();  
//         });
//      }
//    };
// }]);

// 公共提问并执行方法 
 app.directive('comaskrun',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){ 
           var cscope = fac.getscope_byid($scope,$scope.yscid); 
           var obj = iAttrs.comaskrun;
           var theid = iAttrs.theid||'id';
           var tip = iAttrs.tip?iAttrs.tip:'您确定要提交么？';
           var layercon = layer.confirm(tip, {
            btn: ['确定','取消'] //按钮
          }, function(){
             // // 触发时间时间戳  
          cscope[obj].params[theid] = $scope.value[theid]; 
           cscope[obj].done = function(re){
              layer.msg(re.msg);
              layer.close(layercon);
             };
           cscope[obj].time = fac.time(); 
           cscope.$apply(); 
          });


        });
     }
   };
}]);
// 公共通过方法 
app.directive('comdone',['fac', function(fac){ 
  return{ 
    link: function($scope, iElm, iAttrs, controller) {
      iElm.on("click",function(){ 
        var cscope = fac.getscope_byid($scope,$scope.yscid); 
        var arr = iAttrs.comdone.split('.');
        var theid = iAttrs.key||'id'; 
        cscope[arr[0]][arr[1]][theid] = $scope.value[theid]; 
        cscope[arr[0]][arr[1]][arr[2]]= parseInt(iAttrs.v); 
        $scope.value[arr[2]] = parseInt(iAttrs.v);
        cscope[arr[0]].time =fac.time();
        cscope.$apply();
      });
    }
  };
}]);

//公共触发时间戳
app.directive('comtime',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){  
          var cscope = fac.getscope_byid($scope,$scope.yscid);
          cscope[iAttrs.comtime].time = fac.time();
          cscope.$apply();
        });
     }
   };
}]);

//公共编辑
app.directive('comedit',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){
          fac.setstore('id',iAttrs.comedit); 
        });
     }
   };
}]);


//公共select 的选择事件
app.directive('ysselect',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("change",function(){
        
          var arr = iAttrs.ysselect.split('.');
          var cscope = fac.getscope_byid($scope,$scope.yscid);
          cscope[arr[0]][arr[1]][arr[2]]=$(this).val(); 
          cscope.$apply(); 
        });
     }
   };
}]);

app.directive('ysupdateone',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("change",function(){  
         var cscope = fac.getscope_byid($scope,$scope.yscid); 
          var arr = iAttrs.ysupdateone.split('.'); 
          cscope[arr[0]][arr[1]]=$scope.value; 
          cscope[arr[0]][arr[1]][arr[2]]=$(this).val(); 
          cscope[arr[0]].time = fac.time();
         cscope.$apply(); 
        });
     }
   };
}]);

//公共tap切换
app.directive('selecttap',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){
           var arr = iAttrs.selecttap.split('.');
          var cscope = fac.getscope_byid($scope,$scope.yscid);
          cscope[arr[0]][arr[1]][arr[2]]=iAttrs.val; 
          cscope.$apply(); 
        });
     }
   };
}]);

//存store
app.directive('setstore',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){ 
          fac.setstore(iAttrs.key,iAttrs.setstore); 
        });
     }
   };
}]);


//公共下拉查询
app.directive('ysselectrun',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("change",function(){
          var arr = iAttrs.ysselectrun.split('.');
          var cscope = fac.getscope_byid($scope,$scope.yscid);
          cscope[arr[0]][arr[1]][arr[2]]=$(this).val();
          cscope[arr[0]].time = fac.time();
          cscope.$apply(); 
        });
     }
   };
}]);

//公共 勾选所有；
app.directive('ysselectall',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("change",function(){
          var arr = iAttrs.ysselectall.split('.');
          var cscope = fac.getscope_byid($scope,$scope.yscid);
          var list = arr[2]?cscope[arr[0]][arr[1]][arr[2]]:cscope[arr[0]][arr[1]]; 
          list.map(function(el){
               el.chk = $(iElm).is(':checked')?1:0;
          }); 
          cscope.$apply(); 
        });
     }
   };
}]);

//公共 勾选其中某一项；
app.directive('ysselectone',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){
         $scope.value.chk= $scope.value.chk ==1?0:1; 
          cscope.$apply(); 
        });
     }
   };
}]);
 
//公共方法
app.directive('yscheckrun',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){ 
          var arr = iAttrs.yscheckrun.split('.');
       
          var cscope = fac.getscope_byid($scope,$scope.yscid); 
          var t = $(iElm).is(':checked'); 
          $scope.value[arr[2]] = t?1:'0';
          cscope[arr[0]][arr[1]]=$scope.value;
          cscope[arr[0]].time = fac.time();
          cscope.$apply();
        });
     }
   };
}]);


//公共类型更新
app.directive('ysupdaterun',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){ 
          var arr = iAttrs.ysupdaterun.split('.'); 
          var cscope = fac.getscope_byid($scope,$scope.yscid);
          cscope[arr[0]][arr[1]][arr[2]]= $scope.value[arr[2]]==''?1:'';
          cscope[arr[0]][arr[1]][iAttrs.key] = $scope.value[iAttrs.key];
          $scope.value[arr[2]] = $scope.value[arr[2]]==''?1:'';
          cscope[arr[0]].time = fac.time();
          cscope.$apply(); 
        });
     }
   };
}]);


//公共  添加或编辑
app.directive('yseditadd',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){ 
            var cscope = fac.getscope_byid($scope,$scope.yscid);
            cscope[iAttrs.yseditadd].params = $scope.value||cscope.value; 
            cscope.$apply();
        });
     }
   };
}]);


//私有  添加或编辑
app.directive('ysaddpid',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){ 
          var cscope = fac.getscope_byid($scope,$scope.yscid);
          cscope[iAttrs.ysaddpid].params.pid = $scope.value.id; 
          cscope.$apply();
        });
     }
   };
}]);

app.directive('tapshow',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){   
          var cscope = fac.getscope_byid($scope,$scope.yscid);
          cscope.tapshow = iAttrs.tapshow;
          cscope.$apply();
        });
     }
   };
}]);



app.directive('mainshow',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){   
          var cscope = fac.getscope_byid($scope,$scope.ysmid);          
          cscope.mainshow = iAttrs.mainshow;
          cscope.$apply();
        });
     }
   };
}]);



app.directive('mkshow',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){   
          var cscope = fac.getscope_byid($scope,$scope.yscid);
          var key = iAttrs.mkshow;
          if(cscope[key]==1){
            cscope[key]=0;
          }else{
            cscope[key]=1;
          }

          cscope.$apply();
        });
     }
   };
}]);
app.directive('toggleshow',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){   
          var cscope = fac.getscope_byid($scope,$scope.yscid);
          cscope.toggleshow = iAttrs.toggleshow;
          cscope.$apply();
        });
     }
   };
}]);
app.directive('toggshow',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){   
          var cscope = fac.getscope_byid($scope,$scope.yscid);
          cscope.toggshow = iAttrs.toggshow;
          cscope.$apply();
        });
     }
   };
}]);

app.directive('tapshowrun',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){   
          var cscope = fac.getscope_byid($scope,$scope.yscid);
          cscope.tapshow = iAttrs.tap;
          cscope[iAttrs.tapshowrun].time =  fac.time(); 
          cscope.$apply();
        });
     }
   };
}]);


app.directive('ystaprun',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){  
          var cscope = fac.getscope_byid($scope,$scope.yscid);
          var arr = iAttrs.ystaprun.split('.'); 
          cscope[arr[0]][arr[1]][arr[2]] = $scope.value[arr[2]];
          cscope.tapshow = iAttrs.tap;
          cscope[arr[0]].time = fac.time();        
          cscope.$apply();
        });
     }
   };
}]);
//公共指令点击筛选
app.directive('selectrun',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){  
          var cscope = fac.getscope_byid($scope,$scope.yscid);
          var arr = iAttrs.selectrun.split('.'); 
          cscope[arr[0]][arr[1]][arr[2]] = iAttrs.value;
          cscope[arr[0]].time = fac.time();        
          cscope.$apply();
        });
     }
   };
}]);
app.directive('ysnoterun',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){  
          var cscope = fac.getscope_byid($scope,$scope.yscid);
          var arr = iAttrs.ysnoterun.split('.'); 
          cscope[arr[0]][arr[1]][arr[2]] = $scope.value['note'];
          cscope.tapshow = iAttrs.tap;
          cscope[arr[0]].time = fac.time();        
          cscope.$apply();
        });
     }
   };
}]);
app.directive('tapshowupload',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){   
          var cscope = fac.getscope_byid($scope,$scope.yscid);
          cscope.tapshow = iAttrs.tapshowupload;
          cscope.$apply();
          var arr = iAttrs.savekey.split('.');  
          $list = $('#thelist'),
          $btn = $('#ctlBtn'),
          state = 'pending';
          var obj = cscope[arr[0]][arr[1]];
          var key = arr[2];
          fac.webupload($list,$btn,state,obj,key,cscope,iAttrs.more); 
           YS("ueditor",function(){  
            UE.getEditor('editor');
             
             setTimeout(function(){
              UE.getEditor('editor').destroy();
              UE.getEditor('editor'); 
             },500);
             
          });

        });
     }
   };
}]);
app.directive('delimg',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){
           var cscope = fac.getscope_byid($scope,$scope.yscid); 
           var arr = iAttrs.delimg.split('.');
           var keyarr = arr[2]+'arr'; 
           cscope[arr[0]][arr[1]][keyarr].splice($scope.$index,1); 
           var a = cscope[arr[0]][arr[1]][keyarr].map(function(elem) {
              return elem.img;
           });
           cscope[arr[0]][arr[1]][arr[2]]= a.join(',');
           cscope.$apply();
        });
     }
   };
}]);
//修改后可用于当前页单个字段单个图片或多个上传
app.directive('tapshowupload2',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){   
          var cscope = fac.getscope_byid($scope,$scope.yscid);
          cscope.tapshow = iAttrs.tapshowupload2;
          cscope.$apply();
          var arr = iAttrs.savekey.split('.');
          $list = $('#thelist'),
          $btn = $('#ctlBtn'),
          state = 'pending';
          var obj = cscope[arr[0]][arr[1]];
          var key = arr[2];
          fac.webupload($list,$btn,state,obj,key,cscope,iAttrs.more); 
        });
     }
   };
}]);
//修改后可用于当前页多个字段图片上传
app.directive('webupload2',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){   
          var cscope = fac.getscope_byid($scope,$scope.yscid);
          var arr = iAttrs.savekey.split('.');  
          var obj = cscope[arr[0]][arr[1]];
          var key = 1; 
          var more = 1;   
          $list = $('#thelist'),
          $btn = $('#ctlBtn'),
          state = 'pending';
          fac.webupload($list,$btn,state,obj,key,cscope,more);
        });
     }
   };
}]);
//用于拿到存储在本地的upimg
app.directive('pickerrun',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){   
          var upimg = fac.getstore('upimg');
          fac.setstore('hash',fac.hashtoobj(upimg));
        });
     }
   };
}]);
app.directive('toggshowupload',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){   
          var cscope = fac.getscope_byid($scope,$scope.yscid);
          cscope.toggshow = iAttrs.toggshowupload;
          cscope.$apply();
           YS("ueditor",function(){  
            UE.getEditor('editor2');
             
             setTimeout(function(){
              UE.getEditor('editor2').destroy();
              UE.getEditor('editor2'); 
             },500);
             
          }); 

        });
     }
   };
}]);
//公共当前页编辑
app.directive('updatepage',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
      iElm.on("change",function(e){ 
        var cscope = fac.getscope_byid($scope,$scope.yscid);
        var arr = iAttrs.updatepage.split('.');
        var theid = iAttrs.key;
        cscope[arr[0]][arr[1]][theid] = $scope.value[theid];
        cscope[arr[0]][arr[1]][arr[2]]= $(iElm).val();
        $scope.value[arr[2]] = $(iElm).val();
        cscope[arr[0]].time =fac.time();
        cscope.$apply();
      });
     }
   };
}]); 
//公共当前页编辑加带审核原因
app.directive('updateshenhe',['fac', function(fac){ 
  return { 
    link: function($scope, iElm, iAttrs, controller) {
      iElm.on("change",function(e){ 
        var cscope = fac.getscope_byid($scope,$scope.yscid);
        var arr = iAttrs.updateshenhe.split('.');
        var theid = iAttrs.key;
        var thereason = iAttrs.reason||'reason';
        cscope[arr[0]][arr[1]][theid] = $scope.value[theid];
        if($(iElm).val()=='2'){ 
          layer.prompt({title: '审核不通过原因', formType: 2}, function(text, index){ 
            if(text===''){
              layer.msg('原因不能为空');
            }else{
              layer.close(index);
              cscope[arr[0]][arr[1]][arr[2]]= $(iElm).val();
              cscope[arr[0]][arr[1]][thereason] = text;
              $scope.value[arr[2]] = $(iElm).val();
              cscope[arr[0]].time =fac.time();
              cscope.$apply();
            }  
          });
        }else{
        cscope[arr[0]][arr[1]][arr[2]]= $(iElm).val();
        $scope.value[arr[2]] = $(iElm).val();
        cscope[arr[0]].time =fac.time();
        cscope.$apply();
        } 
      });
    }
  };
}]);

//公共当前页 发布  默认带 空的审核原因    hsl
app.directive('updaterun',['fac', function(fac){ 
  return { 
    link: function($scope, iElm, iAttrs, controller) {
      iElm.on("click",function(){ 
        var cscope = fac.getscope_byid($scope,$scope.yscid);
        var arr = iAttrs.updaterun.split('.');
        var theid = iAttrs.key;
        cscope[arr[0]][arr[1]][arr[2]]= iAttrs.value;
        $scope.value[arr[2]] = iAttrs.value;
        cscope[arr[0]].time =fac.time();
        cscope.$apply();
      });
    }
  };
}]);


//公共当前页 发布  默认带 空的审核原因    hsl
app.directive('optionrun',['fac', function(fac){ 
  return { 
    link: function($scope, iElm, iAttrs, controller) {
      iElm.on("mouseover",function(){ 
        var cscope = fac.getscope_byid($scope,$scope.yscid);
        var arr = iAttrs.optionrun.split('.');
        var theid = iAttrs.key;
        cscope[arr[0]][arr[1]][arr[2]]= iAttrs.value;
        $scope.value[arr[2]] = iAttrs.value;
        cscope[arr[0]].time =fac.time();
        cscope.$apply();
      });
    }
  };
}]);
//头像预览
app.directive('changeimg',['fac', function(fac){ 
    return { 
        link: function($scope, iElm, iAttrs, controller) {
            iElm.on("change",function(){
               var cscope = fac.getscope_byid($scope,$scope.yscid); 
               var objUrl = fac.getObjectURL(this.files[0]);
                if(objUrl){$('.basicinfortimg').find('img').attr("src", objUrl);} 
                // $(iAttrs.element).ajaxSubmit({
                //     url:"/admin.php/index/upload?name="+,
                //     success: function(re) {
                //       cscope[iAttrs.changeimg].params[iAttrs.imgkey]=re.url;
                //       cscope.$apply();
                //     }
                // }); 
            });
        }
    };
}]); 

//图片上传
app.directive('imgupload',['fac', function(fac){ 
    return { 
        link: function($scope, iElm, iAttrs, controller) {
            iElm.on("change",function(){
               var cscope = fac.getscope_byid($scope,$scope.yscid); 
               //对iAttrs。imgupload进行解析
                var arr = iAttrs.imgupload.split('.');
                $(iAttrs.formid).ajaxSubmit({ 
                    success: function(re) {
                      cscope[arr[0]][arr[1]][arr[2]]=re.data.pathurl;
                      cscope.$apply();
                    }
                }); 
            });
        }
    };
}]); 

//文件上传
app.directive('fileupload',['fac', function(fac){ 
    return { 
        link: function($scope, iElm, iAttrs, controller) {
            iElm.on("change",function(){
              alert(123);
               var cscope = fac.getscope_byid($scope,$scope.yscid); 
               //对iAttrs。imgupload进行解析
                var arr = iAttrs.fileupload.split('.');
                $(iAttrs.formid).ajaxSubmit({ 
                    success: function(re) {
                      cscope[arr[0]][arr[1]][arr[2]]=re.data.pathurl;
                      cscope.$apply();
                    }
                }); 
            });
        }
    };
}]); 


//私有简历上传
app.directive('resumeupload',['fac', function(fac){ 
    return { 
        link: function($scope, iElm, iAttrs, controller) {
            iElm.on("change",function(){
               var cscope = fac.getscope_byid($scope,$scope.yscid);
                 $(document).on('change','.a-upload',function(){      
                    var filePath=$(this).val();
                    if(filePath.indexOf("jpg")!=-1 || filePath.indexOf("pdf")!=-1 || filePath.indexOf("doc")!=-1 || filePath.indexOf("docx")!=-1){
                       var arr = iAttrs.resumeupload.split('.');
                       $(iAttrs.formid).ajaxSubmit({ 
                           url:'http://api.yushan.com/auth/resumeupload?token='+fac.getstore('ystoken'),
                           success: function(re) { 
                             cscope[arr[0]][arr[1]][arr[2]]=re.data.pathurl;
                             cscope[arr[0]][arr[1]]['attachmentname']=re.data.filename;                      
                             cscope.com_detail.data.attachmentname = re.filename; 
                             cscope.$apply();
                             
                           }
                       });                      
                    }else{                        
                        layer.msg('您上传文件类型有误！请重新上传');
                        return false; 
                    }
                 });

               //对iAttrs。imgupload进行解析
                 
            });
        }
    };
}]); 
//私有方法
app.directive('chkpowitem',['fac', function(fac){ 
    return { 
        link: function($scope, iElm, iAttrs, controller) {
            iElm.on("click",function(){ 
              var t = $(iElm).is(':checked');
              $(iElm).parent().parent().parent().find('input').prop('checked',t);
            });
        }
    };
}]); 


//公共当前页 发布  默认带 空的审核原因    fxx 触发getchat接口
app.directive('yschatrun',['fac', function(fac){ 
  return { 
    link: function($scope, iElm, iAttrs, controller) {
      iElm.on("click",function(){ 
        var cscope = fac.getscope_byid($scope,$scope.yscid);
        cscope[iAttrs.yschatrun].params.touserid= iAttrs.touserid;
        cscope[iAttrs.yschatrun].time =fac.time();
        cscope.$apply();
      });
    }
  };
}]);
//发送聊天记录
app.directive('yssendmsg',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){ 
        var cscope = fac.getscope_byid($scope,$scope.yscid); 
        var input = $.trim($('#editor').val());
        var chattype = iAttrs.chattype;
        if(input==''&&chattype==1){
            layer.tips('请输入内容', '#send');
            return false;

        }//如果内容为空，发送内容失败
        var mine = {"nickname":user1.nickname,uid:user1.id,"content":input,"filetype":0,"chattype":chattype,"avatar":user1.avatar,"jobid":user1.jobid,"note":user1.note,"reason":user1.reason};
        var to = {"nickname":user2.nickname,uid:user2.id,"type":"privateChat","chattype":chattype,"avatar":user2.avatar};
        var login_data = fac.setMessage("chatMessage",mine,to);
        cscope.socket.send(login_data);
        $('#editor').val('');
        $("#editor").focus();
        });
     }
   };
}]);
//关闭表情发送
app.directive('closeface',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){ 
            var cscope = fac.getscope_byid($scope,$scope.yscid); 
            $('#facebox').hide();
        });
     }
   };
}]);
//开启表情发送
app.directive('clickface',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){ 
            var cscope = fac.getscope_byid($scope,$scope.yscid); 
            $('#facebox').show();
        });
     }
   };
}]);
/*私有方法*/

// 获取选项省份id
app.directive('getcity',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("mouseover",function(){ 
          var cscope = fac.getscope_byid($scope,$scope.yscid);
         cscope.nowcity = []; 
        cscope.com_list2.data.map(function(el){
          if(el.pid==iAttrs.getcity){

            cscope.nowcity.push(el);
          }
        });
      $scope.$apply();
        });
     }
   };
}]);
// 获取搜索关键词
app.directive('getkw',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){ 
          var cscope = fac.getscope_byid($scope,$scope.yscid);
          var keyword = $scope.keyword; 
          var hrefx = window.location.href.split('?');
          var has = fac.getstore('hash');
          var o = iAttrs.getkw;
          var newu = o + '=' +  keyword;
          if (!has) {
            newu = hrefx[0]+'?'+newu;
            window.location.href = newu;
          }else{
             var arr = [];
            var t = false;

            for (key in has) {
               var str = key +'=' + has[key];
                if(key==o){t=true;str = key +'=' + keyword;}
               arr.push(str);              
            }
            if(!t){arr.push(newu);}           
            var u = arr.join('&');
            window.location.href =  hrefx[0]+'?'+u;
          }      
         
      $scope.$apply();
        });
     }
   };
}]);


// 首页选项获取ID拼接地址
app.directive('setlocalurl',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){ 
          var cscope = fac.getscope_byid($scope,$scope.yscid);
          var allid = iAttrs.setlocalurl;
          cscope.com_list5.params['cid'] = $scope.value.c_id;
          var jid = iAttrs.val;

          var newurl = allid+'='+jid;
          var gethash = fac.getstore('hash');
          var hrefx = window.location.href.split('?');
          if(gethash == ''){ 
            newurl = hrefx[0]+'?'+newurl;
            window.location.href = newurl; 
          }else{
            var arr = [];
            var t = false;
            for (key in gethash) {
               var str = key +'=' + gethash[key];
                if(key==allid){t=true;str = key +'=' + jid;}
               arr.push(str);              
            }
            if(!t){arr.push(newurl);}           
            var u = arr.join('&');
            window.location.href =  hrefx[0]+'?'+u;

          }
        
        $scope.$apply();
        });

     }
   };
}]);

// 首页列表选择城市找对应的省份
app.directive('setcyprurl',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){ 
          var cscope = fac.getscope_byid($scope,$scope.yscid);
          var allid = iAttrs.setcyprurl;
          var jid = iAttrs.val;
          var newurl = allid+'='+jid;
          var hrefx = window.location.href.split('?');

             // 单独选择城市需要把对应pid找出         
          cscope.com_list2.data.map(function(e){
              var propid = '';
              if (jid == e.cityid) {
                propid = e.pid;
                window.location.href = hrefx[0]+'?'+allid+'='+jid+'&'+'province'+'='+propid;
              }
          });
        $scope.$apply();
        });

     }
   };
}]);

// 选择省份不限移除省份和城市参数拼接地址
app.directive('delpro',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){ 
            var cscope = fac.getscope_byid($scope,$scope.yscid);
            var nowhash = fac.getstore('hash');
            var hrefx = window.location.href.split('?');
            var k = iAttrs.delpro;
            if(nowhash!=null&&nowhash[k]!=undefined){
               delete nowhash[k];
               delete nowhash.city;
                 fac.setstore('hash',nowhash);
                 var arr = [];
                 for(k in nowhash){
                     var str = k +'=' + nowhash[k];
                     arr.push(str);  
                 }
                 var u = arr.join('&');
                 window.location.href =  hrefx[0]+'?'+u; 
            }
  
        $scope.$apply();
        });

     }
   };
}]);





// 选择不限移除参数拼接地址
app.directive('delthis',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){ 
            var cscope = fac.getscope_byid($scope,$scope.yscid);
            var nowhash = fac.getstore('hash');
            var hrefx = window.location.href.split('?');
            var k = iAttrs.delthis;
            if(nowhash!=null&&nowhash[k]!=undefined){
               delete nowhash[k];
                 fac.setstore('hash',nowhash);
                 var arr = [];
                 for(k in nowhash){
                     var str = k +'=' + nowhash[k];
                     arr.push(str);  
                 }
                 var u = arr.join('&');
                 window.location.href =  hrefx[0]+'?'+u; 
            }
  
        $scope.$apply();
        });

     }
   };
}]);
// 找回密码
app.directive('findpsword',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){         
           setTimeout(function(){
               layer.open({

                type: 1,
              title: false, //不显示标题栏
              closeBtn: false,
              shade: 0.8,
              id: 'LAY_layuipro', 
              resize: false,
              btnAlign: 'c',
              area: ['434px', '402px'],//宽高
              moveType: 1, //拖拽模式，0或者1
              shade: false ,
              content:  $('.forget-box')

               });
           },300);
        $scope.$apply();
        });

     }
   };
}]);
// 找回密码
app.directive('rightornot',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){
           var username = $scope.username;
           var captcha = $scope.captcha;
          var code = $scope.code;
          var a = $scope.passwordone;
           var b = $scope.passwordtwo;
           var tel = fac.testphone(username); 
           if (username==undefined) {
            layer.msg('请输入手机号码');
           }else{
              if (!tel) {
                layer.msg('请输入正确的手机号码');
              }else{
                if (!captcha) {
                   layer.msg('请输入验证码');
                }else{
                   if (!code) {
            layer.msg('请输入手机验证码');
           }else{
              if (!a || !b) {
                layer.msg('密码不能为空');
              }else{
                if ( a.length < 6 || 16 < a.length || b.length < 6 || 16 < b.length ) {
                  layer.msg('请输入6-16位密码');
                }else{
                  if (a !== b) {
                    layer.msg('输入两次密码不一致');
                  }else{
                     var sendData={
                      username:username,
                      password:a,
                      code:code
                  };
                  $.ajax({
                       url:'http://api.yushan.com/base/find_pass',
                       type:"POST",
                        xhrFields: {
                           withCredentials: true
                       },
                       data:sendData,
                       success:function(u){
                       if(u.code==1){
                            layer.msg('修改成功,正在跳转');
                           setTimeout(function(){
                              layer.closeAll();                                                            
                           },1500);
                         } else {
                           layer.msg(u.msg);
                           
                         }
                          $('#captchahit').attr('src','http://api.yushan.com/Base/verify?timestamp='+Date.parse(new Date()));
                       }
                   });
                  }
                }
              }
           }
                }
              }
           }         
        $scope.$apply();
        });

     }
   };
}]);

// 注册框
app.directive('registerbox',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){
        layer.closeAll();
        setTimeout(function(){
          layer.open({
            type: 1,
          title: false,//不显示标题栏
          closeBtn: false,
          shade: 0.8,
          id: 'LAY_layuipro', 
          resize: false,
          btnAlign: 'c',
          area: ['736px', '408px'],//宽高
          moveType: 1, //拖拽模式，0或者1
          shade: false,
          content:  $('.register-box')
           }); 
        },200);
                            
        });
     }
   };
}]);

// 注册成功
app.directive('zcscuuess',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){  
           layer.open({
            type: 1,
          title: false, //不显示标题栏
          closeBtn: false,
          shade: 0.8,
          id: 'LAY_layuipro',
          resize: false,
          btnAlign: 'c',
          area: ['435px', '150px'],//宽高
          moveType: 1, //拖拽模式，0或者1
          shade: false, 
          content:  $('.zc-scuuess'),
          success: function(layero){
               window.setTimeout(" window.location.reload(); ", 3000);  
          }
           });                  
        });
     }
   };
}]);
// 注册
app.directive('enroll',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {        
        iElm.on("click",function(){  
      var mscope = fac.getscope_byid($scope,$scope.ysmid);
          var username = $scope.username;
          var password = $scope.password;
          var code = $scope.code;
          var captcha = $scope.captcha;
          var xycheckbox = $scope.xycheckbox;
          var sendData={
                username:username,
                password:password,
                captcha:captcha,
                code:code
            };
          // 判断手机
         var tel = fac.testphone(username);           
          if (username==undefined) {
            layer.msg('请输入手机号码'); 
          }else{
            // 手机号11位与1开头
            if (!tel) {
              layer.msg('请输入正确的手机号码'); 
            }else{
                if (captcha==undefined) {
                  layer.msg('请输入验证码'); 
                }else{
                   if (code==undefined) {
                    layer.msg('请输入短信验证码');
                   }else{
                      if (password==undefined || password.length < 6 || password.length > 16) {
                layer.msg('请输入6-16位密码'); 
              }else{
                // 判断复选框
                if (xycheckbox !== true) {
                   layer.msg('您还没阅读《石头协议》'); 
                }else{
                     $.ajax({
                       url:'http://api.yushan.com/base/u_register',
                       type:"POST",
                        xhrFields: {
                           withCredentials: true
                       },
                       data:sendData,
                       success:function(u){
                       if(u.code==1){
                            layer.msg('注册成功,正在跳转');
                             localStorage.setItem('ystoken',u.token); 
                            localStorage.setItem('uuid',u.uuid);                           
                           setTimeout(function(){
                              layer.closeAll();
                               mscope.we = 1;
                              mscope.$apply();
                           },1500);
                         } else {
                           layer.msg('该用户已注册,请您直接登录');
                           setTimeout(function(){
                             layer.closeAll();
                           },800);
                           setTimeout(function(){                                
                                layer.open({
                                   type: 1,
                                  title: false, //不显示标题栏
                                  closeBtn: false,
                                  shade: 0.8,
                                  id: 'LAY_layuipro', 
                                  resize: false,
                                  btnAlign: 'c',
                                  area: ['738px', '364px'],//宽高
                                  moveType: 1, //拖拽模式，0或者1
                                  shade: false, 
                                  content:  $('.login-box')
                                });
                           },1500);
                         }
                          $('#captchahit').attr('src','http://api.yushan.com/Base/verify?timestamp='+Date.parse(new Date()));
                       }
                   });
                }
              }
           }
         }

              
     }
            
   }
         
          
           
       });
     }
   };
}]);
// 校验验证码
app.directive('checkcode',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){ 
            var captcha = $scope.captcha;
            var piccode = iAttrs.value; 
            var username = $scope.username;
             var sendData={
                username:username,
                check:1,
                captcha:captcha
            };
            var tel = fac.testphone(username);      
            if (username==undefined) {
              layer.msg('请输入手机号码');
            }else{
                if (!tel) {
                  layer.msg('请输入正确的手机号码');
                }else{
                  if (!captcha) {
                    layer.msg('请输入验证码');
                  }else{
                    $.ajax({
                       url:'http://api.yushan.com/base/getphoneverifycode',
                       type:"POST",
                        xhrFields: {
                           withCredentials: true
                       },
                       data:sendData,
                       success:function(u){
                       if (u.code==1) {
                           layer.msg('验证码已发送');
                                        var st = 59;
                           $('.ipt').val('发送验证码');
                             var sese =  setInterval(function(){                   
                               if(st > 1){
                                        $('.ipt').addClass('color_8f');
                                         $('.ipt').attr('disabled',true);
                                        st = ~~st - 1 ;
                                        $('.ipt').val('重新发送'+'('+st+')');
                                    }else{
                                      $('.ipt').val('发送验证码');
                                      clearInterval(sese);
                                       $('.ipt').addClass('color_blue');
                                       $('.ipt').attr('disabled',false);
                                    }
                                    
                              },1000);
                         } else {
                           layer.msg(u.msg);
                         }


                       }
                   });
                // 倒计时60s                                
               
                  }
                }          
            }

        });
     }
   };
}]);


// 点击刷新页面
app.directive('refresh',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){  
         window.location.reload();       
        });
     }
   };
}]);



// 登录框
app.directive('loginbox',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){  
       window.lg==null?fac.lginbox():''; 
        });
     }
   };
}]);


app.directive('lgnull',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){  

          window.lg=null;
        });
     }
   };
}]);
// 登录按钮
app.directive('loginbt',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){ 
 var mscope = fac.getscope_byid($scope,$scope.ysmid);

             var  a=$('#username').val();
             var  b=$('#password').val();
             var  c=$('#captcha').val();
            var sendData={
                username:a,
                password:b,
                captcha:c
            };
              $.ajax({
                url:'http://api.yushan.com/Base/login',
                type:"POST",
                 xhrFields: {
                    withCredentials: true
                },
                data:sendData,
                success:function(h){
                if (h.code==1) {
                    layer.msg('系统登录中…');
                    localStorage.setItem('ystoken',h.token); 
                    localStorage.setItem('uuid',h.uuid); 
                    mscope.we = 1;
                    mscope.$apply();
                    setTimeout(function () {
                      layer.closeAll();
                    }, 1000);
                  } else {
                    $('#tip').html(h.msg); 
                  }
                   $('#captchahit').attr('src','http://api.yushan.com/Base/verify?timestamp='+Date.parse(new Date()));
                }
            });

        });
     }
   };
}]);


// 验证码登录按钮
app.directive('loginphbt',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){  
          var mscope = fac.getscope_byid($scope,$scope.ysmid);
             var username = $scope.username;
             var code = $scope.code;
            var sendData={
                username:username,
                code:code
            };
             var tel = fac.testphone(username);            
              if (!tel) {
                layer.msg('请输入正确的手机号码');
              }else{
                if (code==undefined) {
                  layer.msg('请输入验证码');
                }else{
                   $.ajax({
                url:'http://api.yushan.com/base/phone_login',
                type:"POST",
                 xhrFields: {
                    withCredentials: true
                },
                data:sendData,
                success:function(h){
                if (h.code==1) {
                    layer.msg('系统登录中…');
                    localStorage.setItem('ystoken',h.token); 
                    localStorage.setItem('uuid',h.uuid); 
                    setTimeout(function () {
                      layer.closeAll();
                      mscope.we = 1;
                      mscope.$apply();
                    }, 1000);
                  } else {
                    layer.msg(h.msg); 
                  }
                   $('#captchahit').attr('src','http://api.yushan.com/Base/verify?timestamp='+Date.parse(new Date()));
                }
            });
                }
              }
                     

        });
     }
   };
}]);
// 登录校验验证码
app.directive('loginckcode',['fac', function(fac){ 
return { 
    link: function($scope, iElm, iAttrs, controller) {
        iElm.on("click",function(){ 
            var code = $scope.code;
            var piccode = iAttrs.value; 
            var username = $scope.username;
            var sentipt = iAttrs;
             var sendData={
                username:username,
                code:code
            };    
                var tel = fac.testphone(username); 
                if (!tel) {
                  layer.msg('请输入正确的手机号码');
                }else{
                       // 倒计时60s                                
                       var st = 59;
                      $(this).val('发送验证码');
                        var _this = this;
                        var sese =  setInterval(function(){                   
                          if(st>1){
                                   $(_this).addClass('color_8f');
                                    $(_this).attr('disabled',true);
                                   st = ~~st - 1 ;
                                   $(_this).val('重新发送'+'('+st+')');
                               }else{
                                 $(_this).val('发送验证码');
                                 clearInterval(sese);
                                  $(_this).addClass('color_blue');
                                  $(_this).attr('disabled',false);
                               }
                               
                         },1000);
                    $.ajax({
                       url:'http://api.yushan.com/base/getphoneverifycode',
                       type:"POST",
                        xhrFields: {
                           withCredentials: true
                       },
                       data:sendData,
                       success:function(u){
                       if (u.code==1) {

                           layer.msg('验证码已发送');
                         } else {
                           layer.msg('验证码发送失败');
                         }


                       }
                   });
                
                 
                }          
           

        });
     }
   };
}]);



 //4. rander_fac 处理函数（就是请求接口前后做的事情[默认不做]）
angular.module("render", []).factory('hdl',['fac',function(fac){ 
  var dosomething = {
	
  zpindex:{ 
    init:function(sco){   
    
    
    sco.com_list_page.done = function(re,sco){
        sco.zwtotal = re.data.total; 
      };                 
    sco.nowpid = '';
    sco.hotpro = [];  
    sco.nowcity = [];
    sco.clcity = [];  
    sco.cities =[];
    sco.exper = '';
    sco.money = '';
    sco.comtype = '';

    // sco.kword = com_list_page.params.keyword;
    sco.nowprovince = '全国';
     sco.cityname = '请选择';
    var prohash = fac.getstore('hash');
    // 搜索栏keyword
    if ( prohash && prohash.keyword) {
      sco.keyword = decodeURI(prohash.keyword);
    }
    
      sco.com_list.url = 'open/com_list';
      sco.com_list.params = {"codeid":fac.getcd(sco,'c58'),debug:1,debugkey:"c58","name":"省份"};


      sco.com_list.done = function(re,sco){
           // 热门省份
          sco.com_list.data.map(function(l){
           if (l.hot==1) {
             sco.hotpro.push(l);
           } 
          });


         sco.com_list2.time = fac.time();        
        // 获取省份
         if (prohash.province == null) {
        sco.nowprovince = '全国';
      }else{
        sco.com_list.data.map(function(ro) {
          if (prohash.province == ro.pid) {
            sco.nowprovince = ro.province;
          }
        });
      }
      
      };
      sco.com_list.time = fac.time();        
      sco.com_list2.url = 'open/com_list';
      sco.com_list2.params = {"codeid":fac.getcd(sco,'c57'),debug:1,debugkey:"c57","name":"城市"};
      sco.com_list2.done = function(re,sco){
          
        // 绑定城市
         sco.com_list2.data.map(function(r){
          if (!prohash.city) {
            sco.cityname = '请选择';
          }else{
            if (prohash.city == r.cityid) {
            sco.cityname = r.city;
            
            }
          }
           // 根据省份找对应城市push进去
          if (r.pid == prohash.province) {
            sco.cities.push(r);
          }
         });
         
      };

      sco.com_list3.url = 'open/com_list';
      sco.com_list3.params = {"codeid":fac.getcd(sco,'c77'),"c_alias":"QS_experience",debug:1,debugkey:"c77","name":"经验"};
      sco.com_list3.time = fac.time();
      // 选中的经验加上类
      sco.com_list3.done = function(re,sco){
        sco.com_list3.data.map(function(i){
          if (i.c_id == prohash.experience) {
            sco.exper = i.c_name;
          }
        });
      };

      sco.com_list4.url = 'open/com_list';
      sco.com_list4.params = {"codeid":fac.getcd(sco,'c77'),"c_alias":"QS_wage",debug:1,debugkey:"a77","name":"薪资"};
      sco.com_list4.time = fac.time();
       // 选中的经验加上类
      sco.com_list4.done = function(re,sco){
        sco.com_list4.data.map(function(w){
          if (w.c_id == prohash.wage) {
            sco.money = w.c_name;
          }
        });
      };

      sco.com_list5.url = 'open/com_list';
      sco.com_list5.params = {"codeid":fac.getcd(sco,'c77'),"c_alias":"QS_company_type",debug:1,debugkey:"a55","name":"公司类型"};
      sco.com_list5.time = fac.time();
       // 选中的经验加上类
      sco.com_list5.done = function(re,sco){
        sco.com_list5.data.map(function(z){
          if (z.c_id == prohash.company_type) {
            sco.comtype = z.c_name;
          }

        });
      };
     
      sco.com_list_page.url = 'open/ucom_list_page';
      sco.com_list_page.params = {"codeid":fac.getcd(sco,'c79'),keyword:"",listnum:8,curPage:1,"name":"职位列表"};
      
      
      
      // 筛选类型触发职位列表时间戳
      if (!prohash) {
         sco.com_list_page.time = fac.time();/*如果hash为空直接出发时间戳*/
       }else{
         var allhs = fac.getstore('hash');
        // 省份
        if (!allhs.province) {
        }else{
          sco.com_list_page.params.province = allhs.province;
        }
        // 城市
        if (!allhs.city) { 
        }else{
          sco.com_list_page.params.city = allhs.city;
        }
        // 经验
        if (!allhs.experience) {     
        }else{
          sco.com_list_page.params.experience = allhs.experience;
        }
        // 薪资
        if (!allhs.wage) {  
        }else{
          sco.com_list_page.params.wage = allhs.wage;
        }
        // 公司类型
         if (!allhs.company_type) {        
        }else{
          sco.com_list_page.params.company_type = allhs.company_type; 
        }
        sco.com_list_page.time = fac.time();/*筛选上面条件最后出发时间戳*/
       }


      sco.com_list_page.before = function(){
        if (sco.keyword) {
           sco.com_list_page.params.keyword = sco.keyword;
        sco.com_list_page.time = fac.time();
      }else{
         sco.com_list_page.time = fac.time();      
      }

      };
　　　// 搜索Enter
   sco.enterEvent = function(e) {
        var keycode = window.event?e.keyCode:e.which;
        if(keycode==13){  
          var keyword = sco.keyword; 
          var hrefx = window.location.href.split('?');
          var has = fac.getstore('hash');
          var o = 'keyword';
          var newu = o + '=' +  keyword;
          if (!has) {
            newu = hrefx[0]+'?'+newu;
            window.location.href = newu;
          }else{
             var arr = [];
            var t = false;

            for (key in has) {
               var str = key +'=' + has[key];
                if(key==o){t=true;str = key +'=' + keyword;}
               arr.push(str);              
            }
            if(!t){arr.push(newu);}           
            var u = arr.join('&');
            window.location.href =  hrefx[0]+'?'+u;
          }    

           }
    };
       
          
    }
},



	resume:{ 
	 	init:function(sco){
      sco.mk1 = 0;
      sco.mk2 = 0;
      sco.mk3 = 0;
      sco.mk4 = 0;
      sco.mk5 = 0;
      sco.mk6 = 0;
      sco.mk7 = 0; 


   sco.ystoken = fac.getstore('ystoken');
       sco.com_detail.url = 'auth/mycom_detail';
	     sco.com_detail.params = {codeid:fac.getcd(sco,'c75'),debug:1,debugkey:"c75"};
       sco.com_detail.time = fac.time();
      
       sco.com_detail.done = function(re,sco){
         sco.sex = re.data.sex;
         var aa = re.data.attachment;
 
       };
       
      sco.com_list2.url = 'auth/mycom_list';
      sco.com_list2.params = {"codeid":fac.getcd(sco,'c80'),debug:1,debugkey:"c80"};
      sco.com_list2.time = fac.time();
      
      sco.com_editadd.url = 'auth/mycom_editadd';
      sco.com_editadd.params = {"codeid":fac.getcd(sco,'c75'),debug:1,debugkey:"c80"};
      sco.com_editadd.done = function(re,sco){ 
        layer.msg('修改成功');
        sco.mk1 = 0;
        sco.mk2 = 0;
        sco.mk3 = 0;
        sco.mk4 = 0;
        sco.mk5 = 0;
        sco.mk6 = 0;
        sco.mk7 = 0; 
      };
            

     	 	}
},
//聊天列表
chatlist:{ 
    init:function(sco){
        sco.mk1 = 0;
        sco.com_detail.before = function(sco){ 
            sco.com_detail.url = 'chat/getchat';//建立沟通
            sco.com_detail.params.touserid = '';//建立沟通
        };
        sco.com_detail.time = fac.time();
        sco.com_detail.done = function(re,sco){
            user1 = re.data.user; 
            fac.socketinit(sco);
        };
        $(document).on('click',"#bianji",function(){
            if(sco.mk1==0){
                $("#bianji").removeClass('color_white2');
                $("#bianji").addClass('color_white3');
            }
            if(sco.mk1==1){
                $("#bianji").removeClass('color_white3');
                $("#bianji").addClass('color_white2');
            }
        });//切换编辑的颜色
        sco.com_list4.url = "chat/getallchatlog";
        sco.com_list4.params.listnum = 6;
        sco.com_list4.before = function(sco){ 
            sco.chatsidebar=[];
        };
        sco.com_list4.time = fac.time();
        sco.com_list4.done = function(re,sco){
            for (var i = re.data.datalist.length-1; i >= 0; i--) {
                re.data.datalist[i]['content'] = fac.replace_em(re.data.datalist[i]['content']);
                var da = re.data.datalist[i];
                sco.chatsidebar.unshift(da);
            }//拼字符聊天渲染页面内容
            sco.com_del.before = function(sco){ 
                sco.com_del.url = 'chat/chat_delete';
                sco.com_del.params.jobid = fac.getstore('jobid');
            };//聊天列表删除
            $(document).on('click',"[name='delone']",function(){
                var a = $(this).parent().index();
                $(".resume-list").find('li').eq(a).addClass('dpn');
                $("[name='jump']").attr('href','javascript:void(0);');
            });
        };
    }
},
chat:{ 
    init:function(sco){    
        sco.datalist = [];
        $(document).ready(function(){
            setTimeout(function () {
                $('#qqface').qqface({
                    id:'facebox', 
                    assign:'editor', 
                    path:'/images/face/'
                }); 
                document.getElementById('chatwindow').scrollTop=document.getElementById('chatwindow').scrollHeight;
            }, 500);
        });
        $(document).keyup(function(event){
            if (event.shiftKey && event.keyCode == 13){
                var bb = document.createElement("div");
                bb.innerHTML = "<br/>";
                $("#editor").val().append(bb);
            }
            if(event.keyCode==13){
                $("#send").click();
            }
        });//按下enter键发送内容，按下shift+enter键换行
        $(document).on('click',"#cha1",function(){
            $(".newmore").remove();
        });//点叉去掉新消息提醒
         $(document).on('click',"#cha2",function(){
            $(".loadmore").remove();
        });//点叉去掉加载更多
        $(document).on('click',".newmore",function(){
            $(".newmore").remove();//去掉新消息提醒
        });
        sco.mk1 = 0;
        sco.mk2 = 0;
        sco.mk3 = 0;//查看邀请面试用
        var chatjob = fac.getstore('hash');//拿到来自职位详情的链接
        var chattype = fac.getstore('chattype');
        if(fac.getstore('chattype')==18){
            fac.setstore('chattype',1);
        }//初次交流的第一句，类型为18，然后置为1
        sco.com_detail2.url = 'open/com_detail';
        sco.com_detail2.params = {codeid:chatjob.codeid};//职位详情
        sco.com_detail2.time = fac.time();
        sco.com_detail3.url = 'chat/check_resume';//检查简历是否完整
        sco.com_detail3.time = fac.time();
        sco.com_detail3.done = function(re,sco){ 
            if(re.code==1){
              sco.com_detail3.data=1;//简历完整
            }else{
              sco.com_detail3.data=0;//简历不完整
            }
        };
        sco.com_detail2.done = function(re,sco){ 
            var jobid = re.data.id;
            sco.com_detail.url = 'chat/getchat';
            sco.com_detail.params.touserid=sco.com_detail2.data.uid;
            sco.com_detail.time = fac.time();
            sco.com_detail.done = function(re,sco){
                user1 = re.data.user;
                user2 = re.data.touser;
                user1.jobid = jobid;
                fac.socketinit(sco);
                fac.dealneed(user2,fac.getstore('ystoken'));//沟通建立链接
                var page = -1;//刚进来当前页为0
                $(document).on('click',".loadmore",function(){
                    $('#quan').removeClass('dpn');
                    setTimeout(function() {
                        $('#quan').addClass('dpn');
                        page++;
                        sco.com_list.params.page = page;
                        sco.com_list.time = fac.time();
                        sco.$apply();
                    }, 1000);
                });//向上滚动鼠标，触发时间戳，调用接口，拿到下一页内容，推送
                //监听鼠标滚动，兼容各浏览器
                var scrollFunc=function(e){
                    var t1=0;
                    var t2=0;
                    e=e || window.event;
                    if(e.wheelDelta){//IE/Opera/Chrome
                        t1=e.wheelDelta;
                    }else if(e.detail){//Firefox
                        t2=e.detail;
                    }
                    if(t1>0||t2>0){
                        if($('#chatwindow').scrollTop()==0){
                            $('#quan').removeClass('dpn');
                            setTimeout(function() {
                                $('#quan').addClass('dpn');
                                page++;
                                sco.com_list.params.page = page;
                                sco.com_list.time = fac.time();
                                sco.$apply();
                            }, 1000);
                        }
                    }
                };
                if(document.addEventListener){
                    document.addEventListener('DOMMouseScroll',scrollFunc,false);
                }//W3C
                window.onmousewheel=document.onmousewheel=scrollFunc;//IE/Opera/Chrome
                var useruid = re.data.user.uid;
                var touserid = re.data.touser.uid;
                sco.com_list.url = 'chat/getChatlog';
                sco.com_list.params.uid = useruid;
                sco.com_list.params.touserid = touserid;
                sco.com_list.params.jobid = jobid;
                sco.com_list.params.page = -1;
                sco.com_list.time = fac.time();//获取聊天列表
                sco.mk3 = re.data.isreport;//是否被举报
                sco.com_list2.url = 'open/gethrinfo';
                sco.com_list2.params.uid = useruid;
                sco.com_list2.time = fac.time();//被举报的HR的详情
                sco.com_list.done = function(re,sco){ 
                    sco.com_list.useruid = useruid;
                    sco.com_list.newsnum = re.newsnum;
                    if(chattype==18){
                        chattype = 1;
                        $('#chattype18').click();
                    }//初次沟通进来这里后立即点击这个按钮，发送消息
                    if(re.data.length < 8){
                        $('#bottomline').text('我是有底线的');
                        $('.loadmore').remove();
                        if(re.code == 0){
                          return false;
                        }
                    }//如果返回的内容不足，出提示并且拒绝操作
                    for (var i = re.data.length-1; i >= 0; i--) {
                        re.data[i]['content'] = fac.replace_em(re.data[i]['content']);
                        var da = re.data[i];
                        sco.datalist.unshift(da);
                    }//拼字符聊天渲染页面内容
                };
                sco.com_editadd.before = function(sco){ 
                    sco.com_editadd.params.uid = useruid;
                    sco.com_editadd.params.hrid = touserid;
                    sco.com_editadd.url = 'chat/report_hr';
                };//举报HR
                sco.com_editadd.done = function(re,sco){ 
                    $('#layerwindow').click();//关闭弹窗
                };
            };
        };
        sco.com_list3.url = 'chat/interview_list';//查邀请详情
        sco.com_list3.done = function(re,sco){
            if(re.data.isagree==1){
                sco.mk1 = 1;//发送消息
            }
            if(re.data.isagree==2){
                sco.mk2 = 1;//不发送消息
            }
            if(re.data.isagree==0){
                sco.mk1 = 0;//取消不合适后，将两值置0
                sco.mk2 = 0;
            } 
            var interviewid = re.data.id;
            sco.com_editadd2.before = function(sco){ 
                sco.com_editadd2.url = 'chat/handle_interview';
                sco.com_editadd2.params.id = interviewid;
            };//同意还是拒绝面试邀请
            sco.com_editadd2.done = function(re,sco){ 
                if(re.code==1){
                    if(re.data==1){
                      $('#tongyi').click();
                    }
                     if(re.data==2){
                      $('#jujue').click();
                    }
                }else{
                    layer.msg('操作失败');
                }
            };
        };
    }   
},
companyinfo:{ 
    init:function(sco){  
       sco.com_detail.url = 'open/com_detail';
       var has = fac.getstore('hash');
      sco.com_detail.params = {codeid:has.codeid,debug:1,debugkey:"c81"};
       sco.com_detail.done = function(){ 
            // 公司地址
            // 获取职位详情经纬度设置在地图上
             sco.mapx = sco.com_detail.data.map_x;
             sco.mapy = sco.com_detail.data.map_y;
             var map = new BMap.Map("allmap");    
             map.centerAndZoom(new BMap.Point(sco.mapx, sco.mapy), 11);  // 初始化地图,设置坐标和地图级别
             map.addControl(new BMap.MapTypeControl());   
             map.setCurrentCity("深圳");          // 设置地图显示的城市
             map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
             var local = new BMap.LocalSearch(map, {
              renderOptions:{map: map}
            });
            local.search("中兴");
                  
           sco.com_list_page.time = fac.time(); 
            sco.com_list_page2.time = fac.time();
             sco.com_list.time = fac.time();   
                   
     };
     sco.com_detail.time = fac.time();
      sco.com_list_page.url = 'open/ucom_list_page';
       sco.com_list_page.params = {"codeid":fac.getcd(sco,'c79'),listnum:3,curPage:1,company_id:23,debug:1,debugkey:"c79b"};
      sco.com_list_page2.url = 'open/ucom_list_page';
      sco.com_list_page2.params = {"codeid":fac.getcd(sco,'c79'),"company_id":has.company_id,listnum:6,curPage:1,debug:1,debugkey:"c79"};
      sco.com_list.url = 'open/getcompanyjobtypes';
      sco.com_list.params = {"companyid":has.company_id,debug:1,debugkey:"a88"};
     
      }

    
  },












company_info:{ 
    init:function(sco){
      sco.mk5=1;   
      // $(document).on('click',"#bianji",function(){
      //     setTimeout(function () {
      //         $(".thumbnail").css('margin-top','14px');
      //         $(".info").css('display','none');
      //     }, 1500);
      // });//类型样式
      sco.com_detail.url = 'auth/mycom_detail';
      sco.com_detail.params = {codeid:fac.getcd(sco,'c81')};
      sco.com_detail.time = fac.time();
      sco.com_detail.done = function(re,sco){ 
          sco.com_detail.code = re.code;
          sco.com_editadd.url = 'auth/company_editadd';
          sco.com_editadd.params.xinxi = 0;//判断是第一步的更改图片还是第二步的更改公司信息
          sco.com_editadd.params.codeid = fac.getcd(sco,'c81');
          sco.com_editadd.params.certificate_img = re.data.certificate_img;
          sco.com_editadd.done = function(re,sco){ 
              $("[name='tanchuang1']").click();
          };
          sco.com_editadd2.url = 'auth/company_editadd';
          sco.com_editadd2.params = re.data;
          shenfen_img = re.data.shenfen_img;
          certificate_img = re.data.certificate_img;
          sco.com_editadd2.params.xinxi = 1;//判断是第一步的更改图片还是第二步的更改公司信息
          sco.com_editadd2.before = function(sco){ 
              if(sco.com_editadd2.params.shenfen_img!=shenfen_img||sco.com_editadd2.params.certificate_img!=certificate_img){
                  sco.com_editadd2.params.xinxi = 0;
              }
              sco.com_editadd2.params.district_cn=$('#city').attr("pname")+$('#city').attr("cname");
          };
          sco.com_editadd2.done = function(re,sco){ 
              location.href='/main.html#company_info';
          };
          sco.com_del.before = function(sco){ 
              sco.com_del.url = 'auth/company_change';
              sco.com_del.params.companyid = re.data.id;
          };
          sco.com_del.done = function(re,sco){ 
            if(re.code==1){
                layer.msg('公司信息已清空,请重新认证');
                setTimeout(function(){
                    location.href='/main.html#company_info';
                },1000);
            }
          };
      };
    }
  },
communica:{ 
    init:function(sco){
        sco.mk1 = 0;//应用在合适不合适
        sco.mk2 = 0;//应用在编辑删除
        if(fac.getstore('chattype')==19){
            setTimeout(function() {
                $("[name='chat']").click();
                fac.setstore('chattype',1);
            }, 500);
        }//与牛人打招呼，发送信息
        $(document).on('click',"[name='chat']",function(){
            var a = $(this).index();
            sco.com_list4.data[a]['weidu']=0;
            $('#qqface').qqface({
                id:'facebox', 
                assign:'editor', 
                path:'/images/face/'
            }); 
            setTimeout(function () {
                $("#chatbox").removeClass('dpn');
                document.getElementById('chatwindow').scrollTop=document.getElementById('chatwindow').scrollHeight;
            }, 300);
        });//点击左侧聊天列表，去掉dpn类,0.3秒后置底
        $(document).on('click',".clblue li",function(){
            var a = $(this).index();
            $('.clblue').find('li').removeClass('color_blue');
            $('.clblue').find('li').eq(a).addClass('color_blue');
        });//类型样式
        $(document).on('click',"#wage li",function(){
            var b = $(this).index();
            $('#wage').find('li').removeClass('color_blue');
            $('#wage').find('li').eq(b).addClass('color_blue');
        });//薪资样式
        $(document).on('click',"#experience li",function(){
            var c = $(this).index();
            $('#experience').find('li').removeClass('color_blue');
            $('#experience').find('li').eq(c).addClass('color_blue');
        });//经验样式
        $(document).on('click',"#jobs li",function(){
            var b = $(this).text();
            $('#menuLink2').text(b);
        });//职位样式
        $(document).keyup(function(event){
            if (event.shiftKey && event.keyCode == 13){
                var tt = document.createElement("div");
                tt.innerHTML = "<br/>";
                $("#editor").val().append(tt);
            }
            if(event.keyCode==13){
                $("#send").click();
            }
        });//enter发送，shift+enter换行
        $(document).on('click',"#cha1",function(){
            $(".newmore").remove();
        });//点叉去掉新消息提醒
        $(document).on('click',"#bianji",function(){
            if(sco.mk2==0){
                $("#bianji").removeClass('color_white2');
                $("#bianji").addClass('color_white3');
            }
            if(sco.mk2==1){
                $("#bianji").removeClass('color_white3');
                $("#bianji").addClass('color_white2');
            }
        });//切换编辑的颜色
         $(document).on('click',"#cha2",function(){
            $(".loadmore").remove();
        });//点叉去掉加载更多
        $(document).on('click',".newmore",function(){
            $(".newmore").remove();//去掉新消息提醒
        });
        sco.com_list2.url = 'auth/get_jobs_select';
        sco.com_list2.time = fac.time();//职位列表
        sco.com_list3.params.codeid = fac.getcd(sco,'c77');
        sco.com_list3.params.c_alias = 'QS_wage';//薪资列表
        sco.com_list3.time = fac.time();
        sco.com_list5.params.codeid = fac.getcd(sco,'c77');
        sco.com_list5.params.c_alias = 'QS_experience';//经验列表
        sco.com_list5.time = fac.time();
        sco.com_list4.url = 'chat/getadminchatloglist';
        sco.com_list4.params.jobs_name = '';//聊天人物列表
        sco.com_list4.params.salary = '';
        sco.com_list4.params.experience = '';
        sco.com_list4.params.type = '';
        sco.com_list4.time = fac.time();
        sco.com_list4.before = function(sco){ 
            sco.chatsidebar=[];
        };
        sco.com_list4.done = function(re,sco){ 
            for (var i = re.data.length-1; i >= 0; i--) {
                re.data[i]['content'] = fac.replace_em(re.data[i]['content']);
                var da = re.data[i];
                sco.chatsidebar.unshift(da);
            }//拼字符聊天渲染页面内容
            sco.com_detail3.before = function(sco){ 
                sco.com_detail3.url = 'chat/getchat';//建立沟通
                sco.com_detail3.params.touserid = '';//建立沟通
            };
            sco.com_detail3.time = fac.time();
            sco.com_detail3.done = function(re,sco){
                user1 = re.data.user; 
                fac.socketinit(sco);
            };
            sco.com_detail.before = function(sco){ 
                sco.datalist=[];
                $('#bottomline').text('');
                sco.com_detail.url = 'chat/getchat';//建立沟通
            };
            sco.com_detail.done = function(re,sco){
                var jobid = fac.getstore('jobid');
                var companyid = re.data.companyid;
                user2 = re.data.touser;
                user1.jobid = jobid;
                fac.dealneed(user2,fac.getstore('ystoken'));
                var page = -1;//刚进来当前页为0
                $(document).on('click',".loadmore",function(){
                    $('#quan').removeClass('dpn');
                    setTimeout(function() {
                        $('#quan').addClass('dpn');
                        page++;
                        sco.com_list.params.page = page;
                        sco.com_list.time = fac.time();
                        sco.$apply();
                    }, 1000);
                });//向上滚动鼠标，触发时间戳，调用接口，拿到下一页内容，推送
                //监听鼠标滚动，兼容各浏览器
                var scrollFunc=function(e){
                    var t1=0;
                    var t2=0;
                    e=e || window.event;
                    if(e.wheelDelta){//IE/Opera/Chrome
                        t1=e.wheelDelta;
                    }else if(e.detail){//Firefox
                        t2=e.detail;
                    }
                    if(t1>0||t2>0){
                        if($('#chatwindow').scrollTop()==0){
                            $('#quan').removeClass('dpn');
                            setTimeout(function() {
                                $('#quan').addClass('dpn');
                                page++;
                                sco.com_list.params.page = page;
                                sco.com_list.time = fac.time();
                                sco.$apply();
                            }, 1000);
                        }
                    }
                };
                if(document.addEventListener){
                    document.addEventListener('DOMMouseScroll',scrollFunc,false);
                }//W3C
                window.onmousewheel=document.onmousewheel=scrollFunc;//IE/Opera/Chrome
                //监听鼠标滚动，兼容各浏览器
                sco.com_list.url = 'chat/getadminchatlog';
                var adminuid = re.data.user.uid;
                var touseruid = re.data.touser.uid;
                sco.com_list.params.uid = adminuid;
                sco.com_list.params.touserid = touseruid;
                sco.com_list.params.jobid = jobid;
                sco.com_list.params.page = -1;
                sco.com_list.time = fac.time();
                sco.com_list.done = function(re,sco){ 
                    if(re.data.length == 8){
                        $('.loadmore').removeClass('dpn');
                    }//如果
                    if(re.data.length < 8){
                        $('#bottomline').text('我是有底线的');
                        $('.loadmore').addClass('dpn');
                        if(re.code == 0){
                          return false;
                        }
                    }//如果返回的内容不足，出提示并且拒绝操作
                    for (var i = re.data.length-1; i >= 0; i--) {
                        re.data[i]['content'] = fac.replace_em(re.data[i]['content']);
                        var da = re.data[i];
                        sco.datalist.unshift(da);
                    }//拼字符聊天渲染页面内容
                    sco.com_list.setup = re.setup;//1显示置为不合适，置为待确认2取消待确认3取消不合适
                    sco.com_list.uid = adminuid;
                    sco.com_list.resume=re.resume;//简历内容
                    sco.com_list.jobname=re.jobname;
                    sco.com_list.newsnum = re.newsnum;
                    sco.com_editadd.url = 'chat/send_interview';//发面试邀请
                    sco.com_editadd.before = function(sco){ 
                        var myreg = /^(((11[0-9]{1})|(13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                        if($.trim(sco.com_editadd.params.interviewtime)==''){
                            layer.msg('面试时间不能为空');
                            return false;
                        }
                        if($.trim(sco.com_editadd.params.telephone)==''){
                            layer.msg('联系电话不能为空');
                            return false;
                        }
                        if($.trim(sco.com_editadd.params.telephone.length)!=11){
                            layer.msg('请输入有效的手机号码');
                            return false;
                        }
                        if(!myreg.test($.trim(sco.com_editadd.params.telephone))){
                            layer.msg('请输入有效的手机号码');
                            return false;
                        }
                        if($.trim(sco.com_editadd.params.interview_address)==''){
                            layer.msg('面试地点不能为空');
                            return false;
                        }
                        sco.com_editadd.params.jobid = jobid;
                        sco.com_editadd.params.companyid = companyid;
                        sco.com_editadd.params.from_id = adminuid;
                        sco.com_editadd.params.to_id = touseruid;
                    };
                    sco.com_editadd.done = function(re,sco){
                        user1.note = re.data;//传递当前面试邀请插入数据库的id号
                        $('#yaoqing').click();//建立沟通
                    };
                    sco.com_editadd2.params.issend = 2;//默认发送
                    sco.com_editadd2.before = function(sco){ 
                        if(sco.mk1==1){
                            sco.com_editadd2.params.issend='';//当前按钮为取消不合适，将issend置空
                        }
                        sco.com_editadd2.url = 'chat/add_unfit';
                        sco.com_editadd2.params.jobid = jobid;
                        sco.com_editadd2.params.from_id = adminuid;
                        sco.com_editadd2.params.to_id = touseruid;
                        user1.reason = sco.com_editadd2.params.reason;
                        if(sco.com_editadd2.params.issend==1){
                            $('#issend').click();//发送
                        }
                        if(sco.com_editadd2.params.issend==2){
                            $('#nosend').click();//不发送
                        }
                    };
                    sco.com_editadd2.done = function(re,sco){
                        if(re.arr==1){
                            sco.com_list.setup=3;
                        }
                        if(re.arr==2){
                            sco.com_list.setup=1;
                            sco.com_editadd2.params.issend = 2;
                        }
                        $('.closeo').click();//关闭弹窗
                    };
                    sco.com_editadd3.before = function(sco){ 
                        sco.com_editadd3.url = 'chat/add_confirm';
                        sco.com_editadd3.params.jobid = jobid;
                        sco.com_editadd3.params.from_id = adminuid;
                        sco.com_editadd3.params.to_id = touseruid;
                    };
                    sco.com_editadd3.done = function(re,sco){
                        if(re.arr==3){
                            sco.com_list.setup=2;
                        }
                        if(re.arr==4){
                            sco.com_list.setup=1;
                        }
                    };//待确认转换
                    sco.com_detail2.before = function(sco){ 
                        sco.com_detail2.url = 'chat/view_resume';
                        sco.com_detail2.params.jobid = jobid;
                        sco.com_detail2.params.to_id = touseruid;
                    };//访问完整简历
                    sco.com_detail2.time = fac.time();
                    sco.com_detail2.done = function(re,sco){
                        sco.com_detail2.attachment=re.data;
                        if(re.code==0){
                            $("#wanzheng").addClass('dpn');
                        }
                        if(re.code==1){
                            $("#wanzheng").removeClass('dpn');
                        }
                    };
                };
            };
            sco.com_del.before = function(sco){ 
                sco.com_del.url = 'chat/chat_delete';
                sco.com_del.params.jobid = fac.getstore('jobid2');
                $("#chatbox").css('display','none');
            };//聊天列表删除
            $(document).on('click',"[name='delone']",function(){
                var a = $(this).parent().index();
                $(".chatbox-userlist").find('li').eq(a).addClass('dpn');
            });
        };
    }
},
job_manage:{ 
    init:function(sco){ 
      sco.com_list_page.url = 'auth/job_list_page';
      sco.com_list_page.params.codeid = fac.getcd(sco,'c79');
      sco.com_list_page.params.listnum=4;
      sco.com_list_page.params.curPage=1;
      sco.com_list_page.time = fac.time();
      sco.com_list_page.done = function(re,sco){
          sco.zwtotal = re.code; 
      }
      sco.com_list.url = 'auth/get_jobtype';
      sco.com_list.time = fac.time();
      sco.com_list4.params.codeid = fac.getcd(sco,'c77');
      sco.com_list4.params.c_alias = 'QS_experience';
      sco.com_list4.time = fac.time();
      sco.com_list5.params.codeid = fac.getcd(sco,'c77');
      sco.com_list5.params.c_alias = 'QS_education';
      sco.com_list5.time = fac.time();
      sco.com_list6.params.codeid = fac.getcd(sco,'c77');
      sco.com_list6.params.c_alias = 'QS_wage';
      sco.com_list6.time = fac.time();
      sco.com_detail.url = 'auth/mycom_detail';
      sco.com_detail.params = {codeid:fac.getcd(sco,'c81')};
      sco.com_detail.time = fac.time();
      sco.com_editadd.before = function(sco){ 
        sco.com_editadd.url = 'auth/mycom_editadd';
        if(sco.com_editadd.params.codeid == undefined){
          sco.com_editadd.params.codeid = fac.getcd(sco,'c79');
        }
        if($.trim(sco.com_editadd.params.jobs_name)==''){
          sco.com_editadd.a = 1;
        }else{
          sco.com_editadd.a = 0;
        }
        if($.trim(sco.com_editadd.params.category_cn)==''){
          sco.com_editadd.b = 1;
        }else{
          sco.com_editadd.b = 0;
        }
        if($.trim(sco.com_editadd.params.skilltags)==''){
          sco.com_editadd.c = 1;
        }else{
          sco.com_editadd.c = 0;
        }
        if($.trim(sco.com_editadd.params.district_cn)==''){
          sco.com_editadd.d = 1;
        }else{
          sco.com_editadd.d = 0;
        }
        if($.trim(sco.com_editadd.params.address)==''){
          sco.com_editadd.e = 1;
        }else{
          sco.com_editadd.e = 0;
        }
        if($.trim(sco.com_editadd.params.wage_cn)==''){
          sco.com_editadd.f = 1;
        }else{
          sco.com_editadd.f = 0;
        }
        if($.trim(sco.com_editadd.params.experience_cn)==''){
          sco.com_editadd.g = 1;
        }else{
          sco.com_editadd.g = 0;
        }
        if($.trim(sco.com_editadd.params.education_cn)==''){
          sco.com_editadd.h = 1;
        }else{
          sco.com_editadd.h = 0;
        }
        if($.trim(sco.com_editadd.params.description)==''){
          sco.com_editadd.i = 1;
        }else{
          sco.com_editadd.i = 0;
        }//内容为空做提示
        sco.com_editadd.params.district_cn=$('#city').attr("pname")+$('#city').attr("cname");
      };
      sco.com_editadd.done = function(re,sco){
          layer.msg('编辑成功'); 
          location.href='/main.html#job_manage';
      }
      }
  },
yushan_hero:{ 
    init:function(sco){  
        $(document).ready(function(){
            fac.setstore('jobid','');
            fac.setstore('jobid2','');
        });//加载页面置空本地jobid
        $(document).on('click',"[name='jobs'] li",function(){
            var b = $(this).text();
            $("[name='menuLink2']").text(b);
        });//职位类型名称变化
        $(document).on('click',"#wage li",function(){
            var b = $(this).index();
            $('#wage').find('li').removeClass('color_blue');
            $('#wage').find('li').eq(b).addClass('color_blue');
        });//薪资类型样式
        $(document).on('click',"#experience li",function(){
            var c = $(this).index();
            $('#experience').find('li').removeClass('color_blue');
            $('#experience').find('li').eq(c).addClass('color_blue');
        });//经验类型样式
        $(document).on('click',"#wage2 li",function(){
            var b = $(this).index();
            $('#wage2').find('li').removeClass('color_blue');
            $('#wage2').find('li').eq(b).addClass('color_blue');
        });//薪资类型样式
        $(document).on('click',"#experience2 li",function(){
            var c = $(this).index();
            $('#experience2').find('li').removeClass('color_blue');
            $('#experience2').find('li').eq(c).addClass('color_blue');
        });//经验类型样式
        $(document).on('click',"#heroinput1",function(){
            $(document).keyup(function(event){
                if(event.keyCode==13){
                    $("#heroimg1").click();
                }
            });//enter发送
        });//牛人搜索1
        $(document).on('click',"#heroinput2",function(){
            $(document).keyup(function(event){
                if(event.keyCode==13){
                    $("#heroimg2").click();
                }
            });//enter发送
        });//牛人搜索2
        sco.com_list.params.codeid = fac.getcd(sco,'c79');
        sco.com_list.time = fac.time();
        sco.com_list.done = function(re,sco){
            if(re.code==0){
                sco.com_list.data.length=0;
            }
            if(re.code==1){
                sco.com_list.data.length=1;
            }
        };//判断HR是否已发布职位
        sco.com_list2.url = 'auth/get_jobs_select';
        sco.com_list2.time = fac.time();//职位列表
        sco.com_list2.done = function(re,sco){
            var jobname = re.data[0].jobs_name;//初次职位为第一个
            var jobid = re.data[0].id;//初次职位为第一个
            $(document).on('click',"[name='niuren']",function(){
                sco.com_list_page.params.jobs_name = jobname;
                sco.com_list_page2.params.jobs_name = jobname;
                fac.setstore('jobid','');
                fac.setstore('jobid2','');
            });//点击切换推荐俩按钮，重新赋值jobname，同时清空jobid 
            sco.com_list_page.url = 'auth/get_recommend_list';
            sco.com_list_page.params = {codeid:fac.getcd(sco,'c75'),listnum:4,curPage:1,jobs_name:jobname,salary:'',experience:'',keyword:''};
            sco.com_list_page.time = fac.time();
            sco.com_list_page.done = function(re,sco){
                sco.zwtotal = re.code; 
                if($.trim(fac.getstore('jobid'))){
                    jobid = fac.getstore('jobid');
                }
            };//赋值给jobid
            sco.com_list_page2.url = 'auth/get_look_user';
            sco.com_list_page2.params = {listnum:4,curPage:1,jobs_name:jobname,salary:'',experience:'',keyword:''};
            sco.com_list_page2.done = function(re,sco){
                sco.zwtotal = re.code; 
                if($.trim(fac.getstore('jobid2'))){
                    jobid = fac.getstore('jobid2');
                }
            };//赋值给jobid
            sco.com_detail.before = function(sco){ 
                sco.com_detail.url = 'chat/getchat';
                sco.com_detail.params.jobid = jobid;
            };
            sco.com_detail.done = function(re,sco){
                user1 = re.data.user;
                user2 = re.data.touser;
                user1.jobid = jobid;
                fac.socketinit(sco);
                fac.dealneed(user2,fac.getstore('ystoken'));
                setTimeout(function() {
                    $("[name='fasong']").click();
                    location.href='/main.html#communica';
                }, 100);//建立沟通，1秒后跳转
            };
        };
        sco.com_list3.params.codeid = fac.getcd(sco,'c77');
        sco.com_list3.params.c_alias = 'QS_wage';
        sco.com_list3.time = fac.time();//加载薪资字段内容
        sco.com_list4.params.codeid = fac.getcd(sco,'c77');
        sco.com_list4.params.c_alias = 'QS_experience';
        sco.com_list4.time = fac.time();//加载经验字段内容
    }
},
jobdetail:{ 
    init:function(sco){ 
         
                    
        $(document).on('click',"#goutong",function(){
            if(!fac.getstore('ystoken')){
                fac.lginbox();
            }
        });
        sco.com_detail.url = 'open/ucom_detail';
        var has = fac.getstore('hash');
        var uid=0;
        var id=0;
        sco.com_detail.params = {"codeid":has.codeid};
        sco.com_detail.time = fac.time();
        sco.com_detail.done = function(re,sco){
            uid=re.data.uid;
            sco.com_detail2.url = 'open/com_detail';
            sco.com_detail2.params.codeid = re.data.codeid;
            sco.com_detail2.time = fac.time();
            sco.com_list2.url = 'open/gethrinfo';
            sco.com_list2.params.uid = uid;
            sco.com_list2.time = fac.time();
            sco.com_list3.url = 'open/ucom_list';
            sco.com_list3.params = {codeid:fac.getcd(sco,'c79'),top:3,keyword:re.data.jobs_name};
            sco.com_list3.time = fac.time();  
             
            id=re.data.id;
            if(fac.getstore('ystoken')){
                sco.com_list.before = function(sco){ 
                    sco.com_list.url = 'chat/getchat';
                    sco.com_list.params.touserid = uid;
                    sco.com_list.params.jobid = id;
                };
                sco.com_list.time = fac.time();
                sco.com_list.done = function(re,sco){
                    sco.com_list.ischat = re.ischat;
                };
            }
              // 获取职位详情经纬度设置在地图上
             sco.mapx = sco.com_detail.data.map_x;
             sco.mapy = sco.com_detail.data.map_y;
             var map = new BMap.Map("allmap");    
             map.centerAndZoom(new BMap.Point(sco.mapx, sco.mapy), 11);  // 初始化地图,设置坐标和地图级别
             map.addControl(new BMap.MapTypeControl());   
             map.setCurrentCity("深圳");          // 设置地图显示的城市
             map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
             var local = new BMap.LocalSearch(map, {
              renderOptions:{map: map}
            });        
            local.search(re.data.address);




        };



    }     
},




  


}; 
  return dosomething;
}]);
// 存是哪一个类
app.directive('settype',['fac', function(fac){ 
  return { 
    link: function($scope, iElm, iAttrs, controller) {
      iElm.on("click",function(){
        fac.setstore('settype',iAttrs.settype); 
      });
    }
  };
}]);
});