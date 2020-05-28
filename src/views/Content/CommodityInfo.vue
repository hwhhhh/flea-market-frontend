<template>
    <div id="commodity">
        <Nav></Nav>
        <div class="content">
            <div class="detail">
                <div class="detail-left">
                    <span><img :src="data.photoUrl" alt=""></span>
                </div>
                <div class="detail-right">
                    <div class="rt-item rt-title"><h1>{{data.name}}</h1></div>
                    <div class="rt-item rt-description">
                        <div class="rt-tag">描述</div>
                        <p>{{data.description}}</p>
                    </div>
                    <div class="rt-item rt-price">
                        <div class="rt-tag">价格</div>
                        <p>￥{{data.price}}</p>
                    </div>
                    <div class="rt-item rt-quantity">
                        <div class="rt-tag">数量</div>
                        <el-input-number v-model="order.num" :min="1" :max="data.quantity" size="small"></el-input-number>
                        <div class="rt-tag" style="width:70px;margin-left:20px">剩余数量:</div>
                        <div class="rt-tag">{{data.quantity}}</div>
                    </div>
                    <div class="rt-item rt-note">
                        <div class="rt-tag">备注</div>
                        <el-input type="textarea" :rows="3" placeholder="请输入备注信息，如交易地点等" v-model="order.note"></el-input>
                    </div>
                    <div class="rt-item rt-total">
                        <div class="rt-tag">总价</div>
                        <p>￥{{totalPrice(data.price*order.num, 1)}}</p>
                    </div>
                    <div class="rt-item rt-bottom">
                        <el-button type="danger" @click="dialogVisible = true">立即购买</el-button>
                    </div>
                    <el-dialog
                        title="提示"
                        :visible.sync="dialogVisible"
                        width="30%"
                        :before-close="handleClose">
                        <span>总价为￥{{totalPrice(data.price*order.num, 1)}}，确定购买吗？</span>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="settlement()">确 定</el-button>
                        </span>
                    </el-dialog>
                </div>
            </div>
        </div>
        <div class="comment">
            <div class="comment-container">
                <div class="comment-title">
                    <p>商品评论</p>
                </div>
                <div class="comment-content" v-if="commentList.length !== 0">
                    <div class="comment-wrap" v-for="item in commentList" :key="item.id">
                        <div class="item-top">
                            <p>评价时间: {{item.createdOn}}</p>
                            <el-rate :value="item.rating" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate>
                        </div>
                        <div class="item-middle">
                            <div class="middle-left">{{ item.reviewerName }}:</div>
                            <div class="middle-right">{{ item.comment }}</div>
                        </div>
                        <div class="resp-wrap" v-for="resp in item.commentRespList" :key="resp.id">
                            <div class="resp-name">{{ resp.reviewerName }}:</div>
                            <div class="resp-content">{{ resp.comment }}</div>
                        </div>
                    </div>
                </div>
                <div class="comment-content" v-else>
                    暂时没有评论！
                </div>
                <div class="comment-bottom">
                    <el-button type="primary" size="mini" @click="evaluate()">评价</el-button>
                    <el-rate v-model="cmList.rating" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="cmList.comment"></el-input>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Nav from '../../components/Nav'
export default {
  data () {
    return {
      data: {},
      order: {
        num: 1,
        note: '',
        commodityId: 0,
        buyerId: 0
      },
      dialogVisible: false,
      // 评论表的结构
      commentList: {
        id: 0, photoUrl: '', rating: 5, reviewerId: 0, reviewerName: '', commentRespList: [{ id: 0, comment: '', commentId: 0, replierId: 0, replierName: '', reviewerId: '', reviewerName: '', parentId: 0 }]
      },
      iconClasses: ['icon-rate-face-1', 'icon-rate-face-2', 'icon-rate-face-3'],
      cmList: {
        comment: '',
        rating: null,
        commodityId: this.$store.state.commodity.id,
        reviewerId: this.$store.state.user.id
      }
    }
  },
  mounted () {
    this.data = this.$store.state.commodity
    this.order.commodityId = this.$store.state.commodity.id
    this.order.buyerId = this.$store.state.user.id
    this.initData()
  },
  components: {
    Nav
  },
  methods: {
    initData () {
      this.$axios.get('/apis/commodities/' + this.order.commodityId + '/comments').then(resp => {
        if (resp.status === 200) {
          var res = resp.data
          if (res.code === 200) {
            this.commentList = res.data
          }
        }
      })
    },
    evaluate () {
      this.$axios.post('/apis/comments', this.cmList).then(resp => {
        if (resp.status === 200) {
          var res = resp.data
          if (res.code === 200) {
            this.commentList.push(res.data)
            this.cmList.comment = ''
          }
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        }).catch(_ => {})
    },
    settlement () {
      this.dialogVisible = false
      this.$axios.post('/apis/orders', this.order).then(resp => {
        var data = resp.data
        if (data.code === 200) {
          this.$notify({
            title: '成功',
            message: '购买成功！请及时与商家联系',
            type: 'success'
          })
          this.data.quantity = this.data.quantity - this.order.num
        }
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
<style lang="scss">
#commodity {
    .content {
        border-top: 1px solid #000;
        margin-top: 110px;
        width: 100%;
        .detail {
            width: 1090px;
            margin: 50px auto 0;
            display: flex;

            .detail-left {
                width: 420px;
                min-height: 420px;
                img {
                    width: 100%;
                }
            }

            .detail-right {
                margin-left: 30px;
                font-size: 14px;
                h1 {
                    font-size: 16px;
                    font-weight: 700;
                    color: #000;
                    margin: 0 auto;
                }
                // 右边每列左边标签的统一样式
                .rt-item {
                    height: 40px;
                    line-height: 40px;
                    display: flex;
                }

                .rt-title {
                    overflow : hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp:2;
                }
                .rt-tag {
                    color: #999;
                    width: 50px;
                }
                .rt-description {
                    color: #333;
                    p {
                        margin: 0;
                        line-height: 40px;
                    }
                }
                .rt-price {
                    background-color: #e9e9e9;
                    p {
                        margin: 0;
                        line-height: 40px;
                        font-size: 18px;
                        color: #ff0036;
                        font-weight: bolder;
                    }
                }
                .rt-quantity {
                    margin-top: 5px;
                    .el-input-number {
                        margin-top: 5px;
                    }
                }
                .rt-note {
                    .el-textarea {
                        margin: 10px 5px 0;
                    }
                }
                .rt-total {
                    margin-top: 50px;
                    p {
                        margin: 0;
                        line-height: 40px;
                        font-size: 18px;
                        color: #ff0036;
                        font-weight: bolder;
                    }
                }
                .rt-bottom {
                    margin-top: 20px;
                    margin-left: 50px;
                }
            }
        }
    }
    .comment-container {
        width: 1090px;
        margin: 0 auto 50px;
        .comment-title {
            border-left: #000 solid 5px;
            padding-left: 20px;
        }

        .comment-content {
            .item-middle {
                display: flex;
                .middle-right {
                    margin-left: 10px;
                }
            }

            .resp-wrap {
                margin-left: 50px;
                display: flex;
                .resp-content {
                    margin-left: 10px;
                }
            }
        }
    }
}
</style>
