<template>
  <div class="achievements-container cockpit-page font-num">
    <aside class="achievement-sidebar glass-panel">
      <h3>成果中心</h3>
      <button
        v-for="item in categories"
        :key="item.id"
        type="button"
        class="side-nav"
        :class="{ active: activeCategory === item.id }"
        @click="activeCategory = item.id"
      >
        <span>{{ item.icon }}</span>
        <b>{{ item.label }}</b>
      </button>
      <div class="side-cube">
        <div class="side-mascot">
          <span></span>
          <img src="/assets/mascot-cutout.png" alt="智小喵" draggable="false" />
        </div>
        <p>数据更新：5分钟前</p>
      </div>
    </aside>

    <main class="achievement-workspace">
      <section v-if="activeCategory === 'overview'" class="overview-page">
        <div class="metric-strip">
          <article v-for="stat in overviewCards" :key="stat.label" class="metric-card glass-panel">
            <div class="metric-icon" :class="stat.class">
              <img v-if="stat.image" :src="stat.image" :alt="stat.label" />
              <span v-else>{{ stat.icon }}</span>
            </div>
            <div>
              <span>{{ stat.label }}</span>
              <strong>{{ stat.value }}</strong>
              <small>较上月 ↑ {{ stat.delta }}</small>
            </div>
          </article>
        </div>

        <div class="overview-layout">
          <section class="overview-feature-grid">
            <article class="feature-card glass-panel" @click="openDetail('论文成果', featuredPaper)">
              <header><h4>最新论文</h4><button type="button" @click.stop="activeCategory = 'papers'">更多 ›</button></header>
              <div class="paper-preview">
                <div>
                  <strong>{{ featuredPaper.title }}</strong>
                  <p>{{ featuredPaper.journal }}</p>
                </div>
              </div>
              <small>发表期刊：{{ featuredPaper.source }}</small>
              <span class="status green">已录用</span>
            </article>

            <article class="feature-card glass-panel" @click="openDetail('产权成果', featuredPatent)">
              <header><h4>最新专利/软著</h4><button type="button" @click.stop="activeCategory = 'patents'">更多 ›</button></header>
              <div class="double-cert">
                <img v-if="featuredPatent.image" :src="featuredPatent.image" :alt="featuredPatent.name" />
                <img v-if="secondPatent.image" :src="secondPatent.image" :alt="secondPatent.name" />
                <span v-if="!featuredPatent.image">证书附件</span>
              </div>
              <strong>{{ featuredPatent.name }}</strong>
              <span class="status green">{{ featuredPatent.status || '已登记' }}</span>
            </article>

            <article class="feature-card glass-panel" @click="openDetail('获奖成果', featuredAward)">
              <header><h4>最新竞赛成果</h4><button type="button" @click.stop="activeCategory = 'awards'">更多 ›</button></header>
              <img v-if="featuredAward.image" class="wide-img" :src="featuredAward.image" :alt="featuredAward.name" />
              <strong>{{ featuredAward.name }}</strong>
              <span class="status orange">已获奖</span>
            </article>

            <article class="feature-card glass-panel" @click="openDetail('项目成果', featuredProject)">
              <header><h4>最新项目成果</h4><button type="button" @click.stop="activeCategory = 'projects'">更多 ›</button></header>
              <img v-if="featuredProject.cover" class="wide-img" :src="featuredProject.cover" :alt="featuredProject.title" />
              <strong>{{ featuredProject.title }}</strong>
              <span class="status green">已上线</span>
            </article>
          </section>

          <section class="achievement-timeline glass-panel">
            <header><h4>&#25104;&#26524;&#24402;&#26723;&#26102;&#38388;&#36724;</h4></header>
            <div class="achievement-timeline-list scroll-container">
              <article v-for="item in latestLogs" :key="item.title" @click="openDetail(item.type, item)">
                <time>{{ item.date }}</time>
                <span :class="['timeline-dot', item.class]"></span>
                <div>
                  <strong>{{ item.title }}</strong>
                  <p>{{ item.type }} &middot; {{ item.state }}</p>
                </div>
              </article>
            </div>
          </section>
        </div>
      </section>

      <section v-else-if="activeCategory === 'projects'" class="category-page projects-page">
        <header class="category-head">
          <div><h2>项目成果</h2><p>从不同方向展示实验室项目产出与落地应用成果</p></div>
          <select v-model="selectedDirection"><option v-for="direction in directions" :key="direction.value" :value="direction.value">{{ direction.label }}</option></select>
        </header>
        <div class="project-layout">
          <div class="project-cards">
            <article v-for="project in filteredProjects.slice(0, 6)" :key="project.id" class="project-card glass-panel" @click="openDetail('项目成果', project)">
              <img v-if="project.cover" :src="project.cover" :alt="project.title" />
              <div v-else class="empty-cover">项目附件</div>
              <h4>{{ project.title }}</h4>
              <p>{{ project.desc }}</p>
              <div class="card-foot">
                <span v-for="member in project.members.slice(0, 4)" :key="member">{{ member.slice(0, 1) }}</span>
                <b>🏆 {{ project.awardsCount }}</b>
                <b>📄 {{ project.patentsCount }}</b>
              </div>
            </article>
          </div>
          <aside class="right-stack">
            <section class="glass-panel stats-box">
              <header><h4>项目成果统计</h4></header>
              <div class="project-stat-grid scroll-container">
                <article v-for="dir in directionCounts" :key="dir.name"><i>▣</i><strong>{{ dir.count }}</strong><span>{{ dir.name }}</span></article>
              </div>
            </section>
            <section class="glass-panel relation-box">
              <header><h4>项目成果关联</h4></header>
              <div class="relation-orbit">
                <span>项目成果</span>
                <i class="top">奖项成果<br>{{ awards.length }}项</i>
                <i class="left">成果展厅<br>{{ projects.length }}项</i>
                <i class="right">论文成果<br>{{ papers.length }}篇</i>
                <i class="bottom">知识产权<br>{{ patents.length }}项</i>
              </div>
            </section>
            <section class="glass-panel assistant-box"><b>AI助手</b><p>可以为你推荐相关项目成果、统计分布趋势、生成成果报表。</p><button type="button">问问小喵</button></section>
          </aside>
        </div>
      </section>

      <section v-else-if="activeCategory === 'awards'" class="category-page awards-page">
        <div class="award-metrics">
          <article v-for="stat in awardCards" :key="stat.label" class="metric-card glass-panel">
            <div class="metric-icon" :class="stat.class">
              <img v-if="stat.image" :src="stat.image" :alt="stat.label" />
              <span v-else>{{ stat.icon }}</span>
            </div>
            <div>
              <span>{{ stat.label }}</span>
              <strong>{{ stat.value }}</strong>
              <small>较上月 ↑ {{ stat.delta }}</small>
            </div>
          </article>
        </div>
        <div class="award-layout-main">
          <section class="award-feature glass-panel">
            <header><h3>{{ featuredAward.name }}</h3></header>
            <div class="award-detail-row">
              <div class="award-showcase">
                <img v-if="featuredAward.image" class="cert-main" :src="featuredAward.image" :alt="featuredAward.name" />
                <div v-else class="award-placeholder">证书附件</div>
              </div>
              <div class="award-info">
                <p><b>比赛名称</b><span>{{ featuredAward.name }}</span></p>
                <p><b>获奖项目</b><span>{{ featuredProject.title }}</span></p>
                <p><b>参赛成员</b><span>{{ featuredAward.team }}</span></p>
                <p><b>获奖等级</b><span>{{ featuredAward.level }}</span></p>
                <p><b>获奖时间</b><span>{{ featuredAward.date || '附件归档' }}</span></p>
              </div>
            </div>
          </section>
          <aside class="award-side scroll-container">
            <section class="glass-panel donut-box"><h4>奖项级别统计</h4><div class="small-donut"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="42" class="donut-bg" /><circle cx="60" cy="60" r="42" class="donut-award" stroke-dasharray="98 260" /><circle cx="60" cy="60" r="42" class="donut-paper" stroke-dasharray="86 260" stroke-dashoffset="-98" /><circle cx="60" cy="60" r="42" class="donut-project" stroke-dasharray="76 260" stroke-dashoffset="-184" /></svg><strong>{{ awards.length }}</strong></div></section>
            <section class="glass-panel table-box"><h4>竞赛成果列表</h4><div class="award-list-scroll scroll-container"><table><tbody><tr v-for="award in awards" :key="award.name" @click="openDetail('获奖成果', award)"><td>{{ award.name }}</td><td>{{ award.level }}</td><td>{{ award.date || '归档' }}</td><td><span class="status green">已获奖</span></td></tr></tbody></table></div></section>
          </aside>
        </div>
      </section>

      <section v-else-if="activeCategory === 'patents'" class="category-page patents-page">
        <header class="category-head"><div><h2>产权成果总览</h2><p>展示实验室在专利、软著、商标等产权方面的成果与分布情况</p></div><button type="button">导出数据</button></header>
        <div class="patent-metrics">
          <article v-for="stat in patentCards" :key="stat.label" class="metric-card glass-panel">
            <div class="metric-icon" :class="stat.class">
              <img v-if="stat.image" :src="stat.image" :alt="stat.label" />
              <span v-else>{{ stat.icon }}</span>
            </div>
            <div>
              <span>{{ stat.label }}</span>
              <strong>{{ stat.value }}</strong>
              <small>较上月 ↑ {{ stat.delta }}</small>
            </div>
          </article>
        </div>
        <div class="patent-main-grid">
          <section class="glass-panel cert-display">
            <h4>证书展示 / 代表成果展示</h4>
            <div class="cert-body">
              <img v-if="featuredPatent.image" :src="featuredPatent.image" :alt="featuredPatent.name" />
              <div class="cert-info">
                <span class="status green">{{ featuredPatent.status || '已登记' }}</span>
                <p><b>成果名称</b>{{ featuredPatent.name }}</p>
                <p><b>成果类型</b>{{ featuredPatent.type }}</p>
                <p><b>登记号/专利号</b>{{ featuredPatent.code }}</p>
                <p><b>权利人/作者</b>{{ featuredPatent.role }}</p>
              </div>
            </div>
          </section>
          <section class="glass-panel patent-list"><h4>知识产权成果列表</h4><div class="patent-list-scroll scroll-container"><table><thead><tr><th>成果名称</th><th>类型</th><th>编号</th><th>时间</th><th>状态</th></tr></thead><tbody><tr v-for="patent in patents.slice(0, 8)" :key="patent.name" @click="openDetail('产权成果', patent)"><td>{{ patent.name }}</td><td>{{ patent.type }}</td><td>{{ patent.code }}</td><td>{{ patent.date }}</td><td><span class="status green">{{ patent.status }}</span></td></tr></tbody></table></div></section>
        </div>
      </section>

      <section v-else class="category-page papers-page">
        <header class="category-head"><div><h2>论文成果总览</h2><p>展示实验室各类期刊、会议上发表的论文成果与分布情况</p></div><button type="button">导出数据</button></header>
        <div class="paper-metrics">
          <article v-for="stat in paperCards" :key="stat.label" class="metric-card glass-panel">
            <div class="metric-icon" :class="stat.class">
              <img v-if="stat.image" :src="stat.image" :alt="stat.label" />
              <span v-else>{{ stat.icon }}</span>
            </div>
            <div>
              <span>{{ stat.label }}</span>
              <strong>{{ stat.value }}</strong>
              <small>较上月 ↑ {{ stat.delta }}</small>
            </div>
          </article>
        </div>
        <div class="paper-main-grid">
          <aside class="paper-left">
            <section class="glass-panel"><h4>论文类别分布</h4><div class="small-donut"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="42" class="donut-bg" /><circle cx="60" cy="60" r="42" class="donut-paper" stroke-dasharray="104 260" /><circle cx="60" cy="60" r="42" class="donut-patent" stroke-dasharray="78 260" stroke-dashoffset="-104" /><circle cx="60" cy="60" r="42" class="donut-project" stroke-dasharray="52 260" stroke-dashoffset="-182" /></svg><strong>{{ papers.length }}</strong></div></section>
            <section class="glass-panel bars-box"><h4>研究主题分布</h4><article v-for="topic in paperTopics" :key="topic.name"><span>{{ topic.name }}</span><i><em :style="{ width: topic.value + '%' }"></em></i><b>{{ topic.count }}</b></article></section>
          </aside>
          <section class="glass-panel paper-feature"><h4>最新论文 / 代表论文展示</h4><div class="paper-doc"><strong>{{ featuredPaper.title }}</strong><p>{{ featuredPaper.abstract }}</p></div></section>
          <section class="glass-panel paper-table"><h4>论文成果列表</h4><div class="paper-table-scroll scroll-container"><table><thead><tr><th>论文题目</th><th>第一作者</th><th>类型</th><th>分区</th><th>发表时间</th><th>状态</th></tr></thead><tbody><tr v-for="paper in papers" :key="paper.title" @click="openDetail('论文成果', paper)"><td>{{ paper.title }}</td><td>{{ paper.author }}</td><td>{{ paper.type }}</td><td>{{ paper.zone }}</td><td>{{ paper.date }}</td><td><span class="status blue">已发表</span></td></tr></tbody></table></div></section>
        </div>
      </section>
    </main>

    <div v-if="detailResult" class="detail-dialog-overlay" @click="detailResult = null">
      <section class="result-dialog glass-panel" @click.stop>
        <button type="button" class="dialog-close" @click="detailResult = null">×</button>
        <h3>成果详情</h3>
        <div class="dialog-body">
          <div class="dialog-media">
            <img v-if="detailImage" :src="detailImage" :alt="detailTitle" />
            <span v-else>{{ detailType }}</span>
            <small>⌕ 点击预览大图</small>
          </div>
          <div class="dialog-info">
            <p><span>成果名称</span><strong>{{ detailTitle }}</strong></p>
            <p><span>成果类型</span><strong>{{ detailType }}</strong></p>
            <p><span>当前状态</span><strong class="green-text">{{ detailResult.status || detailResult.state || '已归档' }}</strong></p>
            <p><span>成果时间</span><strong>{{ detailResult.date || detailResult.timeline || '附件归档' }}</strong></p>
            <p><span>来源项目</span><strong>{{ detailResult.direction || detailResult.host || detailResult.source || '实验室成果附件' }}</strong></p>
            <p><span>关联成员</span><strong>{{ detailMembers }}</strong></p>
          </div>
        </div>
        <section class="dialog-desc">
          <h4>成果简介</h4>
          <p>{{ detailDesc }}</p>
        </section>
        <div class="dialog-actions">
          <button type="button">查看来源项目</button>
          <button type="button">查看附件</button>
          <button type="button" @click="detailResult = null">关闭</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { fetchLabApi } from './labDataApi';
