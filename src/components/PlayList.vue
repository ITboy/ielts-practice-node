<script setup lang="ts">
import { ref } from 'vue'
import VTree from '@wsfe/vue-tree'

const emit = defineEmits(['switchArticle'])

function generateParts(bookId: string | number, testId: string | number, maxPartNum: number) {
  let parts = []
  for (let i = 1; i < maxPartNum + 1; i++) {
    parts.push({
      title: 'Part ' + i,
      id: 'part-' + bookId + '-' + testId + '-' + i
    })
  }
  return parts
}

function generateTests(bookId: string | number, maxTestNum: number) {
  let tests = []
  for (let i = 1; i < maxTestNum + 1; i++) {
    tests.push({
      title: 'Test ' + i,
      id: 'Test-' + bookId + '-' + i,
      children: generateParts(bookId, i, 4)
    })
  }
  return tests
}

function generateBooks(bookStart: any, bookEnd: number) {
  let books = []
  for (let i = bookEnd; i >= bookStart; i--) {
    books.push({
      title: '剑桥' + i,
      id: 'book-' + i,
      children: generateTests(i, 4)
    })
  }
  return books
}

function selectArticle(node: { id: string }) {
  let splitArr = node.id.split('-')
  const bookId = splitArr[1]
  const testId = splitArr[2]
  const partId = splitArr[3]
  emit('switchArticle', bookId, testId, partId)
}

const data = ref(generateBooks(4, 19))
</script>

<template>
  <div style="margin-top: 30px">
    <VTree :data="data" animation selectable @click="(node) => selectArticle(node)">
      <template #node="{ node }">
        <span :style="{ color: 'violet' }">{{ node.title }}</span>
      </template>
    </VTree>
  </div>
</template>

<style>
@import 'https://cdn.jsdelivr.net/npm/@wsfe/vue-tree@latest/dist/style.css';
</style>
