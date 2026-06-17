<template>
  <div class="projects-showcase-container cockpit-page">
    <aside class="project-left glass-panel font-num">
      <div class="panel-title">
        <span>🎯</span>
        <div>
          <h3>项目展厅</h3>
          <p>真实成果项目化归档</p>
        </div>
      </div>

      <section>
        <h4>项目方向</h4>
        <button
          v-for="direction in directions"
          :key="direction.value"
          type="button"
          class="nav-row"
          :class="{ active: selectedDirection === direction.value }"
          @click="selectedDirection = direction.value"
        >
          <span>{{ direction.label }}</span>
          <b>{{ directionCount(direction.value) }}</b>
        </button>
      </section>

      <section>
        <h4>归档状态</h4>
        <button
          v-for="state in states"
          :key="state.value"
          type="button"
          class="nav-row"
          :class="{ active: selectedState === state.value }"
          @click="selectedState = state.value"
        >
          <span>{{ state.label }}</span>
          <b>{{ state.value === 'all' ? projects.length : projects.filter((item) => item.state === state.value).length }}</b>
        </button>
      </section>
    </aside>

    <main class="project-center glass-panel font-num">
      <div class="project-toolbar">
        <div class="search-box">
          <input v-model="searchQuery" type="search" placeholder="搜索项目、成员、负责人或成果说明..." />
          <span>⌕</span>
        </div>
        <select v-model="sortBy">
          <option value="evidence">成果数量</option>
          <option value="awards">奖项数量</option>
          <option value="patents">产权数量</option>
          <option value="date">归档顺序</option>
        </select>
      </div>

      <div class="project-feed scroll-container">
        <button
          v-for="project in filteredAndSortedProjects"
          :key="project.id"
          type="button"
          class="project-card glass-panel"
          @click="activeDetailProject = project"
        >
          <aside class="project-card-side">
            <span>{{ project.direction }}</span>
            <small>奖项 {{ project.awardsCount }}</small>
            <small>产权 {{ project.patentsCount }}</small>
            <a v-if="project.pdfUrl" :href="project.pdfUrl" target="_blank" rel="noopener" @click.stop>PDF</a>
          </aside>
          <div class="project-cover">
            <img v-if="project.cover" :src="project.cover" :alt="project.title" />
            <span v-else>PDF附件</span>
          </div>
          <div class="project-info">
            <div class="title-line">
              <h4>{{ project.title }}</h4>
              <span :class="project.stateClass">{{ project.state }}</span>
            </div>
            <p>{{ project.desc }}</p>
            <div class="people-line">
              <span>负责人：<strong>{{ project.owner }}</strong></span>
              <span>成员：{{ project.members.join('、') }}</span>
            </div>
            <div class="progress-block">
              <div>
                <span>成果占比</span>
                <b>{{ project.evidencePercent }}%</b>
              </div>
              <i><em :style="{ width: project.evidencePercent + '%' }"></em></i>
            </div>
            <div class="tag-row">
              <span>竞赛奖项 {{ project.awardsCount }}</span>
              <span>专利软著 {{ project.patentsCount }}</span>
              <span>{{ project.timeline }}</span>
            </div>
          </div>
        </button>
      </div>
    </main>

    <aside class="project-right glass-panel font-num">
      <section>
        <h3>实验室项目仪表盘</h3>
        <div class="stats-grid">
          <article>
            <span>累计项目</span>
            <strong>{{ projectStats.total }}</strong>
          </article>
          <article>
            <span>竞赛奖项</span>
            <strong class="orange">{{ projectStats.awards }}</strong>
          </article>
          <article>
            <span>专利软著</span>
            <strong class="blue">{{ projectStats.patents }}</strong>
          </article>
          <article>
            <span>真实成果</span>
            <strong class="green">{{ projectStats.achievements }}</strong>
          </article>
        </div>
      </section>

      <section class="distribution">
        <h3>成果方向分布</h3>
        <article v-for="item in directionDistribution" :key="item.name">
          <div><span>{{ item.name }}</span><b>{{ item.count }}</b></div>
          <i><em :style="{ width: phaseBarWidth(item.count) }"></em></i>
        </article>
      </section>

      <section class="recommend glass-panel">
        <h3>真实来源摘要</h3>
        <article v-for="project in recommendedProjects" :key="project.title">
          <strong>{{ project.title }}</strong>
          <p>{{ project.reason }}</p>
          <span>来源：实验室竞赛成果_附件</span>
        </article>
      </section>
    </aside>

    <div v-if="activeDetailProject" class="detail-dialog-overlay" @click="activeDetailProject = null">
      <div class="detail-dialog-window glass-panel font-num" @click.stop>
        <header>
          <div>
            <h3>{{ activeDetailProject.title }}</h3>
            <p>{{ activeDetailProject.direction }} · {{ activeDetailProject.timeline }}</p>
          </div>
          <button type="button" @click="activeDetailProject = null">×</button>
        </header>
        <div class="dialog-body scroll-container">
          <div class="dialog-top">
            <div class="project-cover large">
              <img v-if="activeDetailProject.cover" :src="activeDetailProject.cover" :alt="activeDetailProject.title" />
              <span v-else>PDF附件</span>
            </div>
            <div class="dialog-info">
              <p>{{ activeDetailProject.desc }}</p>
              <ul>
                <li>负责人：{{ activeDetailProject.owner }}</li>
                <li>成员：{{ activeDetailProject.members.join('、') }}</li>
                <li>竞赛奖项：{{ activeDetailProject.awardsCount }} 项</li>
                <li>专利软著：{{ activeDetailProject.patentsCount }} 项</li>
                <li>归档状态：{{ activeDetailProject.state }}</li>
              </ul>
              <a v-if="activeDetailProject.pdfUrl" :href="activeDetailProject.pdfUrl" target="_blank" rel="noopener">打开PDF附件</a>
            </div>
          </div>
          <section>
            <h4>关联成果沉淀</h4>
            <div class="evidence-cards">
              <article>
                <strong>{{ activeDetailProject.awardsCount }}</strong>
                <span>竞赛奖项</span>
              </article>
              <article>
                <strong>{{ activeDetailProject.patentsCount }}</strong>
                <span>专利软著</span>
              </article>
              <article>
                <strong>{{ activeDetailProject.evidencePercent }}%</strong>
                <span>成果占比</span>
              </article>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { fetchLabApi } from './labDataApi';
