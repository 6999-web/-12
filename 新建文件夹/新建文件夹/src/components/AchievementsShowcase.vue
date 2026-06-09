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
          <span>本季度新增:</span>
          <strong class="green-text">+14 项</strong>
        </div>
        <div class="metric-row">
          <span>审核中成果:</span>
          <strong class="orange-text">3 项</strong>
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
                  <!-- Papers: 42/156 = 27% -> stroke-dasharray="67.8 251.2" -->
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#38bdf8" stroke-width="12" stroke-dasharray="67.8 251.2" stroke-dashoffset="0" transform="rotate(-90 50 50)"></circle>
                  <!-- Patents: 28/156 = 18% -> stroke-dasharray="45.2 251.2" -->
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" stroke-width="12" stroke-dasharray="45.2 251.2" stroke-dashoffset="-67.8" transform="rotate(-90 50 50)"></circle>
                  <!-- Awards: 36/156 = 23% -> stroke-dasharray="57.8 251.2" -->
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#fbbf24" stroke-width="12" stroke-dasharray="57.8 251.2" stroke-dashoffset="-113.0" transform="rotate(-90 50 50)"></circle>
                  <!-- Projects: 50/156 = 32% -> stroke-dasharray="80.4 251.2" -->
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8b5cf6" stroke-width="12" stroke-dasharray="80.4 251.2" stroke-dashoffset="-170.8" transform="rotate(-90 50 50)"></circle>
                </svg>
                <div class="donut-center-txt">
                  <span class="num">156</span>
                  <span class="lbl">成果总量</span>
                </div>
              </div>
              <div class="legend-list">
                <div class="legend-item"><span class="bullet" style="background:#38bdf8"></span> 论文成果: 42项 (27%)</div>
                <div class="legend-item"><span class="bullet" style="background:#10b981"></span> 专利软著: 28项 (18%)</div>
                <div class="legend-item"><span class="bullet" style="background:#fbbf24"></span> 竞赛获奖: 36项 (23%)</div>
                <div class="legend-item"><span class="bullet" style="background:#8b5cf6"></span> 项目成果: 50项 (32%)</div>
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
                <!-- 1. Paper -->
                <div class="latest-c-card" @click="activeCategory = 'papers'">
                  <div class="icon-tag paper">📄 论文</div>
                  <div class="info">
                    <h5>Multimodal Spatial-Temporal Graph Networks...</h5>
                    <p class="desc">第一作者：李明阳 · 发表期刊: IEEE T-ITS (SCI一区)</p>
                  </div>
                  <span class="date">05-28</span>
                </div>

                <!-- 2. Patent -->
                <div class="latest-c-card" @click="activeCategory = 'patents'">
                  <div class="icon-tag patent">💡 专利</div>
                  <div class="info">
                    <h5>一种智能边缘分析盒子及姿态识别方法</h5>
                    <p class="desc">发明专利 · CN20251039281.3 · 进入实审阶段</p>
                  </div>
                  <span class="date">05-20</span>
                </div>

                <!-- 3. Award -->
                <div class="latest-c-card" @click="activeCategory = 'awards'">
                  <div class="icon-tag award">🏆 奖项</div>
                  <div class="info">
                    <h5>全国大学生智能技术创新大赛一等奖</h5>
                    <p class="desc">国家级一等奖 · 获奖项目：多模态警务感知融合大平台</p>
                  </div>
                  <span class="date">05-15</span>
                </div>

                <!-- 4. Project -->
                <div class="latest-c-card" @click="activeCategory = 'projects'">
                  <div class="icon-tag project">📁 项目</div>
                  <div class="info">
                    <h5>智能无人机库周边警戒系统</h5>
                    <p class="desc">负责人：王思远 · 状态：已部署测试，关联软著已授权</p>
                  </div>
                  <span class="date">05-02</span>
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

        <!-- Bottom links/system status -->
        <div class="overview-footer-shortcuts font-num glass-panel">
          <div class="shortcut-item"><span>📚 使用指南</span></div>
          <div class="shortcut-item"><span>📊 数据中心</span></div>
          <div class="shortcut-item"><span>🔑 权限管理</span></div>
          <div class="shortcut-item"><span>❓ 帮助中心</span></div>
          <div class="system-status"><span>系统状态: </span><span class="status-dot online"></span> 正常运行</div>
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

            <!-- Projects Cards Grid -->
            <div class="projects-cards-scroll scroll-container">
              <div class="projects-grid">
                <div class="proj-card glass-panel" v-for="proj in filteredProjects" :key="proj.title">
                  <div class="cover-image-container">
                    <img :src="proj.cover" class="cover-img" alt="项目图" style="opacity: 0.25; object-fit: cover; background-color: #0c1b3d;" />
                    <span class="direction-badge">{{ proj.direction }}</span>
                  </div>
                  <div class="proj-meta">
                    <h4>{{ proj.title }}</h4>
                    <p class="desc">{{ proj.desc }}</p>
                    <div class="team-row">
                      <span>成员:</span>
                      <span class="member" v-for="m in proj.members" :key="m">👤 {{ m }}</span>
                    </div>
                    <div class="assoc-stats-row">
                      <span>📄 论文: <strong>{{ proj.papers }}</strong></span>
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
                    <div class="progress-fill" :style="{ width: (c.count / 10 * 100) + '%' }"></div>
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
                <img src="/assets/image2.png" alt="获奖证书" class="featured-img" style="opacity: 0.3; object-fit: cover; background-color:#0d1d40;" />
                <div class="img-overlay">
                  <h4>全国大学生智能技术创新大赛 2025</h4>
                  <span class="rank">国家级 一等奖</span>
                </div>
              </div>
              <div class="details">
                <p class="title"><strong>获奖项目:</strong> 多模态警务感知融合大平台</p>
                <p class="team"><strong>参赛成员:</strong> 张子轩, 陈一诺, 刘宇航</p>
                <p class="mentor"><strong>指导教师:</strong> 李明阳, 孙志强</p>
                <p class="desc">
                  多模态警务感知融合平台结合计算机视觉算法与微调大模型，提供面向嫌疑人的跨时空追踪及实时轨迹建模。现场演示答辩以出色的实战效果征服评审，在200余支高校队伍中名列前茅，斩获一等奖。
                </p>
              </div>
            </div>
          </div>

          <!-- Right: List of other awards & Pie Stats -->
          <div class="other-awards-col">
            <div class="stats-top-row">
              <div class="sum-card">
                <span class="num">36 <small>项</small></span>
                <span class="lbl">累计奖项</span>
              </div>
              <div class="sum-card">
                <span class="num">8 <small>项</small></span>
                <span class="lbl">国家一等奖</span>
              </div>
            </div>

            <div class="awards-list-box glass-panel">
              <h4>竞赛获奖列表</h4>
              <div class="awards-scroll scroll-container">
                <div class="award-row-card glass-panel" v-for="aw in awardsList" :key="aw.name">
                  <span class="medal">🥇</span>
                  <div class="txt">
                    <h5>{{ aw.name }}</h5>
                    <p class="lvl">{{ aw.level }} · 主办单位: {{ aw.host }}</p>
                    <p class="team">成员: {{ aw.team }} · 指导: {{ aw.mentor }}</p>
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
                <div class="badge-stamp">已授权</div>
                <span class="cert-title">发明专利证书</span>
                <span class="pat-name">《一种利用时空图卷积网络的边缘设备多路视频识别系统》</span>
              </div>
              <ul class="meta-details">
                <li><span>专利类型:</span> <strong>发明专利</strong></li>
                <li><span>申请号:</span> <strong>CN20251029381.5</strong></li>
                <li><span>授权公告号:</span> <strong>CN118392812B</strong></li>
                <li><span>专利权人:</span> <strong>智慧实验室</strong></li>
                <li><span>第一发明人:</span> <strong>李明阳 (导师)</strong></li>
                <li><span>关联项目:</span> <strong>多模态警务感知融合大平台</strong></li>
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
                    <th>产权名称</th>
                    <th>类型</th>
                    <th>编号/登记号</th>
                    <th>申请日期</th>
                    <th>当前状态</th>
                    <th>角色</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="pat in patentsList" :key="pat.name">
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

      <!-- 5. 论文成果 SUBPAGE -->
      <div v-else-if="activeCategory === 'papers'" class="tab-pane-papers font-num">
        <div class="papers-grid-layout">
          <!-- Left: Paper stats/theme -->
          <aside class="papers-sidebar">
            <div class="chart-box glass-panel">
              <h4>学术论文收录分布</h4>
              <ul class="paper-distribution font-num">
                <li><span>SCI 一区 (Top)</span> <strong>6 篇</strong></li>
                <li><span>SCI 二区</span> <strong>12 篇</strong></li>
                <li><span>SCI 三/四区</span> <strong>10 篇</strong></li>
                <li><span>EI 会议/期刊</span> <strong>14 篇</strong></li>
              </ul>
            </div>

            <div class="chart-box glass-panel">
              <h4>核心研究主题</h4>
              <div class="simple-bar-chart">
                <div class="chart-bar-item" v-for="thm in paperThemes" :key="thm.name">
                  <div class="lbl-row"><span>{{ thm.name }}</span><strong>{{ thm.count }}篇</strong></div>
                  <div class="progress-bar-container">
                    <div class="progress-fill" :style="{ width: (thm.count / 15 * 100) + '%', backgroundColor: thm.color }"></div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <!-- Right: Representative & Table -->
          <main class="papers-main-content">
            <div class="featured-paper-card glass-panel">
              <div class="badge-tag">🔥 最新高水平代表作</div>
              <h4>Multimodal Spatial-Temporal Graph Networks for Intelligent Target Tracking in Complex Urban Environments</h4>
              <p class="authors">作者：李明阳 (通讯作者), 张子轩 (研二), 刘宇航 (大四)</p>
              <p class="journal">发表期刊：<strong>IEEE Transactions on Intelligent Transportation Systems (T-ITS)</strong></p>
              <p class="abstract">
                <strong>摘要:</strong> 本文提出一种全新的多模态时空图神经网络架构，有效融合路面高清图像深度语义与微波雷达回波速度。通过动态自注意力对齐机制，在城市复杂交叉路口目标跟踪准确度上提升了12.5%，并在实际警务融合大平台中完成实测部署。
              </p>
              <div class="meta-row">
                <span>发表时间: <strong>2026-05</strong></span>
                <span>收录分区: <strong class="text-highlight">SCI 一区 (IF: 8.5)</strong></span>
                <span>关联项目: <strong>多模态警务感知融合大平台</strong></span>
              </div>
            </div>

            <div class="table-actions-row">
              <h3>论文台账列表</h3>
              <button class="btn-export">📥 导出论文库</button>
            </div>

            <div class="table-box glass-panel scroll-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>论文题目</th>
                    <th>作者</th>
                    <th>发表期刊/会议</th>
                    <th>发表时间</th>
                    <th>收录情况</th>
                    <th>引用</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="pap in papersList" :key="pap.title">
                    <td class="text-highlight" :title="pap.title">{{ pap.title }}</td>
                    <td>{{ pap.author }}</td>
                    <td>{{ pap.journal }}</td>
                    <td>{{ pap.date }}</td>
                    <td><span class="sci-badge">{{ pap.indexed }}</span></td>
                    <td class="text-highlight"><strong>{{ pap.citations }}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const activeCategory = ref('overview');
