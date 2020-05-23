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
class Chat extends Init
{
    //获取聊天用户
    public function getchat(){  
      $rd = array('code'=>0,'msg'=>'fail','data'=>array());
      $token=explaintoken($_GET['token']);
      $user = Db::name('admin_user')->where('uuid',$token->uuid)->find();
      $touser = '';
      if($_POST['touserid']){
          $touser = Db::name('admin_user')->where('id',$_POST['touserid'])->find();
      }
      if($user&&$touser){
        $rd['code'] = 1;$rd['msg']  = 'success';
        //由于前台和workman用的是uid和avatar，暂时先转化统一
        $user['uid'] = $user['id'];
        $user['avatar'] = $user['headimg'];
        $user['nickname']=$user['nickname'];
        $touser['uid'] = $touser['id'];
        $touser['avatar'] = $touser['headimg'];
        $touser['nickname']=$touser['nickname'];

        //获取公司id
        $cw['uid']=$user['id'];
        $field='id';
        $companyiddata=get_data('jobs_company',$cw,$field);
        $companyid=$companyiddata['id'];

        //判断是否沟通过
        $ischat=0;
        if(input('jobid')){
          $chatuser=get_chatuser($user['id'],$touser['id']);
          $jobw['jobid']=input('jobid');
          $jobw['chatuser']=$chatuser;
          $jobdata=get_data('chatlog',$jobw);
          if($jobdata){
            $ischat=1;
          }
        }

        //判断是否举报过
        $isreport=0;

        $rw['uid']=$user['id'];
        $rw['reportman']=$touser['id'];
        $report=get_data('prosecute',$rw);
        if($report)$isreport=1;

        unset($user['headimg']);
        unset($touser['headimg']);
        $rd['ischat']=$ischat;
        $rd['data']  = array('user' => $user,'touser' => $touser,'isreport'=>$isreport,'companyid'=>$companyid);
      }
      if($user&&!$touser){
        $rd['code'] = 1;$rd['msg']  = 'success';
        //由于前台和workman用的是uid和avatar，暂时先转化统一
        $user['uid'] = $user['id'];
        $user['avatar'] = $user['headimg'];
        $user['nickname']=$user['nickname'];

        //获取公司id
        $cw['uid']=$user['id'];
        $field='id';
        $companyiddata=get_data('jobs_company',$cw,$field);
        $companyid=$companyiddata['id'];

        unset($user['headimg']);
        $rd['data']  = array('user' => $user,'companyid'=>$companyid);
      }
      return json($rd);
    }


