window.root = 'http://api.yushan.com/';/*http://api.yushan.com/*/
window.debugflag = 0;//1调试模式，0上线模式
window.lg = null;
define('conf', function(require, exports, module) {
  
	window.YSCONF = {
		url:{
		    getmenu:{url:'auth/menutree_select',method:'post_data','name':'后台侧边栏'},
		    com_update:{url:'auth/com_editadd',method:'post_data_watch','name':'编辑更新一条'},
		    com_list:{url:'auth/com_list',method:'post_data_watch','name':'无分页列表'},
		    com_list2:{url:'auth/com_list',method:'post_data_watch','name':'无分页列表'},

		    com_list3:{url:'auth/com_list',method:'post_data_watch','name':'无分页列表'},
		    com_list4:{url:'auth/com_list',method:'post_data_watch','name':'无分页列表'},
		    com_list5:{url:'auth/com_list',method:'post_data_watch','name':'无分页列表'},
            com_list6:{url:'auth/com_list',method:'post_data_watch','name':'无分页列表'},

		    com_list_page:{url:'auth/com_list_page',method:'post_data_watch_page','name':'带分页列表'},
		    com_list_page2:{url:'auth/com_list_page',method:'post_data_watch_page','name':'带分页列表',pageid:"page2"},
		    com_list_page3:{url:'auth/com_list_page',method:'post_data_watch_page','name':'带分页列表'},   
            com_detail:{url:'auth/com_detail',method:'post_data_watch','name':'详情'},
            com_detail2:{url:'auth/com_detail',method:'post_data_watch','name':'详情'},
            com_detail3:{url:'auth/com_detail',method:'post_data_watch','name':'详情'},
		    com_del:{url:'auth/com_delete',method:'post_data_watch','name':'公共删除'},
		    com_editadd:{url:'auth/com_editadd',method:'post_data_watch','name':'编辑或增加'},
		    com_editadd2:{url:'auth/com_editadd',method:'post_data_watch','name':'编辑或增加'},
		    com_editadd3:{url:'auth/com_editadd',method:'post_data_watch','name':'编辑或增加'},
		    com_editadd4:{url:'auth/com_editadd',method:'post_data_watch','name':'编辑或增加'},
		    lgout:{url:'base/logout',method:'post_data_watch','name':'推出登录'},
		   
		},
		win:{
			warmtips_teacher_set:{template:'warmtips_teacher_set',type:'add',title:'温馨提示',temdata:{}}, 
	 }
	};
}); 