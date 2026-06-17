<template>
  <div v-if="!detailMember" class="members-hall-container cockpit-page">
    <aside class="left-rail glass-panel font-num">
      <div class="panel-title">
        <span class="title-icon">👥</span>
        <div>
          <h3>成员大厅</h3>
          <p>真实成果关联画像</p>
        </div>
      </div>

      <section class="rail-section overview-section">
        <h4>成员概览</h4>
        <div class="metric-grid">
          <button
            v-for="role in roleFilters"
            :key="role.value"
            type="button"
            class="metric-card"
            :class="{ active: selectedRole === role.value }"
            @click="selectedRole = role.value"
          >
            <span>{{ role.label }}</span>
            <strong>{{ roleCount(role.value) }}</strong>
          </button>
        </div>
      </section>

      <section class="rail-section direction-section">
        <h4>研究方向分布</h4>
        <div class="bar-list">
          <button
            v-for="dir in directionStats"
            :key="dir.name"
            type="button"
            class="bar-item"
            :class="{ active: selectedDirection === dir.name }"
            @click="toggleDirection(dir.name)"
          >
            <div class="bar-meta">
              <span>{{ dir.name }}</span>
              <b>{{ dir.count }}人</b>
            </div>
            <div class="bar-track">
              <i :style="{ width: directionWidth(dir.count), background: dir.color }"></i>
            </div>
          </button>
        </div>
      </section>
    </aside>

    <main class="center-stage glass-panel">
      <header class="stage-heading font-num">
        <div>
          <h2>成员大厅</h2>
          <p>实验室成员画像与成长档案</p>
        </div>
      </header>

      <div class="direction-chips font-num">
        <button type="button" :class="{ active: selectedDirection === 'all' }" @click="selectedDirection = 'all'">全部方向</button>
        <button
          v-for="dir in directionStats"
          :key="dir.name"
          type="button"
          :class="{ active: selectedDirection === dir.name }"
          @click="toggleDirection(dir.name)"
        >
          {{ dir.name }}
        </button>
      </div>

      <div class="stage-toolbar font-num">
        <div class="search-box">
          <input v-model="searchQuery" type="search" placeholder="搜索姓名、方向、技能或成果..." />
          <span>⌕</span>
        </div>
      </div>

      <div class="member-board scroll-container">
        <button
          v-for="member in filteredMembers"
          :key="member.id"
          type="button"
          class="member-tile glass-panel"
          :class="{ selected: activeMember?.id === member.id }"
          @click="openMemberDetail(member)"
        >
          <div class="avatar-frame">
            <span>{{ member.avatar }}</span>
            <i :class="member.roleClass">{{ member.role }}</i>
          </div>
          <div class="member-main">
            <div class="member-name-row">
              <h4>{{ member.name }}</h4>
              <small>{{ member.grade }}</small>
            </div>
            <p>{{ member.major }}</p>
            <div class="tag-row">
              <span v-for="tag in member.tags" :key="tag">{{ tag }}</span>
            </div>
            <div class="member-stats">
              <span>项目 <b>{{ member.projectsCount }}</b></span>
              <span>奖项 <b>{{ member.awardsCount }}</b></span>
              <span>产权 <b>{{ member.patentsCount }}</b></span>
            </div>
          </div>
        </button>
      </div>

    </main>
  </div>

  <div v-else class="member-detail-page cockpit-page font-num">
    <div class="detail-path">
      <button type="button" @click="detailMember = null">‹ 返回成员大厅</button>
      <span>成员大厅 / 成员详情</span>
    </div>

    <aside class="detail-profile glass-panel">
      <div class="portrait-card">
        <div class="portrait-avatar">{{ detailMember.avatar }}</div>
        <button type="button" class="favorite-btn" aria-label="收藏成员">★</button>
        <h2>{{ detailMember.name }}</h2>
        <span :class="detailMember.roleClass">{{ detailMember.role }}</span>
      </div>
      <ul class="profile-facts">
        <li><span>职务</span><strong>{{ detailMember.role }} / {{ detailMember.grade }}</strong></li>
        <li><span>专业方向</span><strong>{{ detailMember.major }}</strong></li>
        <li><span>所属专业</span><strong>{{ detailMember.primaryDirection }}</strong></li>
        <li><span>入室时间</span><strong>{{ detailMember.joinTime }}</strong></li>
        <li><span>研究方向</span><strong>{{ detailMember.tags.join(' / ') }}</strong></li>
      </ul>
      <section class="skill-panel">
        <h4>技能标签</h4>
        <div class="tag-row">
          <span v-for="skill in detailMember.skills" :key="skill">{{ skill }}</span>
        </div>
      </section>
      <section class="mascot-card glass-panel">
        <div class="mascot-figure">🐱</div>
        <div>
          <strong>智小喵提示</strong>
          <p>可查看成员成长轨迹与关联成果。</p>
        </div>
      </section>
    </aside>

    <main class="detail-main glass-panel">
      <div class="detail-tabs">
        <button
          v-for="tab in detailTabs"
          :key="tab.id"
          type="button"
          :class="{ active: activeDetailTab === tab.id }"
          @click="activeDetailTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="detail-main-scroll scroll-container">
        <template v-if="activeDetailTab === 'overview'">
          <div class="overview-detail-grid">
            <section class="intro-panel glass-panel">
              <h4>个人简介</h4>
              <p>{{ detailMember.bio }}</p>
              <div class="core-data-grid">
                <article>
                  <span>参与项目</span>
                  <strong>{{ detailMember.projectsCount }}<small>项</small></strong>
                </article>
                <article>
                  <span>获奖成果</span>
                  <strong>{{ detailMember.awardsCount }}<small>项</small></strong>
                </article>
                <article>
                  <span>发表论文</span>
                  <strong>{{ detailMember.papersCount }}<small>篇</small></strong>
                </article>
                <article>
                  <span>知识产权</span>
                  <strong>{{ detailMember.patentsCount }}<small>项</small></strong>
                </article>
              </div>
            </section>
            <section class="radar-card glass-panel">
              <h4>能力雷达图</h4>
              <div class="radar-wrap">
                <svg viewBox="0 0 140 140">
                  <polygon points="70,10 127,51 105,118 35,118 13,51" class="radar-grid" />
                  <polygon points="70,32 106,58 92,100 48,100 34,58" class="radar-grid" />
                  <line x1="70" y1="10" x2="70" y2="118" />
                  <line x1="13" y1="51" x2="127" y2="51" />
                  <line x1="35" y1="118" x2="105" y2="118" />
                  <polygon :points="radarPoints(detailMember.radar)" class="radar-area" />
                  <text x="70" y="9">计算机视觉</text>
                  <text x="128" y="52">深度学习</text>
                  <text x="107" y="132">项目管理</text>
                  <text x="33" y="132">教育技术</text>
                  <text x="7" y="52">物联网</text>
                </svg>
              </div>
            </section>
          </div>
        </template>

        <template v-else-if="activeDetailTab === 'projects'">
          <div class="tab-stat-grid project-stat-grid">
            <article>
              <i>▣</i>
              <span>参与项目</span>
              <strong>{{ detailMember.projectsCount }}<small>项</small></strong>
            </article>
            <article>
              <i>●</i>
              <span>主持项目</span>
              <strong>{{ Math.min(3, detailMember.repProjects.length || 1) }}<small>项</small></strong>
            </article>
            <article>
              <i>☄</i>
              <span>在研项目</span>
              <strong>{{ Math.max(1, detailMember.projectsCount - 2) }}<small>项</small></strong>
            </article>
            <article>
              <i>☑</i>
              <span>已结题</span>
              <strong>{{ Math.min(5, detailMember.projectsCount) }}<small>项</small></strong>
            </article>
          </div>
          <div class="tab-section-head">
            <h4>项目列表</h4>
            <div class="mini-filters"><span class="active">全部</span><span>进行中</span><span>已结题</span></div>
          </div>
          <div class="project-list-panel">
            <article v-for="(project, index) in projectTabItems(detailMember)" :key="project.title" class="project-wide-row">
              <div class="row-icon">▥</div>
              <div class="row-main">
                <div class="row-title">
                  <strong>{{ project.title }}</strong>
                  <span class="blue-tag">{{ project.role || '参与' }}</span>
                  <span class="orange-tag" v-if="index % 2 === 0">横向建设</span>
                </div>
                <p>{{ project.desc }}</p>
                <i><em :style="{ width: projectProgress(index) + '%' }"></em></i>
              </div>
              <time>{{ project.duration || project.date || '2024-2025' }}</time>
              <span :class="project.stateClass || (index % 2 ? 'blue-tag' : 'green-tag')">{{ index % 2 ? '已结题' : '进行中' }}</span>
            </article>
          </div>
        </template>

        <template v-else-if="activeDetailTab === 'awards'">
          <div class="tab-stat-grid award-stat-grid">
            <article class="gold">
              <i>🏆</i>
              <span>获奖总数</span>
              <strong>{{ awardTabItems(detailMember).length }}<small>项</small></strong>
            </article>
            <article><i>🏅</i><span>国家级</span><strong>{{ awardLevelCount(detailMember, '国') }}<small>项</small></strong></article>
            <article><i>🎖</i><span>省部级</span><strong>{{ awardLevelCount(detailMember, '省') }}<small>项</small></strong></article>
            <article><i>🏛</i><span>校级/行业</span><strong>{{ Math.max(0, awardTabItems(detailMember).length - awardLevelCount(detailMember, '国') - awardLevelCount(detailMember, '省')) }}<small>项</small></strong></article>
          </div>
          <div class="tab-section-head">
            <h4>获奖列表</h4>
            <div class="mini-filters"><span>全部级别</span><span>全部类型</span></div>
          </div>
          <div class="award-card-grid">
            <article v-for="(award, index) in awardTabItems(detailMember)" :key="award.name" class="award-show-card">
              <div class="award-trophy">{{ awardIcon(index) }}</div>
              <div>
                <strong>{{ award.name }}</strong>
                <p><span class="orange-tag">{{ award.level }}</span><span class="blue-tag">{{ index % 2 ? '团队贡献' : '主要成员' }}</span></p>
                <small>{{ award.host || detailMember.primaryDirection }} <b>{{ award.date || '附件归档' }}</b></small>
              </div>
            </article>
          </div>
          <div class="award-bottom-grid">
            <section class="chart-mini-card">
              <h4>获奖分布</h4>
              <div class="mini-donut">
                <svg viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="43" class="donut-bg" />
                  <circle cx="60" cy="60" r="43" class="donut-a" stroke-dasharray="92 270" />
                  <circle cx="60" cy="60" r="43" class="donut-b" stroke-dasharray="92 270" stroke-dashoffset="-92" />
                  <circle cx="60" cy="60" r="43" class="donut-c" stroke-dasharray="86 270" stroke-dashoffset="-184" />
                </svg>
                <strong>{{ awardTabItems(detailMember).length }}<small>总计</small></strong>
              </div>
            </section>
            <section class="chart-mini-card">
              <h4>年度获奖轨迹</h4>
              <svg class="trend-svg" viewBox="0 0 360 120">
                <polyline points="10,90 90,66 170,36 250,36 340,70" />
                <g v-for="(item, index) in awardTrendPoints" :key="item.year">
                  <circle :cx="10 + index * 80" :cy="item.y" r="4" />
                  <text :x="10 + index * 80" :y="item.y - 10">{{ item.count }}项</text>
                  <text :x="10 + index * 80" y="112">{{ item.year }}</text>
                </g>
              </svg>
            </section>
          </div>
        </template>

        <template v-else-if="activeDetailTab === 'papers'">
          <div class="tab-stat-grid paper-stat-grid">
            <article><i>▤</i><span>论文总数</span><strong>{{ paperTabItems(detailMember).length }}<small>篇</small></strong></article>
            <article><i>▤</i><span>SCI/EI</span><strong>{{ Math.min(5, paperTabItems(detailMember).length) }}<small>篇</small></strong></article>
            <article><i>▤</i><span>中文核心</span><strong>{{ Math.min(4, paperTabItems(detailMember).length) }}<small>篇</small></strong></article>
            <article><i>▤</i><span>会议论文</span><strong>{{ Math.max(1, paperTabItems(detailMember).length - 2) }}<small>篇</small></strong></article>
          </div>
          <div class="tab-section-head">
            <h4>论文列表</h4>
            <div class="mini-filters"><span>全部</span><span>时间降序</span><span>导出</span></div>
          </div>
          <div class="paper-table-list">
            <article v-for="(paper, index) in paperTabItems(detailMember)" :key="paper.title">
              <b>{{ index + 1 }}</b>
              <div>
                <strong>{{ paper.title }}</strong>
                <p>{{ paper.source }} <time>{{ paper.date }}</time></p>
              </div>
              <div>
                <span>发表期刊：{{ paper.journal }}</span>
                <span>本人贡献：{{ paper.role }}</span>
              </div>
              <em :class="index % 3 === 1 ? 'blue-tag' : 'green-tag'">{{ paper.level }}</em>
            </article>
          </div>
          <div class="paper-bottom-grid">
            <section class="chart-mini-card">
              <h4>年度发文走势（篇）</h4>
              <svg class="trend-svg" viewBox="0 0 260 120">
                <polyline points="6,94 55,74 104,56 153,38 202,28 250,42" />
                <g v-for="(item, index) in paperTrendPoints" :key="item.year">
                  <circle :cx="6 + index * 49" :cy="item.y" r="3.5" />
                  <text :x="6 + index * 49" y="112">{{ item.year }}</text>
                </g>
              </svg>
            </section>
            <section class="chart-mini-card direction-bars-detail">
              <h4>研究方向分布</h4>
              <article v-for="tag in detailMember.tags" :key="tag">
                <span>{{ tag }}</span><i><em :style="{ width: `${50 + tag.length * 6}%` }"></em></i><b>{{ 18 + tag.length * 4 }}%</b>
              </article>
            </section>
            <section class="chart-mini-card keyword-panel">
              <h4>热门关键词</h4>
              <div><span v-for="skill in detailMember.skills" :key="skill">{{ skill }}</span></div>
            </section>
          </div>
        </template>

        <template v-else-if="activeDetailTab === 'patents'">
          <div class="tab-stat-grid patent-stat-grid">
            <article><i>IP</i><span>产权总数</span><strong>{{ patentTabItems(detailMember).length }}<small>项</small></strong></article>
            <article><i>∿</i><span>发明专利</span><strong>{{ patentTypeCount(detailMember, '专利') }}<small>项</small></strong></article>
            <article><i>&lt;/&gt;</i><span>软件著作权</span><strong>{{ patentTypeCount(detailMember, '软') }}<small>项</small></strong></article>
            <article><i>↔</i><span>成果转化/其他</span><strong>{{ Math.max(1, patentTabItems(detailMember).length - patentTypeCount(detailMember, '专利') - patentTypeCount(detailMember, '软')) }}<small>项</small></strong></article>
          </div>
          <div class="tab-section-head">
            <h4>产权列表</h4>
            <div class="mini-filters"><span class="active">全部</span><span>已授权</span><span>受理中</span><span>已登记</span></div>
          </div>
          <div class="patent-card-grid">
            <article v-for="(patent, index) in patentTabItems(detailMember)" :key="patent.name">
              <div class="patent-icon">{{ patent.type?.includes('软') ? '&lt;/&gt;' : 'IP' }}</div>
              <div>
                <strong>{{ patent.name }}</strong>
                <p>申请号：{{ patent.code || `CN202${index}0110${index}456.7` }} <span :class="patent.statusClass || 'blue-tag'">{{ patent.status || '已授权' }}</span></p>
                <small>简介：{{ patent.type }} · {{ patent.role || detailMember.name }}参与完成。</small>
              </div>
              <b>›</b>
            </article>
          </div>
          <section class="ip-timeline chart-mini-card">
            <h4>授权进度 / 产权时间轴</h4>
            <div class="ip-line">
              <article v-for="(patent, index) in patentTimelineItems(detailMember)" :key="patent.name">
                <i></i>
                <strong>{{ 2021 + index }}</strong>
                <span>{{ patent.type }}</span>
                <small>{{ patent.date || `202${index + 1}-05-18` }}</small>
              </article>
            </div>
          </section>
        </template>

        <template v-else>
          <div class="tab-stat-grid growth-stat-grid">
            <article><i>◈</i><span>成长阶段</span><strong>5<small>个</small></strong><p>当前处于第5阶段</p></article>
            <article><i>❖</i><span>关键里程碑</span><strong>12<small>个</small></strong><p>重要节点与突破</p></article>
            <article><i>▰</i><span>项目突破</span><strong>{{ detailMember.projectsCount + 2 }}<small>项</small></strong><p>牵头/参与项目突破</p></article>
            <article><i>☷</i><span>成果沉淀</span><strong>{{ detailMember.awardsCount + detailMember.patentsCount }}+<small></small></strong><p>论文/专利/获奖等成果</p></article>
          </div>
          <section class="growth-roadmap">
            <h4>成长轨迹详情</h4>
            <div class="road-years"><span v-for="item in growthStages" :key="item.year">{{ item.year }}</span></div>
            <div class="road-card-row">
              <article v-for="stage in growthStages" :key="stage.title">
                <i>{{ stage.icon }}</i>
                <strong>{{ stage.title }}</strong>
                <p>{{ stage.desc }}</p>
                <ul>
                  <li v-for="point in stage.points" :key="point">{{ point }}</li>
                </ul>
                <span>{{ stage.badge }}</span>
              </article>
            </div>
          </section>
          <div class="growth-bottom-grid">
            <section class="chart-mini-card growth-lines">
              <h4>阶段能力成长</h4>
              <svg viewBox="0 0 420 130">
                <polyline class="line-a" points="12,104 110,76 208,56 306,40 405,18" />
                <polyline class="line-b" points="12,112 110,92 208,72 306,58 405,44" />
                <polyline class="line-c" points="12,118 110,108 208,98 306,86 405,66" />
                <g v-for="(year, index) in ['2020','2021','2022','2023','2024']" :key="year">
                  <text :x="12 + index * 98" y="124">{{ year }}</text>
                </g>
              </svg>
            </section>
            <section class="chart-mini-card keyword-panel growth-keywords">
              <h4>成长关键词</h4>
              <div><span v-for="word in growthKeywords(detailMember)" :key="word">{{ word }}</span></div>
            </section>
          </div>
        </template>
      </div>
    </main>

    <aside class="detail-right">
      <section class="right-panel glass-panel">
        <h4>代表项目（{{ detailMember.repProjects.length }}项）</h4>
        <article v-for="project in detailMember.repProjects" :key="project.title" class="mini-project">
          <strong>{{ project.title }}</strong>
          <span>{{ project.role }}</span>
        </article>
      </section>
      <section class="right-panel glass-panel">
        <h4>成长轨迹</h4>
        <article v-for="item in detailMember.milestones" :key="item.title" class="timeline-mini">
          <i :class="item.class"></i>
          <time>{{ item.date }}</time>
          <strong>{{ item.title }}</strong>
          <p>{{ item.desc }}</p>
        </article>
      </section>
    </aside>

    <section class="detail-bottom glass-panel">
      <h4>关联成果（{{ detailMember.assocAchievements.length }}项）</h4>
      <div class="bottom-achievements">
        <article v-for="item in detailMember.assocAchievements" :key="item.title">
          <span :class="item.typeClass">{{ item.type }}</span>
          <strong>{{ item.title }}</strong>
          <small>{{ item.date }} · {{ item.detail }}</small>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { fetchLabApi } from './labDataApi';
