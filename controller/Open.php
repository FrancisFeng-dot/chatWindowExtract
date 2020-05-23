<?php
namespace app\api\controller;
use think\Controller;
use think\Request;
use think\View;
use think\File;
use think\Db;
use think\Session;
use think\Route;
use think\Loader;
use think\cache\driver\Redis;
use jwt\ExpiredException;
define("TOKEN","linxcABCDEFGHIJGJJ");
define("Appid","wx3edf97fba911c055");
define("AppSecret","069f867e0970e0d563abbbe80b84ffc3");

class Open extends openInit
{
    /**
     * 微信接入验证
     * @return [type] [description]
    */
    public function index(){
        $view = new View();  
        if (!Session::get('jsoninfo')) {
	        if (array_key_exists('code',$_GET)||Session::get('wxopenid')) {
	        	if (Session::get('wxopenid')) {
	        		$openid = Session::get('wxopenid');
	        	}else{
		            $code = $_GET['code'];
		            $oauth2url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=".Appid."&secret=".AppSecret."&code={$code}&grant_type=authorization_code";
	                $jsoninfo = $this->http_curl($oauth2url,null);
	                $access_token = $jsoninfo['access_token'];
	                $openid = $jsoninfo['openid'];
	        	}
                $url = "https://api.weixin.qq.com/sns/userinfo?access_token={$access_token}&openid={$openid}&lang=zh_CN";      
                $jsoninfo = $this->http_curl($url,null);        
                Session::set('jsoninfo',$jsoninfo); 
                Session::set('wxopenid',$openid);              
		    }
		    else{
		        header(wechatRedirect('index'));   
		        exit(); 
		    }            	
        }
        // p($jsoninfo);
    }   

   
    /**
     * 获取全局的access_token方法
     * @return [type] [description]
     */
    public function getAccessToken(){
    	$field = 'access_token,modify_time';
    	$condition = array('token'=>TOKEN,'appid'=>Appid,'appsecret'=>AppSecret);
    	// $data = M('wechat')->field($field)->where($condition)->find();
    	// if($data['access_token'] && time()-$data['modify_time']<7000){
    	// 	$access_token = $data['access_token'];
    	// }else{
    		$url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='.Appid.'&secret='.AppSecret.'';
    		$jsoninfo = $this->http_curl($url,null);
    		if(!$jsoninfo){
    			var_dump($jsoninfo);
    		}else{
    			$access_token = $jsoninfo['access_token'];
    			$data = array('access_token' =>$access_token,'modify_time'=>time());
    			// M('wechat')->where($condition)->save($data);
    		}
    	// }
    	return $access_token;
    }

    /**
     * curl方法
     * @param  [type] $url  [description]
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public function http_curl($url,$data){
	    //1.初始化curl
	    $ch = curl_init();
	    //2.设置curl的参数
	    curl_setopt($ch, CURLOPT_URL, $url);
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE); 
	    if($data){
	    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
	    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
	    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
	    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Content-Length: '.strlen($data)));
	    }
	    //3.采集
	    $output = curl_exec($ch);
	    //4.关闭
	    curl_close($ch);
	    $jsoninfo = json_decode($output, true);
	    return $jsoninfo;
    }
	/*
	 * 辅助方法1：微信接入验证
	 */
	public function main(){
	  $token = 'linxclinxc';
	  $nonce = $_GET["nonce"];  
	  $timestamp = $_GET["timestamp"];
	  // $echoStr = $_GET["echostr"];
	  $signature = $_GET["signature"];
	  $tmpArr = array($token, $timestamp, $nonce);
	  sort($tmpArr, SORT_STRING);
	  $tmpStr = implode( $tmpArr );
	  $tmpStr = sha1( $tmpStr );
	  // if( $tmpStr == $signature && $echoStr){
	  //   // $this->responseMsg();
	  //   ob_clean();
	  //   echo $echoStr;
	  //   exit;
	  // }else{
	    $this->responseMsg();
	  // }
	}

