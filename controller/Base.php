<?php
namespace app\api\controller;
use think\Controller;
use think\Request;
use think\View;
use think\Session;
use think\Db;
use plug\myheader;
use think\cache\driver\Redis;
class Base  extends controller
{

 /**
     * 输出验证码
     */
    public function test(){
        p(set_comview_index());
        return rejson(1,'success');  
    }


 /**
     * 输出验证码
     */
    public function verify(){
      //header('Access-Control-Allow-Origin:http://admin.yushan.com');
       
        $Verify = new \org\Captcha(config('captcha'));
        // $_GET['imageW']?$Verify->imageW=$_GET['imageW']:'';
        // $_GET['imageH']?$Verify->imageH=$_GET['imageH']:'';
        // $_GET['fontSize']?$Verify->fontSize=$_GET['fontSize']:'';
        $Verify->entry('abc');
    }
    /**
     * 验证码检测函数
     * @param string $code 要检测的验证码
     * @param string $id  如果一个页面中含有多个验证码，需要区分id
     * @return boolean
     */
    public function check_verify($code, $id = ''){

        $Verify = new \org\Captcha(config('captcha'));
        return $Verify->check($code, $id);
    }
    /**
     * 检测后台用户密码
     * @param int $uid 用户id
     * @param string $pass 要检测的密码
     */
    public function checkPass($uid,$pass){
        $data=Db::name('admin_user')->where('id='.$uid)->field('id,password,encrypt')->find();
        if(md5(md5($pass).$data['encrypt'])==$data['password']){
            return true;
        }else{
            return false;
        }
    }
    /**
     * 登录页面
     */
    public function login(){  
          myheader::setheader();

  
        // if(Request::instance()->isPost()){
        if(!$this->check_verify(input('captcha'),'abc')){ 
                $result['code']=0;
                $result['msg']='验证码填写错误';
                return json($result);
            }


$data=Db::name('admin_user')->where('username=\''.input('username').'\'')->find();

                if(!$data){ 
                    $result['code']=0;
                    $result['msg']='用户不存在';
                    return json($result);
                }
                    $data['time']=time();
                    if($this->checkPass($data['id'], input('password'))){
                        
                        Db::name('admin_user')->where('id='.$data['id'])->setInc('login_count');
                        $SaveData=array('last_login_time'=>time(),'last_login_ip'=>Request::instance()->ip());
                        Db::name('admin_user')->where('id='.$data['id'])->update($SaveData);
                        $result['code']=1;
                        $result['msg']='成功';
                       

                        $iat = time();
                        $exp = $iat+120000;
                        $token = array(
                            "iss" => "http://api.ysjianzhu.com",
                            "aud" => "http://zhaopin.ysjianzhu.com",
                            "iat" => $iat,
                            "exp" => $exp,
                            "nbf" => '',
                            "uuid"=>$data['uuid']
                        );


                        cache($data['uuid'],$token,3600);

                       
                        //  $has = Db::name('templogin')->where('uuid','=',$data['uuid'])->find();
                      
                        // $sdata = ['uuid'=>$data['uuid'],'createtime'=>time()]; 
                        // if($has){
                        //   Db::name('templogin')->where('uuid',$data['uuid'])->update($sdata);
                        // }else{
                        //    Db::name('templogin') ->insert($sdata);      
                        // }
                       


                       
                        $result['token'] = settoken($token);
                        $result['uuid'] = $data['uuid']; 
                        $result['usertype']=$data['usertype'];
                    }else{
                        $result['code']=0;
                        $result['msg']='登录密码错误';
                    }

             return json($result);
            
        // }else{
        //     $this->display();
        // }
    }

    //前台登陆借口
    public function index_login(){ 
       header('Access-Control-Allow-Origin:http://admin.yushan.com');
       header('Access-Control-Allow-Origin:http://zhaopin.yushan.com');
       header('Access-Control-Allow-Credentials: true');

        // if(Request::instance()->isPost()){
        if(!$this->check_verify(input('captcha'),'abc')){ 
                $result['code']=0;
                $result['msg']='验证码填写错误';
                return json($result);
            }


$data=Db::name('user')->where('username=\''.input('username').'\'')->find();
                if(!$data){ 
                    $result['code']=0;
                    $result['msg']='用户不存在';
                    return json($result);
                }
                    $data['time']=time();
                    if($this->checkPass($data['id'], input('password'))){
                        //session('adminuser',$data);
                        Db::name('user')->where('id='.$data['id'])->setInc('login_count');
                        $SaveData=array('last_login_time'=>time(),'last_login_ip'=>Request::instance()->ip());
                        Db::name('user')->where('id='.$data['id'])->update($SaveData);
                        $result['code']=1;
                        $result['msg']='成功';
                       

                        $iat = time();
                        $exp = $iat+12000;
                        $token = array(
                            "iss" => "http://api.ysjianzhu.com",
                            "aud" => "http://zhaopin.ysjianzhu.com",
                            "iat" => $iat,
                            "exp" => $exp,
                            "nbf" => '',
                            "uuid"=>$data['uuid']
                        );
                       
                         $has = Db::name('templogin')->where('uuid','=',$data['uuid'])->find();
                      
                        $sdata = ['uuid'=>$data['uuid'],'createtime'=>time()]; 
                        if($has){
                          Db::name('templogin')->where('uuid',$data['uuid'])->update($sdata);
                        }else{
                           Db::name('templogin') ->insert($sdata);      
                        }
                       


                       
                        $result['token'] = settoken($token); 
 
                    }else{
                        $result['code']=0;
                        $result['msg']='登录密码错误';
                    }
                
             return json($result);
            
        // }else{
        //     $this->display();
        // }
    }
    