const selectedProjDir = ref('all');

const categories = [
  { id: 'overview', label: '成果总览', icon: '📊' },
  { id: 'projects', label: '项目成果', icon: '📁' },
  { id: 'awards', label: '奖项成果', icon: '🏆' },
  { id: 'patents', label: '产权成果', icon: '💡' },
  { id: 'papers', label: '论文成果', icon: '📄' }
];

const overviewStats = [
  { label: '成果总数', val: 156, icon: '🏆', class: '' },
  { label: '论文成果', val: 42, icon: '📄', class: 'blue-s' },
  { label: '专利软著', val: 28, icon: '💡', class: 'green-s' },
  { label: '竞赛获奖', val: 36, icon: '🥇', class: 'orange-s' }
];

const projectDirections = [
  { label: '全部项目', value: 'all' },
  { label: '公安实战', value: '公安实战' },
  { label: 'AI教育', value: 'AI教育' },
  { label: '智能硬件', value: '智能硬件' },
  { label: 'AIGC应用', value: 'AIGC应用' }
];

const projectDirectionCounts = [
  { name: '公安实战', count: 8 },
  { name: 'AI教育', count: 6 },
  { name: '智能硬件', count: 5 },
  { name: 'AIGC应用', count: 5 }
];

// Mock Logs Log
const latestLogs = [
  { time: '09:39', class: 'blue', user: '李明阳 (导师)', action: '发表了高水平SCI论文', title: 'Multimodal Spatial-Temporal Graph Networks...' },
  { time: '09:12', class: 'green', user: '刘昊 (学生)', action: '发明专利公布入册', title: '一种智能边缘分析盒子及姿态识别方法' },
  { time: '08:58', class: 'orange', user: '张子轩 (学生)', action: '带队荣获竞赛全国金奖', title: '中国机器人及人工智能大赛一等奖' },
  { time: '08:15', class: 'purple', user: '王思远 (学生)', action: '项目顺利上线可演示', title: '智能无人机库周边警戒系统' }
];

