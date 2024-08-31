<script setup>
import IeltsAudioPlayer from './components/IeltsAudioPlayer.vue'
</script>

<template>
  <header>
    <div class="logo_wrap">
      <img alt="IELTS Practice logo" class="logo" src="@/assets/logo.png" width="40" height="40" />
      <div style="display: inline-block">
        <div class="sp_d"></div>
        <span class="logo_text">雅思听力练习神器</span>
      </div>
    </div>
  </header>
  <IeltsAudioPlayer :defaultBookNum="19" :defaultTestNum="1" :defaultPartNum="1">
  </IeltsAudioPlayer>
</template>

<style scoped>
.logo_wrap {
  display: flex;
  line-height: 1.5;
  min-width: 1100px;
  background-color: white;
}

.sp_d {
  display: inline-block;
  border-left: 2px solid #949292;
  height: 40px;
  vertical-align: middle;
}

.logo_text {
  font-size: 23px;
  font-family: 'Microsoft YaHei', 微软雅黑;
  color: #1f1d1d;
  vertical-align: middle;
  padding-left: 10px;
}

.logo {
  display: block;
  margin: 0 1rem 0 0;
}
</style>
