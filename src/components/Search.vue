<template>
  <div>
      <!--<i-col span="4" offset="2" class="signup-img-box">-->
        <!--<img :src="logo" alt="" style="width: 240px; height: 60px">-->
      <!--</i-col>-->
      <!--<i-col span="10" class="box">-->
        <div class="container">
            <div>
              <i-input v-model="sreachData" size="large" class="sreach" placeholder="输入你想查找的商品">
                <Button slot="append" icon="ios-search" @click="sreach"></Button>
              </i-input>
              <Tag v-for="(item, index) in promotionTags" :key="index" closable  @on-close="closeTags(index)"><span @click="selectTags(index)">{{item}}</span></Tag>
            </div>
        </div>
      <!--</i-col>-->
  </div>
</template>

<script>
export default {
  name: 'Search',
  data () {
    return {
      logo: 'static/img/logo.png',
      sreachData: '',
      promotionTags: ['买2免1', '领200神券', '199减100', '母婴5折抢', '充100送20']
    };
  },
  methods: {
    closeTags (index) {
      this.promotionTags.splice(index, 1);
    },
    selectTags (index) {
      this.sreachData = this.promotionTags[index];
    },
    sreach () {
      this.$router.push({path: '/goodsList', query: { ctype: this.sreachData }});
    }
  }
};
</script>

<style scoped>
.container {
  padding-top: 15px;
  margin: 0px auto;
  margin-bottom: 15px;
  width: 460px;
}
.sreach {
  margin: 5px 0px;
}
</style>
