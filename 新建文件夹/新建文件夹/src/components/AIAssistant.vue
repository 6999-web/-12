<template>
  <div class="ai-assistant-page font-num">
    <aside class="ai-left panel-shell">
      <div class="panel-title">
        <span class="title-bar"></span>
        <h3>智小喵助手</h3>
      </div>

      <section class="mascot-hero">
        <h2>你好，我是智小喵</h2>
        <p>可为你讲解实验室空间、成员、项目与成果</p>
        <div class="big-mascot-frame">
          <img src="/assets/mascot.png" alt="智小喵" />
          <div class="scan-lines"></div>
        </div>
      </section>

      <div class="ability-shortcuts">
        <button
          v-for="item in shortcutActions"
          :key="item.label"
          type="button"
          @click="ask(item.question)"
        >
          <span class="shortcut-icon">{{ item.icon }}</span>
          <span>
            <strong>{{ item.label }}</strong>
            <small>{{ item.desc }}</small>
          </span>
        </button>
      </div>

      <section class="question-panel">
        <div class="panel-title compact">
          <span class="title-bar"></span>
          <h3>推荐问题</h3>
        </div>
        <button
          v-for="question in recommendedQuestions"
          :key="question"
          type="button"
          class="question-row"
          @click="ask(question)"
        >
          <span class="q-icon">▣</span>
          <span>{{ question }}</span>
          <span class="arrow">›</span>
        </button>
      </section>
    </aside>

    <main class="ai-center panel-shell">
      <header class="chat-title-row">
        <div class="panel-title">
          <span class="title-bar"></span>
          <h3>AI对话 · 智小喵随时为你解答</h3>
        </div>
        <button type="button" class="mini-action" @click="clearChat">清空会话</button>
      </header>

      <div ref="chatBox" class="chat-stream">
        <template v-for="(message, index) in chatMessages" :key="index">
          <div :class="['chat-message', message.sender]">
            <div class="avatar-ring">
              <img v-if="message.sender === 'ai'" src="/assets/mascot.png" alt="智小喵" />
              <span v-else>👤</span>
            </div>
            <div class="message-stack">
              <div class="bubble-row">
                <div class="message-bubble" v-html="message.text"></div>
                <span class="msg-time">{{ message.time }}</span>
              </div>

              <div v-if="message.type === 'devices'" class="device-reply-grid">
                <article v-for="item in deviceCards" :key="item.name" class="reply-card device-card">
                  <span class="reply-icon">{{ item.icon }}</span>
                  <strong>{{ item.name }}</strong>
                  <small>{{ item.count }} <em>在线</em></small>
                </article>
              </div>

              <div v-if="message.type === 'projects'" class="project-reply-grid">
                <article v-for="item in projectCards" :key="item.name" class="reply-card project-card">
                  <img :src="item.image" :alt="item.name" />
                  <div>
                    <strong>{{ item.name }}</strong>
                    <div class="progress-line">
                      <span>进度 {{ item.progress }}%</span>
                      <em>{{ item.status }}</em>
                    </div>
                    <div class="progress-track">
                      <span :style="{ width: `${item.progress}%` }"></span>
                    </div>
                    <small>负责人：{{ item.owner }}　截止：{{ item.deadline }}</small>
                  </div>
                </article>
              </div>

              <div v-if="message.type === 'achievements'" class="achievement-reply-grid">
                <article v-for="item in achievementCards" :key="item.name" class="reply-card achievement-card">
                  <div class="doc-thumb">
                    <img :src="item.image" :alt="item.name" />
                  </div>
                  <div>
                    <strong>{{ item.name }}</strong>
                    <small>{{ item.category }}</small>
                    <span>{{ item.meta }}</span>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </template>
      </div>

      <form class="chat-input-panel" @submit.prevent="sendCurrentInput">
        <input v-model="inputText" type="text" placeholder="请输入你的问题..." />
        <button class="send-fab" type="submit" aria-label="发送问题">➤</button>
        <div class="input-tools">
          <button type="button">🎙️ 语音输入</button>
          <button type="button">📄 上传文件</button>
          <button type="button" @click="clearChat">🧹 清空会话</button>
        </div>
      </form>
      <p class="ai-note">内容由AI生成，仅供参考，请以实际数据为准</p>
    </main>

    <aside class="ai-right">
      <section class="panel-shell service-panel">
        <div class="panel-title">
          <span class="title-bar"></span>
          <h3>服务能力</h3>
          <button type="button">探索更多 ›</button>
        </div>
        <div class="service-grid">
          <button
            v-for="service in services"
            :key="service.title"
            type="button"
            @click="ask(service.question)"
          >
            <span>{{ service.icon }}</span>
            <strong>{{ service.title }}</strong>
            <small>{{ service.desc }}</small>
          </button>
        </div>
      </section>

      <section class="panel-shell history-panel">
        <div class="panel-title">
          <span class="title-bar"></span>
          <h3>会话记录</h3>
          <button type="button">更多 ›</button>
        </div>
        <button
          v-for="item in sessionHistory"
          :key="item.title"
          type="button"
          class="history-row"
          @click="ask(item.title)"
        >
          <span>{{ item.title }}</span>
          <time>{{ item.time }}</time>
        </button>
      </section>

      <section class="panel-shell linked-panel">
        <div class="panel-title">
          <span class="title-bar"></span>
          <h3>联动推荐</h3>
          <button type="button">更多 ›</button>
        </div>

        <div class="recommend-tabs">
          <button
            v-for="tab in recommendTabs"
            :key="tab"
            :class="{ active: activeRecommendTab === tab }"
            type="button"
            @click="activeRecommendTab = tab"
          >
            {{ tab }}
          </button>
        </div>

        <div class="space-card-grid">
          <article v-for="room in linkedRooms" :key="room.name" class="space-card">
            <img :src="room.image" :alt="room.name" />
            <span :class="['room-state', room.stateClass]">{{ room.state }}</span>
            <strong>{{ room.name }}</strong>
            <div class="space-meta">
              <span>设备<br /><b>{{ room.devices }}</b></span>
              <span>人员<br /><b>{{ room.people }}</b></span>
            </div>
          </article>
        </div>
      </section>
    </aside>
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue';

