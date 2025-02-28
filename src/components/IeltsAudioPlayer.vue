<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import BasicAudioPlayer from './BasicAudioPlayer.vue'
import PlayList from './PlayList.vue'
import PlayControl from './PlayControl.vue'
import PlayTranscript from './PlayTranscript.vue'
import ShortCutKey from './ShortCutKey.vue'

const props = defineProps({
  defaultBookNum: Number,
  defaultTestNum: Number,
  defaultPartNum: Number
})

// 声明子组建实例，组建被mounted后该值会被自动绑定
const basicAudioPlayer: any = ref(null)
const playTranscript: any = ref(null)
const shortCutKey: any = ref(null)

let bookNum = ref(props.defaultBookNum)
let testNum = ref(props.defaultTestNum)
let partNum = ref(props.defaultPartNum)
const videoPrefix = '/audio/ielts/'

// 数据源信息
let article = ref({
  playItems: []
})

// 播放状态
// 注意修改该状态能控制播放行为，值包括 playing, pausing, stop
let playStatus = ref('stop')

let currentItemIndex = ref(0)

// 播放选项

// 循环播放模式，支持no(不循环), single(单条循环), ab（ab循环）
let itemLoopMode = ref('no')
const supportItemLoopModes = ['no', 'single', 'ab']

// 循环播放次数
let itemLoopCount = ref(3)
let currentItemLoopCount = ref(0)

// ab播放索引
let loopPointA = ref(0)
let loopPointB = ref(99999)

// 控制上一句和下一句选中状态
let prevOrNext = ref('')

// 编辑区
let editable = ref(false)

// 播放列表
//let audioListName = ref('默认播放列表')
let audioList = ref([{ title: '', src: '' }])
//let currentAudioIndex = ref(0)

// 初始化数据并监听数据源变化及时更新
const GET_ARTICLE_URL = '/cambridge-listening/player/article?'

watchEffect(async () => {
  let response = await fetch(
    GET_ARTICLE_URL +
      new URLSearchParams({
        bookNum: bookNum.value + '',
        testNum: testNum.value + '',
        partNum: partNum.value + ''
      }).toString()
  )
  let json = await response.json()
  article.value.playItems = json.items
  let video =
    videoPrefix + 'book-' + bookNum.value + '/test-' + testNum.value + '/' + json.videoPath
  let title = '【听力】C' + bookNum.value + ' Test ' + testNum.value + ' Part ' + partNum.value
  audioList.value = [{ title, src: video }]

  playStatus.value = 'stop'
  currentItemIndex.value = 0
  itemLoopMode.value = 'no'
  itemLoopCount.value = 3
  currentItemLoopCount.value = 0
  loopPointA.value = 0
  loopPointB.value = article.value.playItems.length
  prevOrNext.value = ''
  basicAudioPlayer.value.pause()
})

function switchArticle(bookId, testId, partId) {
  bookNum.value = bookId
  testNum.value = testId
  partNum.value = partId
}

// 播放状态的唯一修改入口，该方法只能被底层播放器播放状态修改事件调用，外界要修改播放状态需调用playOrPause()方法
function onChangePlayStatus(newPlayStatus) {
  playStatus.value = newPlayStatus
}

function onProgressEnd() {
  console.log('time update')
}

function play() {
  basicAudioPlayer.value.play()
}

function pause() {
  basicAudioPlayer.value.pause()
}

function playPrev() {
  seekItem(currentItemIndex.value - 1)
  prevOrNext.value = 'prev'
}

function playNext() {
  seekItem(currentItemIndex.value + 1)
  prevOrNext.value = 'next'
}

function seekItem(index) {
  if (index < 0 || index >= article.value.playItems.length) {
    index = 0
  }
  let seekTime = article.value.playItems[index].startTime
  basicAudioPlayer.value.seekTime(seekTime)
  currentItemIndex.value = index
  currentItemLoopCount.value = 0

  if (playStatus.value != 'playing') {
    play()
  }

  // 如果突破ab循环边界，则认为要取消AB循环，重置AB循环参数
  if (currentItemIndex.value > loopPointB.value || currentItemIndex.value < loopPointA.value) {
    cancelAbLoop()
  }

  // 更新滚动位置
  updateTranscriptItemIndex(index)
}

