// 加载
require('../css/chatScreen.css')
require('../css/icons.css')
var Recorder = require('./recorder.js')
// 文件下标计数
var fileId=0;
// 文件数组容器
var	fileArray=[];
// 视频文件发送
var videoFile;
// 长按录音
var luyin;
//文件消息初始
var fileInitial=()=>{	
	fileId = 0; fileArray=[];
};

//输入框获取光标位置
function getCursortPosition (textDom) {
		var cursorPos = 0;
		if (document.selection) {
				textDom.focus ();
				var selectRange = document.selection.createRange();
				selectRange.moveStart ('character', -textDom.value.length);
				cursorPos = selectRange.text.length;
		}else if (textDom.selectionStart || textDom.selectionStart == '0') {
				cursorPos = textDom.selectionStart;
		}
		return cursorPos;
};

//设置光标所在位置
function setCaretPosition(element, pos) {
		var range, selection;
		if (document.createRange){
			range = document.createRange();//创建一个选中区域
			range.selectNodeContents(element);//选中节点的内容
			if(element.innerHTML.length > 0) {
					range.setStart(element.childNodes[0], pos); //设置光标起始为指定位置
			}
			range.collapse(true);       //设置选中区域为一个点
			selection = window.getSelection();//获取当前选中区域
			selection.removeAllRanges();//移出所有的选中范围
			selection.addRange(range);//添加新建的范围
		};
};

//光标前插入节点函数
function insertPositionNode(nodeId,doc){
	var range,selection;//记录光标位置对象
	selection = window.getSelection();//获取当前选中区域
	//判断选中区域为某个节点id时才能触发
	if(selection.baseNode && (selection.baseNode.id == nodeId || selection.baseNode.parentElement.id == nodeId)){
		var node = selection.anchorNode;
		// 这里判断是做是否有光标判断，因为弹出框默认是没有的
		if(node!=null){
				range = selection.getRangeAt(0);// 获取光标起始位置
		}else{
		　　range = undefined;
		}
		range.insertNode(doc);// 在光标位置插入该对象
		selection.collapseToEnd();//光标移动至末尾
	};
};

//dom主动获取焦点并且移动到末尾
function getFocus(){
	var selection = window.getSelection();//获取当前选中区域
	//判断选中区域为某个节点id时才能触发
	if(!(selection.baseNode && (selection.baseNode.id == 'preId' || selection.baseNode.parentElement.id == 'preId'))){
		var obj = document.getElementById('preId');
		if (window.getSelection) {
					obj.focus();
					selection.selectAllChildren(obj);	//range 选择obj下所有子内容
					selection.collapseToEnd();	 //光标移至最后
		}else if (document.selection) {
					var range = document.selection.createRange();	//创建选择对象
					range.moveToElementText(obj);	//range定位到obj
					range.collapse(false);	 //光标移至最后
					range.select();
			};
		};
};

//设置按键发送与换行
function keydownFun(cbok){
	return function(event){
		// 发送操作
		if(!event.ctrlKey && event.keyCode == 13){
			event.preventDefault();
			send(cbok)();
		}else 
		//换行操作
		if(event.ctrlKey && event.keyCode == 13){
			event.preventDefault();
				newlineFun();
				boxScroll();
		};
	}
};

//换行函数
function newlineFun(){
	var br_ = document.createElement("br");
	insertPositionNode('preId',br_);
};

//滚动条始终保持最下方
function boxScroll(){
	var doc = document.getElementById('preId');
		doc.scrollTop = doc.scrollHeight;
};

//编辑框添加文件信息
function pushFile(file){
	// console.log(file.name);
	var doc_img = document.createElement("img");
	doc_img.setAttribute("src", require('./文件icon.png'));
	doc_img.setAttribute("data-fileid", fileId++);
	doc_img.setAttribute("style", 'width:40px;height:40px;');
	insertPositionNode('preId',doc_img);
};

// 视频发送
function pushVideo(cbok){
	return function(){
		fileId++;
		if(cbok){
			cbok(videoFile)
		}
	};
};

//编辑框添加图片信息
function pushImage(src_){
	var doc = document.createElement("img");
	doc.setAttribute("src", src_);
	doc.setAttribute("data-imageid", fileId++);
	doc.setAttribute('style','vertical-align:bottom;');
	insertPositionNode('preId',doc);
};

//编辑框添加表情信息
function pushExpression(data){
	var doc = document.createElement("img");
	doc.setAttribute("src", "https://wx.qq.com/zh_CN/htmledition/v2/images/spacer.gif");
	doc.setAttribute("class", data.class_);
	doc.setAttribute('style','vertical-align:bottom;');
	doc.setAttribute('data-id',data.index_);
	insertPositionNode('preId',doc);
};