    //登出
    public function logout(){
      myheader::setheader();
        session('adminuser',null);
        if(isset($_GET['token'])){
          $token=explaintoken($_GET['token']);
          cache($token->uuid,null);
        }
        
        return json(['code'=>1,'msg'=>'退出成功！']); 
    }





    public function upload(){  
      myheader::setheader();
     // header('Access-Control-Allow-Origin:http://admin.yushan.com');
     // header('Access-Control-Allow-Origin:http://zhaopin.yushan.com');
     header("Access-Control-Allow-Methods:GET, POST");
     header("Access-Control-Allow-Credentials:true");
     header('Access-Control-Allow-Headers:x-requested-with,Content-Type');


    header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
    header("Cache-Control: no-store, no-cache, must-revalidate");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
 
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
      exit; // finish preflight CORS requests here
    }
    if ( !empty($_REQUEST[ 'debug' ]) ) {
      $random = rand(0, intval($_REQUEST[ 'debug' ]) );
      if ( $random === 0 ) {
        header("HTTP/1.0 500 Internal Server Error");
        exit;
      }
    }
 
    // header("HTTP/1.0 500 Internal Server Error");
    // exit;
    // 5 minutes execution time
    @set_time_limit(5 * 60);
    // Uncomment this one to fake upload time
    // usleep(5000);'php'.DIRECTORY_SEPARATOR.'php'.DIRECTORY_SEPARATOR.
    // Settings
    // $targetDir = ini_get("upload_tmp_dir") . DIRECTORY_SEPARATOR . "plupload";
    $targetDir = 'upload'.DIRECTORY_SEPARATOR.'tmp';
    $uploadDir = 'upload'.DIRECTORY_SEPARATOR.date('Ymd');
    $cleanupTargetDir = true; // Remove old files
    $maxFileAge = 5 * 3600; // Temp file age in seconds
    // Create target dir
    if (!file_exists($targetDir)) {
      @mkdir($targetDir);
    }
    // Create target dir
    if (!file_exists($uploadDir)) {
      @mkdir($uploadDir);
    }
    // Get a file name
    if (isset($_REQUEST["name"])) {
      $fileName = $_REQUEST["name"];
    } elseif (!empty($_FILES)) {
      $fileName = $_FILES["file"]["name"]; 
    } else {
      $fileName = uniqid("file_");
    }

    $oldName = $fileName;

      $ar = explode('.',$fileName);
      $n = unicode_encode($ar[0]);
      if(count($ar)>1){ 
        $fileName = $n.'.'.$ar[1];
      }else{
        $fileName = $n.'.abc';
        } 
 
    $filePath = $targetDir . DIRECTORY_SEPARATOR . $fileName;
    // $uploadPath = $uploadDir . DIRECTORY_SEPARATOR . $fileName;
    // Chunking might be enabled
    $chunk = isset($_REQUEST["chunk"]) ? intval($_REQUEST["chunk"]) : 0;
    $chunks = isset($_REQUEST["chunks"]) ? intval($_REQUEST["chunks"]) : 1;
    // Remove old temp files
    if ($cleanupTargetDir) {
      if (!is_dir($targetDir) || !$dir = opendir($targetDir)) {
        die('{"code" : 0, "error" : {"code": 0, "message": "Failed to open temp directory:'.opendir($targetDir).$targetDir.!is_dir($targetDir).'"}, "id" : "id"}');
      }
      while (($file = readdir($dir)) !== false) {
        $tmpfilePath = $targetDir . DIRECTORY_SEPARATOR . $file;
        // If temp file is current file proceed to the next
        if ($tmpfilePath == "{$filePath}_{$chunk}.part" || $tmpfilePath == "{$filePath}_{$chunk}.parttmp") {
          continue;
        }
        // Remove temp file if it is older than the max age and is not the current file
        if (preg_match('/\.(part|parttmp)$/', $file) && (@filemtime($tmpfilePath) < time() - $maxFileAge)) {
          @unlink($tmpfilePath);
        }
      }
      closedir($dir);
    }
 