    //获取与全部人的最新聊天纪录--前台
    public function getallchatlog(){
      $token=explaintoken($_GET['token']);
      $user = Db::name('admin_user')->where('uuid',$token->uuid)->find();
      $uid = $user['id'];

      $curPage = input('curPage')?input('curPage'):1;
      $listnum = input('listnum')?input('listnum'):10;

      $sql="SELECT A.*,(SELECT sum(need_send) from ys_chatlog where chatuser=A.chatuser and jobid=A.jobid and A.to_id=".$uid.") weidu FROM ys_chatlog A,
        (SELECT createtime, MAX(createtime) max_time FROM ys_chatlog where from_id=".$uid." or to_id=".$uid." GROUP BY chatuser,jobid) B
        WHERE  A.createtime = B.max_time
        GROUP BY chatuser,jobid";

      $data=DB::name('ys_chatlog')->query($sql);

    foreach ($data as $key => &$value) {
      if(!isset($value['weidu']))$value['weidu']=0;
                if($value['from_id']==$uid){
                    if($value['from_del']==1){
                      unset($data[$key]);
                      continue;
                    }
                    $id=$value['to_id'];
                }else if($value['to_id']==$uid){
                    if($value['to_del']==1){
                      unset($data[$key]);
                      continue;
                    }
                    $id=$value['from_id'];
                }
          $uinfo=Db::name('admin_user')->where('id',$id)->field('id uid,headimg,nickname')->find();
          $value['headimg']=$uinfo['headimg'];
          $value['nickname']=$uinfo['nickname'];

          $jobs=Db::name('jobs')->where('id',$value['jobid'])->field('id,uid,jobs_name,companyname,wage_cn,category_cn,district_cn,experience_cn,education_cn,nature,nature_cn')->find();
          $value['jobs_name']=$jobs['jobs_name'];
          $value['companyname']=$jobs['companyname'];
          $value['wage_cn']=$jobs['wage_cn'];
          $value['category_cn']=$jobs['category_cn'];
          $value['district_cn']=$jobs['district_cn'];
          $value['experience_cn']=$jobs['experience_cn'];
          $value['education_cn']=$jobs['education_cn'];
          $value['nature']=$jobs['nature'];
          $value['nature_cn']=$jobs['nature_cn'];
          //$value['weidu']=get_weidu($value['from_id'],$value['to_id']);

          if($id==$uid){//自己接收到的信息
            if($value['chattype']=='2'){$value['content']=$value['content'].'向您请求完整简历';}
            if($value['chattype']=='4'){$value['content']=$value['content'].'向您发送了发来的面试邀请点击查看详情';}
          }else{//自己发送的信息
            if($value['chattype']=='3'){$value['content']='简历发送成功';}
            if($value['chattype']=='5'){$value['content']='您已同意面试邀请';}
            if($value['chattype']=='6'){$value['content']='您已拒绝面试邀请';}
            if($value['chattype']=='8')break;
          }
          // if ($value['createtime']-time()>3600*24) {
          //   $value['createtime'] = date('Y-n-d H:i',$value['createtime']);
          // }else{
          //   $value['createtime'] = date('H:i',$value['createtime']);
          // }
          $value['id']=$jobs['id'];
          unset($value['from_id']);
          unset($value['to_id']);
          //unset($value['chatuser']);
      }
      if(input('keyword')){
        foreach ($data as $key => $value) {
          if(!(strpos($value['companyname'], input('keyword')) !== false) && !(strpos($value['jobs_name'], input('keyword')) !== false)){
            unset($data[$key]);
          }
        }
      }

      $where2['tbname']=['=','jobs'];
      $data2=get_data('system_conf',$where2);
      $num=$data2['tbnum'];

      if(count($data)==0){return rejson('0','无聊天记录');}

       $result=fenye($data,$listnum);
            
      if ($curPage>ceil(count($data)/$listnum)) {
        return rejson('0','该页无数据,页数超出范围');
      }

      //if(count($result)==0){return rejson('0','无数据');}

      $re['pages']=ceil(count($data)/$listnum);
      $re['datalist']=set_codeid($result[$curPage-1],$num);
      $re['total']=count($data);


      if($re){
        return rejson('1','成功',$re);
      }else{
        return rejson('0','失败');
      }
    }