    /**
     * 发送消息
     * @return [type] [description]
     */
    public function responseMsg(){
      $postStr = $GLOBALS["HTTP_RAW_POST_DATA"];               
      $postObj = simplexml_load_string($postStr,"SimpleXMLElement",LIBXML_NOCDATA);//XML转String
    //根据消息类型将信息分发
      if(strtolower( $postObj->MsgType) == 'event'){
          if(strtolower($postObj->Event) == 'subscribe'){
                $toUserName = $postObj->FromUserName;
                $fromUserName = $postObj->ToUserName;
                $createTime = time();
                $msgType = 'text';
                $content = "【私募招聘网】是一家专注私募行业求职、招聘的垂直平台；通过线上招聘+线下社交的创新模式为企业实现快速的人才战略。为私募企业和人才搭建桥梁；让招聘、求职变得更加简单、高效！
快速进入找工作：http://www.91smzpw.com/jobs
 【私募社群】是私募招聘网旗下专注私募行业的垂直社交平台；为用户提供人脉拓展、建立渠道合作、对接优质项目、交流学习的机会聚积地；我们的梦想是连接每一个私募人；在未来的道路上互相帮助、学习、成长！
 欢迎阁下加入；一起共创美好未来；点击下方的【私募社群】即可加入平台";
                $template ="<xml>
                            <ToUserName><![CDATA[%s]]></ToUserName>
                            <FromUserName><![CDATA[%s]]></FromUserName>
                            <CreateTime>%s</CreateTime>
                            <MsgType><![CDATA[%s]]></MsgType>
                            <Content><![CDATA[%s]]></Content>
                            </xml>";
                $info = sprintf($template, $toUserName, $fromUserName,$createTime, $msgType,$content);
                echo $info;
          }
      }
    }
    
	public function img()
	{
	  $view = new View();  
	    return $view->fetch();
	}  
	public function attend()
	{
	  $view = new View();  
	    return $view->fetch();
	}  

	public function create_menu(){
	  $appid = Appid;
	  $appsecret = AppSecret;
	  //下面是测试号的appid和appsecrect
	  // $appid = 'wx855ea7a09cac1332';
	  // $appsecret = '61898f7349e81bda57297d900bdb67ba';
	  $accestoken = $this->getAccessToken($appid,$appsecret);
	  $url = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token={$accestoken}";
	  $menu = '{
	    "button": [
	        {
	            "type": "view",
	            "name": "再梦江南",
	            "url" : "https://open.weixin.qq.com/connect/oauth2/authorize?appid='.Appid.'&redirect_uri=http%3a%2f%2fwww.chenbaozhong.com%2findex.php%2fIndex%2findex&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect"
	        },    
	        {
	            "type": "view",
	            "name": "找工作",
	            "url" : "http://www.91smzpw.com"
	        },  
	        {
	            "type": "view", 
	            "name": "BOSS微信", 
	            "url":"http://www.91smzpw.com/simu/index.php/index/img"
	        } 
	    ]
	  }';  
	    $jsoninfo = $this->http_curl($url,$menu);
	    var_dump($jsoninfo);
	    exit;
	}



	//app下载路径
	public function getysqcore (){

		$qrode['qr']="宇衫二维码";
		$qrode['tip']="下载宇衫APP随时随地的使用";
		$qrode['downurl']="www.baidu.com.....appimg....";
		$qrode['img']=".....二维码的图片地址....";

		return rejson($code=1,$msg='成功',$data=$qrode);
	}

	//职位类型树
	public function jobtypetree(){
		$field='id,parentid,categoryname';
		$trees=get_datalist('category_jobs',$where=null,$field,$num=null,$sort=null);

		foreach ($trees as $k=>$v){
			if($v['parentid']==0){
				$arr[$k] = $v;//dump($arr[$v['id']]);
				foreach ($trees as $kkk=>$vvv){
					if($vvv['parentid']==$v['id']){
						$arr[$k]['chllist'][]= $vvv;
					}
				}
			}
		}

		sort($arr);//重新生成索引下标

		return rejson($code=1,$msg='成功',$data=$arr);
	}

	//职位详情页面的公司和hr头像信息
	public function gethrinfo1(){
		/*$uid=94;
		$where['uid']=94;
		$fie='id,companyname,subcompany,trade_cn,scale_cn,logo,avatar,nickname,business,certification';
		$data=get_datalist('usercom',$where,$fie,$num=null,$sort=null);
		return rejson(1,'success',$data[0]);*/

		$jobid=25;
		$com_id=Db::name('jobs')->where('id','$jobid')->field('company_id')->find();

		$fie='companyname,subcompany,trade_cn,scale_cn,logo,avatar,nickname,business,certification';
		$where['id']=$jobid;
		$data=get_datalist('usercom',$where, $field=$fie);
		return rejson(1,'success',$data);
	}

	//获取HR头像、公司信息
	public function gethrinfo(){
		//$uid=session('uid');
		if(!input('uid'))return rejson('0','uid未设置');
		$uid=input('uid');
		$where['uid']=$uid;
		//$field='id,companyname,scale,scale_cn,logo,avatar,nickname,email';
		$comp=get_datalist('jobs_company',$where,'',$num=null,$sort=null);

		$where1['id']=$uid;
		$field1='nickname,headimg,email,city';
		$user=get_datalist('admin_user',$where1,$field1,$num=null,$sort=null);
		if(!$user){return rejson('0','无此用户信息');}
		$compinfo['nickname']=$user[0]['nickname'];
		$compinfo['headimg']=$user[0]['headimg'];
		$compinfo['email']=$user[0]['email'];
		$compinfo['city']=$user[0]['city'];

		$data=array_merge($comp[0],$compinfo);
		if($data){
			return rejson($code=1,$msg='成功',$data);
		}else{
			return rejson('0','无此公司信息');
		}
	}

	/*public function getcompanyjobtypes(){
		//step1:获取公司发布的职位总数
		$com_id=28;
		$sum=Db::name('jobs')->where('company_id',$com_id)->count('company_id');
		$cate=Db::name('jobs')->where('company_id',$com_id)->field('category,sum(topclass)')->group('category')->select();
		$data = array();
		foreach ($cate as $value) {
			$data[$value['category']] = $value['sum(topclass)'];
		}
		return rejson(1,'success',$data);
	}*/

	//获取发布职位与数量
	public function getcompanyjobtypes(){
		if(!input('companyid')){return rejson('0','companyid未设置');}
		$field='id,parentid,categoryname';
		$where['parentid']=0;
		$job_yi=get_datalist('jobs_category',$where,$field,$num=null,$sort=null);

		foreach ($job_yi as $k=>$v){
			$job_yi[$k]['num']=0;
		}//dump($job_yi);

		//step1:获取公司发布的职位总数
		$com_id=input('companyid');
		$sum=Db::name('jobs')->where('company_id',$com_id)->count('company_id');
		$cate=Db::name('jobs')->where('company_id',$com_id)->field('category,sum(topclass)')->group('category')->select();

		foreach ($cate as $kk =>$vv){
			$exist=Db::name('jobs_category')->where('id','=',$vv['category'] and 'parentid','=',0)->find();
			if($exist){
				foreach ($job_yi as $k=>$v){
					if($v['id']==$exist['id']){
						$job_yi[$k]['num']+=$vv['sum(topclass)'];
					}
				}
			}else{
				$farent_exist=Db::name('jobs_category')->where('parentid','=',$vv['category'] and 'parentid','=',0)->find();
				if($farent_exist){
					$job_yi[$k]['num']+=$vv['sum(topclass)'];
				}
			}
		}

		foreach($job_yi as $key => $value ) {
			if($value['num']==0) unset($job_yi[$key]);
		}
		sort($job_yi);//重新生成索引下标

		return rejson(1,'success',$data=$job_yi);
	}