import {
  getDirectionCounts,
  realAchievementProjects,
  realProjectDirections
} from './labAchievementData';

const rawProjects = ref(realAchievementProjects);
const directions = ref(realProjectDirections);
const selectedDirection = ref('all');
const selectedState = ref('all');
const searchQuery = ref('');
const sortBy = ref('evidence');
const activeDetailProject = ref(null);

onMounted(async () => {
  const data = await fetchLabApi('projects', {
    projects: realAchievementProjects,
    directions: realProjectDirections
  });
  rawProjects.value = data.projects || realAchievementProjects;
  directions.value = data.directions || realProjectDirections;
});

const totalEvidence = computed(() => rawProjects.value.reduce((sum, project) => sum + project.patentsCount + project.awardsCount, 0));

const projects = computed(() => rawProjects.value.map((project) => ({
  ...project,
  state: project.state || '附件归档',
  stateClass: project.stateClass || 'green-tag',
  evidencePercent: Math.max(4, Math.round(((project.patentsCount + project.awardsCount) / Math.max(totalEvidence.value, 1)) * 100)),
  achievementDetails: {
    patent: `${project.patentsCount} 项专利/软著成果`,
    award: `${project.awardsCount} 项真实竞赛获奖材料`,
    source: '赛事奖项、知识产权附件与项目成果归档'
  }
})));

const states = [
  { label: '全部状态', value: 'all' },
  { label: '附件归档', value: '附件归档' }
];

const directionDistribution = computed(() => getDirectionCounts(projects.value));

