<template>
  <div>
    <div>
      <br>
      <br>
      <div style="margin: 0 auto; width: 40%"><h2>订单详情</h2></div>
      <table class="mailTable" :style="styleObject" v-if="s_showByRow">
        <tr v-for="index in rowCount" :key="index">
          <td class="column">{{tableData[index*2-2].key}}</td>
          <td>{{tableData[index*2-2].value}}</td>
          <td class="column">{{tableData[index*2-1] !== undefined ? tableData[index*2-1].key : ''}}</td>
          <td>{{tableData[index*2-1] !== undefined ? tableData[index*2-1].value : ''}}</td>
        </tr>
      </table>
    </div>
    <div class="pay-done-box">
      <img src="static/img/pay-success.png">
    </div>
  </div>
</template>

<script>
export default {
  name: 'PayDone',
  data () {
    return {
      styleObject: {},
      s_showByRow: true,
      tableData: []
    };
  },
  computed: {
    rowCount: function () {
      return Math.ceil(this.tableData.length / 2);
    }
  },
  created () {
    this.styleObject = this.tableStyle;
    if (this.showByRow !== undefined) {
      this.s_showByRow = this.showByRow;
    }
    this.getRequest();
  },
  props: ['tableStyle', 'showByRow'],
  methods: {
    getRequest () {
      let url = location.href.split('?')[1].split('&');
      let query = {};
      url.forEach(item => {
        query[item.split('=')[0]] = decodeURIComponent(item.split('=')[1]);// 转码
      });
      var result = query.result.split('<br/>');
      result.forEach(item => {
        var list = item.split(':');
        console.log(list);
        if (list[0] === 'memberid') {
          let localStorage = window.localStorage;
          let loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
          console.log(loginInfo);
          loginInfo.memberid = parseInt(list[1]);
          localStorage.setItem('loginInfo', JSON.stringify(loginInfo));
        }
        var array = {key: list[0], value: list[1]};
        this.tableData.push(array);
      });
    }
  }
};

</script>

<style scoped>
.pay-done-box {
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.mailTable, .mailTable tr, .mailTable tr td{ border:1px solid #E6EAEE; }
.mailTable{ font-size: 12px; color: #71787E; margin: 0 auto; }
.mailTable tr td{ border:1px solid #E6EAEE; width: 150px; height: 35px; line-height: 35px; box-sizing: border-box; padding: 0 10px; }
.mailTable tr td.column { background-color: #EFF3F6; color: #393C3E; }
</style>
