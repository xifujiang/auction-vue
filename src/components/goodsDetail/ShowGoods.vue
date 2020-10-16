<template>
  <div>
    <div class="item-detail-show">
      <div class="item-detail-left">
        <div class="item-detail-big-img">
          <img :src="goodsInfo.goodDetailResult.images[imgIndex]" alt="" width="380px" height="350px">
        </div>
        <div class="item-detail-img-row">
          <div class="item-detail-img-small" v-for="(item, index) in goodsInfo.goodDetailResult.images" :key="index" @mouseover="showBigImg(index)">
            <img :src="item" alt="" width="50px" height="50px">
          </div>
        </div>
      </div>
      <div class="item-detail-right">
        <div class="item-detail-title">
          <p>
            <span class="item-detail-express">当前拍卖</span>{{goodsInfo.goodDetailResult.cname}}</p>
        </div>
        <div class="item-detail-tag">
          <p>
            <span v-for="(item,index) in goodsInfo.goodDetailResult.typeid" :key="index">【{{item}}】</span>
          </p>
        </div>
        <div class="item-detail-price-row">
          <div class="item-price-left">
            <div class="item-price-row">
              <p>
                <span class="item-price-title">当前价格</span>
                <span style="text-decoration:line-through;">￥{{goodsInfo.goodDetailResult.price.toFixed(2)}}</span>
                <span class="item-price">￥{{goodsInfo.goodDetailResult.nowprice.toFixed(2)}}</span>
              </p>
            </div>
            <div class="item-price-row">
              <p>
                <span class="item-price-title">加价单位</span>
                <!--<span class="item-price-full-cut">{{goodsInfo.goodDetailResult.addprice}}</span>-->
                <span class="item-price-full-cut">{{goodsInfo.goodDetailResult.addprice.toFixed(2)}}</span>
              </p>
            </div>
            <div class="item-price-row">
              <p>
                <span class="item-price-title">卖&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;家</span>
                <span class="item-price-full-cut">{{goodsInfo.goodDetailResult.seller}}</span>
              </p>
            </div>
            <div class="item-price-row">
              <p>
                <span class="item-price-title">出&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;价</span>
                <span class="" style="font-size: 18px; color: red">{{goodsInfo.goodDetailResult.count}}</span>&nbsp;次
              </p>
            </div>
            <div class="item-price-row daojishi">
                <span class="item-price-title">剩&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;余</span>
                <font v-if="goodsInfo.goodDetailResult.status ===1" >
                  <font color="red" size="3">竞拍未开始！</font>
                </font>
                <font v-else-if="goodsInfo.goodDetailResult.status ===2">
                  <font color="red" size="3">竞拍已结束！</font>
                </font>
                <font v-else>
                  <Icon type="clock"></Icon>
                  <span class=" count-down-day">{{ seckillsDay }}</span>
                  <span class="count-down-point">天</span>
                  <span class=" count-down-hour">{{ seckillsHours }}</span>
                  <span class="count-down-point">时</span>
                  <span class=" count-down-minute">{{ seckillsMinutes }}</span>
                  <span class="count-down-point">分</span>
                  <span class=" count-down-seconds">{{ seckillsSeconds }}</span>
                  <span class="count-down-point">秒</span>
                </font>
            </div>
          </div>
          <div class="item-price-right">
            <div class="item-remarks-sum">
              <p>&nbsp;卖家信用</p>
              <p>
                <span class="item-remarks-num">{{goodsInfo.goodDetailResult.score}} </span>
              </p>
            </div>
          </div>
        </div>
        <div class="item-detail-commodity">
          <dl>
            <dd v-for="(item,index) in goodsInfo.goodDetailResult.param1" :key="index">{{item.title}}: {{item.content}}</dd>
          </dl>
          <dl>
            <dd v-for="(item,index) in goodsInfo.goodDetailResult.param2" :key="index">{{item.title}}: {{item.content}}</dd>
          </dl>
        </div>
        <br>
        <div class="add-buy-car-box">
          <div class="add-buy-car">
            <Button type="info" size="large" @click="favorite()"><i class="el-icon-star-off"></i> 收藏</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="error" size="large" @click="alogin()">立即参拍</Button>
          </div>
        </div>
      </div>
    </div>
    <!--出价竞拍-->
    <Modal v-model="modal1" width="400">
      <p slot="header">
        <span>出价竞拍</span>
      </p>
      <div>
        <Form :model="formData" label-position="left" :label-width="100">
          <div class="" style="height: 50px; width: 100%">
            <span class="lt" style="width:100px;">本&nbsp;&nbsp;&nbsp;品&nbsp;&nbsp;&nbsp;现&nbsp;&nbsp;&nbsp;价&nbsp;&nbsp;：</span>
            <span style="color:red">￥{{goodsInfo.goodDetailResult.nowprice.toFixed(2)}}</span>&nbsp;元（RMB）<br />
            <span class="lt" style="width:100px;">本次加价至少为：</span><span style="color:red">￥{{goodsInfo.goodDetailResult.addprice.toFixed(2)}}</span>&nbsp;元<br />
          </div>
          <FormItem label="出 价 金 额" prop="price">
            <Input-number v-model="num" @change="handleChange" :min="this.goodsInfo.goodDetailResult.addprice + this.goodsInfo.goodDetailResult.nowprice" :step="goodsInfo.goodDetailResult.addprice.toFixed(2)"></Input-number>
            &nbsp;人&nbsp;民&nbsp;币
          </FormItem>
          <FormItem label="出 价 件 数" prop="amount">
            <i-select :model.sync="model1" style="width:200px">
              <i-option>1</i-option>
            </i-select>
          </FormItem>
          <div style="padding-left: 10px;padding-right: 20px">
            <p>您为<font color="red">{{myMember.rank}}</font>，可投标
              <span v-if="myMember.amount == -1">
                <font color="red">无限</font>
              </span>
              <span v-if="myMember.amount != -1">
                <font color="red">{{myMember.amount}}</font>
              </span>
              件商品，单次投标
              <span v-if="myMember.pricepremiss == -1">
                <font color="red">不限制</font>
              </span>
              <span v-if="myMember.pricepremiss != -1">
                限制<font color="red">{{myMember.pricepremiss}}</font>RMB
              </span>
              金额，您已投标<font color="red">{{bidcount}}</font>件商品</p>
          </div>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="bidding()" style="width: 30%">确定</Button>
        <Button type="Ghost" size="large" long @click="closeModel1()" style="width: 30%">取消</Button>
      </div>
      <div class="acontents">
        <font class="red">温馨提示：</font>
        本品商家好评为<font color="red">{{goodsInfo.goodDetailResult.score}}</font>，供参考使用，出价成功后不能弃标，弃标要扣除弃标费用。
      </div>
    </Modal>
    <!--会员等级说明-->
    <Modal v-model="modal2" width="1025">
      <div slot="header">
        <div class="bond_title">
          <span>{{userInfo.name}} 普通会员</span>
        </div>
        <div class="bond_sm">
          <h3>会员等级说明</h3>
          <a href="http://www.ymi.cn/help/grade.html" target="_blank">查看详细&gt;&gt;</a>
            <span>您需要升级保证金后方可出价竞拍</span>
        </div>
      </div>
      <div>
        <ul class="bond_sm_ul">
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
      <div slot="footer">
        <Button type="Ghost" size="large" @click="closeModel2()" style="width: 20%;background-color: #FAA8C2;color: #333;">关闭</Button>
        <Button type="primary" size="large" @click="upgradeVIP()" style="width: 20%;margin-right: 3%;background-color: #F2534D;color: #333; border: none">前去升级保证金</Button>
      </div>
    </Modal>
    <!--确定竞拍-->
    <Modal v-model="modal3" width="400">
      <p slot="header">
        <span>确定竞拍</span>
      </p>
      <div>
        您当前的出价为<font color="red">￥{{num}}</font>，是否确定继续加价。
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="beSureBidding()" style="width: 30%">确定</Button>
        <Button type="Ghost" size="large" long @click="closeModel3()" style="width: 30%">取消</Button>
      </div>
      <div class="acontents">
        <font class="red">温馨提示：</font>
        本品商家好评为<font color="red">{{goodsInfo.goodDetailResult.score}}</font>，供参考使用，出价成功后不能弃标，弃标要扣除弃标费用。
      </div>
    </Modal>
    <Modal v-model="modal4" width="400">
      <p slot="header">
        <span>提示</span>
      </p>
      <div>
        你已收藏过该商品，是否取消收藏？
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="deleteFavorite()" style="width: 30%">确定</Button>
        <Button type="Ghost" size="large" long @click="closeModel4()" style="width: 30%">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import store from '@/vuex/store';
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'ShowGoods',
  created () {
    this.num = this.goodsInfo.goodDetailResult.addprice + this.goodsInfo.goodDetailResult.nowprice;
    this.selectMemberRule();
    this.getBidCount();
    this.getUid();
  },
  data () {
    return {
      formData: {
        price: '',
        amount: ''
      },
      modal1: false,
      modal2: false,
      modal3: false,
      modal4: false,
      price: 0,
      count: 1,
      selectBoxIndex: 0,
      imgIndex: 0,
      setIntervalObj: null,
      num: 1,
      uid: '',
      username: '',
      member: [],
      myMember: {},
      ruleInline: {
        num: [
          { required: true, message: '请输入出价格', trigger: 'blur' },
          { type: 'number',
            message: '请输入两位小数点数字格式',
            trigger: 'blur',
            transform (value) {
              return Number(value);
            }
          }
        ]
      },
      bidcount: 0,
      bidstatu: {}
    };
  },
  computed: {
    ...mapState(['userInfo', 'goodsInfo']),
    ...mapGetters([ 'seckillsDay', 'seckillsHours', 'seckillsMinutes', 'seckillsSeconds' ])
  },
  methods: {
    ...mapActions(['addShoppingCart', 'loadSeckillsInfo']),
    ...mapMutations(['REDUCE_SECKILLS_TIME']),
    select (index1, index2) {
      this.selectBoxIndex = index1 * 3 + index2;
      this.price = this.goodsInfo.goodDetailResult.setMeal[index1][index2].price;
    },
    getUid () {
      let localStorage = window.localStorage;
      let loginInfo = localStorage.getItem('loginInfo');
      this.uid = (JSON.parse(loginInfo))['uid'];
    },
    showBigImg (index) {
      this.imgIndex = index;
    },
    alogin () {
      // 先判断是否已经登录
      let localStorage = window.localStorage;
      this.username = localStorage.getItem('loginInfo');
      if (this.username == null) {
        // 如果未登录，跳转登录界面
        this.$Message.error('账号过期，请重新登录');
        this.$router.push('/login');
        return;
      }
      if (this.goodsInfo.goodDetailResult.status === 2) {
        this.$Message.info('该商品竞拍已结束！');
        return;
      }
      let uid = (JSON.parse(this.username))['uid'];
      let memberid = (JSON.parse(this.username))['memberid'];
      // 根据后台返回的状态判断是否能竞拍这个商品。
      // 请求后台，查看是否已竞拍过这个商品，且为当前出价最高价，如果是，则提示不能拍
      this.$axios({
        url: '/getBiddingStatus',
        method: 'post',
        params: {
          cid: this.goodsInfo.goodDetailResult.cid,
          uid: uid
        }
      }).then(successResponce => {
        if (successResponce.data.code === 200) {
          this.bidstatu.flag = successResponce.data.data;
          this.bidstatu.code = successResponce.data.message;
          if (this.bidstatu.flag === 2) {
            this.$Message.info(this.bidstatu.code);
          } else {
            // 查询我的会员
            this.member.forEach(item => {
              if (item.memberid === memberid) {
                this.myMember = item;
              }
            });
            // 如果登录，显示竞拍界面
            this.modal1 = true;
          }
        }
      });
    },
    deleteFavorite() {
      this.$axios({
        url: '/deleteFavorite',
        method: 'get',
        params: {
          uid: this.uid,
          cid: this.goodsInfo.goodDetailResult.cid
        }
      }).then(res =>{
        if(res.data.code === 200) {
          this.$Message.info("删除成功");
        }
      })
    },
    favorite() {
      //判断是否是已收藏，若不是，则收藏，否则，提示是否要取消收藏
      this.$axios({
        url: '/addFavorite',
        method: 'get',
        params: {
          uid: this.uid,
          cid: this.goodsInfo.goodDetailResult.cid
        }
      }).then(successResponce => {
        if (successResponce.data.code === 200) {
            this.$Message.info("收藏成功");
        } else {
          this.$Message.info("你已收藏过");
        }
      });
    },
    handleChange (value) {
      console.log(value);
    },
    bidding () {
      let localStorage = window.localStorage;
      let loginInfo = localStorage.getItem('loginInfo');
      let name = (JSON.parse(loginInfo))['name'];
      let memberid = (JSON.parse(loginInfo))['memberid'];
      if (name === this.goodsInfo.goodDetailResult.seller) { // 如果是自己发布的商品
        this.$Message.error('不能竞拍自己发布的商品');
        return;
      }
      if (this.num < (this.goodsInfo.goodDetailResult.addprice + this.goodsInfo.goodDetailResult.price) || isNaN(this.num)) {
        this.$Message.error('出价不符合要求');
        return;
      }
      // if() 如果商品已经过拍卖时间。
      if (memberid === 1) {
        // 根据用户uid查看是什么会员等级，如果是普通会员，则显示model2，否则，提示是什么等级，可以购买几个商品。
        this.modal1 = false;
        this.modal2 = true;
      } else {
        // 查看单次竞拍价格是否超过最高竞拍价格
        if (this.myMember.pricepremiss != -1 && this.num > this.myMember.pricepremiss) {
          this.$message.info('竞拍价格超过单次最高竞拍价格，不得竞拍');
          return;
        }
        // 查看是否有竞拍次数
        if (this.myMember.pricepremiss != -1 && this.myMember.cautionmoney <= this.bidcount) {
          this.$message.info('已无竞拍次数,不得竞拍');
          return;
        }
        // 查看是否是第一次竞拍
        if (this.bidstatu.flag === 1) {
          // 第一次竞拍该商品，支付押金。
          this.$router.push({
            path: '/DepositOrder',
            query: {
              cid: this.goodsInfo.goodDetailResult.cid,
              image: this.goodsInfo.goodDetailResult.images[this.imgIndex],
              cname: this.goodsInfo.goodDetailResult.cname,
              nature: '支付竞拍保证金',
              bidprice: this.num,
              deposit: this.goodsInfo.goodDetailResult.price + this.goodsInfo.goodDetailResult.addprice
            }
          });
        } else if (this.bidstatu.flag === 3) {
          // 不是第一次竞拍该商品，可直接竞拍。
          this.modal1 = false;
          this.modal3 = true;
        }
      }
    },
    beSureBidding () {
      let localStorage = window.localStorage;
      let loginInfo = localStorage.getItem('loginInfo');
      let uid = (JSON.parse(loginInfo))['uid'];
      var bidding = {
        bidid: this.randomNumber(),
        cid: this.goodsInfo.goodDetailResult.cid,
        uid: uid,
        bidprice: this.num
      };
      this.$axios({
        url: '/addBidding',
        method: 'post',
        data: bidding
      }).then(successResponce => {
        if (successResponce.data.code === 200) {
          this.modal3 = false;
          this.$message.info('竞价成功！请耐心等待');
        }
      });
    },
    closeModel1 () {
      this.modal1 = false;
    },
    closeModel2 () {
      this.modal2 = false;
    },
    closeModel3 () {
      this.modal3 = false;
    },
    closeModel4 () {
      this.modal4 = false;
    },
    upgradeVIP () {
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
    getBidCount () {
      let localStorage = window.localStorage;
      var count = localStorage.getItem('bidcount');
      if (count === null || !isNaN(count)) { // 如果没有取到bidcount
        let localStorage = window.localStorage;
        this.username = localStorage.getItem('loginInfo');
        let uid = (JSON.parse(this.username))['uid'];
        this.$axios({
          url: '/getUserBiddingCount',
          method: 'get',
          params: {
            uid: uid
          }
        }).then(successResponce => {
          if (successResponce.data.code === 200) {
            this.bidcount = successResponce.data.data;
            localStorage.setItem('bidcount', this.bidcount);
          }
        });
      } else {
        this.bidcount = count;
      }
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
  mounted () {
    const father = this;
    this.setIntervalObj = setInterval(function () {
      father.REDUCE_SECKILLS_TIME();
    }, 1000);
    setTimeout(() => {
      father.price = father.goodsInfo.goodDetailResult.setMeal[0][0].price || 0;
    }, 300);
  },
  destroyed () {
    clearInterval(this.setIntervalObj);
  },
  store
};
</script>

<style scoped>
/******************商品图片及购买详情开始******************/
.item-detail-show {
  width: 80%;
  margin: 15px auto;
  display: flex;
  flex-direction: row;
  background-color: #fff;
}
.item-detail-left {
  width: 350px;
  margin-right: 30px;
}
.item-detail-big-img {
  width: 350px;
  height: 350px;
  box-shadow: 0px 0px 8px #ccc;
  cursor: pointer;
}
.item-detail-big-img img {
  width: 100%;
}
.item-detail-img-row {
  margin-top: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.item-detail-img-small {
  width: 68px;
  height: 68px;
  box-shadow: 0px 0px 8px #ccc;
  cursor: pointer;
}
.item-detail-img-small img {
  width: 100%;
}
/*商品选购详情*/
.item-detail-right {
  display: flex;
  flex-direction: column;
}
.item-detail-title p {
  color: #666;
  font-size: 20px;
}
.item-detail-express {
  font-size: 14px;
  padding: 2px 3px;
  border-radius: 3px;
  background-color: #e4393c;
  color: #fff;
}
/*商品标签*/
.item-detail-tag {
  font-size: 12px;
  color: #e4393c;
}
/*价格详情等*/
.item-detail-price-row {
  padding: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #f3f3f3;
}
.item-detail-commodity{
  padding: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.item-detail-commodity dd{
  float: left;
  width: 100%;
  height: 30px;
  font-size: 14px;
  line-height: 30px;
  color: #666;
}
.aloginBox,.bloginBox,.cloginBox{position: absolute; display: block; width:400px;padding:10px;z-index: 101;background: #FFF;}
.alogin_colse,.blogin_colse,.clogin_colse{float: left;width: 100%;height:40px;line-height: 40px;background:#223066;color:#FFF;}
.alogin_colse h3,.blogin_colse h3,.clogin_colse h3{float: left;font-size: 16px;font-weight: normal;width:370px;text-indent:10px;float:left;}
.alogin_colse span,.blogin_colse span,.clogin_colse span{float: right;width:16px;height:16px;background:url(http://img.ymibuy.cn/public/close.png) no-repeat;cursor: pointer;margin:12px 10px 0 0;}
.alogin_con,.blogin_con,.clogin_con{float: left;width:320px;padding:10px 40px 20px 40px;}
.alogin_con .ausername,.blogin_con .ausername,.clogin_con .ausername{float: left;width: 100%;height:30px;line-height:30px;position: relative;margin:5px 0px;}
.alogin_con .ausername input[type="text"],.blogin_con .ausername input[type="text"],.clogin_con .ausername input[type="text"]{width:173px;height:28px;border: 1px solid #CCCCCC;line-height:28px;padding: 0px 10px;color: #191818;float: left;}
.alogin_con .ausername input[type="button"],.blogin_con .ausername input[type="button"],.clogin_con .ausername input[type="button"]{padding:10px 40px;background:#223066;color:#fff;border:none;}
.alogin_con .acontents,.blogin_con .acontents,.clogin_con .acontents{float:left;line-height:20px;color:#333;padding:10px;background:#ebebeb;margin-top:20px;}
.pricedescription{text-align: left;color: #333;font-size: 12px;font-family: 'Microsoft YaHei';height: auto;width:318px;float: left;padding:10px 0;line-height:24px;}

.acontents{
  float: left;
  line-height: 20px;
  color: #333;
  padding: 10px;
  background: #ebebeb;
  margin-top: 20px;
  margin-bottom: 10px;
}
.bond_title {
  float: left;
  height: 40px;
  line-height: 40px;
  width: 94%;
  margin: 20px 3% 0px;
  border: 1px solid #F55085;
  background-color: #FDF5EE;
  text-indent: 10px;
  font-size: 18px;
  font-weight: bold;
}
.bond_sm{
  float: left;
  width: 94%;
  height: 40px;
  line-height: 40px;
  font-size: 18px;
  margin: 10px 3% 0px;
}
.bond_sm h3{
  float: left;
  width: auto;
}
.bond_sm a {
  float: left;
  width: auto;
  margin-left: 20px;
  color: #009DDA;
  font-size: 14px;
}
.bond_sm  span {
  float: right;
  width: auto;
  padding: 0px 10px;
  background-color: #F2534D;
  font-size: 14px;
  color: #FFF;
  height: 30px;
  line-height: 30px;
  margin-top: 5px;
}
.bond_sm_ul{
  float: left;
  width: 94%;
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
.item-price-left {
  display: flex;
  flex-direction: column;
}
.item-price-title {
  color: #999999;
  font-size: 14px;
  margin-right: 15px;
}
.item-price-row {
  margin: 5px 0px;
}
.item-price {
  color: #e4393c;
  font-size: 23px;
  cursor: pointer;
}
.item-price-full-cut {
  margin-right: 5px;
  padding: 3px;
  color: #e4393c;
  font-size: 12px;
  background-color: #ffdedf;
  border: 1px dotted #e4393c;
  cursor: pointer;
}
.item-remarks-sum {
  padding-left: 8px;
  border-left: 1px solid #ccc;
}
.item-remarks-sum p {
  color: #999999;
  font-size: 12px;
  line-height: 10px;
  text-align: center;
}
.item-remarks-num {
  line-height: 18px;
  color: #005eb7;
}
.item-select {
  display: flex;
  flex-direction: row;
  margin-top: 15px;
}
.item-select-title {
  color: #999999;
  font-size: 14px;
  margin-right: 15px;
}
.item-select-column {
  display: flex;
  flex-direction: column;
}
.item-select-row {
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;
}
.item-select-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.item-select-img {
  width: 36px;
}
.item-select-box {
  padding: 5px;
  margin-right: 8px;
  background-color: #f7f7f7;
  border: 0.5px solid #ccc;
  cursor: pointer;
}
.item-select-box:hover {
  border: 0.5px solid #e3393c;
}
.item-select-box-active {
  border: 0.5px solid #e3393c;
}
.item-select-img img {
  width: 100%;
}
.item-select-intro p {
  margin: 0px;
  padding: 5px;
}
.item-select-class {
  padding: 5px;
  margin-right: 8px;
  background-color: #f7f7f7;
  border: 0.5px solid #ccc;
  cursor: pointer;
}
.item-select-class:hover {
  border: 0.5px solid #e3393c;
}
.add-buy-car-box {
  width: 100%;
  margin-top: 15px;
  border-top: 1px dotted #ccc;
}
.add-buy-car {
  margin-top: 15px;
}
.daojishi{
  width: 400px;
  height: 35px;
  line-height: 35px;
  font-size: 20px;
  color: #777;
  margin-top: 5px;
}
/******************商品图片及购买详情结束******************/
</style>
