const requestWrap = require('../../../../common/requestWrap');
const url = require('../../../../common/url.js');
const logger = require('../../../../logs/log.js');
const haibaoUtil = require('../../common/haibaoUtil1');
const util = require('../../../../common/util');
const business = require('../../../../common/business');
const storage = require('../../../../common/storage');
const storageTime = 24 * 60 * 60; // 半小时
const moduleName = 'haibao.geren'; // 本地缓存模块名称
/**
 * 邀请海报卡片新增逻辑
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperData: [
      {
        index: 0, // 邀请码样式类别
        bg: 'https://paio-cdn.visitshanghai.com.cn/domestic/yshxcx/fenxiao/2020/12/10/images/geren-haibao-1.jpg',
        haibaoUrl: ''
      },
      {
        index: 1,
        bg: 'https://paio-cdn.visitshanghai.com.cn/domestic/yshxcx/fenxiao/2020/12/10/images/geren-haibao-2.jpg',
        haibaoUrl: ''
      },
      {
        index: 2,
        bg: 'https://paio-cdn.visitshanghai.com.cn/domestic/yshxcx/fenxiao/2020/12/10/images/geren-haibao-3.jpg',
        haibaoUrl: ''
      }
    ],
    currentIndex: 0,
    qr: '',
    avatarUrl: '',
    nickName: '',
    canvasStyle:{
      width: 0,
      height: 0
    }
  },

  onLoad() {},
  async onShow() {
    this.setData({
      canvasStyle:{
        width: 750,
        height: 1320
      }
    });
    const avatarUrl = wx.getStorageSync('avatarUrl');
    const nickName = wx.getStorageSync('nickName');
    this.setData({
      avatarUrl: avatarUrl || 'https://paio-cdn.visitshanghai.com.cn/domestic/yshxcx/fenxiao/2020/12/02/images/real-name-auth-avatar.png',
      nickName: nickName || ''
    });
    this.getShareData();
  },
  onShareAppMessage: function (res) {
    return util.getDefaultPageShareMessage();
  },
  getShareData() {
    let _this = this;
    const data = {
      page: 'pages/haibao/gerenHaibao/recruitment/recruitment',
      bizType: 'PERSON_POSTER',
      extData: {
        "productId": ""
      },
    };
    requestWrap({
      url: url.getUrl.build,
      data: data,
      method: 'post',
      loadingText: '加载中...',
      async success(res) {
        if (res.data && res.data.code === 0) {
          // 海报生成逻辑
          try {
            const qrPath = await haibaoUtil.loadImgBase64(res.data.result);
            _this.setData({
              qr: `${qrPath}`
            });
          } catch(e) {
            console.error('错误', e);
            business.toast.show('生成海报失败', 'none');
          }
        } else if (res.data && res.data.code === 405) {
          util.goLoginPage();
        } else {
          business.toast.show(res.data && res.data.msg, 'none');
        }
      },
      fail(err) {
        logger.error(`数据返回异常${err}`);
        business.toast.show('系统异常,请稍后重试', 'none');
      }
    })
  },
  myChange(e) {
    const source = e.detail.source;
    if (source === 'touch' || source === 'autoplay') {
      this.setData({
        currentIndex: e.detail.current
      });
    }
  },
  saveHaibao() {
    const currentIndex = this.data.currentIndex.toString();
    const tempPath = storage.get(moduleName, currentIndex);
    if (tempPath) {
      this.save(tempPath);
    } else {
      switch(currentIndex) {
        case '0':
          const ctxc1 = haibaoUtil.createHaibao('c1');
          this.renderType0('c1', ctxc1, currentIndex);
          break;
        case '1':
          const ctxc2 = haibaoUtil.createHaibao('c2');
          this.renderType1('c2', ctxc2, currentIndex);
          break;
        case '2':
          const ctxc3 = haibaoUtil.createHaibao('c3');
          this.renderType2('c3', ctxc3, currentIndex);
          break;
      }
    }
  },
  // 第一种样式
  async renderType0(canvasId, ctx, arrayIndex) {
    wx.showLoading({
      title: '加载中...',
    });
    const imgBg = await haibaoUtil.loadImg('https://paio-cdn.visitshanghai.com.cn/domestic/yshxcx/fenxiao/2020/12/10/images/geren-haibao-1.jpg');
    const imgAvatar = await haibaoUtil.loadImg(this.data.avatarUrl);
    const imgQR = await haibaoUtil.loadImg(this.data.qr);
    const imgLine = await haibaoUtil.loadImg('https://paio-cdn.visitshanghai.com.cn/domestic/yshxcx/fenxiao/2020/12/09/images/haibao/haibao-line-img.png');
    /*------------画海报背景图片--------------*/
    ctx.drawImage(imgBg.path, 0, 0, haibaoUtil.computedWAndD(this.data.canvasStyle.width), haibaoUtil.computedWAndD(this.data.canvasStyle.height));

    // 画分享人黑色带圆角的背景
    haibaoUtil.toDrawRadiusRect({
      left: haibaoUtil.computedWAndD(30),
      top: haibaoUtil.computedWAndD(1065),
      width: haibaoUtil.computedWAndD(690),
      height: haibaoUtil.computedWAndD(221),
      borderRadius: haibaoUtil.computedWAndD(20),
    }, ctx);
    // ctx.fillStyle = '#ffffff';
    ctx.setFillStyle('#ffffff');
    ctx.fill();
    // // 画头像
    ctx.save();
    ctx.beginPath();
    ctx.arc(haibaoUtil.computedWAndD(110), haibaoUtil.computedWAndD(1145), haibaoUtil.computedWAndD(50), 0, 2*Math.PI);
    ctx.clip();
    ctx.drawImage(imgAvatar.path, haibaoUtil.computedWAndD(60), haibaoUtil.computedWAndD(1095), haibaoUtil.computedWAndD(100), haibaoUtil.computedWAndD(100));
    ctx.restore();
    // 画分享人昵称
    ctx.font = `normal bold ${haibaoUtil.computedWAndD(30)}px sans-serif`;
    // ctx.fillStyle = "#333333";
    ctx.setFillStyle("#333333");
    // ctx.fillText(this.data.nickName, haibaoUtil.computedWAndD(183), haibaoUtil.computedWAndD(1128));
    haibaoUtil.drawTextWrapper(ctx, this.data.nickName, 42, 1, true, 308, 183, 1128);
    // 画分享文案
    ctx.font = `normal normal ${haibaoUtil.computedWAndD(22)}px sans-serif`;
    // ctx.fillStyle = "#333333";
    ctx.setFillStyle("#333333");
    ctx.fillText('邀请你成为游上海优选的小达人', haibaoUtil.computedWAndD(183), haibaoUtil.computedWAndD(1170));
    // 画分享文案下方图片
    ctx.drawImage(imgLine.path, haibaoUtil.computedWAndD(183), haibaoUtil.computedWAndD(1197), haibaoUtil.computedWAndD(284), haibaoUtil.computedWAndD(10));
    // 画扫描或长按识别二维码文字下的rect
    // ctx.fillStyle = 'rgba(255,98,52,0.39)';
    ctx.setFillStyle('rgba(255,98,52,0.39)');
    ctx.fillRect(haibaoUtil.computedWAndD(183), haibaoUtil.computedWAndD(1250), haibaoUtil.computedWAndD(260), haibaoUtil.computedWAndD(9));
    // 画扫描或长按识别二维码文案
    ctx.font = `normal middle ${haibaoUtil.computedWAndD(26)}px sans-serif`;
    // ctx.fillStyle = "#333333";
    ctx.setFillStyle("#333333");
    ctx.fillText('扫描或长按识别二维码', haibaoUtil.computedWAndD(183), haibaoUtil.computedWAndD(1252));
    // 画分享码
    ctx.drawImage(imgQR.path, haibaoUtil.computedWAndD(526), haibaoUtil.computedWAndD(1095), haibaoUtil.computedWAndD(164), haibaoUtil.computedWAndD(164));
    ctx.draw(false, async () => {
      try {
        const tempPath = await haibaoUtil.createHaibaoUrl(canvasId, this.data.canvasStyle);
        // 本地缓存24小时
        storage.set(moduleName, arrayIndex, tempPath, storageTime);
        this.save(tempPath);
      } catch(e) {
        console.error(e);
        logger.error('保存海报图片失败, 请稍后重试~',e);
      }
    });
  },
  // 第二种样式
  async renderType1(canvasId, ctx, arrayIndex) {
    wx.showLoading({
      title: '加载中...',
    });
    const imgBg = await haibaoUtil.loadImg('https://paio-cdn.visitshanghai.com.cn/domestic/yshxcx/fenxiao/2020/12/10/images/geren-haibao-2.jpg');
    const imgAvatar = await haibaoUtil.loadImg(this.data.avatarUrl);
    const imgQR = await haibaoUtil.loadImg(this.data.qr);
    const imgLine = await haibaoUtil.loadImg('https://paio-cdn.visitshanghai.com.cn/domestic/yshxcx/fenxiao/2020/12/09/images/haibao/haibao-line-img.png');
    
    /*------------画海报背景图片--------------*/
    ctx.drawImage(imgBg.path, 0, 0, haibaoUtil.computedWAndD(this.data.canvasStyle.width), haibaoUtil.computedWAndD(this.data.canvasStyle.height));

    // 画分享人黑色带圆角的背景
    haibaoUtil.toDrawRadiusRect({
      left: haibaoUtil.computedWAndD(30),
      top: haibaoUtil.computedWAndD(1065),
      width: haibaoUtil.computedWAndD(690),
      height: haibaoUtil.computedWAndD(221),
      borderRadius: haibaoUtil.computedWAndD(20),
    }, ctx);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    // 画头像
    ctx.save();
    ctx.beginPath();
    ctx.arc(haibaoUtil.computedWAndD(110), haibaoUtil.computedWAndD(1145), haibaoUtil.computedWAndD(50), 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(imgAvatar.path, haibaoUtil.computedWAndD(60), haibaoUtil.computedWAndD(1095), haibaoUtil.computedWAndD(100), haibaoUtil.computedWAndD(100));
    ctx.restore();
    // 画分享人昵称
    ctx.font = `normal bold ${haibaoUtil.computedWAndD(30)}px sans-serif`;
    ctx.fillStyle = "#333333";
    // ctx.fillText(this.data.nickName, haibaoUtil.computedWAndD(183), haibaoUtil.computedWAndD(1128));
    haibaoUtil.drawTextWrapper(ctx, this.data.nickName, 42, 1, true, 308, 183, 1128);
    // 画分享文案
    ctx.font = `normal normal ${haibaoUtil.computedWAndD(22)}px sans-serif`;
    ctx.fillStyle = "#333333";
    ctx.fillText('邀请你成为游上海优选的小达人', haibaoUtil.computedWAndD(183), haibaoUtil.computedWAndD(1170));
    // 画分享文案下方图片
    ctx.drawImage(imgLine.path, haibaoUtil.computedWAndD(183), haibaoUtil.computedWAndD(1197), haibaoUtil.computedWAndD(284), haibaoUtil.computedWAndD(10));
    // 画扫描或长按识别二维码文字下的rect
    ctx.fillStyle = 'rgba(255,98,52,0.39)';
    ctx.fillRect(haibaoUtil.computedWAndD(183), haibaoUtil.computedWAndD(1250), haibaoUtil.computedWAndD(260), haibaoUtil.computedWAndD(9));
    // 画扫描或长按识别二维码文案
    ctx.font = `normal middle ${haibaoUtil.computedWAndD(26)}px sans-serif`;
    ctx.fillStyle = "#333333";
    ctx.fillText('扫描或长按识别二维码', haibaoUtil.computedWAndD(183), haibaoUtil.computedWAndD(1252));
    // 画分享码
    ctx.drawImage(imgQR.path, haibaoUtil.computedWAndD(526), haibaoUtil.computedWAndD(1095), haibaoUtil.computedWAndD(164), haibaoUtil.computedWAndD(164));
    ctx.draw(false, async () => {
      try {
        const tempPath = await haibaoUtil.createHaibaoUrl(canvasId, this.data.canvasStyle);
        // 本地缓存24小时
        storage.set(moduleName, arrayIndex, tempPath, storageTime);
        this.save(tempPath);
      } catch(e) {
        console.error(e);
        logger.error('保存海报图片失败, 请稍后重试~',e);
      }
    });
  },
  // 第三种样式
  async renderType2(canvasId, ctx, arrayIndex) {
    wx.showLoading({
      title: '加载中...',
    });
    const imgBg = await haibaoUtil.loadImg('https://paio-cdn.visitshanghai.com.cn/domestic/yshxcx/fenxiao/2020/12/10/images/geren-haibao-3.jpg');
    const imgAvatar = await haibaoUtil.loadImg(this.data.avatarUrl);
    const imgQR = await haibaoUtil.loadImg(this.data.qr);
    const imgLine = await haibaoUtil.loadImg('https://paio-cdn.visitshanghai.com.cn/domestic/yshxcx/fenxiao/2020/12/09/images/haibao/haibao-line-img.png');
    /*------------画海报背景图片--------------*/
    ctx.drawImage(imgBg.path, 0, 0, haibaoUtil.computedWAndD(this.data.canvasStyle.width), haibaoUtil.computedWAndD(this.data.canvasStyle.height));

    // 画分享人黑色带圆角的背景
    haibaoUtil.toDrawRadiusRect({
      left: haibaoUtil.computedWAndD(30),
      top: haibaoUtil.computedWAndD(1065),
      width: haibaoUtil.computedWAndD(690),
      height: haibaoUtil.computedWAndD(221),
      borderRadius: haibaoUtil.computedWAndD(20),
    }, ctx);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    // 画头像
    ctx.save();
    ctx.beginPath();
    ctx.arc(haibaoUtil.computedWAndD(110), haibaoUtil.computedWAndD(1145), haibaoUtil.computedWAndD(50), 0, 2*Math.PI);
    ctx.clip();
    ctx.drawImage(imgAvatar.path, haibaoUtil.computedWAndD(60), haibaoUtil.computedWAndD(1095), haibaoUtil.computedWAndD(100), haibaoUtil.computedWAndD(100));
    ctx.restore();
    // 画分享人昵称
    ctx.font = `normal bold ${haibaoUtil.computedWAndD(30)}px sans-serif`;
    ctx.fillStyle = "#333333";
    // ctx.fillText(this.data.nickName, haibaoUtil.computedWAndD(183), haibaoUtil.computedWAndD(1128));
    haibaoUtil.drawTextWrapper(ctx, this.data.nickName, 42, 1, true, 308, 183, 1128);
    // 画分享文案
    ctx.font = `normal normal ${haibaoUtil.computedWAndD(22)}px sans-serif`;
    ctx.fillStyle = "#333333";
    ctx.fillText('邀请你成为游上海优选的小达人', haibaoUtil.computedWAndD(183), haibaoUtil.computedWAndD(1170));
    // 画分享文案下方图片
    ctx.drawImage(imgLine.path, haibaoUtil.computedWAndD(183), haibaoUtil.computedWAndD(1197), haibaoUtil.computedWAndD(284), haibaoUtil.computedWAndD(10));
    // 画扫描或长按识别二维码文字下的rect
    ctx.fillStyle = 'rgba(255,98,52,0.39)';
    ctx.fillRect(haibaoUtil.computedWAndD(183), haibaoUtil.computedWAndD(1250), haibaoUtil.computedWAndD(260), haibaoUtil.computedWAndD(9));
    // 画扫描或长按识别二维码文案
    ctx.font = `normal middle ${haibaoUtil.computedWAndD(26)}px sans-serif`;
    ctx.fillStyle = "#333333";
    ctx.fillText('扫描或长按识别二维码', haibaoUtil.computedWAndD(183), haibaoUtil.computedWAndD(1252));
    // 画分享码
    ctx.drawImage(imgQR.path, haibaoUtil.computedWAndD(526), haibaoUtil.computedWAndD(1095), haibaoUtil.computedWAndD(164), haibaoUtil.computedWAndD(164));
    ctx.draw(false, async () => {
      try {
        const tempPath = await haibaoUtil.createHaibaoUrl(canvasId, this.data.canvasStyle);
        // 本地缓存24小时
        storage.set(moduleName, arrayIndex, tempPath, storageTime);
        this.save(tempPath);
      } catch(e) {
        console.error(e);
        logger.error('保存海报图片失败, 请稍后重试~',e);
      }
    });
  },
  // 导出图片到相册
  async save(tempPath) {
    if (!tempPath) {
      return;
    }
    wx.showLoading({
      title: '保存中~',
    });
    try {
      await haibaoUtil.saveHaibao(tempPath);
      wx.hideLoading();
      business.toast.show('已存至相册中', 'none');
    }catch(e) {
      console.error(e);
      business.toast.show('保存失败', 'none');
    }
  }
})