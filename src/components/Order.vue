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
       <div class="address-container">
        <h3>收货人信息</h3>
        <div class="address-box">
          <div class="address-check">
            <div class="address-check-name">
              <span><Icon type="ios-checkmark-outline"></Icon> {{checkAddress.name}}</span>
            </div>
            <div class="address-detail">
              <p>{{checkAddress.address}}</p>
            </div>
          </div>
          <Collapse>
            <Panel>
                选择地址 &nbsp;&nbsp;&nbsp;<router-link :to="{path:'/home/AddAddress'}" target="_blank">点击添加地址</router-link>
                <p slot="content">
                  <RadioGroup vertical size="large" @on-change="changeAddress">
                    <Radio :label="item.addid" v-for="(item, index) in address" :key="index">
                      <span>{{item.addressee}} {{item.province}} {{item.city}} {{item.part}} {{item.detail}} {{item.phone}} {{item.postalcode}}</span>
                    </Radio>
                  </RadioGroup>
                </p>
            </Panel>
          </Collapse>
        </div>
      </div>
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
import { mapState, mapActions } from 'vuex';
import crypto from 'crypto';

export default {
  name: 'Order',
  beforeRouteEnter (to, from, next) {
    window.scrollTo(0, 0);
    next();
  },
  created () {
    this.getUid();
    this.loadAddress();
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
          title: '价格',
          width: 180,
          key: 'price',
          align: 'center'
        }
      ],
      checkAddress: {
        name: '未选择',
        address: '请选择地址'
      },
      remarks: '',
      htmls: '',
      myOrder: [],
      addressStruts: 0,
      addressid: '',
      memberid: 0,
      record: 2, // 用于记录下单类型，会放在订单前面做标记 （下单支付）
      totalPrice: 0,
      radio: '1',
      modal: false,
      uid: '',
      userPackageTb: ''
    };
  },
  computed: {
    ...mapState(['address', 'shoppingCart'])
  },
  methods: {
    ...mapActions(['loadAddress']),
    select (selection, row) {
      console.log(selection);
      var price = 0;
      selection.forEach(item => {
        price += item.price;
      })
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
    changeAddress (data) {
      const father = this;
      this.address.forEach(item => {
        if (item.addid === data) {
          father.checkAddress.name = item.name;
          father.checkAddress.address = `${item.addressee} ${item.province} ${item.city} ${item.part} ${item.detail} ${item.phone} ${item.postalcode}`;
          this.addressid = item.addid;
        }
      });
      this.addressStruts = 1;
    },
    getOrderInfo () {
      var orderInfo = {
        tradeNo: this.$route.query.oid, // 商户订单号
        cid: this.myOrder[0].cid,
        uid: this.uid,
        subject: this.$route.query.cname, // 订单名称
        totalPrice: this.totalPrice.toFixed(2), // 付款金额
        nature: this.myOrder[0].nature, // 商品描述
        remarks: this.remarks,
        addressid: this.addressid
      };
      return orderInfo;
    },
    tradePay () { // 竞购 01
      if (this.totalPrice === 0) {
        alert('您未选择商品');
        return;
      }
      if (this.addressStruts === 0) {
        alert('您未选择地址,请选择地址');
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
.address-container {
  margin-top: 15px;
}
.address-box {
  margin-top: 15px;
  padding: 15px;
  border: 1px #ccc dotted;
}
.address-check {
  margin: 15px 0px;
  height: 36px;
  display: flex;
  align-items: center;
}
.address-check-name {
  width: 120px;
  display: flex;
  justify-content: center;
  align-content: center;
  background-color: #ccc;
}
.address-check-name span {
  width: 120px;
  height: 36px;
  font-size: 14px;
  line-height: 36px;
  text-align: center;
  color: #fff;
  background-color: #f90013;
}
.address-detail {
  padding-left: 15px;
  font-size: 14px;
  color: #999999;
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