const projectStats = computed(() => ({
  total: projects.value.length,
  awards: projects.value.reduce((sum, project) => sum + project.awardsCount, 0),
  patents: projects.value.reduce((sum, project) => sum + project.patentsCount, 0),
  achievements: totalEvidence.value
}));

const recommendedProjects = computed(() => projects.value
  .filter((project) => project.cover || project.awardsCount > 1 || project.patentsCount > 1)
  .slice(0, 3)
  .map((project) => ({
    title: project.title,
    reason: `关联 ${project.awardsCount} 项奖项、${project.patentsCount} 项产权，方向为${project.direction}。`
  })));

const maxPhaseCount = computed(() => Math.max(...directionDistribution.value.map((item) => item.count), 1));
const phaseBarWidth = (count) => `${Math.round((count / maxPhaseCount.value) * 100)}%`;

const directionCount = (direction) => {
  if (direction === 'all') return projects.value.length;
  return projects.value.filter((project) => project.direction === direction).length;
};

const filteredAndSortedProjects = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  let list = projects.value
    .filter((project) => selectedDirection.value === 'all' || project.direction === selectedDirection.value)
    .filter((project) => selectedState.value === 'all' || project.state === selectedState.value)
    .filter((project) => !query || `${project.title}${project.desc}${project.owner}${project.members.join('')}`.toLowerCase().includes(query));

  list = [...list].sort((a, b) => {
    if (sortBy.value === 'awards') return b.awardsCount - a.awardsCount;
    if (sortBy.value === 'patents') return b.patentsCount - a.patentsCount;
    if (sortBy.value === 'date') return b.id - a.id;
    return (b.awardsCount + b.patentsCount) - (a.awardsCount + a.patentsCount);
  });

  return list;
});
</script>

<style scoped>
.projects-showcase-container {
  height: calc(100vh - 121px);
  width: 100%;
  display: grid;
  grid-template-columns: 250px minmax(560px, 1fr) 300px;
  gap: 18px;
  padding: 18px 22px;
  overflow: hidden;
}

.project-left,
.project-center,
.project-right {
  min-height: 0;
  overflow: hidden;
}

