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
          <span>选择支付方式：
            <el-radio v-model="radio" label="1">钱包支付</el-radio>
            <el-radio v-model="radio" label="2">支付宝支付</el-radio>
          </span>
          <div class="pay-btn">
            <Button type="error" size="large" @click="tradePay()">支付保证金</Button>
          </div>
        </div>
      </div>
    </div>
    <!--钱包支付-->
    <Modal v-model="modal" width="400">
      <p slot="header">
        <span>钱包支付</span>
      </p>
      <div>
        <p>您的钱包余额为<font color="red">￥{{userPackageTb.money}}</font>,
          <span v-if="userPackageTb.money >= totalPrice ">足够支付此次订单。</span>
          <span v-if="userPackageTb.money < totalPrice">您的钱包余额不足，请充值。</span>
        </p>
        <p>请输入6位支付密码：</p>
        <i-input type="password" v-model="passwd" clearable size="large" placeholder="密码">
          <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </i-input>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="packagePay()" style="width: 30%">确定</Button>
        <Button type="Ghost" size="large" long @click="closeModel()" style="width: 30%">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Search from '@/components/Search';
import GoodsListNav from '@/components/nav/GoodsListNav';
import store from '@/vuex/store';
import { mapState } from 'vuex';
import crypto from 'crypto';
export default {
  name: 'DepositOrder',
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
      // goodsCheckList: [],
      columns: [
        {
          type: 'selection',
          width: 58,
          align: 'center'
        },
        {
          title: '图片',
          key: 'image',
          width: 100,
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: params.row.image,
                  width: 60,
                  height: 60
                }
              })
            ]);
          },
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
          title: '竞购价格',
          width: 180,
          key: 'bidprice',
          align: 'center'
        },
        {
          title: '保证金支付额',
          width: 180,
          key: 'deposit',
          align: 'center'
        }
      ],
      flag: false,
      remarks: '',
      htmls: '',
      myOrder: [],
      memberid: 0,
      record: 1, // 用于记录下单类型，会放在订单前面做标记 （提交保证金）
      totalPrice: 0,
      radio: '1',
      modal: false,
      userPackageTb: {},
      passwd: '',
      uid: ''
    };
  },
  computed: {
    ...mapState(['shoppingCart'])
  },
  methods: {
    select (selection, row) {
      console.log(selection);
      var price = 0;
      selection.forEach(item => {
        price += item.deposit;
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
      let cid = this.$route.query.cid;
      let image = this.$route.query.image;
      let cname = this.$route.query.cname;
      let nature = this.$route.query.nature;
      let bidprice = this.$route.query.bidprice;
      let deposit = this.$route.query.deposit;
      var data = [{
        cid: cid,
        cname: cname,
        image: image,
        nature: nature,
        bidprice: bidprice,
        deposit: deposit
      }];
      this.myOrder = data;
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
    getOrderInfo () {
      var orderInfo = {
        tradeNo: this.record + this.randomNumber(), // 商户订单号
        cid: this.myOrder[0].cid,
        uid: this.uid,
        subject: this.$route.query.cname, // 订单名称
        bidprice: this.myOrder[0].bidprice,
        totalPrice: this.totalPrice.toFixed(2), // 付款金额
        nature: this.myOrder[0].nature, // 商品描述
        remarks: this.remarks,
        memberid: this.memberid
      };
      return orderInfo;
    },
    tradePay () { // 竞购 01
      if (this.totalPrice === 0) {
        alert('您未选择商品');
        return;
      }
      if (this.radio === '1') {
        // 钱包支付
        this.openModal();
      } else if (this.radio === '2') {
        this.alipay();
      }
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
    packagePay () {
      if (this.userPackageTb.money < this.totalPrice) {
        this.$message.info('余额不足，不能购买');
        return;
      }
      const md5 = crypto.createHash('md5');
      md5.update(this.passwd);
      if (md5.digest('hex') === this.userPackageTb.passwd) {
        var orderInfo = this.getOrderInfo();
        this.$axios({
          url: '/changePackageMoney',
          method: 'post',
          data: orderInfo
        }).then(successResponce => {
          if (successResponce.data.code === 200) {
            this.modal = false;
            this.$message.info('支付成功');
            this.$router.push('index');
          }
        });
      } else {
        this.$message.info('密码不正确，请重新输入');
      }
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
      console.log(orderCode);
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