//获取并操作文件信息
function obtainFile(){
	var fileVal = document.getElementById('uploadFile').files;
	for(var i=0;i<fileVal.length;i++){
		//判断文件类型并操作
		judgeFileType(fileVal[i]);
	};
	document.getElementById('uploadFile').value = '';
};

//获取文件绝对路径
function getObjectURL(file) {
	var url = null;
	if(window.createObjcectURL != undefined) {
		url = window.createOjcectURL(file);
	} else if(window.URL != undefined) {
		url = window.URL.createObjectURL(file);
	} else if(window.webkitURL != undefined) {
		url = window.webkitURL.createObjectURL(file);
	}
	return url;
};

//判断文件类型
function judgeFileType(file_){
	var type = file_.type;
	
	// 图片类型文件处理
	if(type.indexOf('image')>-1){
		//追加文件
		fileArray.push(file_);
		pushImage(getObjectURL(file_));
	}else

	// 视频类型文件处理
	if(
		type.indexOf('audio')>-1 ||
		type.indexOf('video')>-1
	){
		videoFile = file_;
		document.getElementById('sendVideo').click();
	}else

	// 其它文件类型
	{
		fileArray.push(file_);
		pushFile(file_);
	}
};

//文件拖拽至输入框
function dropFile(){
	//获取拖拽区域
	var dropPre=document.querySelector("#preId");
	//绑定拖动释放事件
	dropPre.ondrop=function(e){
		e.preventDefault();
		getFocus();
		//获取文件对象
		var fileVal=e.dataTransfer.files;
		for(var i=0;i<fileVal.length;i++){
			//判断文件类型并操作
			judgeFileType(fileVal[i]);
		};
	};
};

// 切割发送消息
function cutSend(preVal){
	var messageArr_ = [];
	var bool = false;
	var str = '';

	preVal.forEach((item,index,array) => {

		// 文本
		if(item.nodeName == '#text'){
			if(item.data !== ''){
				str += item.data
			}
		}else 
		
		// 图标
		if(item.nodeName == 'IMG'){

			// 表情
			if(item.dataset.id){
				var QQExpresArr=[
					'[微笑]','[撇嘴]','[色]','[发呆]','[得意]','[流泪]','[害羞]','[闭嘴]','[睡]','[大哭]','[尴尬]','[发怒]','[调皮]','[呲牙]','[惊讶]',
					'[难过]','[酷]','[冷汗]','[抓狂]','[吐]','[偷笑]','[愉快]','[白眼]','[傲慢]','[饥饿]','[困]','[惊恐]','[流汗]','[憨笑]','[悠闲]',
					'[奋斗]','[咒骂]','[疑问]','[嘘]','[晕]','[疯了]','[衰]','[骷髅]','[敲打]','[再见]','[擦汗]','[抠鼻]','[鼓掌]','[糗大了]','[坏笑]',
					'[左哼哼]','[右哼哼]','[哈欠]','[鄙视]','[委屈]','[快哭了]','[阴险]','[亲亲]','[吓]','[可怜]','[菜刀]','[西瓜]','[啤酒]','[篮球]','[乒乓]',
					'[咖啡]','[饭]','[猪头]','[玫瑰]','[凋谢]','[嘴唇]','[爱心]','[心碎]','[蛋糕]','[闪电]','[炸弹]','[刀]','[足球]','[瓢虫]','[便便]',
					'[月亮]','[太阳]','[礼物]','[拥抱]','[强]','[弱]','[握手]','[胜利]','[抱拳]','[勾引]','[拳头]','[差劲]','[爱你]','[NO]','[OK]',
					'[爱情]','[飞吻]','[跳跳]','[发抖]','[怄火]','[转圈]','[磕头]','[回头]','[跳绳]','[投降]','[激动]','[乱舞]','[献吻]','[左太极]','[右太极]'
				];
				str += QQExpresArr[item.dataset.id]
			}else 
			
			// 图片文件
			if(item.dataset.imageid){
				if(str !== ''){
					messageArr_.push({
						type:'text',
						msg:str
					})
				}
				messageArr_.push({
					type:'file',
					fileIndex:item.dataset.imageid
				})
				bool = true;
			}

			// 其它文件
			if(item.dataset.fileid){
				if(str !== ''){
					messageArr_.push({
						type:'text',
						msg:str
					})
				}
				messageArr_.push({
					type:'file',
					fileIndex:item.dataset.fileid
				})
				bool = true;
			}

		}else 
		
		// 换行符
		if(item.nodeName == 'BR'){
			str += '\n'
		}

		if(bool){
			str = '';
			bool = false;
		}
	});

	if(str !== ''){
		messageArr_.push({
			type:'text',
			msg:str
		})
	}

	return messageArr_
};

//发送消息
function send(cbok){
	return function(){
		//获取输入框数据信息
		var preVal = document.getElementById('preId').childNodes;	
		if(cbok){
			cbok(cutSend(preVal),fileArray)
		}
	};
};


