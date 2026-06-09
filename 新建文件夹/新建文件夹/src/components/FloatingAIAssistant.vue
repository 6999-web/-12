<template>
  <div
    class="floating-ai"
    :class="{ dragging: isDragging }"
    :style="{ left: `${position.x}px`, top: `${position.y}px` }"
    @pointerdown="startDrag"
  >
    <button class="mascot-trigger" type="button" aria-label="打开智小喵 AI 问答" @click="openDialog">
      <span class="mascot-aura"></span>
      <img src="/assets/mascot.png" alt="智小喵 AI 助手" draggable="false" />
      <span class="mascot-label">AI助手</span>
    </button>
  </div>

  <Teleport to="body">
    <div v-if="dialogOpen" class="ai-dialog-backdrop" @click.self="closeDialog">
      <section class="ai-dialog glass-panel" role="dialog" aria-modal="true" aria-label="智小喵 AI 问答对话框">
        <header class="ai-dialog-header">
          <div class="dialog-title">
            <span class="dialog-icon">🤖</span>
            <div>
              <h2>智小喵 AI问答</h2>
              <p>空间设备 · 项目成果 · 活动安排 · 成员信息</p>
            </div>
          </div>
          <button class="dialog-close" type="button" aria-label="关闭 AI 问答" @click="closeDialog">×</button>
        </header>

        <div class="dialog-body">
          <aside class="dialog-sidebar">
            <img src="/assets/mascot.png" alt="智小喵" class="dialog-mascot" draggable="false" />
            <div class="assistant-state">
              <span class="status-dot online"></span>
              <span>智能体在线</span>
            </div>
            <div class="quick-grid">
              <button
                v-for="item in quickActions"
                :key="item.label"
                type="button"
                @click="ask(item.question)"
              >
                <span>{{ item.icon }}</span>
                {{ item.label }}
              </button>
            </div>
          </aside>

          <main class="dialog-chat">
            <div ref="messageBox" class="dialog-messages">
              <div v-for="(message, index) in messages" :key="index" :class="['dialog-message', message.sender]">
                <div class="message-avatar">{{ message.sender === 'ai' ? '🐱' : '👤' }}</div>
                <div class="message-content">
                  <div class="message-bubble" v-html="message.text"></div>
                  <div v-if="message.cards?.length" class="inline-card-grid">
                    <article v-for="card in message.cards" :key="card.title" class="inline-card">
                      <span class="card-icon">{{ card.icon }}</span>
                      <strong>{{ card.title }}</strong>
                      <small>{{ card.meta }}</small>
                    </article>
                  </div>
                  <span class="message-time">{{ message.time }}</span>
                </div>
              </div>
            </div>

            <form class="dialog-input" @submit.prevent="sendInput">
              <button type="button" title="语音输入">🎙️</button>
              <button type="button" title="上传文件">📎</button>
              <input v-model="inputText" type="text" placeholder="请输入你的问题..." />
              <button class="send-btn" type="submit" aria-label="发送">➤</button>
            </form>
          </main>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';

const STORAGE_KEY = 'smart-lab-floating-ai-position';

const dialogOpen = ref(false);
const isDragging = ref(false);
const movedDuringDrag = ref(false);
const inputText = ref('');
const messageBox = ref(null);
const position = reactive({ x: 180, y: 650 });
const dragState = reactive({ startX: 0, startY: 0, originX: 0, originY: 0 });

const quickActions = [
  { icon: '🏠', label: '空间介绍', question: '310实验室目前有哪些设备在线？' },
  { icon: '👥', label: '成员查询', question: '实验室有哪些核心成员？' },
  { icon: '📁', label: '项目推荐', question: '本周有哪些重点项目推进？' },
  { icon: '🏆', label: '成果检索', question: '有哪些成果可以展示？' }
];

const nowTime = () => new Date().toTimeString().slice(0, 5);

const messages = ref([
  {
    sender: 'ai',
    time: '10:25',
    text: '你好，我是智小喵。你可以问我空间设备状态、重点项目推进、成果展示、成员信息或活动安排。',
    cards: [
      { icon: '📷', title: '摄像头', meta: '3台在线' },
      { icon: '🖨️', title: '3D打印机', meta: '1台使用中' },
      { icon: '🧠', title: 'AI服务器', meta: '负载正常' }
    ]
  }
]);

const clampPosition = () => {
  const maxX = Math.max(12, window.innerWidth - 150);
  const maxY = Math.max(100, window.innerHeight - 190);
  position.x = Math.min(Math.max(12, position.x), maxX);
  position.y = Math.min(Math.max(96, position.y), maxY);
};

const savePosition = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ x: position.x, y: position.y }));
};

const loadPosition = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Number.isFinite(parsed.x) && Number.isFinite(parsed.y)) {
        position.x = parsed.x;
        position.y = parsed.y;
        clampPosition();
        return;
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  position.x = 48;
  position.y = Math.round(window.innerHeight * 0.72);
  clampPosition();
};

