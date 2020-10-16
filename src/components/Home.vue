<template>
  <div class="container">
    <Layout class="layout">
      <Sider class="side-bar" :style="{height: 'calc(100vh - 35px)', background: '#fff', overflow: 'auto'}" ref="side" :collapsed-width="78">
        <Menu active-name="1-2" theme="light" width="auto" @on-select="onSelect">
          <div class="user-icon">
            <div class="user-img">
              <img src="static/img/head.png">
            </div>
            <p>{{userInfo.name}}</p>
          </div>
          <Submenu name="0">
            <template slot="title">
              <Icon type="address"></Icon>
              <span>会员等级</span>
            </template>
            <MenuItem name="myMember">我的会员</MenuItem>
            <MenuItem name="memberUpgrade">升级会员</MenuItem>
          </Submenu>
          <Submenu name="1">
            <template slot="title">
                <Icon type="address"></Icon>
                <span>收货地址</span>
            </template>
            <MenuItem name="myAddress">我的收货地址</MenuItem>
            <MenuItem name="addAddress">添加收货地址</MenuItem>
          </Submenu>
          <Submenu name="2">
            <template slot="title">
                <Icon type="order"></Icon>
                <span>购物订单</span>
            </template>
            <MenuItem name="myOrder">我的订单</MenuItem>
          </Submenu>
          <Submenu name="3">
            <template slot="title">
              <Icon type="up-shop"></Icon>
              <span>发布商品</span>
            </template>
            <MenuItem name="myShoppingCart">我的商品</MenuItem>
            <MenuItem name="uploadShopCart">发布商品</MenuItem>
          </Submenu>
          <Submenu name="4">
            <template slot="title">
                <Icon type="my-bid"></Icon>
                <span>竞拍</span>
            </template>
            <MenuItem name="myBidingCart">我的竞拍</MenuItem>
          </Submenu>
        </Menu>
      </Sider>
      <Layout class="layout">
        <Header :style="{background: '#fff'}">
          <h2>{{activeTitle}}</h2>
        </Header>
        <Content class="content">
          <transition mode="out-in">
            <router-view></router-view>
          </transition>
        </Content>
        <Footer class="layout-footer-center">2019 &copy; xifujiang</Footer>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import store from '@/vuex/store';
import { mapState } from 'vuex';
export default {
  name: 'Home',
  data () {
    return {
      activeTitle: '我的订单',
      bar: {
        'myMember': '我的会员',
        'memberUpgrade': '升级会员',
        'myAddress': '我的收货地址',
        'addAddress': '添加收货地址',
        'myOrder': '我的订单',
        'myShoppingCart': '我的商品',
        'uploadShopCart': '发布商品',
        'myBidingCart': '我的竞拍'
      }
    };
  },
  computed: {
    ...mapState(['userInfo', 'shoppingCart'])
  },
  methods: {
    onSelect (name) {
      this.activeTitle = this.bar[name];
      this.$router.push(`/home/${name}`);
    }
  },
  store
};
</script>

<style scoped>
.side-bar a{
  color: #232323;
}
.user-icon {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.user-icon span {
  font-size: 96px;
}
.user-img {
  margin-bottom: 15px;
  width: 96px;
  height: 96px;
  border-radius: 48px;
  overflow: hidden;
}
.user-img img{
  width: 100%;
}
.content {
  margin: 15px;
  background-color: #fff;
  padding: 15px;
}
.layout-footer-center {
  padding: 0px 15px;
  padding-bottom: 15px;
  text-align: center;
}
</style>