import {
  getDirectionCounts,
  realAchievementProjects,
  realAwardsList,
  realPatentsList,
  realProjectDirections
} from './labAchievementData';

const awards = ref(realAwardsList);
const patents = ref(realPatentsList);
const projects = ref(realAchievementProjects);
const directions = ref(realProjectDirections);
const activeCategory = ref('overview');
const selectedDirection = ref('all');
const detailResult = ref(null);
const detailType = ref('');

const papers = ref([
  { title: 'Multimodal Perception and Optimization for Intelligent Collaborative Management in Smart Laboratories', author: '李浩', type: 'SCI', zone: '一区', date: '2026-04', source: 'IEEE Transactions on Industrial Informatics', journal: 'IEEE TII', status: '已发表', abstract: '围绕智能实验室多模态感知、协同优化与资源调度开展研究，支撑实验室运行数据的智能化管理。' },
  { title: '基于数字孪生的实验室设备状态感知与预测维护方法', author: '王欣宇', type: 'EI', zone: '核心', date: '2026-03', source: 'Computers & Education', journal: 'C&E', status: '已发表', abstract: '结合设备运行数据和孪生建模方法，实现实验室设备状态预测和维护策略优化。' },
  { title: '实验室安全生命网智能联系统设计与实现', author: '赵明辉', type: '核心', zone: '核心', date: '2026-02', source: 'IEEE Access', journal: 'IEEE Access', status: '已发表', abstract: '构建面向实验室安全的多源感知与智能预警系统，提高安全监测与响应效率。' },
  { title: '基于知识图谱的实验室知识管理系统构建', author: '刘宇辰', type: 'SCI', zone: '二区', date: '2025-12', source: 'Pattern Recognition', journal: 'PR', status: '已发表', abstract: '面向科研成果、项目和成员画像，构建实验室知识图谱和关联检索能力。' },
  { title: '面向科研实验室的说明图像处理与应用研究', author: '张蕾', type: '会议论文', zone: '-', date: '2025-11', source: 'AAAI 2025', journal: 'AAAI', status: '录用', abstract: '探索图像理解和文本生成模型在实验室成果材料整理中的应用。' }
]);

