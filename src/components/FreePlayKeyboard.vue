<script setup lang="ts">
const props = defineProps<{
  highlightNote?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'play', note: string): void;
}>();

type WhiteKey = {
  note: string;
  label: string;
};

type BlackKey = {
  note: string;
  label: string;
  whiteIndex: number;
};

const whiteKeys: WhiteKey[] = [
  { note: 'C4', label: 'A' },
  { note: 'D4', label: 'S' },
  { note: 'E4', label: 'D' },
  { note: 'F4', label: 'F' },
  { note: 'G4', label: 'G' },
  { note: 'A4', label: 'H' },
  { note: 'B4', label: 'J' },
  { note: 'C5', label: 'K' },
  { note: 'D5', label: 'L' },
  { note: 'E5', label: ';' },
  { note: 'F5', label: ':' },
  { note: 'G5', label: ']' },
];

const blackKeys: BlackKey[] = [
  { note: 'C#4', label: 'W', whiteIndex: 0 },
  { note: 'D#4', label: 'E', whiteIndex: 1 },
  { note: 'F#4', label: 'T', whiteIndex: 3 },
  { note: 'G#4', label: 'Y', whiteIndex: 4 },
  { note: 'A#4', label: 'U', whiteIndex: 5 },
  { note: 'C#5', label: 'O', whiteIndex: 7 },
  { note: 'D#5', label: 'P', whiteIndex: 8 },
  { note: 'F#5', label: '[', whiteIndex: 10 },
];

const WHITE_KEY_WIDTH = 56;
const BLACK_KEY_WIDTH = 34;

const isHighlighted = (note: string) => props.highlightNote === note;

const play = (note: string) => {
  if (!props.disabled) {
    emit('play', note);
  }
};

const blackKeyStyle = (whiteIndex: number) => ({
  left: `${(whiteIndex + 1) * WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2}px`,
});
</script>

<template>
  <div class="keyboard-scroll">
    <div class="keyboard-frame" :class="{ disabled: props.disabled }">
      <div class="white-keys">
        <button
          v-for="key in whiteKeys"
          :key="key.note"
          type="button"
          class="white-key"
          :class="{ highlight: isHighlighted(key.note) }"
          @click="play(key.note)"
        >
          <span class="note-label">{{ key.note.replace(/\d+/g, '') }}</span>
          <span class="key-label">{{ key.label }}</span>
        </button>
      </div>

      <button
        v-for="key in blackKeys"
        :key="key.note"
        type="button"
        class="black-key"
        :class="{ highlight: isHighlighted(key.note) }"
        :style="blackKeyStyle(key.whiteIndex)"
        @click="play(key.note)"
      >
        <span class="key-label">{{ key.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.keyboard-scroll {
  width: 100%;
  overflow-x: auto;
  padding: 8px 0 16px;
}

.keyboard-frame {
  --white-key-width: 56px;
  --white-key-height: 190px;
  --black-key-width: 34px;
  --black-key-height: 118px;
  position: relative;
  width: calc(var(--white-key-width) * 12);
  min-width: calc(var(--white-key-width) * 12);
  margin: 0 auto;
  user-select: none;
}

.white-keys {
  display: flex;
}

.white-key,
.black-key {
  border: 1px solid #222;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.12s ease;
}

.white-key {
  width: var(--white-key-width);
  height: var(--white-key-height);
  background: linear-gradient(#fff, #f3f3f3);
  border-radius: 0 0 8px 8px;
  padding: 10px 4px;
}

.white-key:hover {
  background: linear-gradient(#fff, #e8f3ff);
}

.black-key {
  position: absolute;
  top: 0;
  width: var(--black-key-width);
  height: var(--black-key-height);
  background: linear-gradient(#262626, #000);
  color: #f5f5f5;
  border-radius: 0 0 6px 6px;
  z-index: 2;
  padding: 8px 4px;
}

.black-key:hover {
  background: linear-gradient(#383838, #111);
}

.note-label {
  font-size: 0.72rem;
  color: #6a6a6a;
  font-weight: 700;
}

.key-label {
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.black-key .key-label {
  margin-top: auto;
}

.highlight.white-key {
  background: linear-gradient(#fff8d9, #ffe68f);
}

.highlight.black-key {
  background: linear-gradient(#0f8f7f, #05655b);
}

.disabled {
  opacity: 0.65;
}

.disabled .white-key,
.disabled .black-key {
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .keyboard-frame {
    transform: scale(0.9);
    transform-origin: top left;
  }

  .keyboard-scroll {
    padding-bottom: 0;
  }
}
</style>
