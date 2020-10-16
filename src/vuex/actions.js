// 获取秒杀数据
import axios from 'axios';

// 获取轮播(营销)图片
export const loadCarouselItems = ({ commit }) => {
  return new Promise((resolve, reject) => {
    const data = {
      carouselItems: [
        'static/img/nav/1.jpg',
        'static/img/nav/2.jpg',
        'static/img/nav/3.jpg',
        'static/img/nav/4.jpg',
        'static/img/nav/5.jpg'
      ],
      activity: [
        'static/img/nav/nav_showimg1.jpg',
        'static/img/nav/nav_showimg2.jpg'
      ]
    };
    commit('SET_CAROUSELITEMS_INFO', data);
  });
};

// 加载电脑专栏数据
export const loadHot = ({ commit }) => {
  return new Promise((resolve, reject) => {
    var bimg = new Array('static/img/index/computer/item-computer-1.jpg', 'static/img/index/computer/item-computer-2-1.jpg');
    var hot = {
      title: '热拍商品',
      link: [ '迪奥', '香奈儿', '阿玛尼', '三宅一生', '铁臂阿童木', '日本铁壶', '高达', '海贼王', '薇薇安' ],
      detail: [
        {
          bigImg: '',
          itemFour: [
            {
              cid: '',
              title: '',
              intro: '',
              img: ''
            },
            {
              cid: '',
              title: '',
              intro: '',
              img: ''
            },
            {
              cid: '',
              title: '',
              intro: '',
              img: ''
            },
            {
              cid: '',
              title: '',
              intro: '',
              img: ''
            }
          ]
        },
        {
          bigImg: '',
          itemFour: [
            {
              cid: '',
              title: '',
              intro: '',
              img: ''
            },
            {
              cid: '',
              title: '',
              intro: '',
              img: ''
            },
            {
              cid: '',
              title: '',
              intro: '',
              img: ''
            },
            {
              cid: '',
              title: '',
              intro: '',
              img: ''
            }
          ]
        }
      ]
    };
    hot.detail[0].bigImg = bimg[0];
    hot.detail[1].bigImg = bimg[1];
    axios({
      url: 'queryHotCommodity',
      method: 'get'
    }).then(successReponce => {
      if (successReponce.data.code === 200) {
        var data = successReponce.data.data;
        console.log(data);
        for (var i = 0; i < 4; i++) {
          hot.detail[0].itemFour[i].cid = data[i].cid;
          hot.detail[0].itemFour[i].title = data[i].title.substring(0, 5);
          hot.detail[0].itemFour[i].intro = data[i].intro;
          hot.detail[0].itemFour[i].img = data[i].img;
          hot.detail[1].itemFour[i].cid = data[i + 4].cid;
          hot.detail[1].itemFour[i].title = data[i + 4].title.substring(0, 5);
          hot.detail[1].itemFour[i].intro = data[i + 4].intro;
          hot.detail[1].itemFour[i].img = data[i + 4].img;
        }
        console.log(hot);
      }
    });

    commit('SET_HOT_INFO', hot);
  });
};

// 加载爱吃专栏数据
export const loadFavorite = ({ commit }) => {
  return new Promise((resolve, reject) => {
    var bimg = new Array('static/img/index/eat/item-eat-1-1.jpg', 'static/img/index/eat/item-eat-2-1.jpg');
    var favorite = {
      title: '猜你喜欢',
      link: [ 'Fate', '漫画', '动画', '机器人', '高达', '圣斗士星矢', '龙珠', '初音未来', '塑料模型', 'BLEACH', '火影忍者' ],
      detail: [
        {
          bigImg: '',
          itemFour: [
            {
              cid: '',
              title: '',
              intro: '',
              img: ''
            },
            {
              cid: '',
              title: '',
              intro: '',
              img: ''
            },
            {
              cid: '',
              title: '',
              intro: '',
              img: ''
            },
            {
              cid: '',
              title: '',
              intro: '',
              img: ''
            }
          ]
        },
        {
          bigImg: '',
          itemFour: [
            {
              cid: '',
              title: '',
              intro: '',
              img: ''
            },
            {
              cid: '',
              title: '',
              intro: '',
              img: ''
            },
            {
              cid: '',
              title: '',
              intro: '',
              img: ''
            },
            {
              cid: '',
              title: '',
              intro: '',
              img: ''
            }
          ]
        }
      ]
    };
    favorite.detail[0].bigImg = bimg[0];
    favorite.detail[1].bigImg = bimg[1];
    axios({
      url: 'queryRecommendCommodity',
      method: 'get',
      params: {
        uid: this.uid
      }
    }).then(successReponce => {
      if (successReponce.data.code === 200) {
        var data = successReponce.data.data;
        console.log(data);
        for (var i = 0; i < 4; i++) {
          favorite.detail[0].itemFour[i].cid = data[i].cid;
          favorite.detail[0].itemFour[i].title = data[i].title.substring(0, 5);
          favorite.detail[0].itemFour[i].intro = data[i].intro;
          favorite.detail[0].itemFour[i].img = data[i].img;
          favorite.detail[1].itemFour[i].cid = data[i + 4].cid;
          favorite.detail[1].itemFour[i].title = data[i + 4].title.substring(0, 5);
          favorite.detail[1].itemFour[i].intro = data[i + 4].intro;
          favorite.detail[1].itemFour[i].img = data[i + 4].img;
        }
        console.log(favorite);
      }
    });
    commit('SET_FAVORITE_INFO', favorite);
  });
};

