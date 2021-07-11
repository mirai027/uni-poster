<template>
  <view class="content">
    <view class="product-container">
      <view class="sub-title">MAGICAL MIRAI</view>
      <view class="card-container">
        <view class="card-content">
          <image
            src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc2b4a8f-6ab2-47b5-b744-f0c5745aa5c0/45669415-ea60-4641-9377-590b041d4663.png"
            class="card-image"
            @click="previewImage"
          />
        </view>
        <view class="card-tail"></view>
      </view>
      <view class="title">
        F:NEX VOCALOID 初音未来 魔法未来 2020 Summer Ver
      </view>
      <view class="price">不要钱，免费送</view>
      <view class="share-btn" @tap="handleShare"> 分享好友获更多抽奖机会 </view>
      <view class="tips">参与抽奖后会同步关注店铺</view>
    </view>
    <view class="count-down-container">
      <view class="count-down">
        <view class="sub-title cd-sub-title">COUNT DOWN</view>
        <view class="cd-detail">
          <text>开奖倒计时</text>
          <view class="cd-time">
            <view class="time">20</view>
            <view class="colon">:</view>
            <view class="time">20</view>
            <view class="colon">:</view>
            <view class="time">20</view>
          </view>
          <view class="time-limit">2021-06-01 - 2021-07-01</view>
        </view>
      </view>
    </view>
    <view
      class="overlay"
      @touchmove.stop.prevent="moveHandle"
      @tap="showPosterOverlay = false"
      v-if="showPosterOverlay"
    >
      <poster
        :poster-params="posterParams"
        @close-overlay="showPosterOverlay = false"
      />
    </view>
  </view>
</template>

<script>
import poster from './poster.vue'
import { storage, getUserProfileSync } from '@/utils'

export default {
  components: {
    poster
  },
  data() {
    return {
      posterParams: {
        width: 750,
        height: 1334,
        backgroundColor: '#FFFFFF',
        backgroundImageUrl: '',
        list: [
          {
            type: 'block',
            x: 224.5,
            y: 20,
            url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc2b4a8f-6ab2-47b5-b744-f0c5745aa5c0/ba781d6d-7ea4-4785-94f3-56ae31de5b45.png',
            width: 301,
            height: 129
          },
          {
            type: 'block',
            x: 0,
            y: 200,
            width: 750,
            height: 500,
            backgroundColor: '#F1F1F1'
          },
          {
            type: 'block',
            x: 140,
            y: 215,
            url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc2b4a8f-6ab2-47b5-b744-f0c5745aa5c0/45669415-ea60-4641-9377-590b041d4663.png',
            width: 470,
            height: 470
          },
          {
            type: 'block',
            x: 35,
            y: 750,
            width: 680,
            height: 80,
            backgroundColor: '#181818',
            radius: 40
          },
          {
            type: 'text',
            x: 375,
            y: 774,
            text: '你的好友邀请你参与 Magical 2020 免费抽',
            fontSize: 32,
            color: '#fff',
            textAlign: 'center'
          },
          {
            type: 'text',
            x: 35,
            y: 880,
            text: 'F:NEX VOCALOID 初音未来 魔法未来 2020 Summer Ver.手办 附独家特典',
            fontSize: 34,
            color: '#323233',
            textAlign: 'left',
            lineHeight: 44,
            maxWidth: 680
          },
          {
            type: 'text',
            x: 35,
            y: 1000,
            text: '￥1269',
            fontWeight: 'bold',
            fontSize: 46,
            color: '#323233',
            textAlign: 'left'
          },
          {
            type: 'text',
            x: 715,
            y: 1014,
            text: '市场价  ￥2999',
            fontSize: 28,
            color: '#c8c9cc',
            textAlign: 'right'
          },
          {
            type: 'block',
            x: 375,
            y: 1145,
            width: 1,
            height: 90,
            backgroundColor: '#D2D2D2'
          },
          {
            type: 'text',
            x: 175,
            y: 1196,
            text: '邀请你参与',
            fontSize: 28,
            color: '#323233',
            textAlign: 'left'
          },
          {
            type: 'block',
            x: 470,
            y: 1130,
            url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc2b4a8f-6ab2-47b5-b744-f0c5745aa5c0/5cf712a8-1c66-4143-87a5-f3cc3ecd44a3.jpg',
            width: 120,
            height: 120,
            radius: 60
          },
          {
            type: 'text',
            x: 715,
            y: 1160,
            text: '长按扫码',
            fontSize: 24,
            color: '#c8c9cc',
            textAlign: 'right'
          },
          {
            type: 'text',
            x: 715,
            y: 1200,
            text: '查看详情',
            fontSize: 24,
            color: '#c8c9cc',
            textAlign: 'right'
          }
        ]
      },
      showPosterOverlay: false
    }
  },
  onLoad() {},
  methods: {
    previewImage() {
      uni.previewImage({
        urls: [
          'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc2b4a8f-6ab2-47b5-b744-f0c5745aa5c0/45669415-ea60-4641-9377-590b041d4663.png'
        ]
      })
    },
    moveHandle() {},
    async handleShare() {
      if (!storage.get('userProfile')) {
        const { userInfo } = await getUserProfileSync()
        storage.set('userProfile', userInfo, 60 * 60 * 24 * 10)
      }

      const userProfile = storage.get('userProfile')

      this.posterParams.list.push({
        type: 'block',
        x: 35,
        y: 1130,
        url: userProfile.avatarUrl,
        width: 120,
        height: 120,
        radius: 60
      })
      this.posterParams.list.push({
        type: 'text',
        x: 175,
        y: 1156,
        text: userProfile.nickName,
        fontSize: 28,
        color: '#323233',
        textAlign: 'left'
      })

      this.showPosterOverlay = true
    }
  },
  onShareAppMessage() {
    return {
      title: '我在参与抽奖，快来一起参与吧~',
      path: '/pages/index/index'
    }
  },
  onShareTimeline() {
    return {
      title: '我在参与抽奖，快来一起参与吧~'
    }
  }
}
</script>

