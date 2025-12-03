<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAudioStore } from '@/stores/audio'

const route = useRoute()
const router = useRouter()
const audioStore = useAudioStore()

const finalScore = ref<number | null>(null)
const playedLevel = ref<number | null>(null)

// Computed property to check if a result is available
const hasResult = computed(() => finalScore.value !== null && playedLevel.value !== null)

const selectLevel = async (level: number) => {
  // 最初にユーザー操作があったときにAudioContextとSamplerを初期化
  await audioStore.init()
  router.push({ name: 'game', params: { level } })
}

// Function to clear results display
const clearResult = () => {
  finalScore.value = null
  playedLevel.value = null
  router.replace({ query: {} }) // Clear query parameters
}

onMounted(() => {
  if (route.query.score && route.query.level) {
    finalScore.value = parseInt(route.query.score as string)
    playedLevel.value = parseInt(route.query.level as string)
  }
})
</script>

<template>
  <div class="level-select-container">
    <h1>絶対音感トレーニング</h1>
    <p>プレイしたいレベルを選んでください。</p>

    <!-- リザルト表示エリア -->
    <div v-if="hasResult" class="result-display">
      <h2>ゲーム結果</h2>
      <p>レベル {{ playedLevel }} でプレイしました。</p>
      <p>最終スコア: {{ finalScore }} 点</p>
      <button @click="clearResult">結果を閉じる</button>
    </div>

    <div :class="{ 'level-buttons-container': true, 'blurred': hasResult }">
      <button @click="selectLevel(1)" :disabled="hasResult">
        <h2>ステップ1</h2>
        <p>基準音の定着（ド or ド以外）</p>
      </button>
      <button @click="selectLevel(2)" :disabled="hasResult">
        <h2>ステップ2</h2>
        <p>白鍵の1オクターブ</p>
      </button>
    </div>
  </div>
</template>

<style scoped>
.level-select-container {
  text-align: center;
  padding: 20px;
}
.level-select-container button {
  margin: 10px;
  padding: 20px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: background-color 0.3s ease;
}
.level-select-container button:hover:not(:disabled) {
  background-color: #e0e0e0;
}
.level-select-container button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.level-buttons-container {
  transition: filter 0.3s ease;
}

.level-buttons-container.blurred {
  filter: blur(2px);
  pointer-events: none; /* Make buttons unclickable when blurred */
}

.result-display {
  background-color: #e0f7fa; /* Light blue */
  border: 1px solid #00bcd4;
  border-radius: 8px;
  padding: 20px;
  margin: 20px auto;
  max-width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.result-display h2 {
  color: #00838f;
  margin-bottom: 10px;
}
.result-display p {
  font-size: 1.1em;
  margin-bottom: 15px;
}
.result-display button {
  background-color: #00bcd4;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
}
.result-display button:hover {
  background-color: #0097a7;
}
</style>
