<?php
namespace app\api\controller;
use think\Controller; 
use jwt\JWT; 
class Index extends Init
{
    /**
     * 微信接入验证
     * @return [type] [description]
    */
    public function index(){
       return json(['code'=>123]);
    } 

      public function test(){




$jwt = explaintoken(input('token'));


 return json(['code'=>1,'token'=>$jwt]);
    }   

   
   }