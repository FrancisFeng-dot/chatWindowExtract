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
                // 设置session
                $_SESSION = array(
                    'nickname' => $message['nickname'],
                    'avatar' => $message['avatar'],
                    'uid' => $uid,
                    'tags' => $message['tags']
                );

                // 将当前链接与uid绑定
                Gateway::bindUid($client_id, $uid);

                $db1 = Db::instance('db1');  //数据库链接

                //查询最近1周有无需要推送的离线信息
                $time = time() - 7 * 3600 * 24;
                $resMsg = $db1->select('id,from_id,from_name,from_avatar,timeline,content')->from('ys_chatlog')
                    ->where("to_id= {$uid} and timeline > {$time} and type = 'privateChat' and need_send = 1" )
                    ->query();
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
                    //                 'timestamp' => $vo['timeline'] * 1000,
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
                $resMsgLog = $db1->select('timeline')->from('ys_chatlog')->where("(to_id = {$to_id} and from_id = {$uid}) or (to_id = {$uid} and from_id = {$to_id})")->query();
                if (count($resMsgLog)>0) {$resMsgLog = $resMsgLog[count($resMsgLog)-1];}
                // var_dump($resMsgLog);
                $timeshow = time()-(int)$resMsgLog['timeline']<150?0:1;
                $chat_message = [
                    'message_type' => 'chatMessage',
                    'data' => [
                        'from_id' => $uid,
                        'nickname' => $message['data']['mine']['nickname'],
                        'from_avatar' => $message['data']['mine']['avatar'],
                        'filetype' => $message['data']['mine']['filetype'],
                        'id' => $type === 'privateChat' ? $uid : $to_id,
                        'to_id' => $to_id,
                        'type' => $type,
                        'chattype' => $message['data']['mine']['chattype'],
                        'content' => htmlspecialchars($message['data']['mine']['content']),
                        'timeline' => time(),
                        'timeshow' => $timeshow
                    ]
                ];
                                var_dump($chat_message);
                if ($uid>$to_id) {
                    $uid1 = $to_id;$uid2 = $uid;
                }else{
                    $uid1 = $uid;$uid2 = $to_id;                    
                }
                $chatuser = ''.$uid1.','.$uid2.'';
                // 加入聊天log表
                $param = [
                    'from_id' => $uid,
                    'to_id' => $to_id,
                    'from_name' => $_SESSION['nickname'],
                    'filetype' => $message['data']['mine']['filetype'],
                    'from_avatar' => $_SESSION['avatar'],
                    'content' => htmlspecialchars($message['data']['mine']['content']),
                    'timeline' => time(),
                    'timeshow' => $timeshow,
                    'need_send' => 1,
                    'chattype' => $message['data']['mine']['chattype'],
                    'chatuser' => $chatuser
                ];
                switch ($type) {
                    // 私聊
                    case 'privateChat':
                        // 插入
                        $param['type'] = 'privateChat';
                        // if (!Gateway::getClientIdByUid($to_id)) {
                        //     $param['need_send'] = 1;  //用户不在线,标记此消息推送
                        // }
                        $zzid = $db1->insert('ys_chatlog')->cols($param)->query();
                        $chat_message['data']['chatlogid'] = $zzid;
                        Gateway::sendToUid($uid, json_encode($chat_message));
                        return Gateway::sendToUid($to_id, json_encode($chat_message));
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
