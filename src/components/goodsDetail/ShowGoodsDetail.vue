<template>
  <div>
    <div class="item-intro-show">
      <div class="item-intro-recommend">
        <div class="item-recommend-title">
          <p>历史出售</p>
        </div>
        <div class="item-intro-recommend-column">
          <div class="item-recommend-column" v-for="(item, index) in goodsInfo.historyCommodityList" :key="index">
            <div class="item-recommend-img">
              <router-link :to="'/GoodsDetail?cid='.concat(item.cid)" target="_blank">
                <img :src="item.image" alt="">
              </router-link>
            </div>
            <div class="item-recommend-intro">
              <span>
                <span class="item-recommend-top-num">{{index + 1}}</span> 价格</span>
              <span class="item-recommend-price">￥{{item.price.toFixed(2)}}</span>
              <span class="item-recommend-price">￥{{item.addprice.toFixed(2)}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="item-intro-detail" ref="itemIntroDetail">
        <div class="item-intro-nav item-tabs">
          <Tabs>
            <TabPane label="竞购记录">
              <div class="remarks-title">
                <span>竞购记录</span>
                <div>
                  <el-table :data="goodsInfo.historyBiddingList" style="width: 100%">
                    <!--商品名-->
                    <el-table-column prop="uname" label="出价者" sortable width="300" align='center'></el-table-column>
                    <!--商品名-->
                    <el-table-column prop="bidtime" label="出价时间" sortable align='center'></el-table-column>
                    <!--出价者信用-->
                    <el-table-column prop="score" label="出价者信用" width="200" align='center'></el-table-column>
                    <!--出价金额-->
                    <el-table-column prop="bidprice" label="出价金额" width="200" align='center'></el-table-column>
                  </el-table>

                  <!--<i-table :columns="columns1" :data="historyBid"></i-table>-->
                </div>
              </div>
              <div class="item-param-container">
                <!--<span class="item-param-box" v-for="(item,index) in goodsInfo.param" :key="index">-->
                  <!--<span class="item-param-title">{{item.title}}: </span>-->
                  <!--<span class="item-param-content">{{item.content}}</span>-->
                <!--</span>-->
              </div>
            </TabPane>
            <TabPane label="商品介绍">
              <div class="remarks-title">
                <span>商品介绍</span>
              </div>
              <div class="item-intro-img" ref="itemIntroGoods">
                {{goodsInfo.des}}
              </div>
            </TabPane>
            <TabPane label="售后保障">
              <ShowProductWarranty></ShowProductWarranty>
            </TabPane>
            <TabPane label="商品评价">
              <div class="remarks-container">
                <div class="remarks-title">
                  <span>商品评价</span>
                </div>
                <div v-for="item in goodsInfo.sellerCommentList">
                  <el-row :gutter="20" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)">
                    <el-col :span="2">
                      <div class="commit-img" >
                        <img src="static/img/commit.jpeg">
                      </div>
                      <div class="comment-name" style="margin-top: -10px">
                        <span style="text-align: center;display: block;">{{item.name}}</span>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <span>商品名称：{{item.cname}}</span>
                      <el-divider></el-divider>
                      <span>质量：{{item.quality}}</span> &nbsp;&nbsp;
                      <span>物流速度：{{item.speed}}</span> &nbsp;&nbsp;
                      <span>卖家态度：{{item.attitude}}</span> &nbsp;&nbsp;
                      <span>评论时间：{{item.time}}</span>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ShowProductWarranty from '@/components/goodsDetail/ShowProductWarranty';
import store from '@/vuex/store';
import { mapState } from 'vuex';
export default {
  name: 'ShowGoodsDetail',
  data () {
    return {
      tagsColor: [ 'blue', 'green', 'red', 'yellow' ],
      historyCommodity: []
    };
  },
  computed: {
    ...mapState(['goodsInfo'])
  },
  created () {},
  methods: {
    changeHeight () {
      let heightCss = window.getComputedStyle(this.$refs.itemIntroGoods).height;
      heightCss = parseInt(heightCss.substr(0, heightCss.length - 2)) + 89;
      this.$refs.itemIntroDetail.style.height = heightCss + 'px';
    },
    seeNewCommodity (cid) {
      window.open('GoodsDetail?cid=' + cid, '_blank');
    }
  },
  updated () {
    this.$nextTick(() => {
      setTimeout(this.changeHeight, 100);
      setTimeout(this.changeHeight, 1000);
      setTimeout(this.changeHeight, 3000);
      setTimeout(this.changeHeight, 5000);
      setTimeout(this.changeHeight, 10000);
      setTimeout(this.changeHeight, 15000);
      setTimeout(this.changeHeight, 20000);
      setTimeout(this.changeHeight, 25000);
      setTimeout(this.changeHeight, 30000);
      setTimeout(this.changeHeight, 50000);
    });
  },
  components: {
    ShowProductWarranty
  },
  store
};
</script>

