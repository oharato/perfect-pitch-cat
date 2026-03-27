import { ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import * as Tone from 'tone'

export const useAudioStore = defineStore('audio', () => {
  const sampler = shallowRef<Tone.Sampler | null>(null)
  const isLoaded = ref(false)
  let isInitialized = false

  const init = async () => {
    if (isInitialized) {
      return
    }

    try {
      // ユーザーインタラクションのタイミングでAudioContextを開始する
      await Tone.start()
      console.log('AudioContext started.')

      sampler.value = new Tone.Sampler({
        urls: {
          A1: 'A1.mp3',
          A2: 'A2.mp3',
          "C4": "C4.mp3",
          "D#4": "Ds4.mp3",
          "F#4": "Fs4.mp3",
          "A4": "A4.mp3",
        },
        release: 1,
        baseUrl: 'https://tonejs.github.io/audio/salamander/',
      }).toDestination()
      
      await Tone.loaded()
      isLoaded.value = true
      console.log('Sampler is loaded and ready to use.')
      
      isInitialized = true
    } catch (e) {
      console.error('Audio init error:', e)
      // Autoplay blocked or network error. We should retry initialized later.
      isInitialized = false
    }
  }

  const playNote = async (note: string, duration: Tone.Unit.Time = '8n') => {
    // まだ初期化されていない場合は初期化を試みる
    if (!isInitialized) {
      await init()
    }

    // ユーザーインタラクションのタイミングでAudioContextを開始・再開する
    if (Tone.context.state !== 'running') {
      try {
        await Tone.start()
        console.log('AudioContext started/resumed successfully.')
      } catch (e) {
        console.error('Failed to start AudioContext:', e)
        return
      }
    }

    if (sampler.value && isLoaded.value) {
      try {
        sampler.value.triggerAttackRelease(note, duration)
      } catch (e) {
        console.error('Failed to play note:', e)
      }
    } else {
      console.warn('Sampler is not initialized or loaded yet.')
    }
  }

  return { sampler, isLoaded, init, playNote }
})
