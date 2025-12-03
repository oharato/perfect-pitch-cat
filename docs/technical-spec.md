# 技術仕様書

## 1. 開発スタック

- **フレームワーク:** Vue 3
- **言語:** TypeScript
- **パッケージマネージャー:** pnpm

## 2. 主要ライブラリ

### 2.1. Tone.js
音源の再生・管理に使用する。`pnpm` を通じてプロジェクトにインストールする。
`pnpm add tone`

### 2.2. 音源データ
`Tone.Sampler` を使用し、実際のピアノ音源を再生する。MVPでは1オクターブの白鍵に対応する音源が必要。

- **ベースURL:** `https://tonejs.github.io/audio/salamander/`
- **必要な音源ファイル:**
  - `C4.mp3`
  - `D4.mp3`
  - `E4.mp3`
  - `F4.mp3`
  - `G4.mp3`
  - `A4.mp3`
  - `B4.mp3`
  - (ステップ1で使用するC以外の音として、上記以外の音も1つ以上必要)

## 3. 実装サンプル (Vue 3)

Vueコンポーネント内での `Tone.js` の基本的な使用例。

```typescript
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as Tone from 'tone';

// サンプラーのインスタンスを保持
const piano = ref<Tone.Sampler | null>(null);

onMounted(() => {
  // コンポーネントマウント時にサンプラーを初期化
  piano.value = new Tone.Sampler({
    urls: {
      "C4": "C4.mp3",
      "D4": "D4.mp3",
      "E4": "E4.mp3",
      "F4": "F4.mp3",
      "G4": "G4.mp3",
      "A4": "A4.mp3",
      "B4": "B4.mp3",
    },
    release: 1,
    baseUrl: "https://tonejs.github.io/audio/salamander/",
  }).toDestination();
});

// 音を再生する関数
const playNote = async (note: string) => {
  // ユーザーの初回操作時にAudioContextを開始
  await Tone.start();
  
  if (piano.value && piano.value.loaded) {
    piano.value.triggerAttackRelease(note, "8n");
  } else {
    console.error("Piano sampler is not loaded yet.");
  }
};
</script>
```

## 4. 注意点

- **ユーザー操作の必須:** ブラウザのポリシーにより、ユーザーの初回アクション（クリックなど）があるまで音を出すことはできない。`Tone.start()`をユーザーイベントハンドラ内で呼び出す必要がある。
- **音源のロード時間:** `Tone.Sampler`は音源ファイルの読み込みに時間がかかる。`piano.loaded`プロパティでロード状態を確認し、UIに反映させる（例：ローディング表示）必要がある。