// Mock Projects
const projectsList = [
  {
    title: '多模态警务感知融合大平台',
    direction: '公安实战',
    desc: '融合边缘AI盒子和视频流时空图网络，在城市级路口实现目标跨镜头追踪和姿态预警。',
    members: ['张子轩', '陈一诺'],
    papers: 2,
    patents: 3,
    awards: 1,
    cover: '/assets/image4.png'
  },
  {
    title: '智能无人机库周边警戒系统',
    direction: '智能硬件',
    desc: '面向无网络、无市电环境的高可靠性雷达+红外防区报警，保障户外机库资产安全。',
    members: ['刘昊', '王思远'],
    papers: 1,
    patents: 2,
    awards: 1,
    cover: '/assets/image5.png'
  },
  {
    title: '智小喵大模型实验室AI大助手',
    direction: 'AIGC应用',
    desc: '在实验室内部署微调轻量化本地大模型，支持自然语言检索实验室设备与科研成果。',
    members: ['张子轩', '孙雨桐'],
    papers: 1,
    patents: 1,
    awards: 0,
    cover: '/assets/image7.png'
  },
  {
    title: '基于知识图谱的在线智慧课堂',
    direction: 'AI教育',
    desc: '实时提炼课堂教学视频动作，与后台知识大纲点位动态绑定，生成学生学习兴趣度图谱。',
    members: ['李思雨', '孙雨桐'],
    papers: 2,
    patents: 1,
    awards: 2,
    cover: '/assets/image8.png'
  }
];

