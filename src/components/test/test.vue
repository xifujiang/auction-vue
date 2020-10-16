<template>
  <div>
    <div v-html="h"></div>
    12345
    <button @click="goAlipay()">hello world</button>
  </div>
</template>
<script>
export default {
  name: 'test',
  data () {
    return {
      price: 11,
      userParams: 20
    };
  },
  mounted () {
  },
  methods: {
    /**
     * 支付宝支付
     */
    goAlipay () {
      alert('1111');
      this.$loading.show();
      const data = {
        /* 自身接口所需的一些参数 */
        amount: this.price,
        /* 支付后支付宝return的url */
        // returnUrl: 'www.baidu.com'
        returnUrl: window.location.origin + window.location.pathname + '?userParams=' + this.userParams
      };
      this.$http(
        this.$apiSetting.alipay,
        data
      ).then(res => {
        this.$loading.hide();
        if (res.data.statusCode === '000000') {
          const div = document.createElement('div');
          /* 此处form就是后台返回接收到的数据 */
          div.innerHTML = res.data.data.alipayInfo;
          document.body.appendChild(div);
          document.forms[0].submit();
        }
      }, error => {
        this.$loading.hide();
        console.log(error);
      });
    }
  }
};
</script>

<style scoped>

</style>
