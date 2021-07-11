# 手把手教你用canvas绘制小程序海报（一）

在工作中，多多少少都会遇到裂变活动的需求。裂变活动，分享海报也是必不可少的一部分。因此，了解一下生成海报的方法还是非常有必要的。

**背景图+标题+内容+专属头像、昵称+引流二维码**是构成海报设计的基本要素。这些基本要素，即是我们需要在代码上实现的功能。可以简单的理解为，要**绘制（块、图片）元素、单、多行文字**到 Canvas中并生成一张海报图片。

分析了要实现的功能，我的脑海浮现出了三种实现的方法：

1. 解决掉提需求的人。

   ![表情包](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc2b4a8f-6ab2-47b5-b744-f0c5745aa5c0/ee888832-c4d3-4b79-b24f-2255dc4190c8.jpg)

   看了看产品那沙包大的拳头，我还是先暂时放过他吧（绝对不是我怕我被他解决掉！）。

2. “后端带哥，帮忙在服务端生成一下海报呗。您写完，这周的白米饭我全都包了！”

   后端带哥：<img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc2b4a8f-6ab2-47b5-b744-f0c5745aa5c0/dc86b6ca-239e-4727-a39f-abdf47dd8e0f.jpg" />

   看来一周白米饭已经不够诱惑了，我们之间彻底玩完了。

3. 自己实现所有功能，确保代码的完全可控性。

   为什么不用插件呢？正所谓，授人以鱼不如授人以渔...好吧，其实就是因为一直没接触过 canvas，想学习一下。

   ![表情包](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc2b4a8f-6ab2-47b5-b744-f0c5745aa5c0/bbd05d09-1017-4a19-a932-e9cdd141a9fb.jpg)



*Talk is  cheap, Show me the demo.*

<img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc2b4a8f-6ab2-47b5-b744-f0c5745aa5c0/597e3dab-73bf-4838-b6d4-2d1999a2c79c.gif" alt="demo gif" style="zoom:50%;" />



## 绘制弧矩形（块、图片）元素

小程序的实现，和在web端操作 css差别可大了。主要的问题/方法是下面三个：

### 绘制弧矩形路径

canvas并没有提供绘制圆角矩形的方法，因此我们需要以另一种方法来实现它。方法的核心是一个叫`CanvasContext.arcTo`的方法，我们先来看看它的使用的用法：

> `CanvasRenderingContext2D.arcTo()`是 Canvas 2D API 根据控制点和半径绘制圆弧路径，使用当前的描点(前一个moveTo或lineTo等函数的止点)。根据当前描点与给定的控制点1连接的直线，和控制点1与控制点2连接的直线，作为使用指定半径的圆的**切线**，画出两条切线之间的弧线路径。

你可以想象成，一个圆 ⚪ 拼命地往一个四角 ∠ 挤，挤到极限时，就是我们要的弧线了。<i>控制点 1 与控制点 2 连接的直线，作为使用指定半径的圆的**切线**，所以这条线也是会被无线延长的。</i>千言万语不如一图：

![acrTo示例](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc2b4a8f-6ab2-47b5-b744-f0c5745aa5c0/7fd06df3-e982-42d3-8eb7-440b2fa30c9e.jpg)

那么，一个矩形的圆角就显得如此的理所当然：

![acrTo示例](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc2b4a8f-6ab2-47b5-b744-f0c5745aa5c0/faa35fa3-5d0d-42d4-a152-371c0340f5e9.jpg)



```js
// 绘制弧矩形路径
canvasToDrawArcRectPath(ctx, x, y, w, h, r = 0) {
    const [
        topLeftRadius,
        topRightRadius,
        bottomRightRadius,
        BottomLeftRadius
    ] = Array.isArray(r) ? r : [r, r, r, r]
    /**
       * 1. 移动到圆弧起点
       *
       * 2. 绘制上直线
       * 3. 绘制右上角圆弧
       *
       * 4. 绘制右直线
       * 5. 绘制右下圆弧
       *
       * 6. 绘制下直线
       * 7. 绘制左下圆弧
       *
       * 8. 绘制左直线
       * 9. 绘制左上圆弧
       */
    ctx.beginPath()

    ctx.moveTo(x + topLeftRadius, y)

    // 右上
    ctx.lineTo(x + w - topRightRadius, y)
    ctx.arcTo(x + w, y, x + w, y + topRightRadius, topRightRadius)

    // 右下
    ctx.lineTo(x + w, y + h - bottomRightRadius)
    ctx.arcTo(
        x + w,
        y + h,
        x + w - bottomRightRadius,
        y + h,
        bottomRightRadius
    )

    // 左下
    ctx.lineTo(x + BottomLeftRadius, y + h)
    ctx.arcTo(x, y + h, x, y + h - BottomLeftRadius, BottomLeftRadius)

    // 左上
    ctx.lineTo(x, y + topLeftRadius)
    ctx.arcTo(x, y, x + topLeftRadius, y, topLeftRadius)

    ctx.closePath()
}
```



