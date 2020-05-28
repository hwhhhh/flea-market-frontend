<template>
  <el-container id="user">
    <el-header class="header" style="height:30px">
      <div class="header-wrap">
        <a href="/home">
          <span>商城首页</span>
        </a>
      </div>
    </el-header>
    <el-container class="nav">
      <div class="nav-wrap">
        <a href="/home">
          <i class="iconfont icon-B"></i>
        </a>
      </div>
    </el-container>
    <el-container class="content">
      <div class="container">
        <el-col :span="4" class="ct-left">
          <div class="img-wrap">
            <el-upload
              class="avatar-uploader"
              :action= profilePhotoAction
              :show-file-list="false"
              :on-success="handleProfilePhotoSuccess"
              :before-upload="beforeProfilePhotoUpload">
              <img v-if="user.photoUrl" :src="user.photoUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div class="img-bottom">上传头像</div>
            </el-upload>
          </div>
          <div class="menu-tab">
            <div v-for="item in menuTab" :key="item.id" :tabindex="item.id" :class="[ {'isActive':item.isActive}, 'menu-tab-item' ]" @click="toggleMenuItem(item)">{{ item.txt }}</div>
          </div>
        </el-col>
        <el-col :span="20" class="ct-right">
          <div class="right-container">
            <div class="user-info" v-show="menuTab[0].isActive">
              <div class="right-item">
                <div class="item-label">名称</div>
                <div class="item-info">{{ user.name }}</div>
              </div>
              <div class="right-item">
                <div class="item-label">简介</div>
                <div class="item-info" v-if="user.biography != null  && user.biography != ''">{{ user.biography }}</div>
                <div class="item-info" v-else>暂无</div>
              </div>
              <div class="right-item">
                <div class="item-label">账户</div>
                <div class="item-info">{{ user.email }}</div>
              </div>
              <div class="right-item">
                <div class="item-label">角色</div>
                <div class="item-info" v-if="user.role == 0">普通用户</div>
                <div class="item-info" v-else>管理员</div>
              </div>
            </div>
            <div class="history-order" v-show="menuTab[1].isActive">
              <div class="history-item" v-for="item in historyOrder" :key="item.id">
                <div class="item-top">
                  <p>订单号：{{item.id}}</p><p style="margin-left: 30px">下单时间：{{item.createdOn}}</p>
                </div>
                <div class="item-content">
                  <div class="img-wrap"><el-image :src="item.photoUrl" alt="" fit="cover"></el-image></div>
                  <div class="content-item item-name"><span>{{item.commodityName}}</span></div>
                  <div class="content-item item-num"><span>{{item.num}}</span></div>
                  <div class="content-item item-price"><span>￥{{totalPrice(item.num * item.price, 1)}}</span></div>
                  <div class="content-item item-status">
                    <span v-if="item.status === 0">等待发货</span>
                    <span v-else-if="item.status === 1">发货中</span>
                    <span v-else-if="item.status === 2">待确认</span>
                    <span v-else-if="item.status === 3">已完成订单</span>
                    <span v-else-if="item.status === -1">已取消</span>
                    <span v-else-if="item.status === -2">申请取消中</span>
                  </div>
                </div>
                <div class="item-bottom">
                  <div class="button-wrap">
                    <el-button type="primary" size="small" slot="reference" @click="confirm(item)" v-show="item.status === 1 || item.status === 2">确认收货</el-button>
                    <el-button type="danger" size="small" @click="cancelOrder(item)" v-show="item.status > -1 && item.status < 3">申请取消</el-button>
                  </div>
                </div>
              </div>
            </div>
            <div class="my-commodity" v-show="menuTab[2].isActive">
              <div v-for="item in myCommodity" :key="item.id"> {{item}} </div>
            </div>
            <div class="publish" v-show="menuTab[3].isActive">
              <div class="right-item" style="height: 195px; line-height:195px">
                <div class="item-label">图片</div>
                <div class="item-info"><el-upload
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                </div>
              </div>
              <div class="right-item">
                <div class="item-label">名称</div>
                <div class="item-info" style="width: 500px">
                  <el-input v-model="commodity.name" placeholder="请输入商品名称" maxlength="50" show-word-limit></el-input>
                </div>
              </div>
              <div class="right-item">
                <div class="item-label">描述</div>
                <div class="item-info" style="width: 500px">
                  <el-input
                    type="text"
                    placeholder="请输入商品描述"
                    v-model="commodity.description"
                    maxlength="100"
                    show-word-limit
                  >
                  </el-input>
                </div>
              </div>
              <div class="right-item">
                <div class="item-label">数量</div>
                <div class="item-info">
                  <el-input-number v-model="commodity.quantity" :min="1" :max="99" size="small"></el-input-number>
                </div>
              </div>
              <div class="right-item">
                <div class="item-label">单价</div>
                <div class="item-info" style="width:300px">
                  <el-input v-model="commodity.price" placeholder="请输入单件商品价格，单位：元"></el-input>
                </div>
              </div>
              <div class="right-item">
                <div class="item-label"></div>
                <div class="item-info">
                  <el-button type="danger" @click="publish()">发布</el-button>
                </div>
              </div>
            </div>
            <div class="pending-order" v-show="menuTab[4].isActive">
              <el-table :data="pendingOrder" stripe style="width: 100%">
                <el-table-column prop="id" label="订单号" width="70"></el-table-column>
                <el-table-column prop="createdOn" label="下单时间" width="160"></el-table-column>
                <el-table-column prop="commodityName" label="商品名称"></el-table-column>
                <el-table-column prop="num" label="商品数量"></el-table-column>
                <el-table-column prop="note" label="备注信息"></el-table-column>
                <el-table-column label="状态">
                  <div slot-scope="scope">
                    <div v-if="scope.row.status == 0">待处理</div>
                    <div v-else-if="scope.row.status == 1">发货中</div>
                    <div v-else-if="scope.row.status == 2">待确认</div>
                    <div v-else-if="scope.row.status == 3">已完成</div>
                    <div v-else-if="scope.row.status == -1">已取消</div>
                    <div v-else-if="scope.row.status == -2">申请取消</div>
                  </div>
                </el-table-column>
                <el-table-column label="处理" width="180">
                  <div slot-scope="scope">
                    <div v-if="scope.row.status == 0">
                      <el-button type="primary" size="small" @click="changeStatus(scope.row, true)">发货</el-button>
                      <el-button type="danger" size="small" @click="changeStatus(scope.row, false)">取消</el-button>
                    </div>
                    <div v-else-if="scope.row.status == 1">
                      <el-button type="primary" size="small" @click="changeStatus(scope.row, true)">已完成</el-button>
                    </div>
                    <div v-if="scope.row.status == -2">
                      <el-button type="primary" size="small" @click="changeStatus(scope.row, true)">同意</el-button>
                      <el-button type="danger" size="small" @click="changeStatus(scope.row, false)">取消</el-button>
                    </div>
                    <div v-else-if="scope.row.status == 2">
                      <el-tag>等待确认</el-tag>
                    </div>
                    <div v-else-if="scope.row.status == 3">
                      <el-tag type="success">已完成！</el-tag>
                    </div>
                    <div v-else-if="scope.row.status == -1">
                      <el-tag type="danger">已取消！</el-tag>
                    </div>
                  </div>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
      </div>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      user: { id: 0, name: '', biography: '', email: '', role: '', photoUrl: '' },
      menuTab: [
        { id: 1, txt: '我的资料', isActive: true },
        { id: 2, txt: '购买历史', isActive: false },
        { id: 3, txt: '我的商品', isActive: false },
        { id: 4, txt: '发布商品', isActive: false },
        { id: 5, txt: '订单管理', isActive: false }
      ],
      historyOrder: [],
      myCommodity: [],
      pendingOrder: [],
      commodity: {
        name: '', description: '', quantity: 1, price: '', ownerId: this.$store.state.user.id
      },
      imageUrl: '',
      imageFile: '',
      profilePhotoAction: '/apis/users/' + this.$store.state.user.id + '/images',
      socket: null
    }
  },
  mounted () {
    this.initData()
    // this.websocketLink()
  },
  methods: {
    initData () {
      this.user = this.$store.state.user
      // 获取购买历史
      this.$axios.get('/apis/buyer-orders/' + this.user.id).then(resp => {
        var data = resp.data
        if (data.code === 200) {
          this.historyOrder = data.data
        }
      }).catch(function (error) {
        console.log(error)
      })
      // 获取用户在售卖的商品
      this.$axios.get('/apis/users/' + this.user.id + '/commodities').then(resp => {
        var data = resp.data
        if (data.code === 200) {
          this.myCommodity = data.data
        }
      }).catch(function (error) {
        console.log(error)
      })

      // 获取用户已卖出的商品
      this.$axios.get('/apis/pending-orders/' + this.user.id).then(resp => {
        var data = resp.data
        if (data.code === 200) {
          this.pendingOrder = data.data
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    // websocketLink () {
    //   this.socket = new WebSocket('ws://localhost:8082/websocket/' + this.$store.state.user.id)
    //   this.socket.onopen = () => {
    //     console.log('socket 已经打开！')
    //     this.socket.send('hello!')
    //   }
    //   this.socket.onmessage = function (msg) {
    //     console.log(msg.data)
    //   }
    //   this.socket.onclose = function () {
    //     console.log('Socket已关闭')
    //   }
    // },
    changeStatus (item, isOk) {
      if (isOk) {
        this.$axios.put('/apis/pending-orders/' + item.id + '?status=' + (item.status + 1)).then(resp => {
          var data = resp.data
          if (data.code === 200) {
            item.status += 1
            this.$notify({
              title: '成功',
              message: '发货成功！请及时发货！',
              type: 'success'
            })
          }
        }).catch(function (error) {
          console.log(error)
        })
      } else {
        this.$axios.put('/apis/pending-orders/' + item.id + '?status=' + -1).then(resp => {
          var data = resp.data
          if (data.code === 200) {
            item.status = -1
            this.$notify({
              title: '取消',
              message: '已取消此订单！',
              type: 'waring'
            })
          }
        }).catch(function (error) {
          console.log(error)
        })
      }
    },
    // 切换左侧菜单
    toggleMenuItem (data) {
      this.menuTab.forEach(item => {
        item.isActive = false
      })
      data.isActive = true
    },
    // element-ui 上传图片的方法 头像的！！！！
    handleProfilePhotoSuccess (res, file) {
      this.user.photoUrl = res.data
    },
    // 上传前 头像的！！！！
    beforeProfilePhotoUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isJPG) {
        this.$message.error('上传的头像图片只能是 JPG/PNG/JPEG 格式!')
        return false
      }
      if (!isLt10M) {
        this.$message.error('上传的头像图片大小不能超过 10MB!')
        return false
      }
      // console.log(file)
      // 创建临时的路径来展示图片
      var windowURL = window.URL || window.webkitURL
      this.user.photoUrl = windowURL.createObjectURL(file)
      return true
    },

    // element-ui 上传图片的方法 商品的！！！！！
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.imageFile = file
    },
    // 上传前 商品的！！！！！
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10

      if (!isJPG) {
        this.$message.error('上传商品图片只能是 JPG/PNG/JPEG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传商品图片大小不能超过 10MB!')
        return false
      }
      // console.log(file)
      // 创建临时的路径来展示图片
      var windowURL = window.URL || window.webkitURL
      this.imageUrl = windowURL.createObjectURL(file)
      // 重新写一个表单上传的方法
      this.imageFile = new FormData()
      this.imageFile.append('file', file, file.name)
      return false
    },
    publish () {
      this.$axios.post('/apis/commodities', this.commodity).then(resp => {
        var data = resp.data
        if (data.code === 200) {
          var commodity = data.data
          const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
          this.$axios.post('/apis/commodities/' + commodity.id + '/images', this.imageFile, config).then(resp => {
            var data = resp.data
            if (data.code === 200) {
              this.$notify({
                title: '成功',
                message: '创建商品成功，请等待审核',
                type: 'success'
              })
              commodity.url = data.data
              this.myCommodity.push(commodity)
              this.commodity = []
              this.menuTab[3].isActive = false
              this.menuTab[2].isActive = true
            } else {
              this.$notify({
                title: '警告',
                message: '创建商品成功，但是图片上传失败，请等待审核',
                type: 'waring'
              })
            }
          }).catch(function (error) {
            this.$notify.error({
              title: '错误',
              message: '发布失败'
            })
            console.log(error)
          })
        }
      }).catch(function (error) {
        this.$notify.error({
          title: '错误',
          message: '发布失败'
        })
        console.log(error)
      })
    },
    confirm (item) {
      this.$axios.put('/apis/pending-orders/' + item.id + '?status=3').then(resp => {
        if (resp.status === 200) {
          var res = resp.data
          if (res.code === 200) {
            console.log(res)
            item.status = res.data
            this.$notify({
              title: '成功',
              message: '确认收货成功！',
              type: 'success'
            })
          }
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    cancelOrder (item) {
      this.$axios.put('/apis/pending-orders/' + item.id + '?status=-2').then(resp => {
        if (resp.status === 200) {
          var res = resp.data
          if (res.code === 200) {
            item.status = res.data
            this.$notify({
              title: '成功',
              message: '已申请取消！请等待',
              type: 'success'
            })
          }
        }
      }).catch(function (error) {
        console.log(error)
      })
    }
  },
  computed: {
    totalPrice: function () {
      return function (f, digit) {
        var m = Math.pow(10, digit) // 设置需要乘以的倍数
        return parseInt(f * m, 10) / m // 先乘再除，解决精度问题
      }
    }
  }
}
</script>
<style lang="scss" >
#user {
  .header {
    background: #e3e4e5;
    line-height: 30px;
    .header-wrap {
      width: 1210px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      font-size: 12px;

      a {
        color: black;
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      a:hover {
        color: #ff0036;
      }

    }
  }

  .nav{
    background: #e2231a;
    height: 80px;
    .nav-wrap {
      width: 1210px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      a {
      color: #fff;
      cursor: pointer;
      .icon-B {
        font-size: 50px;
      }
    }
    }
  }

  .content {
    background: #f5f5f5;

    .history-order {
      .history-item {
        margin-bottom: 20px;
        margin-right: 90px;
        border-bottom: #e4e3e3 solid 1px;
        .item-top {
          display: flex;
          p {
            margin: 0;
            font-size: 14px;
            color: #3c3c3c;
          }
        }
        .item-content {
          display: flex;
          margin-top: 10px;
          .img-wrap {
            img {
              height: 100px;
              width: 100px;
            }
          }
          .content-item {
            height: 100px;
            font-size: 14px;
            line-height: 100px;
            margin-left: 20px;
            color: #3c3c3c;
            span {
              display: inline-block;
              vertical-align: middle;
              line-height: 22px;
            }
          }
          .item-name {
            width: 400px;
          }
          .item-num {
            width: 50px;
            text-align: center;
          }
          .item-price {
            width: 50px;
            text-align: center;
            color: #3c3c3c;
            font-weight: bolder;
          }
        }
        .item-bottom {
          position: relative;
          height:45px;
          .button-wrap {
            position: absolute;
            line-height: 40px;
            right: 20px;
          }
        }
      }
    }

    .container {
      display: flex;
      width: 1210px;
      margin: 80px auto;
      min-height: 1000px;
      background: #fff;
      border-radius: 4px;
      .ct-left{
        height: 92%;
        margin: 40px 70px;
        border-right: 1px solid #dddddd;
        .img-wrap{
          width: 120px;
          height: 120px;
          padding:5px;
          border: 1px solid #EAEAEA;
          img {
            width: 100%;
            height: 100%;
          }

          .avatar-uploader {
            height: 100%;
          }
          .el-upload {
            width: 100%;
            height: 100%;
            line-height: 120px;
            position: relative;

            .img-bottom {
              position: absolute;
              top:0;
              left: 0;
              right: 0;
              bottom: 0;
              text-align: center;
              line-height: 130px;
              background-color: rgba($color: #000000, $alpha: .2);
              font-size: 14px;
              color: #fff;
              display: none;
            }
          }

          .el-upload:hover .img-bottom {
            display: block;
          }
        }

        .menu-tab-item {
          height: 70px;
          width: 125px;
          text-align: right;
          line-height: 70px;
          font-size: 15px;
          cursor: pointer;
        }
        .isActive {
          color: #409efe;
        }
        .menu-tab-item:hover {
          color: #409efe;
        }
        .menu-tab-item:focus {
          color: #409efe;
          outline: none;
        }
      }
      .ct-right {
        height: 92%;
        margin-top: 40px;
        .right-item {
          display: flex;
          font-size: 15px;
          height: 50px;
          .item-label {
            width: 50px;
          }
        }
        .publish {
          .right-item {
            line-height: 50px;
            margin-bottom: 20px;
          }
        }
        .avatar-uploader .el-upload {
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
          border-color: #409EFF;
        }
        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 178px;
          height: 178px;
          line-height: 178px;
          text-align: center;
        }
        .avatar {
          width: 178px;
          height: 178px;
          display: block;
        }
      }
    }
  }
}
</style>
