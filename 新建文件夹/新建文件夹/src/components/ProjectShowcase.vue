<template>
  <div class="projects-showcase-container">
    <!-- Left Sidebar: Filters (Directions & Phases) -->
    <aside class="left-sidebar glass-panel font-num">
      <div class="sidebar-section">
        <h3>🎯 项目方向</h3>
        <ul class="filter-list">
          <li 
            v-for="dir in directions" 
            :key="dir.value"
            :class="{ active: selectedDirection === dir.value }"
            @click="selectedDirection = dir.value"
          >
            <span class="bullet">></span> {{ dir.label }}
          </li>
        </ul>
      </div>

      <div class="sidebar-section">
        <h3>⚙️ 项目状态</h3>
        <ul class="filter-list">
          <li 
            v-for="st in states" 
            :key="st.value"
            :class="{ active: selectedState === st.value }"
            @click="selectedState = st.value"
          >
            <span class="bullet">></span> {{ st.label }}
          </li>
        </ul>
      </div>
    </aside>

    <!-- Center Panel: Projects Feed -->
    <main class="center-feed glass-panel">
      <!-- Top Actions Bar -->
      <div class="top-actions-bar font-num">
        <div class="search-box">
          <input type="text" v-model="searchQuery" placeholder="输入关键字搜索项目..." />
          <span class="icon">🔍</span>
        </div>
        
        <div class="sort-group">
          <label>排序方式:</label>
          <select v-model="sortBy">
            <option value="default">默认</option>
            <option value="progress">项目进度</option>
            <option value="achievements">成果数量</option>
            <option value="date">更新时间</option>
          </select>
        </div>

        <div class="layout-toggle">
          <button :class="{ active: layout === 'grid' }" @click="layout = 'grid'">🎚️ 网格</button>
          <button :class="{ active: layout === 'list' }" @click="layout = 'list'">📋 列表</button>
        </div>
      </div>

      <!-- Scrollable Projects List -->
      <div class="projects-list-scroll scroll-container">
        <div :class="['projects-layout-' + layout]">
          <div 
            v-for="proj in filteredAndSortedProjects" 
            :key="proj.id" 
            class="project-showcase-card glass-panel"
            @click="openProjectDetail(proj)"
          >
            <!-- Card Image -->
            <div class="proj-img-box">
              <img :src="proj.cover" alt="项目封面" class="proj-cover-img" style="opacity: 0.25; object-fit: cover; background-color: #0c1b3d;" />
              <div class="overlay-tags">
                <span class="direction-tag">{{ proj.direction }}</span>
              </div>
            </div>

            <!-- Card Body -->
            <div class="proj-body font-num">
              <div class="title-row">
                <h4>{{ proj.title }}</h4>
                <span class="state-badge" :class="proj.stateClass">{{ proj.state }}</span>
              </div>
              <p class="desc">{{ proj.desc }}</p>
              
              <!-- Owner & Members -->
              <div class="people-row">
                <span class="owner">负责人: 👤 <strong>{{ proj.owner }}</strong></span>
                <span class="members">室员: <span v-for="m in proj.members" :key="m">👤 {{ m }} </span></span>
              </div>

              <!-- Progress Bar -->
              <div class="progress-section">
                <div class="progress-header">
                  <span>项目进度:</span>
                  <strong>{{ proj.progress }}%</strong>
                </div>
                <div class="progress-track">
                  <div class="progress-bar" :style="{ width: proj.progress + '%' }"></div>
                </div>
              </div>

              <!-- Associated Achievements -->
              <div class="assoc-achievements">
                <span class="label">沉淀成果:</span>
                <span class="badge paper">📄 论文: {{ proj.papersCount }}</span>
                <span class="badge patent">💡 软著/专利: {{ proj.patentsCount }}</span>
                <span class="badge award">🏆 奖项: {{ proj.awardsCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Right Sidebar: Stats & AI Recommend -->
    <aside class="right-sidebar glass-panel font-num">
      <!-- Project Stats -->
      <section class="sidebar-section">
        <h3>📊 实验室项目仪表盘</h3>
        <div class="dashboard-stats">
          <div class="stat-item">
            <span class="lbl">累计项目</span>
            <span class="val">18 <small>个</small></span>
          </div>
          <div class="stat-item">
            <span class="lbl">研发中</span>
            <span class="val text-orange">6 <small>个</small></span>
          </div>
          <div class="stat-item">
            <span class="lbl">测试中</span>
            <span class="val text-blue">4 <small>个</small></span>
          </div>
          <div class="stat-item">
            <span class="lbl">已上线/落地</span>
            <span class="val text-green">8 <small>个</small></span>
          </div>
        </div>
      </section>

      <!-- Phase Distribution -->
      <section class="sidebar-section">
        <h3>📈 研发阶段分布</h3>
        <div class="distribution-list">
          <div class="dist-item" v-for="d in phaseDistribution" :key="d.phase">
            <div class="lbl-row">
              <span>{{ d.phase }}</span>
              <span>{{ d.count }}个</span>
            </div>
            <div class="track">
              <div class="fill" :style="{ width: (d.count / 8 * 100) + '%' }"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- ZhiXiaoMiao Recommendation -->
      <section class="sidebar-section highlight-section glass-panel">
        <h3>🐱 智小喵推荐项目</h3>
        <div class="rec-list">
          <div class="rec-card" v-for="rp in recommendedProjects" :key="rp.title">
            <h5>{{ rp.title }}</h5>
            <p>{{ rp.reason }}</p>
            <span class="badge-rec">热度: ★★★★★</span>
          </div>
        </div>
      </section>
    </aside>

    <!-- Project Details Dialog -->
    <div v-if="activeDetailProject" class="detail-dialog-overlay" @click="activeDetailProject = null">
      <div class="detail-dialog-window glass-panel font-num" @click.stop>
        <div class="dialog-header">
          <h3>项目详情卡片</h3>
          <button class="close-btn" @click="activeDetailProject = null">×</button>
        </div>
        <div class="dialog-body scroll-container">
          <div class="dialog-top-meta">
            <div class="cover-box">
              <img :src="activeDetailProject.cover" alt="封面" style="width:100%; height:120px; object-fit:cover; opacity: 0.3;" />
            </div>
            <div class="info-box">
              <h4>{{ activeDetailProject.title }}</h4>
              <p>方向：<span class="tag">{{ activeDetailProject.direction }}</span> · 状态：<span class="state-badge" :class="activeDetailProject.stateClass">{{ activeDetailProject.state }}</span></p>
              <p>负责人：<strong>{{ activeDetailProject.owner }}</strong></p>
              <p>研发周期：{{ activeDetailProject.timeline || '2025-01 至 2026-06' }}</p>
            </div>
          </div>

          <div class="dialog-section">
            <h5>项目简介</h5>
            <p class="intro-p">{{ activeDetailProject.desc }}</p>
          </div>

          <div class="dialog-section">
            <h5>详细模块设计 & 进度</h5>
            <div class="progress-section" style="margin-bottom: 12px;">
              <div class="progress-header"><span>核心系统开发进度</span><strong>{{ activeDetailProject.progress }}%</strong></div>
              <div class="progress-track"><div class="progress-bar" :style="{ width: activeDetailProject.progress + '%' }"></div></div>
            </div>
            <ul class="modules-list">
              <li><span class="status-dot online"></span> 算法模型微调训练: <span class="text-green">已完成 (100%)</span></li>
              <li><span class="status-dot online"></span> 边缘端硬件板卡接入: <span class="text-green">已完成 (100%)</span></li>
              <li><span class="status-dot busy"></span> 前端多路监控流可视化: <span class="text-orange">调试中 (80%)</span></li>
              <li><span class="status-dot offline"></span> 场景实地综合演示: <span class="text-gray">待开始 (0%)</span></li>
            </ul>
          </div>

          <div class="dialog-section">
            <h5>关联的成果沉淀</h5>
            <ul class="achievements-bullet-list">
              <li>📄 论文: Multimodal Spatial-Temporal Graph Networks... (SCI一区录用)</li>
              <li>💡 软著: 警务多路视频流汇聚及姿态分析算法软件 (已登记)</li>
              <li>🏆 奖项: 中国机器人及人工智能大赛一等奖 (国家级)</li>
            </ul>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn-primary" @click="activeDetailProject = null">关闭详情</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const selectedDirection = ref('all');
const selectedState = ref('all');
const searchQuery = ref('');
const sortBy = ref('default');
const layout = ref('grid');
const activeDetailProject = ref(null);

const directions = [
  { label: '全部项目方向', value: 'all' },
  { label: '公安实战', value: '公安实战' },
  { label: 'AI教育', value: 'AI教育' },
  { label: '智能硬件', value: '智能硬件' },
  { label: 'AIGC应用', value: 'AIGC应用' },
  { label: '数据治理', value: '数据治理' },
  { label: '基础平台', value: '基础平台' }
];

const states = [
  { label: '全部项目状态', value: 'all' },
  { label: '调研中', value: '调研中' },
  { label: '原型中', value: '原型中' },
  { label: '开发中', value: '开发中' },
  { label: '测试中', value: '测试中' },
  { label: '已上线', value: '已上线' },
  { label: '已落地', value: '已落地' }
];

const phaseDistribution = [
  { phase: '开发中', count: 6 },
  { phase: '测试中', count: 4 },
  { phase: '已上线', count: 5 },
  { phase: '已落地', count: 3 }
];

const recommendedProjects = [
  { title: '多模态警务感知融合大平台', reason: '本月核心推进项目，结合AI大模型在公安一线的最新落地成果，备受行业关注。' },
  { title: '智小喵大模型实验室AI大助手', reason: '实验室智能转型的示范作品，支持全舱室环境控制及知识检索，体验极佳。' }
];

// Mock Projects Database
const projects = [
  {
    id: 1,
    title: '多模态警务感知融合大平台',
    direction: '公安实战',
    state: '已上线',
    stateClass: 'green-tag',
    cover: '/assets/image4.png',
    desc: '融合路面视频流时空分析算法与大语言模型，在城市交警路口实现嫌疑目标的高精度跨镜头跟踪与行为特征预警。现已在多个市局交警支队完成实战落地部署。',
    owner: '张子轩',
    members: ['陈一诺', '刘昊'],
    progress: 95,
    papersCount: 2,
    patentsCount: 3,
    awardsCount: 1,
    timeline: '2024-09 至 2026-05'
  },
  {
    id: 2,
    title: '智能无人机库周边警戒系统',
    direction: '智能硬件',
    state: '测试中',
    stateClass: 'orange-tag',
    cover: '/assets/image5.png',
    desc: '专为野外小型无人机固定充电舱室设计的高灵敏警报防区。结合超低功耗Mesh感知网关及雷达复合视觉探头，无网无市电环境下持续稳定警戒。',
    owner: '王思远',
    members: ['刘昊'],
    progress: 85,
    papersCount: 1,
    patentsCount: 2,
    awardsCount: 1,
    timeline: '2025-03 至今'
  },
  {
    id: 3,
    title: '智小喵大模型实验室AI大助手',
    direction: 'AIGC应用',
    state: '开发中',
    stateClass: 'blue-tag',
    cover: '/assets/image7.png',
    desc: '集成RAG大语言模型知识检索与边缘物联网总线调度，实验室成员可通过自然语言语音/文字控制舱内大屏显示及环境舒适度，并实时搜索台账。',
    owner: '张子轩',
    members: ['孙雨桐', '王浩然'],
    progress: 88,
    papersCount: 1,
    patentsCount: 1,
    awardsCount: 0,
    timeline: '2025-03 至今'
  },
  {
    id: 4,
    title: '基于知识图谱的在线智慧课堂',
    direction: 'AI教育',
    state: '已落地',
    stateClass: 'green-tag',
    cover: '/assets/image8.png',
    desc: '通过课堂顶置鱼眼摄像头捕捉学生动作（记笔记、抬头、低头、侧身），与后台课程大纲进度融合计算兴趣度指标，指导中小学教师智能排课。',
    owner: '李思雨',
    members: ['孙雨桐'],
    progress: 100,
    papersCount: 2,
    patentsCount: 1,
    awardsCount: 2,
    timeline: '2024-03 至 2025-01'
  },
  {
    id: 5,
    title: '基于联邦学习的数据协同治理大平台',
    direction: '数据治理',
    state: '开发中',
    stateClass: 'blue-tag',
    cover: '/assets/image1.png',
    desc: '针对智慧警务的多单位联合办案数据流通难题，利用联邦学习隐私计算框架实现“数据不出域、算法多跑路”，提升协同办案效率。',
    owner: '王浩然',
    members: ['陈一诺'],
    progress: 60,
    papersCount: 0,
    patentsCount: 1,
    awardsCount: 0,
    timeline: '2025-02 至今'
  }
];

const filteredAndSortedProjects = computed(() => {
  let list = projects;

  // Filter Direction
  if (selectedDirection.value !== 'all') {
    list = list.filter(p => p.direction === selectedDirection.value);
  }

  // Filter State
  if (selectedState.value !== 'all') {
    list = list.filter(p => p.state === selectedState.value);
  }

  // Search filter
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(p => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.owner.toLowerCase().includes(q));
  }

  // Sorting
  if (sortBy.value === 'progress') {
    list = [...list].sort((a, b) => b.progress - a.progress);
  } else if (sortBy.value === 'achievements') {
    list = [...list].sort((a, b) => (b.papersCount + b.patentsCount + b.awardsCount) - (a.papersCount + a.patentsCount + a.awardsCount));
  } else if (sortBy.value === 'date') {
    list = [...list].sort((a, b) => b.id - a.id);
  }

  return list;
});

const openProjectDetail = (proj) => {
  activeDetailProject.value = proj;
};
</script>

<style scoped>
.projects-showcase-container {
  height: calc(100vh - 110px);
  width: 100%;
  display: flex;
  gap: 16px;
  padding: 16px;
  overflow: hidden;
}

/* Left Sidebar Filters */
.left-sidebar {
  width: 200px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex-shrink: 0;
}

.left-sidebar h3 {
  font-size: 20px;
  color: #fff;
  font-weight: bold;
  margin-bottom: 10px;
  border-left: 2px solid #38bdf8;
  padding-left: 8px;
}

.filter-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-list li {
  font-size: 15px;
  color: var(--color-text-secondary);
  cursor: pointer;
  min-height: 34px;
  padding: 7px 10px;
  border-radius: 4px;
  transition: all 0.2s;
}

.filter-list li .bullet {
  color: #38bdf8;
  margin-right: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.filter-list li:hover {
  background: rgba(0, 168, 255, 0.05);
  color: #fff;
}

.filter-list li:hover .bullet {
  opacity: 1;
}

.filter-list li.active {
  background: rgba(0, 168, 255, 0.2);
  color: #fff;
  font-weight: bold;
}

.filter-list li.active .bullet {
  opacity: 1;
}

/* Center Feed */
.center-feed {
  flex: 1;
  background: var(--bg-panel);
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-actions-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid rgba(0, 168, 255, 0.15);
  padding-bottom: 12px;
  flex-shrink: 0;
}

.top-actions-bar .search-box {
  position: relative;
  width: 250px;
}

.top-actions-bar .search-box input {
  width: 100%;
  background: rgba(0,0,0,0.3);
  border: 1px solid var(--color-border);
  color: #fff;
  padding: 4px 28px 4px 10px;
  border-radius: 4px;
  font-size: 11px;
}

.top-actions-bar .search-box input:focus {
  outline: none;
  border-color: var(--color-border-active);
}

.top-actions-bar .search-box .icon {
  position: absolute;
  right: 8px;
  top: 5px;
  font-size: 11px;
  opacity: 0.6;
}

.sort-group {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--color-text-secondary);
}

.sort-group select {
  background: rgba(0,0,0,0.3);
  border: 1px solid var(--color-border);
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
}

.layout-toggle {
  margin-left: auto;
  display: flex;
  gap: 4px;
}

.layout-toggle button {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  color: var(--color-text-secondary);
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
}

.layout-toggle button.active {
  background: rgba(0, 168, 255, 0.2);
  border-color: var(--color-border-active);
  color: #fff;
}

.projects-list-scroll {
  flex: 1;
  overflow-y: auto;
  margin-top: 16px;
}

/* Layouts */
.projects-layout-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  padding-right: 4px;
}