.project-left,
.project-right {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.panel-title > span {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(67, 183, 255, 0.35);
  border-radius: 8px;
  background: rgba(67, 183, 255, 0.1);
  font-size: 22px;
}

h3,
h4,
p {
  margin: 0;
}

.panel-title h3,
.project-right h3 {
  color: #fff;
  font-size: 19px;
}

.project-right {
  overflow: hidden;
}

.project-right > section {
  flex-shrink: 0;
}

.panel-title p {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.project-left h4 {
  color: #eaf8ff;
  font-size: 15px;
  margin-bottom: 10px;
  padding-left: 8px;
  border-left: 2px solid #43b7ff;
}

.nav-row {
  width: 100%;
  min-height: 38px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(67, 183, 255, 0.2);
  border-radius: 6px;
  background: rgba(4, 24, 52, 0.56);
  color: #cbeeff;
  cursor: pointer;
  padding: 0 10px;
  margin-bottom: 8px;
}

.nav-row.active {
  border-color: rgba(114, 231, 255, 0.85);
  background: rgba(42, 162, 255, 0.22);
}

.nav-row b {
  color: #fff;
}

.project-center {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.project-toolbar {
  flex-shrink: 0;
  display: flex;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(67, 183, 255, 0.2);
}

.search-box {
  position: relative;
  flex: 1;
}

.search-box input,
.project-toolbar select {
  width: 100%;
  min-height: 38px;
  border: 1px solid rgba(67, 183, 255, 0.34);
  border-radius: 6px;
  background: rgba(3, 18, 42, 0.88);
  color: #eaf8ff;
  padding: 0 38px 0 12px;
}

.project-toolbar select {
  width: 160px;
  padding: 0 10px;
}

.search-box span {
  position: absolute;
  right: 12px;
  top: 7px;
  color: #72e7ff;
}

.project-feed {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.project-card {
  width: 100%;
  min-height: 246px;
  display: grid;
  grid-template-columns: 104px 180px 1fr;
  align-items: stretch;
  gap: 14px;
  padding: 12px;
  margin-bottom: 14px;
  text-align: left;
  cursor: pointer;
}

.project-card-side {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.project-card-side span,
.project-card-side a,
.tag-row span,
.title-line > span {
  border-radius: 4px;
  border: 1px solid rgba(67, 183, 255, 0.28);
  background: rgba(16, 77, 133, 0.45);
  color: #a9ddff;
  font-size: 12px;
  padding: 3px 7px;
  text-decoration: none;
}

.project-card-side small {
  font-size: 12px;
}

.project-cover {
  display: grid;
  place-items: center;
  width: 180px;
  height: 222px;
  background: #020617;
  border: 1px solid rgba(57, 166, 255, 0.22);
  border-radius: 6px;
  overflow: hidden;
}

.project-cover.large {
  width: 260px;
  height: 320px;
}

.project-cover img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #020617;
}

.project-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.title-line {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.title-line h4 {
  color: #fff;
  font-size: 17px;
  line-height: 1.35;
}

.project-info p {
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.55;
  max-height: 62px;
  overflow: hidden;
}

.people-line {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 12px;
}

.people-line strong,
.progress-block b {
  color: #fff;
}

.progress-block div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 12px;
}

.progress-block i,
.distribution i {
  display: block;
  height: 7px;
  border-radius: 99px;
  background: rgba(12, 53, 93, 0.74);
  overflow: hidden;
}

.progress-block em,
.distribution em {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #34edc3, #43b7ff);
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.stats-grid article {
  min-height: 78px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(67, 183, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
}

.stats-grid span {
  font-size: 12px;
}

.stats-grid strong {
  color: #fff;
  font-size: 24px;
}

.orange {
  color: #ffae42 !important;
}

.blue {
  color: #43b7ff !important;
}

.green {
  color: #2ee6a6 !important;
}

.distribution {
  flex: 0 0 206px;
  min-height: 0;
  overflow-y: auto;
  padding: 12px 0 4px;
  border-top: 1px solid rgba(67, 183, 255, 0.18);
}

.distribution h3,
.recommend h3 {
  margin-bottom: 12px;
}

.distribution article {
  margin-bottom: 10px;
}

.distribution article div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 12px;
}

.distribution b {
  color: #fff;
}

.recommend {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  margin-top: 0;
  padding: 12px;
}

.recommend article {
  padding: 10px 0;
  border-bottom: 1px solid rgba(67, 183, 255, 0.16);
}

.recommend article:last-child {
  border-bottom: 0;
}

.recommend strong {
  color: #fff;
  font-size: 13px;
}

.recommend p,
.recommend span {
  display: block;
  color: var(--color-text-secondary);
  font-size: 12px;
  margin-top: 4px;
}

.detail-dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  background: rgba(1, 8, 19, 0.72);
  backdrop-filter: blur(10px);
}

.detail-dialog-window {
  width: min(820px, 92vw);
  max-height: 86vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.detail-dialog-window header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 18px;
  border-bottom: 1px solid rgba(67, 183, 255, 0.24);
}

.detail-dialog-window h3,
.dialog-body h4 {
  color: #fff;
}

.detail-dialog-window header p {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.detail-dialog-window button {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: 1px solid rgba(67, 183, 255, 0.34);
  background: rgba(13, 58, 103, 0.72);
  color: #fff;
  cursor: pointer;
}

.dialog-body {
  padding: 18px;
  overflow-y: auto;
}

.dialog-top {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 18px;
}

.dialog-info p,
.dialog-info li {
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.dialog-info ul {
  padding-left: 18px;
  margin: 12px 0;
}

.dialog-info a {
  color: #ffae42;
  text-decoration: none;
}

.evidence-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 10px;
}

.evidence-cards article {
  min-height: 82px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(67, 183, 255, 0.18);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
}

.evidence-cards strong {
  color: #fff;
  font-size: 26px;
}

@media (max-width: 1180px) {
  .projects-showcase-container {
    grid-template-columns: 230px 1fr;
  }

  .project-right {
    display: none;
  }
}
</style>