    // Open temp file
    if (!$out = @fopen("{$filePath}_{$chunk}.parttmp", "wb")) {
      die('{"code" : 0, "error" : {"code": 0, "message": "Failed to open output stream1111.'.$filePath.'"}, "id" : "id"}');
    }
    if (!empty($_FILES)) {
      if ($_FILES["file"]["error"] || !is_uploaded_file($_FILES["file"]["tmp_name"])) {
        die('{"code" : 0, "error" : {"code": 0, "message": "Failed to move uploaded file."}, "id" : "id"}');
      }
      // Read binary input stream and append it to temp file
      if (!$in = @fopen($_FILES["file"]["tmp_name"], "rb")) {
        die('{"code" : 0, "error" : {"code": 0, "message": "Failed to open input stream222."}, "id" : "id"}');
      }
    } else {
      if (!$in = @fopen("php://input", "rb")) {
        die('{"code" : 0, "error" : {"code": 0, "message": "Failed to open input stream3333."}, "id" : "id"}');
      }
    }
    while ($buff = fread($in, 4096)) {
      fwrite($out, $buff);
    }
    @fclose($out);
    @fclose($in);
    rename("{$filePath}_{$chunk}.parttmp", "{$filePath}_{$chunk}.part");
    $index = 0;
    $done = true;
    for( $index = 0; $index < $chunks; $index++ ) {
      if ( !file_exists("{$filePath}_{$index}.part") ) {
        $done = false;
        break;
      }
    }
 
 
 
    if ( $done ) {
      $pathInfo = pathinfo($fileName);
      $hashStr = substr(md5($pathInfo['basename']),8,16);
      $hashName = time() . $hashStr . '.' .$pathInfo['extension'];
      $uploadPath = $uploadDir . DIRECTORY_SEPARATOR .$hashName;
 
      if (!$out = @fopen($uploadPath, "wb")) {
        die('{"code" : 0, "error" : {"code": 0, "message": "Failed to open output stream444."}, "id" : "id"}');
      }
      if ( flock($out, LOCK_EX) ) {
        for( $index = 0; $index < $chunks; $index++ ) {
          if (!$in = @fopen("{$filePath}_{$index}.part", "rb")) {
            break;
          }
          while ($buff = fread($in, 4096)) {
            fwrite($out, $buff);
          }
          @fclose($in);
          @unlink("{$filePath}_{$index}.part");
        }
        flock($out, LOCK_UN);
      }
      @fclose($out);
      $response = [
        'code'=>1,
        'oldname'=>$oldName,
        'url'=>$uploadPath,
        'filesize'=>format_bytes($_FILES["file"]['size']),
        'filesuffixes'=>$pathInfo['extension']
        // 'file_id'=>$data['id'],
        ];
 
      die(json_encode($response));
    } 
  
    die('{"code" : "0", "result" : null, "id" : "id"}');

}





    /**
     * 输出验证码
     */
    public function editresumeinfo(){
        $where['uid']=2;
        $result=get_datalist('resume',$where,$field=null,$num=null,$sort=null);
        $userinfo=$result[0];


        return rejson($code=1,$msg='成功',$data=$userinfo);

    }





    /**
     * 获取验证码
     * @return [type] [description]
     */
    public function getphoneverifycode(){
     header('Access-Control-Allow-Origin:http://admin.yushan.com');
     header('Access-Control-Allow-Origin:http://zhaopin.yushan.com');
     header("Access-Control-Allow-Methods:GET, POST");
     header("Access-Control-Allow-Credentials:true");
     header('Access-Control-Allow-Headers:x-requested-with,Content-Type');


    header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
    header("Cache-Control: no-store, no-cache, must-revalidate");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
        //验证码通过后才获取手机验证码
      if(input('check')){
        if(!$this->check_verify(input('captcha'),'abc')){ 
              $result['code']=0;
              $result['msg']='验证码填写错误';
              return json($result);
        }
      }

        $sendcode=cutcode(time(),4);
        cache('code',$sendcode,600);
        //手机验证码的
        // sendmessage($_POST['username'],$message);
         $message = '【石头科技】你好！石头科技欢迎你!你的验证码是:'.$sendcode.',验证码十分钟内有效,请勿泄露!';
        $url = 'http://www.smswst.com/api/httpapi.aspx?action=send&account=13877620240&password=55555&mobile='.$_POST['username'].'&content='.$message.'&sendTime=&AddSign=Y';
        // p($_POST['username']);

           $ch = curl_init();
          curl_setopt($ch, CURLOPT_URL, $url);  
          curl_setopt($ch, CURLOPT_RETURNTRANSFER, true) ; // 获取数据返回    
          curl_setopt($ch, CURLOPT_BINARYTRANSFER, true) ; // 在启用 CURLOPT_RETURNTRANSFER 时候将获取数据返回    
          $r = curl_exec($ch);
          curl_close($ch); 
       //$a = getphcode($url,$_POST['username'],$sendcode);
       if($r){
        return rejson('1','验证码发送成功',cache('code'));
       }else{
        return rejson('0','验证码发送失败');
       }
       
       
}
 



