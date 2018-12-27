<template>
  <div class="chatEditor_" id="chatEditor_" :style="chatEditorStyle||''">
    <div style="width:100%;height:100%;min-width:300px;position: relative;text-align: left;">
      <!--遮罩-->
      <img id="expression_mask" src="https://wx.qq.com/zh_CN/htmledition/v2/images/spacer.gif"/>
      <!--表情包-->
      <div id="expression_" class="expression_">
          <!-- 切换 -->
          <div class="expressionSwitch"> <a class="qq_bq bqqh">QQ表情</a> </div>
          <!-- 表情展示 -->
          <div class="bqShow"> <div id="bqShow_k" class="bqShow_k"></div> </div>
      </div>
      <!--功能按钮区-->
      <div :style="'width:100%;height:36px;box-sizing: border-box;padding: 3px;'+(btnAreaStyle||'')">
        <button id="webWechatFace" class="web_wechat_face Iclick"  @click="expressionClick"></button>
        <button id="webWechatPic" class="web_wechat_pic Iclick" @click="webWechatPicClick"></button>
        <!--剪切按钮-->
        <!-- <button class="web_wechat_screencut Iclick"></button> -->
        <input multiple type="file" id="uploadFile" style="display: none" @change="uploadFile"/>
      </div>
      <!--编辑框-->
      <pre id="preId" class="pre_message" contenteditable="true" @keydown="preIdKeydown" :style="preStyle||''"></pre>
      <!--事件按钮-->
      <div style="width:100%;height:30px;box-sizing: border-box;text-align: right;">
        <button id="recording" v-if="recordState" @mousedown="startRecording" @mouseup="stopRecording" :style="sendBtnStyle||''">长按录音</button>
        <button id="sendMsg" @click="sendMsgClick" :style="sendBtnStyle||''">发送消息</button>
        <button id="sendVideo" style="display:none;" @click="sendVideo">视频发送</button>
      </div>
    </div>
  </div>
</template>

<script>
import chatScreen from '../assets/js/chatScreen'
export default {
  props:['recordState','preStyle','sendBtnStyle','btnAreaStyle','chatEditorStyle'],
  data() {
    return {
      webRecord:this.recordState ? chatScreen.webRecord() : {}
    }
  },
  components: {},
  mounted() {
    var this_ = this;
    chatScreen.setSendMsg((obj)=>{
      this_.$emit('sendMsg',obj)
    });
    chatScreen.setSendVideo((obj)=>{
      this_.$emit('sendVideo',obj)
    });
    chatScreen.setSendAudio((obj)=>{
      this_.$emit('sendAudio',obj)
    });
  },
  methods: {
    expressionClick:chatScreen.expressionClick,
    webWechatPicClick:chatScreen.webWechatPicClick,
    uploadFile:chatScreen.uploadFile,
    startRecording(){
      if(this.recordState)this.webRecord.startRecording();
    },
    stopRecording(){
      if(this.recordState)this.webRecord.stopRecording(this.voice);
    },
    preIdKeydown:chatScreen.preIdKeydown((msgArr,fileArr)=>{
      chatScreen.initializeEmpty()
      chatScreen.sendmsg({msgArr,fileArr})
    }),
    sendMsgClick:chatScreen.sendMsgClick((msgArr,fileArr)=>{
      chatScreen.initializeEmpty()
      chatScreen.sendmsg({msgArr,fileArr})
    }),
    sendVideo:chatScreen.sendVideo((file)=>{
      chatScreen.initiaVideo()
      chatScreen.sendvideo(file)
    }),
    voice(file){
      chatScreen.sendaudio(file)
    },
  },
}
</script>

<style>
.chatEditor_{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 5px;
}
#recording,
#sendMsg{
  width: 90px;
  height: 30px;
  border-radius: 5px;
  display: inline-block;
  box-sizing: border-box;
  text-align: center;
  line-height: 28px;
  font-size: 14px;
  background-color: #fff;
  color: #222;
  border: 1px solid #c1c1c1;
  outline: none;
}
#recording:active ,
#sendMsg:active {
    color:#3385ff;
    border:1px solid #3385ff;
}
</style>
