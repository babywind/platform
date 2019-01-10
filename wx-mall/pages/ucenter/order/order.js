var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data:{
    orderTypeList: [
      { code: "all", name: "全部", orderState: "" },
      { code: "ordered", name: "待付款", orderState: "0" },
      { code: "paid", name: "待发货", orderState: "201" },
      { code: "sended", name: "待收货", orderState: "300" },
      { code: "finished", name: "已完成", orderState: "301" },
    ],
    currentTab: 0,
    orderList: [],
    page: 1,
    size: 10,
    loadmoreText: '正在加载更多数据',
    nomoreText: '无更多记录',
    nomore: false,
    totalPages: 1
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // 页面显示
  },

  /**
       * 页面上拉触底事件的处理函数
       */
  onReachBottom: function () {
    if (this.data.totalPages <= this.data.page - 1) {
      this.setData({
        nomore: true
      });

      return;
    }

    this.setData({
      nomore: false,
      page: this.data.page + 1
    });

    this.getOrderList()
  },
  onSelectType: function (ev) {
    if (this.data.currentTab === ev.currentTarget.dataset.tabIdx) {
      return;
    }

    wx.showLoading({
      title: '加载中...',
      success: function () {

      }
    });

    this.data.currentTab = ev.currentTarget.dataset.tabIdx;

    this.setData({
      page: 1,
      orderList: [],
      currentTab: this.data.currentTab
    });

    this.getOrderList();

    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  },
  getOrderList(){
    // let that = this;

    let idx = this.data.currentTab;
    let param = {
      page: this.data.page,
      size: this.data.size,
      orderState: this.data.orderTypeList[idx].orderState
    };

    util.request(api.OrderList, param).then((res) => {
      if (res.errno === 0) {
        this.setData({
          orderList: this.data.orderList.concat(res.data.data),
          page: res.data.currentPage + 1,
          totalPages: res.data.totalPages
        });
        wx.hideLoading();
      }
    });
  },
  payOrder(event){
      let that = this;
      let orderIndex = event.currentTarget.dataset.orderIndex;
      let order = that.data.orderList[orderIndex];
      wx.navigateTo({
        url: '/pages/pay/pay?orderId=' + order.id + '&actualPrice=' + order.actual_price,
      })
      // wx.redirectTo({
      //     url: '/pages/pay/pay?orderId=' + order.id + '&actualPrice=' + order.actual_price,
      // })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    wx.showLoading({
      title: '加载中...',
      success: function () {

      }
    });
    this.getOrderList();
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})