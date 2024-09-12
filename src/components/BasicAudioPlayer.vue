<script setup lang="ts">
import { ref } from 'vue'
import VueAudioPlayer from '@liripeng/vue-audio-player'

const props = defineProps({
  audioList: []
})

const emit = defineEmits(['onPlay', 'onPause'])

// 声明底层播放器实例，该值会在组建挂载后被自动绑定
const rawAudioPlayer: any = ref(null)

function play() {
  rawAudioPlayer.value.play()
}

function pause() {
  rawAudioPlayer.value.pause()
}

function seekTime(seekTime: number) {
  rawAudioPlayer.value.$refs.audio.currentTime = seekTime / 1000
}

defineExpose({
  play,
  pause,
  seekTime
})
</script>

<template>
  <div>
    <div class="name">{{ audioList[0].title as string }}</div>
    <VueAudioPlayer
      ref="rawAudioPlayer"
      :audio-list="audioList"
      @play="$emit('onPlay')"
      @pause="$emit('onPause')"
      @progress-end="$emit('progressEnd')"
      @playing="$emit('playing')"
      @loadedmetadata="$emit('loadedmetadata')"
    >
    </VueAudioPlayer>
  </div>
</template>