### 裁剪图片

绘制图片时，往往我们需要对原图进行剪切才能得到我们需要的样式。在我们调用`CanvasContext.clip()`进行剪切时，之后的绘图都会被限制在被剪切的区域内（不能访问画布上的其他区域）。因此在使用 `clip` 方法前通过使用 `save` 方法对当前画布区域进行保存，在裁剪完图片后通过`restore`方法对其进行恢复。

```js
ctx.save() // 保存画布区域

this.canvasToDrawArcRectPath(ctx, x, y, width, height, radius) // 绘制弧矩形路径

ctx.clip() // 剪切成弧矩形路径

const { path: tempImageUrl } = await this.uniGetImageInfoSync(url)
ctx.drawImage(tempImageUrl, x, y, width, height) // 在剪切成弧矩形路径后绘制图片

ctx.restore() // 恢复画布区域
```

![裁剪示例](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc2b4a8f-6ab2-47b5-b744-f0c5745aa5c0/dc58cb9e-225c-4319-9189-3dfd10bcf91e.jpg)

### 绘制既有背景又有边框还有圆角的元素

当图片既有背景又有边框又有圆角时，我们就需要以一种取巧的方法来实现：“叠罗汉”。

因为canvas的"图层"遵循先来**后来居上**原则，后绘制的会盖在先绘制的"图层"上。所以，我们要按顺序的：

1. 绘制边框并填充
2. 绘制背景并填充
3. 绘制块、图片元素

*`CanvasContext.strokeRect`能更好得达到绘制边框功能，但它无法设置圆角 ，所以不使用。*

绘制出来的效果如图：

![表情包](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc2b4a8f-6ab2-47b5-b744-f0c5745aa5c0/6bf4cb21-5926-477a-8fa2-8add9c947b9c.gif)

```js
// 绘制块元素
canvasToDrawBlock(ctx, params) {
    return new Promise(async (resolve) => {
        const {
            x,
            y,
            url,
            width,
            height,
            radius,
            border,
            borderColor,
            backgroundColor
        } = params

        if (border) {
            ctx.setFillStyle(borderColor ?? '#fff')
            this.canvasToDrawArcRectPath(
                ctx,
                x - border,
                y - border,
                width + border * 2,
                height + border * 2,
                radius
			)
            ctx.fill()
        }

        if (backgroundColor) {
            ctx.setFillStyle(backgroundColor)
            this.canvasToDrawArcRectPath(ctx, x, y, width, height, radius)
            ctx.fill()
        }

        if (url) {
            ctx.save()

            this.canvasToDrawArcRectPath(ctx, x, y, width, height, radius)

            ctx.clip()

            const { path: tempImageUrl } = await this.uniGetImageInfoSync(url)
            ctx.drawImage(tempImageUrl, x, y, width, height)
        }

        ctx.restore()
        resolve()
    })
}
```



## 绘制单、多行文字

通常来说，海报会出现多行的文字。但canvas对文字排版的支持很弱，使我们没办法像使用CSS排版一样愉快的使用canvas进行文字排版。canvas绘制文字时，只会一股脑的在单行上一直画下去而不会根据容器宽度自动换行。

好在canvas中提供了`CanvasContext.measureText(string text)返回文本宽度`的接口。因此，我们只需要把文字逐个计算宽度并绘制，主要步骤如下：

1. 计算当前文字加下一个文字的文本宽度
2. 文本宽度未超出容器宽度，则继续加入下一个文字的文本宽度
3. 当文本宽度大于最大宽度时, 在画布上绘制被填充的文本
4. 每绘制完一行，则根据设定的`lineHeight`更新文本绘制的 y轴，重置当前文字，继续重复1、2、3的步骤。