const chatBox = ref(null);
const inputText = ref('');
const activeRecommendTab = ref('空间推荐');

const shortcutActions = [
  { icon: '🏠', label: '空间介绍', desc: '空间概览与设备分布', question: '310实验室目前有哪些设备在线？' },
  { icon: '👥', label: '成员查询', desc: '成员画像与研究方向', question: '实验室有哪些核心成员？' },
  { icon: '📁', label: '项目推荐', desc: '项目进度与推荐', question: '本周有哪些重点项目推进？' },
  { icon: '📄', label: '成果检索', desc: '成果检索与展示', question: '有哪些成果可以展示？' }
];

const recommendedQuestions = [
  '310实验室目前有哪些设备在线？',
  '本周有哪些重点项目推进？',
  '请介绍实验室核心成员',
  '有哪些成果可以展示？',
  '今天有哪些活动安排？',
  '如何申请使用实验室设备？'
];

const deviceCards = [
  { icon: '📹', name: '摄像头', count: '3台' },
  { icon: '🖨️', name: '3D打印机', count: '1台' },
  { icon: '🦾', name: '机器人', count: '2台' },
  { icon: '🧠', name: '服务器', count: '1台' },
  { icon: '🧰', name: '小机具', count: '2台' }
];

const projectCards = [
  {
    name: '智能视觉识别系统',
    progress: 65,
    status: '进行中',
    owner: '李四',
    deadline: '05-30',
    image: '/assets/image3.png'
  },
  {
    name: '多模态实验数据分析平台',
    progress: 42,
    status: '进行中',
    owner: '王五',
    deadline: '06-15',
    image: '/assets/image4.png'
  },
  {
    name: 'AI实验设备联动控制',
    progress: 78,
    status: '进行中',
    owner: '张三',
    deadline: '05-28',
    image: '/assets/image5.png'
  }
];

