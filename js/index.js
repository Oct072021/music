/**
 * 实现思路：页面布局（HTML + CSS) => 逻辑控制 => 从数据入手（lrc），格式解析（字符串 -> 对象数组） => 
 *          观察到audio标签的currentTime属性的值为‘秒’，因此把歌词对象数组的time属性变为‘秒’ => 使用溢出隐藏 + translate思路 => 
 *          控制歌词DOM节点偏移 => 找到当前播放时间对应的歌词,根据时间对应歌词完成歌词滚动效果
 */


/**
 * 将字符串格式的歌词转换为对象数组格式
 * @returns {Array} 歌词-对象数组格式
 */
const parseLrc = () => {
  const linesArr = lrc.split('\n')
  let result = []
  for (let i = 0; i < linesArr.length; i++) {
    const temp = linesArr[i].split(']')
    const time = temp[0].slice(1)
    let obj = {
      time: parseTime(time),
      words: temp[1]
    }
    result.push(obj)
  }
  return result
}

/**
 * 将一个时间字符串解析为数字（秒）
 * 原因：audio标签currentTime属性的值为 秒
 * @param {String} t 时间
 * @returns {Number} 时间
 */
const parseTime = (t) => {
  const temp = t.split(':')
  const time = +temp[0] * 60 + +temp[1]
  return time
}

const lrcArr = parseLrc()

/**
 * 找到当前播放器时间应该显示的歌词
 * @returns {Number} 对应歌词的位置
 */
const findIndex = () => {
  // 播放器当前时间
  const curTime = doms.audio.currentTime
  for (let i = 0; i < lrcArr.length; i++) {
    if (curTime < lrcArr[i].time) {
      return i - 1
    }
  }
  // 播放到最后一句
  return lrcArr.length - 1
}

/**
 * 初始化歌词信息
 */
const initLrc = () => {
  let frag = document.createDocumentFragment()
  for (let i = 0; i < lrcArr.length; i++) {
    let li = document.createElement('li')
    li.textContent = lrcArr[i].words
    // 直接往ul里添加元素，会修改DOM树从而导致修改Layout树，产生reflow，影响性能（虽然此处不会有太大影响）
    // doms.ul.appendChild(li)
    frag.appendChild(li)
  }
  doms.ul.appendChild(frag)
}

initLrc()

const containerHight = doms.container.clientHeight  // 容器高度
const liHeight = doms.ul.children[0].clientHeight  // li元素高度

const setOffset = () => {
  let index = findIndex()
  let offset = liHeight * (index + 0.5) - containerHight / 2
  doms.ul.style.transform = `translateY(-${offset}px)`
  let li = doms.ul.querySelector('.active')
  // 移除之前的active类样式 
  if (li) {
    li.classList.remove('active')
  }
  li = doms.ul.children[index]
  if (li) {
    li.classList.add('active')
  }
}

doms.audio.addEventListener('timeupdate', setOffset)