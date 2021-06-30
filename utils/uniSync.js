export function getUserProfileSync() {
  return new Promise((resolve) => {
    wx.getUserProfile({
      desc: '获取用户信息',
      success: resolve
    })
  })
}