 //获取与全部人的最新聊天纪录--后台
    public function getadminchatloglist(){

      // $token=explaintoken($_GET['token']);
      // $user = Db::name('admin_user')->where('uuid',$token->uuid)->find();
      // $uid = $user['id'];
      $uid=get_uid($_GET['token']);
      //p($this->user);

      // if(input('texttype')){
      //   $texttype=input('texttype');
      // }

      $sql="SELECT A.*,(SELECT sum(need_send) from ys_chatlog where chatuser=A.chatuser and jobid=A.jobid and A.to_id=".$uid.") weidu FROM ys_chatlog A,
        (SELECT createtime, MAX(createtime) max_time FROM ys_chatlog where from_id=".$uid." or to_id=".$uid." GROUP BY chatuser,jobid) B
        WHERE  A.createtime = B.max_time
        GROUP BY chatuser,jobid";
      $data=DB::name('ys_chatlog')->query($sql);

      
    foreach ($data as $key => &$value) {
      if(!isset($value['weidu']))$value['weidu']=0;
      $jobwhere['id']=$value['jobid'];
      $field='jobs_name';
      $jobdata=get_data('jobs',$jobwhere,$field);
      if(!$jobdata)return rejson('0','job数据错误');
      $value['jobs_name']=$jobdata['jobs_name'];
      //$weidu=0;
     if($value['from_id']==$uid){//自己发送的
          if($value['from_del']==1){
            unset($data[$key]);
            continue;
          }
                //if($value['from_del']==1)continue;
                //获取发送方的用户信息
                $whe['id']=['=',$value['to_id']];
                $field='headimg,nickname';
                $dd2=get_data('admin_user',$whe,$field);
                if(!$dd2){return rejson('0','无数据');}

                if($value['chattype']=='2'){$value['content']='简历请求发送成功';}
                if($value['chattype']=='4'){$value['content']='面试邀请发送成功';}
                if($value['chattype']=='7'){$value['content']='已置不合适';}
                if($value['chattype']=='8'){$value['content']='已置不合适';}

                //获取对方的id
                $dd2['expertid']=$value['to_id'];
            }else{//对方发送的
              if($value['to_del']==1){
            unset($data[$key]);
            continue;
          }
                //if($value['to_del']==1)continue;
                if($value['chattype']=='3'){$value['content']=$value['content'].'向您发来了完整简历，您的邮箱也能看到';}
                if($value['chattype']=='5'){$value['content']=$value['content'].'同意面试邀请';}
                if($value['chattype']=='6'){$value['content']=$value['content'].'拒绝面试邀请';}
                //获取发送方的用户信息
                $whe['id']=['=',$value['from_id']];
                $field='headimg,nickname';
                $dd2=get_data('admin_user',$whe,$field);
                if(!$dd2){return rejson('0','无数据');}

                //获取对方的id
                $dd2['expertid']=$value['from_id'];
            }

             $value=array_merge($value,$dd2);
             //$value['weidu']=get_weidu($value['from_id'],$value['to_id']);
              
              //筛选薪资，经验，职位名
             if(input('salary')||input('experience')||input('jobs_name')){
              $id=$value['expertid'];
              $w['uid']=$id;
              if(input('salary'))$w['wage_cn']=['like',"%".input('salary')."%"];
              if(input('experience'))$w['experience_cn']=['like',"%".input('experience')."%"];
              if(input('jobs_name'))$w['intention_jobs']=['like',"%".input('jobs_name')."%"];
              $resume=get_data('resume',$w);
              if(!$resume){
                unset($data[$key]);
                //break;
              }
             }



             if(input('type')){// 1--待确认 2--不合适 3--请求简历 4--
              $del=0;
                if(input('type')==1){//筛选不合适的联系人
                  $w2['id']=$value['jobid'];
                  $field='confirm';
                  $confirm=get_data('jobs',$w2,$field);
                  if(!$confirm){return rejson('0','该职位id不存在');}
                  if($confirm['confirm']){
                    $arr=explode(',',$confirm['confirm']);
                    foreach ($arr as $k => $v) {
                      if($v==$value['expertid']){
                        $del=1;
                        break;
                      }
                    }
                    if(!$del)unset($data[$key]);
                  }else{
                    unset($data[$key]);
                  }
                }
                if(input('type')==2){//筛选不合适的联系人
                  $w2['id']=$value['jobid'];
                  $field='unfituser';
                  $unfit=get_data('jobs',$w2,$field);
                  if(!$unfit){return rejson('0','该职位id不存在');}
                  if($unfit['unfituser']){
                    $arr=explode(',',$unfit['unfituser']);
                    foreach ($arr as $k => $v) {
                      if($v==$value['expertid']){
                        $del=1;
                        break;
                      }
                    }
                    if(!$del)unset($data[$key]);
                  }else{
                    unset($data[$key]);
                  }
                }

                if(input('type')==3||input('type')==4){//筛选出请求过简历的人\邀请过面试的人
                  $w2['chatuser']=$value['chatuser'];
                  $field='chattype';
                  $info=get_datalist('chatlog',$w2,$field);
                  foreach ($info as $k => $v) {
                    if(input('type')==3){//筛选出请求过简历的人
                      if($v['chattype']==2){//chattype 2是求职者发送简历请求
                          $del=1;
                          break;
                      }
                      
                    }

                    if(input('type')==4){//筛选出邀请过面试的人
                      if($v['chattype']==4){//chattype 4是求职者发送面试邀请
                          $del=1;
                          break;
                      }
                      
                    }
                  }
                  if(!$del)unset($data[$key]);
                }

             }

          }



      // if(count($data)==0){return rejson('0','无聊天记录');}

      //  $result=fenye($data,$listnum);
            
      // if ($curPage>ceil(count($data)/$listnum)) {
      //   return rejson('0','该页无数据,页数超出范围');
      // }

      // //if(count($result)==0){return rejson('0','无数据');}

      // $re['pages']=ceil(count($data)/$listnum);
      // $re['datalist']=$result[$curPage-1];
      // $re['total']=count($data);

      if(input('keyword')){
        foreach ($data as $key => $value) {
          if(!(strpos($value['nickname'], input('keyword')) !== false)){
            unset($data[$key]);
          }
        }
      }

      if($data){
        return rejson('1','成功',data_handle($data));
      }else{
        return rejson('0','失败');
      }
    }



    // //获取聊天记录--前台
    // public function getChatLog(){
    //   if(!$_POST['touserid'])return rejson('0','touserid未设置');
    //   if(!$_POST['uid'])return rejson('0','uid未设置');
    //   $userid = $_POST['uid'];
    //   $touserid = $_POST['touserid'];