/*


===========公共方法=============


 */

public function com_list()
	    {
	    if(!input('codeid')){return rejson(0,'参数错误');} 
	    //对codeid进行解析； 
	    $arr = explain_codeid(input('codeid'));  
      $tbn=$arr['tbn'];
	          $where = array();

      $where = dealwhere(input('post.'));
      $order = dealorder(input('post.orderstrid'));

	       //各表不同，关键字对应字段不同，走配置化
			if(input('keyword')){
				 $keyword= $arr['kws']==''?'keyword':$arr['kws'];
				$where[$keyword] = ['like','%'.input('keyword').'%'];
			}

	    //调用模型层接口
	    $data = get_datalist($arr['tbn'],$where,'',input('top'),$order);

	   
	    //对返回去的记录进行加密codeid，方便后面再次调用公共接口； 
	    $datalist = set_codeid($data,$arr['num']);
	      if($datalist){ 
	         return rejson(1,'查询成功',$datalist,$arr);
	      }else{
	      return rejson(0,'查询失败',[],$arr); 	
	      }
}
	

	// 有分页查询列表 
	public function com_list_page()
	    {  
	      $curPage = input('curPage')?input('curPage'):1;
	      $listnum = input('listnum')?input('listnum'):10;  
	     //对codeid 进行解密；
	      $arr = explain_codeid(input('codeid')); 

	  
	      $tbn = $arr['tbn']; 
      $where = dealwhere(input('post.'));
      $order = dealorder(input('post.orderstrid'));
	         //各表不同，关键字对应字段不同，走配置化
        if(input('keyword')){
        	 $keyword= $arr['kws']==''?'keyword':$arr['kws'];
        	$where[$keyword] = ['like','%'.input('keyword').'%'];
        }

          
	      $data = get_datalist_page($tbn,$where,$curPage,$listnum,$order);


	      //对结果进行加密主键id为codeid；
	     $data['datalist'] = set_codeid($data['datalist'],$arr['num']);
	      if(count($data['datalist'])>0){
	       	 return rejson(1,'查询成功',$data,$arr);
	      }else{
	      	 return rejson(0,'查询失败',['datalist'=>[],'total'=>0],$arr);	
	      }  
	    }
	


	// 无分页查询列表
	public function com_detail()
	    {
	    if(!input('codeid')){return rejson(0,'参数错误');} 
	    //对codeid进行解析； 
	    $arr = explain_codeid(input('codeid')); 
	    $tbn = $arr['tbn']; 
	    $where[$arr['id']]=['=',$arr['idv']];
	
	    //调用模型层接口
	    $data = get_data($tbn,$where);
	     
	      if($data>0){

	       //对返回去的记录进行加密codeid，方便后面再次调用公共接口； 
	       $datav = set_codeid([$data],$arr['num']); 

	         return rejson(1,'查询成功',$datav[0],$arr);
	      }else{
	      return rejson(0,'查询失败',[],$arr); 	
	      } 
	    }    
	


	// 含用户信息的详情
	public function ucom_detail()
	    {
	    if(!input('codeid')){return rejson(0,'参数错误');} 
	    //对codeid进行解析； 
	    $arr = explain_codeid(input('codeid')); 
	    $tbn = $arr['tbn']; 
	    $where[$arr['id']]=['=',$arr['idv']];
       //  return json($arr);
	    //调用模型层接口
	    $data = get_data($tbn,$where);  
       
	      if($data>0){
	      	//查询用户信息
	      	
	      	 $uwhere['id'] = ['=',$data['uid']];
	      	 $field = 'nickname,headimg,city,usertype';
  			 $arr2 = get_data('admin_user',$uwhere,$field);
  			 if(!$arr2){return rejson('0','该用户不存在');} 	
  			 if($arr){
  			 	$data =  array_merge($data, $arr2);
  			 } 

	       //对返回去的记录进行加密codeid，方便后面再次调用公共接口； 
	       $datav = set_codeid([$data],$arr['num']);  
	         return rejson(1,'查询成功',$datav[0],$arr);
	      }else{
	      return rejson(0,'查询失败',[],$arr); 	
	      } 
	    }    
	
	public function ucom_list()
	    {
	    if(!input('codeid')){return rejson(0,'参数错误');} 
	    //对codeid进行解析； 
	    $arr = explain_codeid(input('codeid'));  
      $tbn=$arr['tbn'];
	          $where = array();

      $where = dealwhere(input('post.'));
      $order = dealorder(input('post.orderstrid'));

	       //各表不同，关键字对应字段不同，走配置化
			if(input('keyword')){
				 $keyword= $arr['kws']==''?'keyword':$arr['kws'];
				$where[$keyword] = ['like','%'.input('keyword').'%'];
			}

	    //调用模型层接口
	    $data = get_datalist($arr['tbn'],$where,'',input('top'),$order);

	    foreach ($data as $key => $value) {
	    	$uwhere['id']=$value['uid'];
	    	$field = 'nickname,headimg';
	    	$ud=get_data('admin_user',$uwhere,$field);
	    	if(!$ud){return rejson('0','该用户不存在');} 
	    	$value['nickname']=$ud['nickname'];
	    	$value['headimg']=$ud['headimg'];
	    }
	   
	    //对返回去的记录进行加密codeid，方便后面再次调用公共接口； 
	    $datalist = set_codeid($data,$arr['num']);
	      if($datalist){ 
	         return rejson(1,'查询成功',$datalist,$arr);
	      }else{
	      return rejson(0,'查询失败',[],$arr); 	
	      }
}
 
	// 有分页查询列表 
	public function ucom_list_page()
	{
		$curPage = input('curPage') ? input('curPage') : 1;
		$listnum = input('listnum') ? input('listnum') : 10;
		//对codeid 进行解密；
		$arr = explain_codeid(input('codeid'));
		$tbn = $arr['tbn'];
      $where = dealwhere(input('post.'));
      $order = dealorder(input('post.orderstrid'));
		//各表不同，关键字对应字段不同，走配置化
		if (input('keyword')) {
			$keyword = $arr['kws'] == '' ? 'keyword' : $arr['kws'];
			$where[$keyword] = ['like', '%' . input('keyword') . '%'];
		}
		
		$data = get_datalist_page($tbn, $where, $curPage, $listnum,$order);
		if(!$data['datalist']){return rejson('0','无数据',['datalist' => [], 'total' => 0],$arr);}
		//对结果进行加密主键id为codeid；
		$data['datalist'] = set_codeid($data['datalist'], $arr['num']);
//查询对应的用户
		$uids = getids($data['datalist'], 'uid');
		$uwhere['id'] = ['in', $uids];
		$field = 'nickname,id,headimg';
		$arr2 = get_datalist('admin_user', $uwhere, $field);
		if(!$arr2){return rejson('0','该用户不存在');} 
		$data['datalist'] = jointwoarr($data['datalist'], $arr2, 'uid', 'id');


		if (count($data['datalist']) > 0) {
			return rejson(1, '查询成功', $data, $arr);
		} else {
			return rejson(0, '查询失败', ['datalist' => [], 'total' => 0],$arr);
		}
	}


