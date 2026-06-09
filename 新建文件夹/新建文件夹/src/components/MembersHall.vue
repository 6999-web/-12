<template>
  <div class="members-hall-container">
    <!-- Back Button for Detail View -->
    <div v-if="selectedMember" class="detail-header-nav font-num">
      <button class="btn-back" @click="selectedMember = null">
        ← 返回成员大厅
      </button>
      <span class="nav-path">成员大厅 / {{ selectedMember.name }} 的成长档案</span>
    </div>

    <!-- 1. MEMBER LIST VIEW -->
    <div v-if="!selectedMember" class="main-members-view">
      <!-- Left Sidebar: Statistics & Graphs -->
      <aside class="left-sidebar">
        <!-- 成员概览 -->
        <section class="sidebar-section glass-panel">
          <div class="section-header">
            <h3>成员概览</h3>
          </div>
          <div class="section-body overview-grid font-num">
            <div class="overview-card">
              <span class="label">成员总数</span>
              <span class="num">34 <small>人</small></span>
            </div>
            <div class="overview-card">
              <span class="label">导师团队</span>
              <span class="num">2 <small>人</small></span>
            </div>
            <div class="overview-card">
              <span class="label">研究生</span>
              <span class="num">8 <small>人</small></span>
            </div>
            <div class="overview-card">
              <span class="label">本科生</span>
              <span class="num">24 <small>人</small></span>
            </div>
          </div>
        </section>

        <!-- 成员结构分布 -->
        <section class="sidebar-section glass-panel">
          <div class="section-header">
            <h3>成员结构分布</h3>
          </div>
          <div class="section-body chart-container font-num">
            <!-- SVG Pie/Donut Chart -->
            <div class="svg-chart-wrapper">
              <svg viewBox="0 0 100 100" class="donut-svg">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" stroke-width="12"></circle>
                <!-- Undergraduate: 24/34 = 70.6% -->
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--status-online)" stroke-width="12" stroke-dasharray="177.3 251.2" stroke-dashoffset="0" transform="rotate(-90 50 50)"></circle>
                <!-- Graduate: 8/34 = 23.5% -->
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--status-info)" stroke-width="12" stroke-dasharray="59.1 251.2" stroke-dashoffset="-177.3" transform="rotate(-90 50 50)"></circle>
                <!-- Mentors: 2/34 = 5.9% -->
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--status-busy)" stroke-width="12" stroke-dasharray="14.8 251.2" stroke-dashoffset="-236.4" transform="rotate(-90 50 50)"></circle>
              </svg>
              <div class="donut-center-text">
                <span class="title">学生占比</span>
                <span class="val">94.1%</span>
              </div>
            </div>
            <div class="donut-legend">
              <div class="legend-item"><span class="bullet green"></span> 本科生: 24人 <span class="pct">70.6%</span></div>
              <div class="legend-item"><span class="bullet blue"></span> 研究生: 8人 <span class="pct">23.5%</span></div>
              <div class="legend-item"><span class="bullet orange"></span> 导师团: 2人 <span class="pct">5.9%</span></div>
            </div>
          </div>
        </section>

        <!-- 研究方向分布 -->
        <section class="sidebar-section glass-panel">
          <div class="section-header">
            <h3>研究方向分布</h3>
          </div>
          <div class="section-body direction-list font-num">
            <div class="direction-bar-item" v-for="dir in directionStats" :key="dir.name">
              <div class="lbl-row">
                <span>{{ dir.name }}</span>
                <span>{{ dir.count }}人</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-fill" :style="{ width: (dir.count / 10 * 100) + '%', backgroundColor: dir.color }"></div>
              </div>
            </div>
          </div>
        </section>
      </aside>

      <!-- Center & Right: Filtering and Members Cards -->
      <main class="members-grid-container glass-panel">
        <!-- Top Filters & Search -->
        <div class="filter-top-bar font-num">
          <div class="filter-group">
            <span class="filter-label">身份筛选:</span>
            <button 
              v-for="role in roleFilters" 
              :key="role.value" 
              class="filter-btn" 
              :class="{ active: selectedRole === role.value }"
              @click="selectedRole = role.value"
            >
              {{ role.label }}
            </button>
          </div>
          <div class="filter-group">
            <span class="filter-label">研究方向:</span>
            <button 
              v-for="dir in directionFilters" 
              :key="dir.value" 
              class="filter-btn" 
              :class="{ active: selectedDirection === dir.value }"
              @click="selectedDirection = dir.value"
            >
              {{ dir.label }}
            </button>
          </div>
          <div class="search-box">
            <input type="text" v-model="searchQuery" placeholder="搜索成员姓名/技能..." />
            <span class="search-icon">🔍</span>
          </div>
        </div>

        <!-- Cards Scrollable Area -->
        <div class="members-cards-scroll">
          <div class="members-grid">
            <div 
              v-for="member in filteredMembers" 
              :key="member.id" 
              class="member-card glass-panel clickable"
              @click="selectedMember = member"
            >
              <div class="avatar-box">
                <span class="avatar-placeholder">{{ member.avatar }}</span>
                <span class="role-tag" :class="member.roleClass">{{ member.role }}</span>
              </div>
              <div class="member-meta font-num">
                <h3 class="name">{{ member.name }}</h3>
                <p class="grade">{{ member.grade }} · {{ member.major }}</p>
                <div class="directions-tags">
                  <span class="tag" v-for="t in member.tags" :key="t">{{ t }}</span>
                </div>
                <div class="stats-row">
                  <div class="stat-item">📁 项目: <strong>{{ member.projectsCount }}</strong></div>
                  <div class="stat-item">🏆 获奖: <strong>{{ member.awardsCount }}</strong></div>
                  <div class="stat-item">📄 论文: <strong>{{ member.papersCount }}</strong></div>
                </div>
              </div>
              <div class="hover-overlay">
                <span>查看成长档案 →</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- 2. MEMBER DETAILS VIEW -->
    <div v-else class="member-details-view">
      <!-- Left Panel: Base Profile Card -->
      <aside class="details-left-panel glass-panel font-num">
        <div class="profile-card">
          <div class="avatar-large">{{ selectedMember.avatar }}</div>
          <h2 class="name">{{ selectedMember.name }}</h2>
          <span class="role-badge" :class="selectedMember.roleClass">{{ selectedMember.role }}</span>
          <p class="grade">{{ selectedMember.grade }}</p>
        </div>

        <ul class="info-list">
          <li>
            <span class="lbl">专业班级:</span>
            <span class="val">{{ selectedMember.major }}</span>
          </li>
          <li>
            <span class="lbl">入室时间:</span>
            <span class="val">{{ selectedMember.joinTime }}</span>
          </li>
          <li>
            <span class="lbl">研究方向:</span>
            <span class="val">{{ selectedMember.primaryDirection }}</span>
          </li>
        </ul>

        <div class="skills-section">
          <h4>技能标签</h4>
          <div class="skills-tags">
            <span class="skill-tag" v-for="s in selectedMember.skills" :key="s">{{ s }}</span>
          </div>
        </div>

        <!-- Mascot Advice Card -->
        <div class="mascot-advice-card glass-panel font-num">
          <div class="mascot-header">
            <span class="mascot-icon">🐱</span>
            <h5>智小喵小贴士</h5>
          </div>
          <p class="advice-txt">
            该成员在“{{ selectedMember.primaryDirection }}”方向表现突出，近半年项目进展顺利，具备优秀的团队协作能力。
          </p>
        </div>
      </aside>

      <!-- Middle Panel: Subpages with Subtabs -->
      <main class="details-middle-panel glass-panel">
        <!-- Subtabs Header -->
        <div class="subtabs-header font-num">
          <button 
            v-for="tab in subTabs" 
            :key="tab.id" 
            class="subtab-btn" 
            :class="{ active: activeSubTab === tab.id }"
            @click="activeSubTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="subtab-content-scroll scroll-container">
          <!-- 2a. 个人总览 -->
          <div v-if="activeSubTab === 'general'" class="tab-pane-general">
            <section class="section-intro font-num">
              <h4>个人简介</h4>
              <p class="bio-text">{{ selectedMember.bio }}</p>
            </section>

            <!-- Stats grid -->
            <div class="stats-cards-grid font-num">
              <div class="stat-card" v-for="stat in memberStatsCards" :key="stat.label">
                <span class="icon">{{ stat.icon }}</span>
                <div class="txt">
                  <span class="val">{{ stat.val }}</span>
                  <span class="lbl">{{ stat.label }}</span>
                </div>
              </div>
            </div>

            <!-- Radar & AI Summary -->
            <div class="radar-ai-row">
              <!-- Capability Radar Chart (SVG representation) -->
              <div class="radar-card glass-panel font-num">
                <h4>能力雷达图</h4>
                <div class="svg-radar-wrapper">
                  <svg viewBox="0 0 120 120" class="radar-svg">
                    <!-- Web circles -->
                    <circle cx="60" cy="60" r="50" class="grid-line" />
                    <circle cx="60" cy="60" r="37.5" class="grid-line" />
                    <circle cx="60" cy="60" r="25" class="grid-line" />
                    <circle cx="60" cy="60" r="12.5" class="grid-line" />
                    
                    <!-- Web lines (axes) -->
                    <!-- Axes: 1. CV/AI, 2. Hardware, 3. Coding, 4. Research, 5. Project Management -->
                    <line x1="60" y1="10" x2="60" y2="110" class="grid-line" />
                    <line x1="12" y1="42.5" x2="108" y2="77.5" class="grid-line" />
                    <line x1="12" y1="77.5" x2="108" y2="42.5" class="grid-line" />
                    
                    <!-- Capability Polygon (custom values depending on member) -->
                    <polygon :points="getRadarPoints" class="radar-poly" />
                    <polygon :points="getRadarPoints" class="radar-poly-dots" />
                    
                    <!-- Labels -->
                    <text x="60" y="8" class="radar-text text-anchor-middle">算法研究</text>
                    <text x="110" y="45" class="radar-text text-anchor-start">工程编码</text>
                    <text x="105" y="90" class="radar-text text-anchor-start">项目管理</text>
                    <text x="15" y="90" class="radar-text text-anchor-end">学术素养</text>
                    <text x="10" y="45" class="radar-text text-anchor-end">硬件设计</text>
                  </svg>
                </div>
              </div>

              <!-- AI 小喵总结 -->
              <div class="ai-summary-card glass-panel font-num">
                <h4>🐱 智能画像分析 (小喵总结)</h4>
                <p class="summary-para">{{ selectedMember.aiSummary }}</p>
                <div class="keywords-row">
                  <span class="kw" v-for="kw in selectedMember.aiKeywords" :key="kw"># {{ kw }}</span>
                </div>
              </div>
            </div>

            <!-- Associated Achievements -->
            <section class="section-assoc-achievements font-num">
              <h4>关联成果 (最新沉淀)</h4>
              <div class="assoc-achievements-list">
                <div class="assoc-card glass-panel" v-for="ach in selectedMember.assocAchievements" :key="ach.title">
                  <span class="badge" :class="ach.typeClass">{{ ach.type }}</span>
                  <h5 class="title">{{ ach.title }}</h5>
                  <p class="meta">{{ ach.date }} · {{ ach.detail }}</p>
                </div>
              </div>
            </section>
          </div>

          <!-- 2b. 参与项目 -->
          <div v-else-if="activeSubTab === 'projects'" class="tab-pane-projects font-num">
            <div class="projects-list">
              <div class="detail-project-card glass-panel" v-for="proj in selectedMember.detailedProjects" :key="proj.title">
                <div class="card-header">
                  <h4>{{ proj.title }}</h4>
                  <span class="state-badge" :class="proj.stateClass">{{ proj.state }}</span>
                </div>
                <p class="desc">{{ proj.desc }}</p>
                <div class="meta-row">
                  <span>角色: <strong>{{ proj.role }}</strong></span>
                  <span>起止时间: <strong>{{ proj.duration }}</strong></span>
                </div>
                <div class="achievements-row" v-if="proj.achievements && proj.achievements.length">
                  <span class="ach-lbl">贡献成果:</span>
                  <span class="ach-tag" v-for="ac in proj.achievements" :key="ac">📄 {{ ac }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 2c. 获奖成果 -->
          <div v-else-if="activeSubTab === 'awards'" class="tab-pane-awards font-num">
            <div class="awards-summary-cards">
              <div class="award-sum-c">
                <span class="icon font-num">🏆</span>
                <div class="info">
                  <span class="val">{{ selectedMember.awardsCount }} 个</span>
                  <span class="lbl">获奖总数</span>
                </div>
              </div>
              <div class="award-sum-c">
                <span class="icon font-num">🥇</span>
                <div class="info">
                  <span class="val">{{ selectedMember.nationalAwardsCount }} 项</span>
                  <span class="lbl">国家级/省部级</span>
                </div>
              </div>
            </div>

            <div class="awards-detail-list">
              <div class="award-detail-card glass-panel" v-for="aw in selectedMember.detailedAwards" :key="aw.name">
                <div class="trophy-box">🏆</div>
                <div class="txt">
                  <h4>{{ aw.name }}</h4>
                  <p class="lvl">{{ aw.level }} · 主办方: {{ aw.host }}</p>
                  <p class="role">成员角色: <strong>{{ aw.role }}</strong> · 指导教师: {{ aw.mentor }}</p>
                </div>
                <span class="date font-num">{{ aw.date }}</span>
              </div>
            </div>

            <!-- Award distribution charts -->
            <div class="awards-charts-row">
              <div class="chart-box glass-panel">
                <h4>获奖年度轨迹</h4>
                <div class="chart-bar-mock">
                  <div class="col" v-for="d in selectedMember.awardTrend" :key="d.year">
                    <div class="bar-fill" :style="{ height: (d.count / 3 * 100) + '%' }">
                      <span class="tip font-num">{{ d.count }}</span>
                    </div>
                    <span class="lbl font-num">{{ d.year }}年</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2d. 论文成果 -->
          <div v-else-if="activeSubTab === 'papers'" class="tab-pane-papers font-num">
            <div class="papers-summary-cards">
              <div class="paper-sum-c">
                <span class="val">{{ selectedMember.papersCount }} 篇</span>
                <span class="lbl">论文总量</span>
              </div>
              <div class="paper-sum-c">
                <span class="val">{{ selectedMember.sciPapersCount || 0 }} 篇</span>
                <span class="lbl">SCI / EI 收录</span>
              </div>
              <div class="paper-sum-c">
                <span class="val">{{ selectedMember.citationsCount || 0 }} 次</span>
                <span class="lbl">累计被引用</span>
              </div>
            </div>

            <div class="papers-list">
              <div class="paper-card glass-panel" v-for="p in selectedMember.detailedPapers" :key="p.title">
                <div class="paper-index font-num">📄</div>
                <div class="paper-main">
                  <h4>{{ p.title }}</h4>
                  <p class="authors">作者: {{ p.authors }} ({{ p.role }})</p>
                  <p class="journal">发表期刊/会议: <strong>{{ p.journal }}</strong> ({{ p.date }})</p>
                  <p class="details">收录情况: <span class="tag-sci">{{ p.indexed }}</span> · 引用数: <strong class="text-highlight">{{ p.citations }}</strong> · 影响因子: {{ p.if }}</p>
                </div>
              </div>
            </div>

            <!-- Paper topic keywords -->
            <div class="paper-topics-row">
              <div class="chart-box glass-panel">
                <h4>热门关键词云</h4>
                <div class="tag-cloud">
                  <span class="cloud-tag size-3">深度学习</span>
                  <span class="cloud-tag size-2">多模态融合</span>
                  <span class="cloud-tag size-2">三维目标检测</span>
                  <span class="cloud-tag size-1">物联网监控</span>
                  <span class="cloud-tag size-3">AIGC生成</span>
                  <span class="cloud-tag size-1">自注意力机制</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 2e. 产权成果 -->
          <div v-else-if="activeSubTab === 'patents'" class="tab-pane-patents font-num">
            <div class="patents-summary-cards">
              <div class="pat-sum-c">
                <span class="val">{{ selectedMember.patentsCount }} 项</span>
                <span class="lbl">产权总数</span>
              </div>
              <div class="pat-sum-c">
                <span class="val">{{ selectedMember.authPatentsCount || 0 }} 项</span>
                <span class="lbl">已授权 / 已登记</span>
              </div>
              <div class="pat-sum-c">
                <span class="val">{{ selectedMember.pendingPatentsCount || 0 }} 项</span>
                <span class="lbl">流程申请中</span>
              </div>
            </div>

            <div class="patents-table-wrapper">
              <table class="patents-table">
                <thead>
                  <tr>
                    <th>名称</th>
                    <th>类型</th>
                    <th>编号/登记号</th>
                    <th>状态</th>
                    <th>申请日期</th>
                    <th>角色</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="pat in selectedMember.detailedPatents" :key="pat.name">
                    <td class="text-highlight">{{ pat.name }}</td>
                    <td>{{ pat.type }}</td>
                    <td>{{ pat.code }}</td>
                    <td>
                      <span class="status-tag" :class="pat.statusClass">{{ pat.status }}</span>
                    </td>
                    <td>{{ pat.date }}</td>
                    <td><strong>{{ pat.role }}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Patent registration history timeline -->
            <div class="patent-history-timeline-section">
              <h4>知识产权成长时间轴</h4>
              <div class="patent-timeline">
                <div class="timeline-step" v-for="step in selectedMember.patentTimeline" :key="step.title">
                  <div class="dot" :class="step.class"></div>
                  <div class="content">
                    <span class="date">{{ step.date }}</span>
                    <h5>{{ step.title }}</h5>
                    <p>{{ step.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2f. 成长轨迹 -->
          <div v-else-if="activeSubTab === 'trajectory'" class="tab-pane-trajectory font-num">
            <div class="milestones-overview">
              <div class="milestone-c">
                <span class="title">成长阶段</span>
                <span class="num">3 <small>个</small></span>
              </div>
              <div class="milestone-c">
                <span class="title">关键里程碑</span>
                <span class="num">6 <small>次</small></span>
              </div>
            </div>

            <div class="vertical-trajectory-timeline">
              <div class="trajectory-year-block" v-for="block in selectedMember.detailedTrajectory" :key="block.year">
                <div class="year-header">{{ block.year }} 年</div>
                <div class="events-list">
                  <div class="traj-event-item" v-for="evt in block.events" :key="evt.title">
                    <div class="timeline-node"></div>
                    <div class="event-body glass-panel">
                      <span class="date">{{ evt.date }}</span>
                      <h5>{{ evt.title }}</h5>
                      <p>{{ evt.desc }}</p>
                      <div class="skills-learned" v-if="evt.skills && evt.skills.length">
                        <span class="s-tag" v-for="sk in evt.skills" :key="sk">{{ sk }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Right Panel: Representatives & Quick trajectory preview -->
      <aside class="details-right-panel glass-panel font-num">
        <!-- 代表项目 -->
        <section class="right-section">
          <h4>代表性项目</h4>
          <div class="rep-projects-list">
            <div class="rep-project-card glass-panel" v-for="proj in selectedMember.repProjects" :key="proj.title">
              <h5>{{ proj.title }}</h5>
              <p class="role">角色: {{ proj.role }}</p>
              <div class="progress-bar-container">
                <div class="progress-fill" :style="{ width: proj.progress + '%' }"></div>
              </div>
              <span class="pct">{{ proj.progress }}% 已完成</span>
            </div>
          </div>
        </section>

        <!-- 关键里程碑时间线 -->
        <section class="right-section scroll-y-section">
          <h4>关键成长轨迹</h4>
          <div class="milestones-timeline-simple">
            <div class="timeline-item" v-for="mil in selectedMember.milestones" :key="mil.title">
              <span class="date">{{ mil.date }}</span>
              <span class="bullet" :class="mil.class"></span>
              <span class="title">{{ mil.title }}</span>
              <p class="desc">{{ mil.desc }}</p>
            </div>
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const selectedMember = ref(null);
const searchQuery = ref('');
const selectedRole = ref('all');
const selectedDirection = ref('all');
const activeSubTab = ref('general');

const subTabs = [
  { id: 'general', label: '个人总览' },
  { id: 'projects', label: '参与项目' },
  { id: 'awards', label: '获奖成果' },
  { id: 'papers', label: '论文成果' },
  { id: 'patents', label: '产权成果' },
  { id: 'trajectory', label: '成长轨迹' }
];

const roleFilters = [
  { label: '全部身份', value: 'all' },
  { label: '导师团队', value: 'advisor' },
  { label: '研究生', value: 'graduate' },
  { label: '本科生', value: 'undergrad' }
];

const directionFilters = [
  { label: '全部方向', value: 'all' },
  { label: 'AI教育', value: 'AI教育' },
  { label: '智能硬件', value: '智能硬件' },
  { label: '计算机视觉', value: '计算机视觉' },
  { label: '数据治理', value: '数据治理' },
  { label: 'AIGC应用', value: 'AIGC应用' }
];

const directionStats = [
  { name: '计算机视觉', count: 9, color: 'var(--status-online)' },
  { name: 'AI教育', count: 7, color: 'var(--status-info)' },
  { name: 'AIGC应用', count: 6, color: 'var(--status-purple)' },
  { name: '智能硬件', count: 6, color: 'var(--status-busy)' },
  { name: '数据治理', count: 6, color: 'var(--status-alert)' }
];

const buildMemberProfile = (profile) => {
  const directionName = profile.primaryDirection.split(' / ')[0];
  const projectTitle = profile.projectTitle || `${directionName}实验项目`;
  const patentTitle = profile.patentTitle || `${profile.name}参与的实验室智能系统软件`;
  const paperTitle = profile.paperTitle || `${directionName}方向实验室应用研究`;

  return {
    ...profile,
    sciPapersCount: profile.sciPapersCount ?? Math.min(profile.papersCount, 1),
    citationsCount: profile.citationsCount ?? profile.papersCount * 6,
    authPatentsCount: profile.authPatentsCount ?? Math.max(0, profile.patentsCount - 1),
    pendingPatentsCount: profile.pendingPatentsCount ?? Math.min(profile.patentsCount, 1),
    nationalAwardsCount: profile.nationalAwardsCount ?? Math.min(profile.awardsCount, 1),
    assocAchievements: profile.assocAchievements ?? [
      { type: '项目成果', typeClass: 'blue-tag', title: projectTitle, date: '2026-04', detail: profile.projectRole || '核心成员' },
      { type: '竞赛奖项', typeClass: 'orange-tag', title: profile.awardName || '实验室创新实践优秀成员', date: '2025-12', detail: '校级/省级奖项' }
    ],
    repProjects: profile.repProjects ?? [
      { title: projectTitle, role: profile.projectRole || '核心成员', progress: profile.projectProgress ?? 76 }
    ],
    milestones: profile.milestones ?? [
      { date: '2026-04', class: 'green', title: '阶段成果汇报', desc: `完成${projectTitle}阶段汇报，推动成果进入展示准备。` },
      { date: '2025-09', class: 'blue', title: '加入专项组', desc: `进入${directionName}方向专项组，承担关键模块研发。` },
      { date: profile.joinTime, class: 'orange', title: '加入实验室', desc: '通过实验室选拔，开始参与空间数字化与科研训练。' }
    ],
    detailedProjects: profile.detailedProjects ?? [
      {
        title: projectTitle,
        state: '推进中',
        stateClass: 'orange-tag',
        role: profile.projectRole || '核心成员',
        duration: '2025-09 至今',
        desc: profile.projectDesc || `围绕${profile.primaryDirection}开展原型设计、数据采集、模型验证与应用展示，服务实验室重点建设任务。`,
        achievements: profile.projectAchievements || ['阶段汇报1项']
      }
    ],
    detailedAwards: profile.detailedAwards ?? [
      { name: profile.awardName || '实验室创新实践优秀成员', level: '校级/省级', host: '智能实验室', role: profile.projectRole || '核心成员', mentor: '李明阳', date: '2025-12' }
    ],
    awardTrend: profile.awardTrend ?? [
      { year: '2024', count: Math.max(0, profile.awardsCount - 1) },
      { year: '2025', count: Math.min(profile.awardsCount, 2) }
    ],
    detailedPapers: profile.detailedPapers ?? (profile.papersCount > 0 ? [
      { title: paperTitle, authors: `${profile.name}, 李明阳`, role: '主要作者', journal: '智能实验室技术报告', date: '2026-03', indexed: '内部/会议', citations: profile.citationsCount ?? profile.papersCount * 6, if: '-' }
    ] : []),
    detailedPatents: profile.detailedPatents ?? (profile.patentsCount > 0 ? [
      { name: patentTitle, type: '软件著作权', code: `2026SR${String(10000 + profile.id * 137)}`, status: '申报中', statusClass: 'blue-tag', date: '2026-04-18', role: '参与人' }
    ] : []),
    patentTimeline: profile.patentTimeline ?? [
      { date: '2026-04', class: 'blue', title: '成果材料整理', desc: `${patentTitle}进入材料整理与申报准备阶段。` }
    ],
    detailedTrajectory: profile.detailedTrajectory ?? [
      {
        year: 2026,
        events: [
          { date: '2026-04', title: '完成阶段验收', desc: `负责${projectTitle}关键任务，通过组内阶段验收。`, skills: profile.skills.slice(0, 2) }
        ]
      },
      {
        year: 2025,
        events: [
          { date: '2025-09', title: '加入实验室专项训练', desc: `系统学习${directionName}方向工具链。`, skills: profile.skills.slice(2, 4) }
        ]
      }
    ]
  };
};

// Mock database for members
const members = [
  {
    id: 1,
    name: '李明阳',
    avatar: '👨‍🏫',
    role: '导师',
    roleValue: 'advisor',
    roleClass: 'orange',
    grade: '指导教师',
    major: '物联网与人工智能实验室',
    joinTime: '2023-09',
    primaryDirection: '计算机视觉 / 深度学习',
    tags: ['科研导师', '项目主管', '多模态'],
    skills: ['PyTorch', 'TensorFlow', 'OpenCV', '学术写作', '项目管理', '深度学习模型压缩'],
    bio: '副教授，智能实验室学术总负责人。主要研究方向为计算机视觉、边缘计算和智能装备开发。指导学生多次获得全国一等奖、二等奖，在国内外高水平期刊发表学术论文20余篇。',
    projectsCount: 8,
    awardsCount: 12,
    papersCount: 15,
    sciPapersCount: 10,
    citationsCount: 240,
    patentsCount: 6,
    authPatentsCount: 4,
    pendingPatentsCount: 2,
    nationalAwardsCount: 6,
    
    // Radar values: [AI, Coding, Management, Academic, Hardware]
    radar: [95, 85, 90, 95, 80],
    
    aiSummary: '李明阳导师作为数字中枢的科研基石，具备极高的学术影响力和项目管理造诣。本月他牵头多模态感知算法的迭代，并有力推进了警务实战平台的落地。',
    aiKeywords: ['学术领军', '技术权威', '卓越指导', '战略眼光'],
    
    assocAchievements: [
      { type: '论文成果', typeClass: 'purple-tag', title: '基于知识图谱的警务时空分析模型', date: '2026-05', detail: '已录用于 IEEE T-ITS' },
      { type: '产权成果', typeClass: 'orange-tag', title: '一种智能边缘分析盒子及姿态识别方法', date: '2026-04', detail: '发明专利公布阶段' },
      { type: '活动成果', typeClass: 'blue-tag', title: '组织全国智能技术研讨沙龙', date: '2026-03', detail: '圆满成功，30家高校参与' }
    ],
    repProjects: [
      { title: '多模态警务感知融合大平台', role: '首席架构师 & 负责人', progress: 92 },
      { title: '智能无人机库周边警戒系统', role: '联合指导老师', progress: 85 }
    ],
    milestones: [
      { date: '2026-05', class: 'green', title: '论文被顶刊录用', desc: '指导学生完成时空分析模型，录用于一区顶刊。' },
      { date: '2025-10', class: 'blue', title: '重大项目结题', desc: '主导的国家级物联网智慧农业子系统成功结项验收。' },
      { date: '2024-04', class: 'orange', title: '专利授权', desc: '关于边缘多路摄像头编解码调度的发明专利顺利授权。' }
    ],
    detailedProjects: [
      { title: '多模态警务感知融合大平台', state: '已上线', stateClass: 'green-tag', role: '首席架构师 & 负责人', duration: '2024-09 至 2026-05', desc: '融合实验室计算机视觉与大语言模型技术，提供面向一线公安实战的嫌疑目标识别、轨迹复原及智能生成式案情摘要分析，并在多个试点市局落地运行。', achievements: ['软件著作权 #2025SR00431', 'SCI论文1篇'] },
      { title: '智能无人机库周边警戒系统', state: '测试中', stateClass: 'orange-tag', role: '联合指导老师', duration: '2025-03 至今', desc: '研发面向野外小型无人机固定充电库房的智能雷达+视觉警戒系统，解决无网络无市电环境下的人员越界侵入告警难题。' }
    ],
    detailedAwards: [
      { name: '中国机器人及人工智能大赛一等奖', level: '国家级', host: '中国人工智能学会', role: '第一指导教师', mentor: '李明阳', date: '2025-11' },
      { name: '挑战杯全国大学生课外学术科技作品二等奖', level: '国家级', host: '共青团中央', role: '指导教师', mentor: '李明阳', date: '2025-06' }
    ],
    awardTrend: [
      { year: '2024', count: 2 },
      { year: '2025', count: 3 }
    ],
    detailedPapers: [
      { title: 'Multimodal Spatial-Temporal Graph Networks for Intelligent Target Tracking in Complex Urban Environments', authors: '李明阳 (通讯作者), 张子轩', role: '通讯作者', journal: 'IEEE Transactions on Intelligent Transportation Systems', date: '2026-05', indexed: 'SCI 一区', citations: 12, if: '8.5' },
      { title: 'Knowledge Graph Reasoning for Crime Scene Reconstruction: A Deep Learning Approach', authors: '李明阳, 陈一诺', role: '第一作者', journal: 'Pattern Recognition Letters', date: '2025-08', indexed: 'SCI 二区', citations: 24, if: '4.8' }
    ],
    detailedPatents: [
      { name: '一种智能边缘分析盒子及姿态识别方法', type: '发明专利', code: 'CN20251039281.3', status: '实质审查', statusClass: 'orange-tag', date: '2025-05-12', role: '第一发明人' },
      { name: '警务多路视频流汇聚及姿态分析算法软件', type: '软件著作权', code: '2025SR120938', status: '已登记', statusClass: 'green-tag', date: '2025-08-20', role: '著作权人' }
    ],
    patentTimeline: [
      { date: '2025-10', class: 'green', title: '发明专利实审下发', desc: '边缘分析盒子专利通过初审，进入实审阶段。' },
      { date: '2025-08', class: 'green', title: '软件著作权获证', desc: '视频流汇聚分析软件正式获证。' }
    ],
    detailedTrajectory: [
      {
        year: 2025,
        events: [
          { date: '2025-11', title: '机器人大赛指导摘金', desc: '指导研究生张子轩战队获得中国机器人及人工智能大赛国家一等奖。', skills: ['学术表达', '答辩指导'] },
          { date: '2025-05', title: '申报重大研发课题', desc: '成功入选省部级智慧公安融合重点研发计划子项目。', skills: ['课题申报', '预算管理'] }
        ]
      },
      {
        year: 2024,
        events: [
          { date: '2024-09', title: '多模态感知平台立项', desc: '带领实验室12名骨干成员组建项目群，正式开启多模态警务平台架构设计。', skills: ['大系统架构设计'] }
        ]
      }
    ]
  },
  {
    id: 2,
    name: '张子轩',
    avatar: '👨‍🎓',
    role: '研究生',
    roleValue: 'graduate',
    roleClass: 'blue',
    grade: '研二',
    major: '计算机技术专业',
    joinTime: '2024-09',
    primaryDirection: 'AIGC应用 / 多模态学习',
    tags: ['算法骨干', '项目组长', '模型训练'],
    skills: ['Python', 'PyTorch', 'Transformers', 'Stable Diffusion', 'Vue.js', 'FastAPI'],
    bio: '研二学生，实验室算法研发组组长。研究方向为大语言模型微调、生成式视觉模型开发及多模态数据对齐。主攻AIGC方向，拥有出色的工程代码落地与算法实践能力。',
    projectsCount: 3,
    awardsCount: 4,
    papersCount: 2,
    sciPapersCount: 1,
    citationsCount: 14,
    patentsCount: 2,
    authPatentsCount: 1,
    pendingPatentsCount: 1,
    nationalAwardsCount: 2,
    
    // Radar values: [AI, Coding, Management, Academic, Hardware]
    radar: [90, 88, 75, 80, 50],
    
    aiSummary: '张子轩是典型的“算法+工程”双能型骨干。在大模型微调、时空感知网络设计上有深厚积淀。作为学生组长，展现了良好的项目统筹力，是小喵助手的核心算法开发者。',
    aiKeywords: ['工程力强', '大模型专家', '核心组长', '多面手'],
    
    assocAchievements: [
      { type: '竞赛奖项', typeClass: 'orange-tag', title: '中国机器人及人工智能大赛一等奖', date: '2025-11', detail: '国家级一等奖' },
      { type: '论文成果', typeClass: 'purple-tag', title: '基于大模型的智慧公安意图识别系统', date: '2025-08', detail: '发表于智能系统前沿会议' }
    ],
    repProjects: [
      { title: '智小喵实验室AI大助手平台', role: '算法负责人 & 全栈开发', progress: 88 },
      { title: '智能设备状态物联网监控大屏', role: '前端架构设计', progress: 95 }
    ],
    milestones: [
      { date: '2025-11', class: 'green', title: '全国大赛夺冠', desc: '担任队长带领战队获得机器人人工智能大赛国家一等奖。' },
      { date: '2025-03', class: 'blue', title: '小喵助手上线内测', desc: '成功在实验室内部服务器部署智小喵AI助手，支持设备联动。' },
      { date: '2024-09', class: 'orange', title: '加入智能实验室', desc: '以专业第一的推免成绩进入智能实验室攻读硕士学位。' }
    ],
    detailedProjects: [
      { title: '智小喵实验室AI大助手平台', state: '开发中', stateClass: 'orange-tag', role: '算法负责人 & 全栈开发', duration: '2025-03 至今', desc: '为智能实验室打造的集大模型问答、设备控制、成果智能检索于一体的AI系统，通过RAG检索增强生成技术实时回答实验室管理及成果相关的自然语言提问。', achievements: ['软件著作权 #2025SR10822'] },
      { title: '智能设备状态物联网监控大屏', state: '已上线', stateClass: 'green-tag', role: '前端架构设计', duration: '2024-10 至 2025-02', desc: '基于Vue 3 + WebSockets实现的高清3D大屏看板，展示实验室310空间温湿度、设备负载、摄像头直播流及近期动态。' }
    ],
    detailedAwards: [
      { name: '中国机器人及人工智能大赛一等奖', level: '国家级', host: '中国人工智能学会', role: '队长', mentor: '李明阳', date: '2025-11' },
      { name: '挑战杯全国大学生课外学术科技作品二等奖', level: '国家级', host: '共青团中央', role: '核心开发者', mentor: '李明阳', date: '2025-06' }
    ],
    awardTrend: [
      { year: '2024', count: 1 },
      { year: '2025', count: 3 }
    ],
    detailedPapers: [
      { title: 'Spatial-Temporal Multi-Agent Networks for Real-time Anomaly Detection', authors: '张子轩, 李明阳', role: '第一作者', journal: 'Journal of Intelligent Systems', date: '2025-12', indexed: 'EI', citations: 4, if: '2.5' },
      { title: 'A Natural Language Interface for IoT Enabled Smart Labs: The ZhiXiaoMiao Agent', authors: '张子轩, 李明阳', role: '第一作者', journal: 'IEEE L-IoT', date: '2025-07', indexed: 'SCI 三区', citations: 10, if: '3.6' }
    ],
    detailedPatents: [
      { name: '智小喵大语言模型问答及设备控制系统', type: '软件著作权', code: '2025SR10822', status: '已登记', statusClass: 'green-tag', date: '2025-06-12', role: '著作权人' },
      { name: '一种利用知识图谱进行空间设备智能检索的系统及方法', type: '发明专利', code: 'CN2025108422.3', status: '受理', statusClass: 'blue-tag', date: '2025-09-15', role: '第二发明人' }
    ],
    patentTimeline: [
      { date: '2025-09', class: 'blue', title: '发明专利申请受理', desc: '智能检索方法专利成功被国家知识产权局受理。' },
      { date: '2025-06', class: 'green', title: '软件著作权获证', desc: '智小喵系统软件著作权正式获证。' }
    ],
    detailedTrajectory: [
      {
        year: 2025,
        events: [
          { date: '2025-11', title: '带队夺金', desc: '带队斩获中国机器人及人工智能大赛全国一等奖。', skills: ['算法调优', 'PPT答辩'] },
          { date: '2025-03', title: '小喵助手1.0系统发布', desc: '完成实验室本地大模型微调部署，面向室员上线小喵网页客户端。', skills: ['LLM微调', 'FastAPI部署'] }
        ]
      },
      {
        year: 2024,
        events: [
          { date: '2024-09', title: '推免加入实验室', desc: '进入实验室，负责设备物联网看板研发工作。', skills: ['Vue3', 'WebSocket'] }
        ]
      }
    ]
  },
  {
    id: 3,
    name: '刘昊',
    avatar: '👨',
    role: '本科生',
    roleValue: 'undergrad',
    roleClass: 'green',
    grade: '大四',
    major: '物联网工程专业',
    joinTime: '2024-03',
    primaryDirection: '智能硬件 / 物联网感知',
    tags: ['硬件极客', '嵌入式', '3D打印'],
    skills: ['C/C++', 'STM32', 'FreeRTOS', 'ESP32', 'KiCad', 'SolidWorks', '3D Slicing'],
    bio: '大四保研生，实验室硬件制造极客。擅长PCB印制板设计、STM32嵌入式软件架构、传感器融合技术，对实验室硬件设备运维及二次开发有极强热情。',
    projectsCount: 4,
    awardsCount: 3,
    papersCount: 0,
    citationsCount: 0,
    patentsCount: 3,
    authPatentsCount: 2,
    pendingPatentsCount: 1,
    nationalAwardsCount: 1,
    
    // Radar values: [AI, Coding, Management, Academic, Hardware]
    radar: [60, 80, 70, 50, 95],
    
    aiSummary: '刘昊是实验室的“钢铁侠”，在嵌入式开发与硬件电路设计上有极高天赋。独立设计了实验室无人机备用电池管理座舱与机械臂防尘罩，实践动手能力拔群。',
    aiKeywords: ['智能硬件', '极客精神', '动手能力强', '机械结构'],
    
    assocAchievements: [
      { type: '产权成果', typeClass: 'orange-tag', title: '一种实验室多路环境监测网关及PCB', date: '2025-12', detail: '已授权实用新型' },
      { type: '竞赛奖项', typeClass: 'orange-tag', title: '全国智能制造创新大赛二等奖', date: '2025-07', detail: '行业大奖' }
    ],
    repProjects: [
      { title: '基于ESP32的超轻量无线物联网传感器节点', role: '硬件负责人', progress: 100 },
      { title: '机器人抓取机械臂末端感知套件', role: '结构设计与嵌入式编写', progress: 85 }
    ],
    milestones: [
      { date: '2025-12', class: 'green', title: '实用新型专利授权', desc: '独立申请的“物联网多传感器融合监测网关”获得国家知识产权局授权。' },
      { date: '2025-07', class: 'blue', title: '智能制造大奖', desc: '荣获全国智能制造技术应用创新大赛二等奖。' },
      { date: '2024-03', class: 'orange', title: '破格允许加入实验室', desc: '因大二绩点突出并在硬件创新活动中展露头角，通过考核破格进入310实验室。' }
    ],
    detailedProjects: [
      { title: '基于ESP32的超轻量无线物联网传感器节点', state: '已完成', stateClass: 'green-tag', role: '硬件负责人', duration: '2024-05 至 2024-11', desc: '自主开发了一套支持WiFi-Mesh和LoRa组网的超低功耗电池环境采集传感器节点，现广泛应用于310实验室各个角落采集环境数据。', achievements: ['实用新型专利1项'] },
      { title: '机器人抓取机械臂末端感知套件', state: '开发中', stateClass: 'orange-tag', role: '结构设计与嵌入式编写', duration: '2025-03 至今', desc: '为实验室六自由度协作机械臂定制的末端力矩+光电融合感知爪手，支持在狭长空间安全抓取高敏感度耗材瓶。' }
    ],
    detailedAwards: [
      { name: '全国智能制造创新大赛二等奖', level: '行业级/国家级', host: '工业和信息化部', role: '硬件总负责人', mentor: '李明阳', date: '2025-07' },
      { name: '蓝桥杯嵌入式单片机设计一等奖', level: '省部级', host: '工信部人才交流中心', role: '个人参赛', mentor: '无', date: '2024-05' }
    ],
    awardTrend: [
      { year: '2024', count: 1 },
      { year: '2025', count: 2 }
    ],
    detailedPapers: [],
    detailedPatents: [
      { name: '一种物联网多传感器融合监测网关', type: '实用新型', code: 'ZL20242189382.9', status: '已授权', statusClass: 'green-tag', date: '2024-12-05', role: '第一发明人' },
      { name: '机械臂柔性压力感知指尖控制电路系统', type: '实用新型', code: 'ZL2025204893.3', status: '已登记', statusClass: 'green-tag', date: '2025-04-18', role: '第一发明人' }
    ],
    patentTimeline: [
      { date: '2025-04', class: 'green', title: '实用新型获授', desc: '机械臂压力指尖控制系统授权成功。' },
      { date: '2024-12', class: 'green', title: '环境网关获授', desc: '首个物联网环境监测网关专利获授。' }
    ],
    detailedTrajectory: [
      {
        year: 2025,
        events: [
          { date: '2025-07', title: '获得创新大赛大奖', desc: '带队赴南京现场参加全国智能制造创新大赛，完成硬件调试，获得二等奖。', skills: ['PCB布局', '嵌入式抗干扰'] }
        ]
      },
      {
        year: 2024,
        events: [
          { date: '2024-03', title: '加入310实验室', desc: '经过导师面试，进入硬件组从事嵌入式电路调试。', skills: ['C语言', '硬件焊接'] }
        ]
      }
    ]
  },
  buildMemberProfile({
    id: 4,
    name: '陈一诺',
    avatar: '👩‍🎓',
    role: '研究生',
    roleValue: 'graduate',
    roleClass: 'blue',
    grade: '研一',
    major: '软件工程专业',
    joinTime: '2025-09',
    primaryDirection: '数据治理 / 知识图谱',
    tags: ['数据中台', '知识图谱', 'RAG检索'],
    skills: ['Python', 'Neo4j', 'SQL', 'FastAPI', 'LangChain', '数据标注'],
    bio: '研一学生，负责实验室成果知识库、设备台账数据清洗与RAG检索链路建设，擅长把复杂业务数据整理成可检索、可分析、可展示的结构化资产。',
    projectsCount: 3,
    awardsCount: 2,
    papersCount: 1,
    patentsCount: 1,
    radar: [82, 84, 72, 78, 55],
    aiSummary: '陈一诺在数据治理和知识图谱方向表现稳定，能够将实验室分散的成员、项目、成果资料沉淀为可复用数据资产，是小喵问答知识底座的重要维护者。',
    aiKeywords: ['数据治理', '知识图谱', '检索增强', '资料沉淀'],
    projectTitle: '实验室成果知识图谱与RAG检索平台',
    projectRole: '数据建模负责人',
    projectProgress: 81,
    awardName: '校级数据应用创新赛一等奖'
  }),
  buildMemberProfile({
    id: 5,
    name: '王梓涵',
    avatar: '👩',
    role: '本科生',
    roleValue: 'undergrad',
    roleClass: 'green',
    grade: '大三',
    major: '人工智能专业',
    joinTime: '2025-03',
    primaryDirection: '计算机视觉 / 行为识别',
    tags: ['视觉算法', '目标检测', '数据集构建'],
    skills: ['Python', 'YOLO', 'OpenCV', 'PyTorch', 'Label Studio', '模型评估'],
    bio: '本科生视觉算法成员，主要负责实验室视频数据集构建、目标检测模型微调和行为识别样例验证，具备扎实的算法复现与实验记录能力。',
    projectsCount: 2,
    awardsCount: 2,
    papersCount: 1,
    patentsCount: 0,
    radar: [86, 78, 62, 72, 48],
    aiSummary: '王梓涵在计算机视觉方向成长迅速，对数据质量和模型评估非常敏感，适合承担视觉算法从样例到指标验证的闭环任务。',
    aiKeywords: ['视觉算法', '目标检测', '实验严谨', '成长快'],
    projectTitle: '实验室多路摄像头行为识别样例库',
    projectRole: '视觉算法成员',
    projectProgress: 74,
    awardName: '省级人工智能算法挑战赛二等奖'
  }),
  buildMemberProfile({
    id: 6,
    name: '赵云帆',
    avatar: '👨',
    role: '本科生',
    roleValue: 'undergrad',
    roleClass: 'green',
    grade: '大三',
    major: '物联网工程专业',
    joinTime: '2024-10',
    primaryDirection: '智能硬件 / 边缘计算',
    tags: ['边缘盒子', '设备联动', '传感器'],
    skills: ['C/C++', 'ESP32', 'MQTT', 'Linux', 'Docker', '硬件调试'],
    bio: '本科生硬件与边缘计算成员，负责传感器节点接入、边缘盒子部署和设备状态上报，能够快速定位实验室物联网链路中的软硬件问题。',
    projectsCount: 3,
    awardsCount: 1,
    papersCount: 0,
    patentsCount: 2,
    radar: [58, 82, 68, 52, 88],
    aiSummary: '赵云帆是设备联动链路中的实干型成员，熟悉边缘端部署和物联网通信协议，能把硬件状态稳定接入数字中枢。',
    aiKeywords: ['边缘计算', '物联网', '设备联动', '调试能力'],
    projectTitle: '边缘计算盒子与实验室设备联动网关',
    projectRole: '边缘端开发',
    projectProgress: 79,
    awardName: '嵌入式系统设计竞赛三等奖'
  }),
  buildMemberProfile({
    id: 7,
    name: '孙若曦',
    avatar: '👩',
    role: '本科生',
    roleValue: 'undergrad',
    roleClass: 'green',
    grade: '大二',
    major: '数字媒体技术专业',
    joinTime: '2025-09',
    primaryDirection: 'AIGC应用 / 交互设计',
    tags: ['AIGC', '可视化', '前端交互'],
    skills: ['Vue.js', 'Figma', 'Three.js', 'Prompt设计', 'CSS', '数据可视化'],
    bio: '本科生前端与AIGC应用成员，关注数字中枢界面表达、可视化交互和生成式内容辅助设计，能够把科研数据转化为更易理解的展示界面。',
    projectsCount: 2,
    awardsCount: 1,
    papersCount: 0,
    patentsCount: 1,
    radar: [76, 80, 66, 58, 44],
    aiSummary: '孙若曦擅长把复杂信息做成清晰、稳定、具有科技感的界面，是实验室展示系统和AIGC创意资产的重要补充力量。',
    aiKeywords: ['前端交互', 'AIGC设计', '可视化', '表达能力'],
    projectTitle: '智慧实验室成果展示可视化组件库',
    projectRole: '前端交互设计',
    projectProgress: 68,
    awardName: '数字创意设计校赛一等奖'
  }),
  buildMemberProfile({
    id: 8,
    name: '周启航',
    avatar: '👨',
    role: '本科生',
    roleValue: 'undergrad',
    roleClass: 'green',
    grade: '大四',
    major: '计算机科学与技术专业',
    joinTime: '2024-06',
    primaryDirection: 'AI教育 / 智能评测',
    tags: ['教学平台', '自动评测', '后端服务'],
    skills: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Python', '接口测试'],
    bio: '本科生后端与教学平台成员，负责训练任务记录、实验作业评测和成员成长数据接口设计，关注AI教育场景下的过程性评价。',
    projectsCount: 3,
    awardsCount: 2,
    papersCount: 1,
    patentsCount: 1,
    radar: [70, 86, 74, 68, 50],
    aiSummary: '周启航工程基础扎实，能够把AI教育中的评测规则、训练过程和成员成长数据落到稳定的后端服务中。',
    aiKeywords: ['后端服务', 'AI教育', '自动评测', '工程稳定'],
    projectTitle: 'AI实验训练任务自动评测平台',
    projectRole: '后端服务负责人',
    projectProgress: 83,
    awardName: '软件服务外包创新创业大赛二等奖'
  }),
  buildMemberProfile({
    id: 9,
    name: '林嘉禾',
    avatar: '👩',
    role: '本科生',
    roleValue: 'undergrad',
    roleClass: 'green',
    grade: '大二',
    major: '数据科学与大数据技术专业',
    joinTime: '2025-10',
    primaryDirection: '数据治理 / 实验分析',
    tags: ['指标分析', '数据看板', '实验记录'],
    skills: ['Python', 'Pandas', 'ECharts', 'SQL', '数据清洗', '报告撰写'],
    bio: '本科生数据分析成员，负责实验活动、设备使用和项目进度数据的清洗与看板呈现，擅长用可解释指标辅助实验室管理决策。',
    projectsCount: 2,
    awardsCount: 1,
    papersCount: 0,
    patentsCount: 0,
    radar: [68, 76, 70, 66, 42],
    aiSummary: '林嘉禾对数据指标敏感，能够把实验室日常运行数据整理成可追踪的趋势和问题线索，是运营分析方向的潜力成员。',
    aiKeywords: ['数据分析', '指标看板', '运营洞察', '报告能力'],
    projectTitle: '实验室运行指标分析与趋势看板',
    projectRole: '数据分析成员',
    projectProgress: 71,
    awardName: '数据分析实践优秀作品'
  })
];

// Computed list of filtered members
const filteredMembers = computed(() => {
  return members.filter(member => {
    // Role filter
    if (selectedRole.value !== 'all' && member.roleValue !== selectedRole.value) {
      return false;
    }
    // Direction filter
    if (selectedDirection.value !== 'all' && !member.primaryDirection.includes(selectedDirection.value)) {
      return false;
    }
    // Search query filter
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      const matchName = member.name.toLowerCase().includes(q);
      const matchTags = member.tags.some(tag => tag.toLowerCase().includes(q));
      const matchSkills = member.skills.some(skill => skill.toLowerCase().includes(q));
      return matchName || matchTags || matchSkills;
    }
    return true;
  });
});

// Stats cards for selected member in detail view
const memberStatsCards = computed(() => {
  if (!selectedMember.value) return [];
  const m = selectedMember.value;
  return [
    { label: '参与项目', val: m.projectsCount, icon: '📁' },
    { label: '获奖成果', val: m.awardsCount, icon: '🏆' },
    { label: '发表论文', val: m.papersCount, icon: '📄' },
    { label: '专利软著', val: m.patentsCount, icon: '💡' }
  ];
});

// Dynamic Radar Points Calculation
const getRadarPoints = computed(() => {
  if (!selectedMember.value) return '';
  // Radar center (60,60), max radius 50.
  // Axes index:
  // 0: CV/AI (Up: x=60, y=60 - 50*val)
  // 1: Coding (Right Up: x=60 + 50*val*cos(30), y=60 - 50*val*sin(30))
  // 2: Management (Right Down: x=60 + 50*val*cos(30), y=60 + 50*val*sin(30))
  // 3: Academic (Left Down: x=60 - 50*val*cos(30), y=60 + 50*val*sin(30))
  // 4: Hardware (Left Up: x=60 - 50*val*cos(30), y=60 - 50*val*sin(30))
  const radarVals = selectedMember.value.radar; // Array of 5 numbers out of 100
  const center = 60;
  const maxRadius = 50;
  
  const angles = [
    -Math.PI / 2, // Up
    -Math.PI / 6, // Right Up
    Math.PI / 6,  // Right Down
    Math.PI * 5 / 6, // Left Down
    Math.PI * 7 / 6  // Left Up
  ];
  
  const points = angles.map((angle, index) => {
    const val = (radarVals[index] || 50) / 100;
    const r = maxRadius * val;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  
  return points.join(' ');
});
</script>

<style scoped>
.members-hall-container {
  height: calc(100vh - 110px);
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow: hidden;
}

/* Detail view nav */
.detail-header-nav {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 12px;
  background: rgba(2, 6, 20, 0.5);
  border: 1px solid var(--color-border);
  padding: 8px 16px;
  border-radius: 6px;
  flex-shrink: 0;
}

.btn-back {
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid var(--color-border);
  color: #38bdf8;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.btn-back:hover {
  background: rgba(56, 189, 248, 0.2);
  border-color: var(--color-border-active);
}

.nav-path {
  font-size: 13px;
  color: var(--color-text-secondary);
}

/* Main View Layout */
.main-members-view {
  display: flex;
  gap: 16px;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.left-sidebar {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
  overflow-y: auto;
}

.sidebar-section {
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.section-header h3 {
  font-size: 14px;
  color: #fff;
  font-weight: bold;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.overview-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 10px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.overview-card .label {
  font-size: 10px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.overview-card .num {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
}

.overview-card .num small {
  font-size: 10px;
  font-weight: normal;
  color: var(--color-text-secondary);
}

/* Chart */
.chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.svg-chart-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
}

.donut-svg {
  width: 100%;
  height: 100%;
}

.donut-center-text {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.donut-center-text .title {
  font-size: 8px;
  color: var(--color-text-secondary);
}

.donut-center-text .val {
  font-size: 14px;
  font-weight: bold;
  color: #fff;
}

.donut-legend {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 11px;
}

.donut-legend .legend-item {
  display: flex;
  align-items: center;
  color: var(--color-text-secondary);
}

.donut-legend .bullet {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 8px;
}

.donut-legend .bullet.green { background: var(--status-online); }
.donut-legend .bullet.blue { background: var(--status-info); }
.donut-legend .bullet.orange { background: var(--status-busy); }

.donut-legend .pct {
  margin-left: auto;
  opacity: 0.8;
}

/* Direction Bars */
.direction-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 11px;
}

.direction-bar-item .lbl-row {
  display: flex;
  justify-content: space-between;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.direction-bar-item .lbl-row span:last-child {
  color: #fff;
}

.progress-bar-container {
  height: 6px;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
}

/* Right Panel: Grid Cards */
.members-grid-container {
  flex: 1;
  background: var(--bg-panel);
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.filter-top-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 168, 255, 0.15);
  flex-shrink: 0;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-right: 4px;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--color-text-secondary);
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s;
}

.filter-btn:hover {
  background: rgba(0, 168, 255, 0.1);
  color: #fff;
}

.filter-btn.active {
  background: rgba(0, 168, 255, 0.25);
  border-color: var(--color-border-active);
  color: #fff;
  box-shadow: 0 0 8px rgba(0, 168, 255, 0.15);
}

.search-box {
  margin-left: auto;
  position: relative;
  width: 200px;
}

.search-box input {
  width: 100%;
  background: rgba(0,0,0,0.3);
  border: 1px solid var(--color-border);
  color: #fff;
  padding: 4px 28px 4px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.search-box input:focus {
  outline: none;
  border-color: var(--color-border-active);
}

.search-icon {
  position: absolute;
  right: 8px;
  top: 5px;
  font-size: 12px;
  opacity: 0.6;
}

.members-cards-scroll {
  flex: 1;
  overflow-y: auto;
  margin-top: 16px;
  padding-right: 4px;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.member-card {
  position: relative;
  display: flex;
  padding: 16px;
  gap: 14px;
  overflow: hidden;
  background: rgba(6, 18, 45, 0.4);
}

.member-card .avatar-box {
  position: relative;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  flex-shrink: 0;
}

.member-card .role-tag {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 8px;
  padding: 1px 4px;
  border-radius: 2px;
  white-space: nowrap;
}

.member-card .role-tag.orange { background: rgba(245,158,11,0.15); color: var(--status-busy); border: 1px solid rgba(245,158,11,0.25); }
.member-card .role-tag.blue { background: rgba(59,130,246,0.15); color: var(--status-info); border: 1px solid rgba(59,130,246,0.25); }
.member-card .role-tag.green { background: rgba(16,185,129,0.15); color: var(--status-online); border: 1px solid rgba(16,185,129,0.25); }

.member-meta {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.member-meta .name {
  font-size: 15px;
  color: #fff;
  margin-bottom: 2px;
}

.member-meta .grade {
  font-size: 11px;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
}

.directions-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 10px;
}

.directions-tags .tag {
  font-size: 9px;
  background: rgba(0, 168, 255, 0.05);
  border: 1px solid rgba(0, 168, 255, 0.15);
  color: #38bdf8;
  padding: 1px 5px;
  border-radius: 2px;
}

.member-meta .stats-row {
  display: flex;
  gap: 12px;
  font-size: 10px;
  color: var(--color-text-secondary);
  border-top: 1px dashed rgba(255,255,255,0.05);
  padding-top: 6px;
  margin-top: auto;
}

.member-meta .stats-row strong {
  color: #fff;
}

.hover-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(1, 4, 15, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #38bdf8;
  font-size: 13px;
  font-weight: bold;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.member-card:hover .hover-overlay {
  opacity: 1;
}

/* ========================================================
   MEMBER DETAILS VIEW
   ======================================================== */
.member-details-view {
  display: flex;
  gap: 16px;
  flex: 1;
  overflow: hidden;
}

.details-left-panel {
  width: 250px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-shrink: 0;
  overflow-y: auto;
}

.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar-large {
  width: 80px;
  height: 80px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(0, 168, 255, 0.25);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 44px;
  box-shadow: 0 0 15px rgba(0, 168, 255, 0.15);
  margin-bottom: 12px;
}

.profile-card .name {
  font-size: 18px;
  color: #fff;
  font-weight: bold;
}

.profile-card .role-badge {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 3px;
  margin-top: 4px;
}

.profile-card .role-badge.orange { background: rgba(245,158,11,0.15); color: var(--status-busy); border: 1px solid rgba(245,158,11,0.25); }
.profile-card .role-badge.blue { background: rgba(59,130,246,0.15); color: var(--status-info); border: 1px solid rgba(59,130,246,0.25); }
.profile-card .role-badge.green { background: rgba(16,185,129,0.15); color: var(--status-online); border: 1px solid rgba(16,185,129,0.25); }

.profile-card .grade {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: 6px;
}

.info-list {
  list-style: none;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid rgba(255,255,255,0.05);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding: 12px 0;
}

.info-list li {
  display: flex;
  justify-content: space-between;
}

.info-list .lbl {
  color: var(--color-text-secondary);
}

.info-list .val {
  color: #fff;
}

.skills-section h4 {
  font-size: 12px;
  color: #fff;
  margin-bottom: 8px;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-tag {
  font-size: 10px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  color: var(--color-text-secondary);
  padding: 2px 6px;
  border-radius: 4px;
}

/* Mascot贴士 */
.mascot-advice-card {
  padding: 12px;
  background: rgba(0, 168, 255, 0.03);
  margin-top: auto;
}

.mascot-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.mascot-header h5 {
  font-size: 12px;
  color: #38bdf8;
  margin: 0;
}

.advice-txt {
  font-size: 10px;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

/* Middle Panel Tabs */
.details-middle-panel {
  flex: 1;
  background: var(--bg-panel);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.subtabs-header {
  display: flex;
  border-bottom: 1px solid rgba(0, 168, 255, 0.15);
  background: rgba(2, 6, 20, 0.4);
  flex-shrink: 0;
}

.subtab-btn {
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--color-text-secondary);
  padding: 12px 18px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.subtab-btn:hover {
  color: #fff;
  background: rgba(0, 168, 255, 0.02);
}

.subtab-btn.active {
  color: #38bdf8;
  border-bottom-color: #38bdf8;
  font-weight: bold;
  background: rgba(0, 168, 255, 0.05);
}

.subtab-content-scroll {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

/* Subtab: General Page */
.section-intro {
  margin-bottom: 20px;
}

.section-intro h4 {
  font-size: 13px;
  color: #fff;
  margin-bottom: 6px;
}

.bio-text {
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.stats-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stats-cards-grid .stat-card {
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 12px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.stats-cards-grid .stat-card .icon {
  font-size: 20px;
}

.stats-cards-grid .stat-card .txt {
  display: flex;
  flex-direction: column;
}

.stats-cards-grid .stat-card .val {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.stats-cards-grid .stat-card .lbl {
  font-size: 10px;
  color: var(--color-text-secondary);
}

.radar-ai-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.radar-card {
  flex: 1.2;
  padding: 14px;
}

.radar-card h4, .ai-summary-card h4 {
  font-size: 13px;
  color: #fff;
  margin-bottom: 10px;
}

.svg-radar-wrapper {
  display: flex;
  justify-content: center;
  height: 160px;
}

.radar-svg {
  height: 100%;
}

.grid-line {
  stroke: rgba(255, 255, 255, 0.06);
  stroke-width: 0.5;
  fill: none;
}

.radar-poly {
  fill: rgba(56, 189, 248, 0.15);
  stroke: #38bdf8;
  stroke-width: 1.5;
}

.radar-poly-dots {
  fill: none;
  stroke: #38bdf8;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.radar-text {
  fill: var(--color-text-secondary);
  font-size: 7px;
}

.text-anchor-middle { text-anchor: middle; }
.text-anchor-start { text-anchor: start; }
.text-anchor-end { text-anchor: end; }

.ai-summary-card {
  flex: 1.5;
  padding: 14px;
  display: flex;
  flex-direction: column;
}

.summary-para {
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  flex-grow: 1;
}

.keywords-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.keywords-row .kw {
  font-size: 10px;
  color: #38bdf8;
  background: rgba(56,189,248,0.05);
  padding: 2px 6px;
  border-radius: 4px;
}

.section-assoc-achievements h4 {
  font-size: 13px;
  color: #fff;
  margin-bottom: 10px;
}

.assoc-achievements-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.assoc-card {
  padding: 10px 12px;
  background: rgba(255,255,255,0.01);
  display: flex;
  align-items: center;
  gap: 12px;
}

.assoc-card .badge {
  font-size: 9px;
  padding: 1px 5px;
  border-radius: 2px;
  white-space: nowrap;
}

.assoc-card .purple-tag { background: rgba(139,92,246,0.15); color: #a78bfa; border: 1px solid rgba(139,92,246,0.25); }
.assoc-card .orange-tag { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.25); }
.assoc-card .blue-tag { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.25); }

.assoc-card .title {
  font-size: 12px;
  color: #fff;
  flex-grow: 1;
  margin: 0;
}

.assoc-card .meta {
  font-size: 10px;
  color: var(--color-text-secondary);
}

/* Subtab: Projects List */
.projects-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-project-card {
  padding: 14px;
  background: rgba(255,255,255,0.01);
}

.detail-project-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.detail-project-card h4 {
  font-size: 14px;
  color: #fff;
  margin: 0;
}

.detail-project-card .state-badge {
  font-size: 9px;
  padding: 1px 6px;
  border-radius: 3px;
}

.detail-project-card .state-badge.green-tag { background: rgba(16,185,129,0.15); color: var(--status-online); }
.detail-project-card .state-badge.orange-tag { background: rgba(245,158,11,0.15); color: var(--status-busy); }

.detail-project-card .desc {
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.4;
  margin-bottom: 8px;
}

.detail-project-card .meta-row {
  display: flex;
  gap: 20px;
  font-size: 11px;
  color: var(--color-text-secondary);
  border-bottom: 1px dashed rgba(255,255,255,0.03);
  padding-bottom: 6px;
  margin-bottom: 6px;
}

.detail-project-card .meta-row strong {
  color: #fff;
}

.detail-project-card .achievements-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
}

.detail-project-card .ach-lbl {
  color: var(--color-text-secondary);
}

.detail-project-card .ach-tag {
  background: rgba(255,255,255,0.03);
  padding: 1px 6px;
  border-radius: 3px;
  color: #fff;
}

/* Subtab: Awards Page */
.awards-summary-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.award-sum-c {
  background: rgba(255,255,255,0.01);
  border: 1px solid rgba(255,255,255,0.04);
  padding: 12px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.award-sum-c .icon {
  font-size: 24px;
}

.award-sum-c .info {
  display: flex;
  flex-direction: column;
}

.award-sum-c .val {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.award-sum-c .lbl {
  font-size: 10px;
  color: var(--color-text-secondary);
}

.awards-detail-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.award-detail-card {
  display: flex;
  align-items: center;
  padding: 12px;
  background: rgba(255,255,255,0.01);
}

.award-detail-card .trophy-box {
  width: 40px;
  height: 40px;
  background: rgba(245,158,11,0.08);
  border: 1px solid rgba(245,158,11,0.2);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  margin-right: 15px;
}

.award-detail-card .txt {
  flex-grow: 1;
}

.award-detail-card h4 {
  font-size: 13px;
  color: #fff;
  margin: 0;
}

.award-detail-card .lvl {
  font-size: 10px;
  color: #fbbf24;
  margin: 2px 0;
}

.award-detail-card .role {
  font-size: 10px;
  color: var(--color-text-secondary);
}

.award-detail-card .role strong {
  color: #fff;
}

.award-detail-card .date {
  font-size: 11px;
  color: var(--color-text-secondary);
}

.awards-charts-row .chart-box {
  padding: 14px;
}

.awards-charts-row h4 {
  font-size: 12px;
  color: #fff;
  margin-bottom: 10px;
}

.chart-bar-mock {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 40px;
  height: 100px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.chart-bar-mock .col {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
  height: 100%;
  justify-content: flex-end;
}

.chart-bar-mock .bar-fill {
  width: 14px;
  background: linear-gradient(180deg, #38bdf8 0%, rgba(56, 189, 248, 0.2) 100%);
  border-radius: 3px 3px 0 0;
  position: relative;
}

.chart-bar-mock .bar-fill:hover {
  background: var(--status-online);
}

.chart-bar-mock .tip {
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 9px;
  color: #fff;
}

.chart-bar-mock .lbl {
  font-size: 10px;
  color: var(--color-text-secondary);
  margin-top: 6px;
}

/* Subtab: Papers Page */
.papers-summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.paper-sum-c {
  background: rgba(255,255,255,0.01);
  border: 1px solid rgba(255,255,255,0.04);
  padding: 12px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.paper-sum-c .val {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
}

.paper-sum-c .lbl {
  font-size: 10px;
  color: var(--color-text-secondary);
  margin-top: 2px;
}

.papers-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.paper-card {
  display: flex;
  padding: 12px;
  gap: 15px;
  background: rgba(255,255,255,0.01);
}

.paper-index {
  font-size: 20px;
  opacity: 0.6;
}

.paper-main {
  flex-grow: 1;
}

.paper-main h4 {
  font-size: 13px;
  color: #fff;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.paper-main .authors, .paper-main .journal {
  font-size: 10px;
  color: var(--color-text-secondary);
  margin-bottom: 2px;
}

.paper-main .journal strong {
  color: #fff;
}

.paper-main .details {
  font-size: 10px;
  color: var(--color-text-secondary);
  margin-top: 4px;
}

.tag-sci {
  background: rgba(139,92,246,0.15);
  color: #a78bfa;
  padding: 1px 4px;
  border-radius: 2px;
  margin-right: 4px;
}

.paper-topics-row .chart-box {
  padding: 14px;
}

.paper-topics-row h4 {
  font-size: 12px;
  color: #fff;
  margin-bottom: 10px;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.cloud-tag {
  color: var(--color-text-secondary);
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.04);
  padding: 4px 10px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.cloud-tag:hover {
  color: #38bdf8;
  border-color: var(--color-border-active);
  background: rgba(0,168,255,0.05);
}

.cloud-tag.size-3 { font-size: 14px; font-weight: bold; color: #fff; }
.cloud-tag.size-2 { font-size: 12px; color: #e2e8f0; }
.cloud-tag.size-1 { font-size: 10px; }

/* Subtab: Patents Page */
.patents-summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.pat-sum-c {
  background: rgba(255,255,255,0.01);
  border: 1px solid rgba(255,255,255,0.04);
  padding: 12px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pat-sum-c .val {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
}

.pat-sum-c .lbl {
  font-size: 10px;
  color: var(--color-text-secondary);
  margin-top: 2px;
}

.patents-table-wrapper {
  overflow-x: auto;
  margin-bottom: 20px;
}

.patents-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
  text-align: left;
}

.patents-table th {
  padding: 8px;
  color: var(--color-text-secondary);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  font-weight: normal;
}

.patents-table td {
  padding: 10px 8px;
  border-bottom: 1px dashed rgba(255,255,255,0.03);
  color: #fff;
}

.status-tag {
  font-size: 9px;
  padding: 1px 5px;
  border-radius: 2px;
}

.status-tag.orange-tag { background: rgba(245,158,11,0.15); color: #fbbf24; }
.status-tag.green-tag { background: rgba(16,185,129,0.15); color: var(--status-online); }
.status-tag.blue-tag { background: rgba(59,130,246,0.15); color: #60a5fa; }

.patent-history-timeline-section h4 {
  font-size: 12px;
  color: #fff;
  margin-bottom: 10px;
}

.patent-timeline {
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-left: 1px solid rgba(255,255,255,0.08);
  padding-left: 15px;
  margin-left: 5px;
}

.timeline-step {
  position: relative;
}

.timeline-step .dot {
  position: absolute;
  left: -19px;
  top: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-text-secondary);
}

.timeline-step .dot.green { background: var(--status-online); }
.timeline-step .dot.blue { background: var(--status-info); }

.timeline-step .content {
  font-size: 11px;
}

.timeline-step .date {
  font-size: 9px;
  color: var(--color-text-secondary);
}

.timeline-step h5 {
  font-size: 11px;
  color: #fff;
  margin: 2px 0;
}

.timeline-step p {
  color: var(--color-text-secondary);
  font-size: 10px;
}

/* Subtab: Trajectory Page */
.milestones-overview {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.milestone-c {
  flex: 1;
  background: rgba(255,255,255,0.01);
  padding: 10px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  border: 1px solid rgba(255,255,255,0.04);
}

.milestone-c .num {
  font-size: 15px;
  font-weight: bold;
  color: #fff;
}

.vertical-trajectory-timeline {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.trajectory-year-block .year-header {
  font-size: 14px;
  color: #38bdf8;
  font-weight: bold;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(56, 189, 248, 0.15);
  padding-bottom: 4px;
}

.trajectory-year-block .events-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  border-left: 1px solid rgba(255,255,255,0.08);
  padding-left: 20px;
  margin-left: 10px;
}

.traj-event-item {
  position: relative;
}

.traj-event-item .timeline-node {
  position: absolute;
  left: -25px;
  top: 8px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #38bdf8;
  border: 2px solid var(--bg-dark);
}

.traj-event-item .event-body {
  padding: 12px;
  background: rgba(255,255,255,0.01);
}

.traj-event-item .date {
  font-size: 10px;
  color: #38bdf8;
}

.traj-event-item h5 {
  font-size: 12px;
  color: #fff;
  margin: 4px 0;
}

.traj-event-item p {
  font-size: 11px;
  color: var(--color-text-secondary);
  line-height: 1.4;
  margin-bottom: 6px;
}

.skills-learned {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.skills-learned .s-tag {
  font-size: 9px;
  background: rgba(16,185,129,0.08);
  color: #34d399;
  padding: 1px 5px;
  border-radius: 3px;
}

/* Details Right Panel */
.details-right-panel {
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  flex-shrink: 0;
  overflow-y: auto;
}

.right-section h4 {
  font-size: 12px;
  color: #fff;
  font-weight: bold;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding-bottom: 6px;
}

.rep-projects-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rep-project-card {
  padding: 10px;
  background: rgba(255,255,255,0.01);
}

.rep-project-card h5 {
  font-size: 11px;
  color: #fff;
  margin-bottom: 4px;
}

.rep-project-card .role {
  font-size: 9px;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
}

.rep-project-card .pct {
  font-size: 9px;
  color: var(--color-text-secondary);
  float: right;
  margin-top: 4px;
}

.right-section.scroll-y-section {
  flex-grow: 1;
  overflow-y: auto;
}

.milestones-timeline-simple {
  border-left: 1px solid rgba(255,255,255,0.08);
  padding-left: 12px;
  margin-left: 4px;
}

.milestones-timeline-simple .timeline-item {
  position: relative;
  margin-bottom: 12px;
  font-size: 10px;
}

.milestones-timeline-simple .timeline-item .date {
  color: var(--color-text-secondary);
  font-size: 8px;
  display: block;
}

.milestones-timeline-simple .timeline-item .bullet {
  position: absolute;
  left: -17px;
  top: 10px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-text-secondary);
}

.milestones-timeline-simple .timeline-item .bullet.green { background: var(--status-online); }
.milestones-timeline-simple .timeline-item .bullet.blue { background: var(--status-info); }
.milestones-timeline-simple .timeline-item .bullet.orange { background: var(--status-busy); }

.milestones-timeline-simple .timeline-item .title {
  color: #fff;
  font-weight: bold;
}

.milestones-timeline-simple .timeline-item .desc {
  color: var(--color-text-secondary);
  line-height: 1.3;
}
</style>
