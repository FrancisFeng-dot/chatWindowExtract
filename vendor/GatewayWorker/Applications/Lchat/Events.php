<?php
use \GatewayWorker\Lib\Gateway;
use \GatewayWorker\Lib\Db;
/**
 * 主逻辑
 * 主要是处理 onConnect onMessage onClose 三个方法
 * onConnect 和 onClose 如果不需要可以不用实现并删除
 */
class Events
{
   

 // 当有客户端连接时，将client_id返回，让mvc框架判断当前uid并执行绑定
    // public static function onConnect($client_id)
    // {
    //     Gateway::sendToClient($client_id, json_encode(array(
    //         'type'      => 'init',
    //         'client_id' => $client_id
    //     )));
    // }

    /**
     * 当客户端发来消息时触发
     * @param int $client_id 连接id
     * @param mixed $message 具体消息
     */
    public static function onMessage($client_id, $data)
    {


        $message = json_decode($data, true);
        $message_type = $message['type'];
        switch ($message_type) {
            case 'init':
                // uid
                
                $uid = $message['uid'];
                // // 设置session
                // $_SESSION = array(
                //     'nickname' => $message['nickname'],
                //     'avatar' => $message['avatar'],
                //     'uid' => $uid,
                //     'tags' => $message['tags']
                // );

                // 将当前链接与uid绑定
                Gateway::bindUid($client_id, $uid);

                //$db1 = Db::instance('db1');  //数据库链接

                //查询最近1周有无需要推送的离线信息
                $time = time() - 7 * 3600 * 24;
                // $resMsg = $db1->select('id,from_id,from_name,from_avatar,createtime,content')->from('ys_chatlog')
                //     ->where("to_id= {$uid} and createtime > {$time} and type = 'privateChat' and need_send = 1" )
                //     ->query();
                    // if (!empty($resMsg)) {
                    //     foreach ($resMsg as $key => $vo) {
                    //         $log_message = [
                    //             'message_type' => 'logMessage',
                    //             'data' => [
                    //                 'nickname' => $vo['from_name'],
                    //                 'avatar' => $vo['from_avatar'],
                    //                 'id' => $vo['from_id'],
                    //                 'type' => 'logMessage',
                    //                 'content' => htmlspecialchars($vo['content']),
                    //                 'timestamp' => $vo['createtime'] * 1000,
                    //             ]
                    //         ];
                    //         Gateway::sendToUid($uid, json_encode($log_message));
                    //         //设置推送状态为已经推送
                    //         $db1->query("UPDATE `ys_chatlog` SET `need_send` = '0' WHERE id=" . $vo['id']);
                    //     }
                    // }

                // //设置用户为登录状态
                // $db1->query("update `ys_user` set online=1 where uid=" . $uid);

                return;
            case 'chatMessage':
                $db1 = Db::instance('db1');  //数据库链接
                // 聊天消息
                $type = $message['data']['to']['type'];
                $to_id = $message['data']['to']['uid'];
                $uid = $message['data']['mine']['uid'];
                $chattype=$message['data']['to']['chattype'];
                $jobid=$message['data']['mine']['jobid'];

                if ($uid>$to_id) {
                    $uid1 = $to_id;$uid2 = $uid;
                }else{
                    $uid1 = $uid;$uid2 = $to_id;                    
                }
                $chatuser = ''.$uid1.','.$uid2.'';
                $where="chatuser='".$chatuser."'";
                $resMsgLog = $db1->select('max(createtime) createtime')->from('ys_chatlog')->where($where)->single();
                //if (count($resMsgLog)>0) {$resMsgLog = $resMsgLog[count($resMsgLog)-1];}
               // var_dump($resMsgLog);
               $timeshow = time()-(int)$resMsgLog<180?0:1;
               //var_dump($resMsgLog);
               // var_dump(time().'-----------------------'.$resMsgLog[0]['createtime'].'======='.time()-(int)$resMsgLog['createtime']);

                $chat_message = [
                    'message_type' => 'chatMessage',
                    'data' => [
                        'from'=>['uid'=>$uid,'avatar'=>$message['data']['mine']['avatar'],'nickname'=>$message['data']['mine']['nickname']],
                      //  'from_avatar' => $message['data']['mine']['avatar'],
                      //  'filetype' => $message['data']['mine']['filetype'],
                        'id' => $type === 'privateChat' ? $uid : $to_id,
                        'to'=>['uid'=>$to_id,'avatar'=>$message['data']['to']['avatar'],'nickname'=>$message['data']['to']['nickname']],
                        'type' => $type,
                        'chattype' => intval($message['data']['mine']['chattype']),
                        'content' => htmlspecialchars($message['data']['mine']['content']),
                        'createtime' => date('H:i',time()),
                        'jobid'=>$jobid,
                        'timeshow' => $timeshow
                    ]
                ];

                
                                //var_dump($chat_message);

                //$messagetype=$message['messagetype'];
                // 加入聊天log表
                $param = [
                    'from_id' => $uid,
                    'to_id' => $to_id,
                 //   'from_name' => $_SESSION['nickname'],
                 //   'filetype' => $message['data']['mine']['filetype'],
                 //   'from_avatar' => $_SESSION['avatar'],
                    'content' => htmlspecialchars($message['data']['mine']['content']),
                    'createtime' => time(),
                    'timeshow' => $timeshow,
                    'need_send' => 1,
                    'chatuser' => $chatuser,
                    'chattype'=>$chattype,
                    'jobid'=>$jobid
                ];
                switch ($type) {
                    // 私聊
                    case 'privateChat':
                        // 插入
                        if(Gateway::isUidOnline($to_id)){
                            $param['need_send']=0;
                        }
                        
                        $param['type'] = 'privateChat';  
                        switch ($chattype) {
                            case '2'://发送简历请求--hr
                                $zzid = Db::instance('db1')->insert('ys_chatlog')->cols($param)->query();
                                $chat_message['data']['chatlogid'] = $zzid;
                                $chat_message['data']['content']="简历请求发送成功";
                                Gateway::sendToUid($uid, json_encode($chat_message));
                                $chat_message['data']['content']=$message['data']['mine']['nickname']."向您请求简历";
                                return Gateway::sendToUid($to_id, json_encode($chat_message));
                                break;

                            case '3'://发送简历--求职者
                                $zzid = Db::instance('db1')->insert('ys_chatlog')->cols($param)->query();
                                $chat_message['data']['chatlogid'] = $zzid;
                                $chat_message['data']['content']="简历发送成功";
                                Gateway::sendToUid($uid, json_encode($chat_message));
                                $chat_message['data']['content']=$message['data']['mine']['nickname']."向您发来了简历,您的邮箱也能收到";
                                return Gateway::sendToUid($to_id, json_encode($chat_message));
                                break;

                            case '4'://发送面试邀请--hr
                                // $sql='select id from ys_interview where from from_id='.$uid.' and to_id='.$to_id.' and jobid'.$jobid;
                                // $id=Db::instance('db1')->query($sql);echo $id;
                                $param['content']=$message['data']['mine']['nickname'];
                                $param['note']=$message['data']['mine']['note'];
                                $chat_message['data']['note']=$message['data']['mine']['note'];
                                $zzid = Db::instance('db1')->insert('ys_chatlog')->cols($param)->query();
                                $chat_message['data']['chatlogid'] = $zzid;
                                $chat_message['data']['content']="面试邀请发送成功";
                                Gateway::sendToUid($uid, json_encode($chat_message));
                                $chat_message['data']['content']=$message['data']['mine']['nickname']."发来了面试邀请";
                                return Gateway::sendToUid($to_id, json_encode($chat_message));
                                break;

                            case '5'://同意面试邀请--求职者
                                $param['content']=$message['data']['mine']['nickname'];
                                $zzid = Db::instance('db1')->insert('ys_chatlog')->cols($param)->query();
                                $chat_message['data']['chatlogid'] = $zzid;
                                $chat_message['data']['content']="您已同意面试邀请";
                                Gateway::sendToUid($uid, json_encode($chat_message));
                                $chat_message['data']['content']=$message['data']['mine']['nickname']."同意面试邀请";
                                return Gateway::sendToUid($to_id, json_encode($chat_message));
                                break;
                            
                            case '6'://拒绝面试邀请--求职者
                                $zzid = Db::instance('db1')->insert('ys_chatlog')->cols($param)->query();
                                $chat_message['data']['chatlogid'] = $zzid;
                                $chat_message['data']['content']="您已拒绝面试邀请";
                                Gateway::sendToUid($uid, json_encode($chat_message));
                                $chat_message['data']['content']=$message['data']['mine']['nickname']."拒绝面试邀请";
                                return Gateway::sendToUid($to_id, json_encode($chat_message));
                                break;

                            case '7'://不合适且发信息--hr
                                // $sql="SELECT content from ys_chatlog A where createtime=(SELECT max(createtime) from ys_chatlog b where a.id=b.id and chattype='7' and chatuser='".$chatuser."')";
                                // $content=Db::instance('db1')->single($sql);
                                // echo '----------------------'.$content.'-------------------------';
                                $chat_message['data']['content']="已置不合适";
                                Gateway::sendToUid($uid, json_encode($chat_message));

                                $content=$message['data']['mine']['reason'];
                                $chat_message['data']['content']=$content?$content:"您不太符合我们这个职位";
                                return Gateway::sendToUid($to_id, json_encode($chat_message));
                                break;

                            case '8'://不合适且不发信息--hr
                                $chat_message['data']['content']="已置不合适";
                                Gateway::sendToUid($uid, json_encode($chat_message));
                                break;


                            case '18'://建立沟通--求职者
                                 $param['content']="您好，非常喜欢贵公司，希望可以和您聊聊这个职位";
                                $zzid = Db::instance('db1')->insert('ys_chatlog')->cols($param)->query();
                                $chat_message['data']['chatlogid'] = $zzid;
                                $chat_message['data']['content']="您好，非常喜欢贵公司，希望可以和您聊聊这个职位";
                                Gateway::sendToUid($uid, json_encode($chat_message));
                                $chat_message['data']['content']="您好，非常喜欢贵公司，希望可以和您聊聊这个职位";
                                return Gateway::sendToUid($to_id, json_encode($chat_message));
                                break;

                            case '19'://建立沟通--hr
                            $where='id='.$jobid;
                            $jobinfo=$db1->select('jobs_name,wage_cn,city_cn,experience_cn')->from('ys_jobs')->where($where)->query();
                            $param['content']="你好，我公司正在".$jobinfo[0]['city_cn']."寻找具有".$jobinfo[0]['experience_cn']."经验的".$jobinfo[0]['jobs_name'].",薪金".$jobinfo[0]['wage_cn']."能求一份你的简历吗？";
                            $zzid = Db::instance('db1')->insert('ys_chatlog')->cols($param)->query();
                            //$chat_message['data']['chatlogid'] = $zzid;

                            // $chat_message['data']['content']="你好，我公司正在".$jobinfo['city_cn']."寻找具有".$jobinfo['experience_cn']."的".$jobinfo['jobs_name'].",薪金".$jobinfo['wage_cn']."能求一份你的简历吗？";
                            // Gateway::sendToUid($uid, json_encode($chat_message));
                            // return Gateway::sendToUid($to_id, json_encode($chat_message));
                            break;

                            default:       
                                $zzid = Db::instance('db1')->insert('ys_chatlog')->cols($param)->query();
                                $chat_message['data']['chatlogid'] = $zzid;
                                Gateway::sendToUid($uid, json_encode($chat_message));
                                return Gateway::sendToUid($to_id, json_encode($chat_message));
                                break;
                        }

                        
                }
                return;
                break;
            case 'ping':
                return;
            default:
                echo $data;
        }
    }

}