const achievementCards = [
  {
    name: '智能控制算法优化',
    category: '论文成果',
    meta: 'IEEE Transactions',
    image: '/assets/image6.png'
  },
  {
    name: '实验室管理平台V2.0',
    category: '软件成果',
    meta: '登记号：2025SR1234567',
    image: '/assets/image7.png'
  },
  {
    name: '智能机器人协同系统',
    category: '专利成果',
    meta: '专利号：ZL202410123456.7',
    image: '/assets/image8.png'
  }
];

const services = [
  { icon: '🏠', title: '空间讲解', desc: '空间结构与设备分布', question: '介绍一下310实验室的空间结构' },
  { icon: '👥', title: '成员画像', desc: '成员信息与研究方向', question: '请介绍实验室核心成员' },
  { icon: '📋', title: '项目查询', desc: '项目进展与关键节点', question: '本周有哪些重点项目推进？' },
  { icon: '⚙️', title: '成果推荐', desc: '成果检索与智能推荐', question: '有哪些成果可以展示？' },
  { icon: '🔧', title: '设备状态', desc: '设备运行与状态监控', question: '310实验室目前有哪些设备在线？' },
  { icon: '🗓️', title: '活动问答', desc: '活动安排与报名信息', question: '今天有哪些活动安排？' }
];

const sessionHistory = [
  { title: '310实验室目前有哪些设备在线？', time: '10:28' },
  { title: '本周有哪些重点项目推进？', time: '10:26' },
  { title: '有哪些成果可以展示？', time: '10:27' },
  { title: '401会议室当前使用情况如何？', time: '10:20' },
  { title: '913会议室今天有安排吗？', time: '09:58' }
];

const recommendTabs = ['空间推荐', '项目推荐', '成果推荐'];

const linkedRooms = [
  { name: '310实验室', state: '在线', stateClass: 'online', devices: '15台', people: '18人', image: '/assets/image1.png' },
  { name: '401会议室', state: '使用中', stateClass: 'busy', devices: '10台', people: '8人', image: '/assets/image2.png' },
  { name: '913会议室', state: '空闲', stateClass: 'idle', devices: '11台', people: '6人', image: '/assets/image3.png' }
];

const nowTime = () => new Date().toTimeString().slice(0, 5);

const chatMessages = ref([
  {
    sender: 'user',
    time: '10:25',
    text: '310实验室目前有哪些设备在线？',
    type: null
  },
  {
    sender: 'ai',
    time: '10:25',
    text: '310实验室当前共有 6 台设备在线，运行状态良好。以下是在控设备概览：',
    type: 'devices'
  },
  {
    sender: 'user',
    time: '10:26',
    text: '本周有哪些重点项目推进？',
    type: null
  },
  {
    sender: 'ai',
    time: '10:26',
    text: '本周（5.19-5.25）有 3 个重点项目正在稳步推进中：',
    type: 'projects'
  },
  {
    sender: 'user',
    time: '10:27',
    text: '有哪些成果可以展示？',
    type: null
  },
  {
    sender: 'ai',
    time: '10:27',
    text: '目前共有 12 项可展示成果，以下为部分精选成果：',
    type: 'achievements'
  }
]);

const scrollToBottom = () => {
  nextTick(() => {
    if (chatBox.value) {
      chatBox.value.scrollTop = chatBox.value.scrollHeight;
    }
  });
};

const resolveType = (question) => {
  if (question.includes('设备') || question.includes('在线') || question.includes('310')) return 'devices';
  if (question.includes('项目') || question.includes('推进')) return 'projects';
  if (question.includes('成果') || question.includes('展示') || question.includes('论文') || question.includes('专利')) return 'achievements';
  return 'devices';
};

const replyText = (type) => {
  if (type === 'projects') return '智小喵已调取项目进度台账，本周重点推进项目如下：';
  if (type === 'achievements') return '智小喵为你整理了近期可展示成果，包含论文、平台与专利：';
  return '310实验室关键设备状态如下，在线设备运行稳定，可继续查看详细设备看板：';
};

const ask = (question) => {
  const time = nowTime();
  const type = resolveType(question);
  chatMessages.value.push({ sender: 'user', time, text: question, type: null });
  chatMessages.value.push({ sender: 'ai', time, text: replyText(type), type });
  scrollToBottom();
};