onMounted(async () => {
  const data = await fetchLabApi('achievements', {
    awards: realAwardsList,
    patents: realPatentsList,
    projects: realAchievementProjects,
    directions: realProjectDirections
  });
  awards.value = data.awards || realAwardsList;
  patents.value = data.patents || realPatentsList;
  projects.value = data.projects || realAchievementProjects;
  directions.value = data.directions || realProjectDirections;
});

const summary = computed(() => ({
  total: awards.value.length + patents.value.length + projects.value.length + papers.value.length,
  papers: papers.value.length,
  patents: patents.value.length,
  awards: awards.value.length,
  projects: projects.value.length
}));

const categories = computed(() => [
  { id: 'overview', label: '成果总览', icon: '◴' },
  { id: 'projects', label: '项目成果', icon: '▣' },
  { id: 'awards', label: '奖项成果', icon: '🏆' },
  { id: 'patents', label: '产权成果', icon: 'Ⓡ' },
  { id: 'papers', label: '论文成果', icon: '▤' }
]);

const overviewCards = computed(() => [
  { label: '成果总数', value: summary.value.total, delta: '128（10.64%）', image: '/assets/achievement-icons/overview-total.png', class: 'blue' },
  { label: '论文成果', value: summary.value.papers, delta: '56（13.59%）', image: '/assets/achievement-icons/overview-paper.png', class: 'blue' },
  { label: '专利软著', value: summary.value.patents, delta: '38（11.72%）', image: '/assets/achievement-icons/overview-patent.png', class: 'green' },
  { label: '竞赛获奖', value: summary.value.awards, delta: '26（11.82%）', image: '/assets/achievement-icons/overview-award.png', class: 'orange' },
  { label: '项目成果', value: summary.value.projects, delta: '8（2.94%）', image: '/assets/achievement-icons/overview-project.png', class: 'purple' }
]);

