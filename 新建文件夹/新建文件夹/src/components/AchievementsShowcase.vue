<template>
  <div class="achievements-container">
    <!-- Left Sidebar: Achievements Categories -->
    <aside class="left-sidebar glass-panel font-num">
      <div class="sidebar-header">
        <h3>🏆 成果中心</h3>
      </div>
      <div class="nav-list">
        <button 
          v-for="cat in categories" 
          :key="cat.id" 
          class="nav-btn" 
          :class="{ active: activeCategory === cat.id }"
          @click="activeCategory = cat.id"
        >
          <span class="icon">{{ cat.icon }}</span>
          <span class="lbl">{{ cat.label }}</span>
        </button>
      </div>

      <!-- Quick Stats Widget -->
      <div class="sidebar-footer-widget glass-panel">
        <h5>运行动态</h5>
        <div class="metric-row">
          <span>附件奖项:</span>
          <strong class="green-text">{{ awardsSummary.total }} 项</strong>
        </div>
        <div class="metric-row">
          <span>产权附件:</span>
          <strong class="orange-text">{{ patentsList.length }} 项</strong>
        </div>
      </div>
    </aside>

    <!-- Main Content Area based on Selected Tab -->
    <main class="main-content-panel glass-panel">
      <!-- 1. 成果总览 SUBPAGE -->
      <div v-if="activeCategory === 'overview'" class="tab-pane-overview font-num">
        <!-- Top Metrics Cards -->
        <div class="overview-stats-grid">
          <div class="stat-card" v-for="stat in overviewStats" :key="stat.label" :class="stat.class">
            <span class="icon">{{ stat.icon }}</span>
            <div class="txt">
              <span class="val">{{ stat.val }}</span>
              <span class="lbl">{{ stat.label }}</span>
            </div>
          </div>
        </div>

        <div class="overview-body-grid">
          <!-- Left: Charts & Graphs -->
          <div class="left-charts-col">
            <!-- Classification Share (Donut SVG) -->
            <div class="chart-box glass-panel">
              <h4>成果分类占比</h4>
              <div class="donut-chart-wrapper">
                <svg viewBox="0 0 100 100" class="donut-svg">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.03)" stroke-width="12"></circle>
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" stroke-width="12" :stroke-dasharray="donutSegment(achievementSummary.patents)" stroke-dashoffset="0" transform="rotate(-90 50 50)"></circle>
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#fbbf24" stroke-width="12" :stroke-dasharray="donutSegment(achievementSummary.awards)" :stroke-dashoffset="donutOffset(achievementSummary.patents)" transform="rotate(-90 50 50)"></circle>
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8b5cf6" stroke-width="12" :stroke-dasharray="donutSegment(achievementSummary.projects)" :stroke-dashoffset="donutOffset(achievementSummary.patents + achievementSummary.awards)" transform="rotate(-90 50 50)"></circle>
                </svg>
                <div class="donut-center-txt">
                  <span class="num">{{ achievementSummary.total }}</span>
                  <span class="lbl">成果总量</span>
                </div>
              </div>
              <div class="legend-list">
                <div class="legend-item"><span class="bullet" style="background:#10b981"></span> 专利软著: {{ achievementSummary.patents }}项 ({{ achievementPercent(achievementSummary.patents) }}%)</div>
                <div class="legend-item"><span class="bullet" style="background:#fbbf24"></span> 竞赛获奖: {{ achievementSummary.awards }}项 ({{ achievementPercent(achievementSummary.awards) }}%)</div>
                <div class="legend-item"><span class="bullet" style="background:#8b5cf6"></span> 项目成果: {{ achievementSummary.projects }}项 ({{ achievementPercent(achievementSummary.projects) }}%)</div>
              </div>
            </div>

            <!-- Growth Trend (SVG Line) -->
            <div class="chart-box glass-panel">
              <h4>成果季度增长趋势</h4>
              <div class="line-chart-wrapper">
                <svg viewBox="0 0 100 40" class="line-svg">
                  <!-- Grid lines -->
                  <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(255,255,255,0.03)" stroke-width="0.5" />
                  <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.03)" stroke-width="0.5" />
                  <line x1="0" y1="30" x2="100" y2="30" stroke="rgba(255,255,255,0.03)" stroke-width="0.5" />
                  
                  <!-- Area path under line -->
                  <path d="M 0,38 L 20,32 L 40,24 L 60,18 L 80,12 L 100,6 L 100,38 Z" fill="rgba(56, 189, 248, 0.08)" />
                  <!-- Trend line -->
                  <path d="M 0,38 L 20,32 L 40,24 L 60,18 L 80,12 L 100,6" fill="none" stroke="#38bdf8" stroke-width="1.5" />
                  
                  <!-- Dots -->
                  <circle cx="20" cy="32" r="1.5" fill="#38bdf8" />
                  <circle cx="40" cy="24" r="1.5" fill="#38bdf8" />
                  <circle cx="60" cy="18" r="1.5" fill="#38bdf8" />
                  <circle cx="80" cy="12" r="1.5" fill="#38bdf8" />
                  <circle cx="100" cy="6" r="1.5" fill="#38bdf8" />
                </svg>
                <div class="axis-labels">
                  <span>25-Q1</span>
                  <span>25-Q2</span>
                  <span>25-Q3</span>
                  <span>25-Q4</span>
                  <span>26-Q1</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Middle: Latest Representative Achievements -->
          <div class="mid-cards-col">
            <div class="glass-panel main-rec-box">
              <h4>最新代表性成果</h4>
              <div class="latest-cards-list">
                <!-- 1. Patent -->
                <div class="latest-c-card" @click="activeCategory = 'patents'">
                  <div class="icon-tag patent">💡 专利</div>
                  <div class="info">
                    <h5>{{ featuredPatent.name }}</h5>
                    <p class="desc">{{ featuredPatent.type }} · {{ featuredPatent.code }} · {{ featuredPatent.status }}</p>
                  </div>
                  <span class="date">{{ featuredPatent.date }}</span>
                </div>

                <!-- 2. Award -->
                <div class="latest-c-card" @click="activeCategory = 'awards'">
                  <div class="icon-tag award">🏆 奖项</div>
                  <div class="info">
                    <h5>{{ featuredAward.name }}</h5>
                    <p class="desc">{{ featuredAward.level }} · 参赛成员：{{ featuredAward.team }}</p>
                  </div>
                  <span class="date">{{ featuredAward.date }}</span>
                </div>

                <!-- 3. Project -->
                <div class="latest-c-card" @click="activeCategory = 'projects'">
                  <div class="icon-tag project">📁 项目</div>
                  <div class="info">
                    <h5>{{ featuredProject.title }}</h5>
                    <p class="desc">来源：实验室竞赛成果_附件 · 关联 {{ featuredProject.patentsCount }} 项产权</p>
                  </div>
                  <span class="date">附件归档</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Real-time update logs -->
          <div class="right-logs-col">
            <section class="glass-panel logs-box scroll-y">
              <h4>最新成果动态</h4>
              <div class="timeline-logs font-num">
                <div class="log-item" v-for="log in latestLogs" :key="log.time">
                  <span class="time">{{ log.time }}</span>
                  <span class="bullet" :class="log.class"></span>
                  <p class="txt"><strong>{{ log.user }}</strong> {{ log.action }} <span class="text-highlight">《{{ log.title }}》</span></p>
                </div>
              </div>
            </section>
          </div>
        </div>

      </div>

      <!-- 2. 项目成果 SUBPAGE -->
      <div v-else-if="activeCategory === 'projects'" class="tab-pane-projects font-num">
        <div class="projects-content-wrapper">
          <div class="main-projects-list">
            <!-- Search & Filters -->
            <div class="filter-top-bar">
              <div class="filter-group">
                <span class="lbl">方向筛选:</span>
                <button 
                  v-for="dir in projectDirections" 
                  :key="dir.value"
                  class="filter-btn"
                  :class="{ active: selectedProjDir === dir.value }"
                  @click="selectedProjDir = dir.value"
                >
                  {{ dir.label }}
                </button>
              </div>
            </div>

            <!-- Projects List -->
            <div class="projects-cards-scroll scroll-container">
              <div class="projects-list-view">
                <div class="proj-list-row certificate-layout-row glass-panel" v-for="proj in filteredProjects" :key="proj.title">
                  <aside class="certificate-side">
                    <span class="direction-badge static">{{ proj.direction }}</span>
                    <div class="certificate-side-stats">
                      <span>产权 {{ proj.patents }}</span>
                      <span>奖项 {{ proj.awards }}</span>
                    </div>
                    <a
                      v-if="proj.pdfUrl"
                      class="pdf-open-link"
                      :href="proj.pdfUrl"
                      target="_blank"
                      rel="noopener"
                    >
                      打开PDF附件
                    </a>
                  </aside>
                  <div class="cover-image-container">
                    <img v-if="proj.cover" :src="proj.cover" class="cover-img" alt="项目图" loading="lazy" decoding="async" />
                    <div v-else class="project-no-image">PDF 附件</div>
                  </div>
                  <div class="proj-meta">
                    <h4>{{ proj.title }}</h4>
                    <p class="desc">{{ proj.desc }}</p>
                    <div class="team-row">
                      <span>成员:</span>
                      <span class="member" v-for="m in proj.members" :key="m">👤 {{ m }}</span>
                    </div>
                    <div class="assoc-stats-row">
                      <span>💡 产权: <strong>{{ proj.patents }}</strong></span>
                      <span>🏆 奖项: <strong>{{ proj.awards }}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Project Stats & AI Query -->
          <aside class="projects-right-sidebar">
            <div class="chart-box glass-panel">
              <h4>项目分类统计</h4>
              <div class="simple-bar-chart">
                <div class="chart-bar-item" v-for="c in projectDirectionCounts" :key="c.name">
                  <div class="lbl-row">
                    <span>{{ c.name }}</span>
                    <span>{{ c.count }}个</span>
                  </div>
                  <div class="progress-bar-container">
                    <div class="progress-fill" :style="{ width: projectDirectionBarWidth(c.count) }"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- AI Assistant Shortcut -->
            <div class="ai-query-box glass-panel">
              <div class="header">
                <span class="icon">🐱</span>
                <h5>小喵成果助手</h5>
              </div>
              <p class="desc">有什么关于项目成果想知道的？问小喵：</p>
              <ul class="questions">
                <li>• 哪些项目成果已经在公安实战落地？</li>
                <li>• 智能硬件方向有几个已结项的项目？</li>
              </ul>
              <button class="btn-ask-ai">询问小喵 →</button>
            </div>
          </aside>
        </div>
      </div>

      <!-- 3. 奖项成果 SUBPAGE -->
      <div v-else-if="activeCategory === 'awards'" class="tab-pane-awards font-num">
        <div class="awards-body-grid">
          <!-- Left: Big Featured Award -->
          <div class="featured-award-col">
            <div class="glass-panel featured-award-card">
              <div class="badge-tag">🏆 重点成果展示</div>
              <div class="image-box">
                <img :src="displayedAward.image || featuredProject.cover" alt="获奖证书" class="featured-img" style="opacity: 1; object-fit: contain; background-color:#0d1d40;" />
                <div class="img-overlay">
                  <h4>{{ displayedAward.name }}</h4>
                  <span class="rank">{{ displayedAward.level }}</span>
                </div>
              </div>
              <div class="details">
                <p class="title"><strong>获奖项目:</strong> {{ featuredProject.title }}</p>
                <p class="team"><strong>参赛成员:</strong> {{ displayedAward.team }}</p>
                <p class="mentor"><strong>指导教师:</strong> {{ displayedAward.mentor }}</p>
                <p class="desc">
                  {{ displayedAward.sourceFile || featuredProject.desc }}
                </p>
                <a
                  v-if="displayedAward.pdfUrl"
                  class="pdf-open-link featured-pdf-link"
                  :href="displayedAward.pdfUrl"
                  target="_blank"
                  rel="noopener"
                >
                  打开PDF附件
                </a>
              </div>
            </div>
          </div>

          <!-- Right: List of other awards & Pie Stats -->
          <div class="other-awards-col">
            <div class="stats-top-row">
              <div class="sum-card">
                <span class="num">{{ awardsSummary.total }} <small>项</small></span>
                <span class="lbl">累计奖项</span>
              </div>
              <div class="sum-card">
                <span class="num">{{ awardsSummary.nationalFirst }} <small>项</small></span>
                <span class="lbl">国家一等奖</span>
              </div>
            </div>

            <div class="awards-list-box glass-panel">
              <h4>竞赛获奖列表</h4>
              <div class="awards-scroll scroll-container">
                <div
                  class="award-row-card glass-panel"
                  v-for="aw in awardsList"
                  :key="aw.id || aw.name"
                  :class="{ active: activeAwardKey === (aw.id || aw.name) }"
                  @click="selectedAward = aw"
                >
                  <span class="medal">🥇</span>
                  <div class="award-thumb-wrap">
                    <img v-if="aw.image" :src="aw.image" :alt="aw.name" class="award-thumb-img" loading="lazy" decoding="async" />
                    <span v-else class="no-thumb">PDF</span>
                  </div>
                  <div class="txt">
                    <h5>{{ aw.name }}</h5>
                    <p class="lvl">{{ aw.level }} · 主办单位: {{ aw.host }}</p>
                    <p class="team">成员: {{ aw.team }} · 指导: {{ aw.mentor }}</p>
                    <a
                      v-if="aw.pdfUrl"
                      class="pdf-open-link award-pdf-link"
                      :href="aw.pdfUrl"
                      target="_blank"
                      rel="noopener"
                      @click.stop
                    >
                      打开PDF
                    </a>
                  </div>
                  <span class="date">{{ aw.date }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. 产权成果 SUBPAGE -->
      <div v-else-if="activeCategory === 'patents'" class="tab-pane-patents font-num">
        <div class="patents-grid-layout">
          <!-- Left: Big Patent Certificate Card -->
          <div class="cert-col">
            <div class="glass-panel cert-card">
              <div class="cert-header">💡 代表性知识产权</div>
              <div class="cert-image-preview">
                <img v-if="displayedPatent.image" :src="displayedPatent.image" alt="知识产权附件" class="cert-real-img" decoding="async" />
                <div v-else class="cert-no-image">附件暂无图片</div>
                <div class="badge-stamp">已授权</div>
                <span class="cert-title">{{ displayedPatent.type }}</span>
                <span class="pat-name">《{{ displayedPatent.name }}》</span>
              </div>
              <ul class="meta-details">
                <li><span>专利类型:</span> <strong>{{ displayedPatent.type }}</strong></li>
                <li><span>申请号:</span> <strong>{{ displayedPatent.code }}</strong></li>
                <li><span>授权公告号:</span> <strong>{{ displayedPatent.status }}</strong></li>
                <li><span>专利权人:</span> <strong>智慧实验室</strong></li>
                <li><span>第一发明人:</span> <strong>{{ displayedPatent.role }}</strong></li>
                <li><span>关联项目:</span> <strong>{{ featuredProject.title }}</strong></li>
              </ul>
            </div>
          </div>

          <!-- Right: List / Table of Patents -->
          <div class="table-col">
            <div class="table-actions-row">
              <h3>知识产权台账</h3>
              <div class="actions font-num">
                <select class="select-year"><option>2026年</option><option>2025年</option></select>
                <button class="btn-export">📥 导出数据</button>
              </div>
            </div>

            <div class="table-box glass-panel scroll-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>附件图</th>
                    <th>产权名称</th>
                    <th>类型</th>
                    <th>编号/登记号</th>
                    <th>来源</th>
                    <th>当前状态</th>
                    <th>角色</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="pat in patentsList"
                    :key="pat.name"
                    :class="{ active: displayedPatent.name === pat.name }"
                    @click="selectedPatent = pat"
                  >
                    <td>
                      <img v-if="pat.image" :src="pat.image" :alt="pat.name" class="patent-thumb-img" loading="lazy" decoding="async" />
                      <span v-else class="no-thumb compact">无图</span>
                    </td>
                    <td class="text-highlight">{{ pat.name }}</td>
                    <td>{{ pat.type }}</td>
                    <td>{{ pat.code }}</td>
                    <td>{{ pat.date }}</td>
                    <td><span class="status-tag" :class="pat.statusClass">{{ pat.status }}</span></td>
                    <td><strong>{{ pat.role }}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  realAwardsList,
  realPatentsList,
  realAchievementProjects,
  realProjectDirections,
  getDirectionCounts,
  getOverviewStats
} from './labAchievementData';