import {
  realLabMembers,
  realLabMemberOverview,
  realLabMemberDirectionStats
} from './labMemberData';

const members = ref(realLabMembers);
const memberOverview = ref(realLabMemberOverview);
const directionStats = ref(realLabMemberDirectionStats);
const selectedRole = ref('all');
const selectedDirection = ref('all');
const searchQuery = ref('');
const detailMember = ref(null);
const activeMember = ref(realLabMembers[0]);
const activeDetailTab = ref('overview');

const roleFilters = [
  { label: '成员总数', value: 'all' },
  { label: '教师/导师', value: 'advisor' },
  { label: '研究生', value: 'graduate' },
  { label: '本科生', value: 'undergrad' }
];

const detailTabs = [
  { id: 'overview', label: '个人总览' },
  { id: 'projects', label: '参与项目' },
  { id: 'awards', label: '获奖成果' },
  { id: 'papers', label: '论文成果' },
  { id: 'patents', label: '产权成果' },
  { id: 'timeline', label: '成长时间' }
];

onMounted(async () => {
  const data = await fetchLabApi('members', {
    members: realLabMembers,
    overview: realLabMemberOverview,
    directions: realLabMemberDirectionStats
  });
  members.value = data.members || realLabMembers;
  memberOverview.value = data.overview || realLabMemberOverview;
  directionStats.value = data.directions || realLabMemberDirectionStats;
  activeMember.value = members.value[0] || null;
});

