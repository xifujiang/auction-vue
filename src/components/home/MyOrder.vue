<template>
  <div>
  <el-table
    :data="order"
    style="width: 100%">
    <!--竞拍订单号-->
    <el-table-column
      prop="oid"
      label="订单号"
      sortable
      width="190"
      align='center'>
    </el-table-column>
    <!--图片-->
    <el-table-column
      label="图片"
      width="100"
      align='center'>
      <template slot-scope="scope">
        <img :src="scope.row.image" min-width="60" height="60" />
      </template>
    </el-table-column>
    <!--商品名-->
    <el-table-column
      prop="cname"
      label="商品名称"
      sortable
      align='center'>
    </el-table-column>
    <!--保证金额-->
    <el-table-column
      prop="deposit"
      label="保证金额"
      width="80"
      align='center'>
    </el-table-column>
    <!--竞拍价格-->
    <el-table-column
      prop="price"
      label="竞拍价格"
      width="80"
      align='center'>
    </el-table-column>
    <!--时间-->
    <el-table-column
      prop="time"
      label="时间"
      width="160"
      align='center'>
    </el-table-column>
    <!--当前状态-->
    <el-table-column
      prop="statu"
      label="商品状态"
      width="80"
      align='center'>
    </el-table-column>
    <el-table-column label="操作" width="300" align='center'>
      <template slot-scope="scope">
        <span v-if="scope.row.statu === '待付款'">
            <el-button
              size="mini"
              @click="payOrder(scope.$index, scope.row)">付款</el-button>
        </span>
        <span v-if="scope.row.statu === '待发货'">
            <el-button
              size="mini"
              @click="openModal2(scope.$index, scope.row)">退单</el-button>
        </span>
        <span v-if="scope.row.statu === '已发货'">
           <el-button
             size="mini"
             @click="showTransport(scope.$index, scope.row)">查看物流</el-button>
          <el-button
            size="mini"
            @click="beReceipt(scope.$index, scope.row)">确认收货</el-button>
        </span>
        <!--已收货-->
        <span v-if="scope.row.statu === '已收货'">
            <el-button
              size="mini"
              @click="openModal3(scope.$index, scope.row)">评论</el-button>
        </span>
        <!--交易成功-->
        <span v-if="scope.row.statu === '交易成功'">
            订单完成
        </span>
      </template>
    </el-table-column>
  </el-table>
    <!--查看物流-->
    <Modal v-model="modal" width="800">
      <p slot="header">
        <span>查看物流</span>
      </p>
      <el-table
        :data="trans"
        border
        style="width: 100%">
        <el-table-column prop="ftime" label="日期" width="180"></el-table-column>
        <el-table-column prop="context" label="物流状态" width="300"></el-table-column>
        <el-table-column prop="location" label="位置"></el-table-column>
      </el-table>
      <div slot="footer">
        <Button type="Ghost" size="large" long @click="closeModel()" style="width: 30%">关闭</Button>
      </div>
    </Modal>
    <!--&lt;!&ndash;退单提示&ndash;&gt;-->
    <Modal v-model="modal2" width="400">
      <p slot="header">
        <span>确认取消订单</span>
      </p>
      <div>
        提示：您若确认取消，您的信用值将会减少。
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="cannalOrder()" style="width: 30%">确定</Button>
        <Button type="Ghost" size="large" long @click="closeModel2()" style="width: 30%">取消</Button>
      </div>
    </Modal>
    <!--评论-->
    <Modal v-model="modal3" width="500">
      <p slot="header">
        <span>评论订单</span>
      </p>
      <div>
        <el-form :model="ccommit">
          <el-form-item prop="cid" label=" 商 品 号:">
          <el-input type="text" v-model="ccommit.cid" :disabled="true"></el-input>
           </el-form-item>
          <el-form-item prop="buyerid" label="购买用户:">
            <el-input type="text" v-model="ccommit.buyerid" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item prop="cquality" label="商品质量：">
            <el-radio v-model="qualityradio" label="1">1星</el-radio>
            <el-radio v-model="qualityradio" label="2">2星</el-radio>
            <el-radio v-model="qualityradio" label="3">3星</el-radio>
            <el-radio v-model="qualityradio" label="4">4星</el-radio>
            <el-radio v-model="qualityradio" label="5">5星</el-radio>
          </el-form-item>
          <el-form-item prop="cspeed" label="快递速度：">
            <el-radio v-model="speedradio" label="1">1星</el-radio>
            <el-radio v-model="speedradio" label="2">2星</el-radio>
            <el-radio v-model="speedradio" label="3">3星</el-radio>
            <el-radio v-model="speedradio" label="4">4星</el-radio>
            <el-radio v-model="speedradio" label="5">5星</el-radio>
          </el-form-item>
          <el-form-item prop="cattitude" label="卖家态度：">
            <el-radio v-model="attituderadio" label="1">1星</el-radio>
            <el-radio v-model="attituderadio" label="2">2星</el-radio>
            <el-radio v-model="attituderadio" label="3">3星</el-radio>
            <el-radio v-model="attituderadio" label="4">4星</el-radio>
            <el-radio v-model="attituderadio" label="5">5星</el-radio>
          </el-form-item>
          <el-form-item prop="comment" label="评论：">
            <el-input size="textarea" v-model="ccommit.comment"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="commit()" style="width: 30%">确定</Button>
        <Button type="Ghost" size="large" long @click="closeModel3()" style="width: 30%">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'MyOrder',
  data () {
    return {
      order: [],
      uid: '',
      payprice: '',
      modal: false,
      modal2: false,
      modal3: false,
      trans: [],
      ccommit: {
        cid: '',
        buyerid: '',
        cquality: '',
        cspeed: '',
        cattitude: '',
        comment: ''
      },
      qualityradio: '0',
      speedradio: '0',
      attituderadio: '0'
    };
  },
  created () {
    this.getUid();
    this.getMyOrder();
  },
  methods: {
    getUid () {
      let localStorage = window.localStorage;
      let loginInfo = localStorage.getItem('loginInfo');
      this.uid = (JSON.parse(loginInfo))['uid'];
    },
    getMyOrder () {
      this.$axios({
        methods: 'get',
        url: 'getMyOrder',
        params: {
          uid: this.uid
        }
      }).then(successResponce => {
        if (successResponce.data.code === 200) {
          this.order = successResponce.data.data;
        }
      });
    },
    openModal() {
      this.modal = true;
    },
    closeModel(){
      this.modal = false;
    },
    openModal2(index, row) {
      this.modal2 = true;
    },
    closeModel2(){
      this.modal2 = false;
    },
    openModal3(index, row) {
      this.ccommit.buyerid = this.uid;
      this.ccommit.cid = row.cid;
      this.modal3 = true;
    },
    closeModel3(){
      this.modal3 = false;
    },
    payOrder (index, row) {
      if (row.statu === '已支付') {
        alert('您已支付订单');
        return;
      } else if (row.statu === '支付过期') {
        alert('您的订单支付已过期，信用已扣除');
        return;
      } else if (row.statu === '异常') {
        alert('订单异常，请稍后再试');
        return;
      }
      // alert(index + '   ' + row.price + '   ' + row.deposit + row.oid);
      this.payprice = row.price - row.deposit;

      this.$router.push({
        path: '/Order',
        query: {
          oid: row.oid,
          cid: row.cid,
          image: row.image,
          cname: row.cname,
          nature: '订单支付',
          price: this.payprice
        }
      });
    },
    cannalOrder(index, row) {
      this.$axios({
        method: 'get',
        url: 'buyerCannalOrder',
        params: {
          cid: row.cid,
          uid: this.uid
        }
      }).then(successResponce => {
        if(successResponce.data.code === 200) {
          this.$message.info("退单成功，您的信用值降低，当前信用值为" + successResponce.data.data+ "您的定金不允退回");
        }
      });
    },
    //查看物流
    showTransport(index, row){
      this.$axios({
        method: 'get',
        url: 'showTransport',
        params: {
          cid: row.cid
        }
      }).then(successResponce =>{
        if(successResponce.data.code === 200) {
          this.trans = JSON.parse(successResponce.data.data);
        }
      });
      this.openModal();
    },
    //确认收货
    beReceipt(index, row) {
      this.$axios({
        method: 'get',
        url: 'beReceipt',
        params: {
          cid: row.cid
        }
      }).then(successResponce => {
        if(successResponce.data.code === 200) {
          this.$message.success("收货成功");
          this.getMyOrder();
        }
      });
    },
    //评论
    commit(index, row){

      this.ccommit.cattitude = this.attituderadio;
      this.ccommit.cquality = this.qualityradio;
      this.ccommit.cspeed = this.speedradio;
      console.log(this.ccommit);
      this.$axios({
        method: 'post',
        url: 'commit',
        data: this.ccommit
      }).then(successResponce => {
        if(successResponce.data.code === 200) {
          this.$message.info("评论成功");
          this.getMyOrder();

        }
      });
      this.closeModel3();
    }
  }
};
</script>

<style scoped>
.page-size {
  margin: 15px 0px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