// 请求获得商品详细信息
export const loadGoodsInfo = ({ commit }, cid) => {
  commit('SET_LOAD_STATUS', true);
  var data = {};
  axios({
    url: 'getGoodDetail',
    method: 'get',
    params: {
      cid: cid
    }
  }).then(successResponce => {
    console.log(successResponce);
    if (successResponce.data.code === 200) {
      data = successResponce.data.data;
      commit('SET_GOODS_INFO', data);
      commit('SET_LOAD_STATUS', false);
      // 设置倒计时
      var endtime = new Date(data.goodDetailResult.param2[1].content);
      const nowtime = new Date();
      var lefttime = parseInt((endtime.getTime() - nowtime.getTime()) / 1000);
      if (lefttime > 0) {
        var day = parseInt(lefttime / 3600 / 24);
        var hours = parseInt(lefttime / (60 * 60)) % 24;
        var minute = parseInt(lefttime / (60)) % 60;
        var seconds = parseInt(lefttime % 60);
        console.log([day, hours, minute, seconds]);
        // 剩余的竞购时间
        const deadline = {
          day: day,
          hours: hours,
          minute: minute,
          seconds: seconds
        };
        commit('SET_SECKILLS_INFO', [null, deadline]);
      }
    } else if (successResponce.code === 400) {
    }
  });
};

// 获取商品列表
export const loadAsItemsList = ({ commit }) => {
  commit('SET_LOAD_STATUS', true);
  var data = {
    asItems: [
      {
        image: 'static/img/goodsList/item-as-img-1.jpg',
        price: 39.9,
        intro: 'SKSK 苹果7/7plus手机壳 iPhone 7 Plus保护套全包硬',
        score: 9000
      },
      {
        image: 'static/img/goodsList/item-as-img-2.jpg',
        price: 36.6,
        intro: '狮普 苹果7/7 Plus手机壳 电镀 超薄 全包 防摔 保护外',
        score: 8900
      },
      {
        image: 'static/img/goodsList/item-as-img-1.jpg',
        price: 38.6,
        intro: 'SKSK 苹果7/7plus手机壳 iPhone 7 Plus保护套全包硬',
        score: 8800
      },
      {
        image: 'static/img/goodsList/item-as-img-2.jpg',
        price: 35.6,
        intro: '狮普 苹果7/7 Plus手机壳 电镀 超薄 全包 防摔 保护外',
        score: 7990
      },
      {
        image: 'static/img/goodsList/item-as-img-1.jpg',
        price: 38.6,
        intro: 'SKSK 苹果7/7plus手机壳 iPhone 7 Plus保护套全包硬',
        num: 9160,
        score: 7600
      },
      {
        image: 'static/img/goodsList/item-as-img-2.jpg',
        price: 35.6,
        intro: '狮普 苹果7/7 Plus手机壳 电镀 超薄 全包 防摔 保护外',
        score: 6900
      }
    ]
    // goodsList: []
  };
  commit('SET_GOODS_LIST', data);
  commit('SET_LOAD_STATUS', false);
  // axios({
  //   url: 'getGoodsList',
  //   methods: 'get',
  //   params: {
  //     ctype: ctype
  //   }
  // }).then(successResponse => {
  //   if (successResponse.data.code === 200) {
  //     data.goodsList = successResponse.data.data;

  //   } else if (successResponse.data.code === 400) {
  //     this.$Message.error('显示列表失败，原因400');
  //   }
  // });
};

// 添加购物车
export const addShoppingCart = ({ commit }, data) => {
  console.log(data);
  commit('ADD_SHOPPING_CART', data);
};