需要注意的是，canvas 绘制文字有自己的基准规则，在不同系统设备上各个基准都不太一样，导致文本在不同设备上 y轴的位置都不一样。唯独 `middel` 的样式在各个平台上表现是一致的，所以我们可以设置`ctx.textBaseline = 'middle'`，再给文本的 y轴增加`fontSize / 2`的高度，就可以保证在各个平台上文本y轴和设计稿保持一致。**这个处理方法来来自 [2dunn  如何用 canvas 绘制文字段落](https://juejin.cn/post/6844903870276206606#heading-19)**。

![文本绘制](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc2b4a8f-6ab2-47b5-b744-f0c5745aa5c0/1b45a608-01d1-46d8-aac7-49c4d6984b73.jpg)

```js
// 绘制文字
canvasToDrawText(ctx, canvasParam) {
    const {
        x,
        y,
        text,
        fontWeight = 'normal',
        fontSize = 40,
        lineHeight,
        maxWidth,
        textAlign = 'left',
        color = '#323233'
    } = canvasParam

    if (typeof text !== 'string') {
        return
    }

    ctx.font = `normal ${fontWeight} ${fontSize}px sans-serif`

    ctx.setFillStyle(color)
    ctx.textBaseline = 'middle'
    ctx.setTextAlign(textAlign)

    function drawLineText(lineText, __y) {
        let __lineText = lineText
        if (__lineText[0] === ' ') {
            __lineText = __lineText.substr(1)
        }
        ctx.fillText(__lineText, x, __y + fontSize / 2)
    }

    if (maxWidth) {
        const arrayText = text.split('')

        let lineText = ''
        let __y = y
        for (let index = 0; index < arrayText.length; index++) {
            const aryTextItem = arrayText[index]
            lineText += aryTextItem
            /**
           * 1. 计算当前文字加下一个文字的文本宽度
           * 2. 当文本宽度大于最大宽度时, 在画布上绘制被填充的文本
           * 3. __y + fontSize / 2 的问题
           * 4. 设置下一行文本的 y轴位置, 重置当前文本信息
           */
            const { width: textMetrics } = ctx.measureText(
                lineText + (arrayText[index + 1] ?? '')
                           )
                if (textMetrics > maxWidth) {
                // 绘制一行文字, 如果第一个文字是空格，则删除
                drawLineText(lineText, __y)
                __y += lineHeight ?? fontSize
                lineText = ''
            }
            }
            // 绘制最后一行文字, 如果第一个文字是空格，则删除
            drawLineText(lineText, __y)
            return
        }
        ctx.fillText(text, x, y + fontSize / 2)
    }
```



## 绘制海报并生成图片临时文件地址

在绘制海报并生成图片临时文件地址过程中，绘制图片是有一个*异步的获取图片信息*的过程。因此，为了确保所有需要的元素都能绘制完，我们需要让*绘制过程同步执行下去*。确保所有元素都绘制完成后，才能调用`CanvasContext.draw`方法。

`CanvasContext.draw`绘制完后，我们再调用`uni.canvasToTempFilePath`把当前画布指定区域的内容导出海报图片临时地址。需要注意的是，在自定义组件下，需要在**第三个参数上绑定当前组件实例的this**，以操作组件内canvas 组件

```js
// 绘制 canvas
canvasToDraw() {
    return new Promise(async (resolve) => {
        const [ctx, canvasId] = this.createCanvasContext()
        const { width, height, backgroundImageUrl, backgroundColor } =
              this.posterParams

        if (backgroundColor) {
            this.canvasToDrawBlock(ctx, {
                x: 0,
                y: 0,
                width,
                height,
                backgroundColor
            })
        }

        // 绘制背景图
        if (backgroundImageUrl) {
            const { path: tempBackgroundImageUrl } =
                  await this.uniGetImageInfoSync(backgroundImageUrl)
            ctx.drawImage(tempBackgroundImageUrl, 0, 0, width, height)
        }

        // 绘制其他元素
        for (const canvasParam of this.posterParams.list) {
            const { type } = canvasParam

            if (type === 'text') {
                this.canvasToDrawText(ctx, canvasParam)
            }

            if (type === 'block') {
                await this.canvasToDrawBlock(ctx, canvasParam)
            }
        }

        ctx.draw(false, async () => {
            const { tempFilePath } = await this.canvasToTempFilePath(canvasId, {})
            resolve([canvasId, tempFilePath])
        })
    })
}

// canvas 导出图片临时地址
canvasToTempFilePath(canvasId, params) {
    return new Promise((resolve, reject) => {
        uni.canvasToTempFilePath(
            {
                canvasId,
                fileType: 'jpg',
                ...params,
                success: resolve,
                fail: reject
            },
            this
        )
    })
}
```



## 保存临时文件到本地及缓存

我们的海报可能几个月都不会更换，但现在却每一次点击都要重新绘制一遍。如果海报的内容更丰富一点，那性能差一点的机型就会出现明显的卡顿。虽然微信团队在19年对小程序的 Canvas组件进行了一波渲染性能提升。但我们也不能偷懒，对特点的场景也是要做好优化来提升用户体验的。

![小程序新 Canvas接口公测](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc2b4a8f-6ab2-47b5-b744-f0c5745aa5c0/fa756780-1fc4-44b8-a21b-82738dae2a21.png)

既然生成的海报可能几个月都不会更换，那我们完全可以在**第一次绘制完海报后，就把文件存入用户本地缓存**下次直接使用就好。具体的步骤如下：

1. 绘制 Canvas并*获取到海报图片临时地址*。
2. 海报图片临时地址通过`uni.getFileSystemManager().saveFile`方法存入到用户本地，获取到*存储后的文件路径 (本地路径)*。
3. 将存储后的文件路径 (本地路径)通过`uni.setStorageSync`存入缓存中，方便判断是否已经生成过该海报。

步骤看似很理想，但还是欠缺很多考虑。海报生成一次后，**除非用户手动清除缓存，不然海报图片永远不会更新**、海报参数设置错误，也只能求用户手动清除缓存，不然也无法更新，造成不必要的麻烦。因此，我们希望，海报图存入缓存时，需要有一个**过期时间**、可以**通过接口决定是否直接更新海报**。



**过期时间**很好解决，存入缓存时把**当前时间戳+过期时间的合**也存入进去。下次取的时候，判断**存入的时间戳是否大于当前时间戳**就知道是否过期了。

```js
const storage = {
  get(key) {
    const { value, expires } = uni.getStorageSync(key)

    if (expires && expires < Date.parse(new Date())) {
      uni.removeStorageSync(key)
      return undefined
    }
    return value
  },
  set(key, value, expires) {
    // expires 秒
    uni.setStorageSync(key, {
      value,
      expires: expires ? Date.parse(new Date()) + expires * 1000 : undefined
    })
  }
}

export { storage }
```

**通过接口决定是否直接更新海报**就更好解决了，组件只需要接收一个**disableCache**的值，通过这个值来判断是否需要强制更新就好了。举个栗子：

```js
<poster
	:xxx="xxx"
	:disable-cache="true"
/>

props: {
  // 海报存入缓存时的 key
  cacheKey: {
    type: String,
    default: 'cache-poster'
  },
  // 是否禁用缓存（是否需要强制刷新）
  disableCache: {
    type: Boolean,
    default: false
  }
  ...
}
  
methods: {
  pageInit() {
    const posterImage = storage.get(this.cacheKey)
    // 缓存中存在图片且不禁用缓存（不需要强制刷新）时，不再绘制Canvas
    if (posterImage && !this.disableCache) {
      this.posterImage = posterImage
      return
    }
    // ...绘制海报
  }
}
```

最后，我们通过微信提供的文件管理器把文件存入用户本地`wx.getFileSystemManager()`并把回调地址通过自己的`storage.set`存入到缓存中即可。

```js
const fs = wx.getFileSystemManager()

fs.saveFile({
  tempFilePath: tempCanvasFilePaths, // 传入一个本地临时文件路径
  success: (res) => {
    storage.set(this.cacheKey, res.savedFilePath, 86400000)
    this.posterImage = res.savedFilePath
  }
})
```

因此，我们完整的步骤如下：

1. 缓存中存在图片且不禁用缓存（不需要强制刷新）时：
   1. 直接使用缓存的海报图片地址。
   2. 不再生成 Canvas组件。
   3. 不再往下执行其余步骤。
2. 缓存中不存在图片或禁用缓存（需要强制更新）时：
   1. 绘制 Canvas并*获取到海报图片临时地址*。
   2. 海报图片临时地址通过`uni.getFileSystemManager().saveFile`方法存入到用户本地，获取到*存储后的文件路径 (本地路径)*。
   3. 将存储后的文件路径 (本地路径)自己的`storage.set`存入缓存中并设置过期时间，方便判断是否已经生成过该海报或是否需要更新海报。

## 保存海报图片到相册

这里，我们直接调用微信提供的 api即可做到保存海报图片到相册。但这里的前提是，用户授权了**保存图片到系统相册**的权限。

需要注意的是，当用户首次触发弹出授权保存图片到系统相册弹窗，点击了拒绝授权时，下一次再点击授权都会直接进入fail的回调中且不显示授权弹窗。虽然没找到微信官方文档的说明，但也可得知，**授权保存图片到系统相册只会弹窗提醒一次**。所以，再用户拒绝授权后，我们需要在**fail的回调中手动调起客户端小程序设置界面 uni.openSetting**。

需要注意的是，在 fail回调中直接调用 uni.openSetting是无效的，因为微信要求：**注意：[2.3.0](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) 版本开始，用户发生点击行为后，才可以跳转打开设置页，管理授权信息。[详情](https://developers.weixin.qq.com/community/develop/doc/000cea2305cc5047af5733de751008)**。为了触发，我们就需要**先弹个模态对话框uni.showModal触发用户的点击行为，再调用uni.openSetting打开设置界面**。虽然比较麻烦，但这也符合交互逻辑，合情合理。

<img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc2b4a8f-6ab2-47b5-b744-f0c5745aa5c0/8a799395-ad5d-4f88-904a-ec4d63d0c72c.gif" alt="保存海报图片到相册" style="zoom:50%;" />

```js
// 保存图片到相册
saveImageToPhotosAlbum() {
    uni.saveImageToPhotosAlbum({
        filePath: this.posterImage,
        success: () => {
            this.$emit('close-overlay')
            uni.showToast({
                title: '保存图片成功',
                duration: 2000
            })
        },
        fail(err) {
            const { errMsg } = err
            if (errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
                uni.showModal({
                    title: '保存失败',
                    content: '请授权保存图片到“相册”的权限',
                    success: (result) => {
                        const { confirm } = result
                        if (confirm) {
                            uni.openSetting({})
                        }
                    }
                })
            }
        }
    })
}
```



## 写在最后

条条大路通罗马，如果觉得上面的方法实在是太麻烦了。那可以使用微信官方推荐的扩展组件[wxml-to-canvas](https://developers.weixin.qq.com/miniprogram/dev/extended/component-plus/wxml-to-canvas.html)在小程序内通过静态模板和样式绘制 canvas ，导出图片，可用于生成分享图等场景。

当然了，你也可以选择把生成海报的途径，转移到**web-view**上，那你想怎么弄就怎么弄了（滑稽.jpg）。但缺点也很明显：*web-view容器会自动铺满整个小程序页面，**个人类型的小程序暂不支持使用。***

功能暂时就这些了，如果有什么觉得重要的功能需求，可以在 issue中提出。后续也可能加入一个可视化操作海报参数的页面。什么时候？下次一定！



**DEMO [Github仓库地址](https://github.com/mirai027/uni-poster)**

**Blog [Blog 地址](https://mirai027.github.io/blog/mini-program/uniapp/poster.html)**



小程序太阳码（**只做 demo演示**）

<img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc2b4a8f-6ab2-47b5-b744-f0c5745aa5c0/5cf712a8-1c66-4143-87a5-f3cc3ecd44a3.jpg" alt="小程序太阳码" style="zoom: 25%;" />

## 参考资料

1. [张鑫旭 canvas文本绘制自动换行、字间距、竖排等实现](https://www.zhangxinxu.com/wordpress/2018/02/canvas-text-break-line-letter-spacing-vertical/)
2. [2dunn  更优雅地基于 canvas 在前端画海报](https://juejin.cn/post/6844903870276206606#heading-19)
3. [fanbox抽奖锦鲤小程序2.0总结](https://jelly.jd.com/article/5ea2a4dd10f7500156d49387) （海报图样式）