const sendCurrentInput = () => {
  const question = inputText.value.trim();
  if (!question) return;
  inputText.value = '';
  ask(question);
};

const clearChat = () => {
  chatMessages.value = [
    {
      sender: 'ai',
      time: nowTime(),
      text: '会话已清空。智小喵随时待命，请输入你想查询的问题。',
      type: null
    }
  ];
};
</script>

<style scoped>
.ai-assistant-page {
  height: calc(100vh - 110px);
  width: 100%;
  display: grid;
  grid-template-columns: 282px minmax(0, 1fr) 340px;
  gap: 10px;
  padding: 10px;
  overflow: hidden;
}

.panel-shell {
  position: relative;
  min-height: 0;
  border: 1px solid rgba(0, 168, 255, 0.42);
  border-radius: 6px;
  background:
    linear-gradient(180deg, rgba(5, 21, 55, 0.88), rgba(3, 12, 34, 0.78)),
    radial-gradient(circle at 50% 0%, rgba(0, 168, 255, 0.15), transparent 45%);
  box-shadow:
    inset 0 0 18px rgba(0, 168, 255, 0.08),
    0 0 18px rgba(0, 102, 255, 0.12);
  overflow: hidden;
}

.panel-shell::before,
.panel-shell::after {
  content: "";
  position: absolute;
  width: 28px;
  height: 1px;
  top: 0;
  background: #38bdf8;
  box-shadow: 0 0 10px #38bdf8;
}

.panel-shell::before {
  left: 8px;
}

.panel-shell::after {
  right: 8px;
}

.panel-title {
  height: 38px;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 12px;
  color: #e9f8ff;
}

.panel-title.compact {
  height: 28px;
  padding: 0 2px 0 0;
  margin-bottom: 8px;
}

.panel-title h3 {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0;
}

.panel-title button,
.mini-action {
  margin-left: auto;
  background: transparent;
  border: 0;
  color: #93a9ca;
  font-size: 11px;
  cursor: pointer;
}

.title-bar {
  width: 3px;
  height: 14px;
  background: linear-gradient(180deg, #00e5ff, #005eff);
  box-shadow: 0 0 10px #00a8ff;
}

.ai-left {
  display: flex;
  flex-direction: column;
  padding: 0 10px 10px;
}

.mascot-hero {
  text-align: center;
  padding: 3px 0 8px;
}

.mascot-hero h2 {
  font-size: 16px;
  color: #fff;
  margin-bottom: 6px;
}

.mascot-hero p {
  font-size: 11px;
  color: #b2c5df;
  margin-bottom: 10px;
}

.big-mascot-frame {
  position: relative;
  height: 226px;
  border-left: 1px solid rgba(56, 189, 248, 0.44);
  border-right: 1px solid rgba(56, 189, 248, 0.44);
  background:
    linear-gradient(180deg, rgba(2, 13, 34, 0.18), rgba(0, 36, 78, 0.16)),
    radial-gradient(ellipse at 50% 82%, rgba(0, 174, 255, 0.34), transparent 54%);
  overflow: hidden;
}

.big-mascot-frame img {
  position: relative;
  z-index: 1;
  height: 248px;
  width: 192px;
  object-fit: cover;
  object-position: center top;
  border-radius: 8px;
  filter: drop-shadow(0 0 14px rgba(0, 168, 255, 0.44));
}

.scan-lines {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(125, 222, 255, 0.07) 1px, transparent 1px);
  background-size: 100% 18px;
  pointer-events: none;
}

.ability-shortcuts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-top: 8px;
}

.ability-shortcuts button,
.service-grid button {
  border: 1px solid rgba(0, 168, 255, 0.28);
  border-radius: 5px;
  background: linear-gradient(180deg, rgba(0, 89, 185, 0.26), rgba(0, 42, 105, 0.16));
  color: #e6f7ff;
  cursor: pointer;
}

.ability-shortcuts button {
  min-height: 56px;
  padding: 7px;
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
}