const startDrag = (event) => {
  if (dialogOpen.value) return;
  isDragging.value = true;
  movedDuringDrag.value = false;
  dragState.startX = event.clientX;
  dragState.startY = event.clientY;
  dragState.originX = position.x;
  dragState.originY = position.y;
  event.currentTarget.setPointerCapture(event.pointerId);
  window.addEventListener('pointermove', moveDrag);
  window.addEventListener('pointerup', endDrag, { once: true });
};

const moveDrag = (event) => {
  if (!isDragging.value) return;
  const deltaX = event.clientX - dragState.startX;
  const deltaY = event.clientY - dragState.startY;
  if (Math.abs(deltaX) + Math.abs(deltaY) > 6) {
    movedDuringDrag.value = true;
  }
  position.x = dragState.originX + deltaX;
  position.y = dragState.originY + deltaY;
  clampPosition();
};

const endDrag = () => {
  if (!isDragging.value) return;
  isDragging.value = false;
  savePosition();
  window.removeEventListener('pointermove', moveDrag);
};

const openDialog = (event) => {
  if (movedDuringDrag.value) {
    event.preventDefault();
    movedDuringDrag.value = false;
    return;
  }
  dialogOpen.value = true;
  nextTick(scrollToBottom);
};

const closeDialog = () => {
  dialogOpen.value = false;
};

const scrollToBottom = () => {
  if (messageBox.value) {
    messageBox.value.scrollTop = messageBox.value.scrollHeight;
  }
};

const buildReply = (question) => {
  const normalized = question.toLowerCase();
  if (normalized.includes('设备') || normalized.includes('在线') || normalized.includes('310')) {
    return {
      text: '310实验室当前共有 6 台关键设备在线，运行状态良好。以下是在线设备概览：',
      cards: [
        { icon: '📷', title: '摄像头', meta: '3台在线' },
        { icon: '🖨️', title: '3D打印机', meta: '1台使用中' },
        { icon: '🧠', title: '服务器', meta: '1台在线' },
        { icon: '🛠️', title: '小机具', meta: '2台在线' }
      ]
    };
  }
  if (normalized.includes('项目') || normalized.includes('推进')) {
    return {
      text: '本周重点项目主要集中在智能视觉识别、多模态实验数据分析和 AI 实验设备联动控制。',
      cards: [
        { icon: '📦', title: '智能视觉识别系统', meta: '进度65%' },
        { icon: '🧪', title: '实验数据分析平台', meta: '进度42%' },
        { icon: '🔗', title: 'AI设备联动控制', meta: '进度78%' }
      ]
    };
  }
  if (normalized.includes('成果') || normalized.includes('论文') || normalized.includes('展示')) {
    return {
      text: '目前有 12 项可展示成果，包含论文、平台、专利和智能系统原型。',
      cards: [
        { icon: '📄', title: '智能控制算法优化', meta: 'IEEE Transactions' },
        { icon: '💻', title: '实验室管理平台V2.0', meta: '软著登记' },
        { icon: '📜', title: '智能机器人协同系统', meta: '专利授权' }
      ]
    };
  }
  return {
    text: '我已收到你的问题。你可以继续追问空间设备、项目进展、成果检索、活动安排或成员情况。',
    cards: []
  };
};

const ask = (question) => {
  const time = nowTime();
  messages.value.push({ sender: 'user', time, text: question, cards: [] });
  const reply = buildReply(question);
  messages.value.push({ sender: 'ai', time, text: reply.text, cards: reply.cards });
  nextTick(scrollToBottom);
};

const sendInput = () => {
  const text = inputText.value.trim();
  if (!text) return;
  inputText.value = '';
  ask(text);
};

onMounted(() => {
  loadPosition();
  window.addEventListener('resize', clampPosition);
});

onUnmounted(() => {
  window.removeEventListener('resize', clampPosition);
  window.removeEventListener('pointermove', moveDrag);
});
</script>

<style scoped>
.floating-ai {
  position: fixed;
  z-index: 80;
  width: 132px;
  touch-action: none;
}

.floating-ai.dragging {
  cursor: grabbing;
}

.mascot-trigger {
  position: relative;
  width: 132px;
  min-height: 168px;
  border: 0;
  background: transparent;
  cursor: grab;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  filter: drop-shadow(0 0 16px rgba(0, 168, 255, 0.45));
}

.mascot-trigger:active {
  cursor: grabbing;
}

.mascot-trigger img {
  width: 118px;
  height: auto;
  z-index: 2;
  pointer-events: none;
  border-radius: 6px;
}

.mascot-aura {
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: 10px;
  height: 36px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(37, 165, 255, 0.78), rgba(37, 165, 255, 0.16) 48%, transparent 72%);
  box-shadow: 0 0 22px rgba(0, 168, 255, 0.7);
  animation: mascotPulse 2.4s ease-in-out infinite;
}

.mascot-label {
  position: absolute;
  right: 4px;
  bottom: 4px;
  z-index: 3;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(3, 15, 38, 0.88);
  border: 1px solid rgba(56, 189, 248, 0.65);
  color: #dff7ff;
  font-size: 11px;
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.25);
}