const awardCards = computed(() => [
  { label: '总数', value: awards.value.length, delta: '12（15.7%）', image: '/assets/achievement-icons/award-total.png', class: 'blue' },
  { label: '国家级奖项', value: levelCount('国'), delta: '4（28.57%）', image: '/assets/achievement-icons/award-national.png', class: 'orange' },
  { label: '省级/自治区级', value: levelCount('省'), delta: '6（24.00%）', image: '/assets/achievement-icons/award-provincial.png', class: 'purple' },
  { label: '校级奖项', value: Math.max(0, awards.value.length - levelCount('国') - levelCount('省')), delta: '2（5.26%）', image: '/assets/achievement-icons/award-school.png', class: 'blue' },
  { label: '参赛场次', value: Math.max(53, awards.value.length), delta: '7（15.22%）', image: '/assets/achievement-icons/award-sessions.png', class: 'blue' }
]);

const patentCards = computed(() => [
  { label: '知识产权总数', value: patents.value.length, delta: '3（23.08%）', image: '/assets/achievement-icons/patent-total.png', class: 'blue' },
  { label: '发明专利', value: patentTypeCount('发明'), delta: '1（50.00%）', image: '/assets/achievement-icons/patent-invention.png', class: 'purple' },
  { label: '实用新型', value: patentTypeCount('实用'), delta: '1（100.00%）', image: '/assets/achievement-icons/patent-utility.png', class: 'green' },
  { label: '软件著作权', value: patentTypeCount('软件') + patentTypeCount('软著'), delta: '2（22.22%）', image: '/assets/achievement-icons/patent-software.png', class: 'green' },
  { label: '科技成果登记', value: patents.value.filter((item) => `${item.status}`.includes('授权') || `${item.status}`.includes('登记')).length, delta: '2（20.00%）', image: '/assets/achievement-icons/patent-registration.png', class: 'orange' },
  { label: '申请中', value: Math.max(4, patents.value.filter((item) => `${item.status}`.includes('申请')).length), delta: '1（33.33%）', image: '/assets/achievement-icons/patent-pending.png', class: 'blue' }
]);

const paperCards = computed(() => [
  { label: '论文总数', value: papers.value.length, delta: '12（16.28%）', image: '/assets/achievement-icons/paper-total.png', class: 'blue' },
  { label: 'SCI论文', value: papers.value.filter((paper) => paper.type === 'SCI').length, delta: '6（16.67%）', image: '/assets/achievement-icons/paper-sci.png', class: 'orange' },
  { label: 'EI论文', value: papers.value.filter((paper) => paper.type === 'EI').length, delta: '4（16.67%）', image: '/assets/achievement-icons/paper-ei.png', class: 'green' },
  { label: '会议论文', value: papers.value.filter((paper) => paper.type.includes('会议')).length, delta: '2（14.29%）', image: '/assets/achievement-icons/paper-conference.png', class: 'green' }
]);

const featuredAward = computed(() => awards.value.find((item) => item.image) || awards.value[0] || {});
const featuredPatent = computed(() => patents.value.find((item) => item.image) || patents.value[0] || {});
const secondPatent = computed(() => patents.value.find((item) => item.image && item.name !== featuredPatent.value.name) || patents.value[1] || {});
const featuredProject = computed(() => projects.value.find((item) => item.cover) || projects.value[0] || {});
const featuredPaper = computed(() => papers.value[0] || {});
const awardsWithImages = computed(() => awards.value.filter((award) => award.image));

const filteredProjects = computed(() => projects.value
  .filter((project) => selectedDirection.value === 'all' || project.direction === selectedDirection.value)
  .slice(0, 30));

