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
            <option value="progress">成果占比</option>
            <option value="achievements">成果数量</option>
            <option value="date">更新时间</option>
          </select>
        </div>

      </div>

      <!-- Scrollable Projects List -->
      <div class="projects-list-scroll scroll-container">
        <div class="projects-layout-list">
          <div 
            v-for="proj in filteredAndSortedProjects" 
            :key="proj.id" 
            class="project-showcase-card certificate-layout-row glass-panel"
            @click="openProjectDetail(proj)"
          >
            <aside class="certificate-side">
              <span class="direction-tag static">{{ proj.direction }}</span>
              <div class="certificate-side-stats">
                <span>软著/专利 {{ proj.patentsCount }}</span>
                <span>奖项 {{ proj.awardsCount }}</span>
              </div>
              <a
                v-if="proj.pdfUrl"
                class="pdf-open-link"
                :href="proj.pdfUrl"
                target="_blank"
                rel="noopener"
                @click.stop
              >
                打开PDF附件
              </a>
            </aside>
            <!-- Card Image -->
            <div class="proj-img-box">
              <img v-if="proj.cover" :src="proj.cover" alt="项目封面" class="proj-cover-img" loading="lazy" decoding="async" />
              <div v-else class="project-no-image">PDF 附件</div>
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
                  <span>成果占比:</span>
                  <strong>{{ proj.evidencePercent }}%</strong>
                </div>
                <div class="progress-track">
                  <div class="progress-bar" :style="{ width: proj.evidencePercent + '%' }"></div>
                </div>
              </div>

              <!-- Associated Achievements -->
              <div class="assoc-achievements">
                <span class="label">沉淀成果:</span>
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
            <span class="val">{{ projectStats.total }} <small>个</small></span>
          </div>
          <div class="stat-item">
            <span class="lbl">竞赛奖项</span>
            <span class="val text-orange">{{ projectStats.awards }} <small>项</small></span>
          </div>
          <div class="stat-item">
            <span class="lbl">专利软著</span>
            <span class="val text-blue">{{ projectStats.patents }} <small>项</small></span>
          </div>
          <div class="stat-item">
            <span class="lbl">真实成果</span>
            <span class="val text-green">{{ projectStats.achievements }} <small>项</small></span>
          </div>
        </div>
      </section>

      <!-- Direction Distribution -->
      <section class="sidebar-section">
        <h3>📈 成果方向分布</h3>
        <div class="distribution-list">
          <div class="dist-item" v-for="d in directionDistribution" :key="d.name">
            <div class="lbl-row">
              <span>{{ d.name }}</span>
              <span>{{ d.count }}个</span>
            </div>
            <div class="track">
              <div class="fill" :style="{ width: phaseBarWidth(d.count) }"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Real Source Summary -->
      <section class="sidebar-section highlight-section glass-panel">
        <h3>📎 真实来源摘要</h3>
        <div class="rec-list">
          <div class="rec-card" v-for="rp in recommendedProjects" :key="rp.title">
            <h5>{{ rp.title }}</h5>
            <p>{{ rp.reason }}</p>
            <span class="badge-rec">来源: 实验室竞赛成果_附件</span>
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
              <img v-if="activeDetailProject.cover" :src="activeDetailProject.cover" alt="封面" style="width:100%; height:120px; object-fit:contain; opacity: 1; background:#06122d;" />
              <div v-else class="project-no-image detail">PDF 附件</div>
            </div>
            <div class="info-box">
              <h4>{{ activeDetailProject.title }}</h4>
              <p>方向：<span class="tag">{{ activeDetailProject.direction }}</span> · 归档：<span class="state-badge" :class="activeDetailProject.stateClass">{{ activeDetailProject.state }}</span></p>
              <p>负责人：<strong>{{ activeDetailProject.owner }}</strong></p>
              <p>材料年份：{{ activeDetailProject.timeline }}</p>
            </div>
          </div>

          <div class="dialog-section">
            <h5>项目简介</h5>
            <p class="intro-p">{{ activeDetailProject.desc }}</p>
            <a
              v-if="activeDetailProject.pdfUrl"
              class="pdf-open-link"
              :href="activeDetailProject.pdfUrl"
              target="_blank"
              rel="noopener"
            >
              打开PDF附件
            </a>
          </div>

          <div class="dialog-section">
            <h5>真实成果数量</h5>
            <div class="progress-section" style="margin-bottom: 12px;">
              <div class="progress-header"><span>该分组成果占比</span><strong>{{ activeDetailProject.evidencePercent }}%</strong></div>
              <div class="progress-track"><div class="progress-bar" :style="{ width: activeDetailProject.evidencePercent + '%' }"></div></div>
            </div>
            <ul class="modules-list">
              <li><span class="status-dot online"></span> 竞赛奖项: <span class="text-green">{{ activeDetailProject.awardsCount }} 项</span></li>
              <li><span class="status-dot online"></span> 软著/专利: <span class="text-green">{{ activeDetailProject.patentsCount }} 项</span></li>
              <li><span class="status-dot online"></span> 附件状态: <span class="text-green">{{ activeDetailProject.state }}</span></li>
            </ul>
          </div>

          <div class="dialog-section">
            <h5>关联的成果沉淀</h5>
            <ul class="achievements-bullet-list">
              <li>💡 软著/专利: {{ activeDetailProject.achievementDetails.patent }}</li>
              <li>🏆 奖项: {{ activeDetailProject.achievementDetails.award }}</li>
              <li>📎 来源: {{ activeDetailProject.achievementDetails.source }}</li>
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
import {
  realAchievementProjects,
  realProjectDirections,
  getDirectionCounts
} from './labAchievementData';