const activeCategory = ref('overview');
const selectedProjDir = ref('all');
const selectedAward = ref(null);
const selectedPatent = ref(null);

const categories = [
  { id: 'overview', label: '成果总览', icon: '📊' },
  { id: 'projects', label: '项目成果', icon: '📁' },
  { id: 'awards', label: '奖项成果', icon: '🏆' },
  { id: 'patents', label: '产权成果', icon: '💡' }
];

const overviewStats = getOverviewStats();
const projectDirections = realProjectDirections.map((direction) => (
  direction.value === 'all' ? { ...direction, label: '全部项目' } : direction
));
const projectDirectionCounts = getDirectionCounts(realAchievementProjects);
const achievementSummary = {
  patents: realPatentsList.length,
  awards: realAwardsList.length,
  projects: realAchievementProjects.length
};
achievementSummary.total = achievementSummary.patents + achievementSummary.awards + achievementSummary.projects;
const donutCircumference = 251.2;

const achievementPercent = (count) => {
  if (!achievementSummary.total) return 0;
  return Math.round((count / achievementSummary.total) * 100);
};

const donutSegment = (count) => {
  const length = achievementSummary.total ? (count / achievementSummary.total) * donutCircumference : 0;
  return `${length} ${donutCircumference}`;
};

const donutOffset = (countBefore) => {
  const length = achievementSummary.total ? (countBefore / achievementSummary.total) * donutCircumference : 0;
  return `-${length}`;
};

