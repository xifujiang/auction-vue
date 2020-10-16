<template>
  <div>
    <Search></Search>
    <GoodsListNav></GoodsListNav>
    <div class="goods-list-container">
      <Alert show-icon class="tips-box">
        小提示
        <Icon type="ios-lightbulb-outline" slot="icon"></Icon>
        <template slot="desc">请点击商品前的选择框，选择商品，点击付款即可。</template>
      </Alert>
      <Table border ref="selection" :columns="columns" :data="myOrder" size="large" @on-selection-change="select" no-data-text="您的购物车没有商品，请先添加商品到购物车再点击购买">
      </Table>
      <div class="remarks-container">
        <h3>备注</h3>
        <i-input v-model="remarks" size="large" placeholder="在这里填写备注信息" class="remarks-input"></i-input>
      </div>
      <div class="invoices-container">
        <h3>发票信息</h3>
        <p>该商品不支持开发票</p>
      </div>
      <div class="pay-container">
        <div class="pay-box">
          <p><span>提交订单应付总额：</span> <span class="money"><Icon type="social-yen"></Icon> {{totalPrice.toFixed(2)}}</span></p>
          <div class="pay-btn">
            <Button type="error" size="large" @click="tradePay()">支付订单</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Search from '@/components/Search';
import GoodsListNav from '@/components/nav/GoodsListNav';
import store from '@/vuex/store';
import { mapState } from 'vuex';
export default {
  name: 'MemberOrder',
  beforeRouteEnter (to, from, next) {
    window.scrollTo(0, 0);
    next();
  },
  created () {
    this.getUid();
    this.addOrder();
  },
  data () {
    return {
      columns: [
        {
          type: 'selection',
          width: 58,
          align: 'center'
        },
        {
          title: '标题',
          key: 'cname',
          align: 'center'
        },
        {
          title: '性质',
          width: 198,
          key: 'nature',
          align: 'center'
        },
        {
          title: '价格',
          width: 180,
          key: 'price',
          align: 'center'
        }
      ],
      flag: false,
      remarks: '',
      htmls: '',
      myOrder: [],
      uid: '',
      memberid: 0,
      record: 4, // 用于记录下单类型，会放在订单前面做标记 （充值钱包）
      totalPrice: 0,
      radio: '1',
      modal: false,
      userPackageTb: {}
    };
  },
  computed: {
    ...mapState(['shoppingCart'])
  },
  inject: ['reload'],
  methods: {
    select (selection, row) {
      console.log(selection);
      var price = 0;
      selection.forEach(item => {
        price += item.price;
      });
      this.totalPrice = price;
      this.reload();
    },
    getUid () {
      let localStorage = window.localStorage;
      let loginInfo = localStorage.getItem('loginInfo');
      this.uid = (JSON.parse(loginInfo))['uid'];
    },
    addOrder () {
      let cname = this.$route.query.cname;
      let nature = this.$route.query.nature;
      let price = this.$route.query.price;
      var data = [{
        cname: cname,
        nature: nature,
        price: price
      }];
      this.myOrder = data;
    },
    getOrderInfo () {
      var orderInfo = {
        tradeNo: this.record + '' + this.randomNumber(), // 商户订单号(记录号+memberid+随机号)
        uid: this.uid,
        subject: this.$route.query.uname, // 订单名称
        totalPrice: this.totalPrice.toFixed(2), // 付款金额
        nature: this.myOrder[0].nature, // 商品描述
        remarks: this.remarks
      };
      return orderInfo;
    },
    openModal () {
      this.$axios({
        url: '/getMoney',
        method: 'post',
        params: {
          uid: this.uid
        }
      }).then(successResponce => {
        if (successResponce.data.code === 200) {
          this.userPackageTb = successResponce.data.data;
          this.modal = true;
        }
      });
    },
    tradePay () { // 充值
      this.alipay();
    },
    alipay () {
      var orderInfo = this.getOrderInfo();
      this.$axios({
        url: '/tradePay',
        method: 'post',
        data: orderInfo
      }).then(successResponce => {
        console.log(successResponce.data.code);
        if (successResponce.data.code === 200) {
          // 打开新页面
          let routerData = this.$router.resolve({path: '/payGateWay', query: {htmlData: successResponce.data.data}});
          window.open(routerData.href);
        }
      }).catch(failResponse => {
      });
    },
    closeModel () {
      this.modal = false;
    },
    setTimeDateFmt (s) { // 个位数补齐十位数
      return s < 10 ? '0' + s : s;
    },
    randomNumber () {
      const now = new Date();
      let month = now.getMonth() + 1;
      let day = now.getDate();
      let hour = now.getHours();
      let minutes = now.getMinutes();
      let seconds = now.getSeconds();
      month = this.setTimeDateFmt(month);
      day = this.setTimeDateFmt(day);
      hour = this.setTimeDateFmt(hour);
      minutes = this.setTimeDateFmt(minutes);
      seconds = this.setTimeDateFmt(seconds);
      let orderCode = now.getFullYear().toString() + month.toString() + day + hour + minutes + seconds + (Math.round(Math.random() * 1000000)).toString();
      return orderCode;
    }
  },
  components: {
    Search,
    GoodsListNav
  },
  store
};
</script>

<style scoped>
.goods-list-container {
  margin: 15px auto;
  width: 80%;
}
.tips-box {
  margin-bottom: 15px;
}
.remarks-container {
  margin: 15px 0px;
}
.remarks-input {
  margin-top: 15px;
}
.invoices-container p{
  font-size: 12px;
  line-height: 30px;
  color: #999;
}
.pay-container {
  margin: 15px;
  display: flex;
  justify-content: flex-end;
}
.pay-box {
  font-size: 18px;
  font-weight: bolder;
  color: #495060;
}
.money {
  font-size: 26px;
  color: #f90013;
}
.pay-btn {
  margin: 15px 0px;
  display: flex;
  justify-content: flex-end;
}
</style>