/************************************	设置 *************************************** */

//表情包操作
function expressionOperation(cbok){
			
	//显示表情窗
	function showExpression(){
		var height_ = 0;
		var opacity_ = -0.12;
		var doc = document.getElementById('expression_');
		var mask = document.getElementById('expression_mask');
		mask.style.display = 'block';
		doc.style.display = 'block';
		
		//第一帧渲染
		window.requestAnimationFrame(render);
		
		function render(){
			height_+=10;
			opacity_+=0.04;
			if(height_<=280){						
				doc.style.height = height_ + 'px';
				doc.style.top = (height_+5)*-1 + 'px';
				doc.style.opacity = opacity_;
				//递归渲染
				window.requestAnimationFrame(render);
			};
		};
		
		switchExpression();
		mask.onclick=function(){hideExpression()};
		getFocus();
	};
	
	//隐藏表情窗
	function hideExpression(){
		var height_ = 280;
		var opacity_ = 1;
		var doc = document.getElementById('expression_');
		var mask = document.getElementById('expression_mask');
		mask.style.display = 'none';
		
		//第一帧渲染
		window.requestAnimationFrame(render);
		
		function render(){
			height_-=10;
			opacity_-=0.04;
			if(height_>=0){						
				doc.style.height = height_ + 'px';
				doc.style.top = (height_+5)*-1 + 'px';
				doc.style.opacity = opacity_;
				//递归渲染
				window.requestAnimationFrame(render);
			}else{
				doc.style.display = 'none';
			};
		};
		
		mask.removeEventListener("click", hideExpression, false);
	};

	//切换表情	
	function switchExpression(){
		document.getElementById('bqShow_k').innerHTML = qqemoji();
	
		function qqemoji(){
			var str='';
			// 113个表情
			for(var i=0;i<105;i++){
				str+=`<button  class="Iclick qq_bqsize" ><i class="qqemoji qqemoji${i}" data-qqemoji="${i}"></i></button>`
			};	return str;
		};
		
		if(cbok){
			var qqemojiArr = document.getElementsByClassName('qqemoji');
			for(var i=0;i<qqemojiArr.length;i++){
				qqemojiArr[i].onclick=function(){
					var index_ = this.getAttribute('data-qqemoji'),
						class_  = this.getAttribute('class');
					cbok({index_,class_});
				};
			};	
		};
	};
	
	return{
		showExpression,
		hideExpression,
		switchExpression,
	}
};

//长按录音
function webRecording(){
	//new一个音频
	var audio_context = new AudioContext;
	var recorder;
	
	navigator.getUserMedia({audio: true}, startUserMedia, function(e){
		console.log('使用媒体设备请求被用户或者系统拒绝');
	});
	
	function startUserMedia(stream) {
		var input = audio_context.createMediaStreamSource(stream);
		recorder = new Recorder(input);
	}

	function startRecording() {
		recorder && recorder.record();
	}

	function stopRecording(cbok) {
		recorder && recorder.stop();
		createDownloadLink(cbok);
		recorder.clear();
	}
	
	function createDownloadLink(cbok) {
		recorder && recorder.exportWAV(function(blob){
			cbok(blob)
		});
	};
	
	return{
		startRecording,
		stopRecording
	}
};

export default{
	// 输入框初始
	initializeEmpty(){
		document.getElementById('preId').innerHTML = '';
		fileInitial()
	},
	// 视频文件初始
	initiaVideo(){
		videoFile = {}
	},
	// 表情包点击
	expressionClick:function(){
		expressionOperation(pushExpression).showExpression()
	},
	// 打开文件夹
	webWechatPicClick(){
		getFocus()
		videoFile = {}
		document.getElementById('uploadFile').click()
	},
	// 选中文件夹
	uploadFile:obtainFile,
	// enter键发送
	preIdKeydown(sendFun){
		return keydownFun(sendFun)
	},
	// 点击发送按钮
	sendMsgClick(sendFun){
		return send(sendFun)
	},
	// 发送视频
	sendVideo(sendVideoFun){
		return pushVideo(sendVideoFun)
	},
	// 启动录音
	webRecord(){
		luyin = webRecording();
		return{
			startRecording:luyin.startRecording,
			stopRecording:luyin.stopRecording
		}
	},
	// 启动文件拖拽
	dropFile,
	// 发送文本消息
	sendmsg:function(){},
	// 发送视频消息
	sendvideo:function(){},
	// 发送语音消息
	sendaudio:function(){},
	// 修改发送文本消息函数
	setSendMsg:function(cbok){
		this.sendmsg = cbok;
	},
	// 修改发送视频消息函数
	setSendVideo:function(cbok){
		this.sendvideo = cbok;
	},
	// 修改发送语音消息函数
	setSendAudio:function(cbok){
		this.sendaudio = cbok;
	},
};