const maxDirectionCount = computed(() => Math.max(...projectDirectionCounts.map((item) => item.count), 1));
const projectDirectionBarWidth = (count) => `${Math.round((count / maxDirectionCount.value) * 100)}%`;

const latestLogs = [
  { time: '09:39', class: 'orange', user: '成果管理员', action: '归档竞赛获奖材料', title: realAwardsList[0].name },
  { time: '09:12', class: 'green', user: '知识产权管理员', action: '录入知识产权台账', title: realPatentsList[0].name },
  { time: '08:58', class: 'purple', user: '项目展厅', action: '更新项目成果分组', title: realAchievementProjects[0].title },
  { time: '08:15', class: 'blue', user: '成果中心', action: '同步附件目录真实数据', title: '实验室竞赛成果_附件' }
];

const projectsList = realAchievementProjects.map((project) => ({
  title: project.title,
  direction: project.direction,
  desc: project.desc,
  members: project.members,
  patents: project.patentsCount,
  awards: project.awardsCount,
  cover: project.cover
}));

const filteredProjects = computed(() => {
  if (selectedProjDir.value === 'all') return projectsList;
  return projectsList.filter(p => p.direction === selectedProjDir.value);
});

const awardsList = realAwardsList;
const patentsList = realPatentsList;
const featuredAward = awardsList.find((award) => award.image && award.level.includes('特等奖')) || awardsList.find((award) => award.image) || awardsList[0];
const featuredPatent = patentsList.find((patent) => patent.image) || patentsList[0];
const featuredProject = realAchievementProjects[0];
const displayedAward = computed(() => selectedAward.value || featuredAward);
const displayedPatent = computed(() => selectedPatent.value || featuredPatent);
const activeAwardKey = computed(() => displayedAward.value?.id || displayedAward.value?.name);
const awardsSummary = {
  total: awardsList.length,
  nationalFirst: awardsList.filter((award) => award.level.includes('国家级一等奖')).length
};
</script>

