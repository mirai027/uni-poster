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
