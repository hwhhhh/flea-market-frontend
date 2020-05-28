<template>
    <div id="nav">
        <div class="nav-wrap">
            <div class="icon">
                <a href="/home"><i class="iconfont icon-B"></i></a>
            </div>
            <div class="menu-tab" v-if="!this.$store.state.user">
                <span>你好，欢迎来Bistu校园二手市场</span>
                <a href="/login" class="register">请登录</a>
                <a href="/register" class="login">注册</a>
            </div>
            <div class="user-info" v-else>
                <span>你好,<a href="/user">{{ this.$store.state.user.name }}。</a></span>
                <span><a href="/login">退出</a></span>
            </div>
        </div>
    </div>
</template>
<script>
export default {

}
</script>
<style lang="scss" scoped>
.nav-wrap {
    background-color: #f2f2f2;
    height: 50px;
    padding-right: 22vw;
    padding-left: 22vw;
    display: flex;
    align-items: center;
    box-shadow: 0 0 0 1px #e5e5e5;

    .icon {
        a {
            cursor: pointer;
            color: #000;
        }
        .iconfont {
            font-size: 35px;
        }
    }

    .menu-tab {
        justify-content: flex-end;
        margin-left: auto;
        display: flex;
        color: #999999;
        font-size: .9rem;

        .register {
          margin: 0 20px;
        }
    }

    .user-info {
      justify-content: flex-end;
      margin-left: auto;
      display: flex;
      color: #999999;
      font-size: .9rem;
    }

    a {
      color: #999999;
      cursor: pointer;
      z-index: 2;
    }

    a:hover {
      color: #ff0036;
    }
}
</style>