    //   //获取聊天记录
    //   $chatlog = Db::name('chatlog')->where('from_id='.$userid.' AND to_id='.$touserid.'')->whereOr('from_id='.$touserid.' AND to_id='.$userid.'')->order('createtime','desc')/*->limit($_POST['page']*50,13)*/->select(); 
    //   sort($chatlog);
    //   if($chatlog){
    //     foreach ($chatlog as $key => &$value) {
    //       $body=array();
    //       if($userid==$value['to_id']){//自己接收的信息
    //         if($value['chattype']=='2'){$value['content']=$value['content'].'向您请求完整简历';}
    //         if($value['chattype']=='4'){$value['content']=$value['content'].'向您发送了发来的面试邀请点击查看详情';}
    //         if($value['chattype']=='8'){unset($chatlog[$key]);break;}
    //       }else{//自己发送的信息
    //         if($value['chattype']=='3'){$value['content']='简历发送成功';}
    //         if($value['chattype']=='5'){$value['content']='您已同意面试邀请';}
    //         if($value['chattype']=='6'){$value['content']='您已拒绝面试邀请';}
    //       }
    //       //获取发送方信息
    //       $fromdata = Db::name('admin_user')->where('id',$value['from_id'])->field('id uid,headimg avatar,nickname')->find();
    //       $value['from']=$fromdata;

    //       //获取接收方信息
    //       $todata=Db::name('admin_user')->where('id',$value['to_id'])->field('id uid,headimg avatar,nickname')->find();
    //       $value['to']=$todata;

    //       $body=['chattype'=>$value['chattype']];
    //       $value['body']=$body;
    //       $value['loginid']=intval($userid);

         
    //       unset($value['from_id']);
    //       unset($value['to_id']);
    //     }
    //   }
    //   if(count($chatlog)>0){ 
    //      return rejson(1,'查询成功',data_handle($chatlog));
    //   }else{
    //   return rejson(0,'查询失败',[]);   
    //   } 
    // }    


    //获取聊天记录--前台--分页
    public function getChatLog(){
      if(!$_POST['touserid'])return rejson('0','touserid未设置');
      if(!$_POST['uid'])return rejson('0','uid未设置');
      if(!$_POST['jobid'])return rejson('0','jobid未设置');
      $userid = $_POST['uid'];
      $touserid = $_POST['touserid'];
      $jobid=$_POST['jobid'];

      // $curPage = input('curPage')?input('curPage'):1;
      // $listnum = input('listnum')?input('listnum'):10;
      $page = 8+$_POST['page']*8;
      $row = 8;
      //获取聊天记录
      $chatlog = Db::name('chatlog')->where('from_id='.$userid.' AND to_id='.$touserid.' AND jobid='.$jobid)->whereOr('from_id='.$touserid.' AND to_id='.$userid.' AND jobid='.$jobid)->order('createtime','desc')->limit($page,$row)->select(); 
      sort($chatlog);
      if($chatlog){
        $newsnum=0;
        foreach ($chatlog as $key => &$value) {
          $body=array();
          //处理未读--已读
          if($value['need_send']&&$value['to_id']==$userid){
            $value['need_send']=0;
            $where5['id']=$value['id'];
            update_one('chatlog',$where5,$value);
            $newsnum++;
          }
          if($userid==$value['to_id']){//自己接收的信息
            if($value['chattype']=='2'){$value['content']=$value['content'].'向您请求完整简历';}
            if($value['chattype']=='4'){$value['content']=$value['content'].'向您发送了发来的面试邀请点击查看详情';}
            if($value['chattype']=='8'){unset($chatlog[$key]);break;}
          }else{//自己发送的信息
            if($value['chattype']=='3'){$value['content']='简历发送成功';}
            if($value['chattype']=='5'){$value['content']='您已同意面试邀请';}
            if($value['chattype']=='6'){$value['content']='您已拒绝面试邀请';}
          }
          //获取发送方信息
          $fromdata = Db::name('admin_user')->where('id',$value['from_id'])->field('id uid,headimg avatar,nickname')->find();
          $value['from']=$fromdata;

          //获取接收方信息
          $todata=Db::name('admin_user')->where('id',$value['to_id'])->field('id uid,headimg avatar,nickname')->find();
          $value['to']=$todata;

          $body=['chattype'=>$value['chattype']];
          $value['body']=$body;
          $value['loginid']=intval($userid);

         
          unset($value['from_id']);
          unset($value['to_id']);
        }
      }



      if(count($chatlog)==0){return rejson('0','无聊天记录');}

      //  $result=fenye($chatlog,$listnum);
            
      // if ($curPage>ceil(count($chatlog)/$listnum)) {
      //   return rejson('0','该页无数据,页数超出范围');
      // }

      // //if(count($result)==0){return rejson('0','无数据');}

      // $re['pages']=ceil(count($chatlog)/$listnum);
      $re['data']=$chatlog;
      // $re['total']=count($chatlog);
      if($re){
        $re['data']=data_handle($re['data']);
        return json(['code'=>1,'msg'=>'成功','newsnum'=>$newsnum,'data'=>$re['data']]); 
      }else{
        return rejson('0','失败',[]);
      }
    }       



