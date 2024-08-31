<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits([
  'pauseOrPlay', // 空格
  'playNext', // n
  'playPrev', // p
  'setNextLoopMode', // ll
  'setLoopCount', // l+数字，l0表示无限循环
  'setPointA', // a+数字
  'setPointB' // b+数字
])

const commands = [
  { finalPattern: /^\x20$/, event: 'pauseOrPlay' },
  { finalPattern: /^n$/, event: 'playNext' },
  { finalPattern: /^p$/, event: 'playPrev' },
  {
    pendingPattern: /^l$/,
    finalPattern: /^ll$/,
    event: 'setNextLoopMode',
    convert: Number.parseInt
  },
  {
    pendingPattern: /^l(\d{0,2})$/,
    finalPattern: /^l(\d{1,3})$/,
    event: 'setLoopCount',
    convert: Number.parseInt
  },
  {
    pendingPattern: /^a(\d{0,2})$/,
    finalPattern: /^a(\d{1,3})$/,
    event: 'setPointA',
    convert: Number.parseInt
  },
  {
    pendingPattern: /^b(\d{0,2})$/,
    finalPattern: /^b(\d{1,3})$/,
    event: 'setPointB',
    convert: Number.parseInt
  }
]

function allPendingCommands() {
  let allPendingCommands = []
  commands.forEach((command) => {
    if (command.pendingPattern != undefined) {
      allPendingCommands.push(command)
    }
  })
  return allPendingCommands
}

function allFinalCommands() {
  let allFinalCommands = []
  commands.forEach((command) => {
    if (command.finalPattern != undefined) {
      allFinalCommands.push(command)
    }
  })
  return allFinalCommands
}

let keyChain = ''
let pendingCommands = allPendingCommands()
let finalCommands = allFinalCommands()
let timeoutHandle

function clearKeyChain() {
  pendingCommands = allPendingCommands()
  finalCommands = allFinalCommands()
  keyChain = ''
}

function forceMakeDecision() {
  console.log('timeHandler' + timeoutHandle + ': forceMakeDecision')
  let matchCommand = finalCommands.filter((finalCommand) =>
    finalCommand.finalPattern.test(keyChain)
  )[0]
  if (matchCommand != undefined) {
    let arr = matchCommand.finalPattern.exec(keyChain)
    let eventData = arr[1]
    if (matchCommand.convert != undefined) {
      matchCommand.eventData = matchCommand.convert(eventData)
    }
    console.log('force match! event: ', matchCommand)
    emit(matchCommand.event, matchCommand.eventData)
  }
  clearKeyChain()
}

function matchFinalCommand(finalCommands, keyChain) {
  let matchCommand = finalCommands.filter((finalCommand) =>
    finalCommand.finalPattern.test(keyChain)
  )[0]
  if (matchCommand != undefined) {
    let arr = matchCommand.finalPattern.exec(keyChain)
    let eventData = arr[1]
    if (matchCommand.convert != undefined) {
      eventData = matchCommand.convert(eventData)
    }
    matchCommand.eventData = eventData
    console.log('match! event:', matchCommand)
  }
  return matchCommand
}

function onKeyPress(keyEvent) {
  keyEvent.preventDefault()
  let key = keyEvent.key
  const isDigitOrCharRegex = /^[\d|\w|\W]{1}$/
  if (!isDigitOrCharRegex.test(key)) {
    clearKeyChain()
    return
  }
  console.log('press: ' + key + ', keyChain: ' + keyChain + ', timeHandler: ' + timeoutHandle)
  // 如果是第一个按键，则创建计时器
  if (keyChain.length == 0) {
    timeoutHandle = setTimeout(forceMakeDecision, 600)
  }
  keyChain += key
  pendingCommands = pendingCommands.filter((pendingCommand) =>
    pendingCommand.pendingPattern.test(keyChain)
  )
  if (pendingCommands.length == 0) {
    let matchCommand = matchFinalCommand(finalCommands, keyChain)
    if (matchCommand != undefined) {
      emit(matchCommand.event, matchCommand.eventData)
      clearTimeout(timeoutHandle)
      clearKeyChain()
    }

    matchCommand = matchFinalCommand(finalCommands, keyChain.substring(0, keyChain.length - 1))
    if (matchCommand != undefined) {
      emit(matchCommand.event, matchCommand.eventData)
      clearTimeout(timeoutHandle)
      clearKeyChain()
    } else {
      clearKeyChain()
      clearTimeout(timeoutHandle)
    }
  }
}

function onKeyDown(event) {
  event.preventDefault()
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('keyup', onKeyPress)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
  document.removeEventListener('keyup', onKeyPress)
})
</script>

<template>
  <div display="hidden"></div>
</template>
