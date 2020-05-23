<?php
namespace app\api\controller;
use think\Controller;
use think\Request;
use plug\myheader;
use jwt\ExpiredException;
//公共方法
class openInit extends Controller
{   

    public function _initialize()
    { 
    myheader::setheader();  
//       $v = (object)['uuid'=>''];
//        try{  
//           $v = explaintoken($_GET['token']);    
//          }catch(ExpiredException $e){
        
//       }  
      
        



// if(!cache($v->uuid)){ 
//               echo json_encode(['code'=>'-1','msg'=>'登录过期']);
//               exit();
//          }
          // }else{
          //   p(cache($v->uuid));
          // } 
// p(cache($v->uuid));


     // $_POST = json_decode(file_get_contents('php://input'),true);
     // header('Access-Control-Allow-Origin:http://admin.yushan.com');
     // header('Access-Control-Allow-Credentials: true');
     // header("Access-Control-Allow-Headers:x-requested-with,content-type");
      // $_POST = json_decode(file_get_contents('php://input'),true);
     // header('Access-Control-Allow-Origin:http://zhaopin.yushan.com');
     // header("Access-Control-Allow-Methods:GET, POST");
     // header("Access-Control-Allow-Credentials:true");
     // header('Access-Control-Allow-Headers:x-requested-with,Content-Type,X-CSRF-Token');
     // header('Access-Control-Allow-Credentials: true');
   // header("Access-Control-Allow-Headers", "Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With");
  
//接收token。是否存在。不存在则返回错误；
//存在则解析为json格式；
//
//p(explaintoken($_GET['token']));

    // if(!check_token($_GET['token'])){
    //     echo json_encode(['code'=>'-1','msg'=>'登录过期']);
    //     exit();
    // }
 
  
        // $_POST = json_decode(file_get_contents('php://input'),true);
    //       if(Request::instance()->isPost()){
    //       if(!user_auth()){ 
    //           echo json_encode(['code'=>'-1','msg'=>'登录过期']);
    //           exit();
    //       } 
 
    // }


}


}