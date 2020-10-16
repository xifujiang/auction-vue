<template>
  <div class="info-form">
    <Form ref="formValidate" :model="formValidate" :label-width="80" :rules="ruleValidate">
      <FormItem label="手机号" prop="phone">
          <i-input v-model="formValidate.phone" clearable size="large"  placeholder="请输入手机号"></i-input>
      </FormItem>
      <FormItem label="验证码" prop="checkNum">
          <i-input v-model="formValidate.checkNum" size="large"  placeholder="请输入验证码">
            <Button slot="append" @click="getcheckNum">获取验证码</Button>
          </i-input>
      </FormItem>
      <Button type="error" size="large" long @click="handleSubmit('formValidate')">验证手机号</Button>
    </Form>
  </div>
</template>

<script>
import store from '@/vuex/store';
import { mapMutations } from 'vuex';
export default {
  name: 'CheckPhone',
  data () {
    return {
      formValidate: {
        phone: '',
        checkNum: ''
      },
      ruleValidate: {
        phone: [
          {required: true, message: '手机号不能为空', trigger: 'blur'},
          {type: 'string', pattern: /^1[3|4|5|7|8][0-9]{9}$/, message: '手机号格式出错', trigger: 'blur'}
        ],
        checkNum: [
          {required: true, message: '必须填写验证码', trigger: 'blur'},
          {type: 'string', min: 4, max: 4, message: '验证码长度错误', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    ...mapMutations(['SET_SIGN_UP_SETP']),
    getcheckNum () {
      if (this.formValidate.phone.length === 11) {
        // this.$Message.success("验证码已成功发送您的手机，请查收");
        this.$axios({
          method: 'get',
          url: '/sendCode',
          params: {
            phone: this.formValidate.phone
          }
        }).then(successResponce => {
          if(successResponce.data.code === 400) {
            this.$message.error(successResponce.data.message);
          } else if (successResponce.data.code === 200) {
            this.$message.success(successResponce.data.message);
          }
        });
      } else {
        this.$Message.error({
          content: '请输入正确的手机号',
          duration: 6,
          closable: true
        });
      }
    },
    handleSubmit (name) { // 提交验证
      this.$axios({
        method: 'get',
        url: '/judgeCode',
        params: {
          phone: this.formValidate.phone,
          code:  this.formValidate.checkNum
        }
      }).then(successResponce => {
        if(successResponce.data.code === 400) {
          this.$message.error(successResponce.data.message);
        } else if (successResponce.data.code === 200) {
          this.$router.push({ path: '/SignUp/inputInfo', query: { phone: this.formValidate.phone } });
          this.SET_SIGN_UP_SETP(1);
        }
      });

      // this.$refs[name].validate((valid) => {
      //   if (valid) {
      //     this.$router.push({ path: '/SignUp/inputInfo', query: { phone: this.formValidate.phone } });
      //     this.SET_SIGN_UP_SETP(1);
      //   } else {
      //     this.$Message.error({
      //       content: '请填写正确的信息',
      //       duration: 6,
      //       closable: true
      //     });
      //   }
      // });
    },
    // // 开始定时
    // showTime () {
    //   var but = $("input[type='button']");
    //   but.attr('disabled', true);
    //   but.val('' + time-- + '秒后重新发送');
    // },
    // // 停止计时
    // stop () {
    //   clearInterval(times);
    //   var but = $("input[type='button']");
    //   but.val('获取验证码');
    //   but.attr('disabled', false);
    // }
  },
  store
};
</script>

<style scoped>
.info-form {
  width: 90% !important;
}
</style>
