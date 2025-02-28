<script setup>
import { ref } from 'vue'

const props = defineProps({
  playState: String, // pausing, playing
  itemLoopMode: String, // no, single, ab
  itemLoopCount: Number,
  loopPointA: Number,
  loopPointB: Number,
  prevOrNext: String // 控制上一句和下一句按钮高亮状态
})
const emit = defineEmits([
  'play',
  'pause',
  'playPrev',
  'playNext',
  'toggleLoop',
  'switchListLoopMode'
])

function playOrPause() {
  if (props.playState == 'playing') {
    emit('pause')
  } else {
    emit('play')
  }
}

function playPrev() {
  emit('playPrev')
}

function playNext() {
  emit('playNext')
}

function switchListLoopMode() {
  emit('switchListLoopMode')
}

function toggleSingleItemLoop() {
  if (props.itemLoopMode == 'single') {
    emit('toggleItemLoop', 'no')
  } else {
    emit('toggleItemLoop', 'single')
  }
}

function toggleAbItemLoop() {
  if (props.itemLoopMode == 'ab') {
    emit('toggleItemLoop', 'no')
  } else {
    emit('toggleItemLoop', 'ab')
  }
}
</script>

<template>
  <div class="control">
    <div class="control-line">
      <div class="button-group">
        <button
          class="big"
          :class="[playState == 'playing' ? 'listen-btn-active' : '']"
          @click="playOrPause()"
        >
          {{ playState == 'playing' ? '暂停' : '开始' }}播放
        </button>
      </div>
    </div>

    <div class="control-line">
      <div class="button-group">
        <button
          class="small"
          @click="playPrev()"
          :class="prevOrNext == 'prev' ? 'listen-btn-active' : ''"
        >
          上一句
        </button>
        <button
          class="small"
          @click="playNext()"
          :class="prevOrNext == 'next' ? 'listen-btn-active' : ''"
        >
          下一句
        </button>
      </div>
    </div>

    <div class="control-line">
      <div class="button-group">
        <button
          class="big"
          :class="[itemLoopMode == 'single' ? 'listen-btn-active' : '']"
          @click="toggleSingleItemLoop()"
        >
          单句循环
        </button>
        <div class="hint" style="width: 80px; line-height: 40px" v-if="itemLoopMode == 'single'">
          X {{ itemLoopCount }}
        </div>
      </div>
    </div>

    <div class="control-line">
      <div class="button-group">
        <button
          class="big"
          :class="[itemLoopMode == 'ab' ? 'listen-btn-active' : '']"
          @click="toggleAbItemLoop()"
        >
          AB循环
        </button>
        <div class="hint" style="width: 100px; font-size: 12px" v-if="itemLoopMode == 'ab'">
          <div>X {{ itemLoopCount }}</div>
          <div>{{ loopPointA + 1 }} -> {{ loopPointB + 1 }}</div>
        </div>
      </div>
    </div>

    <div class="control-line">
      <div class="button-group">
        <button class="big" @click="switchListLoopMode()">切换列表循环</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.control {
  max-width: 130px;
}

.control-line {
  width: 100%;
  max-height: 40px;
  display: flex;
  margin-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
}

button {
  border: 0;
  background-color: #ffefee;
  color: #ff4b40;
  margin: 0 0 0 0;
  height: 40px;
  border-radius: 4px;
  outline: none;
}

option {
  text-align: center;
}

.listen-btn-active {
  background-color: #ff4b40 !important;
  color: white !important;
}

.big {
  width: 110px;
  height: 40px;
}

.small {
  width: 51px;
  height: 40px;
  font-size: 13px;
}

div.button-group {
  width: 130px;
  display: flex;
  justify-content: space-evenly;
}

.hint {
  padding-left: 10px;
  padding-top: auto;
  padding-bottom: auto;
  font-size: 13px;
  color: #ff4b40;
}

button.listen-btn-active {
  background-color: #ff4b40 !important;
  color: white !important;
}
</style>