.shortcut-icon {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  background: rgba(0, 168, 255, 0.12);
  box-shadow: inset 0 0 12px rgba(0, 168, 255, 0.18);
}

.ability-shortcuts strong,
.service-grid strong {
  display: block;
  font-size: 12px;
}

.ability-shortcuts small,
.service-grid small {
  display: block;
  margin-top: 3px;
  font-size: 9px;
  color: #9db4d3;
}

.question-panel {
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px solid rgba(56, 189, 248, 0.18);
}

.question-row,
.history-row {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(56, 189, 248, 0.16);
  border-radius: 5px;
  background: rgba(0, 75, 160, 0.16);
  color: #d6ebff;
  margin-bottom: 6px;
  padding: 0 8px;
  text-align: left;
  cursor: pointer;
  font-size: 11px;
}

.question-row .q-icon {
  color: #38bdf8;
  font-size: 10px;
}

.question-row .arrow {
  margin-left: auto;
  color: #7fb8e8;
  font-size: 17px;
}

.ai-center {
  display: flex;
  flex-direction: column;
}

.chat-title-row {
  height: 42px;
  border-bottom: 1px solid rgba(56, 189, 248, 0.18);
  display: flex;
  align-items: center;
}

.chat-title-row .panel-title {
  flex: 1;
}

.chat-stream {
  flex: 1;
  min-height: 0;
  padding: 12px 12px 8px;
  overflow-y: auto;
}

.chat-message {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  max-width: 96%;
}

.chat-message.user {
  justify-content: flex-end;
  margin-left: auto;
}

.chat-message.user .avatar-ring {
  order: 2;
}

.avatar-ring {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1px solid rgba(101, 188, 255, 0.75);
  background: rgba(8, 27, 61, 0.9);
  display: grid;
  place-items: center;
  box-shadow: 0 0 12px rgba(0, 168, 255, 0.28);
  overflow: hidden;
}

.avatar-ring img {
  width: 44px;
  height: 52px;
  object-fit: cover;
  object-position: center 0;
}

.message-stack {
  min-width: 0;
  max-width: 100%;
}

.bubble-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.chat-message.user .bubble-row {
  justify-content: flex-end;
}

.message-bubble {
  min-height: 30px;
  padding: 8px 12px;
  border-radius: 6px;
  background: rgba(5, 37, 88, 0.72);
  border: 1px solid rgba(56, 189, 248, 0.2);
  color: #e8f7ff;
  line-height: 1.5;
  font-size: 12px;
}

.chat-message.user .message-bubble {
  background: linear-gradient(135deg, rgba(0, 115, 255, 0.86), rgba(0, 151, 255, 0.48));
  border-color: rgba(139, 219, 255, 0.46);
}

.msg-time {
  color: #8aa5c8;
  font-size: 10px;
  padding-top: 8px;
  white-space: nowrap;
}

.device-reply-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
  margin-top: 8px;
}

.reply-card {
  border-radius: 6px;
  border: 1px solid rgba(56, 189, 248, 0.18);
  background: linear-gradient(180deg, rgba(0, 83, 176, 0.22), rgba(3, 19, 50, 0.58));
  box-shadow: inset 0 0 14px rgba(56, 189, 248, 0.06);
}

.device-card {
  min-height: 62px;
  padding: 8px;
  display: grid;
  grid-template-columns: 28px 1fr;
  grid-template-rows: auto auto;
  column-gap: 6px;
  align-items: center;
}

.reply-icon {
  grid-row: 1 / 3;
  font-size: 21px;
  color: #6ee7ff;
}

.device-card strong {
  font-size: 12px;
  color: #fff;
}

.device-card small {
  color: #9fb7d6;
  font-size: 11px;
}

.device-card em {
  color: #48f2a0;
  font-style: normal;
}

.project-reply-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 8px;
}

.project-card {
  min-height: 108px;
  overflow: hidden;
}

.project-card img {
  width: 100%;
  height: 46px;
  object-fit: cover;
  opacity: 0.82;
}

.project-card div {
  padding: 6px 8px;
}