.projects-layout-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 4px;
}

.project-showcase-card {
  display: flex;
  overflow: hidden;
  background: rgba(6,18,45,0.4);
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid rgba(0, 168, 255, 0.08);
}

.project-showcase-card:hover {
  background: rgba(0, 168, 255, 0.03);
  border-color: var(--color-border-active);
  box-shadow: 0 0 12px rgba(0, 168, 255, 0.1);
}

.projects-layout-grid .project-showcase-card {
  flex-direction: column;
}

.projects-layout-list .project-showcase-card {
  flex-direction: row;
  height: 150px;
}

.proj-img-box {
  position: relative;
  background: #020617;
  flex-shrink: 0;
}

.projects-layout-grid .proj-img-box {
  height: 120px;
  width: 100%;
}

.projects-layout-list .proj-img-box {
  width: 200px;
  height: 100%;
}

.proj-cover-img {
  width: 100%;
  height: 100%;
}

.overlay-tags {
  position: absolute;
  top: 8px; left: 8px;
}

.overlay-tags .direction-tag {
  background: rgba(56, 189, 248, 0.25);
  border: 1px solid #38bdf8;
  color: #fff;
  font-size: 8px;
  padding: 1px 6px;
  border-radius: 4px;
}

.proj-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;
}

.proj-body .title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.proj-body h4 {
  font-size: 13px;
  color: #fff;
  margin: 0;
}