const filteredProjects = computed(() => {
  if (selectedProjDir.value === 'all') return projectsList;
  return projectsList.filter(p => p.direction === selectedProjDir.value);
});

// Mock Awards
const awardsList = [
  { name: '中国机器人及人工智能大赛一等奖', level: '国家级', host: '中国人工智能学会', team: '张子轩, 刘宇航, 陈一诺', mentor: '李明阳', date: '2025-11' },
  { name: '全国智能制造技术应用创新大赛二等奖', level: '行业级/国家级', host: '工业和信息化部', team: '刘昊, 王思远', mentor: '李明阳', date: '2025-07' },
  { name: '“挑战杯”大学生课外学术科技作品竞赛二等奖', level: '国家级', host: '共青团中央', team: '张子轩, 李思雨', mentor: '李明阳', date: '2025-06' },
  { name: '蓝桥杯单片机设计省部一等奖', level: '省部级', host: '工信部人才交流中心', team: '刘昊', mentor: '无', date: '2024-05' }
];

// Mock Patents
const patentsList = [
  { name: '一种物联网多传感器融合监测网关', type: '实用新型专利', code: 'ZL20242189382.9', date: '2024-12-05', status: '已授权', statusClass: 'green-tag', role: '第一发明人' },
  { name: '机械臂柔性压力感知指尖控制电路系统', type: '实用新型专利', code: 'ZL2025204893.3', date: '2025-04-18', status: '已授权', statusClass: 'green-tag', role: '第一发明人' },
  { name: '一种利用知识图谱进行空间设备智能检索的系统', type: '发明专利', code: 'CN2025108422.3', date: '2025-09-15', status: '受理', statusClass: 'blue-tag', role: '第二发明人' },
  { name: '警务多路视频流汇聚及姿态分析算法软件', type: '软件著作权', code: '2025SR120938', date: '2025-08-20', status: '已登记', statusClass: 'green-tag', role: '第一著作权人' },
  { name: '智小喵实验室问答大模型控制系统', type: '软件著作权', code: '2025SR10822', date: '2025-06-12', status: '已登记', statusClass: 'green-tag', role: '第一著作权人' }
];