.project-card strong,
.achievement-card strong {
  display: block;
  font-size: 12px;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.progress-line {
  display: flex;
  justify-content: space-between;
  margin: 5px 0 4px;
  color: #93a9ca;
  font-size: 10px;
}

.progress-line em {
  color: #f59e0b;
  font-style: normal;
}

.progress-track {
  height: 4px;
  padding: 0 !important;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #00d5ff, #1d7cff);
}

.project-card small {
  display: block;
  margin-top: 6px;
  color: #8da1c4;
  font-size: 10px;
}

.achievement-reply-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 8px;
}

.achievement-card {
  min-height: 96px;
  padding: 8px;
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: 8px;
}

.doc-thumb {
  width: 64px;
  height: 78px;
  border-radius: 4px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
}

.doc-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.achievement-card small,
.achievement-card span {
  display: block;
  color: #9fb7d6;
  font-size: 10px;
  margin-top: 5px;
}

.chat-input-panel {
  height: 84px;
  margin: 0 12px 8px;
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 8px;
  background: rgba(4, 20, 52, 0.72);
  position: relative;
  padding: 10px 58px 30px 12px;
  flex-shrink: 0;
}

.chat-input-panel input {
  width: 100%;
  height: 34px;
  border: 0;
  background: transparent;
  color: #fff;
  font-size: 12px;
}

.chat-input-panel input:focus {
  outline: none;
}

.send-fab {
  position: absolute;
  right: 16px;
  top: 20px;
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  background: radial-gradient(circle at 35% 30%, #65e7ff, #0066ff 70%);
  box-shadow: 0 0 18px rgba(0, 102, 255, 0.55);
}

.input-tools {
  position: absolute;
  left: 12px;
  bottom: 7px;
  display: flex;
  gap: 14px;
}

.input-tools button {
  border: 0;
  background: transparent;
  color: #8da1c4;
  font-size: 11px;
  cursor: pointer;
}

.ai-note {
  height: 18px;
  text-align: center;
  color: #5f789e;
  font-size: 10px;
  flex-shrink: 0;
}

.ai-right {
  min-height: 0;
  display: grid;
  grid-template-rows: 220px 170px minmax(0, 1fr);
  gap: 10px;
}

.service-panel,
.history-panel,
.linked-panel {
  padding-bottom: 10px;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 0 10px;
}

.service-grid button {
  height: 78px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
}

.service-grid span {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(0, 132, 255, 0.18);
  box-shadow: 0 0 16px rgba(0, 132, 255, 0.28);
}

.history-row {
  width: calc(100% - 20px);
  margin-left: 10px;
  margin-right: 10px;
  justify-content: space-between;
}

.history-row time {
  color: #7d93b7;
}

.recommend-tabs {
  display: flex;
  gap: 6px;
  padding: 0 10px 8px;
}

.recommend-tabs button {
  border: 0;
  background: transparent;
  color: #8da1c4;
  border-bottom: 1px solid transparent;
  padding: 4px 8px;
  cursor: pointer;
}

.recommend-tabs button.active {
  color: #6ee7ff;
  border-color: #38bdf8;
}

.space-card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  padding: 0 10px;
}

.space-card {
  position: relative;
  min-height: 126px;
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 6px;
  overflow: hidden;
  background: rgba(2, 15, 38, 0.7);
}

.space-card img {
  width: 100%;
  height: 64px;
  object-fit: cover;
  opacity: 0.86;
}

.room-state {
  position: absolute;
  right: 6px;
  top: 6px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 10px;
}

.room-state.online,
.room-state.idle {
  color: #45f2a5;
  background: rgba(16, 185, 129, 0.18);
}

.room-state.busy {
  color: #ffd27a;
  background: rgba(245, 158, 11, 0.22);
}

.space-card strong {
  display: block;
  padding: 6px 8px 4px;
  color: #fff;
  font-size: 12px;
}

.space-meta {
  display: flex;
  justify-content: space-around;
  color: #91a8c8;
  font-size: 10px;
}

.space-meta b {
  color: #dff7ff;
  font-size: 12px;
}

@media (max-width: 1180px) {
  .ai-assistant-page {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .ai-right {
    display: none;
  }

  .device-reply-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
