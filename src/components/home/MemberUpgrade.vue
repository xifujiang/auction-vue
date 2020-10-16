<template>
  <!--升级会员-->
  <div>
    <div style="margin: 0 auto; width: 60%"><h2>您当前的会员等级为：{{myMember.rank}}</h2></div>
    <div class="upgrade">
      <Form :model="formData" label-position="left">
        <FormItem label="选择您要成为的等级" prop="rank">
          <i-select :model.sync="model10" size="large" style="width:120px" v-model="upgradeRank">
            <i-option v-for="item in rank" :key='item.index' :value="item" :label="item">{{ item }}</i-option>
          </i-select>
        </FormItem>
        <p><span>您已支付过：</span> <span class="money"><Icon type="social-yen"></Icon> {{myMember.cautionmoney}}</span></p>
        <p><span>提交订单应付总额：</span> <span class="money"><Icon type="social-yen"></Icon> {{payprice}}</span></p>
        <div class="add-submit">
          <Button type="primary"  @click="submitOrder()">确认升级</Button>
        </div>
      </Form>
    </div>

    <br><br>
    <div class="member-role">
      <div class="member-header">
        <div style="margin: 0 auto; width: 70%"><h2>会员等级制度表</h2></div>
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
  </div>
</template>

<script>
export default {
  name: 'MemberUpgrade',
  data () {
    return {
      myMember: '',
      newMemberid: 0,
      formData: [],
      member: [],
      rank: [],
      upgradeRank: [],
      model: true,
      payprice: 0,
      model10: []
    };
  },
  inject: ['reload'],
  created () {
    this.selectMemberRule();
    // this.selectMyMember();
  },
  methods: {
    selectMemberRule () { // 获取会员等级表
      let localStorage = window.localStorage;
      let loginInfo = localStorage.getItem('loginInfo');
      let memberid = (JSON.parse(loginInfo))['memberid'];
      this.$axios({
        url: 'selectMemberRule',
        method: 'get'
      }).then(successResponce => {
        if (successResponce.data.code === 200) {
          this.member = successResponce.data.data;
          this.member.forEach(item => {
            this.rank.push(item.rank);
            if (item.memberid === memberid) { // 获取当前用户的会员等级
              this.myMember = item;
            }
          });
        } else {
          this.$message.error('无法获取等级信息');
        }
      });
    },
    submitOrder () {
      this.$router.push({
        path: '/memberOrder',
        query: {
          cname: '升级会员至' + this.upgradeRank,
          nature: '升级会员',
          price: this.payprice,
          memberid: this.newMemberid
        }
      });
    }

  },
  watch: {
    upgradeRank () {
      if (this.upgradeRank.substring(1, 2) <= this.myMember.rank.substring(1, 2)) {
        alert('不能选择更低等级');
        this.payprice = 0;
        this.reload();
      } else {
        this.member.forEach(item => {
          if (item.rank === this.upgradeRank) {
            this.payprice = item.cautionmoney - this.myMember.cautionmoney;
            this.newMemberid = item.memberid;
            this.reload();
          }
        });
      }
    }
  }
};
</script>

<style scoped>
  .upgrade{
    margin: 0 auto;
    width: 60%;
    padding: 15px;
    margin-top: 15px;
    padding-left: 60px;
    border: 1px #ccc dotted;
  }
  .bond_sm_ul{
    width: 70%;
    height: auto;
    margin: 0 auto;
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
  .money {
    font-size: 26px;
    color: #f90013;
  }
</style>