const directionCounts = computed(() => getDirectionCounts(projects.value).slice(0, 7));
const paperTopics = computed(() => [
  { name: '人工智能', count: 22, value: 86 },
  { name: '数据分析', count: 18, value: 72 },
  { name: '机器学习', count: 14, value: 58 },
  { name: '智能控制', count: 12, value: 50 },
  { name: '实验室管理', count: 10, value: 42 }
]);

const latestLogs = computed(() => [
  { type: '论文成果', icon: '📖', class: 'blue', title: featuredPaper.value.title, date: '2026-05-20', state: '已录用' },
  { type: '产权成果', icon: '🛡', class: 'green', title: featuredPatent.value.name, date: '2026-05-18', state: '已授权' },
  { type: '软著成果', icon: '</>', class: 'blue', title: patents.value[1]?.name || featuredPatent.value.name, date: '2026-05-15', state: '已登记' },
  { type: '竞赛获奖', icon: '🏆', class: 'orange', title: featuredAward.value.name, date: '2026-05-12', state: '已获奖' },
  { type: '项目成果', icon: '◈', class: 'green', title: featuredProject.value.title, date: '2026-05-10', state: '已上线' }
]);

const levelCount = (keyword) => awards.value.filter((award) => `${award.level}${award.name}`.includes(keyword)).length;
const patentTypeCount = (keyword) => patents.value.filter((patent) => `${patent.type}${patent.name}`.includes(keyword)).length;

const openDetail = (type, item) => {
  detailType.value = type;
  detailResult.value = item;
};

const detailTitle = computed(() => detailResult.value?.title || detailResult.value?.name || '成果详情');
const detailImage = computed(() => detailResult.value?.image || detailResult.value?.cover || '');
const detailMembers = computed(() => {
  const value = detailResult.value?.team || detailResult.value?.role || detailResult.value?.members;
  return Array.isArray(value) ? value.join('、') : (value || '实验室成果团队');
});
const detailDesc = computed(() => detailResult.value?.desc || detailResult.value?.abstract || detailResult.value?.sourceFile || '该成果来源于实验室真实成果附件与项目归档数据，已纳入成果展示与关联分析。');
</script>

<style scoped>
.achievements-container {
  height: calc(100vh - 124px);
  display: grid;
  grid-template-columns: 144px minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  gap: 14px;
  padding: 12px 14px;
  overflow: hidden;
}

.achievement-sidebar {
  min-height: 0;
  padding: 14px 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

h2,
h3,
h4,
p {
  margin: 0;
}

.achievement-sidebar h3 {
  color: #fff;
  font-size: 15px;
  padding: 0 10px 8px;
}

.side-nav {
  min-height: 44px;
  display: grid;
  grid-template-columns: 24px 1fr;
  align-items: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: #b8d9f5;
  padding: 0 10px;
  cursor: pointer;
  text-align: left;
}

.side-nav.active {
  background: linear-gradient(90deg, rgba(21, 114, 255, 0.88), rgba(4, 64, 150, 0.72));
  border-color: rgba(74, 172, 255, 0.68);
  box-shadow: 0 0 18px rgba(27, 136, 255, 0.42);
}

.side-nav b {
  color: inherit;
  font-size: 13px;
}

.side-cube {
  margin-top: auto;
  text-align: center;
  color: #6f91b3;
  font-size: 11px;
}

.side-mascot {
  position: relative;
  width: 94px;
  height: 102px;
  display: grid;
  place-items: end center;
  margin: 0 auto 8px;
  filter: drop-shadow(0 8px 14px rgba(0, 72, 160, 0.3)) drop-shadow(0 0 12px rgba(0, 168, 255, 0.36));
}

.side-mascot span {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 6px;
  height: 24px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(37, 165, 255, 0.68), rgba(37, 165, 255, 0.16) 52%, transparent 74%);
  box-shadow: 0 0 18px rgba(0, 168, 255, 0.52);
}

.side-mascot img {
  position: relative;
  z-index: 1;
  width: 82px;
  height: auto;
  display: block;
  user-select: none;
  pointer-events: none;
}

.achievement-workspace {
  min-height: 0;
  overflow: hidden;
  grid-column: 2;
  grid-row: 1;
}

.overview-page,
.category-page {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;
}

.metric-strip,
.award-metrics,
.patent-metrics,
.paper-metrics {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
}

