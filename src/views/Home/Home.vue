<template>
    <div>
      <Nav></Nav>
      <div id="header">
        <div class="search">
          <div class="input-wrap">
            <el-autocomplete v-model="searchText" placeholder="搜索 bistu 商品/用户" class="search-input" :fetch-suggestions="querySearchAsync" @select="handSelect"></el-autocomplete>
            <el-button icon="el-icon-search">搜索</el-button>
          </div>
        </div>
      </div>
      <div id="content" style="overflow:auto">
        <div class="banner-slider">
            <el-carousel indicator-position="outside">
              <el-carousel-item v-for="item in bannerList" :key="item.id">
                <el-image :src=item.photoUrl fit="fit" @click="getCommodityInfo(item)" class="banner-img"></el-image>
              </el-carousel-item>
            </el-carousel>
        </div>
        <div class="hot-list">
          <div class="hot-wrap" v-for="item in hotList" :key="item.id" @click="getCommodityInfo(item)">
            <div class="hot-item-tag"></div>
            <el-image el-image :src="item.photoUrl" fit="fit" class="hot-item-img"></el-image>
            <div class="hot-item-title">{{item.name}}</div>
            <div class="hot-item-price">￥{{item.price}}</div>
          </div>
        </div>
        <div class="common-list" v-infinite-scroll="load" infinite-scroll-disabled="disabled">
          <div class="common-wrap" v-for="item in commonList" :key="item.id">
            <div class="common-item">
              <el-image :src="item.photoUrl" fit="fit" class="common-item-img"></el-image>
            </div>
          </div>
          <p v-if="loading">加载中...</p>
          <p v-if="noMore">没有更多了</p>
        </div>
      </div>
    </div>
</template>
<script>
import Nav from '../../components/Nav'
export default {
  components: {
    Nav
  },
  data () {
    return {
      bannerList: [],
      hotList: [],
      commonList: [],
      searchText: '',
      timeout: null,
      loading: false,
      noMore: false
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      this.$axios.get('/apis/commodities/hot').then((resp) => {
        this.bannerList = resp.data.data.bannerList
        this.hotList = resp.data.data.hotList
      }).catch(function (error) {
        console.log(error)
      })
      this.$axios.get('/apis/commodities/status', {
        params: {
          status: 0,
          id: 0,
          limit: 1
        }
      }).then(resp => {
        this.commonList = resp.data.data
      })
    },
    getCommodityInfo (data) {
      this.$store.commit('GET_COMMODITY', data)
      this.$router.push({ name: 'Commodity' }) // 跳转至商品页面
    },
    querySearchAsync (queryString, cb) {
      this.$axios.get('/apis/commodities/search', { params: { name: queryString } }).then(resp => {
        var respData = resp.data
        if (respData.code === 200) {
          var data = respData.data
          var results = []
          data.forEach(element => {
            results.push({
              value: element.name,
              content: element
            })
          })
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            cb(results)
          }, 3000 * Math.random())
        }
      })
    },
    handSelect (item) {
      this.getCommodityInfo(item.content)
    },
    // 普通商品的加载
    load () {
      if (this.commonList.length !== 0) {
        this.loading = true
        setTimeout(() => {
          this.$axios.get('/apis/commodities/status', {
            params: {
              status: 0,
              id: this.commonList[this.commonList.length - 1].id,
              limit: 1
            }
          }).then(resp => {
            if (resp.status === 200) {
              var data = resp.data
              if (data.code === 200) {
                data.data.forEach(item => {
                  this.commonList.push(item)
                })
              } else {
                this.noMore = true
              }
            } else {
              // 说明没有了，无法加载
              this.noMore = true
            }
            this.loading = false
          }).catch(function (error) {
            console.log(error)
          })
        }, 2000)
      }
    }
  },
  computed: {
    disabled () {
      return this.loading || this.noMore
    }
  }
}
</script>
<style lang="scss">

#header {
  height: 130px;
  display: flex;
  justify-content: center;
  align-items: center;

  .input-wrap {
    display: flex;
    border: solid #FF0036;
    border-width: 2px;

    .el-input__inner {
      width:400px;
      border: none;
      border-radius: 0;
    }

    .el-input__inner::placeholder {
      color: rgb(250, 68, 108);
    }

    .el-button {
      width: 10vw;
      color: #fff;
      font-size: 1rem;
      border: none;
      border-radius: 0;
      background-color: #FF0036;
    }
  }
}

#content {
  margin-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
  overflow: hidden;

  .banner-slider {
    margin-left: 22vw;
    margin-right: 22vw;
  }

  .el-carousel__container {
    height: 460px;
    cursor: pointer;
  }
  .el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
  }
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .hot-list {
    display: flex;
    flex-wrap: wrap;
    float: left;
    margin: 50px 22vw 80px;

    .hot-wrap {
      background-color: #fff;
      width: 234px;
      height: 300px;
      margin-left: 22px;
      margin-top: 13px;
      text-align: center;
      border: 1px solid #fff;
      cursor: pointer;

      .hot-item-tag {
        height: 20px;
        visibility: hidden;
      }

      .hot-item-img {
        width: 185px;
        height: 185px;
      }

      .hot-item-title {
        margin: 8px auto;
        width: 135px;
        height: 40px;
        color: #333;
        font-size: 14px;

        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp:2;
      }

      .hot-item-price {
        color:#FF0036;
        font-size: 18px;
        margin: 5px auto;
      }
    }
    .hot-wrap:hover {
      border: 1px solid #FF0036;
    }
  }

  .common-list {
    clear: both;
    margin-left: 22vw;
    margin-right: 22vw;
    .common-wrap {
      margin-left: 22px;
    }
  }
}
</style>
