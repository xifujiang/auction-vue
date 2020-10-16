<template>
  <div>
    <div class="add-container">
      <div class="add-title">
        <h1>添加收货地址</h1>
      </div>
      <div class="add-box">
        <Form :model="formData" label-position="left" :label-width="100" :rules="ruleInline">
          <FormItem label="收件人" prop="name">
            <i-input v-model="formData.addressee" size="large"></i-input>
          </FormItem>
          <FormItem label="收件地区" prop="address">
            <Distpicker @selected="sel"></Distpicker>
          </FormItem>
          <FormItem label="收件地址" prop="detail">
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
      <div class="add-submit">
        <Button type="primary" @click="addAddress()">添加地址</Button>
      </div>
    </div>
  </div>
</template>

<script>
import Distpicker from 'v-distpicker';
export default {
  name: 'AddAddress',
  data () {
    return {
      formData: {
        addressee: '',
        detail: '',
        phone: '',
        postalcode: '',
        province: '广东省',
        city: '广州市',
        part: '天河区'
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
  methods: {
    getProvince (data) {
      this.formData.province = data;
    },
    getCity (data) {
      this.formData.city = data;
    },
    getPart (data) {
      this.formData.part = data;
    },
    addAddress () {
      const address = {
        addressee: this.formData.addressee,
        province: this.formData.province,
        city: this.formData.city,
        part: this.formData.part,
        detail: this.formData.detail,
        phone: this.formData.phone,
        postalcode: this.formData.postalcode
      };
      let localStorage = window.localStorage;
      let loginInfo = localStorage.getItem('loginInfo');
      let uid = (JSON.parse(loginInfo))['uid'];
      this.$axios({
        url: '/addAddress',
        method: 'post',
        params: {
          userid: uid
        },
        data: address
      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.$Message.success('添加地址成功');
          this.$router.push({ path: '/home/addAddress' });
        } else if (successResponse.data.code === 400) {
          this.$Message.error('添加地址失败，原因400');
        }
      })
        .catch(failResponse => {
        });
    },
    sel (data) {
      this.formData.province = data.province.value;
      this.formData.city = data.city.value;
      this.formData.part = data.area.value;
    }
  },
  components: {
    Distpicker
  }
};
</script>

<style scoped>
.add-container {
  margin: 15px auto;
  width: 60%;
  min-width: 600px;
}
.add-title {
  margin-bottom: 15px;
  text-align: center;
}
.add-submit {
  display: flex;
  justify-content: center;
}
</style>