<style scoped>
/***************商品详情介绍和推荐侧边栏开始***************/
.item-intro-show{
  width: 80%;
  margin: 15px auto;
  display: flex;
  flex-direction: row;
  background-color: #fff;
}
.item-intro-recommend{
  width: 200px;
  display: flex;
  flex-direction: column;
}
.item-intro-recommend-column{
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 5px #999;
}
.item-recommend-title{
  width: 100%;
  height: 38px;
  font-size: 16px;
  line-height: 38px;
  color: #fff;
  background-color: #E4393C;
  box-shadow: 0px 0px 5px #E4393C;
  text-align: center;
}
.item-recommend-column{
  margin-top: 15px;
}
.item-recommend-intro{
  padding: 5px 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
  cursor: pointer;
}
.item-recommend-img{
  width: 80%;
  margin: 0px auto;
  cursor: pointer;
}
.item-recommend-img img{
  width: 100%;
}
.item-recommend-top-num{
  color: #fff;
  margin: 0px 2px;
  padding: 1px 5px;
  border-radius: 12px;
  background-color: #E4393C;
}
.item-recommend-price{
  color: #E4393C;
  font-weight: bolder;
}
.item-intro-detail{
  margin-left: 30px;
  width: calc(80vw - 300px);
}
.item-intro-nav{
  width: 100%;
  height: 38px;
  background-color: #F7F7F7;
  border-bottom: 1px solid #E4393C;
}
.item-intro-nav ul{
  margin: 0px;
  padding: 0px;
  list-style: none;
}
.item-intro-nav li{
  float: left;
  height: 100%;
  width: 120px;
  line-height: 38px;
  text-align: center;
  color: #E4393C;
}
.item-intro-nav li:first-child{
  background-color: #E4393C;
  color: #fff;
}
.item-intro-img{
  width: 100%;
}
.item-intro-img img{
  width: 100%;
}
/************* 商品参数 *************/
.item-param-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
}
.item-param-box {
  padding: 5px;
  padding-left: 30px;
  width: 240px;
  height: 36px;
  font-size: 14px;
  /* text-align: center; */
  /* background-color: #ccc; */
}
.item-param-title {
  color: #232323;
}
.item-param-content {
  color: #999;
}
.remarks-title {
  padding-left: 15px;
  height: 36px;
  font-size: 16px;
  font-weight: bolder;
  line-height: 36px;
  color: #666666;
  background-color: #F7F7F7;
  margin-bottom: 10px;
}
.commit-img {
  margin-bottom: 15px;
  width: 100%;
  height: 100%;
  border-radius: 48px;
  overflow: hidden;
}
.commit-img img{
  width: 100%;
}


/***************商品详情介绍和推荐侧边栏结束***************/
</style>

<style>
/* 改变便签页样式 */
.ivu-tabs-ink-bar {
  background-color: #E4393C !important;
}
.item-tabs > .ivu-tabs > .ivu-tabs-bar .ivu-tabs-tab{
  border-radius: 0px;
  color: #999;
  height: 38px;
  background: #F7F7F7;
}
.item-tabs > .ivu-tabs > .ivu-tabs-bar .ivu-tabs-tab-active{
  color: #fff;
  background-color: #E4393C;
}
.item-tabs > .ivu-tabs > .ivu-tabs-bar .ivu-tabs-tab-active:before{
  content: '';
  display: block;
  width: 100%;
  height: 1px;
  color: #fff;
  background: #F7F7F7;
  position: absolute;
  top: 0;
  left: 0;
}
.ivu-rate-star-full:before, .ivu-rate-star-half .ivu-rate-star-content:before {
  color: #E4393C;
}
</style>
