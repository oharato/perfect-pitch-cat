<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAudioStore } from '@/stores/audio'; // オーディオストアをインポート
import PianoKeyboard from '@/components/PianoKeyboard.vue';

const route = useRoute();
const router = useRouter();
const audioStore = useAudioStore(); // ストアのインスタンスを取得

// isLoadedをストアから直接参照
const isLoaded = computed(() => audioStore.isLoaded);

const level = ref<number>(parseInt(route.params.level as string));

const currentQuestion = ref(1);
const score = ref(0);
const correctAnswer = ref('');
const currentPlayingNote = ref('');
const isPlaying = ref(false);
const message = ref('');
const isGameActive = ref(false);
const highlightNote = ref('');

const totalQuestions = 10;
const c4Note = 'C4';
const whiteKeys = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];
const otherNotes = ['D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

const isStep1 = computed(() => level.value === 1);
const isStep2 = computed(() => level.value === 2);
const isGameFinished = computed(() => currentQuestion.value > totalQuestions);

// 新しいゲームを開始
const startNewGame = () => {
  currentQuestion.value = 1;
  score.value = 0;
  message.value = '';
  highlightNote.value = '';
  isGameActive.value = true;
  startNewQuestion();
};

// 新しい問題を開始
const startNewQuestion = () => {
  if (!isGameActive.value || isGameFinished.value || !isLoaded.value) return;

  if (isStep1.value) {
    generateQuestionStep1();
  } else if (isStep2.value) {
    generateQuestionStep2();
  }
  message.value = '';
  highlightNote.value = '';
  isPlaying.value = false;
};

// 問題を生成 (ステップ1用)
const generateQuestionStep1 = () => {
  const isC = Math.random() < 0.5;
  if (isC) {
    currentPlayingNote.value = c4Note;
    correctAnswer.value = c4Note;
  } else {
    const randomIndex = Math.floor(Math.random() * otherNotes.length);
    currentPlayingNote.value = otherNotes[randomIndex] as string;
    correctAnswer.value = otherNotes[randomIndex] as string;
  }
};

// 問題を生成 (ステップ2用)
const generateQuestionStep2 = () => {
  const randomIndex = Math.floor(Math.random() * whiteKeys.length);
  currentPlayingNote.value = whiteKeys[randomIndex] as string;
  correctAnswer.value = whiteKeys[randomIndex] as string;
};

// 音を再生
const playCurrentNote = async () => {
  if (!isLoaded.value || isPlaying.value) return;

  isPlaying.value = true;
  audioStore.playNote(currentPlayingNote.value);
  setTimeout(() => {
    isPlaying.value = false;
  }, 300); // 簡略化のため固定値
};

// 回答を処理
const handleAnswer = async (userAnswer: string | boolean) => {
  if (isPlaying.value || isGameFinished.value) return;

  if (isStep1.value) {
    handleAnswerStep1(userAnswer as boolean);
  } else if (isStep2.value) {
    handleAnswerStep2(userAnswer as string);
  }
};

// 回答を処理 (ステップ1用)
const handleAnswerStep1 = (isUserC: boolean) => {
  const actualIsC = currentPlayingNote.value === c4Note;
  if (isUserC === actualIsC) {
    score.value += 10;
    message.value = '正解！';
  }
  else {
    message.value = `不正解！正解は ${correctAnswer.value.replace(/\d+/g, '')} でした。`;
    highlightNote.value = correctAnswer.value;
    audioStore.playNote(correctAnswer.value);
  }
  processNextQuestion();
};

// 回答を処理 (ステップ2用)
const handleAnswerStep2 = (userNote: string) => {
  if (userNote === correctAnswer.value) {
    score.value += 10;
    message.value = '正解！';
  }
  else {
    message.value = `不正解！正解は ${correctAnswer.value.replace(/\d+/g, '')} でした。`;
    highlightNote.value = correctAnswer.value;
    audioStore.playNote(correctAnswer.value);
  }
  processNextQuestion();
};

// 次の問題へ進む、またはゲーム終了
const processNextQuestion = () => {
  setTimeout(() => {
    currentQuestion.value++;
    if (isGameFinished.value) {
      endGame();
    } else {
      startNewQuestion();
    }
  }, 1500);
};

// ゲーム終了処理
const endGame = () => {
  isGameActive.value = false;
  router.replace({ name: 'level-select', query: { score: score.value, level: level.value } });
};

// コンポーネントマウント時
onMounted(() => {
  if (isLoaded.value) {
    startNewGame();
  }
});

// isLoadedがtrueに変わったときにゲームを開始
watch(isLoaded, (newValue) => {
  if (newValue && !isGameActive.value) {
    startNewGame();
  }
});

// ルートパラメータが変更された場合にゲームを再初期化
watch(() => route.params.level, (newLevel) => {
  level.value = parseInt(newLevel as string);
  startNewGame();
});

</script>
<template>
  <div class="game-container">
    <template v-if="isGameActive && isLoaded">
      <h1>ゲーム画面 - レベル {{ level }}</h1>
      <p>問題 {{ currentQuestion }} / {{ totalQuestions }}</p>
      <p>スコア: {{ score }}</p>

      <button @click="playCurrentNote" :disabled="isPlaying">
        {{ isPlaying ? '再生中...' : '音を鳴らす' }}
      </button>

      <!-- ステップ1のコントロール -->
      <div v-if="isStep1" class="step1-controls">
        <button @click="handleAnswer(true)" :disabled="isPlaying">ドである</button>
        <button @click="handleAnswer(false)" :disabled="isPlaying">ドではない</button>
      </div>

      <!-- ステップ2のコントロール -->
      <div v-if="isStep2" class="step2-controls">
        <PianoKeyboard @play="handleAnswer" :highlight-note="highlightNote" :disabled="isPlaying" />
      </div>
      
      <p v-if="message">{{ message }}</p>

    </template>
    <template v-else-if="isGameFinished">
    </template>
    <template v-else>
      <p>音源をロード中...</p>
    </template>

    <button @click="router.push({ name: 'level-select' })" class="back-button">
      レベル選択に戻る
    </button>
  </div>
</template>

<style scoped>
/* スタイルは変更なし */
.game-container {
  text-align: center;
  padding: 20px;
}
.game-container button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 1.2em;
  cursor: pointer;
}
.step1-controls button {
  background-color: #4CAF50; /* Green */
  color: white;
  border: none;
  border-radius: 5px;
}
.step1-controls button:hover:not(:disabled) {
  background-color: #45a049;
}
.back-button {
  margin-top: 30px;
  background-color: #f44336; /* Red */
  color: white;
  border: none;
  border-radius: 5px;
}
.back-button:hover:not(:disabled) {
  background-color: #da190b;
}
</style>
