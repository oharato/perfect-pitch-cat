<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAudioStore } from '@/stores/audio';
import FreePlayKeyboard from '@/components/FreePlayKeyboard.vue';

const router = useRouter();
const audioStore = useAudioStore();

const isLoaded = computed(() => audioStore.isLoaded);
const currentPlayingNote = ref('');
const highlightNote = ref('');

// PCキーボードとピアノキーのマッピング
const keyboardMap: Record<string, string> = {
  'a': 'C4',
  's': 'D4',
  'd': 'E4',
  'f': 'F4',
  'g': 'G4',
  'h': 'A4',
  'j': 'B4',
  'k': 'C5',
  'l': 'D5',
  ';': 'E5',
  ':': 'F5',
  ']': 'G5',
  'w': 'C#4',
  'e': 'D#4',
  't': 'F#4',
  'y': 'G#4',
  'u': 'A#4',
  'o': 'C#5',
  'p': 'D#5',
  '[': 'F#5',
};

const playNote = async (note: string) => {
  await audioStore.playNote(note);
  highlightNote.value = note;
  currentPlayingNote.value = note;
  
  // ハイライトを300ms後に解除
  setTimeout(() => {
    if (highlightNote.value === note) {
      highlightNote.value = '';
    }
  }, 300);
};

const handleKeyDown = async (event: KeyboardEvent) => {
  const key = event.key.toLowerCase();
  const note = keyboardMap[key];
  
  if (note && !event.repeat) {
    await playNote(note);
  }
};

onMounted(() => {
  // キーボードイベントリスナーを追加
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  // クリーンアップ
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <div class="freeplay-container">
    <h1>フリープレイモード</h1>
    <p>PCキーボードまたはマウスでピアノを演奏できます</p>
    
    <template v-if="true">
      <div class="keyboard-guide">
        <h3>キーボード操作</h3>
        <div class="key-mappings">
          <span class="key-mapping white-map">白鍵: A S D F G H J K L ; : ]</span>
          <span class="key-mapping black-map">黒鍵: W E T Y U O P [</span>
        </div>
      </div>

      <FreePlayKeyboard 
        @play="playNote" 
        :highlight-note="highlightNote"
      />

      <div v-if="currentPlayingNote" class="current-note">
        現在の音: {{ currentPlayingNote.replace(/\d+/g, '') }}
      </div>
      <div v-if="!isLoaded" class="loading-state">
        <p>※クリックまたはキー入力で音源をロードします</p>
      </div>
    </template>

    <button @click="router.push({ name: 'level-select' })" class="back-button">
      メニューに戻る
    </button>
  </div>
</template>

<style scoped>
.freeplay-container {
  text-align: center;
  padding: 20px;
}

.keyboard-guide {
  margin: 30px auto;
  max-width: 600px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.keyboard-guide h3 {
  margin-bottom: 15px;
  color: #333;
}

.key-mappings {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.key-mapping {
  padding: 8px 15px;
  background-color: #ffffff;
  border: 2px solid #4CAF50;
  border-radius: 5px;
  font-weight: bold;
  font-size: 0.9em;
}

.white-map {
  border-color: #2e7d32;
}

.black-map {
  border-color: #1b1b1b;
}

.current-note {
  margin-top: 30px;
  font-size: 1.5em;
  font-weight: bold;
  color: #4CAF50;
  min-height: 40px;
}

.loading-state {
  margin-top: 15px;
  color: #666;
  font-size: 0.9em;
}

.back-button {
  margin-top: 30px;
  padding: 10px 20px;
  font-size: 1.2em;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.back-button:hover {
  background-color: #da190b;
}
</style>
