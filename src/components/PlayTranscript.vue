<script setup>
const props = defineProps({
  playItems: {
    require: true,
    default: () => [],
    type: Array
  },
  currentItemIndex: Number
})

const emit = defineEmits(['chooseItem'])

function chooseItem(index) {
  emit('chooseItem', index)
}
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
            ><span style="font-size: 14px"
              >单击输入，点击右侧<span style="color: red; font-weight: bold">保存</span
              >按钮保存听写内容</span
            >
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(playItem, index) in playItems"
          :class="[currentItemIndex == index ? 'lt-a-active' : '']"
          @click="chooseItem(index)"
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
}

tbody {
  height: 695px;
}

tr {
  line-height: 18px;
  font-size: 15px;
  padding: 1rem;
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

td.listen-read {
  padding: 16px 15px;
}

.listen-table {
  width: 100%;
  background-color: #dde1e2;
  border-radius: 5px;
}
.listen-table > tbody {
  height: 695px;
  overflow-y: auto;
  background-color: #ffffff;
  position: relative;
}
.listen-table > thead > tr > th {
  padding: 13px 0px 8px;
  width: 50%;
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
  border-left: 1px solid #dde1e291;
}
.listen-table > tbody > tr > td > .listen-flex > img {
  width: 20px;
  align-self: center;
}
.listen-table > tbody > tr > td > .listen-flex > span {
  align-self: center;
}
table {
  display: table;
  border-collapse: separate;
  box-sizing: border-box;
  text-indent: initial;
  unicode-bidi: isolate;
  line-height: normal;
  font-weight: normal;
  font-size: medium;
  font-style: normal;
  color: -internal-quirk-inherit;
  text-align: start;
  border-spacing: 2px;
  border-color: gray;
  white-space: normal;
  font-variant: normal;
}
</style>
