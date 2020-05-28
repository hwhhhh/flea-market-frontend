<template>
  <div id="admin-login">
    <div class="content">
      <el-form label-position="right" label-width="40px" :model="loginForm">
        <el-form-item label="邮箱">
          <el-input v-model="loginForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-button @click="submit()" type="primary">登录</el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loginForm: {
        email: '',
        password: '',
        role: 1
      }
    }
  },
  methods: {
    submit () {
      this.$axios.post('/apis/user', this.loginForm).then(resp => {
        var data = resp.data
        if (data.code === 200) {
          this.$store.commit('GET_USER', data.data)
          this.$router.push({
            name: 'AdminHome'
          })
          this.$notify({
            title: '登录成功',
            message: '欢迎你，管理员',
            type: 'success'
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: '用户名或密码错误！'
          })
        }
      }).catch(function (error) {
        console.log(error)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#admin-login {
  .content {
    width: 300px;
    height:200px;
    margin: 80px auto;

    .el-form {
      width: 100%;
      text-align: center;
    }
  }
}
</style>
