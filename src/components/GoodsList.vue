<template>
  <div>
    <Search></Search>
    <GoodsListNav></GoodsListNav>
    <div class="container">
      <div class="bread-crumb">
        <Breadcrumb>
          <BreadcrumbItem to="/">
            <Icon type="ios-home-outline"></Icon> 首页
          </BreadcrumbItem>
          <BreadcrumbItem to="/goodsList?sreachData=">
            <Icon type="bag"></Icon> {{searchItem}}
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <!-- 商品标签导航 -->
      <GoodsClassNav></GoodsClassNav>
      <!-- 商品展示容器 -->
      <div class="goods-box">
        <div class="as-box">
          <div class="item-as-title">
            <span>商品精选</span>
            <span>广告</span>
          </div>
          <div class="item-as" v-for="(item,index) in asItems" :key="index">
            <div class="item-as-img">
              <img :src="item.image" alt="">
            </div>
            <div class="item-as-price">
              <span>
                <Icon type="social-yen text-danger"></Icon>
                <span class="seckill-price text-danger">{{item.price}}</span>
              </span>
            </div>
            <div class="item-as-intro">
              <span>{{item.intro}}</span>
            </div>
            <div class="item-as-selled">
              卖家信用<span>{{item.score}}</span>
            </div>
          </div>
        </div>
        <div class="goods-list-box">
          <div class="goods-list-tool">
            <ul>
              <li v-for="(item,index) in goodsTool" :key="index" @click="orderBy(item.en, index)"><span :class="{ 'goods-list-tool-active': isAction[index]}">{{item.title}} <Icon :type="icon[index]"></Icon></span></li>
            </ul>
          </div>
          <div class="goods-list">
            <!--<div class="goods-show-info" v-for="(item, index) in orderGoodsList" :key="index">-->
            <div class="goods-show-info" v-for="(item, index) in goodsData" :key="index">
              <div class="goods-show-img">
                <router-link :to="'/GoodsDetail?cid='.concat(item.cid)">
                  <img :src="item.image" height="220px" width="220px"/>
                </router-link>
              </div>
              <div class="goods-show-price">
                <span>
                  当前价格&nbsp;<Icon type="social-yen text-danger"></Icon>
                  <span class="seckill-price text-danger">{{item.nowprice}}</span>
                </span>
              </div>
              <div class="goods-show-price">
                <span>
                  每次加价&nbsp;<Icon type="social-yen text-danger"></Icon>
                  <span class="seckill-price text-danger">{{item.addprice}}</span>
                </span>
              </div>
              <div class="goods-show-statu">
                 <span v-if="item.statu === '待付款' || item.statu === '已发货' || item.statu === '已收货'">
                  商品状态：<span class=" ">交易中</span>
                </span>
                <span v-else>
                  商品状态：<span class=" ">{{item.statu}}</span>
                </span>
              </div>
              <div class="goods-show-detail">
                <span>{{item.intro}}</span>
              </div>
              <div class="goods-show-num">
                卖家信用&nbsp;<span>{{item.score}}</span>
              </div>
              <div class="goods-show-seller">
                <span>{{item.userName}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="goods-page">
        <Page :total="dataCount" :page-size="pageSize" show-total @on-change="changepage" @on-page-size-change="changepagesize"></Page>
      </div>
    </div>
    <Spin size="large" fix v-if="isLoading"></Spin>
  </div>
</template>

<script>
import Search from '@/components/Search';
import GoodsListNav from '@/components/nav/GoodsListNav';
import GoodsClassNav from '@/components/nav/GoodsClassNav';
import store from '@/vuex/store';
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
export default {
  name: 'GoodsList',
  beforeRouteEnter (to, from, next) {
    window.scrollTo(0, 0);
    next();
  },
  data () {
    return {
      searchItem: '',
      isAction: [ true, false, false ],
      icon: [ 'arrow-up-a', 'arrow-down-a', 'arrow-down-a' ],
      goodsTool: [
        {title: '价格', en: 'price'},
        {title: '卖家信用', en: 'score'}
      ],
      ajaxHistoryData:[],
      // 初始化信息总条数
      dataCount:0,
      // 每页显示多少条
      pageSize:15,
      goodsData:[],
      orderGoodsList:[]
    };
  },
  computed: {
    ...mapState(['asItems', 'isLoading']),
    // ...mapGetters(['orderGoodsList'])
  },
  methods: {
    ...mapActions(['loadAsItemsList']),
    ...mapMutations(['SET_GOODS_ORDER_BY']),
    orderBy (data, index) {
      this.icon = [ 'arrow-down-a', 'arrow-down-a', 'arrow-down-a' ];
      this.isAction = [ false, false, false ];
      this.isAction[index] = true;
      this.icon[index] = 'arrow-up-a';
      this.SET_GOODS_ORDER_BY(data);
    },
    handleListApproveHistory(){
      // 保存取到的所有数据
      console.log("1111"+this.orderGoodsList);
      this.ajaxHistoryData = this.orderGoodsList;
      this.dataCount = this.orderGoodsList.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if(this.orderGoodsList.length < this.pageSize){
        this.goodsData = this.ajaxHistoryData;
      }else{
        this.goodsData = this.ajaxHistoryData.slice(0,this.pageSize);
      }
    },
    changepage(index){
      var _start = ( index - 1 ) * this.pageSize;
      var _end = index * this.pageSize;
      this.goodsData = this.ajaxHistoryData.slice(_start,_end);
    },
    changepagesize(pageSize){
      this.pageSize = pageSize;
      this.handleListApproveHistory()
    },
    loadGoodsList(ctype) {
      this.$axios({
        url: 'getGoodsList',
        methods: 'get',
        params: {
          ctype: ctype
        }
      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.orderGoodsList = successResponse.data.data;
          console.log("2222"+this.orderGoodsList);
        } else if (successResponse.data.code === 400) {
          this.$Message.error('显示列表失败，原因400');
        }
      }).then(
        val => {
          this.handleListApproveHistory();
          return Promise.resolve(/* 这里是需要返回的数据*/);
        });
    }
  },
  created () {
    this.loadAsItemsList();

  },
  mounted () {
    this.searchItem = this.$route.query.sreachData;
    this.loadGoodsList(this.$route.query.ctype);

  },
  components: {
    Search,
    GoodsListNav,
    GoodsClassNav
  },
  store
};
</script>