const selectedDirection = ref('all');
const selectedState = ref('all');
const searchQuery = ref('');
const sortBy = ref('default');
const activeDetailProject = ref(null);

const directions = realProjectDirections;

const states = [
  { label: '全部归档状态', value: 'all' },
  { label: '附件归档', value: '附件归档' }
];

const directionDistribution = getDirectionCounts(realAchievementProjects);

const recommendedProjects = [
  { title: realAchievementProjects[0].title, reason: '由智警杯、智能警务挑战赛等附件奖项材料归纳。' },
  { title: realAchievementProjects[2].title, reason: '由蓝桥杯国赛、省赛与程序设计竞赛附件材料归纳。' }
];

const totalEvidence = realAchievementProjects.reduce((sum, project) => sum + project.patentsCount + project.awardsCount, 0);

const projects = realAchievementProjects.map((project) => ({
  ...project,
  state: '附件归档',
  stateClass: 'green-tag',
  progress: Math.round(((project.patentsCount + project.awardsCount) / Math.max(totalEvidence, 1)) * 100),
  evidencePercent: Math.round(((project.patentsCount + project.awardsCount) / Math.max(totalEvidence, 1)) * 100),
  achievementDetails: {
    patent: `${project.patentsCount} 项专利/软著成果`,
    award: `${project.awardsCount} 项真实竞赛获奖材料`,
    source: '赛事奖项、赛事奖项（开发看）、知识产权附件'
  }
}));

const projectStats = computed(() => ({
  total: projects.length,
  awards: projects.reduce((sum, project) => sum + project.awardsCount, 0),
  patents: projects.reduce((sum, project) => sum + project.patentsCount, 0),
  achievements: totalEvidence
}));

const maxPhaseCount = computed(() => Math.max(...directionDistribution.map((item) => item.count), 1));

const phaseBarWidth = (count) => `${Math.round((count / maxPhaseCount.value) * 100)}%`;

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
    list = [...list].sort((a, b) => b.evidencePercent - a.evidencePercent);
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

.projects-list-scroll {
  flex: 1;
  overflow-y: auto;
  margin-top: 16px;
}

.projects-layout-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-right: 4px;
}

.project-showcase-card {
  display: flex;
  align-items: center;
  overflow: hidden;
  background: rgba(9, 23, 55, 0.72);
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid rgba(79, 172, 254, 0.18);
  min-height: 270px;
}

.project-showcase-card:hover {
  background: rgba(0, 168, 255, 0.03);
  border-color: var(--color-border-active);
  box-shadow: 0 0 12px rgba(0, 168, 255, 0.1);
}

.certificate-layout-row {
  gap: 14px;
  padding: 10px 14px 10px 10px;
}

.certificate-side {
  width: 106px;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  flex-shrink: 0;
  padding-top: 8px;
}

.certificate-side-stats {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--color-text-secondary);
  font-size: 10px;
  line-height: 1.35;
}

.proj-img-box {
  position: relative;
  background: var(--bg-dark, #020617);
  border: 1px solid rgba(57, 166, 255, 0.22);
  border-radius: 4px;
  flex-shrink: 0;
  width: 184px;
  height: 246px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.proj-cover-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 1;
  background-color: var(--bg-dark, #020617);
}

.project-no-image {
  width: 100%;
  height: 100%;
  min-height: 190px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fbbf24;
  font-weight: 700;
  font-size: 13px;
  background: linear-gradient(135deg, rgba(6, 18, 45, 0.94), rgba(2, 6, 20, 1));
}

.project-no-image.detail {
  height: 120px;
  min-height: 120px;
  border-radius: 4px;
}

.pdf-open-link {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid rgba(251, 191, 36, 0.36);
  background: rgba(251, 191, 36, 0.1);
  color: #fbbf24;
  font-size: 11px;
  font-weight: 700;
  text-decoration: none;
  line-height: 1.2;
  text-align: center;
}

.pdf-open-link:hover {
  background: rgba(251, 191, 36, 0.18);
  border-color: rgba(251, 191, 36, 0.58);
}

.direction-tag {
  background: rgba(56, 189, 248, 0.25);
  border: 1px solid #38bdf8;
  color: #fff;
  font-size: 8px;
  padding: 1px 6px;
  border-radius: 4px;
}

.direction-tag.static {
  position: static;
  max-width: 100%;
  min-height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 8px;
  line-height: 1.2;
  text-align: center;
  white-space: normal;
}

.proj-body {
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;
  min-width: 0;
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
  max-height: 64px;
  overflow: hidden;
}

.proj-body .people-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
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
  width: 160px;
  height: 214px;
  background: var(--bg-dark, #020617);
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid rgba(57, 166, 255, 0.22);
}

.dialog-top-meta .cover-box img {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;
  background: var(--bg-dark, #020617) !important;
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

.project-showcase-card {
  min-height: 270px;
}

.proj-img-box {
  width: 184px;
  height: 246px;
}

.proj-body {
  padding: 12px 0;
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
