<template>
  <!--编辑拍卖物-->
  <div>
    <div class="add-container">
      <div class="add-title">
        <h1>编辑拍卖物</h1>
      </div>
      <div class="add-box">
        <Form :model="shopFormData" label-position="left" :label-width="100" :rules="rule">
          <FormItem label="拍卖物名称" prop="cname">
            <i-input v-model="shopFormData.cname" size="large"></i-input>
          </FormItem>
          <FormItem label="拍卖物图片集" prop="images"><font color="red" size="3">修改暂不支持修改图片!</font></FormItem>
          <Row :gutter="16">
            <i-col span="12">
              <FormItem label="拍卖起始价格" prop="price">
                <Input-number :max="10000" :min="0" :step="0.01" v-model="shopFormData.price"></Input-number>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="每次加价" prop="addprice">
                <Input-number :max="200" :min="0" :step="0.01" v-model="shopFormData.addprice"></Input-number>
              </FormItem>
            </i-col>
          </Row>
          <FormItem label="竞拍时间区间" prop="part_time">
            <Date-picker type="datetimerange"
                         format="yyyy-MM-dd HH:mm"
                         value-format="yyyy-MM-dd HH:mm"
                         start-placeholder="开始时间"
                         end-placeholder="结束时间"
                         style="width: 300px" size="large"
                         v-model="shopFormData.part_time"
                         @onclick="datetimerange"
            ></Date-picker>
          </FormItem>
          <FormItem label="拍卖物类型" prop="type_id">
            <i-select :model.sync="model1" size="large" style="width:120px" v-model="name_1">
              <i-option v-for="item in commodityOneList" :key='item.typeid' :value="item.name" :label="item.name">{{ item.name }}</i-option>
            </i-select>
            <i-select :model.sync="model2" size="large" style="width:120px" v-model="name_2">
              <i-option v-for="item in commodityTwoList" :key='item.typeid' :value="item.name" :label="item.name">{{ item.name }}</i-option>
            </i-select>
            <i-select :model.sync="model3" size="large" style="width:120px" v-model="name_3">
              <i-option v-for="item in commodityThreeList" :key='item.typeid' :value="item.name" :label="item.name">{{ item.name }}</i-option>
            </i-select>
          </FormItem>
          <FormItem label="品牌名称" prop="brand_name">
            <i-input v-model="shopFormData.brand_name" size="large"></i-input>
          </FormItem>
          <FormItem label="拍卖物描述" prop="desc">
            <i-input type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="请输入..." v-model="shopFormData.desc" size="large"></i-input>
          </FormItem>
        </Form>
      </div>
      <div class="add-submit">
        <Button type="primary"  @click="editCommodity()">修改拍卖物</Button>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'EditShoppingCart',
  data () {
    return {
      shopFormData: {
        cname: '',
        price: 0,
        addprice: 0,
        image: '',
        images: '',
        desc: '',
        part_time: '',
        type_id: '',
        brand_name: ''
      },
      startTime: '',
      commodityOneList: [],
      commodityTwoList: [],
      commodityThreeList: [],
      name_1: '',
      name_2: '',
      name_3: '',
      model1: '',
      model2: '',
      model3: '',
      listQuery: {},
      rule: {
        cname: [
          { required: true, message: '请输入拍卖物名', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入起始价格', trigger: 'blur' },
          { type: 'number',
            message: '请输入两位小数点数字格式',
            trigger: 'blur',
            transform (value) {
              return Number(value);
            }}
        ],
        addprice: [
          { required: true, message: '请输入一次增加的价格', trigger: 'blur' },
          { type: 'number',
            message: '请输入两位小数点数字格式',
            trigger: 'blur',
            transform (value) {
              return Number(value);
            }}
        ],
        part_time: [
          {required: true, message: '投放时间不能为空'},
          {pattern: null, type: 'array', message: null}
        ],
        desc: [
          { required: true, message: '请输入详细描述', trigger: 'blur' }
        ],
        brand_name: [
          { required: true, message: '请输入品牌名', trigger: 'blur' }
        ],
        name_1: [
          { required: true, message: '类型填写完整', trigger: 'blur' }
        ],
        name_2: [
          { required: true, message: '类型填写完整', trigger: 'blur' }
        ],
        name_3: [
          { required: true, message: '类型填写完整', trigger: 'blur' }
        ]
      },
      defaultFileList: [
        // {
        //   name: '1.jpg',
        //   percentage: 100,
        //   status: 'finished',
        //   uid: 1572693325062,
        //   url: 'static/1.jpg'
        // }
      ],
      imgName: '',
      visible: false,
      uploadList: []
    };
  },
  methods: {
    handleView (name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      this.uploadList = this.$refs.upload.fileList;
    },
    handleSuccess (res, file) {
      file.url = res.data.url;
      file.name = res.data.name;
      this.uploadList = this.$refs.upload.fileList;
      alert(file.url);
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      });
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 4M.'
      });
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 10;
      if (!check) {
        this.$Notice.warning({
          title: 'Up to five pictures can be uploaded.'
        });
      }
      return check;
    },
    editCommodity () {
      var cid = this.$route.query.cid;
      this.$axios({
        method: 'post',
        url: '/editCommodity',
        data: this.shopFormData,
        params: {
          cid: cid
        }
      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.shopFormData = [];
          this.$Message.success('修改拍卖物成功');
        }
      })
        .catch(failResponse => {
        });
    },
    getCommodityOneType () {
      this.$axios.get('/oneType')
        .then(successResponse => {
          if (successResponse.data.code === 200) {
            this.commodityOneList = successResponse.data.data;
          }
        })
        .catch(failResponse => {
        });
    },
    getOneCommodity () {
      var cid = this.$route.query.cid;
      this.$axios({
        method: 'get',
        url: '/getCommodity',
        params: {
          cid: cid
        }
      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.shopFormData = successResponse.data.data;
          var typeName = this.shopFormData.type_id.split('_');
          this.name_1 = typeName[0];
          this.name_2 = typeName[1];
          this.name_3 = typeName[2];
          console.log(this.name_1, this.name_2, this.name_3);
          var image = this.shopFormData.images.split('_');
          console.log(image);
        }
      }).catch(failResponse => {
      });
    },
    mounted () {
      this.uploadList = this.$refs.upload.fileList;
    }
  },
  created () {
    this.getOneCommodity();
    this.getCommodityOneType();
  },
  watch: {
    name_1 () {
      /* alert(typeof this.shopFormData.part_time);
        alert(this.shopFormData.part_time); */
      var name = this.name_1;
      this.name_2 = '';
      this.name_3 = '';
      this.$axios.get('selectByParentid/' + name)
        .then(successResponse => {
          if (successResponse.data.code === 200) {
            this.commodityTwoList = successResponse.data.data;
          }
        })
        .catch(failResponse => {
        });
    },
    name_2 () {
      var name = this.name_2;
      this.name_3 = '';
      this.$axios.get('selectByParentid/' + name)
        .then(successResponse => {
          if (successResponse.data.code === 200) {
            this.commodityThreeList = successResponse.data.data;
          }
        })
        .catch(failResponse => {
        });
    },
    name_3 () {
      this.shopFormData.type_id = this.name_1 + '_' + this.name_2 + '_' + this.name_3;
      /* alert(this.shopFormData.type_id); */
    }
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
  .demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