// Mock Papers
const paperThemes = [
  { name: '计算机视觉与识别', count: 14, color: '#38bdf8' },
  { name: '自然语言处理与大模型', count: 10, color: '#8b5cf6' },
  { name: '嵌入式物联网感知', count: 8, color: '#10b981' },
  { name: '智慧教育智能分析', count: 6, color: '#fbbf24' }
];

const papersList = [
  { title: 'Multimodal Spatial-Temporal Graph Networks for Intelligent Target Tracking...', author: '李明阳, 张子轩', journal: 'IEEE T-ITS', date: '2026-05', indexed: 'SCI 一区', citations: 12 },
  { title: 'Knowledge Graph Reasoning for Crime Scene Reconstruction: A Deep Learning Approach', author: '李明阳, 陈一诺', journal: 'Pattern Recognition Letters', date: '2025-08', indexed: 'SCI 二区', citations: 24 },
  { title: 'A Natural Language Interface for IoT Enabled Smart Labs: The ZhiXiaoMiao Agent', author: '张子轩, 李明阳', journal: 'IEEE L-IoT', date: '2025-07', indexed: 'SCI 三区', citations: 10 },
  { title: 'Spatial-Temporal Multi-Agent Networks for Real-time Anomaly Detection', author: '张子轩', journal: 'Journal of Intelligent Systems', date: '2025-12', indexed: 'EI', citations: 4 }
];
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
  font-size: 15px;
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
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  text-align: left;
  transition: all 0.2s;
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

/* ========================================================
   SUBPAGE: OVERVIEW
   ======================================================== */
.tab-pane-overview {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  overflow-y: auto;
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

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  padding-right: 4px;
}

.proj-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: rgba(6,18,45,0.4);
}

.cover-image-container {
  height: 120px;
  position: relative;
  background: #020617;
}

.cover-img {
  width: 100%;
  height: 100%;
}

.direction-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(56, 189, 248, 0.25);
  border: 1px solid #38bdf8;
  color: #fff;
  font-size: 9px;
  padding: 1px 6px;
  border-radius: 4px;
}

.proj-meta {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  height: 44px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.team-row {
  display: flex;
  align-items: center;
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
  height: 200px;
  background: #020617;
  border-radius: 6px;
  overflow: hidden;
}

.featured-img {
  width: 100%;
  height: 100%;
}

.img-overlay {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 12px;
  background: linear-gradient(180deg, transparent 0%, rgba(2, 6, 20, 0.9) 100%);
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
  align-items: center;
  padding: 10px 12px;
  background: rgba(255,255,255,0.01);
}

.award-row-card .medal {
  font-size: 20px;
  margin-right: 12px;
}

.award-row-card .txt {
  flex-grow: 1;
}

.award-row-card h5 {
  font-size: 12px;
  color: #fff;
  margin: 0;
}

.award-row-card .lvl { font-size: 9px; color: #fbbf24; margin: 2px 0;}
.award-row-card .team { font-size: 9px; color: var(--color-text-secondary); }

.award-row-card .date {
  font-size: 10px;
  color: var(--color-text-secondary);
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
}

.badge-stamp {
  position: absolute;
  top: 8px; right: 8px;
  border: 1px solid var(--status-online);
  color: var(--status-online);
  font-size: 8px;
  padding: 1px 4px;
  border-radius: 2px;
  text-transform: uppercase;
}

.cert-image-preview .cert-title {
  font-size: 13px;
  color: #fbbf24;
  font-weight: bold;
  letter-spacing: 2px;
}

.cert-image-preview .pat-name {
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
</style>