const filteredMembers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  return [...members.value]
    .filter((member) => selectedRole.value === 'all' || (selectedRole.value === 'students' ? member.roleValue !== 'advisor' : member.roleValue === selectedRole.value))
    .filter((member) => selectedDirection.value === 'all' || member.primaryDirection.includes(selectedDirection.value))
    .filter((member) => {
      if (!query) return true;
      return `${member.name}${member.major}${member.primaryDirection}${member.skills.join('')}${member.assocAchievements.map((item) => item.title).join('')}`.toLowerCase().includes(query);
    })
    .sort((a, b) => b.awardsCount - a.awardsCount);
});

const roleCount = (role) => {
  if (role === 'all') return memberOverview.value.total;
  if (role === 'students') return members.value.filter((member) => member.roleValue !== 'advisor').length;
  return members.value.filter((member) => member.roleValue === role).length;
};

const maxDirection = computed(() => Math.max(...directionStats.value.map((item) => item.count), 1));
const directionWidth = (count) => `${Math.round((count / maxDirection.value) * 100)}%`;

const toggleDirection = (direction) => {
  selectedDirection.value = selectedDirection.value === direction ? 'all' : direction;
};

const openMemberDetail = (member) => {
  activeMember.value = member;
  detailMember.value = member;
  activeDetailTab.value = 'overview';
};

