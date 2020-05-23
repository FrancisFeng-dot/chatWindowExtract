define('fac', ['jquery', 'angularjs','YS'], function(require, exports, module) { 
   var app = angular.module("myfact", []); 
  app.factory('fac',['$http',function($http){

   var f = {

      time:function(str){
      //返回时间戳；str 为空则返回当前时间戳；
   var timestamp = !str?Date.parse(new Date()):Date.parse(new Date(str)); 
   return timestamp; 
},
seturl:function(sco,part){
  console.log({scope:sco,name:YSCONF.url[part].name});
//路径
var path = YSCONF.url[part].url; 
//自己配置的url；
 path = sco[part].url?sco[part].url:path;
//真实路径
var url = window.root + path;


var sd = sco[part].params||{};
//1，调试模式，0，上线模式；
// debugger;
if(window.debugflag){  
    switch(sd.debug)
        {
        case 1: //假数据，返回成功；
          var cid = sd.debugkey?'/'+sd.debugkey:'';
          url ='json/' +path+cid+'.json'; 
          break;
        case 0: //假数据，返回失败；
          url ='json/err.json';
          break;
        case -2://假数据，返回无权限；
        url ='json/noauth.json';          
          break;
        case -1://假数据，返回未登录；
          url ='json/nologin.json';
          break;
        default:
          break;
        } 
}

  var p = {
      url:url,
      method:YSCONF.url[part].method 
      };
  return p;
},
ysfetch:function(sco,part){
    if(!sco)return;
    if(!part)return; 
    var p = f.seturl(sco,part);
    f[p.method](sco,part); 
},  

get:function (sendurl ,senddata ,callback) { 
 var surl = sendurl + '?token='+f.getstore('ystoken');
 $http({withCredentials:true,method: 'GET', params: $.param(senddata), url: surl,headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
                    .success(function (data, status, headers, config) { 
                          if(data.code==-1){
                            window.lg==null?f.lginbox():'';
                        }else{
                          callback(data);
                        } 
                    }).
                    error(function (data, status, headers, config) {
                       var reply = {'code': "0",'msg':'请求错误','data':data};
                       YS('layer',function(){layer.msg('网络超时！',{icon:0,time: 2000});});
                    });
            }, 
  post:function (sendurl ,senddata ,callback) {           
              var surl = sendurl + '?token='+f.getstore('ystoken');

                $http({method: 'POST',  data: $.param(senddata), url: surl,headers: {'Content-Type':'application/x-www-form-urlencoded'}})
                   
                    .success(function (data, status, headers, config) {    
                    if(data.code==-1){
                                       
                      window.lg==null?f.lginbox():'';

                    }else{
                      callback(data);
                    }                    
                     

                    }).
                  
                    error(function (data, status, headers, config) {
                        var reply = {'code': "0",'msg':'请求错误','data':data};
                         YS('layer',function(){layer.msg('网络超时！',{icon:0,time: 2000});});
                    });
}, 
lginbox:function(){
             window.lg = layer.open({
   type: 1
  ,title: false //不显示标题栏
  ,closeBtn: false
  ,shade: 0.8
  ,id: 'LAY_layuipro' 
  ,resize: false
  ,btnAlign: 'c'
  ,area: ['738px', '364px']//宽高
  ,moveType: 1 //拖拽模式，0或者1
  ,content:  $('.login-box')
});
},

load:function(num){ 
  var a = num?$('#loader').fadeIn(100):$('#loader').fadeOut(1000); 
}, 
getcode:function(){ 
 return $('#codeid').val();
},
get_data_watch:function(sco,part){
if(!sco)return;
if(!part)return; 

sco.$watch(part+'.time', function() {  
        if(!sco[part].time)return;
        //运行前 ，执行的函数；
         if(typeof(sco[part].before)==="function"){var v = sco[part].before(sco); if(v===false){return false;} } 
        var sd = sco[part].params||{};
        if(YSCONF.url[part].load){f.load(0);}   
var p = f.seturl(sco,part);         
        f.get(p.url,sd,function(re){ 
            sco[part].data = {};
            if(re.code==1){
              sco[part].data= re.data;
            }
            //运行后拿到数据，执行函数
           if(typeof(sco[part].done)==="function"){sco[part].done(re,sco);} 
           if(YSCONF.url[part].load){f.load(0);}    
        });
    }, true); 
},
 
get_data_watch_page:function(sco,part){
if(!sco)return;
if(!part)return; 

var page = YSCONF.url[part].pageid||'page';
 
  sco.$watch(part+'.time', function() {  
        if(!sco[part].time)return;
        //运行前 ，执行的函数；
         if(typeof(sco[part].before)==="function"){var v = sco[part].before(sco); if(v===false){return false;} } 
        var sd = sco[part].params||{};
        if(YSCONF.url[part].load){f.load(1);}   
       var p = f.seturl(sco,part); 
        f.get(p.url,sd,function(re){ 
          sco[part].data = {};
            if(re.code==1){
              sco[part].data= re.data; 

laypage({
    cont: page, //容器。值支持id名、原生dom对象，jquery对象,
    pages: re.data.pages, //总页数
    skin: 'molv', //皮肤
    first: 1, //将首页显示为数字1,。若不显示，设置false即可
    //last: 11, 将尾页显示为总页数。若不显示，设置false即可
    curr: sco[part].params.curPage || 1, //当前页
    prev: '<', //若不显示，设置false即可
    next: '>', //若不显示，设置false即可
    jump: function(obj, first){ //触发分页后的回调
                if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
          sco[part].params.curPage = obj.curr;
          sco[part].time = f.time();
          sco.$apply();
                }
            }
 
});
 }
 //运行后拿到数据，执行函数
if(typeof(sco[part].done)==="function"){sco[part].done(re,sco);} 
if(YSCONF.url[part].load){f.load(0);}   
        });
    }, true); 
},
 
get_data:function(sco,part){
if(!sco)return;
if(!part)return; 

   //运行前 ，执行的函数；
         if(typeof(sco[part].before)==="function"){var v = sco[part].before(sco); if(v===false){return false;} } 
        var sd = sco[part].params||{};
        if(YSCONF.url[part].load){f.load(1);}   
       var p = f.seturl(sco,part);  
        f.get(p.url,sd,function(re){ 
            sco[part].data = {};
            if(re.code==1){
              sco[part].data= re.data;
            }
            //运行后拿到数据，执行函数
           if(typeof(sco[part].done)==="function"){sco[part].done(re,sco);}  
           if(YSCONF.url[part].load){f.load(0);}   
        });

 
     
},
 
post_data_watch:function(sco,part){
  
if(!sco)return;
if(!part)return; 

sco.$watch(part+'.time', function() {   
        if(!sco[part].time)return;
        //运行前 ，执行的函数；
         if(typeof(sco[part].before)==="function"){var v = sco[part].before(sco); if(v===false){return false;} } 
       var sd = sco[part].params||{};
       if(YSCONF.url[part].load){f.load(1);}   
        var p = f.seturl(sco,part); 
        f.post(p.url,sd,function(re){  

            sco[part].data = {};
            if(re.code==1){
              sco[part].data= re.data;
            }
            // sco.$digest();
            //运行后拿到数据，执行函数
           if(typeof(sco[part].done)==="function"){sco[part].done(re,sco);}  
           if(YSCONF.url[part].load){f.load(0);}   
        });
    }, true); 
},
 
post_data:function(sco,part){
if(!sco)return;
if(!part)return; 

//运行前 ，执行的函数；
  if(typeof(sco[part].before)==="function"){var v = sco[part].before(sco); if(v===false){return false;} } 
var sd = sco[part].params||{}; 
if(YSCONF.url[part].load){f.load(1);}      
var p = f.seturl(sco,part);  
f.post(p.url,sd,function(re){ 
  sco[part].data = {};
  if(re.code==1){ 
    sco[part].data= re.data; 
  }
  //运行后拿到数据，执行函数
 if(typeof(sco[part].done)==="function"){sco[part].done(re,sco);}  
 if(YSCONF.url[part].load){f.load(0);}
});
     
},
post_data_watch_page:function(sco,part){
if(!sco)return;
if(!part)return; 

var page = YSCONF.url[part].pageid||'page';
 
  sco.$watch(part+'.time', function() {  
        if(!sco[part].time)return;
        //运行前 ，执行的函数；
         if(typeof(sco[part].before)==="function"){var v = sco[part].before(sco); if(v===false){return false;} } 
        var sd = sco[part].params||{};
        if(YSCONF.url[part].load){f.load(1);}
        var p = f.seturl(sco,part); 
        f.post(p.url,sd,function(re){ 

          sco[part].data = {};
            if(re.code==1){
              sco[part].data= re.data; 

laypage({
    cont: page, //容器。值支持id名、原生dom对象，jquery对象,
    pages: re.data.pages, //总页数
    skin: 'molv', //皮肤
    first: 1, //将首页显示为数字1,。若不显示，设置false即可
    //last: 11, 将尾页显示为总页数。若不显示，设置false即可
    curr: sco[part].params.curPage || 1, //当前页
    prev: '<', //若不显示，设置false即可
    next: '>', //若不显示，设置false即可
    jump: function(obj, first){ //触发分页后的回调
                if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
          sco[part].params.curPage = obj.curr;
          sco[part].time = f.time();
          sco.$apply();
                }
            }
 
});
 }
 //运行后拿到数据，执行函数
if(typeof(sco[part].done)==="function"){sco[part].done(re,sco);} 
        if(YSCONF.url[part].load){f.load(0);}
        });
    }, true); 
},
getscope_byid: function(sc, id) {
    /*递归，找到$id为 num 的scope.并返回；*/
    if (sc.$id == id) {
      return sc;
    } else {
      return f.getscope_byid(sc.$parent, id);
    }
  },
  getcd: function(sc, id) {
     var comsco = f.getscope_byid(sc,2);
     return comsco.cd[id];
  },
setstore:function(key,value){
value = typeof(value) ==='object'?JSON.stringify(value):value;
localStorage.setItem(key,value);
 return true;
},
getstore:function(key){
      var tem = '';
      try {tem = localStorage.getItem(key);
      tem = JSON.parse(tem); 
      }catch(e){tem = localStorage.getItem(key);}
      return tem; 
},
unsetstore:function(key){ localStorage.removeItem(key); return true;},

//建立一個可存取到該file的url
getObjectURL:function(file) {
    var url = null ; 
    if (window.createObjectURL!==undefined) { // basic
        url = window.createObjectURL(file) ;
    } else if (window.URL!==undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file) ;
    } else if (window.webkitURL!==undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
    }
    return url ;
},
dogoto:function(re,url){
  layer.msg(re.msg);
  if(re.code==1){
       setTimeout(function() {
            window.location.href = url;
        },1000);
  } 
  
      
},setCookie:function(name,value){
         //写cookies 
    var d = new Date();
    d.setTime(d.getTime() + (7*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = name + "=" + value + "; " + expires;
    },
getCookie:function(cname){
         //读取cookies 
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
    },
delCookie:function(name){ 
        //删除cookies 
        f.setCookie(name, "", -1);  
    },
    webupload:function($list,$btn,state,obj,key){
         YS("webuploader",function(){  
 


var uploader = WebUploader.create({
      resize: false, // 不压缩image  
      swf:  'YS-frame/webuploader/0.1.5/Uploader.swf', 
      server: window.root + 'base/upload', 
      pick: '#picker', // 选择文件的按钮。可选
      chunked: true, //是否要分片处理大文件上传
      chunkSize:2*1024*1024, //分片上传，每片2M，默认是5M
       auto: true //选择文件后是否自动上传
     // chunkRetry : 2, //如果某个分片由于网络问题出错，允许自动重传次数
      //runtimeOrder: 'html5,flash',
      // accept: {
      //   title: 'Images',
      //   extensions: 'gif,jpg,jpeg,bmp,png',
      //   mimeTypes: 'image/*'
      // }
    });




//跨域设置
uploader.on('uploadBeforeSend', function(obj, data, headers) {
$.extend(headers, {
"Origin": "http://api.yushan.com",
"Access-Control-Request-Method": "POST"
});
});




    // 当有文件被添加进队列的时候
    uploader.on( 'fileQueued', function( file ) {
        $list.append( '<div id="' + file.id + '" class="item">' +
            '<h4 class="info">' + file.name + '</h4>' +
            '<p class="state">等待上传...</p>' +
        '</div>' );
    });
    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage,a ) {
        var $li = $( '#'+file.id ),
            $percent = $li.find('.progress .progress-bar');
             // console.log(file,percentage,a);
        // 避免重复创建
        if ( !$percent.length ) {
            $percent = $('<div class="progress progress-striped active">' +
              '<div class="progress-bar" role="progressbar" style="width: 0%">' +
              '</div>' +
            '</div>').appendTo( $li ).find('.progress-bar');
        }

        $li.find('p.state').text('上传中');

        $percent.css( 'width', percentage * 100 + '%' );
    });
    // 文件上传成功
    uploader.on( 'uploadSuccess', function( file,re ) {
        console.log(re);
        if(re.code==1){ 
          re.url = re.url.replace(/\\/g, "/");
          obj[key] =re.url;
        }else{
          layer.msg(re.msg);
        }
        $( '#'+file.id ).find('p.state').text('已上传');
    });

    // 文件上传失败，显示上传出错
    uploader.on( 'uploadError', function( file ) {
        $( '#'+file.id ).find('p.state').text('上传出错');
    });
    // 完成上传完
    uploader.on( 'uploadComplete', function( file ) { 
        $( '#'+file.id ).find('.progress').fadeOut();
    });

    // 当有文件添加进来的时候
uploader.on( 'fileQueued', function( file ) {
    var $list = $("#fileList"), 
        $li = $(
            '<div id="' + file.id + '" class="file-item thumbnail">' +
                '<img>' +
                '<div class="info">' + file.name + '</div>' +
            '</div>'
            ),
        $img = $li.find('img');
   $("#fileList").html('');

    // $list为容器jQuery实例
    $list.append( $li );

    // 创建缩略图
    // 如果为非图片文件，可以不用调用此方法。
    // thumbnailWidth x thumbnailHeight 为 100 x 100
    uploader.makeThumb( file, function( error, src ) {
        if ( error ) {
            $img.replaceWith('<span>不能预览</span>');
            return;
        }

        $img.attr( 'src', src );
    }, 100, 100 );
});

    $btn.on('click', function () {
            if ($(this).hasClass('disabled')) {
                return false;
            }
            uploader.upload();
            // if (state === 'ready') {
            //     uploader.upload();
            // } else if (state === 'paused') {
            //     uploader.upload();
            // } else if (state === 'uploading') {
            //     uploader.stop();
            // }
        }); 








  
    });
    },
 hashtoobj:function(str){
  var obj = {};
  if(str){
    if(str.indexOf('&')>0){
      var arr = str.split('&'); 
      arr.map(function(el){
          var t = el.split('=');
          if(t.length>1){obj[t[0]] = t[1];} 
      });  
    }else{ 
          var t = str.split('=');
          if(t.length>1){obj[t[0]] = t[1];} 
    }
  }
  return obj;
}, 
dealneed:function(user2,token){
            var toid = user2.id;
        $.ajax({
          url:"http://api.yushan.com/chat/needSend?token="+token,
          data:{'toid':toid},
          type:'POST',
          dataType:'json',
          success:function(re){
            
          }
            });  
          },
socketinit:function(sco){
    sco.socket = new WebSocket('ws://127.0.0.1:8484');    
    sco.socket.onopen = function(){  
        // 登录
        var login_data = '{"type":"init","uid":"' + user1.uid + '", "nickname":"' + user1.nickname + '","avatar":"' + user1.avatar + '"}';
        sco.socket.send( login_data );
        console.log('连接成功');
    };
    sco.socket.onerror = function () {
        console.log('连接失败');
    };
    //监听收到的消息
    sco.socket.onmessage = function(res){
        var data = eval("("+res.data+")");
        switch(data['message_type']){
            // 服务端ping客户端
            case 'ping':
                sco.socket.send('{"type":"ping"}');
                break;
            // 检测聊天数据
            case 'chatMessage':
                console.log(data.data);
                if (data.data.from_id!=user1.uid||!data.data.filetype) {
                  data.data.content =  f.replace_em(data.data.content);
                  data.data.timeline = f.getDateen(data.data.timeline);
                  data.data.from_name = data.data.nickname;
                  if(data.data.chattype!=19){
                      sco.datalist.push(data.data);
                      sco.$apply();
                  }
              }
                break;
            // 离线消息推送
            case 'logMessage':
              console.log(data.data);
                break;
        }
    };      
}, 
    setMessage:function(type,mine,to){
      var data = {mine:mine,to:to};
      var imMessage = {"type":type,"data":data};
      imMessage = JSON.stringify(imMessage);
      return imMessage;
    },
    GetParentString:function(name){
      var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if(r)return  unescape(r[2]); return null;
    },
    replace_em:function(str){
      str = str.replace(/\</g,'&lt;'); 
      str = str.replace(/\>/g,'&gt;');
      str = str.replace(/\n/g,'<br/>');
      str = str.replace(/\[em_([0-9]*)\]/g,'<img src="/images/face/$1.gif" border="0" />');
      return str;
    },
    getDateen:function(nS){ //转化时间戳
      /*将时间戳转成 全时间格式转换成  2011-3-16 16:50 */   
      var dates = new Date(parseInt(nS) * 1000).toLocaleString().substr(0,15);
        return dates.split(' ')[1];
      },
      chatInit:function(){
        var chatlist = [];
        var chatloglist = JSON.parse(JSON.stringify(chatv.chatlog));
        for (var i = 0; i < chatv.chatlog.length; i++) {
          //转化时间
          chatv.chatlog[i].timeline = chatFn.getDateen(chatv.chatlog[i].timeline);          
        }
      },
       /* ================ 浅拷贝 ================ */  
    simpleClone:function(initalObj) {  
        var obj = {};  
        for ( var i in initalObj) {  
            obj[i] = initalObj[i];  
        }  
        return obj;  
      },
      sendImage:function() {
        var mine = {"nickname":chatv.user1.nickname,"mine":true,"avatar":chatv.user1.avatar,uid:chatv.user1.uid,"content":chatv.chatlog[chatv.chatlog.length-1].content,"chattype":this.GetParentString('chattype'),filetype:1};
        var to = {"nickname":chatv.user2.nickname,"avatar":chatv.user2.avatar,uid:chatv.user2.uid,"avatar":chatv.user2.avatar,"type":"privateChat"};
        var login_data = chatFn.setMessage("chatMessage",mine,to);
          socket.send( login_data );
      }
   }; 
    return f; 
  }]); 
}); 