//文件图片上传    
public function formupload(){
    $rd = array('code'=>0,'msg'=>'fail','data'=>array());
    // 获取表单上传文件 例如上传了001.jpg
    $file = request()->file('file');
    // 移动到框架应用根目录/public/uploads/ 目录下
    $info = $file->move(ROOT_PATH . 'upload');
    if($info){
        $path = $info->getSaveName();

        $path = str_replace("\\","/",$path);
        $rd = array('code'=>1,'msg'=>'success','data'=>array('pathurl'=>$path));
    }
    return json($rd);
}



 //文件图片上传    
 public function _upload() {
    import("ORG.Upload");
    $upload = new UploadFile();
    //设置上传文件大小
    $upload->maxSize = 3292200;
    //设置上传文件类型
    $upload->allowExts = explode(',', 'jpg,gif,png,jpeg,mp3');
    //设置附件上传目录
    $upload->savePath = './data/attachments/';
    //设置需要生成缩略图，仅对图像文件有效
    $upload->thumb = true;
    // 设置引用图片类库包路径
    $upload->imageClassPath = '@.ORG.Image';
    //设置需要生成缩略图的文件后缀
    $upload->thumbPrefix = 'm_';
    //生产2张缩略图
    //设置缩略图最大宽度
    $upload->thumbMaxWidth = '720';
    //设置缩略图最大高度
    $upload->thumbMaxHeight = '400';
    //设置上传文件规则
    $upload->saveRule = uniqid;
    //删除原图
    $upload->thumbRemoveOrigin = true;
    if (!$upload->upload()) {
        //捕获上传异常
        return $upload->getErrorMsg();
    } else {
        //取得成功上传的文件信息
        $uploadList = $upload->getUploadFileInfo();
        return $uploadList;
    }
}