.state-badge {
  font-size: 8px;
  padding: 1px 6px;
  border-radius: 3px;
}

.state-badge.green-tag { background: rgba(16,185,129,0.15); color: var(--status-online); border: 1px solid rgba(16,185,129,0.25); }
.state-badge.orange-tag { background: rgba(245,158,11,0.15); color: var(--status-busy); border: 1px solid rgba(245,158,11,0.25); }
.state-badge.blue-tag { background: rgba(59,130,246,0.15); color: var(--status-info); border: 1px solid rgba(59,130,246,0.25); }

.proj-body .desc {
  font-size: 11px;
  color: var(--color-text-secondary);
  line-height: 1.4;
  height: 38px;
  overflow: hidden;
}

.proj-body .people-row {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--color-text-secondary);
}

.proj-body .people-row strong {
  color: #fff;
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 10px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  color: var(--color-text-secondary);
}

.progress-track {
  height: 4px;
  width: 100%;
  background: rgba(255,255,255,0.05);
  border-radius: 2px;
}

.progress-bar {
  height: 100%;
  background: #38bdf8;
  border-radius: 2px;
}

.assoc-achievements {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 9px;
  color: var(--color-text-secondary);
  border-top: 1px dashed rgba(255,255,255,0.05);
  padding-top: 6px;
  margin-top: auto;
}

