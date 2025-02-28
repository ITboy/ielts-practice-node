<script setup>
import { ref } from 'vue'

const props = defineProps({
  playItems: {
    require: true,
    default: () => [],
    type: Array
  },
  editable: Boolean
})

const emit = defineEmits(['setShortCutKeyEditable', 'onClickTranscriptItem'])

let currentItemIndex = ref(-1)
let currentEditIndex = ref(-1)

function setEditable(state, index) {
  console.log('[PlayTranscript] ' + 'state: ' + state + ', index: ' + index)
  if (state) {
    //document.getElementsByTagName('textarea')[index].focus()
    this.$refs['text-' + index][0].focus()
  } else {
    index = currentEditIndex.value
    console.log('[PlayTranscript] ' + 'blur() index: ' + index)
    this.$refs['text-' + index][0].blur()
  }
}

function onFocusOrBlur(state, index) {
  console.log('[PlayTranscript] ' + 'onFocusOrBlur: ' + state + ', index: ' + index)
  if (state) {
    currentEditIndex.value = index
  } else {
    currentEditIndex.value = -1
  }
  emit('setShortCutKeyEditable', state)
}

function scrollToMiddle(self, index) {
  const chosenTr = self.$refs['tr-' + index][0]
  const tbody = chosenTr.parentElement
  const viewHeight = tbody.clientHeight
  const offsetTop = chosenTr.offsetTop
  const scrollPercent = 2 / 5
  let scrollPosition = offsetTop - scrollPercent * viewHeight
  if (scrollPosition > 0) {
    tbody.scrollTo(0, scrollPosition)
  }
}

function chooseItem(self, index) {
  currentItemIndex.value = index
  scrollToMiddle(self, index)
}

function onClick(index) {
  emit('onClickTranscriptItem', index)
}

defineExpose({ setEditable, chooseItem })
</script>
<template>
  <div class="transcript">
    <table class="listen-table">
      <thead>
        <tr>
          <th>
            <img src="https://ai-oss3.oss-cn-shenzhen.aliyuncs.com/operate/295_1656311916525.png" />
            <label style="font-size: 16px">原文/译文</label
            ><span style="font-size: 14px">点击音频原文区的内容/空白会跳转播放至对应的音频</span>
          </th>
          <th class="listen-write">
            <img src="https://ai-oss3.oss-cn-shenzhen.aliyuncs.com/operate/295_1656311916525.png" />
            <label style="font-size: 16px">我的听写</label
            ><span style="font-size: 14px">单击输入</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(playItem, index) in playItems"
          :key="index"
          :class="[currentItemIndex == index ? 'lt-a-active' : '']"
          :ref="'tr-' + index"
          @click="onClick(index)"
        >
          <td class="listen-read">
            <div class="listen-flex">
              <span>{{ index + 1 }}</span>
              <div class="subtext">{{ playItem.english }}</div>
            </div>
          </td>
          <td class="listen-write">
            <textarea
              text-index="1"
              :ref="'text-' + index"
              data-adaptheight=""
              contenteditable="true"
              placeholder="在此输入您的听写内容，按键盘Tab键进入下一个输入框"
              class="textarea-input"
              style="
                min-height: 50px;
                padding: 15px;
                box-sizing: border-box;
                overflow-y: hidden;
                height: 50px;
              "
              @focus="onFocusOrBlur(true, index)"
              @blur="onFocusOrBlur(false, index)"
            ></textarea>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.transcript {
  width: auto;
  margin-right: 15px;
  scroll-behavior: smooth;
}

tr {
  padding: 0rem;
  line-height: 18px;
  font-size: 15px;
  color: #333333;
  font-size: 14px;
  cursor: pointer;
}

.lt-a-active {
  color: #ff4b40;
  background-color: #ffefee;
}

.subtext {
  width: 90%;
}

.textarea-input {
  min-height: 50px;
  padding: 15px;
  box-sizing: border-box;
  overflow-y: hidden;
  height: 50px;
}

.listen-table > tbody > tr > td > textarea {
  border: 0;
  width: 100%;
  outline: none;
  resize: none;
  background-color: transparent;
  overflow: hidden;
}

.listen-flex {
  display: flex;
  justify-content: space-between;
}

td.listen-write {
  padding: 0;
}

@media only screen and (max-width: 768px) {
  .listen-write {
    display: none;
  }
}

.listen-table {
  width: 100%;
  background-color: #dde1e2;
  border-radius: 5px;
}
.listen-table > tbody {
  display: block;
  height: 695px;
  overflow-y: auto;
  background-color: #ffffff;
  position: relative;
}
.listen-table > thead > tr > th {
  padding: 13px 0px 8px;
  width: 50%;
  text-align: left;
}
.listen-table > thead > tr > th > span {
  font-size: 14px;
  font-weight: 400;
  margin-left: 10px;
}
.listen-table > thead > tr > th > div > a {
  color: #1890ff !important;
  font-weight: 400;
  font-size: 14px;
}
.listen-table > thead > tr > th > div > a:hover {
  color: #1890ff !important;
}
.listen-table > thead > tr > th > img {
  width: 5px;
  vertical-align: text-bottom;
}
.listen-table > thead > tr > th > label {
  color: #383838;
  margin-left: 5px;
}
.listen-table > tbody > tr > td {
  border-bottom: 1px solid #dde1e291;
}
.listen-read {
  border-right: 1px solid #dde1e291;
}
.listen-table > tbody > tr > td > .listen-flex > img {
  width: 20px;
  align-self: center;
}
.listen-table > tbody > tr > td > .listen-flex > span {
  align-self: center;
}
table thead tr,
table tbody tr,
table tfoot tr {
  box-sizing: border-box;
  table-layout: fixed;
  display: table;
  width: 100%;
}
table tbody {
  display: block;
  width: calc(100% + 0px);
  height: 695px;
  overflow-y: auto;
  scroll-behavior: smooth;
}
.listen-table > tbody > tr > td > textarea {
  border: 0;
  width: 100%;
  outline: none;
  resize: none;
  background-color: transparent;
  overflow: hidden;
}
</style>