    // //获取后台聊天记录
    // public function getadminChatLog(){  
    //   if(!$_POST['touserid'])return rejson('0','touserid未设置');
    //   if(!$_POST['uid'])return rejson('0','uid未设置');
    //   if(!$_POST['jobid'])return rejson('0','jobid');
    //   $userid = $_POST['uid'];
    //   $touserid = $_POST['touserid'];

    //   //获取简历信息
    //   $where['id']=$touserid;
    //   $resume=get_data('resume',$where);


    //   //获取岗位不合适名单
    //   $jw['id']=input('jobid');
    //   $field='unfituser,confirm';
    //   $job=get_data('jobs',$jw,$field);
    //   $setup=1; // 1--无操作 2--待确认 3--不合适
    //   if($job['unfituser']){
    //     $arr=explode(',',$job['unfituser']);
    //     foreach ($arr as $key => $value) {
    //       if($value==$touserid)$setup=3;
    //     }
    //   }
    //   if($job['confirm']){
    //     $arr=explode(',',$job['confirm']);
    //     foreach ($arr as $key => $value) {
    //       if($value==$touserid)$setup=2;
    //     }
    //   }

    //   //获取聊天记录
    //   $chatlog = Db::name('chatlog')->where('from_id='.$userid.' AND to_id='.$touserid.'')->whereOr('from_id='.$touserid.' AND to_id='.$userid.'')->order('createtime','desc')/*->limit($_POST['page']*50,13)*/->select(); 
    //   sort($chatlog);
    //   if($chatlog){

    //     //获取岗位信息
    //     // if($chatlog[0]['jobid']){
    //     //   $w['id']=$chatlog[0]['jobid'];
    //     //   $field='jobs_name';
    //     //   $job=get_data('jobs',$w,$field);
    //     // }
    //     foreach ($chatlog as $key => &$value) {

    //       $fromdata = Db::name('admin_user')->where('id',$value['from_id'])->field('id uid,headimg avatar,nickname')->find();
    //       $value['from']=$fromdata;

    //       //获取接收方信息
    //       $todata=Db::name('admin_user')->where('id',$value['to_id'])->field('id uid,headimg avatar,nickname')->find();
    //       $value['to']=$todata;

    //       //$value['adminloginid']=intval($userid);

    //       //$value['chattype']=0;
    //       if($value['from_id']==$touserid){//对方发送的信息
    //         // $uinfo=Db::name('admin_user')->where('id',$value['from_id'])->field('id uid,headimg,nickname')->find();
    //         // $value['headimg']=$uinfo['headimg'];
    //         // $value['nickname']=$uinfo['nickname'];

    //         if($value['chattype']=='3'){$value['content']=$value['content'].'向您发来了完整简历，您的邮箱也能看到';}
    //         if($value['chattype']=='5'){$value['content']=$value['content'].'同意面试邀请';}
    //         if($value['chattype']=='6'){$value['content']=$value['content'].'拒绝面试邀请';}
    //         //$value['chattype']=1;
    //       }else{//自己发送的信息
    //         if($value['chattype']=='2'){$value['content']='简历请求发送成功';}
    //         if($value['chattype']=='4'){$value['content']='面试邀请发送成功';}
    //         if($value['chattype']=='7'){$value['content']='已置不合适';}
    //         if($value['chattype']=='8'){$value['content']='已置不合适';}
    //       }

         
    //       unset($value['from_id']);
    //       unset($value['to_id']);
    //     }
    //   }