function updateTranscriptItemIndex(index) {
  playTranscript.value.chooseItem(playTranscript.value, index)
}

function toggleItemLoopMode(mode) {
  itemLoopMode.value = mode
  currentItemLoopCount.value = 0
}

//supportItemLoopModes
function setNextLoopMode() {
  let currentIndex = supportItemLoopModes.findIndex((element) => element == itemLoopMode.value)
  currentIndex += 1
  if (currentIndex >= supportItemLoopModes.length) {
    currentIndex = 0
  }
  itemLoopMode.value = supportItemLoopModes[currentIndex]
}

function setItemLoopCount(count) {
  itemLoopCount.value = count
}

// 设置循环点A
function setLoopPointA(index) {
  // 设置时传入的index是从1开始的，需要减1后与数组索引对齐
  index--
  if (index < 0 || index >= article.value.playItems.length || index > loopPointB.value) {
    console.log('非法的pointA:' + index + ', 设置失败')
    return
  } else {
    loopPointA.value = index
  }

  if (itemLoopMode.value == 'ab') {
    // 矫正当前播放点
    if (currentItemIndex.value < loopPointA.value || currentItemIndex.value > loopPointB.value) {
      seekItem(loopPointA.value)
    }
  }
}

// 设置循环点B
function setLoopPointB(index) {
  // 设置时传入的index是从1开始的，需要减1后与数组索引对齐
  index--
  if (index < 0 || index >= article.value.playItems.length || index < loopPointA.value) {
    console.log('非法的pointB s:' + index + ', 设置失败')
  } else {
    loopPointB.value = index
  }

  if (itemLoopMode.value == 'ab') {
    // 矫正当前播放点
    if (currentItemIndex.value < loopPointA.value || currentItemIndex.value > loopPointB.value) {
      seekItem(loopPointA.value)
    }
  }
}

// 取消ab循环
function cancelAbLoop() {
  itemLoopMode.value = 'no'
}

/*
 * 检测当前播放时间是否超过指定item索引范围
 * true 表示超出范围
 * false 表示未超出
 */
function checkItemEnd(currentTime, itemIndex) {
  let playItems = article.value.playItems
  return playItems[itemIndex].startTime > currentTime || playItems[itemIndex].endTime < currentTime
}

function findItemIndex(currentTime) {
  let playItems = article.value.playItems
  for (let i = 0; i < playItems.length; i++) {
    if (playItems[i].startTime <= currentTime && playItems[i].endTime >= currentTime) {
      return i
    }
  }
  return 0
}

/* 循环播放控制和进度更新的入口
 * 总共解决以下几种情况：
 * 1. 正常音频往下播放到下一个条目，此时应当更新当前条目索引
 * 2. 拖动进度条，此时也应当更新当前条目索引
 * 3. 当前条目播放结束，此时有配置循环播放，要结合循环次数来决定是否调整播放进度
 */