const radarPoints = (values = []) => {
  const center = 70;
  const radius = 56;
  return values.slice(0, 5).map((value, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / 5;
    const distance = radius * Math.min(value, 100) / 100;
    return `${center + Math.cos(angle) * distance},${center + Math.sin(angle) * distance}`;
  }).join(' ');
};

const projectTabItems = (member) => {
  const source = member?.detailedProjects?.length ? member.detailedProjects : member?.repProjects || [];
  return source.slice(0, 5).map((project, index) => ({
    ...project,
    desc: project.desc || `${member.name}参与${project.title}的系统建设、数据整理与成果沉淀。`,
    duration: project.duration || ['2023.06 - 2024.12', '2022.03 - 2023.09', '2021.01 - 2022.06', '2023.09 - 2025.06', '2024.01 - 2025.12'][index % 5]
  }));
};

const projectProgress = (index) => [78, 100, 100, 62, 48][index % 5];

const awardTabItems = (member) => {
  const items = member?.detailedAwards?.length ? member.detailedAwards : member?.assocAchievements?.filter((item) => item.type.includes('奖')) || [];
  return items.slice(0, 6);
};

const awardLevelCount = (member, keyword) => awardTabItems(member)
  .filter((award) => `${award.level}${award.name}`.includes(keyword)).length;

const awardIcon = (index) => ['🏆', '🏅', '⭐', '🏆', '🔷', '⭐'][index % 6];

const awardTrendPoints = [
  { year: '2021', count: 1, y: 78 },
  { year: '2022', count: 2, y: 52 },
  { year: '2023', count: 2, y: 52 },
  { year: '2024', count: 1, y: 78 }
];

const paperTabItems = (member) => {
  const baseTitles = [
    `面向${member.primaryDirection}的多模态学习行为分析与情绪识别方法`,
    `基于知识图谱的${member.tags[0] || '智能系统'}资源推荐方法`,
    `结合时空特征的课堂注意力估计方法研究`,
    `基于多模态特征的学生注意力检测方法研究`,
    `面向MOOC平台的学习行为分析与资源推荐方法`,
    `基于视觉-文本对齐的教学模型理解方法`
  ];
  return baseTitles.map((title, index) => ({
    title,
    source: ['IEEE Transactions on Learning Technologies', 'AI Computers & Education', 'IEEE Access', 'Pattern Recognition', '中国计算机学会通讯', 'AAAI 2023'][index],
    date: ['2024-12-15', '2024-08-30', '2024-05-22', '2023-11-10', '2023-09-18', '2023-02-07'][index],
    journal: ['IEEE TLT（中科院一区）', 'Computers & Education（中科院一区）', 'IEEE Access（中科院二区）', 'Pattern Recognition（中科院一区）', '中国计算机学会通讯（核心）', 'AAAI 2023（会议论文）'][index],
    role: ['第一作者', '通讯作者', '第一作者', '共同作者', '第一作者', '合作作者'][index],
    level: ['SCI Q1', 'SCI Q1', 'SCI Q2', 'SCI Q1', '中文核心', 'CCF A类'][index]
  }));
};

const paperTrendPoints = [
  { year: '2019', y: 98 },
  { year: '2020', y: 82 },
  { year: '2021', y: 66 },
  { year: '2022', y: 50 },
  { year: '2023', y: 34 },
  { year: '2024', y: 46 }
];

const patentTabItems = (member) => {
  const real = member?.detailedPatents?.length ? member.detailedPatents : [];
  if (real.length) return real.slice(0, 6);
  return [
    { name: `一种基于${member.tags[0] || '多模态'}的教学资源推荐方法`, type: '发明专利', code: 'CN202110345676.9', status: '已授权', statusClass: 'blue-tag', role: member.name, date: '2021-05-18' },
    { name: '课堂行为分析平台 V2.0', type: '软件著作权', code: '2022SR17091234', status: '已登记', statusClass: 'blue-tag', role: member.name, date: '2022-07-07' },
    { name: '智能课堂视频剪辑软件', type: '软件著作权', code: '2022SR1234567', status: '已登记', statusClass: 'blue-tag', role: member.name, date: '2022-05-25' },
    { name: '教育数据处理引擎', type: '软件著作权', code: '2021SR12005678', status: '已授权', statusClass: 'green-tag', role: member.name, date: '2022-11-15' },
    { name: '基于注意力机制的作业批改方法', type: '发明专利', code: 'CN202210122331.1', status: '受理中', statusClass: 'orange-tag', role: member.name, date: '2022-04-28' },
    { name: '教学评价模型可视化平台软件', type: '软件著作权', code: '2023SR0987654', status: '已登记', statusClass: 'blue-tag', role: member.name, date: '2022-09-10' }
  ];
};

const patentTypeCount = (member, keyword) => patentTabItems(member).filter((item) => `${item.type}${item.name}`.includes(keyword)).length;