    //   if(count($chatlog)>0){ 
    //      return json(['code'=>1,'msg'=>'查询成功','setup'=>$setup,/*"jobname"=>$job['jobs_name'],*/'resume'=>$resume,'data'=>data_handle($chatlog)]); 
    //   }else{
    //   return rejson(0,'查询失败',[]);   
    //   } 
    // }    


//获取后台聊天记录--分页
    public function getadminChatLog(){  
      if(!$_POST['touserid'])return rejson('0','touserid未设置');
      if(!$_POST['uid'])return rejson('0','uid未设置');
      if(!$_POST['jobid'])return rejson('0','jobid');

      // $curPage = input('curPage')?input('curPage'):1;
      // $listnum = input('listnum')?input('listnum'):10;

      $page = 8+$_POST['page']*8;
      $row = 8;


      $userid = $_POST['uid'];
      $touserid = $_POST['touserid'];
      $jobid=$_POST['jobid'];

      //获取简历信息
      $where['id']=$touserid;
      $resume=get_data('resume',$where);


      //获取岗位不合适名单
      $jw['id']=input('jobid');
      $field='unfituser,confirm';
      $job=get_data('jobs',$jw,$field);
      $setup=1; // 1--无操作 2--待确认 3--不合适
      if($job['unfituser']){
        $arr=explode(',',$job['unfituser']);
        foreach ($arr as $key => $value) {
          if($value==$touserid)$setup=3;
        }
      }
      if($job['confirm']){
        $arr=explode(',',$job['confirm']);
        foreach ($arr as $key => $value) {
          if($value==$touserid)$setup=2;
        }
      }

      //获取聊天记录
      $chatlog = Db::name('chatlog')->where('from_id='.$userid.' AND to_id='.$touserid.' AND jobid='.$jobid)->whereOr('from_id='.$touserid.' AND to_id='.$userid.' AND jobid='.$jobid)->order('createtime','desc')->limit($page,$row)->select(); 
      sort($chatlog);
      if($chatlog){
        $newsnum=0;
        //获取岗位信息
        // if($chatlog[0]['jobid']){
        //   $w['id']=$chatlog[0]['jobid'];
        //   $field='jobs_name';
        //   $job=get_data('jobs',$w,$field);
        // }
        foreach ($chatlog as $key => &$value) {
          //处理未读--已读

          if($value['need_send']&&$value['to_id']==$userid){
            $value['need_send']=0;
            $where5['id']=$value['id'];
            update_one('chatlog',$where5,$value);
            $newsnum++;
          }


          $fromdata = Db::name('admin_user')->where('id',$value['from_id'])->field('id uid,headimg avatar,nickname')->find();
          $value['from']=$fromdata;

          //获取接收方信息
          $todata=Db::name('admin_user')->where('id',$value['to_id'])->field('id uid,headimg avatar,nickname')->find();
          $value['to']=$todata;

          //$value['adminloginid']=intval($userid);

          //$value['chattype']=0;
          if($value['from_id']==$touserid){//对方发送的信息
            // $uinfo=Db::name('admin_user')->where('id',$value['from_id'])->field('id uid,headimg,nickname')->find();
            // $value['headimg']=$uinfo['headimg'];
            // $value['nickname']=$uinfo['nickname'];

            if($value['chattype']=='3'){$value['content']=$value['content'].'向您发来了完整简历，您的邮箱也能看到';}
            if($value['chattype']=='5'){$value['content']=$value['content'].'同意面试邀请';}
            if($value['chattype']=='6'){$value['content']=$value['content'].'拒绝面试邀请';}
            //$value['chattype']=1;
          }else{//自己发送的信息
            if($value['chattype']=='2'){$value['content']='简历请求发送成功';}
            if($value['chattype']=='4'){$value['content']='面试邀请发送成功';}
            if($value['chattype']=='7'){$value['content']='已置不合适';}
            if($value['chattype']=='8'){$value['content']='已置不合适';}
          }

         
          unset($value['from_id']);
          unset($value['to_id']);
        }
      }

       if(count($chatlog)==0){return rejson('0','无聊天记录');}

      //  $result=fenye($chatlog,$listnum);
            
      // if ($curPage>ceil(count($chatlog)/$listnum)) {
      //   return rejson('0','该页无数据,页数超出范围');
      // }

      //if(count($result)==0){return rejson('0','无数据');}

      // $re['pages']=ceil(count($chatlog)/$listnum);
      $re['data']=$chatlog;
      //$re['total']=count($chatlog);



      if($re){
        $re['data']=data_handle($re['data']);
        return json(['code'=>1,'msg'=>'查询成功','newsnum'=>$newsnum,'setup'=>$setup,'resume'=>$resume,'data'=>$re['data']]); 
      }else{
        return rejson('0','失败',[]);
      }
    }


    //更改need_send
    public function needSend(){  
      $rd = array('code'=>0,'msg'=>'fail','data'=>array());
      $user = user_auth();
      if ($user['id']>$_POST['toid']) {
          $uid1 = $_POST['toid'];$uid2 = $user['id'];
      }else{
          $uid1 = $user['id'];$uid2 = $_POST['toid'];                    
      }
      $chatuser = ''.$uid1.','.$uid2.'';      
      $chatlog = Db::name('chatlog')->where('chatuser',$chatuser)->update(array('need_send' => 0 ));
      if($chatlog){
        $rd['code'] = 1;$rd['msg']  = 'success';
      }
      return json($rd);
    }

