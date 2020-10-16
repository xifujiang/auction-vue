<template>
<!--我的竞拍列表-->
  <el-table
    :data="bid"
    style="width: 100%">
    <!--竞拍订单号-->
    <el-table-column
      prop="bidid"
      label="竞拍订单号"
      sortable
      width="160"
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
    <!--竞拍价格-->
    <el-table-column
      prop="bidprice"
      label="竞拍价格"
      width="80"
      align='center'>
    </el-table-column>
    <!--当前价格-->
    <el-table-column
      prop="bidprice"
      label="当前价格"
      width="80"
      align='center'>
    </el-table-column>
    <!--竞拍次数-->
    <!--<el-table-column-->
      <!--prop="bidcount"-->
      <!--label="竞拍次数"-->
      <!--width="80"-->
      <!--align='center'>-->
    <!--</el-table-column>-->
    <!--竞拍时间-->
    <el-table-column
      prop="bidtime"
      label="竞拍时间"
      width="160"
      align='center'>
    </el-table-column>
    <!--竞拍时间-->
    <el-table-column
      prop="endtime"
      label="结束时间"
      width="160"
      align='center'>
    </el-table-column>
    <!--当前状态-->
    <el-table-column
      prop="nowstatus"
      label="商品状态"
      width="80"
      align='center'>
    </el-table-column>

    <el-table-column label="操作" width="120" align='center'>
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="showCommodity(scope.$index, scope.row)">查看商品</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'MyBidingCart',
  data () {
    return {
      bid: [],
      uid: ''
    };
  },
  created () {
    this.getUid();
    this.findMyBidding();
  },
  methods: {
    getUid () {
      let localStorage = window.localStorage;
      let loginInfo = localStorage.getItem('loginInfo');
      this.uid = (JSON.parse(loginInfo))['uid'];
    },
    findMyBidding () {
      this.$axios({
        methods: 'get',
        url: 'findMyBidding',
        params: {
          uid: this.uid
        }
      }).then(successResponce => {
        if (successResponce.data.code === 200) {
          this.bid = successResponce.data.data;
        }
      });
    },
    showCommodity: function (index, row) {
      // /GoodsDetail?cid='.concat(item.cid)
      this.$router.push("/GoodsDetail?cid="+row.cid);
    }
  }
};
</script>

<style scoped>
</style>
