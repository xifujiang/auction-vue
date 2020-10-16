<template>
  <div class="conWrap">
    <button :onclick="accessWebSocket()">执行</button>
    <div id="log-container" style="height: 450px; overflow-y: scroll; background: #333; color: #aaa; padding: 10px;">
      <div></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'socket',
  data () {
    return {
      stompClient: ''
    };
  },
  created () {
    // this.accessWebSocket();
  },
  methods: {
    accessWebSocket () {
      var socket;
      if (typeof (WebSocket) === 'undefined') {
        console.log('您的浏览器不支持WebSocket');
      } else {
        console.log('您的浏览器支持WebSocket');
        // 实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
        // 等同于socket = new WebSocket("ws://localhost:8083/checkcentersys/websocket/20");
        // socket = new WebSocket('/websocket/123'.replace('http', 'ws'));
        // socket = new WebSocket('ws://localhost:9090/websocket/123');
        // socket = new WebSocket('ws://192.168.248.90:8443/websocket/123');
        socket = new WebSocket('ws://114.215.135.160:9090/websocket/shenyn');
        // 打开事件
        socket.onopen = function () {
          console.log('Socket 已打开');
        };
        // 获得消息事件
        socket.onmessage = function (msg) {
          console.log(msg.data);
          // 发现消息进入    开始处理前端触发逻辑
        };
        // 关闭事件
        socket.onclose = function () {
          console.log('Socket已关闭');
        };
        // 发生了错误事件
        socket.onerror = function () {
          alert('Socket发生了错误');
          // 此时可以尝试刷新页面
        };
      }
    }

  }

};
</script>

<style scoped>

</style>
