import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as mutations from './mutations';
import * as getters from './getters';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false, // 是否展示loading动画
    orderBy: 'score', // 根据什么字段排序
    goodsInfo: { // 商品详情
      goodDetailResult: {
        cid: '', // id 存折里
        price: 0.00,
        addprice: 0.00,
        images: [],
        cname: '',
        typeid: [],
        seller: '',
        count: 0,
        score: 0,
        history: {},
        des: '',
        param1: [],
        param2: []
      },
      historyCommodityList: '',
      historyBiddingList: '',
      sellerCommentList: ''
    },
    time: {
      day: 0,
      hours: 0,
      minute: 0,
      seconds: 0
    },
    userInfo: { // 用户信息
      username: ''
    },
    signUpStep: 0, // 登陆步骤
    marketing: { // 营销
      CarouselItems: [], // 轮播图
      activity: [] // 活动
    },
    seckills: { // 秒杀
      deadline: {
        day: 0,
        hours: 0,
        minute: 0,
        seconds: 0
      },
      goodsList: []
    },
    hot: {}, // 热销商品
    favorite: {}, // 猜你喜欢
    asItems: [], // 广告
    goodsList: [], // 商品列表
    shoppingCart: [
      // {
      //   cid: '123',
      //   image: '1234',
      //   cname: '12345',
      //   nature: '升级会员',
      //   price: 600.00
      // }
    ], // 购物车
    address: [],
    newShoppingCart: [], // 刚加入的购物车，作为展示
    recommend: [] // 推荐购买
  },
  getters,
  actions,
  mutations
});