const patentTimelineItems = (member) => patentTabItems(member).slice(0, 4);

const growthStages = [
  { year: '2020', icon: '▧', title: '加入实验室', desc: '正式加入实验室，聚焦AI教学与计算机视觉方向。', points: ['厘清研究方向', '融入团队协作', '掌握核心方法'], badge: '适应 · 融入' },
  { year: '2021', icon: '🚀', title: '项目突破', desc: '承担重要科研项目，完成实验与系统验证。', points: ['参与国内外竞赛', '实践落地教学应用', '完成算法优化探索'], badge: '突破 · 成长' },
  { year: '2022', icon: '🏆', title: '成果丰收', desc: '科研成果丰收，论文发表与专利申请并进。', points: ['发表论文3篇', '提交发明专利1项', '取得软件著作权'], badge: '收获 · 丰收' },
  { year: '2023', icon: '▰', title: '平台淬炼', desc: '主导平台开发与教学资源建设，推动技术平台化。', points: ['搭建实验教学平台', '推动产教融合落地', '团队规模扩展'], badge: '沉淀 · 转化' },
  { year: '2024', icon: '▟', title: '持续创新', desc: '探索前沿方向，拓展应用边界，孵化创新成果。', points: ['拓展多模态大模型方向', '发表论文4篇', '申请发明专利2项'], badge: '创新 · 引领' }
];

const growthKeywords = (member) => [
  '深耕积累',
  '技术突破',
  '成果爆发',
  '平台构建',
  '产学对接',
  '跨领域融合',
  '团队协作',
  '持续创新',
  ...(member?.skills || []).slice(0, 2)
];
</script>

<style scoped>
.members-hall-container {
  height: calc(100vh - 121px);
  width: 100%;
  display: grid;
  grid-template-columns: 300px minmax(640px, 1fr);
  gap: 18px;
  padding: 18px 22px;
  overflow: hidden;
}

.left-rail,
.center-stage {
  min-height: 0;
  overflow: hidden;
}

