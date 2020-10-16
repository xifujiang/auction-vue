<template>
  <!--我的会员等级-->
  <div>
    <br>
    <Row class="base-info">
      <Col span="3" offset="3">
        <div class="user-img">
          <img src="static/img/head.png" >
        </div>
      </Col>
      <Col span="4">
        <div class="user-info" style="float:left;">
          <p>昵&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称：{{user.uname}}</p>
          <p>年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;龄：{{user.age}}</p>
          <p>手&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机：{{user.phone}}</p>
          <p>邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱：{{user.mail}}</p>
        </div>
      </Col>
      <Col span="4">
        <p>会员等级：{{user.rank}} <router-link :to="{path:'/home/memberUpgrade'}">升级会员</router-link></p>
        <p>信&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;用：{{user.score}}</p>
        <p>钱包余额：¥{{user.money}}&nbsp;&nbsp;<Button @click="openModal()" type="info">充值钱包</Button></p>
      </Col>
    </Row>
    <br><br>
    <div class="member-role">
      <div class="member-header">
        <div style="padding-left: 30px"><h2>会员等级制度表</h2></div>
      </div>
        <ul class="bond_sm_ul" >
          <li>
            <span>会员等级</span>
            <span v-for="item in member" :key="item.index">
              {{item.rank}}
            </span>
          </li>
          <li>
            <span>保证金</span>
            <span v-for="item in member" :key="item.index">
              {{item.cautionmoney}}RMB
            </span>
          </li>
          <li>
            <span>可投标件数</span>
            <span v-for="item in member" :key="item.index">
              <span v-if="item.amount === -1">
                无限制
              </span>
              <span v-else>
                {{item.amount}}件
              </span>
            </span>
          </li>
          <li>
            <span>单次金额限制</span>
            <span v-for="item in member" :key="item.index">
              <span v-if="item.pricepremiss === -1">
                无限制
              </span>
              <span v-else>
                {{item.pricepremiss}}RMB
              </span>
            </span>
          </li>
          <li>
            <span>出价账号</span>
            <span v-for="item in member" :key="item.index">
              {{item.premiss}}
            </span>
          </li>
        </ul>
    </div>
    <!--充值钱包-->
    <Modal v-model="modal" width="400">
      <p slot="header">
        <span>充值钱包</span>
      </p>
      <div>
        您的钱包余额为<font color="red">￥{{user.money}}</font>
        <br/><br>
        <Form :model="addmoeny" label-position="left" :label-width="100">
          <FormItem label="输入充值金额" prop="price">
            <Input-number :max="10000" :min="0" :step="0.01" v-model="price"></Input-number>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="addMoney()" style="width: 30%">确定</Button>
        <Button type="Ghost" size="large" long @click="closeModel()" style="width: 30%">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'MyMember',
  data () {
    return {
      uid: '',
      user: {},
      member: [],
      modal: false,
      addmoeny: {},
      price: 0
    };
  },
  computed: {
    ...mapState(['userInfo', 'shoppingCart'])
  },
  created () {
    this.getUid();
    this.getUserDetail();
    this.selectMemberRule();
  },
  methods: {
    getUid () {
      let localStorage = window.localStorage;
      let loginInfo = localStorage.getItem('loginInfo');
      this.uid = (JSON.parse(loginInfo))['uid'];
    },
    getUserDetail () {
      this.$axios({
        url: 'getUserDetail',
        method: 'get',
        params: {
          uid: this.uid
        }
      }).then(successResponce => {
        if (successResponce.data.code === 200) {
          this.user = successResponce.data.data;
        }
      });
    },
    selectMemberRule () { // 获取会员等级表
      this.$axios({
        url: 'selectMemberRule',
        method: 'get'
      }).then(successResponce => {
        if (successResponce.data.code === 200) {
          this.member = successResponce.data.data;
        } else {
          this.$message.error('无法获取等级信息');
        }
      });
    },
    addMoney () {
      this.$router.push({
        path: '/AddMoneyOrder',
        query: {
          cname: this.user.uname + '充值钱包',
          nature: '充值钱包',
          price: this.price
        }
      });
    },
    openModal () {
      this.modal = true;
    },
    closeModel () {
      this.modal = false;
    }
  }
};
</script>

<style scoped>
  .base-info {
    margin-top: 15px;
    padding: 15px;
    border: 1px #ccc dotted;
  }
  .base-info p {
    font-size: 14px;
    margin-bottom: 8px;
  }
  .user-icon span {
    font-size: 96px;
  }
  .user-img {
    margin-bottom: 15px;
    width: 96px;
    height: 96px;
    border-radius: 48px;
    float: left;
    overflow: hidden;
  }
  .user-img img{
    width: 100%;
  }
  .user-info {
    float: left;
  }
  .bond_sm_ul{
    float: left;
    width: 76%;
    height: auto;
    margin: 0 3%;
    margin-bottom: 10px;
  }
   ul, li {
    list-style: none;
  }
  .bond_sm_ul li:first-child {
    background-color: #5F21D9;
    color: #FFF;
    height: 40px;
    line-height: 40px;
  }
  .bond_sm_ul li {
    float: left;
    width: 100%;
    height: 40px;
    background-color: #FAA8C2;
    line-height: 40px;
    text-align: center;
    border-left: 1px solid #F5588A;
  }
  .bond_sm_ul li span {
    float: left;
    width: 155px;
    border-bottom: 1px solid #F5588A;
    border-right: 1px solid #F5588A;
    height: 39px;
  }

</style>
