<template>
  <div>
    <div>
      <div v-title v-text="">{{datalist.productName}}</div>
      <div class="container">
        <div class="loans_kind clear-f">
          <div class="kind_pic f-l">
            <img alt="" v-bind:src="datalist.iconUrl">
          </div>
          <div class="kind_text f-l">
            <div class="kind_name">{{datalist.productName}}</div>
            <div>{{datalist.advantage}}</div>
          </div>
          <div class=" kind_price">
            <div class="kind_price_count">¥{{datalist.moneyMax}}</div>
            <div>最高额度</div>
          </div>
        </div>
        <div class="flex space_around  loan_advantage align_item_center">
          <div class="advantage_list">
            <div class="advantage_list_pic">
              <img src="../assets/images/CCloans/rocket@2x.png" alt="">
            </div>
            <div class="text_introduce">
              放款速度
            </div>
            <div>
              {{datalist.periodMoneyDown}}
            </div>
          </div>
          <div class="advantage_list">
            <div class="advantage_list_pic">
              <img src="../assets/images/CCloans/Shape@2x.png" alt="">
            </div>
            <div class="text_introduce">
              每日利率
            </div>
            <div>
              {{datalist.rateByDay}}%
            </div>
          </div>
          <div class="advantage_list">
            <div class="advantage_list_pic">
              <img src="../assets/images/CCloans/time@2x.png" alt="">
            </div>
            <div class="text_introduce">
              最长期限
            </div>
            <div>
              {{datalist.periodMax}}
            </div>
          </div>
        </div>
        <div class="loan_condition">
          <div class="loan_condition_list">
            <div class="condition_list_way">
              申请条件:
            </div>
            <div>
              <div v-text="item" v-for="item in condition"></div>
            </div>
          </div>
          <div class="loan_condition_list">
            <div class="condition_list_way">
              申请材料:
            </div>
            <div>
              <div v-for="item in materials" v-text="item"></div>
            </div>
          </div>
          <div class="loan_condition_list">
            <div class="condition_list_way">
              审核方式:
            </div>
            <div>
              <div>
                <div v-for="item in audit" v-text="item"></div>
              </div>
            </div>
          </div>
          <div class="loan_condition_list">
            <div class="condition_list_way">
              还款方式：
            </div>
            <div>
              <div v-for="item in refund" v-text="item"></div>
            </div>
          </div>
        </div>
        <div class="loan_btn">
          <div>以上信息仅供参考，具体以贷款提供方为准</div>
          <div class="btn_button" @click="jump()">立即申请</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import qs from 'qs'

  export default {
    data () {
      return {
        datalist: ''
      }
    },
    mounted () {
      this.getData()
    },
    computed: {
      condition: function () {
        return this.datalist.applyTerm.split('\n')
      },
      materials: function () {
        return this.datalist.authMaterial.split('\n')
      },
      audit: function () {
        return this.datalist.auditType.split('\n')
      },
      refund: function () {
        return this.datalist.paybackType.split('\n')
      }
    },
    methods: {
      jump: function () {
        var that = this
        var token = localStorage.getItem('token')
        console.log(token)
        this.$http.post('/product/target.json', qs.stringify({
          productId: that.datalist.productId
        }))
          .then(function (result) {
            if (result.data.code === 6) {
              that.$router.push({
                path: 'login',
                query: {
                  token: token
                }
              })
            } else if (result.data.code === 0) {
              window.location.href = result.data.data.adJumpLink
            }
          })
      },
      // 获取数据
      getData: function () {
        console.log(this)
        var _this = this
        var productId = this.$route.query.productId
        console.log(productId)
        this.$http.post('/product/detail.json', qs.stringify({
          productId: productId
        }))
          .then(function (result) {
            console.log(result)
            _this.datalist = result.data.data
            console.log(result.data.data)
          })
      }
    }
  }
</script>

<style>
  @import "../assets/css/loans_kind.css";
</style>