  //更改need_send
    public function needSend2(){  
      $rd = array('code'=>0,'msg'=>'fail','data'=>array());
      $chatlog = Db::name('chatlog')->where('id',$_POST['id'])->update(array('need_send' => 1 ));
      if($chatlog){
        $rd['code'] = 1;$rd['msg']  = 'success';
      }
      return json($rd);
    }
    
    //获取statu状态
    public function getChatStatu(){  
      $user = user_auth();
      $statu = Db::name('chatlog')->where('chattype=1 AND need_send=1 AND to_id='.$user['id'].'')->select();
      $statu = count($statu)>0?1:0;

      $prostatu = Db::name('chatlog')->where('chattype=2 AND need_send=1 AND to_id='.$user['id'].'')->select();
      $prostatu = count($prostatu)>0?1:0;

      $rd = array();
      $rd['data']  = array('statu' => $statu,'prostatu'=>$prostatu);
      return json($rd);
    }





    //举报hr
    public function report_hr(){
      if(!input('hrid'))return rejson('0','hrid未设置');
      if(!input('uid'))return rejson('0','hrid未设置');
      $data['reportman']=input('hrid');
      $data['uid']=input('uid');
      $data['createtime']=time();
      $data['type']=1;//举报类型
      if(input('content')){$data['content']=input('content');}
      if(input('report')){$data['report']=input('report');}
      if(input('reportimg')){$data['reportimg']=input('reportimg');}

      $re=insert_data('prosecute',$data);

      if($re){
        return rejson('1','成功',$re);
      }else{
        return rejson('0','失败');
      }
    }



    //检查简历时否完善
    public function check_resume(){
      $uid=get_uid($_GET['token']);
      $where['uid']=$uid;
      $data=get_data('resume',$where);
      if($data){     
        return rejson('1','有简历');
      }else{
        return rejson('0','简历需要完善');
      }
    }

    public function view_resume(){
      if(!input('to_id')){return rejson('0','to_id未设置');}
      if(!input('jobid')){return rejson('0','jobid未设置');}
      $uid=get_uid($_GET['token']);
      $to_id=input('to_id');
      $jobid=input('jobid');

      $chatuser=get_chatuser($uid,$to_id);
      $where['chatuser']=$chatuser;
      $where['jobid']=$jobid;
      $where['chattype']=3;
      $data=get_data('chatlog',$where);

      $w['uid']=$to_id;
      $field='attachment';
      $resume=get_data('resume',$w,$field);
      if(!$resume){return rejson('0','失败');}
      if($data){
        return rejson('1','可以浏览完整简历',$resume['attachment']);
      }else{
        return rejson('0','无权限浏览');
      }
    }

    public function send_interview(){
      if(!input('from_id')){return rejson('0','from_id未设置');}
      if(!input('to_id')){return rejson('0','to_id未设置');}
      if(!input('jobid')){return rejson('0','jobid未设置');}
      $from_id=input('from_id');
      $to_id=input('to_id');
      $data['from_id']=$from_id;
      $data['to_id']=$to_id;
      $data['jobs_id']=input('jobid');
      $data['createtime']=time();
      if(input('interviewtime')){$data['interviewtime']=strtotime(input('interviewtime'));}
      if(input('telephone')){$data['telephone']=input('telephone');}
      if(input('interview_address')){$data['interview_address']=input('interview_address');}
      if(input('notes')){$data['notes']=input('notes');}
      if(input('companyid')){$data['company_id']=input('companyid');}

      $id=insert_data('interview',$data);

      if($id){
        return rejson('1','成功',$id);
      }else{
        return rejson('0','失败');
      }
    }


    public function handle_interview(){
      $uid=get_uid($_GET['token']);
      if(!input('isagree')){return rejson('0','isagree未设置');}// 1--同意邀请 2--拒绝邀请
      if(!input('id')){return rejson('0','id未设置');}
      $isagree=input('isagree');
      $where['id']=input('id');
      if($isagree==1){//同意邀请
        $data['isagree']=1;
      }else{//拒绝邀请
        $data['isagree']=2;
      }
      $re=update_one('interview',$where,$data);
      if($re){
        return rejson('1','更新成功',$isagree);
      }else{
        return rejson('0','更新失败');
      }
    }



