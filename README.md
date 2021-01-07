> 坑爹的微信,使用canvas 2D的方式, 必须用createImage这个API,偏偏这个API挂了,所以下面使用另一种方式实现海报.

主要由微信推荐的canvas 2D方式更换为微信即将遗弃的老canvas实现方式,因此能够避免使用createImage这个API.其他的实现方式和思路是和[微信小程序canvas画海报总结-1](https://juejin.cn/post/6906790715418738702)一样的.


# 不同之处
## 1. canvas声明方式不同
wxml, 不再声明type=2d, id属性
```
<canvas canvas-id="c3" class="canvas1" style="width: {{canvasStyle.width}}rpx; height: {{canvasStyle.height}}rpx;"></canvas>
```
js, 获取context对象
```
const ctx = wx.createCanvasContext(canvasId);
```
## 2. 加载图片,避开createImage这个挂掉的API
主要用wx.getImageInfo获取到图片文件的临时本地路径,便于调用ctx.drawImage画图片
```
wx.getImageInfo({
        src: imgUrl,
        success (res) {
          resolve(res);
        },
        fail(e) {
          business.toast.show('海报图片加载失败,请稍后重试~', 'none');
          reject(e);
        }
      })
```
## 3.ctx.draw回调函数
要下载canvas画出来的图片,就必须在ctx.draw的回调函数内调用wx.canvasToTempFilePath,最终完成下载
```
ctx.draw(false, async () => {
      try {
        const tempPath = await haibaoUtil.createHaibaoUrl(canvasId, this.data.canvasStyle);
        this.save(tempPath);
      } catch(e) {
        console.error(e);
        logger.error('保存海报图片失败, 请稍后重试~',e);
      }
    });
    

createHaibaoUrl(canvasId, canvasStyle) {
    return new Promise((resolve, reject) => {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: this.computedWAndD(canvasStyle.width),
        height: this.computedWAndD(canvasStyle.height),
        destWidth: canvasStyle.width*3,
        destHeight: canvasStyle.height*3,
        canvasId: canvasId,
        fileType: 'png',
        success(res) {
          resolve(res.tempFilePath);
        },
        fail(error) {
          reject(error);
        }
      })
    });
  },
```

# 代码如下
https://github.com/guxiansheng1991/wx-miniprogram-canvas-draw-2