<style scoped>
.achievements-container {
  height: calc(100vh - 110px);
  width: 100%;
  display: flex;
  gap: 16px;
  padding: 16px;
  overflow: hidden;
}

/* Sidebar navigation */
.left-sidebar {
  width: 240px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-shrink: 0;
}

.sidebar-header h3 {
  font-size: 22px;
  color: #fff;
  font-weight: bold;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  background: transparent;
  border: 1px solid transparent;
  color: var(--color-text-secondary);
  min-height: 48px;
  padding: 12px 17px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  text-align: left;
  transition: all 0.2s;
}

.nav-btn .icon {
  width: 22px;
  flex-shrink: 0;
  text-align: center;
  font-size: 18px;
}

.nav-btn .lbl {
  line-height: 1.2;
}

.nav-btn:hover {
  background: rgba(0, 168, 255, 0.05);
  color: #fff;
}

.nav-btn.active {
  background: rgba(0, 168, 255, 0.2);
  border-color: var(--color-border-active);
  color: #fff;
  font-weight: bold;
}

.sidebar-footer-widget {
  margin-top: auto;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
}

.sidebar-footer-widget h5 {
  font-size: 12px;
  color: #fff;
  margin-bottom: 8px;
}

.sidebar-footer-widget .metric-row {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.green-text { color: var(--status-online); }
.orange-text { color: var(--status-busy); }

/* Main Content Panel */
.main-content-panel {
  flex: 1;
  background: var(--bg-panel);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 16px;
}

.main-content-panel,
.tab-pane-overview,
.tab-pane-projects,
.tab-pane-awards,
.tab-pane-patents,
.projects-cards-scroll,
.awards-scroll,
.table-box,
.scroll-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(91, 152, 220, 0.95) rgba(5, 18, 42, 0.88);
  scrollbar-gutter: stable;
}