/**
 *菜单查询列表或者一条
 * @param    string   $address     "json/pc/admin/menu.json" 
 * @return   arr
 * @author  wyl  
 */
public function menutree_select(){   
     

      $sort = 'listorder asc';
      $list = get_datalist('system_menu','','','',$sort);
      $arr = [];
      foreach ($list as $key => $value) { 
        if($value['pid']==0){
          $arr[] = $value;
        } 
      }


      foreach ($arr as $key => &$value) { 
        foreach ($list as $k => $val) {
          if($value['id']==$val['pid']){
            $value['chllist'][] = $val;
          }  
        } 

        foreach ($value['chllist'] as $key => &$v) { 
        foreach ($list as $k => $va) {
          if($v['id']==$va['pid']){
            $v['chllist'][] = $va;
          }  
        } 
      }     

         


      } 
   
  return rejson(1,'查询成功',$arr,set_comview_admin());
}






//判断是否登录
public function islogin(){
	try{
	    if(isset($_GET['token'])){
	      $token=explaintoken($_GET['token']);
		    if(cache($token->uuid)){
				return rejson('1','已是登录状态');
			}else{
				return rejson('0','未登录状态');
			}
	    }else{
	    	return rejson('0','未登录状态');
	    }
    }catch(\Exception $e){
        return rejson('0','未登录状态');
    }  
}





public function test(){


	   //  $iat = time();
	   //  $exp = $iat+12000;


	   // $token = array(
	   //      "iss" => "http://api.ysjianzhu.com",
	   //      "aud" => "http://zhaopin.ysjianzhu.com",
    //         "iat" => $iat,
    //         "exp" => $exp,
	   //      "nbf" => '',
	   //      "uuid"=>'53f2c24f-49a5-a496-8639-f833c012ced5'
	   //  );

	   // $t=settoken($token);
	   // $data=explaintoken($t);
	   // $where['uuid']=$data->uuid;
	   // $d=get_data('admin_user',$where);

	   // return json($d);




	  $where2['tbname']=['=','jobs'];
      $data2=get_data('system_conf',$where2);
      $num=$data2['tbnum'];

  $data=get_datalist('jobs');
  return json(set_codeid($data,$num));
}




}
