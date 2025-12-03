import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as Tone from 'tone'

export const useAudioStore = defineStore('audio', () => {
  const sampler = ref<Tone.Sampler | null>(null)
  const isLoaded = ref(false)
  let isInitialized = false

  const init = async () => {
    if (isInitialized) {
      return
    }

    // ユーザーのインタラクションによってのみ呼び出される
    await Tone.start()
    console.log('AudioContext started successfully via store.')
    
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
      onload: () => {
        isLoaded.value = true
        console.log('Sampler is loaded and ready to use.')
      },
    }).toDestination()

    isInitialized = true
  }

  const playNote = (note: string, duration: Tone.Unit.Time = '8n') => {
    if (sampler.value && isLoaded.value) {
      sampler.value.triggerAttackRelease(note, duration)
    } else {
      console.error('Sampler is not initialized or loaded.')
    }
  }

  return { sampler, isLoaded, init, playNote }
})