@keyframes mascotPulse {
  0%, 100% { transform: scaleX(1); opacity: 0.82; }
  50% { transform: scaleX(1.12); opacity: 1; }
}

.ai-dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 120;
  background: rgba(0, 5, 18, 0.72);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px;
}

.ai-dialog {
  width: min(960px, 94vw);
  height: min(680px, 88vh);
  background:
    radial-gradient(circle at 16% 18%, rgba(0, 168, 255, 0.14), transparent 30%),
    linear-gradient(180deg, rgba(4, 18, 48, 0.98), rgba(1, 8, 24, 0.98));
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ai-dialog-header {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  border-bottom: 1px solid rgba(56, 189, 248, 0.22);
  background: rgba(3, 12, 34, 0.72);
}

.dialog-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dialog-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: rgba(0, 111, 255, 0.18);
  border: 1px solid rgba(56, 189, 248, 0.34);
  box-shadow: inset 0 0 16px rgba(56, 189, 248, 0.18);
}

.dialog-title h2 {
  font-size: 20px;
  line-height: 1;
  letter-spacing: 1px;
  color: #fff;
}

.dialog-title p {
  margin-top: 6px;
  font-size: 12px;
  color: #8da1c4;
}

.dialog-close {
  width: 36px;
  height: 36px;
  border: 1px solid rgba(56, 189, 248, 0.32);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.03);
  color: #d9f5ff;
  font-size: 24px;
  cursor: pointer;
}

.dialog-body {
  min-height: 0;
  flex: 1;
  display: grid;
  grid-template-columns: 230px minmax(0, 1fr);
  gap: 14px;
  padding: 14px;
}

.dialog-sidebar {
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 8px;
  background: rgba(4, 20, 52, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px;
  min-height: 0;
}

.dialog-mascot {
  width: 160px;
  height: 208px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.24);
}

.assistant-state {
  margin: 10px 0 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #72f1b8;
  font-size: 12px;
}

.quick-grid {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.quick-grid button {
  min-height: 58px;
  background: rgba(0, 72, 160, 0.2);
  border: 1px solid rgba(56, 189, 248, 0.24);
  border-radius: 6px;
  color: #dff7ff;
  font-size: 12px;
  cursor: pointer;
}

.quick-grid button span {
  display: block;
  margin-bottom: 4px;
  font-size: 18px;
}

.dialog-chat {
  min-width: 0;
  min-height: 0;
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 8px;
  background: rgba(2, 9, 28, 0.55);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dialog-messages {
  flex: 1;
  overflow-y: auto;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dialog-message {
  display: flex;
  gap: 10px;
  max-width: 86%;
}

.dialog-message.user {
  margin-left: auto;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1px solid rgba(114, 197, 255, 0.45);
  background: rgba(4, 20, 52, 0.72);
}

.message-content {
  min-width: 0;
}

.message-bubble {
  border-radius: 8px;
  padding: 11px 13px;
  background: rgba(5, 29, 72, 0.78);
  border: 1px solid rgba(56, 189, 248, 0.22);
  color: #e8f7ff;
  font-size: 13px;
  line-height: 1.55;
}

.dialog-message.user .message-bubble {
  background: linear-gradient(135deg, rgba(0, 101, 225, 0.78), rgba(0, 168, 255, 0.45));
  border-color: rgba(120, 211, 255, 0.5);
}

.inline-card-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-top: 8px;
}

.inline-card {
  min-height: 74px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid rgba(56, 189, 248, 0.2);
  background: rgba(0, 64, 145, 0.18);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-icon {
  font-size: 18px;
}

.inline-card strong {
  color: #fff;
  font-size: 12px;
}

.inline-card small {
  color: #72f1b8;
  font-size: 11px;
}

.message-time {
  display: block;
  margin-top: 4px;
  color: #7792bd;
  font-size: 10px;
}

.dialog-message.user .message-time {
  text-align: right;
}

.dialog-input {
  height: 64px;
  border-top: 1px solid rgba(56, 189, 248, 0.16);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(1, 7, 22, 0.72);
}

.dialog-input button {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: 1px solid rgba(56, 189, 248, 0.2);
  background: rgba(255, 255, 255, 0.03);
  color: #dff7ff;
  cursor: pointer;
}

.dialog-input input {
  flex: 1;
  min-width: 0;
  height: 40px;
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 6px;
  background: rgba(1, 7, 22, 0.8);
  color: #fff;
  padding: 0 12px;
  font-size: 13px;
}

.dialog-input input:focus {
  outline: none;
  border-color: rgba(56, 189, 248, 0.6);
}

.dialog-input .send-btn {
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #67e8f9, #0066ff);
  border: 0;
  box-shadow: 0 0 14px rgba(0, 102, 255, 0.52);
}

@media (max-width: 860px) {
  .dialog-body {
    grid-template-columns: 1fr;
  }

  .dialog-sidebar {
    display: none;
  }

  .inline-card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
