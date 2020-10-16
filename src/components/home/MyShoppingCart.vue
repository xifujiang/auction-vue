<template>
  <div>
  <el-table :data="tableData" style="width: 100%">
    <!--拍卖物标题-->
    <el-table-column prop="cname" label="拍卖物标题" sortable width="250" align='center'></el-table-column>
    <!--图片-->
    <el-table-column label="图片" width="80" align='center'>
      <template slot-scope="scope">
        <img :src="scope.row.image" min-width="60" height="60" />
      </template>
    </el-table-column>
    <!--价格-->
    <el-table-column prop="price" label="初始价格" width="78" align='center'>
    </el-table-column>
    <!--每次加价-->
    <el-table-column prop="addprice" label="每次加价" width="78" align='center'>
    </el-table-column>
    <!--当前价格-->
    <el-table-column prop="nowprice" label="当前价格" width="78" align='center'>
    </el-table-column>
    <el-table-column label="开始时间" width="110" align='center'>
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.beginTime }}</span>
      </template>
    </el-table-column>
    <el-table-column label="结束时间" width="110" align='center'>
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.endTime }}</span>
      </template>
    </el-table-column>
    <!--类型-->
    <el-table-column prop="typeId" label="类型" width="150" align='center'>
    </el-table-column>
    <!--当前状态-->
    <el-table-column prop="statu" label="当前状态" width="80" align='center'>
    </el-table-column>
    <!--操作-->
    <el-table-column label="操作" width="250" align='center'>
      <template slot-scope="scope">
        <!--0 1-->
        <span v-if="scope.row.statu === '展示阶段' || scope.row.statu === '开拍'">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              @click="handleTakeOff(scope.$index, scope.row)">下架</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </span>
        <!--2-->
        <span v-if="scope.row.statu === '在拍'">
            商品锁定，已有用户开拍
        </span>
        <!--3-->
        <span v-if="scope.row.statu === '待付款'">
            等待买家付款
        </span>
        <!--4-->
        <span v-if="scope.row.statu === '待发货'">
            <el-button
              size="mini"
              @click="openModel(scope.$index, scope.row)">发货</el-button>
          <el-button
            size="mini"
            @click="openModel2(scope.$index, scope.row)">取消订单</el-button>
        </span>
        <!--5-->
        <span v-if="scope.row.statu === '已发货'">
            等待买家收货
        </span>
        <!--6-->
        <span v-if="scope.row.statu === '已收货'">
            买家已收货
        </span>
        <!-- 7-->
        <span v-if="scope.row.statu === '交易成功'">
            买家已评论
        </span>
        <!--8 10-->
        <span v-if="scope.row.statu === '下架' || scope.row.statu === '流拍'">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            @click="handleTakeOn(scope.$index, scope.row)">重新上架</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </span>
      </template>
    </el-table-column>
  </el-table>
    <Modal v-model="modal" width="400">
      <p slot="header">
        <span>商品发货</span>
      </p>
      <div>
        <el-form :model="transInfo" :inline="true">
          <el-form-item prop="cid" label=" 商 品 号:">
            <el-input type="text" v-model="transInfo.cid" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item prop="uid" label="购买用户">
            <el-input type="text" v-model="transInfo.uid" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item prop="logisticstype" label="快递类型">
            <el-input size="text" v-model="transInfo.logisticstype"></el-input>
          </el-form-item>
          <el-form-item prop="logisticsid" label="物  流  号:">
            <el-input size="text" v-model="transInfo.logisticsid"></el-input>
          </el-form-item>
          <el-form-item prop="info" label=" 备      注:">
            <el-input size="text" v-model="transInfo.info"></el-input>
          </el-form-item>
            <div>
              地址：{{transInfo.addDetail}}
            </div>
        </el-form>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="transport()" style="width: 30%">确定</Button>
        <Button type="Ghost" size="large" long @click="closeModel()" style="width: 30%">取消</Button>
      </div>
    </Modal>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [{
        image: '',
        cname: '',
        price: '',
        addprice: '',
        bidprice: '',
        beginTime: '',
        endTime: '',
        typeId: '',
        statu: '',
        brandName: '',
      }],
      modal: false,
      modal2: false,
      transInfo:{
        cid: '',
        logisticstype: '',
        logisticsid: '',
        info: '',
        uid: '',
        addid: '',
        addDetail: ''
      },
      uid: ''
    };
  },
  methods: {
    getUid () {
      let localStorage = window.localStorage;
      let loginInfo = localStorage.getItem('loginInfo');
      this.uid = (JSON.parse(loginInfo))['uid'];
    },
    closeModel() {
      this.modal = false;
    },
    closeModel2() {
      this.modal2 = false;
    },
    openModel(index, row) {
      this.transInfo.cid = row.cid;
      // this.transInfo.logisticstype = row.oid; //加载物流公司
      this.transInfo.uid = this.uid;
      // this.transInfo.addid = ; //加载地址
      this.$axios({
        methods: 'get',
        url: '/selectOrderAddress',
        params: {
          cid: row.cid,
          uid: this.uid
        }
      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          var addData = successResponse.data.data;
          this.transInfo.oid = addData.oid;
          this.transInfo.addid = addData.addressid;
          this.transInfo.addDetail = addData.addressee + ' ' + addData.phone + ' ' + addData.province
            + ' ' + addData.city + ' ' + addData.part + ' ' + addData.detail;
        }
      });
      this.modal=true;
    },
    openModel2(index, row) {
      this.modal2 = true;
    },
    //编辑
    handleEdit (index, row) {
      console.log(index, row);
      console.log(row.cid);
      this.$router.push({
        path: 'editShoppingCart',
        query: {
          cid: row.cid
        }
      });
    },
    //下架
    handleTakeOff(index, row) {
      this.$axios({
          method: 'get',
          url: '/takeOffCommodity',
          params: {
            cid: row.cid
          }
      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.$message.info('下架成功');
          this.$router.go(0);
        }
      });
    },
    //删除
    handleDelete (index, row) {
      console.log(index, row);
      this.$axios({
        method: 'get',
        url: '/delCommodity',
        params: {
          cid: row.cid
        }
      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.$message.info('删除成功');
          this.$router.go(0);
        }
      });
    },
    //重新上架
    handleTakeOn(index, row) {
      this.$axios({
        method: 'get',
        url: '/takeOnCommodity',
        params: {
          cid: row.cid
        }
      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.$message.info('上架成功');
          this.$router.go(0);
        }
      });
    },
    //发货
    transport() {
      this.$axios({
        methods: 'get',
        url: '/transportCommodity',
        params:{
          logisticsid: this.transInfo.logisticsid,
          logisticstype: this.transInfo.logisticstype,
          cid: this.transInfo.cid,
          oid: this.transInfo.oid,
          addid: this.transInfo.addid,
          info: this.transInfo.info
        }
      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.$message.info('发货成功');
          this.$router.go(0);
        }
      });
    },
    //商家取消订单，信用减少
    cannalOrder(index, row) {
      this.$axios({
        method: 'get',
        url: '/sellerCannalOrder',
        params: {
          cid: row.cid,
          uid: this.uid
        }
      }).then(successResponse => {
        if(successResponse.data.code === 200) {
          this.$message.info('取消订单成功，您已减少5的信用额度，当前信用为'+successResponse.data.data);
          this.$router.go(0);
        }
      })
    },
    //获取当前用户的商品
    getUserCommodity () {
      this.$axios({
        method: 'get',
        url: '/getUserCommodity',
        params: {
          uid: this.uid
        }
      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.tableData = successResponse.data.data;
          console.log(this.tableData[0].image);
        }
      });
    }
  },

  created () {
    this.getUid();
    this.getUserCommodity();
  }
};
</script>