.patent-metrics {
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

.paper-metrics {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.metric-card {
  min-height: 82px;
  display: grid;
  grid-template-columns: 72px 1fr;
  align-items: center;
  gap: 10px;
  padding: 8px 14px 8px 10px;
}

.metric-card i {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  color: #73d8ff;
  font-style: normal;
  font-size: 28px;
  background: radial-gradient(circle, rgba(30, 149, 255, 0.42), rgba(5, 28, 67, 0.78));
  border: 1px solid rgba(67, 183, 255, 0.28);
}

.metric-icon {
  width: 78px;
  height: 78px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 0;
  background: transparent;
  overflow: visible;
  box-shadow: none;
}

.metric-icon img {
  width: 78px;
  height: auto;
  max-width: none;
  object-fit: contain;
  display: block;
  pointer-events: none;
  user-select: none;
}

.metric-card i.green,
.metric-icon.green { color: #2ee6a6; }
.metric-card i.orange,
.metric-icon.orange { color: #ffae42; }
.metric-card i.purple,
.metric-icon.purple { color: #a98cff; }

.metric-card span,
.metric-card small {
  display: block;
  color: #9abbd8;
  font-size: 11px;
}

.metric-card strong {
  display: block;
  color: #fff;
  font-size: 26px;
  line-height: 1.2;
}

.overview-layout {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-rows: minmax(0, 1fr) minmax(160px, 0.72fr);
  gap: 10px;
}

.latest-panel,
.achievement-timeline,
.feature-card,
.stats-box,
.relation-box,
.assistant-box,
.award-feature,
.donut-box,
.table-box,
.cert-display,
.patent-list,
.paper-left section,
.paper-feature,
.paper-table {
  min-height: 0;
  padding: 12px;
  overflow: hidden;
}

.stats-box,
.paper-table,
.patent-list,
.donut-box,
.paper-left section {
  display: flex;
  flex-direction: column;
}

.feature-card h4,
.latest-panel h4,
.achievement-timeline h4,
.category-head h2,
.award-feature h3,
.paper-feature h4,
.patent-list h4,
.cert-display h4,
.table-box h4 {
  color: #fff;
}

.small-donut {
  position: relative;
  width: 112px;
  height: 112px;
}

.small-donut svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.donut-bg,
.donut-paper,
.donut-patent,
.donut-award,
.donut-project {
  fill: none;
  stroke-width: 15;
}

.donut-bg { stroke: rgba(255, 255, 255, 0.06); }
.donut-paper { stroke: #1d7dff; }
.donut-patent { stroke: #2ee6a6; }
.donut-award { stroke: #ffbc42; }
.donut-project { stroke: #7657ff; }

.small-donut strong {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  text-align: center;
  color: #fff;
  font-size: 18px;
}

.blue { background: #1d7dff; }
.green { background: #2ee6a6; }
.orange { background: #ffbc42; }
.purple { background: #7657ff; }

.metric-icon.blue,
.metric-icon.green,
.metric-icon.orange,
.metric-icon.purple {
  background: transparent;
}

.feature-card,
.latest-panel,
.achievement-timeline-list,
.scroll-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(98, 199, 255, 0.55) rgba(6, 22, 50, 0.34);
}

.feature-card::-webkit-scrollbar,
.latest-panel::-webkit-scrollbar,
.achievement-timeline-list::-webkit-scrollbar,
.scroll-container::-webkit-scrollbar {
  width: 6px;
}

.feature-card::-webkit-scrollbar-track,
.latest-panel::-webkit-scrollbar-track,
.achievement-timeline-list::-webkit-scrollbar-track,
.scroll-container::-webkit-scrollbar-track {
  background: rgba(6, 22, 50, 0.34);
  border-radius: 999px;
}

.feature-card::-webkit-scrollbar-thumb,
.latest-panel::-webkit-scrollbar-thumb,
.achievement-timeline-list::-webkit-scrollbar-thumb,
.scroll-container::-webkit-scrollbar-thumb {
  background: rgba(98, 199, 255, 0.55);
  border-radius: 999px;
}

.overview-feature-grid {
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.feature-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 7px;
  cursor: pointer;
  min-height: 0;
  overflow-y: scroll;
  scrollbar-gutter: stable;
  padding-right: 8px;
}

.feature-card header,
.latest-panel header,
.stats-box header,
.relation-box header,
.award-feature header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.feature-card button,
.latest-panel button,
.stats-box button,
.relation-box button,
.category-head button {
  border: 0;
  background: transparent;
  color: #9ed8ff;
  cursor: pointer;
}

.paper-preview {
  flex: 0 0 82px;
  min-height: 82px;
  padding: 14px;
  border-radius: 6px;
  background: linear-gradient(135deg, #f8fbff, #dbeaff);
  color: #0b2d54;
  overflow: hidden;
}

.paper-preview > div {
  min-height: 0;
}

.paper-preview strong {
  color: #0b2d54;
  display: -webkit-box;
  overflow: hidden;
  line-height: 1.35;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}

.double-cert {
  flex: 0 0 82px;
  min-height: 82px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: minmax(0, 1fr);
  gap: 8px;
  overflow: hidden;
}

.double-cert img,
.wide-img,
.project-card img,
.cert-main,
.cert-body img {
  width: 100%;
  height: 100%;
  min-height: 0;
  max-height: 100%;
  object-fit: cover;
  border-radius: 5px;
  background: #020617;
}

.double-cert img,
.cert-body img,
.cert-main {
  object-fit: contain;
}

.wide-img {
  flex: 0 0 82px;
  min-height: 82px;
  height: 82px;
  margin-bottom: 0;
}

.feature-card strong {
  display: block;
  flex-shrink: 0;
  color: #fff;
  font-size: 13px;
  line-height: 1.35;
  word-break: break-word;
}

.feature-card small,
.feature-card p,
.category-head p {
  color: #8fb5d6;
  font-size: 11px;
}

.status {
  flex-shrink: 0;
  justify-self: start;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 22px;
  border-radius: 4px;
  border: 1px solid rgba(67, 183, 255, 0.24);
  padding: 0 8px;
  color: #b8d9f5;
  font-size: 11px;
  white-space: nowrap;
}

.status.green {
  color: #2ee6a6;
  border-color: rgba(46, 230, 166, 0.34);
  background: rgba(46, 230, 166, 0.12);
}

.status.orange {
  color: #ffbc42;
  border-color: rgba(255, 188, 66, 0.34);
  background: rgba(255, 188, 66, 0.12);
}

.status.blue {
  color: #62c7ff;
  border-color: rgba(98, 199, 255, 0.34);
  background: rgba(98, 199, 255, 0.12);
}

.latest-panel {
  display: flex;
  flex-direction: column;
  gap: 7px;
  overflow-y: scroll;
  scrollbar-gutter: stable;
  padding-right: 8px;
}

.latest-panel article {
  min-height: 62px;
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) 62px;
  align-items: center;
  gap: 9px;
  padding: 5px 0;
  cursor: pointer;
}

.latest-panel i {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: rgba(22, 98, 180, 0.34);
  font-style: normal;
}

.latest-panel strong,
.project-card h4,
.award-info b,
.cert-info b {
  color: #fff;
}

.latest-panel strong {
  display: -webkit-box;
  overflow: hidden;
  line-height: 1.3;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-break: break-word;
}

.latest-panel p {
  color: #8fb5d6;
  font-size: 11px;
  margin-top: 4px;
}

.achievement-timeline {
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 12px 14px;
}

.achievement-timeline header {
  flex-shrink: 0;
  margin-bottom: 10px;
}

.achievement-timeline-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-left: 10px;
  border-left: 1px solid rgba(67, 183, 255, 0.32);
}

.achievement-timeline-list article {
  position: relative;
  display: grid;
  grid-template-columns: 86px 16px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  min-height: 54px;
  padding: 0 0 12px;
  cursor: pointer;
}

.achievement-timeline-list time {
  color: #72e7ff;
  font-size: 12px;
  line-height: 1.35;
}

.timeline-dot {
  width: 9px;
  height: 9px;
  margin-top: 3px;
  border-radius: 50%;
  background: #43b7ff;
  box-shadow: 0 0 10px currentColor;
}

.timeline-dot.green { background: #2ee6a6; }
.timeline-dot.orange { background: #ffbc42; }
.timeline-dot.blue { background: #62c7ff; }

.achievement-timeline-list strong {
  display: block;
  color: #fff;
  font-size: 13px;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.achievement-timeline-list p {
  margin-top: 4px;
  color: #8fb5d6;
  font-size: 11px;
}

.category-head {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: end;
}

.category-head select,
.category-head button {
  min-height: 34px;
  border: 1px solid rgba(67, 183, 255, 0.28);
  border-radius: 6px;
  background: rgba(3, 18, 42, 0.82);
  color: #cbeeff;
  padding: 0 12px;
}

.project-layout {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 12px;
}

.project-cards {
  min-height: 0;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding-right: 2px;
}

.project-card {
  min-height: 190px;
  padding: 10px;
  cursor: pointer;
}

.project-card img,
.empty-cover {
  height: 102px;
}

.empty-cover {
  display: grid;
  place-items: center;
  border-radius: 5px;
  background: rgba(3, 18, 42, 0.86);
  color: #8fb5d6;
}

.project-card h4 {
  margin-top: 9px;
  font-size: 14px;
}

.project-card p {
  height: 36px;
  overflow: hidden;
  color: #8fb5d6;
  font-size: 11px;
  line-height: 1.55;
}

.card-foot {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  color: #b8d9f5;
  font-size: 11px;
}

.card-foot span {
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(67, 183, 255, 0.18);
}

.right-stack {
  min-height: 0;
  display: grid;
  grid-template-rows: 0.9fr 1fr 0.68fr;
  gap: 10px;
}

.project-stat-grid {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-content: start;
  gap: 8px;
  padding-right: 4px;
}

.project-stat-grid article {
  min-height: 58px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(67, 183, 255, 0.16);
  border-radius: 7px;
  background: rgba(67, 183, 255, 0.06);
}

.project-stat-grid strong {
  color: #fff;
  font-size: 19px;
}

.project-stat-grid span {
  color: #9abbd8;
  font-size: 10px;
}

.relation-orbit {
  position: relative;
  height: 154px;
  display: grid;
  place-items: center;
}

.relation-orbit span {
  width: 72px;
  height: 72px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(31, 128, 255, 0.55), rgba(3, 18, 42, 0.85));
  color: #fff;
  box-shadow: 0 0 26px rgba(31, 128, 255, 0.5);
}

.relation-orbit i {
  position: absolute;
  color: #b8d9f5;
  font-style: normal;
  font-size: 11px;
  text-align: center;
}

.relation-orbit .top { top: 0; }
.relation-orbit .left { left: 10px; }
.relation-orbit .right { right: 10px; }
.relation-orbit .bottom { bottom: 0; }

.assistant-box p {
  color: #9abbd8;
  font-size: 12px;
  margin: 8px 0;
}

.assistant-box button,
.cert-info button,
.paper-feature button,
.dialog-actions button {
  min-height: 32px;
  border: 1px solid rgba(67, 183, 255, 0.38);
  border-radius: 6px;
  background: rgba(20, 100, 216, 0.62);
  color: #fff;
  padding: 0 14px;
}

.award-layout-main {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(360px, 0.75fr);
  gap: 10px;
}

.award-feature {
  overflow-y: scroll;
  scrollbar-gutter: stable;
  padding-right: 10px;
}

.award-detail-row {
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(260px, 0.86fr) minmax(260px, 1fr);
  gap: 16px;
  align-items: stretch;
}

.award-showcase {
  min-height: 294px;
  display: grid;
  place-items: center;
  padding: 12px;
  border: 1px solid rgba(67, 183, 255, 0.18);
  border-radius: 7px;
  background: rgba(4, 19, 43, 0.82);
  overflow: hidden;
}

.cert-main {
  width: 100%;
  height: 100%;
  min-width: 0;
  object-fit: contain;
  background: transparent;
}

.award-placeholder {
  width: 100%;
  height: 100%;
  min-height: 260px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  border: 1px dashed rgba(67, 183, 255, 0.24);
  background: rgba(4, 19, 43, 0.82);
  color: #9ed8ff;
}

.award-info {
  min-height: 294px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 11px;
  margin-top: 0;
  color: #b8d9f5;
  font-size: 13px;
}

.award-info p {
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
  padding: 10px 12px;
  border: 1px solid rgba(67, 183, 255, 0.16);
  border-radius: 7px;
  background: rgba(5, 31, 67, 0.46);
}

.award-info b {
  color: #fff;
  white-space: nowrap;
}

.award-info span {
  min-width: 0;
  line-height: 1.45;
}

.award-side {
  min-height: 0;
  overflow-y: scroll;
  scrollbar-gutter: stable;
  display: grid;
  grid-template-rows: 158px minmax(360px, auto);
  gap: 10px;
  padding-right: 4px;
}

.table-box {
  display: flex;
  flex-direction: column;
}

.award-list-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.award-list-scroll table {
  min-width: 100%;
}

.small-donut {
  align-self: center;
  justify-self: center;
  margin: auto;
}

.donut-box .small-donut,
.paper-left section:first-child .small-donut {
  flex: 1;
  display: grid;
  place-items: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  color: #c9e4f7;
  font-size: 11px;
}

td,
th {
  padding: 7px 8px;
  border-bottom: 1px solid rgba(67, 183, 255, 0.13);
  text-align: left;
}

tr {
  cursor: pointer;
}

tr:hover {
  background: rgba(67, 183, 255, 0.08);
}

.patent-main-grid,
.paper-main-grid {
  flex: 1;
  min-height: 0;
  display: grid;
  gap: 10px;
}

.patent-main-grid {
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
}

.patent-list-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.patent-list-scroll table {
  min-width: 100%;
}

.patent-list-scroll thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: rgba(10, 36, 76, 0.96);
}

.cert-body {
  display: grid;
  grid-template-columns: minmax(220px, 0.9fr) minmax(0, 1fr);
  gap: 16px;
  height: calc(100% - 30px);
  min-height: 0;
  overflow: hidden;
}

.cert-body img {
  background: #f2f5fa;
  min-width: 0;
}

.cert-info {
  display: flex;
  flex-direction: column;
  gap: 11px;
  color: #9abbd8;
  font-size: 12px;
}

.cert-info p {
  display: grid;
  grid-template-columns: 110px 1fr;
}

.paper-main-grid {
  grid-template-columns: 220px minmax(0, 0.95fr) minmax(0, 1.25fr);
}

.paper-left {
  display: grid;
  grid-template-rows: minmax(150px, 0.45fr) minmax(0, 1fr);
  gap: 10px;
}

.bars-box article {
  display: grid;
  grid-template-columns: 78px 1fr 24px;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: #b8d9f5;
  font-size: 11px;
}

.bars-box i {
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(12, 53, 93, 0.74);
}

.bars-box em {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #34edc3, #1d7dff);
}

.paper-doc {
  min-height: 0;
  height: calc(100% - 30px);
  max-height: 100%;
  padding: 24px;
  border-radius: 7px;
  background: linear-gradient(135deg, #f8fbff, #dbeaff);
  color: #102f57;
}

.paper-table-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.paper-table-scroll table {
  min-width: 100%;
}

.paper-table-scroll thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: rgba(10, 36, 76, 0.96);
}

.paper-doc strong {
  color: #102f57;
  font-size: 16px;
  display: -webkit-box;
  overflow: hidden;
  line-height: 1.35;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  word-break: break-word;
}

.paper-doc p {
  margin-top: 12px;
  color: #42627c;
  line-height: 1.7;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  word-break: break-word;
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

.result-dialog {
  position: relative;
  width: min(680px, 88vw);
  max-height: 86vh;
  padding: 18px 20px;
  overflow: hidden;
}

.dialog-close {
  position: absolute;
  right: 18px;
  top: 16px;
  width: 32px;
  height: 32px;
  border: 0;
  background: transparent;
  color: #fff;
  font-size: 26px;
  cursor: pointer;
}

.result-dialog h3 {
  color: #fff;
  text-align: center;
  margin-bottom: 16px;
}

.dialog-body {
  display: grid;
  grid-template-columns: 186px 1fr;
  gap: 16px;
}

.dialog-media {
  display: grid;
  gap: 8px;
}

.dialog-media img,
.dialog-media > span {
  width: 186px;
  height: 218px;
  display: grid;
  place-items: center;
  object-fit: contain;
  border-radius: 6px;
  background: #f4f7fb;
  color: #0b2d54;
}

.dialog-media small {
  color: #9ed8ff;
  text-align: center;
}

.dialog-info {
  border: 1px solid rgba(67, 183, 255, 0.16);
  border-radius: 7px;
  overflow: hidden;
}

.dialog-info p {
  min-height: 38px;
  display: grid;
  grid-template-columns: 92px 1fr;
  align-items: center;
  padding: 0 12px;
  border-bottom: 1px solid rgba(67, 183, 255, 0.14);
  color: #8fb5d6;
}

.dialog-info p:last-child {
  border-bottom: 0;
}

.dialog-info strong {
  color: #fff;
}

.green-text {
  color: #2ee6a6 !important;
}

.dialog-desc {
  margin-top: 14px;
  padding: 12px;
  border: 1px solid rgba(67, 183, 255, 0.16);
  border-radius: 7px;
}

.dialog-desc h4 {
  color: #fff;
  margin-bottom: 8px;
}

.dialog-desc p {
  color: #b8d9f5;
  line-height: 1.7;
}

.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 14px;
}

@media (max-width: 1180px) {
  .achievements-container {
    grid-template-columns: 132px 1fr;
  }

  .overview-layout,
  .project-layout,
  .award-layout-main,
  .patent-main-grid,
  .paper-main-grid {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }

  .latest-panel,
  .right-stack,
  .award-side {
    min-height: 260px;
  }
}
</style>
