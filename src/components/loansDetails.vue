<template>
  <div>
    <div v-title>马上有钱</div>

    <swiper :options="swiperOption">
      <swiper-slide v-for="item in banner">
        <img v-bind:src="item.bannerImg" alt="" @click="imgjump(item.targetAddr)">
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>


    <div class="option clear-f">
      <div class="f-l money" @click="chooseTab('jine')" v-text="money" :class="{ 'active': tab.jine }">金额</div>
      <div class="f-l deadline" @click="chooseTab('time')" v-text="period" :class="{ 'active': tab.time }">期限</div>
      <div class="f-l crowd" @click="chooseTab('people')" :class="{ 'active': tab.people }" v-text="peoName"></div>
    </div>
    <div class="modal-container f-l">
      <div class="money_modal" v-if="tab.jine">
        <div @click="getMoney(null,null,'金额',null)">不限</div>
        <div @click="getMoney(null,1000,'1000元以下',0)">1000元以下
          <span class="f-r" v-if="numMoney === 0"></span>
        </div>
        <div @click="getMoney(1000,5000,'1000~5000元',1)">1000~5000元
          <span class="f-r" v-if="numMoney === 1"></span>
        </div>
        <div @click="getMoney(5000,10000,'5000~1万元',2)">5000~10000元
          <span class="f-r" v-if="numMoney === 2"></span>
        </div>
        <div @click="getMoney(null,10000,'1万元以上',3)">10000元以上
          <span class="f-r" v-if="numMoney === 3"></span>
        </div>
      </div>
      <div class="deadline_modal" v-if="tab.time">
        <div @click="getDate(null,null,null,'期限')">不限</div>
        <div @click="getDate('day',null,30,'1个月以下',0)">1个月以下
          <span class="f-r" v-if="num === 0"></span>
        </div>
        <div @click="getDate('month',1,3,'1~3个月',1)">1~3个月
          <span class="f-r" v-if="num === 1"></span>
        </div>
        <div @click="getDate('month',3,6,'3~6个月',2)">3~6个月
          <span class="f-r" v-if="num === 2"></span>
        </div>
        <div @click="getDate('month',6,12,'6~12个月',3)">6~12个月
          <span class="f-r" v-if="num === 3"></span>
        </div>
        <div @click="getDate('month',null,12,'12个月以上',4)">12个月以上
          <span class="f-r" v-if="num === 4"></span>
        </div>
      </div>
      <div class="crowd_modal" v-if="tab.people">
        <div @click="getId({peopleName: '人群'})">不限</div>
        <div @click="getId(item)" v-for="item in peopleName" class="clear-f">
          {{item.peopleName}}
          <span class="f-r" v-if="item.chose"></span>
        </div>
      </div>
    </div>
    <div class="xian"></div>

    <div class="scroll" v-infinite-scroll="getScroll" infinite-scroll-distance="100" infinite-scroll-disabled="busy">
      <div class="list_container" v-for="item in list">
        <div class="list clear-f">
          <div class="list_image f-l">
            <img alt="" v-bind:src="item.iconUrl">
          </div>
          <div class="list_text f-l">
            <div>{{item.productName}}</div>
            <div class="list_mode">
              <span v-for="tag in item.tags" v-text="tag.tagName"></span>
            </div>
            <div class="list_message">
              {{item.advantage}}
            </div>
          </div>
          <div class="f-r list_price">
            ¥{{item.moneyMax}}
          </div>
          <div class="bor-bottom"></div>
          <a @click="getJump(item.productId)"></a>
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
        tab: {
          jine: false,
          time: false,
          people: false
        },
        periodType: '',
        periodMax: '',
        periodMin: '',
        moneyMin: '',
        moneyMax: '',
        num: '',
        numMoney: '',
        token: '',
        period: '期限',
        money: '金额',
        peopleName: '',
        peoName: '人群',
        peopleId: '',
        banner: '',
        pageNum: 1,
        pageSize: 5,
        busy: false,
        count: [],
        list: [],
        isLastPage: false,
        lastPage: '',
        listArr: [],
        productId: '',
        scroll_hei: '',
        inviteCode: '',
        // swiper参数设置
        swiperOption: {
          autoplay: 3500,
          setWrapperSize: true,
          direction: 'horizontal',
          pagination: '.swiper-pagination',
          paginationClickable: true,
          mousewheelControl: true,
          observeParents: true,
          autoplayDisableOnInteraction: false
        }
      }
    },
    updated () {
    },
    mounted () {
      this.getinviteCode()
      this.getData()
    },
    methods: {
      // banner图片跳转
      imgjump: function (item) {
        this.$router.push({
          path: 'CCloans',
          query: {
            productId: item
          }
        })
      },
      getinviteCode: function () {
        var that = this
        that.inviteCode = that.$route.query.inviteCode
        sessionStorage.setItem('inviteCode', that.inviteCode)
      },
      // 请求数据
      getData: function () {
        var that = this
        this.$http.post('/page/index.json', qs.stringify({}))
          .then(function (response) {
            that.banner = response.data.data.banners
          })

        this.$http.post('/product/people_list.json', qs.stringify({}))
          .then(function (response) {
            that.peopleName = response.data.data
          })
      },
      // 获取列表
      getDataList: function () {
        var that = this
        this.$http.post('/product/list.json', qs.stringify({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          peopleId: this.peopleId,
          periodType: this.periodType,
          periodMax: this.periodMax,
          periodMin: this.periodMin,
          moneyMin: this.moneyMin,
          moneyMax: this.moneyMax
        }))
          .then(function (response) {
            that.list = that.list.concat(response.data.data.list)
            that.isLastPage = response.data.data.isLastPage
            that.lastPage = response.data.data.lastPage
            that.busy = false
          })
      },
      // 删选 金额 期限 人群
      chooseTab (item) {
        let curr = this.tab[item]
        for (let attr in this.tab) {
          this.tab[attr] = false
        }
        if (!curr) {
          this.tab[item] = true
        }
//        if (this.lastPage > 1) {
//          console.log(1)
//          this.$router.push({
//            path: ''
//          })
//        }
      },
      // 金额 条件删选
      getMoney: function (min, max, text, num) {
        this.moneyMin = min
        this.moneyMax = max
        this.money = text
        this.numMoney = num
        console.log(this.list)
        // 清空list
        this.list = []
        this.pageNum = 1
        this.busy = true
        this.getDataList()
        this.chooseTab()
        this.isLastPage = false
        console.log(this.list)
      },
      // 期限 条件删选
      getDate: function (type, min, max, text, num) {
        this.periodType = type
        this.periodMin = min
        this.periodMax = max
        this.period = text
        this.num = num
        // 清空list
        this.list = []
        this.pageNum = 1
//        this.getDataList()
        this.chooseTab()
      },
      // 人群 条件删选
      getId: function (item) {
        this.peoName = item.peopleName
        this.peopleId = item.peopleId
        for (let peo in this.peopleName) {
          if (this.peopleName[peo].chose !== undefined) {
            this.peopleName[peo].chose = false
          }
        }
        this.$set(item, 'chose', true)
        this.chooseTab()
        // 清空list
        this.list = []
        this.pageNum = 1
        this.getDataList()
      },
      // 获取滚动条高度
      getScroll: function () {
        console.log(this.isLastPage)
        var that = this
        if (!that.isLastPage) {
          that.busy = true
          that.getDataList()
          that.pageNum++
        }
      },
      // 获取当前跳转 productId
      getJump (productId) {
        this.$router.push({
          path: 'CCloans',
          query: {
            productId: productId
          }
        })
      }
    }
  }
</script>

<style>
  @import "../assets/css/loansDetails.css";
  @import "../assets/css/swiper.min.css";
</style>
<style scoped>
  .swiper-container {
    width: 100%;
    height: 360px;
  }

  .modal-container {
    font-size: 32px;
    width: 100%;
    background: #fff;
    height: 30%;
  }

  .modal-container > div > div {
    padding-left: 20px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    height: 60px;
    line-height: 60px;
  }

  .active {
    color: #007aff;
  }

  .modal-container span {
    display: inline-block;
    width: 40px;
    height: 60px;
    background: url('../assets/images/loansDetails/Path3@2x.png') 100% no-repeat;
    margin-right: 20px;
  }
</style>