//注册用户
public function u_register(){
       header('Access-Control-Allow-Origin:http://admin.yushan.com');
     header('Access-Control-Allow-Origin:http://zhaopin.yushan.com');
     header("Access-Control-Allow-Methods:GET, POST");
     header("Access-Control-Allow-Credentials:true");
     header('Access-Control-Allow-Headers:x-requested-with,Content-Type');


    header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
    header("Cache-Control: no-store, no-cache, must-revalidate");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
  if(!input('username'))return rejson('0','username未设置');

  $where['username']=input('username');
  $re=get_data('admin_user',$where);
  if($re){return rejson('0','该用户名已经被占用');}

  if(!input('password'))return rejson('0','password未设置');
  if(!input('code'))return rejson('0','code未设置');


  if(input('code')!=cache('code')){
        $result['code']=0;
        $result['msg']='手机验证码填写错误';
        return json($result);
  }

  $data['encrypt']=create_salt();
  $data['username']=input('username');
  $data['password']=md5(md5(input('password')).$data['encrypt']);
  $data['usertype']=1;
  $data['uuid']=create_uuid();
  $data['groupid']=1;

  $re=insert_data('admin_user',$data);



  if($re){  
    $w['id']=$re;
    $d=get_data('admin_user',$w);

    $iat = time();
    $exp = $iat+120000;
    $token = array(
        "iss" => "http://api.ysjianzhu.com",
        "aud" => "http://zhaopin.ysjianzhu.com",
        "iat" => $iat,
        "exp" => $exp,
        "nbf" => '',
        "uuid"=>$d['uuid']
    );


    cache($data['uuid'],$token,3600);

    $result['code']=1;
    $result['msg']='注册成功';
    $result['token'] = settoken($token);
    $result['uuid']=$d['uuid'];

    return json($result);
  }else{
    return rejson('0','注册失败');
  }
}




//找回密码
public function find_pass(){
       header('Access-Control-Allow-Origin:http://admin.yushan.com');
     header('Access-Control-Allow-Origin:http://zhaopin.yushan.com');
     header("Access-Control-Allow-Methods:GET, POST");
     header("Access-Control-Allow-Credentials:true");
     header('Access-Control-Allow-Headers:x-requested-with,Content-Type');


    header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
    header("Cache-Control: no-store, no-cache, must-revalidate");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    if(!input('username'))return rejson('0','username未设置');
    if(!input('password'))return rejson('0','password未设置');
    if(input('code')!=cache('code')){
        $result['code']=0;
        $result['msg']='手机验证码填写错误';
        return json($result);
    }
    $where['username']=input('username');
    $data=get_data('admin_user',$where);
    if(!$data){return rejson('0','该用户名不存在');}

    if($data['password']==md5(md5(input('password')).$data['encrypt'])){
      return rejson('0','新密码与原密码相同');
    }

    $data['password']=md5(md5(input('password')).$data['encrypt']);

    $re=update_one('admin_user',$where,$data);
    if($re){
      return rejson('1','找回密码成功');
    }else{
      return rejson('0','找回密码失败');
    }
}


//手机验证码登录
public function phone_login(){
       header('Access-Control-Allow-Origin:http://admin.yushan.com');
     header('Access-Control-Allow-Origin:http://zhaopin.yushan.com');
     header("Access-Control-Allow-Methods:GET, POST");
     header("Access-Control-Allow-Credentials:true");
     header('Access-Control-Allow-Headers:x-requested-with,Content-Type');


    header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
    header("Cache-Control: no-store, no-cache, must-revalidate");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
  if(!input('username'))return rejson('0','username未设置');
      if(input('code')!=cache('code')){
        $result['code']=0;
        $result['msg']='手机验证码填写错误';
        return json($result);
    }

  $data=Db::name('admin_user')->where('username=\''.input('username').'\'')->find();

      if(!$data){ 
          $result['code']=0;
          $result['msg']='用户不存在';
          return json($result);
      }

   $iat = time();
    $exp = $iat+120000;
    $token = array(
        "iss" => "http://api.ysjianzhu.com",
        "aud" => "http://zhaopin.ysjianzhu.com",
        "iat" => $iat,
        "exp" => $exp,
        "nbf" => '',
        "uuid"=>$data['uuid']
    );


    cache($data['uuid'],$token,3600);

    $result['code']=1;
    $result['msg']='登录成功';
    $result['token'] = settoken($token); 

    return json($result);
}



}