<style scoped>
.container {
  margin: 15px auto;
  width: 93%;
  min-width: 1000px;
}
.text-danger {
  color: #A94442;
}
.seckill-price{
  margin-right: 5px;
  font-size: 25px;
  font-weight: bold;
}
.goods-box {
  display: flex;
}
/* ---------------侧边广告栏开始------------------- */
.as-box {
  width: 200px;
  border: 1px solid #ccc;
}
.item-as-title{
  width: 100%;
  height: 36px;
  color: #B1191A;
  line-height: 36px;
  font-size: 18px;
}
.item-as-title span:first-child{
  margin-left: 20px;
}
.item-as-title span:last-child{
  float: right;
  margin-right: 15px;
  font-size: 10px;
  color: #ccc;
}
.item-as{
  width: 160px;
  margin: 18px auto;
}
.item-as-img{
  width: 160px;
  height: 160px;
  margin: 0px auto;
}
.item-as-price span{
  font-size: 18px;
}
.item-as-intro{
  margin-top: 5px;
  font-size: 12px;
}
.item-as-selled{
  margin-top: 5px;
  font-size: 12px;
}
.item-as-selled span{
  color: #005AA0;
}
/* ---------------侧边广告栏结束------------------- */

/* ---------------商品栏开始------------------- */
.goods-list-box {
  margin-left: 15px;
  width: calc(100% - 215px);
}
.goods-list-tool{
  width: 100%;
  height: 38px;
  border: 1px solid #ccc;
  background-color: #F1F1F1;
}
.goods-list-tool ul{
  padding-left: 15px;
  list-style: none;
}
.goods-list-tool li{
  cursor: pointer;
  float: left;
}
.goods-list-tool span{
  padding: 5px 8px;
  border: 1px solid #ccc;
  border-left: none;
  line-height: 36px;
  background-color: #fff;
}
.goods-list-tool span:hover{
  border: 1px solid #E4393C;
}
.goods-list-tool i:hover{
  color: #E4393C;
}
.goods-list-tool-active {
  color: #fff;
  border-left: 1px solid #ccc;
  background-color: #E4393C !important;
}

.goods-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.goods-show-info{
  width: 240px;
  padding: 10px;
  margin: 15px 0px;
  border: 1px solid #fff;
  cursor: pointer;
}
.goods-show-info:hover{
  border: 1px solid #ccc;
  box-shadow: 0px 0px 15px #ccc;
}
.goods-show-price{
  margin-top: 6px;
}
.goods-show-detail{
  font-size: 12px;
  margin: 6px 0px;
}
.goods-show-num{
  font-size: 12px;
  margin-bottom: 6px;
  color: #009688;
}
.goods-show-num span{
  color: #005AA0;
  font-weight: bold;
}
.goods-show-seller{
  font-size: 12px;
  color:#E4393C;
}
.goods-page {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
/* ---------------商品栏结束------------------- */
</style>
