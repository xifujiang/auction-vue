<template>
  <div>
    <div class="address-box" v-for="(item, index) in address" :key="index">
      <div class="address-header">
        <span>{{item.addressee}}</span>
        <div class="address-action">
          <span @click="edit(index)"><Icon type="edit"></Icon> 修改</span>
          <span @click="del(index)"><Icon type="trash-a"></Icon> 删除</span>
        </div>
      </div>
      <div class="address-content">
        <p><span class="address-content-title"> 收 货 人 :</span> {{item.addressee}}</p>
        <p><span class="address-content-title">收货地区:</span> {{item.province}} {{item.city}} {{item.part}}</p>
        <p><span class="address-content-title">收货地址:</span> {{item.detail}}</p>
        <p><span class="address-content-title">邮政编码:</span> {{item.postalcode}}</p>
      </div>
    </div>
    <Modal v-model="modal" width="530">
      <p slot="header">
        <Icon type="edit"></Icon>
        <span>修改地址</span>
      </p>
      <div>
        <Form :model="formData" label-position="left" :label-width="100" :rules="ruleInline">
          <FormItem label="收件人" prop="name">
            <i-input v-model="formData.addressee" size="large"></i-input>
          </FormItem>
          <FormItem label="收件地区" prop="address">
            <Distpicker :province="formData.province"
                        :city="formData.city"
                        :area="formData.part" @selected="sel"></Distpicker>
          </FormItem>
          <FormItem label="收件地址" prop="address">
            <i-input v-model="formData.detail" size="large"></i-input>
          </FormItem>
          <FormItem label="手机号码" prop="phone">
            <i-input v-model="formData.phone" size="large"></i-input>
          </FormItem>
          <FormItem label="邮政编码" prop="postalcode">
            <i-input v-model="formData.postalcode" size="large"></i-input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="editAction">修改</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import store from '@/vuex/store';
// import { mapState, mapActions } from 'vuex';
import Distpicker from 'v-distpicker';
export default {
  name: 'MyAddress',
  data () {
    return {
      modal: false,
      address: [],
      formData: {
        addid: '',
        addressee: '',
        detail: '',
        phone: '',
        postalcode: '',
        province: '广东省',
        city: '广州市',
        part: '白云区'
      },
      ruleInline: {
        addressee: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        detail: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        postalcode: [
          { required: true, message: '请输入邮政编码', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { type: 'string', pattern: /^1[3|4|5|7|8][0-9]{9}$/, message: '手机号格式出错', trigger: 'blur' }
        ]
      }
    };
  },
  created () {
    this.getAddress();
    // this.loadAddress();
  },
  // computed: {
  //   ...mapState(['address'])
  // },
  methods: {
    getProvince (value) {
      console.log(value);
      this.formData.province = value;
    },
    getCity (value) {
      this.formData.city = value;
    },
    getPart (value) {
      this.formData.part = value;
    },
    // ...mapActions(['loadAddress']),
    edit (index) {
      this.modal = true;
      console.log(this.address[index]);
      this.formData.addid = this.address[index].addid;
      this.formData.province = this.address[index].province;
      this.formData.city = this.address[index].city;
      this.formData.part = this.address[index].part;
      this.formData.detail = this.address[index].detail;
      this.formData.addressee = this.address[index].addressee;
      this.formData.phone = this.address[index].phone;
      this.formData.postalcode = this.address[index].postalcode;
    },
    editAction () {
      this.modal = false;
      const data = this.formData;
      this.$axios({
        url: 'editAddress',
        method: 'post',
        data: data
      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.$Message.success('修改成功');
          this.$router.go(0);
        } else if (successResponse.data.code === 400) {
          this.$Message.error('修改失败，原因400');
        }
      })
        .catch(failResponse => {
        });
    },
    sel (data) {
      this.formData.province = data.province.value;
      this.formData.city = data.city.value;
      this.formData.part = data.area.value;
    },
    del (index) {
      this.$Modal.confirm({
        title: '信息提醒',
        content: '你确定删除这个收货地址',
        onOk: () => {
          const addid = this.address[index].addid;
          this.$axios({
            url: 'delAddress',
            methods: 'get',
            params: {
              addid: addid
            }
          }).then(successResponse => {
            if (successResponse.data.code === 200) {
              this.$Message.success('删除成功');
              this.$router.go(0);
            }
          })
            .catch(failResponse => {
            });
        },
        onCancel: () => {
          this.$Message.info('取消删除');
        }
      });
    },
    getAddress: function () {
      let localStorage = window.localStorage;
      let loginInfo = localStorage.getItem('loginInfo');
      let userid = (JSON.parse(loginInfo))['uid'];
      this.$axios({
        url: 'getAddress',
        methods: 'get',
        params: {
          userid: userid
        }
      })
        .then(successResponse => {
          if (successResponse.data.code === 200) {
            // this.$Message.success('显示地址成功');
            this.address = successResponse.data.data;
          } else if (successResponse.data.code === 400) {
            this.$Message.error('显示地址失败，原因400');
          }
        })
        .catch(failResponse => {
        });
    }
  },
  components: {
    Distpicker
  },
  store
};
</script>

<style scoped>
.address-box {
  padding: 15px;
  margin: 15px;
  border-radius: 5px;
  box-shadow: 0px 0px 5px #ccc;
}
.address-header {
  height: 35px;
  display: flex;
  justify-content: space-between;
  color: #232323;
  font-size: 18px;
}
.address-content {
  font-size: 14px;
}
.address-content-title {
  color: #999;
}
.address-action span{
  margin-left: 15px;
  font-size: 14px;
  color: #2d8cf0;
  cursor: pointer;
}
</style>
