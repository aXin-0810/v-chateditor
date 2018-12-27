v-chateditor
===

v-chateditor组件描述

模仿网页版微信聊天输入框可输入***文本**，**表情**，**图片**，**文件**，并且消息可根据类型切割发送。还可以发送***视频**以及***语音**消息。

```javascript

  // 在vue项目根目录执行命令
  npm install v-chateditor

  // 在main.js文件下引入
  import chateditor from 'v-chateditor'
  // 注册使用
  Vue.use(chateditor)

  // 全局使用
  <v-chateditor
    :recordState="true"         //启动录音功能
    @sendMsg="sendMsg"          //获取发送消息回调
    @sendVideo="sendVideo"      //获取视频消息回调
    @sendAudio="sendAudio"      //获取语音消息回调
    :chatEditorStyle=""         //主容器样式设置
    :btnAreaStyle=""            //功能区按钮样式设置
    :sendBtnStyle=""            //发送消息按钮样式设置
    :preStyle=""                //编辑区样式设置
  />

```

![Image text](https://raw.githubusercontent.com/aXin-0810/v-chateditor/master/src/assets/css/img/v-chateditor.jpg)


更新日志
=======

  * v1.0.4

许可证
=======

Code copyright 2012-2019 axin_0810
