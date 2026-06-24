<template>
  <div class="lab310-embedded-viewer">
    <iframe
      class="lab310-frame"
      :src="frameSrc"
      title="310 latest 3D scene"
      loading="eager"
      allow="fullscreen"
      @load="handleFrameLoad"
    ></iframe>
    <div v-if="!isReady" class="lab310-loading font-num">
      <span>3D 模型加载中</span>
    </div>
  </div>
</template>

<script setup>
import { computed, onUnmounted, ref } from 'vue';

const isReady = ref(false);
let readyTimer = 0;

const frameSrc = computed(() => {
  return '/embedded/310-normal-scene/index.html?embed=home';
});

const handleFrameLoad = () => {
  window.clearTimeout(readyTimer);
  readyTimer = window.setTimeout(() => {
    isReady.value = true;
  }, 260);
};

onUnmounted(() => {
  window.clearTimeout(readyTimer);
});
</script>

<style scoped>
.lab310-embedded-viewer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: transparent;
}

.lab310-frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  background: transparent;
}

.lab310-loading {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 50% 46%, rgba(54, 153, 255, 0.18), transparent 34%),
    linear-gradient(180deg, rgba(6, 25, 50, 0.74), rgba(2, 10, 24, 0.82));
  color: #dff7ff;
  font-size: 15px;
  letter-spacing: 1px;
  pointer-events: none;
}

.lab310-loading span {
  padding: 10px 16px;
  border: 1px solid rgba(56, 189, 248, 0.32);
  border-radius: 6px;
  background: rgba(2, 8, 24, 0.72);
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.16);
}
</style>