    public function interview_list(){
      if(!input('id')){return rejson('0','id未设置');}
      $id=input('id');
      $where['id']=$id;
      $data=get_data('interview',$where);
      if($data){
        $data['interviewtime']=date('Y m d H:i',$data['interviewtime']);
      }
      if($data){
        return rejson('1','查询成功',$data);
      }else{
        return rejson('0','查询失败');
      }
    }


    //添加到不合适名单
    public function add_unfit(){
      $d['reason']='您不太符合我们这个职位';
      if(!input('jobid')){return rejson('0','jobid未设置');}
      if(!input('from_id')){return rejson('0','from_id未设置');}
      if(!input('to_id')){return rejson('0','to_id未设置');}
      if(input('reason')){$reason=input('reason');}
      $uid=input('to_id');
      $issend=0;
      if(input('issend')){
        $d['chattype']=input('issend')==1?7:8;
        //插入记录到chatlog表
        $d['from_id']=input('from_id');
        $d['to_id']=input('to_id');
        $d['jobid']=input('jobid');
        $d['content']=input('reason');
        if (input('from_id')>input('to_id')) {
                      $uid1 = input('to_id');$uid2 = input('from_id');
                  }else{
                      $uid1 = input('from_id');$uid2 = input('to_id');                    
                  }
        $d['chatuser'] = ''.$uid1.','.$uid2.'';
        $d['createtime']=time();
        $d['type']='privateChat';
        $d['need_send']=1;
        $r=insert_data('chatlog',$d);
      }
      //更新job表数据，加入不合适名单
      $temp=0;
      $where['id']=input('jobid');
      $field='unfituser';
      $data=get_data('jobs',$where,$field);
      if(!$data)return rejson('0','数据不存在');
      if($data['unfituser']){
        $arr=explode(',',$data['unfituser']);
        foreach ($arr as $key => $value) {
          if($value==$uid){$temp=1;unset($arr[$key]);break;}
        }
        if($temp){
          $data['unfituser']=implode(',',$arr);
          $setup2=2;//2--取消不合适名单操作
        }else{
          $data['unfituser']=$data['unfituser'].','.$uid;
          $setup2=1;//1--加入不合适名单操作
        }  
      }else{
        $data['unfituser']=$uid;
        $setup2=1;//1--加入不合适名单操作
      }

      $re=update_one('jobs',$where,$data);
      if($re){
        return rejson('1','添加不合适名单成功',$issend,$setup2);
      }else{
        return rejson('0','添加不合适名单失败');
      }
    }












 //添加到待确认名单
    public function add_confirm(){

      if(!input('jobid')){return rejson('0','jobid未设置');}
      if(!input('to_id')){return rejson('0','to_id未设置');}

      $uid=input('to_id');

      //更新job表数据，加入待确认名单
      $where['id']=input('jobid');
      $field='confirm';
      $data=get_data('jobs',$where,$field);
      if(!$data)return rejson('0','数据不存在');
      if($data['confirm']){
        $arr=explode(',',$data['confirm']);
        foreach ($arr as $key => $value) {
          if($value==$uid){$temp=1;unset($arr[$key]);break;}
        }
        if($temp){
          $data['confirm']=implode(',',$arr);
          $setup2=4;//取消待确认名单操作
        }else{
          $data['confirm']=$data['confirm'].','.$uid;
          $setup2=3;//加入待确认名单操作
        }  
      }else{
        $data['confirm']=$uid;
        $setup2=3;//加入待确认名单操作
      }

      $re=update_one('jobs',$where,$data);
      if($re){
        return rejson('1','添加待确认名单成功',[],$setup2);
      }else{
        return rejson('0','添加待确认名单失败');
      }
    }



    //删除聊天记录
    public function chat_delete(){
      $uid=get_uid($_GET['token']);
      $re=array();
      if(!input('chatuser')){return rejson('0','chatuser未设置');}
      if(!input('jobid')){return rejson('0','jobid未设置');}

      $chatuser=input('chatuser');
      $jobid=input('jobid');

      $where['chatuser']=['=',$chatuser];
      $where['jobid']=$jobid;
      $data=get_datalist('chatlog',$where);
      foreach ($data as $key => &$value) {
        if(isset($value['from_id'])&&isset($value['to_id'])){
        if ($value['from_id']==$uid) {
          $re[]=DB::name('chatlog')->where('id='.$value['id'])->setField('from_del',1);
        }
        if($value['to_id']==$uid){
          $re[]=DB::name('chatlog')->where('id='.$value['id'])->setField('to_del',1);
        }
      }
    }
      if(count($re)!=0){
        return rejson('1','删除成功');
      }else{
        return rejson('0','删除失败');
      }

    }








    public function test(){
      return json(123);
    }

}