.main-content-panel::-webkit-scrollbar,
.tab-pane-overview::-webkit-scrollbar,
.tab-pane-projects::-webkit-scrollbar,
.tab-pane-awards::-webkit-scrollbar,
.tab-pane-patents::-webkit-scrollbar,
.projects-cards-scroll::-webkit-scrollbar,
.awards-scroll::-webkit-scrollbar,
.table-box::-webkit-scrollbar,
.scroll-container::-webkit-scrollbar {
  width: 9px;
}

.main-content-panel::-webkit-scrollbar-track,
.tab-pane-overview::-webkit-scrollbar-track,
.tab-pane-projects::-webkit-scrollbar-track,
.tab-pane-awards::-webkit-scrollbar-track,
.tab-pane-patents::-webkit-scrollbar-track,
.projects-cards-scroll::-webkit-scrollbar-track,
.awards-scroll::-webkit-scrollbar-track,
.table-box::-webkit-scrollbar-track,
.scroll-container::-webkit-scrollbar-track {
  background: rgba(5, 18, 42, 0.88);
  border: 1px solid rgba(54, 126, 210, 0.35);
  border-radius: 8px;
}

.main-content-panel::-webkit-scrollbar-thumb,
.tab-pane-overview::-webkit-scrollbar-thumb,
.tab-pane-projects::-webkit-scrollbar-thumb,
.tab-pane-awards::-webkit-scrollbar-thumb,
.tab-pane-patents::-webkit-scrollbar-thumb,
.projects-cards-scroll::-webkit-scrollbar-thumb,
.awards-scroll::-webkit-scrollbar-thumb,
.table-box::-webkit-scrollbar-thumb,
.scroll-container::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #6ea7f0, #3569a8);
  border-radius: 8px;
  border: 2px solid rgba(4, 15, 35, 0.96);
}

.tab-pane-projects,
.tab-pane-awards,
.tab-pane-patents {
  height: 100%;
  min-height: 0;
  overflow-y: scroll;
  padding-right: 10px;
}

/* ========================================================
   SUBPAGE: OVERVIEW
   ======================================================== */
.tab-pane-overview {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  overflow-y: scroll;
  padding-right: 10px;
}

.overview-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  flex-shrink: 0;
}

