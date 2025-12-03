<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  highlightNote?: string; // ハイライトする音名 (例: "C4")
  disabled?: boolean; // 全ての鍵盤を無効にするか
}>();

const emit = defineEmits<{
  (e: 'play', note: string): void; // 鍵盤がクリックされたときに音名をemitする
}>();

// 1オクターブの白鍵の音名
const whiteKeys = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];

const isHighlighted = (note: string) => {
  return props.highlightNote === note;
};

const handleClick = (note: string) => {
  if (!props.disabled) {
    emit('play', note);
  }
};

const keyClasses = (note: string) => {
  return {
    'piano-key': true,
    'white-key': true,
    'highlight': isHighlighted(note),
    'disabled': props.disabled,
  };
};
</script>

<template>
  <div class="piano-keyboard">
    <div
      v-for="key in whiteKeys"
      :key="key"
      :class="keyClasses(key)"
      @click="handleClick(key)"
    >
      {{ key.charAt(0) }}
    </div>
  </div>
</template>

<style scoped>
.piano-keyboard {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.piano-key {
  width: 60px;
  height: 150px;
  border: 1px solid #000;
  border-radius: 0 0 5px 5px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 10px;
  font-weight: bold;
  font-size: 1.2em;
  box-sizing: border-box;
  position: relative;
  cursor: pointer;
  background-color: #fff;
  z-index: 1; /* Make sure white keys are below black keys if any */
}

.white-key {
  background-color: #fff;
}

.piano-key.highlight {
  background-color: #ffeb3b; /* Highlight color (e.g., yellow) */
}

.piano-key.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Add some spacing between keys */
.piano-key + .piano-key {
  margin-left: -1px; /* Overlap borders */
}
</style>