<style lang="scss">
.content {
  .sub-title {
    font-size: 80rpx;
    font-weight: 600;
    color: $gray-7;
    opacity: 0.4;
    position: relative;
  }
  .product-container {
    padding: 0 30rpx;
    background-color: $gray-8;
    .card-container {
      width: 100%;
      height: 540rpx;
      display: flex;
      flex-direction: column;
      transform: translateY(-30rpx);
      .card-content {
        flex: 1;
        border-radius: $border-radius-lg;
        border-bottom-left-radius: 0;
        background-color: $white;
        @include flex-center();
        .card-image {
          width: 470rpx;
          height: 470rpx;
        }
      }
      .card-tail {
        width: 100%;
        height: 26rpx;
        background-color: $white;
        position: relative;
        overflow: hidden;
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 70rpx;
          border-top-left-radius: $border-radius-lg * 1.5;
          background-color: $gray-8;
        }
      }
    }
    .title {
      color: $white;
    }
    .price {
      margin: 30rpx 0 50rpx;
      font-size: $font-size-lg * 1.3;
      color: $white;
      font-weight: 600;
    }
    .share-btn {
      width: 600rpx;
      height: 40px;
      border-radius: 40rpx;
      background-color: $green;
      margin: 0 auto;
      @include flex-center();
      font-weight: 600;
    }
    .tips {
      font-size: $font-size-sm;
      text-align: center;
      padding: 30rpx 0 50rpx;
      color: $gray-5;
    }
  }
  .count-down-container {
    height: 180rpx;
    overflow: hidden;
    .count-down {
      background-color: $white;
      width: 690rpx;
      margin: 0 auto;
      align-items: center;
      border-radius: $border-radius-lg;
      transform: translateY(-24rpx);
      box-shadow: 0px 0px 10px $gray-5;
      .cd-sub-title {
        text-align: center;
        line-height: 1;
        color: $gray-4;
      }
      .cd-detail {
        margin-left: 20rpx;
        padding: 20rpx 0 24rpx;
        font-size: $font-size-md;
        display: flex;
        align-items: center;
        .cd-time {
          display: flex;
          align-items: center;
          margin-left: 10rpx;
          .time {
            width: 50rpx;
            height: 46rpx;
            line-height: 46rpx;
            text-align: center;
            background-color: $gray-8;
            color: $white;
            margin: 0 6rpx;
            border-radius: $border-radius-md;
          }
          .colon {
            font-weight: bolder;
            font-size: $font-size-lg;
          }
        }
      }
      .time-limit {
        height: 40rpx;
        line-height: 40rpx;
        font-size: $font-size-xs;
        background-color: $gray-8;
        padding: 0 16rpx;
        color: $white;
        margin-left: auto;
        border-top-left-radius: 20rpx;
        border-bottom-left-radius: 20rpx;
      }
    }
  }
  .overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    @include flex-center();
  }
}
</style>