function onPlaying() {
  let currentTime = basicAudioPlayer.value.$refs.rawAudioPlayer.currentTime * 1000

  let checkItemIndex = currentItemIndex.value
  if (itemLoopMode.value == 'ab' && loopPointB.value < checkItemIndex) {
    checkItemIndex = loopPointB.value
  }

  // 如果当前时间和currentItemIndex不一致，则更新currentItemIndex，解决拖动进度条以及顺序自动播放的场景
  if (checkItemEnd(currentTime, checkItemIndex)) {
    // 先检查循环播放选项，如果需要循环，则调整播放进度，如果需要继续往下，则更新当前条目索引即可
    if (itemLoopMode.value == 'single') {
      // 未达到循环播放次数，调整播放进度, 0表示无限循环
      if (itemLoopCount.value == 0 || currentItemLoopCount.value + 1 < itemLoopCount.value) {
        seekItem(currentItemIndex.value)
        currentItemLoopCount.value += 1
        console.log(
          '跳转到循环位置:' + currentItemIndex.value + '，当前循环次数' + currentItemLoopCount.value
        )
        return
      } else {
        // 达到循环次数，则更新索引，继续播放，同时清0循环播放次数
        console.log('已达到单曲循环次数')
        currentItemIndex.value = findItemIndex(currentTime)
        currentItemLoopCount.value = 0
      }
    } else if (itemLoopMode.value == 'ab') {
      // 触发ab循环边界检查
      if (currentItemIndex.value >= loopPointB.value) {
        // 未达到ab循环次数，调整进度，继续播放, 0表示无限循环
        if (itemLoopCount.value == 0 || currentItemLoopCount.value + 1 < itemLoopCount.value) {
          console.log(
            '跳转到A点循环位置:' + loopPointA.value + '，当前循环次数' + currentItemLoopCount.value
          )
          seekItem(loopPointA.value)
          currentItemLoopCount.value += 1
          return
        } else {
          // 达到循环次数，则更新索引，继续播放，同时清0循环播放次数
          console.log('已达到ab循环次数')
          currentItemIndex.value = findItemIndex(currentTime)
          currentItemLoopCount.value = 0
          cancelAbLoop()
        }
      } else {
        currentItemIndex.value = findItemIndex(currentTime)
        updateTranscriptItemIndex(currentItemIndex.value)
      }
    } else {
      currentItemIndex.value = findItemIndex(currentTime)
      updateTranscriptItemIndex(currentItemIndex.value)
    }
  }
}

function setTranscriptEditable(state) {
  if (editable.value != state) {
    console.log('set transcript editable:' + state)
    editable.value = state
    playTranscript.value.setEditable(state, currentItemIndex.value)
  } else {
    console.log('[setTranscriptEditable] ignore state: ' + state)
  }
}

function setShortCutKeyEditable(state) {
  if (editable.value != state) {
    console.log('set short key editable:' + state)
    editable.value = state
    shortCutKey.value.setEditable(state)
  } else {
    console.log('[setShortCutKeyEditable] ignore state: ' + state)
  }
}
</script>

<template>
  <BasicAudioPlayer
    ref="basicAudioPlayer"
    :audio-list="audioList"
    @on-play="onChangePlayStatus('playing')"
    @on-pause="onChangePlayStatus('pausing')"
    @progress-end="onProgressEnd()"
    @playing="onPlaying()"
  ></BasicAudioPlayer>

  <div class="main">
    <PlayTranscript
      ref="playTranscript"
      :play-items="article.playItems"
      :editable="editable"
      @choose-item="(index) => seekItem(index)"
      @set-short-cut-key-editable="(state) => setShortCutKeyEditable(state)"
    ></PlayTranscript>

    <div>
      <PlayControl
        ref="playControl"
        :playState="playStatus"
        :itemLoopMode="itemLoopMode"
        :itemLoopCount="itemLoopCount"
        :loopPointA="loopPointA"
        :loopPointB="loopPointB"
        :prevOrNext="prevOrNext"
        @play="play()"
        @pause="pause()"
        @play-prev="playPrev()"
        @play-next="playNext()"
        @toggle-item-loop="(mode) => toggleItemLoopMode(mode)"
      ></PlayControl>

      <PlayList
        @switch-article="(bookId, testId, partId) => switchArticle(bookId, testId, partId)"
      ></PlayList>
    </div>

    <ShortCutKey
      ref="shortCutKey"
      @pause-or-play="playStatus == 'playing' ? pause() : play()"
      @play-next="playNext()"
      @play-prev="playPrev()"
      @set-next-loop-mode="setNextLoopMode()"
      @set-loop-count="(count) => setItemLoopCount(count)"
      @set-point-a="(indexA) => setLoopPointA(indexA)"
      @set-point-b="(indexB) => setLoopPointB(indexB)"
      @set-transcript-editable="(state) => setTranscriptEditable(state)"
    ></ShortCutKey>
  </div>
</template>

<style scoped>
.main {
  height: 780px;
  width: 98%;
  display: flex;
  justify-content: space-between;
}
</style>
