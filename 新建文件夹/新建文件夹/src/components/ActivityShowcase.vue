<template>
  <div class="activity-showcase-container">
    <!-- Left Sidebar: Statistics & Timeline -->
    <aside class="left-sidebar glass-panel font-num">
      <!-- Activity Summary Stats -->
      <section class="sidebar-section">
        <h3>⭐ 实验室活动概览</h3>
        <div class="overview-grid">
          <div class="stat-card">
            <span class="lbl">累计活动</span>
            <span class="val">32 <small>场</small></span>
          </div>
          <div class="stat-card">
            <span class="lbl">本月举办</span>
            <span class="val">4 <small>场</small></span>
          </div>
          <div class="stat-card">
            <span class="lbl">累计参与</span>
            <span class="val">420 <small>人次</small></span>
          </div>
          <div class="stat-card">
            <span class="lbl">媒体报道</span>
            <span class="val">12 <small>次</small></span>
          </div>
        </div>
      </section>

      <!-- Recent Timeline Stream -->
      <section class="sidebar-section scroll-y-section">
        <h3>📅 活动实时流</h3>
        <div class="activity-timeline">
          <div class="timeline-item" v-for="log in recentLogs" :key="log.title">
            <span class="date">{{ log.date }}</span>
            <span class="bullet" :class="log.class"></span>
            <h5>{{ log.title }}</h5>
            <p>{{ log.desc }}</p>
          </div>
        </div>
      </section>
    </aside>

    <!-- Center: Main Featured Card and Activity Grid -->
    <main class="center-feed glass-panel">
      <!-- Top Filters -->
      <div class="filter-top-bar font-num">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          class="filter-btn"
          :class="{ active: selectedFilter === filter.value }"
          @click="selectedFilter = filter.value"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- Scrollable Activities Content -->
      <div class="activities-scroll-area scroll-container">
        <!-- 1. Featured Big Card (if matching filter) -->
        <div v-if="selectedFilter === 'all' || selectedFilter === 'academic'" class="featured-activity-card glass-panel font-num">
          <div class="card-cover">
            <img src="/assets/image1.png" alt="头条活动" class="featured-img" style="opacity: 0.25; object-fit: cover; background-color: #0c1b3d;" />
            <div class="badge-overlay">学术交流</div>
          </div>
          <div class="card-info">
            <span class="date">2026-05-28</span>
            <h4>多模态警务感知融合大平台结项答辩暨学术研讨会</h4>
            <p class="desc">
              实验室在401学术汇报厅隆重召开了重点课题“多模态警务感知平台”结项研讨会。特邀省厅科信处领导及三位行业博导担任评审。会上，团队负责人李明阳教授对系统整体架构做了汇报，张子轩同学演示了嫌疑人跨镜头轨迹拼接算法。评审组一致给予该系统“国内领先”评定，并现场讨论了下阶段的推广方案。
            </p>
            <div class="footer-meta">
              <span>地点: 📍 401学术汇报厅</span>
              <span>参与人数: 👥 45人</span>
              <button class="btn-more" @click="openActivityDetail(featuredActivity)">查看纪实 →</button>
            </div>
          </div>
        </div>

        <!-- 2. Cards Grid of Other Activities -->
        <div class="activities-grid font-num">
          <div 
            v-for="act in filteredActivities" 
            :key="act.id" 
            class="activity-card glass-panel"
            @click="openActivityDetail(act)"
          >
            <div class="img-box">
              <img :src="act.cover" alt="活动封面" style="opacity: 0.25; object-fit: cover; background-color: #0c1b3d;" />
              <span class="type-tag">{{ act.type }}</span>
            </div>
            <div class="body">
              <span class="date">{{ act.date }}</span>
              <h4>{{ act.title }}</h4>
              <p class="desc">{{ act.desc }}</p>
              <div class="meta">
                <span>📍 {{ act.location }}</span>
                <span>👥 {{ act.attendees }}人</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Annual sparkline / activities curve chart -->
        <div class="annual-chart-box glass-panel font-num">
          <h4>📊 2025-2026 实验室活动热度趋势</h4>
          <div class="sparkline-chart">
            <div class="col" v-for="d in annualTrend" :key="d.month">
              <div class="bar-fill" :style="{ height: (d.count / 8 * 100) + '%' }">
                <span class="tip">{{ d.count }}</span>
              </div>
              <span class="lbl">{{ d.month }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Right Sidebar: Hot Topics & Calendar -->
    <aside class="right-sidebar glass-panel font-num">
      <!-- Calendar Widget -->
      <section class="sidebar-section">
        <h3>📅 实验室日历看板</h3>
        <div class="mini-calendar glass-panel">
          <div class="header">2026年5月</div>
          <div class="weekdays">
            <span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span>
          </div>
          <div class="days">
            <span class="other">27</span><span class="other">28</span><span class="other">29</span><span class="other">30</span><span>1</span><span>2</span><span>3</span>
            <span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
            <span>11</span><span>12</span><span>13</span><span>14</span><span class="event">15</span><span>16</span><span>17</span>
            <span>18</span><span>19</span><span>20</span><span>21</span><span>22</span><span>23</span><span>24</span>
            <span>25</span><span>26</span><span>27</span><span class="active">28</span><span>29</span><span>30</span><span>31</span>
          </div>
        </div>
      </section>

      <!-- Hot Activities -->
      <section class="sidebar-section">
        <h3>🔥 热门活动榜</h3>
        <div class="hot-list">
          <div class="hot-item" v-for="(ha, index) in hotActivities" :key="ha.title">
            <span class="rank" :class="'rank-' + (index + 1)">0{{ index + 1 }}</span>
            <div class="txt">
              <h5>{{ ha.title }}</h5>
              <span class="status" :class="ha.class">{{ ha.status }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Ask AI Mascot -->
      <section class="sidebar-section highlight-section glass-panel">
        <h3>🐱 活动问小喵</h3>
        <p class="desc">想了解实验室的精彩瞬间或下期规划？</p>
        <button class="btn-ask-ai">询问小喵 →</button>
      </section>
    </aside>

    <!-- Activity Detail Modal -->
    <div v-if="activeActivity" class="detail-dialog-overlay" @click="activeActivity = null">
      <div class="detail-dialog-window glass-panel font-num" @click.stop>
        <div class="dialog-header">
          <h3>活动纪实详情</h3>
          <button class="close-btn" @click="activeActivity = null">×</button>
        </div>
        <div class="dialog-body scroll-container">
          <div class="top-meta">
            <div class="cover-box">
              <img :src="activeActivity.cover" alt="封面" style="width:100%; height:120px; object-fit:cover; opacity: 0.3;" />
            </div>
            <div class="info-box">
              <h4>{{ activeActivity.title }}</h4>
              <p>活动类型：<span class="tag">{{ activeActivity.type }}</span> · 时间：{{ activeActivity.date }}</p>
              <p>活动地点：<strong>{{ activeActivity.location }}</strong> · 参与人数：<strong>{{ activeActivity.attendees }}人</strong></p>
            </div>
          </div>

          <div class="dialog-section">
            <h5>活动纪实</h5>
            <p class="desc-p">{{ activeActivity.desc }}</p>
          </div>

          <div class="dialog-section" v-if="activeActivity.highlights">
            <h5>精彩看点 / 成果转化</h5>
            <ul class="highlights-list">
              <li v-for="hl in activeActivity.highlights" :key="hl">★ {{ hl }}</li>
            </ul>
          </div>

          <div class="dialog-section" v-if="activeActivity.photos">
            <h5>精彩掠影 (相册)</h5>
            <div class="photos-grid">
              <div class="photo-card" v-for="ph in activeActivity.photos" :key="ph">
                <img :src="ph" alt="相册" style="width:100%; height:70px; object-fit:cover; opacity: 0.5;" />
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn-primary" @click="activeActivity = null">关闭详情</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const selectedFilter = ref('all');
const activeActivity = ref(null);

const filters = [
  { label: '全部活动', value: 'all' },
  { label: '学术交流', value: 'academic' },
  { label: '竞赛活动', value: 'contest' },
  { label: '对外参访', value: 'visit' },
  { label: '团队建设', value: 'teambuilding' }
];

const recentLogs = [
  { date: '05-28', class: 'blue', title: '多模态警务平台结项研讨会', desc: '401汇报厅，省厅科信处领导及高校学者评审通过。' },
  { date: '05-20', class: 'green', title: '接待华为昇腾大模型生态专家', desc: '双方就本地部署昇腾大模型推理卡展开了技术对接。' },
  { date: '05-15', class: 'orange', title: '大二保研沙龙圆满结束', desc: '大四骨干向低年级室员分享了推免与核心代码学习路线。' }
];

const annualTrend = [
  { month: '25-08', count: 2 },
  { month: '25-10', count: 4 },
  { month: '25-12', count: 5 },
  { month: '26-02', count: 1 },
  { month: '26-04', count: 6 },
  { month: '26-05', count: 4 }
];

const hotActivities = [
  { title: '2025暑期大模型微调夏令营', status: '已结束', class: 'gray-t' },
  { title: '多模态警务感知结项答辩', status: '已结束', class: 'gray-t' },
  { title: '华为昇腾生态技术参访', status: '已结束', class: 'gray-t' }
];

// Mock Activities database
const activities = [
  {
    id: 1,
    title: '大模型微调夏令营',
    type: '竞赛活动',
    date: '2025-08-15',
    location: '310实验室 A区',
    attendees: 30,
    cover: '/assets/image3.png',
    desc: '面向全室本科生和低年级研究生的学术暑假集训。张子轩担任主讲，带领大家上手Llama3、Qwen大模型微调及LoRA偏置矩阵微调方法。夏令营产出了3款小Demo，为智小喵开发打下算法根基。',
    highlights: ['零基础室员成功部署本地Qwen微调', '评选出3项优秀大模型微调Demo', '沉淀了2万字大模型学习文档'],
    photos: ['/assets/image3.png', '/assets/image4.png']
  },
  {
    id: 2,
    title: '华为昇腾大模型生态参访',
    type: '对外参访',
    date: '2026-05-20',
    location: '华为杭州研究所',
    attendees: 15,
    cover: '/assets/image6.png',
    desc: '应华为昇腾大模型生态部门邀请，实验室骨干成员赴杭研所进行技术参访与交流。双方就昇腾NPU板卡的CANN算子调优、大模型部署痛点及高校实验室合作机制展开了圆桌探讨。',
    highlights: ['体验华为昇腾最新算力板卡集群', '探讨大语言模型警务边缘端推理的优化策略', '初步达成校企昇腾算力券捐赠意向'],
    photos: ['/assets/image6.png', '/assets/image7.png']
  },
  {
    id: 3,
    title: '大二保研与学术经验沙龙',
    type: '团队建设',
    date: '2026-05-15',
    location: '310实验室 会议角',
    attendees: 25,
    cover: '/assets/image8.png',
    desc: '大四保研骨干刘昊同学，联合研一代表，组织了一场针对大二、大三预备室员的保研推免与学术训练沙龙。倾囊分享了科研入门路径、夏令营推免流程及实验室优秀代码范式的学习方法。',
    highlights: ['详细剖析保研绩点与竞赛加分项', '分享大一到大四的完整学术能力进化模型', '沙龙视频录像已上传实验室云盘'],
    photos: ['/assets/image8.png', '/assets/image1.png']
  }
];

const featuredActivity = {
  id: 4,
  title: '多模态警务感知融合大平台结项答辩暨学术研讨会',
  type: '学术交流',
  date: '2026-05-28',
  location: '401学术汇报厅',
  attendees: 45,
  cover: '/assets/image1.png',
  desc: '课题组“多模态警务感知大平台”正式结项答辩。会议特邀省厅科信处领导及三位行业导师担任评审，李明阳教授汇报了系统架构，张子轩演示了跨镜头目标跟踪算法。评审专家致好评并决定启动多地局级单位试点。',
  highlights: ['专家组一致通过课题结项验收', '多模态跟踪算法准确率指标达到国内先进水平', '现场达成与两个市局交警支队的试点合作协议'],
  photos: ['/assets/image1.png', '/assets/image2.png']
};

const filteredActivities = computed(() => {
  if (selectedFilter.value === 'all') return activities;
  return activities.filter(a => {
    if (selectedFilter.value === 'academic' && a.type === '学术交流') return true;
    if (selectedFilter.value === 'contest' && a.type === '竞赛活动') return true;
    if (selectedFilter.value === 'visit' && a.type === '对外参访') return true;
    if (selectedFilter.value === 'teambuilding' && a.type === '团队建设') return true;
    return false;
  });
});

const openActivityDetail = (act) => {
  activeActivity.value = act;
};
</script>

<style scoped>
.activity-showcase-container {
  height: calc(100vh - 110px);
  width: 100%;
  display: flex;
  gap: 16px;
  padding: 16px;
  overflow: hidden;
}

/* Left Sidebar */
.left-sidebar {
  width: 250px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-shrink: 0;
}

.left-sidebar h3 {
  font-size: 13px;
  color: #fff;
  font-weight: bold;
  margin-bottom: 12px;
  border-left: 2px solid #38bdf8;
  padding-left: 8px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.overview-grid .stat-card {
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 10px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.overview-grid .lbl {
  font-size: 9px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.overview-grid .val {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.overview-grid .val small {
  font-size: 9px;
  font-weight: normal;
  color: var(--color-text-secondary);
}

.left-sidebar .scroll-y-section {
  flex-grow: 1;
  overflow-y: auto;
}

.activity-timeline {
  border-left: 1px solid rgba(255,255,255,0.06);
  padding-left: 14px;
  margin-left: 4px;
}

.activity-timeline .timeline-item {
  position: relative;
  margin-bottom: 15px;
  font-size: 10px;
}

.activity-timeline .timeline-item .date {
  font-size: 8px;
  color: var(--color-text-secondary);
  display: block;
}

.activity-timeline .timeline-item .bullet {
  position: absolute;
  left: -19px;
  top: 10px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-text-secondary);
}

.activity-timeline .timeline-item .bullet.blue { background: #38bdf8; }
.activity-timeline .timeline-item .bullet.green { background: #10b981; }
.activity-timeline .timeline-item .bullet.orange { background: #fbbf24; }

.activity-timeline h5 {
  font-size: 11px;
  color: #fff;
  margin: 2px 0;
}

.activity-timeline p {
  color: var(--color-text-secondary);
  line-height: 1.3;
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

.filter-top-bar {
  display: flex;
  gap: 10px;
  border-bottom: 1px solid rgba(0, 168, 255, 0.15);
  padding-bottom: 12px;
  flex-shrink: 0;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: var(--color-text-secondary);
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
}

.filter-btn.active {
  background: rgba(0, 168, 255, 0.2);
  border-color: var(--color-border-active);
  color: #fff;
}

.activities-scroll-area {
  flex: 1;
  overflow-y: auto;
  margin-top: 16px;
}

/* Featured Big Card */
.featured-activity-card {
  display: flex;
  margin-bottom: 20px;
  overflow: hidden;
  background: rgba(6,18,45,0.4);
  border: 1px solid rgba(0, 168, 255, 0.12);
}

.card-cover {
  width: 260px;
  height: 160px;
  position: relative;
  background: #020617;
  flex-shrink: 0;
}

.featured-img {
  width: 100%;
  height: 100%;
}

.badge-overlay {
  position: absolute;
  top: 8px; left: 8px;
  background: rgba(56, 189, 248, 0.25);
  border: 1px solid #38bdf8;
  color: #fff;
  font-size: 9px;
  padding: 1px 6px;
  border-radius: 4px;
}

.card-info {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-grow: 1;
}

.card-info .date {
  font-size: 9px;
  color: var(--color-text-secondary);
}

.card-info h4 {
  font-size: 14px;
  color: #fff;
  margin: 0;
}

.card-info .desc {
  font-size: 11px;
  color: var(--color-text-secondary);
  line-height: 1.4;
  height: 60px;
  overflow: hidden;
}

.footer-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  color: var(--color-text-secondary);
  border-top: 1px dashed rgba(255,255,255,0.05);
  padding-top: 8px;
  margin-top: auto;
}

.btn-more {
  background: rgba(56,189,248,0.1);
  border: 1px solid var(--color-border);
  color: #38bdf8;
  padding: 2px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-more:hover {
  background: rgba(56,189,248,0.2);
}

/* Activities Grid */
.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.activity-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: rgba(6,18,45,0.4);
  cursor: pointer;
  border: 1px solid rgba(0, 168, 255, 0.05);
}

.activity-card:hover {
  border-color: var(--color-border-active);
  background: rgba(0, 168, 255, 0.03);
}

.activity-card .img-box {
  height: 100px;
  position: relative;
  background: #020617;
}

.activity-card .img-box img { width: 100%; height: 100%; }

.activity-card .type-tag {
  position: absolute;
  top: 6px; left: 6px;
  background: rgba(255,255,255,0.1);
  color: #fff;
  font-size: 8px;
  padding: 1px 4px;
  border-radius: 2px;
}

.activity-card .body {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-grow: 1;
}

.activity-card .date {
  font-size: 8px;
  color: var(--color-text-secondary);
}

.activity-card h4 {
  font-size: 12px;
  color: #fff;
  margin: 0;
}

.activity-card .desc {
  font-size: 10px;
  color: var(--color-text-secondary);
  line-height: 1.3;
  height: 26px;
  overflow: hidden;
}

.activity-card .meta {
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  color: var(--color-text-secondary);
  border-top: 1px dashed rgba(255,255,255,0.05);
  padding-top: 6px;
  margin-top: auto;
}

/* Annual Chart */
.annual-chart-box {
  padding: 14px;
}

.annual-chart-box h4 {
  font-size: 12px;
  color: #fff;
  margin-bottom: 12px;
}

.sparkline-chart {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 30px;
  height: 80px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 8px;
}

.sparkline-chart .col {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30px;
  height: 100%;
  justify-content: flex-end;
}

.sparkline-chart .bar-fill {
  width: 12px;
  background: linear-gradient(180deg, #38bdf8 0%, rgba(56, 189, 248, 0.1) 100%);
  border-radius: 2px 2px 0 0;
  position: relative;
}

.sparkline-chart .tip {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 8px;
  color: #fff;
}

.sparkline-chart .lbl {
  font-size: 9px;
  color: var(--color-text-secondary);
  margin-top: 4px;
}

/* Right Sidebar Calendar */
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

.mini-calendar {
  padding: 10px;
  font-size: 10px;
  background: rgba(6,18,45,0.4);
}

.mini-calendar .header {
  text-align: center;
  font-weight: bold;
  color: #38bdf8;
  margin-bottom: 6px;
}

.mini-calendar .weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.mini-calendar .days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  gap: 4px;
}

.mini-calendar .days span {
  display: inline-block;
  padding: 2px 0;
  cursor: pointer;
  border-radius: 2px;
}

.mini-calendar .days span.other {
  color: rgba(255,255,255,0.15);
}

.mini-calendar .days span.event {
  background: rgba(56, 189, 248, 0.15);
  border: 1px solid #38bdf8;
}

.mini-calendar .days span.active {
  background: #38bdf8;
  color: #020617;
  font-weight: bold;
}

.hot-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255,255,255,0.01);
  padding: 8px;
  border-radius: 4px;
}

.hot-item .rank {
  font-size: 13px;
  font-weight: bold;
}

.hot-item .rank-1 { color: #f43f5e; }
.hot-item .rank-2 { color: #fb923c; }
.hot-item .rank-3 { color: #fbbf24; }

.hot-item .txt {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.hot-item h5 {
  font-size: 11px;
  color: #fff;
  margin: 0;
}

.hot-item .status {
  font-size: 8px;
  align-self: flex-start;
  margin-top: 2px;
}

.hot-item .status.gray-t {
  color: var(--color-text-secondary);
}

.highlight-section {
  background: rgba(0, 168, 255, 0.02);
  padding: 12px;
}

.highlight-section p {
  font-size: 10px;
  color: var(--color-text-secondary);
  line-height: 1.3;
  margin-bottom: 8px;
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

/* ========================================================
   ACTIVITY DETAIL MODAL
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

.top-meta {
  display: flex;
  gap: 16px;
  background: rgba(255,255,255,0.01);
  padding: 12px;
  border-radius: 6px;
}

.top-meta .cover-box {
  width: 140px;
  height: 80px;
  background: #020617;
  border-radius: 4px;
  overflow: hidden;
}

.top-meta .info-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11px;
  color: var(--color-text-secondary);
}

.top-meta h4 {
  font-size: 14px;
  color: #fff;
  margin: 0;
}

.top-meta .tag {
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

.desc-p {
  font-size: 11px;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.highlights-list {
  list-style: none;
  font-size: 11px;
  color: var(--color-text-secondary);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.photo-card {
  background: #020617;
  border-radius: 4px;
  overflow: hidden;
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
</style>
