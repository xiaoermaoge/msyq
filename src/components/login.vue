<template>
  <div>
    <div v-title>首页</div>
    <div class="container">
      <div class="login_input">
        <div class="phone">
          <input type="text" placeholder="请输入手机号" v-model="phone">
        </div>
        <div class="verify clear-f">
          <input class="f-l" type="text" placeholder="请输入验证码" v-model="verify">
          <span class="f-r" @click="getDataList">获取验证码</span>
        </div>
      </div>
      <div class="login_btn" @click="login">
        立即登录
      </div>
    </div>

  </div>
</template>
<script>
  import qs from 'qs'

  export default {
    data: function () {
      return {
        phone: '',
        verify: '',
        inviteCode: ''
      }
    },
    mounted () {
    },
    methods: {
      // 发送验证码
      getDataList: function () {
        if (!this.phone) {
          alert('请输入手机号码!')
        } else if (!(/^1[34578]\d{9}$/.test(this.phone))) {
          alert('请输入正确的手机号码!')
        } else {
          this.$http.post('/verification/send.json', qs.stringify({
            userMobile: this.phone,
            sceneType: 'register'
          }))
            .then(function (response) {
              if (response.data.code === 0) {
                alert('成功发送验证码!')
              } else {
                alert(response.data.msg)
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        }
      },
      login: function () {
        var _that = this
        var inviteCode = sessionStorage.getItem('inviteCode')
        if (!this.phone) {
          alert('请输入手机号码!')
        } else if (!(/^1[34578]\d{9}$/.test(this.phone))) {
          alert('请输入正确的手机号码!')
        } else if (!this.verify) {
          alert('请输入验证码!')
        } else {
          this.$http.post('/login.json', qs.stringify({
            userMobile: this.phone,
            verifyCode: this.verify,
            inviteCode: inviteCode
          }))
            .then(function (response) {
              console.log(this)
              console.log(response)
              if (response.data.code === 0) {
                // 缓存token
                localStorage.setItem('token', response.data.data.token)
                _that.$router.push({
                  path: '/',
                  query: {
                    inviteCode: inviteCode
                  }
                })
              }
              if (response.data.code === 6) {
                console.log()
              } else {
//                alert(response.data.msg)
//                console.log(response.data)
              }
            })
        }
      }
      // 传电话
    }
  }
</script>

<style>

  @import "../assets/css/login.css";
</style>