// 获取用户推荐
export const loadRecommend = ({ commit }) => {
  return new Promise((resolve, reject) => {
    const data = [
      [
        {
          img: 'static/img/otherBuy/1.jpg',
          intro: 'iPhone7/6s/8钢化膜苹果7Plus全屏全覆盖3D抗蓝',
          price: 29.00
        },
        {
          img: 'static/img/otherBuy/2.jpg',
          intro: '苹果数据线 苹果iPhoneX/6s/7plus/8充电线',
          price: 36.00
        },
        {
          img: 'static/img/otherBuy/3.jpg',
          intro: '苹果8/7/6/6s钢化膜 iphone8/7/6s/6钢化玻璃',
          price: 19.00
        },
        {
          img: 'static/img/otherBuy/4.jpg',
          intro: 'iPhone6s/7钢化膜苹果8 Plus手机膜抗蓝光非全屏',
          price: 28.00
        }
      ],
      [
        {
          img: 'static/img/otherBuy/5.jpg',
          intro: '苹果6s手机壳iPhone6s Plus保护壳防摔全',
          price: 28.00
        },
        {
          img: 'static/img/otherBuy/6.jpg',
          intro: 'iPhone7/8手机壳手机套防摔磨砂保护壳星空黑☆全包保护',
          price: 30.00
        },
        {
          img: 'static/img/otherBuy/7.jpg',
          intro: '数据线 适用于苹果iPhone 6s/6plus/7plus/8/X',
          price: 18.00
        },
        {
          img: 'static/img/otherBuy/8.jpg',
          intro: 'iPhone8/7/6S/6钢化膜 苹果8/7/6s/6玻璃膜 手机高',
          price: 15.00
        }
      ]
    ];
    commit('SET_RECOMMEND_INFO', data);
  });
};

export const loadAddress = ({ commit }) => {
  var address;
  let localStorage = window.localStorage;
  let loginInfo = localStorage.getItem('loginInfo');
  let userid = (JSON.parse(loginInfo))['uid'];
  axios({
    url: 'getAddress',
    methods: 'get',
    params: {
      userid: userid
    }
  }).then(successResponse => {
    if (successResponse.data.code === 200) {
      // this.$Message.success('显示地址成功');
      address = successResponse.data.data;
      console.log(address);
      commit('SET_USER_ADDRESS', address);
    } else if (successResponse.data.code === 400) {
      this.$Message.error('显示地址失败，原因400');
    }
  }).catch(failResponse => {
  });
};

export const loadShoppingCart = ({ commit }) => {
  return new Promise((resolve, reject) => {
    let localStorage = window.localStorage;
    let loginInfo = localStorage.getItem('loginInfo');
    let uid = (JSON.parse(loginInfo))['uid'];
    let data = [];
    axios({
      method: 'get',
      url: '/getUserCommodity',
      params: {
        uid: uid
      }
    }).then(response => {
      data = response.data.data;
      commit('SET_SHOPPING_CART', data);
      resolve(response);
    }).catch(function (error) {
      reject(error);
    });
  });
};

// 添加注册用户
export const addSignUpUser = ({ commit }, data) => {
  return new Promise((resolve, reject) => {
    const userArr = localStorage.getItem('users');
    let users = [];
    if (userArr) {
      users = JSON.parse(userArr);
    }
    users.push(data);
    localStorage.setItem('users', JSON.stringify(users));
  });
};
// 用户登录
export const login = ({ commit }, data) => {
  return new Promise((resolve, reject) => {
    axios.post('/login', data
    ).then(successResponse => {
      if (successResponse.data.code === 200) {
        localStorage.setItem('loginInfo', JSON.stringify(successResponse.data.data), 60); // 设置半天的过期时间
        commit('SET_USER_LOGIN_INFO', successResponse.data.data);
        resolve(true);
      } else if (successResponse.data.code === 400) {
        resolve(false);
      }
    }).catch(failResponse => {
    });
  });
};

// 更新用户状态
export const userUpgrade = ({ commit }) => {
  alert(111);
  let localStorage = window.localStorage;
  let loginInfo = localStorage.getItem('loginInfo');
  let uid = (JSON.parse(loginInfo))['uid'];
  this.$axios({
    method: 'post',
    url: '/userUpgrade',
    params: {
      uid: uid
    }
  }).then(successResponse => {
    if (successResponse.data.code === 200) {
      localStorage.setItem('loginInfo', JSON.stringify(successResponse.data.data));
      commit('SET_USER_LOGIN_INFO', successResponse.data.data);
    } else if (successResponse.data.code === 400) {
    }
  }).catch(failResponse => {
  });
};

// 退出登陆
export const signOut = ({ commit }) => {
  localStorage.removeItem('loginInfo');
  localStorage.removeItem('bidcount');
  commit('SET_USER_LOGIN_INFO', {});
};

// 判断是否登陆
export const isLogin = ({ commit }) => {
  const user = localStorage.getItem('loginInfo');
  if (user) {
    commit('SET_USER_LOGIN_INFO', JSON.parse(user));
  }
};