.overview-stats-grid .stat-card {
  background: rgba(255,255,255,0.01);
  border: 1px solid rgba(255,255,255,0.05);
  padding: 14px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.overview-stats-grid .stat-card .icon {
  font-size: 24px;
}

.overview-stats-grid .stat-card .txt {
  display: flex;
  flex-direction: column;
}

.overview-stats-grid .stat-card .val {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
}

.overview-stats-grid .stat-card .lbl {
  font-size: 11px;
  color: var(--color-text-secondary);
}

.overview-stats-grid .blue-s .icon { color: #38bdf8; }
.overview-stats-grid .green-s .icon { color: #10b981; }
.overview-stats-grid .orange-s .icon { color: #fbbf24; }

.overview-body-grid {
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 320px;
}

.left-charts-col {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
}

.chart-box {
  padding: 14px;
  display: flex;
  flex-direction: column;
}

.chart-box h4 {
  font-size: 12px;
  color: #fff;
  margin-bottom: 12px;
}

.donut-chart-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 12px auto;
}

.donut-center-txt {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.donut-center-txt .num { font-size: 16px; font-weight: bold; color: #fff;}
.donut-center-txt .lbl { font-size: 8px; color: var(--color-text-secondary); }

.donut-svg { width: 100%; height: 100%; }

.chart-box .legend-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 10px;
  color: var(--color-text-secondary);
}

.legend-list .bullet {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
}

.line-chart-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.line-svg {
  width: 100%;
}

.line-chart-wrapper .axis-labels {
  display: flex;
  justify-content: space-between;
  font-size: 8px;
  color: var(--color-text-secondary);
}

.mid-cards-col {
  flex: 1;
  display: flex;
}

.main-rec-box {
  flex: 1;
  padding: 16px;
}

.main-rec-box h4 {
  font-size: 13px;
  color: #fff;
  margin-bottom: 12px;
}

.latest-cards-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.latest-c-card {
  display: flex;
  align-items: center;
  padding: 12px;
  background: rgba(255,255,255,0.01);
  border: 1px solid rgba(255,255,255,0.03);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.latest-c-card:hover {
  background: rgba(0, 168, 255, 0.05);
  border-color: rgba(0, 168, 255, 0.2);
}

.latest-c-card .icon-tag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  margin-right: 15px;
  font-weight: bold;
}

.latest-c-card .icon-tag.paper { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }
.latest-c-card .icon-tag.patent { background: rgba(16, 185, 129, 0.15); color: #10b981; }
.latest-c-card .icon-tag.award { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
.latest-c-card .icon-tag.project { background: rgba(139, 92, 246, 0.15); color: #a78bfa; }

.latest-c-card .info {
  flex-grow: 1;
}

.latest-c-card h5 {
  font-size: 12px;
  color: #fff;
  margin: 0 0 2px 0;
}

.latest-c-card .desc {
  font-size: 10px;
  color: var(--color-text-secondary);
}

.latest-c-card .date {
  font-size: 10px;
  color: var(--color-text-secondary);
}

.right-logs-col {
  width: 250px;
  display: flex;
  flex-shrink: 0;
}

.logs-box {
  flex: 1;
  padding: 14px;
}

.logs-box h4 {
  font-size: 12px;
  color: #fff;
  margin-bottom: 12px;
}

.timeline-logs {
  border-left: 1px solid rgba(255,255,255,0.06);
  padding-left: 15px;
  margin-left: 5px;
}

.log-item {
  position: relative;
  margin-bottom: 15px;
  font-size: 10px;
}

.log-item:last-child {
  margin-bottom: 0;
}

.log-item .time {
  font-size: 8px;
  color: var(--color-text-secondary);
  display: block;
}

.log-item .bullet {
  position: absolute;
  left: -20px;
  top: 10px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-text-secondary);
}

.log-item .bullet.blue { background: #38bdf8; }
.log-item .bullet.green { background: #10b981; }
.log-item .bullet.orange { background: #fbbf24; }
.log-item .bullet.purple { background: #8b5cf6; }

.log-item .txt {
  color: var(--color-text-secondary);
  line-height: 1.3;
}

.log-item .txt strong {
  color: #fff;
}

.overview-footer-shortcuts {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: rgba(2, 6, 20, 0.4);
  flex-shrink: 0;
  font-size: 12px;
}

.shortcut-item span {
  color: var(--color-text-secondary);
  cursor: pointer;
}

.shortcut-item span:hover {
  color: #38bdf8;
}

.system-status {
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ========================================================
   SUBPAGE: PROJECTS
   ======================================================== */
.projects-content-wrapper {
  display: flex;
  gap: 16px;
  height: 100%;
}

.main-projects-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.filter-top-bar {
  display: flex;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group .lbl {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.filter-btn {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  color: var(--color-text-secondary);
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
}

.filter-btn.active {
  background: rgba(0, 168, 255, 0.2);
  border-color: var(--color-border-active);
  color: #fff;
}

.projects-cards-scroll {
  flex: 1;
  overflow-y: auto;
}

.projects-list-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-right: 4px;
}

.proj-list-row {
  display: flex;
  align-items: center;
  overflow: hidden;
  background: rgba(9, 23, 55, 0.72);
  min-height: 270px;
  border: 1px solid rgba(79, 172, 254, 0.18);
}

.certificate-layout-row {
  gap: 14px;
  padding: 10px 14px 10px 10px;
}

.certificate-side {
  width: 96px;
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

.cover-image-container {
  width: 184px;
  height: 246px;
  flex-shrink: 0;
  position: relative;
  background: var(--bg-dark, #020617);
  border: 1px solid rgba(57, 166, 255, 0.22);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: var(--bg-dark, #020617);
  opacity: 1;
}

.direction-badge {
  background: rgba(56, 189, 248, 0.25);
  border: 1px solid #38bdf8;
  color: #fff;
  font-size: 9px;
  padding: 1px 6px;
  border-radius: 4px;
}

.direction-badge.static {
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

.proj-meta {
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.proj-meta h4 {
  font-size: 13px;
  color: #fff;
  margin: 0;
}

.proj-meta .desc {
  font-size: 11px;
  color: var(--color-text-secondary);
  line-height: 1.4;
  margin: 0;
  max-height: 64px;
  overflow: hidden;
}

.team-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 10px;
  color: var(--color-text-secondary);
}

.team-row .member {
  color: #fff;
}

.assoc-stats-row {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--color-text-secondary);
  border-top: 1px dashed rgba(255,255,255,0.05);
  padding-top: 8px;
}

.assoc-stats-row strong {
  color: #fff;
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

.featured-pdf-link {
  margin-top: 4px;
}

.projects-right-sidebar {
  width: 260px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
}

.simple-bar-chart {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 11px;
}

.chart-bar-item .lbl-row {
  display: flex;
  justify-content: space-between;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.chart-bar-item .progress-bar-container {
  height: 6px;
  width: 100%;
  background: rgba(255,255,255,0.05);
  border-radius: 3px;
}

.chart-bar-item .progress-fill {
  height: 100%;
  background: #38bdf8;
  border-radius: 3px;
}

.ai-query-box {
  padding: 14px;
  background: rgba(0, 168, 255, 0.02);
}

.ai-query-box .header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.ai-query-box h5 {
  font-size: 12px;
  color: #38bdf8;
  margin: 0;
}

.ai-query-box .desc {
  font-size: 11px;
  color: var(--color-text-secondary);
}

.ai-query-box .questions {
  list-style: none;
  font-size: 10px;
  color: var(--color-text-secondary);
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 8px 0;
}

.btn-ask-ai {
  width: 100%;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid var(--color-border);
  color: #38bdf8;
  padding: 6px 0;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
}

.btn-ask-ai:hover {
  background: rgba(56, 189, 248, 0.2);
}

/* ========================================================
   SUBPAGE: AWARDS
   ======================================================== */
.awards-body-grid {
  display: flex;
  gap: 16px;
  height: 100%;
}

.featured-award-col {
  flex: 1.2;
}

.featured-award-card {
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.featured-award-card .badge-tag {
  font-size: 10px;
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 2px 8px;
  border-radius: 4px;
  align-self: flex-start;
}

.featured-award-card .image-box {
  position: relative;
  height: min(52vh, 420px);
  min-height: 320px;
  background: var(--bg-dark, #020617);
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(57, 166, 255, 0.22);
}

.featured-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: var(--bg-dark, #020617);
}

.img-overlay {
  display: none;
}

.img-overlay h4 {
  font-size: 14px;
  color: #fff;
  margin: 0;
}

.img-overlay .rank {
  font-size: 11px;
  color: #fbbf24;
}

.featured-award-card .details {
  font-size: 11px;
  color: var(--color-text-secondary);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.featured-award-card .details strong {
  color: #fff;
}

.featured-award-card .desc {
  line-height: 1.4;
  border-top: 1px dashed rgba(255,255,255,0.05);
  padding-top: 10px;
  margin-top: 6px;
}

.other-awards-col {
  flex: 1.5;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stats-top-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.sum-card {
  background: rgba(255,255,255,0.01);
  border: 1px solid rgba(255,255,255,0.05);
  padding: 12px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sum-card .num { font-size: 18px; font-weight: bold; color: #fff; }
.sum-card .lbl { font-size: 10px; color: var(--color-text-secondary); }

.awards-list-box {
  flex: 1;
  padding: 14px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.awards-scroll {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.award-row-card {
  display: flex;
  align-items: stretch;
  padding: 12px;
  background: rgba(255,255,255,0.01);
  cursor: pointer;
  border: 1px solid transparent;
  transition: border-color 0.2s, background 0.2s;
  min-height: 190px;
}

.award-row-card:hover,
.award-row-card.active {
  background: rgba(56, 189, 248, 0.06);
  border-color: rgba(56, 189, 248, 0.34);
}

.award-row-card .medal {
  font-size: 20px;
  margin-right: 12px;
  padding-top: 6px;
}

.award-thumb-wrap {
  width: 132px;
  height: 176px;
  margin-right: 12px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  background: var(--bg-dark, #020617);
  border: 1px solid rgba(56, 189, 248, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
}

.award-thumb-img,
.patent-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 1;
  background: var(--bg-dark, #020617);
}

.no-thumb {
  color: #fbbf24;
  font-size: 10px;
  font-weight: 700;
}

.no-thumb.compact {
  display: inline-flex;
  width: 56px;
  height: 42px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid rgba(251, 191, 36, 0.3);
  background: rgba(2, 12, 30, 0.82);
}

.award-row-card .txt {
  flex-grow: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}

.award-row-card h5 {
  font-size: 12px;
  color: #fff;
  margin: 0;
}

.award-row-card .lvl { font-size: 9px; color: #fbbf24; margin: 2px 0;}
.award-row-card .team { font-size: 9px; color: var(--color-text-secondary); }

.award-pdf-link {
  margin-top: 5px;
  min-height: 22px;
  padding: 2px 8px;
  font-size: 10px;
}

.award-row-card .date {
  font-size: 10px;
  color: var(--color-text-secondary);
  align-self: flex-start;
  padding-top: 6px;
  flex-shrink: 0;
}

/* ========================================================
   SUBPAGE: PATENTS
   ======================================================== */
.patents-grid-layout {
  display: flex;
  gap: 16px;
  height: 100%;
}

.cert-col {
  width: 280px;
  flex-shrink: 0;
}

.cert-card {
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cert-card .cert-header {
  font-size: 12px;
  color: #38bdf8;
  font-weight: bold;
}

.cert-image-preview {
  height: 180px;
  background: linear-gradient(135deg, rgba(6, 18, 45, 0.9) 0%, rgba(2, 6, 20, 1) 100%);
  border: 1px solid rgba(0, 168, 255, 0.2);
  border-radius: 6px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  text-align: center;
  overflow: hidden;
}

.cert-real-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0.86;
  background: #06122d;
}

.cert-no-image,
.project-no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fbbf24;
  font-weight: 700;
  font-size: 13px;
  background: linear-gradient(135deg, rgba(6, 18, 45, 0.94), rgba(2, 6, 20, 1));
}

.project-no-image {
  min-height: 120px;
}

.badge-stamp {
  position: absolute;
  top: 8px; right: 8px;
  z-index: 1;
  border: 1px solid var(--status-online);
  color: var(--status-online);
  font-size: 8px;
  padding: 1px 4px;
  border-radius: 2px;
  text-transform: uppercase;
}

.cert-image-preview .cert-title {
  position: relative;
  z-index: 1;
  background: rgba(2, 6, 20, 0.7);
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 13px;
  color: #fbbf24;
  font-weight: bold;
  letter-spacing: 2px;
}

.cert-image-preview .pat-name {
  position: relative;
  z-index: 1;
  background: rgba(2, 6, 20, 0.72);
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 9px;
  color: var(--color-text-secondary);
  margin-top: 10px;
  line-height: 1.4;
}

.meta-details {
  list-style: none;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.meta-details li {
  display: flex;
  justify-content: space-between;
}

.meta-details span { color: var(--color-text-secondary); }
.meta-details strong { color: #fff; }

.table-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.table-actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.table-actions-row h3 {
  font-size: 14px;
  color: #fff;
}

.table-actions-row .actions {
  display: flex;
  gap: 10px;
}

.select-year {
  background: rgba(0,0,0,0.3);
  border: 1px solid var(--color-border);
  color: #fff;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 11px;
}

.btn-export {
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid var(--color-border);
  color: #38bdf8;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
}

.table-box {
  flex: 1;
  overflow-y: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
  text-align: left;
}

.data-table th {
  padding: 8px;
  color: var(--color-text-secondary);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  font-weight: normal;
  position: sticky;
  top: 0;
  background: #040f26;
}

.data-table td {
  padding: 10px 8px;
  border-bottom: 1px dashed rgba(255,255,255,0.03);
  color: #fff;
}

.data-table tbody tr {
  cursor: pointer;
  transition: background 0.2s;
}

.data-table tbody tr:hover,
.data-table tbody tr.active {
  background: rgba(56, 189, 248, 0.06);
}

.patent-thumb-img {
  width: 56px;
  height: 42px;
  border-radius: 4px;
  border: 1px solid rgba(56, 189, 248, 0.18);
  background: #06122d;
  object-fit: contain;
}

/* ========================================================
   SUBPAGE: PAPERS
   ======================================================== */
.papers-grid-layout {
  display: flex;
  gap: 16px;
  height: 100%;
}

.papers-sidebar {
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
}

.paper-distribution {
  list-style: none;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.paper-distribution li {
  display: flex;
  justify-content: space-between;
  color: var(--color-text-secondary);
}

.paper-distribution strong {
  color: #fff;
}

.papers-main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.featured-paper-card {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
  flex-shrink: 0;
  border-left: 3px solid #38bdf8;
}

.featured-paper-card .badge-tag {
  font-size: 9px;
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
  padding: 1px 6px;
  border-radius: 3px;
  align-self: flex-start;
}

.featured-paper-card h4 {
  font-size: 13px;
  color: #fff;
  margin: 0;
  line-height: 1.4;
}

.featured-paper-card .authors, .featured-paper-card .journal {
  font-size: 10px;
  color: var(--color-text-secondary);
}

.featured-paper-card .abstract {
  font-size: 10px;
  color: var(--color-text-secondary);
  line-height: 1.4;
  background: rgba(255,255,255,0.01);
  padding: 8px;
  border-radius: 4px;
}

.featured-paper-card .meta-row {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--color-text-secondary);
}

.sci-badge {
  background: rgba(139,92,246,0.15);
  color: #a78bfa;
  padding: 1px 4px;
  border-radius: 2px;
}

.achievements-container {
  height: calc(100vh - 106px);
  gap: 20px;
  padding: 18px 22px;
}

.left-sidebar {
  width: 280px;
  padding: 20px;
}

.main-content-panel {
  padding: 20px;
}

.sidebar-header h3,
.chart-box h4,
.main-rec-box h4,
.logs-box h4,
.table-actions-row h3 {
  font-size: 16px;
}

.nav-btn,
.filter-group .lbl,
.filter-btn,
.legend-list,
.timeline-logs,
.simple-bar-chart,
.paper-distribution,
.data-table,
.meta-details,
.featured-paper-card .authors,
.featured-paper-card .journal,
.featured-paper-card .abstract {
  font-size: 13px;
}

.left-sidebar .sidebar-header h3 {
  font-size: 22px;
}

.left-sidebar .nav-btn {
  min-height: 48px;
  font-size: 18px;
  padding: 12px 17px;
}

.achievements-container .left-sidebar .sidebar-header h3 {
  font-size: 22px !important;
  line-height: 1.25;
}

.overview-stats-grid .stat-card {
  padding: 18px;
}

.overview-stats-grid .stat-card .val,
.donut-center-txt .num,
.sum-card .num,
.paper-sum-c .val,
.pat-sum-c .val {
  font-size: 22px;
}

.overview-stats-grid .stat-card .lbl,
.latest-c-card .desc,
.featured-award-card .details,
.proj-meta .desc,
.team-row,
.assoc-stats-row {
  font-size: 13px;
}

.left-charts-col {
  width: 320px;
}

.right-logs-col,
.projects-right-sidebar,
.papers-sidebar,
.cert-col {
  width: 300px;
}

.latest-c-card h5,
.proj-meta h4,
.award-row-card h5,
.featured-paper-card h4 {
  font-size: 15px;
}
</style>