.left-rail {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.panel-title,
.profile-head,
.member-name-row,
.stage-toolbar,
.bar-meta,
.member-stats,
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.panel-title {
  justify-content: flex-start;
}

.title-icon {
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
.profile-head h3 {
  color: #fff;
  font-size: 20px;
}

.panel-title p,
.profile-head p,
.hint {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.rail-section .hint {
  display: -webkit-box;
  overflow: hidden;
  line-height: 1.35;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.metric-card {
  min-height: 48px;
  border: 1px solid rgba(67, 183, 255, 0.24);
  border-radius: 6px;
  background: rgba(4, 24, 52, 0.72);
  cursor: pointer;
  text-align: left;
  padding: 6px 9px;
}

.metric-card span,
.metric-card strong {
  display: block;
}

.metric-card span {
  font-size: 12px;
}

.metric-card strong {
  margin-top: 2px;
  color: #fff;
  font-size: 19px;
}

.metric-card.active {
  border-color: rgba(114, 231, 255, 0.85);
  background: rgba(42, 162, 255, 0.22);
}

.rail-section {
  min-height: 0;
}

.direction-section {
  flex: 1;
  min-height: 158px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.rail-section h4,
.profile-section h4 {
  color: #eaf8ff;
  font-size: 15px;
  margin-bottom: 8px;
  padding-left: 8px;
  border-left: 2px solid #43b7ff;
}

.bar-list,
.achievement-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.direction-section .bar-list {
  min-height: 0;
  overflow-y: auto;
  padding-right: 2px;
}

.bar-item {
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 0;
  text-align: left;
}

.bar-item.active .bar-meta span {
  color: #fff;
}

.bar-meta {
  margin-bottom: 4px;
  font-size: 12px;
}

.bar-meta span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bar-meta b {
  color: #fff;
}

.bar-track {
  height: 7px;
  border-radius: 99px;
  overflow: hidden;
  background: rgba(12, 53, 93, 0.74);
}

.bar-track i {
  display: block;
  height: 100%;
  border-radius: inherit;
  box-shadow: 0 0 12px rgba(67, 183, 255, 0.32);
}

.mini-ring {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 8px;
}

.mini-ring svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg,
.ring-main {
  fill: none;
  stroke-width: 12;
}

.ring-bg {
  stroke: rgba(255, 255, 255, 0.06);
}

.ring-main {
  stroke: #34edc3;
  stroke-linecap: round;
}

.ring-text {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  text-align: center;
}

.ring-text strong {
  color: #fff;
  font-size: 24px;
}

.structure-board {
  padding: 8px;
  border: 1px solid rgba(67, 183, 255, 0.18);
  border-radius: 8px;
  background: rgba(3, 18, 42, 0.44);
}

.structure-total {
  display: grid;
  place-items: center;
  min-height: 42px;
  margin-bottom: 7px;
  border-radius: 6px;
  background: radial-gradient(circle, rgba(67, 183, 255, 0.18), rgba(3, 18, 42, 0.38));
  border: 1px solid rgba(67, 183, 255, 0.2);
}

.structure-total strong {
  color: #fff;
  font-size: 22px;
}

.structure-total span {
  font-size: 12px;
}

.structure-board article {
  margin-bottom: 6px;
}

.structure-board article div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 12px;
}

.structure-board article b {
  color: #fff;
}

.structure-board article i {
  display: block;
  height: 7px;
  overflow: hidden;
  border-radius: 99px;
  background: rgba(12, 53, 93, 0.74);
}

.structure-board article em {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.center-stage {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(5, 24, 52, 0.68);
}

.stage-heading {
  flex-shrink: 0;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;
}

.stage-heading h2 {
  margin: 0;
  color: #fff;
  font-size: 26px;
  line-height: 1.15;
}

.stage-heading p {
  margin-top: 4px;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.direction-chips {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.direction-chips button {
  min-height: 28px;
  border: 1px solid rgba(67, 183, 255, 0.28);
  border-radius: 999px;
  background: rgba(3, 18, 42, 0.52);
  color: #a9ddff;
  padding: 0 14px;
  cursor: pointer;
  white-space: nowrap;
}

.direction-chips button.active {
  background: linear-gradient(180deg, rgba(42, 162, 255, 0.88), rgba(8, 70, 142, 0.86));
  border-color: rgba(118, 229, 255, 0.86);
  color: #fff;
  box-shadow: 0 0 16px rgba(67, 183, 255, 0.28);
}

.direction-chips {
  flex-shrink: 0;
  justify-content: flex-end;
  padding-bottom: 4px;
}

.stage-toolbar {
  flex-shrink: 0;
  justify-content: flex-start;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(67, 183, 255, 0.2);
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 520px;
}

.search-box input {
  width: 100%;
  min-height: 34px;
  border: 1px solid rgba(67, 183, 255, 0.34);
  border-radius: 6px;
  background: rgba(3, 18, 42, 0.88);
  color: #eaf8ff;
  padding: 0 38px 0 12px;
}

.search-box span {
  position: absolute;
  right: 12px;
  top: 7px;
  color: #72e7ff;
}

.detail-btn {
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid rgba(67, 183, 255, 0.38);
  border-radius: 6px;
  background: rgba(13, 58, 103, 0.72);
  color: #cbeeff;
  cursor: pointer;
}

.detail-btn {
  background: linear-gradient(180deg, rgba(42, 162, 255, 0.78), rgba(8, 70, 142, 0.82));
  color: #fff;
}

.member-board {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(188px, 1fr));
  grid-auto-rows: minmax(232px, auto);
  gap: 14px;
  padding: 2px 2px 0;
}

.member-tile {
  min-height: 232px;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
  cursor: pointer;
  overflow: hidden;
}

.member-tile.selected {
  border-color: rgba(114, 231, 255, 0.85) !important;
  box-shadow: 0 0 18px rgba(67, 183, 255, 0.24) !important;
}

.avatar-frame {
  position: relative;
  width: 100%;
  min-height: 92px;
  flex-shrink: 0;
  text-align: center;
  display: grid;
  place-items: center;
  border: 1px solid rgba(67, 183, 255, 0.18);
  border-radius: 7px;
  background:
    radial-gradient(circle at 50% 18%, rgba(67, 183, 255, 0.22), transparent 54%),
    linear-gradient(180deg, rgba(4, 30, 64, 0.56), rgba(1, 14, 34, 0.72));
}

.avatar-frame > span {
  width: 76px;
  height: 76px;
  display: grid;
  place-items: center;
  margin: 0 auto;
  border-radius: 50%;
  border: 1px solid rgba(67, 183, 255, 0.42);
  background: rgba(67, 183, 255, 0.1);
  font-size: 40px;
}

.avatar-frame i,
.dialog-card > span,
.achievement-list article > span {
  display: inline-flex;
  border-radius: 4px;
  padding: 2px 7px;
  font-size: 11px;
  font-style: normal;
  border: 1px solid rgba(67, 183, 255, 0.3);
}

.avatar-frame i {
  position: absolute;
  right: 8px;
  bottom: 8px;
}

.member-main {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.member-main h4 {
  color: #fff;
  font-size: 18px;
}

.member-main p {
  margin: 4px 0 9px;
  color: var(--color-text-secondary);
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag-row,
.keyword-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-row span,
.keyword-row span {
  border-radius: 4px;
  border: 1px solid rgba(67, 183, 255, 0.28);
  background: rgba(16, 77, 133, 0.45);
  color: #a9ddff;
  font-size: 11px;
  padding: 2px 6px;
}

.member-stats {
  margin-top: auto;
  justify-content: flex-start;
  gap: 14px;
  font-size: 12px;
  padding-top: 10px;
  border-top: 1px solid rgba(67, 183, 255, 0.14);
}

.member-stats b {
  color: #fff;
}

.radar-wrap {
  height: 180px;
}

.radar-wrap svg {
  width: 100%;
  height: 100%;
}

.radar-wrap line,
.radar-grid {
  fill: none;
  stroke: rgba(143, 181, 214, 0.24);
  stroke-width: 1;
}

.radar-area {
  fill: rgba(52, 237, 195, 0.18);
  stroke: #34edc3;
  stroke-width: 2;
}

.radar-wrap text {
  fill: #8fb5d6;
  font-size: 10px;
  text-anchor: middle;
}

.member-detail-page {
  height: calc(100vh - 121px);
  width: 100%;
  display: grid;
  grid-template-columns: 260px minmax(520px, 1fr) 270px;
  grid-template-rows: 30px minmax(0, 1fr) 112px;
  gap: 14px;
  padding: 14px 18px;
  overflow: hidden;
}

.detail-path {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.detail-path button {
  border: 0;
  background: transparent;
  color: #cbeeff;
  cursor: pointer;
}

.detail-profile,
.detail-main,
.detail-right,
.detail-bottom {
  min-height: 0;
  overflow: hidden;
}

.detail-profile {
  grid-row: 2 / 4;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
}

.portrait-card {
  position: relative;
  min-height: 172px;
  display: grid;
  justify-items: center;
  align-content: end;
  padding: 16px;
  border: 1px solid rgba(67, 183, 255, 0.22);
  border-radius: 8px;
  background:
    radial-gradient(circle at 50% 26%, rgba(67, 183, 255, 0.22), transparent 42%),
    linear-gradient(180deg, rgba(10, 44, 87, 0.62), rgba(4, 22, 48, 0.78));
}

.portrait-avatar {
  width: 84px;
  height: 84px;
  display: grid;
  place-items: center;
  margin-bottom: 10px;
  border-radius: 50%;
  border: 1px solid rgba(67, 183, 255, 0.38);
  background: rgba(67, 183, 255, 0.12);
  font-size: 46px;
}

.favorite-btn {
  position: absolute;
  right: 12px;
  top: 12px;
  width: 28px;
  height: 28px;
  border: 1px solid rgba(67, 183, 255, 0.34);
  border-radius: 6px;
  background: rgba(13, 58, 103, 0.72);
  color: #cbeeff;
  cursor: pointer;
}

.portrait-card h2 {
  margin: 0 0 4px;
  color: #fff;
  font-size: 22px;
}

.portrait-card > span,
.detail-list-card > span {
  display: inline-flex;
  border-radius: 4px;
  border: 1px solid rgba(67, 183, 255, 0.3);
  padding: 2px 8px;
  font-size: 11px;
}

.profile-facts {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
  font-size: 12px;
}

.profile-facts li {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(67, 183, 255, 0.14);
}

.profile-facts strong {
  max-width: 150px;
  text-align: right;
  color: #fff;
}

.skill-panel h4,
.right-panel h4,
.detail-bottom h4,
.intro-panel h4,
.radar-card h4,
.trajectory-block h4 {
  color: #eaf8ff;
  font-size: 14px;
  margin: 0 0 10px;
  padding-left: 8px;
  border-left: 2px solid #43b7ff;
}

.mascot-card {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
}

.mascot-figure {
  font-size: 42px;
}

.mascot-card strong {
  color: #fff;
}

.mascot-card p {
  margin-top: 4px;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.detail-main {
  padding: 0;
  display: flex;
  flex-direction: column;
}

.detail-tabs {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  min-height: 44px;
  border-bottom: 1px solid rgba(67, 183, 255, 0.22);
}

.detail-tabs button {
  border: 0;
  border-right: 1px solid rgba(67, 183, 255, 0.12);
  background: rgba(3, 18, 42, 0.46);
  color: #8fb5d6;
  cursor: pointer;
}

.detail-tabs button.active {
  color: #fff;
  background: rgba(42, 162, 255, 0.2);
  box-shadow: inset 0 -2px 0 #43b7ff;
}

.detail-main-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
}

.intro-panel p,
.detail-list-card p,
.empty-tip,
.timeline-mini p {
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.overview-detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
  gap: 14px;
  align-items: stretch;
}

.intro-panel {
  padding: 14px;
}

.core-data-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin: 14px 0;
}

.core-data-grid article {
  min-height: 78px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(67, 183, 255, 0.18);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
}

.core-data-grid strong {
  color: #fff;
  font-size: 24px;
}

.core-data-grid small {
  margin-left: 2px;
  font-size: 12px;
}

.radar-card {
  padding: 14px;
}

.overview-detail-grid .radar-card {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.overview-detail-grid .radar-wrap {
  flex: 1;
  min-height: 196px;
  max-height: 220px;
  width: min(100%, 240px);
  margin: 0 auto;
}

.detail-right {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.right-panel {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 12px;
}

.mini-project,
.timeline-mini,
.detail-list-card {
  position: relative;
  padding: 12px;
  margin-bottom: 10px;
  border: 1px solid rgba(67, 183, 255, 0.18);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
}

.mini-project strong,
.timeline-mini strong,
.detail-list-card strong,
.bottom-achievements strong {
  display: block;
  color: #fff;
  font-size: 13px;
}

.mini-project span,
.timeline-mini time {
  display: block;
  color: #72e7ff;
  font-size: 11px;
  margin-top: 4px;
}

.timeline-mini i {
  position: absolute;
  left: -4px;
  top: 18px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #43b7ff;
  box-shadow: 0 0 10px currentColor;
}

.timeline-mini i.green {
  background: #34edc3;
}

.timeline-mini i.orange {
  background: #ffae42;
}

.detail-list-card {
  display: flex;
  justify-content: space-between;
  gap: 14px;
}

.detail-bottom {
  grid-column: 2 / 4;
  padding: 10px 12px;
  overflow-y: auto;
}

.bottom-achievements {
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 12px;
  overflow: hidden;
}

.bottom-achievements article {
  min-height: 66px;
  padding: 10px;
  border: 1px solid rgba(67, 183, 255, 0.18);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
}

.bottom-achievements article > span {
  display: inline-flex;
  margin-bottom: 6px;
  border-radius: 4px;
  border: 1px solid rgba(67, 183, 255, 0.3);
  padding: 1px 6px;
  font-size: 10px;
}

.bottom-achievements small {
  display: block;
  margin-top: 4px;
  font-size: 11px;
}

.tab-stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 12px;
}

.tab-stat-grid article {
  min-height: 68px;
  display: grid;
  grid-template-columns: 48px 1fr;
  grid-template-rows: auto auto;
  align-items: center;
  column-gap: 10px;
  padding: 10px 12px;
  border: 1px solid rgba(67, 183, 255, 0.2);
  border-radius: 7px;
  background: linear-gradient(180deg, rgba(7, 41, 83, 0.72), rgba(3, 19, 43, 0.82));
}

.tab-stat-grid article i {
  grid-row: 1 / 3;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 7px;
  border: 1px solid rgba(67, 183, 255, 0.32);
  background: radial-gradient(circle, rgba(29, 158, 255, 0.42), rgba(5, 41, 91, 0.58));
  color: #6ee7ff;
  font-style: normal;
  font-size: 22px;
  box-shadow: inset 0 0 14px rgba(67, 183, 255, 0.18);
}

.tab-stat-grid article span {
  color: #b9def5;
  font-size: 12px;
}

.tab-stat-grid article strong {
  color: #fff;
  font-size: 22px;
  line-height: 1;
}

.tab-stat-grid article small {
  margin-left: 4px;
  font-size: 12px;
}

.tab-stat-grid article p {
  grid-column: 2;
  color: #789ebe;
  font-size: 10px;
}

.award-stat-grid article.gold {
  background: linear-gradient(120deg, rgba(255, 174, 66, 0.18), rgba(5, 31, 67, 0.8));
  border-color: rgba(255, 174, 66, 0.38);
}

.tab-section-head {
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.tab-section-head h4 {
  margin: 0;
  color: #fff;
  font-size: 14px;
}

.mini-filters {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8fb5d6;
  font-size: 11px;
}

.mini-filters span {
  min-height: 24px;
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(67, 183, 255, 0.22);
  border-radius: 4px;
  background: rgba(4, 30, 64, 0.64);
  padding: 0 9px;
}

.mini-filters .active {
  color: #fff;
  background: rgba(42, 162, 255, 0.54);
  border-color: rgba(118, 229, 255, 0.66);
}

.project-list-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.project-wide-row {
  min-height: 72px;
  display: grid;
  grid-template-columns: 44px 1fr 110px 62px;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid rgba(67, 183, 255, 0.17);
  border-radius: 7px;
  background: rgba(6, 33, 69, 0.5);
}

.row-icon,
.patent-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 7px;
  background: rgba(19, 106, 194, 0.42);
  color: #22c7ff;
  font-weight: 900;
  box-shadow: inset 0 0 14px rgba(67, 183, 255, 0.18);
}

.row-title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.row-title strong,
.award-show-card strong,
.paper-table-list strong,
.patent-card-grid strong,
.growth-roadmap strong {
  color: #fff;
  font-size: 13px;
}

.project-wide-row p,
.award-show-card small,
.paper-table-list p,
.paper-table-list span,
.patent-card-grid p,
.patent-card-grid small,
.growth-roadmap p,
.growth-roadmap li {
  color: var(--color-text-secondary);
  font-size: 11px;
  line-height: 1.45;
}

.project-wide-row time {
  color: #a7c9e4;
  font-size: 11px;
}

.project-wide-row i {
  display: block;
  width: min(92%, 370px);
  height: 5px;
  margin-top: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(8, 47, 87, 0.86);
}

.project-wide-row em {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #2ee6ff, #3d8cff);
  box-shadow: 0 0 12px rgba(45, 178, 255, 0.42);
}

.award-card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px;
  margin-top: 6px;
}

.award-show-card {
  min-height: 94px;
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 10px;
  padding: 10px;
  border: 1px solid rgba(67, 183, 255, 0.2);
  border-radius: 7px;
  background: rgba(5, 31, 67, 0.58);
}

.award-trophy {
  width: 52px;
  height: 64px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: radial-gradient(circle, rgba(255, 174, 66, 0.38), rgba(4, 24, 52, 0.72));
  font-size: 30px;
}

.award-show-card p {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 7px 0 5px;
}

.award-show-card b {
  float: right;
  color: #a7c9e4;
  font-weight: 500 !important;
}

.award-bottom-grid {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 10px;
  margin-top: 10px;
}

.chart-mini-card {
  min-height: 112px;
  padding: 10px 12px;
  border: 1px solid rgba(67, 183, 255, 0.18);
  border-radius: 7px;
  background: rgba(4, 25, 55, 0.56);
}

.chart-mini-card h4 {
  margin: 0 0 8px;
  color: #fff;
  font-size: 13px;
}

.mini-donut {
  position: relative;
  width: 104px;
  height: 104px;
  margin: 0 auto;
}

.mini-donut svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.donut-bg,
.donut-a,
.donut-b,
.donut-c {
  fill: none;
  stroke-width: 16;
}

.donut-bg {
  stroke: rgba(255, 255, 255, 0.06);
}

.donut-a {
  stroke: #1f80ff;
}

.donut-b {
  stroke: #6d4dff;
}

.donut-c {
  stroke: #22d3c4;
}

.mini-donut strong {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  text-align: center;
  color: #fff;
  font-size: 22px;
}

.mini-donut small {
  display: block;
  color: #8fb5d6;
  font-size: 10px;
}

.trend-svg {
  width: 100%;
  height: 112px;
}

.trend-svg polyline,
.growth-lines polyline {
  fill: none;
  stroke: #1f80ff;
  stroke-width: 3;
  filter: drop-shadow(0 0 6px rgba(31, 128, 255, 0.65));
}

.trend-svg circle {
  fill: #20d7ff;
  stroke: #fff;
  stroke-width: 1;
}

.trend-svg text,
.growth-lines text {
  fill: #9fc3df;
  font-size: 11px;
  text-anchor: middle;
}

.paper-table-list {
  border: 1px solid rgba(67, 183, 255, 0.18);
  border-radius: 7px;
  overflow: hidden;
}

.paper-table-list article {
  min-height: 40px;
  display: grid;
  grid-template-columns: 24px 1.25fr 1fr 72px;
  align-items: center;
  gap: 10px;
  padding: 7px 10px;
  border-bottom: 1px solid rgba(67, 183, 255, 0.14);
  background: rgba(5, 28, 57, 0.42);
}

.paper-table-list article:last-child {
  border-bottom: 0;
}

.paper-table-list b {
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
  border-radius: 5px;
  background: rgba(42, 162, 255, 0.46);
  color: #fff;
  font-size: 11px;
}

.paper-table-list time {
  margin-left: 10px;
  color: #8fb5d6;
}

.paper-table-list em {
  justify-self: end;
  font-style: normal;
}

.paper-bottom-grid {
  display: grid;
  grid-template-columns: 1fr 0.82fr 0.9fr;
  gap: 10px;
  margin-top: 10px;
}

.direction-bars-detail article {
  display: grid;
  grid-template-columns: 92px 1fr 38px;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #9fc3df;
  font-size: 11px;
}

.direction-bars-detail i {
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(12, 53, 93, 0.74);
}

.direction-bars-detail em {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #34edc3, #1f80ff);
}

.keyword-panel div {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword-panel span {
  border: 1px solid rgba(67, 183, 255, 0.25);
  border-radius: 4px;
  background: rgba(16, 77, 133, 0.45);
  color: #a9ddff;
  font-size: 11px;
  padding: 4px 8px;
}

.patent-card-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}

.patent-card-grid article {
  min-height: 70px;
  display: grid;
  grid-template-columns: 44px 1fr 16px;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid rgba(67, 183, 255, 0.18);
  border-radius: 7px;
  background: rgba(5, 31, 67, 0.54);
}

.patent-card-grid article > b {
  color: #8fb5d6;
  font-size: 22px;
}

.patent-card-grid p {
  margin: 4px 0;
}

.patent-card-grid p span {
  margin-left: 8px;
}

.ip-timeline {
  margin-top: 10px;
}

.ip-line {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  padding-top: 28px;
}

.ip-line::before {
  content: "";
  position: absolute;
  left: 4%;
  right: 4%;
  top: 42px;
  height: 2px;
  background: linear-gradient(90deg, #1f80ff, #1f80ff 78%, transparent);
  border-top: 1px dashed rgba(67, 183, 255, 0.34);
}

.ip-line article {
  position: relative;
  z-index: 1;
  text-align: center;
}

.ip-line i {
  width: 15px;
  height: 15px;
  display: block;
  margin: 0 auto 10px;
  border-radius: 50%;
  border: 2px solid #1f80ff;
  background: #03101f;
  box-shadow: 0 0 14px rgba(31, 128, 255, 0.7);
}

.ip-line strong,
.ip-line span,
.ip-line small {
  display: block;
}

.ip-line strong {
  color: #fff;
}

.ip-line span {
  color: #9fc3df;
  font-size: 11px;
}

.growth-roadmap {
  padding: 10px 12px;
  border: 1px solid rgba(67, 183, 255, 0.18);
  border-radius: 7px;
  background: rgba(4, 25, 55, 0.5);
}

.growth-roadmap h4 {
  margin: 0 0 8px;
  color: #fff;
  font-size: 14px;
}

.road-years {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  margin-bottom: 8px;
  color: #d9f3ff;
  font-weight: 800;
  text-align: center;
}

.road-years span {
  position: relative;
}

.road-years span::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -10px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #67d7ff;
  box-shadow: 0 0 12px #1f80ff;
}

.road-card-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  padding-top: 12px;
}

.road-card-row article {
  min-height: 166px;
  padding: 12px 10px 10px;
  border: 1px solid rgba(67, 183, 255, 0.22);
  border-radius: 7px;
  background: linear-gradient(180deg, rgba(7, 42, 83, 0.62), rgba(3, 20, 45, 0.74));
}

.road-card-row i {
  display: block;
  color: #39c7ff;
  font-style: normal;
  font-size: 28px;
  text-align: center;
  margin-bottom: 6px;
}

.road-card-row ul {
  margin: 8px 0 0;
  padding-left: 14px;
}

.road-card-row article > span {
  display: block;
  margin-top: 8px;
  border-radius: 4px;
  background: rgba(67, 183, 255, 0.14);
  color: #b8dcf6;
  font-size: 11px;
  text-align: center;
  padding: 3px 6px;
}

.growth-bottom-grid {
  display: grid;
  grid-template-columns: 1fr 0.78fr;
  gap: 10px;
  margin-top: 10px;
}

.growth-lines svg {
  width: 100%;
  height: 120px;
}

.growth-lines .line-a {
  stroke: #22d3ee;
}

.growth-lines .line-b {
  stroke: #34edc3;
}

.growth-lines .line-c {
  stroke: #8b5cf6;
}

@media (max-width: 1180px) {
  .members-hall-container {
    grid-template-columns: 260px 1fr;
  }

  .stage-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .direction-chips {
    justify-content: flex-start;
  }

  .member-detail-page {
    grid-template-columns: 240px 1fr;
    grid-template-rows: 30px minmax(0, 1fr) 112px;
  }

  .detail-right {
    display: none;
  }

  .detail-bottom {
    grid-column: 2 / 3;
  }
}
</style>