.assoc-achievements .badge {
  padding: 1px 4px;
  background: rgba(255,255,255,0.02);
  border-radius: 2px;
}

.assoc-achievements .badge.paper { color: #a78bfa; }
.assoc-achievements .badge.patent { color: #34d399; }
.assoc-achievements .badge.award { color: #fbbf24; }

/* Right Sidebar Dashboard */
.right-sidebar {
  width: 250px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-shrink: 0;
  overflow-y: auto;
}

.right-sidebar h3 {
  font-size: 12px;
  color: #fff;
  font-weight: bold;
  margin-bottom: 12px;
  border-left: 2px solid #38bdf8;
  padding-left: 8px;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.dashboard-stats .stat-item {
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 10px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dashboard-stats .lbl {
  font-size: 9px;
  color: var(--color-text-secondary);
}

.dashboard-stats .val {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.dashboard-stats .val small {
  font-size: 9px;
  font-weight: normal;
  color: var(--color-text-secondary);
}

.text-orange { color: #fbbf24; }
.text-blue { color: #38bdf8; }
.text-green { color: #10b981; }

.distribution-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 11px;
}

.distribution-list .lbl-row {
  display: flex;
  justify-content: space-between;
  color: var(--color-text-secondary);
}

.distribution-list .track {
  height: 5px;
  background: rgba(255,255,255,0.05);
  border-radius: 2.5px;
}

.distribution-list .fill {
  height: 100%;
  background: #38bdf8;
  border-radius: 2.5px;
}

/* AI Recommendation Section */
.highlight-section {
  background: rgba(0, 168, 255, 0.02);
  padding: 12px;
}

.rec-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rec-card {
  background: rgba(255,255,255,0.01);
  padding: 8px;
  border-radius: 4px;
}

.rec-card h5 {
  font-size: 11px;
  color: #38bdf8;
  margin-bottom: 2px;
}

.rec-card p {
  font-size: 9px;
  color: var(--color-text-secondary);
  line-height: 1.3;
}

.badge-rec {
  font-size: 8px;
  color: #fbbf24;
  margin-top: 4px;
  display: inline-block;
}

/* ========================================================
   PROJECT DETAILS DIALOG
   ======================================================== */
.detail-dialog-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(1, 4, 15, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.detail-dialog-window {
  width: 90%;
  max-width: 600px;
  background: var(--bg-modal);
  box-shadow: 0 10px 40px rgba(0,0,0,0.8), 0 0 20px rgba(56, 189, 248, 0.15);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  max-height: 85vh;
  overflow: hidden;
  animation: scale-up 0.25s ease-out;
}

@keyframes scale-up {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.dialog-header {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(56, 189, 248, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-header h3 {
  font-size: 14px;
  color: #38bdf8;
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  font-size: 20px;
  cursor: pointer;
}

.dialog-body {
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dialog-top-meta {
  display: flex;
  gap: 16px;
  background: rgba(255,255,255,0.01);
  padding: 12px;
  border-radius: 6px;
}

.dialog-top-meta .cover-box {
  width: 140px;
  height: 80px;
  background: #020617;
  border-radius: 4px;
  overflow: hidden;
}

.dialog-top-meta .info-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11px;
  color: var(--color-text-secondary);
}

.dialog-top-meta h4 {
  font-size: 14px;
  color: #fff;
  margin: 0;
}

.dialog-top-meta .tag {
  background: rgba(56, 189, 248, 0.1);
  color: #38bdf8;
  padding: 1px 4px;
  border-radius: 2px;
}

.dialog-section h5 {
  font-size: 12px;
  color: #fff;
  margin-bottom: 6px;
  border-left: 2px solid #38bdf8;
  padding-left: 6px;
}

.intro-p {
  font-size: 11px;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.modules-list {
  list-style: none;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.modules-list li {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-secondary);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-dot.online { background: var(--status-online); }
.status-dot.busy { background: var(--status-busy); }
.status-dot.offline { background: var(--color-text-secondary); }

.text-green { color: var(--status-online); }
.text-orange { color: #fbbf24; }
.text-gray { color: var(--color-text-secondary); }

.achievements-bullet-list {
  list-style: none;
  font-size: 11px;
  color: var(--color-text-secondary);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dialog-footer {
  padding: 12px 16px;
  border-top: 1px solid rgba(255,255,255,0.05);
  display: flex;
  justify-content: flex-end;
}

.btn-primary {
  background: #38bdf8;
  border: none;
  color: #020617;
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
}

.btn-primary:hover {
  background: #0ea5e9;
}

.projects-showcase-container {
  height: calc(100vh - 106px);
  gap: 20px;
  padding: 18px 22px;
}

.left-sidebar {
  width: 250px;
  padding: 20px;
}

.right-sidebar {
  width: 300px;
  padding: 20px;
}

.center-feed {
  padding: 20px;
}

.left-sidebar h3,
.right-sidebar h3,
.dialog-header h3 {
  font-size: 16px;
}

.filter-list li,
.top-actions-bar .search-box input,
.sort-group,
.sort-group select,
.layout-toggle button,
.distribution-list,
.ai-query-box .desc,
.ai-query-box .questions,
.dialog-top-meta .info-box,
.intro-p,
.modules-list,
.achievements-bullet-list {
  font-size: 13px;
}

.left-sidebar h3 {
  font-size: 20px;
}

.left-sidebar .filter-list li {
  min-height: 34px;
  font-size: 15px;
  padding: 7px 10px;
}

.projects-layout-grid {
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 18px;
}

.projects-layout-list .project-showcase-card {
  height: 178px;
}

.projects-layout-grid .proj-img-box {
  height: 142px;
}

.projects-layout-list .proj-img-box {
  width: 250px;
}

.proj-body {
  padding: 16px;
  gap: 10px;
}

.proj-body h4,
.dialog-top-meta h4,
.dialog-section h5,
.rec-card h5 {
  font-size: 16px;
}

.proj-body .desc,
.proj-body .people-row,
.progress-section,
.assoc-achievements,
.dashboard-stats .lbl,
.rec-card p {
  font-size: 13px;
}

.dashboard-stats .val {
  font-size: 22px;
}

.top-actions-bar .search-box {
  width: 330px;
}
</style>
