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
            <Button type="error" size="large" @click="tradePay()">支付订单</Button>
          </div>
        </div>
      </div>
    </div>
    <!--钱包支付升级会员-->
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
      record: 3, // 用于记录下单类型，会放在订单前面做标记 （升级会员）
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
      let cid = this.$route.query.cid;
      let image = this.$route.query.image;
      let cname = this.$route.query.cname;
      let nature = this.$route.query.nature;
      let price = this.$route.query.price;
      var data = [{
        cid: cid,
        cname: cname,
        image: image,
        nature: nature,
        price: price
      }];
      this.myOrder = data;
      // this.totalPrice = price;
    },
    getOrderInfo () {
      var orderInfo = {
        tradeNo: this.record + '' + this.$route.query.memberid + '' + this.randomNumber(), // 商户订单号(记录号+memberid+随机号)
        uid: this.uid,
        subject: this.$route.query.cname, // 订单名称
        totalPrice: this.totalPrice.toFixed(2), // 付款金额
        nature: this.myOrder[0].nature, // 商品描述
        remarks: this.remarks,
        memberid: this.$route.query.memberid
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
    tradePay () { // 竞购 01
      if (this.totalPrice === 0) {
        alert('您未选择商品');
        return;
      }
      if (this.radio === '1') {
        this.openModal();
        // 钱包支付
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
        // console.log(md5.digest('hex'));
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
