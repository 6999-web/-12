<template>
  <!-- Dropdown: Online Users (rendered inline or relative to target, but can also be absolute positioning) -->
  <div v-if="activeModal === 'online-users'" class="online-users-dropdown glass-panel pulse-glow-border" @click.stop>
    <div class="dropdown-header">
      <span class="bullet">></span> 在线人员速览
    </div>
    <ul class="dropdown-list">
      <li v-for="user in onlineUsersList" :key="user.name" class="dropdown-item">
        <div class="avatar-wrapper">
          <span class="avatar-placeholder">👤</span>
        </div>
        <span class="user-name">{{ user.name }}</span>
        <span class="user-status font-num">在线</span>
      </li>
    </ul>
  </div>

  <!-- Regular Modals -->
  <div v-else-if="activeModal && activeModal !== 'none'" class="modal-overlay" @click="closeModal">
    <div class="modal-window glass-panel" :class="modalSizeClass" @click.stop>
      
      <!-- 1. Space Details (Room 401) -->
      <div v-if="activeModal === 'space-details'" class="modal-content-wrapper room-details">
        <div class="modal-header">
          <h2>空间详情</h2>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body scroll-container">
          <div class="details-top">
            <div class="room-photo-card">
              <img src="/assets/image3.png" alt="401 会议室" class="room-img" style="opacity: 0.15; object-fit: cover; background-color: #0c1c3e;" />
              <div class="photo-overlay-content">
                <span class="photo-tag">401 视角</span>
              </div>
            </div>
            
            <div class="room-summary">
              <div class="room-title-row">
                <h3>401 会议室</h3>
                <span class="room-status-badge green">使用中</span>
              </div>
              <div class="room-stats-grid">
                <div class="stat-box">
                  <span class="stat-lbl">容纳人数</span>
                  <span class="stat-num font-num">20 <small>人</small></span>
                </div>
                <div class="stat-box">
                  <span class="stat-lbl">设备数量</span>
                  <span class="stat-num font-num">12 <small>台</small></span>
                </div>
                <div class="stat-box">
                  <span class="stat-lbl">今日预约数</span>
                  <span class="stat-num font-num">2 <small>场</small></span>
                </div>
              </div>
              
              <div class="room-current-meeting">
                <div class="lbl">当前状态</div>
                <div class="val"><span class="status-dot online"></span> 使用中</div>
                
                <div class="lbl">在线人数</div>
                <div class="val font-num">8 人 <span class="avatars-preview">👥👥👥 +3</span></div>
                
                <div class="lbl">当前会议</div>
                <div class="val text-highlight">项目周例会 <span class="tag green">进行中</span></div>
                
                <div class="lbl">下一场会议</div>
                <div class="val">课题组讨论会 <span class="tag gray">待开始</span></div>
              </div>
            </div>
          </div>

          <div class="details-grid-2">
            <div class="grid-card">
              <h4>空间简介</h4>
              <p class="description-text">
                401 会议室配备专业会议设备，支持多媒体演示、远程视频会议及小组讨论，适用于课题汇报、项目评审、学术交流等多种场景。
              </p>
              <h4 style="margin-top: 20px;">空间平面图</h4>
              <div class="blueprint-view">
                <div class="blueprint-table">
                  <div class="chair" v-for="i in 10" :key="i"></div>
                </div>
                <span class="blueprint-text">401平面布局</span>
              </div>
            </div>

            <div class="grid-card">
              <h4>监控预览</h4>
              <div class="monitor-carousel">
                <button class="carousel-arrow left">&lt;</button>
                <div class="monitor-viewport">
                  <img src="/assets/image3.png" alt="监控" style="width:100%; height:120px; object-fit:cover; border-radius:4px; opacity: 0.8;" />
                  <span class="monitor-tag">主视角</span>
                </div>
                <button class="carousel-arrow right">&gt;</button>
              </div>
              <div class="carousel-dots">
                <span class="dot active"></span>
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>
          </div>

          <div class="details-bottom-grid">
            <!-- 今日安排 -->
            <div class="bottom-card">
              <h4>今日安排</h4>
              <ul class="schedule-list-simple">
                <li class="active">
                  <span class="time font-num">09:30 - 11:30</span>
                  <span class="title">项目周例会</span>
                  <span class="status green">进行中</span>
                </li>
                <li>
                  <span class="time font-num">14:00 - 15:30</span>
                  <span class="title">课题组讨论会</span>
                  <span class="status gray">待开始</span>
                </li>
                <li>
                  <span class="time font-num">16:00 - 17:30</span>
                  <span class="title">成果汇报会</span>
                  <span class="status gray">待开始</span>
                </li>
              </ul>
            </div>

            <!-- 空间设备概况 -->
            <div class="bottom-card">
              <h4>空间设备概况</h4>
              <div class="chart-donut-wrapper">
                <div class="donut-chart-mock">
                  <div class="donut-center">
                    <span class="val font-num">12</span>
                    <span class="lbl">台</span>
                  </div>
                </div>
                <div class="donut-legend font-num">
                  <div class="legend-item"><span class="bullet online"></span> 在线 10台 <span class="pct">83%</span></div>
                  <div class="legend-item"><span class="bullet offline"></span> 离线 1台 <span class="pct">8%</span></div>
                  <div class="legend-item"><span class="bullet busy"></span> 维护中 1台 <span class="pct">8%</span></div>
                </div>
              </div>
            </div>

            <!-- 环境数据 -->
            <div class="bottom-card">
              <h4>环境数据</h4>
              <ul class="env-list font-num">
                <li>
                  <span class="lbl">🌡️ 温度</span>
                  <span class="val">24.3℃</span>
                  <span class="badge green">舒适</span>
                </li>
                <li>
                  <span class="lbl">💧 湿度</span>
                  <span class="val">58%</span>
                  <span class="badge green">舒适</span>
                </li>
                <li>
                  <span class="lbl">🍃 空气质量</span>
                  <span class="val">优 (28)</span>
                  <span class="badge green">优</span>
                </li>
                <li>
                  <span class="lbl">📶 网络状态</span>
                  <span class="val">125Mbps</span>
                  <span class="badge green">良好</span>
                </li>
              </ul>
            </div>

            <!-- 可用设备 -->
            <div class="bottom-card">
              <h4>可用设备</h4>
              <ul class="devices-avail-list">
                <li>
                  <span class="name">🖥️ 会议大屏</span>
                  <span class="status clickable">可用 &gt;</span>
                </li>
                <li>
                  <span class="name">📹 投影仪</span>
                  <span class="status clickable">可用 &gt;</span>
                </li>
                <li>
                  <span class="name">🎙️ 视频会议终端</span>
                  <span class="status clickable">可用 &gt;</span>
                </li>
                <li>
                  <span class="name">📝 白板屏</span>
                  <span class="status clickable">可用 &gt;</span>
                </li>
              </ul>
              <div class="more-link" style="text-align: right; font-size:12px; margin-top:5px; color:#38bdf8; cursor:pointer;">查看更多 ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Simple Device Status (3D Printer Status) -->
      <div v-else-if="activeModal === 'device-quick-status'" class="modal-content-wrapper device-quick-status-modal">
        <div class="modal-header">
          <h2>设备状态详情</h2>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body scroll-container">
          <div class="quick-top">
            <div class="device-image-box">
              <div class="cube-placeholder">3D打印机</div>
            </div>
            <div class="quick-meta">
              <div class="title-status">
                <h3>3D打印机</h3>
                <span class="tag orange">使用中</span>
              </div>
              <ul class="meta-list font-num">
                <li><span class="lbl">设备编号:</span><span class="val">3DP-310-002</span></li>
                <li><span class="lbl">设备类型:</span><span class="val">增材制造设备</span></li>
                <li><span class="lbl">所属空间:</span><span class="val">310实验室</span></li>
                <li><span class="lbl">当前位置:</span><span class="val">A区-制造角</span></li>
                <li><span class="lbl">最近心跳:</span><span class="val">2026-05-28 09:41:08</span></li>
                <li><span class="lbl">当前使用:</span><span class="val text-highlight">张子轩</span></li>
                <li><span class="lbl">网络状态:</span><span class="val"><span class="status-dot online"></span> 正常</span></li>
                <li><span class="lbl">运行时长:</span><span class="val">2小时18分</span></li>
                <li><span class="lbl">关联项目:</span><span class="val">智能制造教学演示平台</span></li>
              </ul>
            </div>
          </div>

          <div class="quick-overview-cards">
            <div class="overview-c font-num">
              <span class="icon">✅</span>
              <span class="lbl">状态正常</span>
            </div>
            <div class="overview-c warn font-num">
              <span class="icon">⚠️</span>
              <span class="lbl">耗材偏低</span>
            </div>
            <div class="overview-c font-num">
              <span class="icon">🌡️</span>
              <span class="lbl">温度正常</span>
            </div>
            <div class="overview-c font-num">
              <span class="icon">🔒</span>
              <span class="lbl">门禁正常</span>
            </div>
          </div>

          <div class="quick-footer-grid">
            <div class="f-box font-num">
              <span class="title">🕒 最近使用</span>
              <span class="text">2026-05-28 09:25</span>
              <span class="user">👤 张子轩</span>
            </div>
            <div class="f-box font-num">
              <span class="title">📅 下一预约</span>
              <span class="text">2026-05-29 10:00</span>
              <span class="user">👤 教学演示</span>
            </div>
            <div class="f-box font-num">
              <span class="title">🔔 状态提醒</span>
              <span class="text orange">⚠️ 耗材偏低</span>
              <span class="user">暂无严重警告</span>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn-primary" @click="openAdvancedDeviceDetails">查看详情</button>
            <button class="btn-outline">查看监控</button>
          </div>
        </div>
      </div>

      <!-- 3. Advanced Device Details (Large 3D Printer dashboard) -->
      <div v-else-if="activeModal === 'device-full-details'" class="modal-content-wrapper device-full-details-modal">
        <div class="modal-header">
          <h2>设备详情</h2>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body scroll-container">
          <div class="device-full-top">
            <div class="top-img-box">
              <div class="cube-placeholder">3D Printer</div>
            </div>
            <div class="top-summary font-num">
              <div class="title-row">
                <h3>3D打印机</h3>
                <span class="status-tag active">使用中</span>
                <span class="tag green-border">在线</span>
                <span class="tag blue-border">无严重告警</span>
              </div>
              <div class="summary-grid">
                <div class="summary-item"><span class="lbl">设备类型:</span><span class="val">增材制造设备</span></div>
                <div class="summary-item"><span class="lbl">所属空间:</span><span class="val">310实验室</span></div>
                <div class="summary-item"><span class="lbl">安装位置:</span><span class="val">设备区-左侧</span></div>
              </div>
            </div>
          </div>

          <div class="device-full-grid">
            <!-- 1. 基础信息 -->
            <div class="full-card">
              <h4>1 基础信息</h4>
              <ul class="full-meta-list font-num">
                <li><span class="lbl">设备编号:</span><span class="val">3DP-310-002</span></li>
                <li><span class="lbl">资产编号:</span><span class="val">ZC-3DP-2024-056</span></li>
                <li><span class="lbl">设备类型:</span><span class="val">增材制造设备</span></li>
                <li><span class="lbl">品牌/型号:</span><span class="val">FlashForge / Adventurer 5M Pro</span></li>
                <li><span class="lbl">序列号:</span><span class="val">FF5MP20240560089</span></li>
                <li><span class="lbl">所属空间:</span><span class="val">310实验室</span></li>
                <li><span class="lbl">安装位置:</span><span class="val">设备区-左侧</span></li>
                <li><span class="lbl">责任人:</span><span class="val">李明阳 (实验室工程师)</span></li>
              </ul>
            </div>

            <!-- 2. 运行状态 -->
            <div class="full-card">
              <h4>2 运行状态</h4>
              <ul class="full-meta-list font-num">
                <li><span class="lbl">当前状态:</span><span class="val text-highlight"><span class="status-dot online"></span> 使用中</span></li>
                <li><span class="lbl">当前使用人:</span><span class="val">张子轩</span></li>
                <li><span class="lbl">当前任务:</span><span class="val">教学演示打印</span></li>
                <li><span class="lbl">关联项目:</span><span class="val">智能制造教学演示平台</span></li>
                <li><span class="lbl">最近心跳:</span><span class="val">2026-05-28 09:41:08</span></li>
                <li><span class="lbl">开机时长:</span><span class="val">5天 08:36:22</span></li>
                <li><span class="lbl">网络状态:</span><span class="val text-highlight">在线 (5G)</span></li>
                <li><span class="lbl">电源状态:</span><span class="val text-highlight">正常供电</span></li>
              </ul>
              <div class="telemetry-bar font-num">
                <div class="tel-item"><span class="lbl">🔥 喷头温度</span><span class="val">215.3℃ / 220℃</span></div>
                <div class="tel-item"><span class="lbl">🛏️ 平台温度</span><span class="val">60.1℃ / 60℃</span></div>
                <div class="tel-item"><span class="lbl">⏳ 预计完成</span><span class="val">2026-05-28 14:30 (余 04:48)</span></div>
              </div>
            </div>

            <!-- 3. 使用与维护 -->
            <div class="full-card">
              <h4>3 使用与维护</h4>
              <ul class="full-meta-list font-num">
                <li><span class="lbl">今日使用时长:</span><span class="val">04:18:36</span></li>
                <li><span class="lbl">本周使用次数:</span><span class="val">6 次</span></li>
                <li><span class="lbl">下次维护时间:</span><span class="val">2026-06-05 <small class="text-highlight">(还有 8 天)</small></span></li>
                <li><span class="lbl">上次维护时间:</span><span class="val">2026-05-20</span></li>
              </ul>
              <div class="consumables font-num">
                <div class="consumable-item">
                  <div class="lbl-row"><span>PLA 耗材</span><span>62%</span></div>
                  <div class="progress-bar"><div class="fill" style="width: 62%;"></div></div>
                </div>
                <div class="consumable-item">
                  <div class="lbl-row"><span>支撑材料</span><span>38%</span></div>
                  <div class="progress-bar"><div class="fill warn" style="width: 38%;"></div></div>
                </div>
              </div>
              <div class="maint-person font-num" style="margin-top: 10px; font-size:12px;">
                <span class="lbl">维护责任人:</span> <span class="val">李明阳 (实验室工程师)</span>
              </div>
            </div>

            <!-- 4. 记录摘要 -->
            <div class="full-card logs-panel">
              <h4>4 记录摘要</h4>
              <div class="logs-grid">
                <div class="log-col">
                  <h5>最近使用</h5>
                  <ul class="log-entries font-num">
                    <li><span>张子轩 教学演示...</span><span class="date">05-28</span></li>
                    <li><span>王思远 样件打印</span><span class="date">05-28</span></li>
                    <li><span>刘昊 项目原型...</span><span class="date">05-27</span></li>
                  </ul>
                  <span class="more-link">查看全部 &gt;</span>
                </div>
                <div class="log-col">
                  <h5>维护记录</h5>
                  <ul class="log-entries font-num">
                    <li><span>定期维护 检查...</span><span class="date">05-20</span></li>
                    <li><span>清洁保养 平台...</span><span class="date">05-06</span></li>
                    <li><span>更换耗材 喷嘴</span><span class="date">04-18</span></li>
                  </ul>
                  <span class="more-link">查看全部 &gt;</span>
                </div>
                <div class="log-col">
                  <h5>告警记录</h5>
                  <ul class="log-entries font-num">
                    <li><span class="red-text">喷头温度偏高</span><span class="date">05-23</span></li>
                    <li><span>断电重启 恢复</span><span class="date">05-19</span></li>
                    <li><span class="warn-text">断料检测 提示</span><span class="date">05-12</span></li>
                  </ul>
                  <span class="more-link">查看全部 &gt;</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom: Loads and Trends -->
          <div class="full-card trends-card font-num">
            <h4>💡 运行负载 / 使用趋势</h4>
            <div class="trends-body">
              <div class="gauges-col">
                <div class="radial-gauge">
                  <div class="gauge-ring" style="background: conic-gradient(var(--status-online) 100deg, rgba(255,255,255,0.05) 0deg);"></div>
                  <div class="gauge-center">
                    <span class="val">28%</span>
                    <span class="lbl">CPU负载</span>
                  </div>
                </div>
                <div class="radial-gauge">
                  <div class="gauge-ring" style="background: conic-gradient(var(--status-info) 151deg, rgba(255,255,255,0.05) 0deg);"></div>
                  <div class="gauge-center">
                    <span class="val">42%</span>
                    <span class="lbl">内存占用</span>
                  </div>
                </div>
                <div class="trend-stats">
                  <div>今日打印时长: <strong>04:18:36</strong> <small>(日均 03:21)</small></div>
                  <div>本周打印时长: <strong>18:46:12</strong> <small class="green-text">环比 +12.5%</small></div>
                </div>
              </div>

              <div class="weekly-bar-chart">
                <div class="chart-header">近7天使用时长 (小时)</div>
                <div class="bars-container">
                  <div class="bar-col" v-for="d in weeklyData" :key="d.day">
                    <div class="bar-wrapper">
                      <div class="bar" :class="{ highlight: d.highlight }" :style="{ height: (d.val / 5 * 100) + '%' }">
                        <span class="tooltip">{{ d.val }}h</span>
                      </div>
                    </div>
                    <span class="bar-lbl">{{ d.day }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn-outline">🎥 查看监控</button>
            <button class="btn-outline">🔧 查看维护记录</button>
            <button class="btn-primary" @click="closeModal">关闭</button>
          </div>
        </div>
      </div>

      <!-- 4. Camera monitor preview -->
      <div v-else-if="activeModal === 'camera-monitor'" class="modal-content-wrapper camera-monitor-modal">
        <div class="modal-header">
          <h2>监控画面</h2>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body scroll-container">
          <div class="camera-monitor-layout">
            <div class="monitor-main-feed">
              <img src="/assets/image6.png" alt="实时监控画面" />
              <div class="monitor-hud top-left">
                <span class="status-dot online"></span>
                摄像头-01 · 在线
              </div>
              <div class="monitor-hud bottom-right font-num">LIVE 10:32:18</div>
            </div>
            <aside class="monitor-side-info font-num">
              <h3>310实验室主视角</h3>
              <p>画面状态稳定，识别到人员活动与设备运行区域。</p>
              <div class="monitor-info-grid">
                <span>空间</span><strong>310实验室</strong>
                <span>分辨率</span><strong>1920 × 1080</strong>
                <span>帧率</span><strong>30 FPS</strong>
                <span>网络</span><strong class="text-highlight">正常</strong>
              </div>
              <button class="btn-primary" @click="closeModal">关闭监控</button>
            </aside>
          </div>
        </div>
      </div>

      <!-- 5. Laboratory Operation Event Stream (Logs log table) -->
      <div v-else-if="activeModal === 'event-logs'" class="modal-content-wrapper event-logs-modal">
        <div class="modal-header">
          <h2>实验室运行事件流</h2>
          <div class="header-actions">
            <button class="btn-filter">🔍 筛选</button>
            <button class="btn-export">📥 导出</button>
            <button class="close-btn" @click="closeModal">×</button>
          </div>
        </div>
        <div class="modal-body scroll-container">
          <table class="logs-table font-num">
            <thead>
              <tr>
                <th>时间</th>
                <th>事件类型</th>
                <th>事件对象</th>
                <th>事件内容</th>
                <th>当前状态</th>
                <th>数据来源</th>
                <th style="text-align: center;">跳转</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in eventLogsList" :key="log.time">
                <td class="time-col">{{ log.time }}</td>
                <td>
                  <span class="type-tag" :class="log.typeClass">{{ log.type }}</span>
                </td>
                <td class="text-highlight">{{ log.target }}</td>
                <td class="content-col" :title="log.content">{{ log.content }}</td>
                <td>
                  <span class="status-text-glow" :class="log.statusClass">{{ log.status }}</span>
                </td>
                <td class="source-col">{{ log.source }}</td>
                <td style="text-align: center; cursor: pointer; color:#38bdf8;">🔗</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 5. Meeting Calendar (Calendar schedule timeline) -->
      <div v-else-if="activeModal === 'meeting-calendar'" class="modal-content-wrapper calendar-modal">
        <div class="modal-header">
          <div class="calendar-title-left">
            <h2>📅 会议日历</h2>
            <div class="date-navigator">
              <button class="nav-arrow">&lt;</button>
              <span class="date font-num">2026-05-28 星期四</span>
              <button class="nav-arrow">&gt;</button>
            </div>
            <span class="curr-time font-num"><span class="status-dot alert"></span> 当前时间 10:30</span>
          </div>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        
        <div class="modal-body scroll-container calendar-body-grid">
          <!-- Left Picker & Stats -->
          <div class="calendar-left-col">
            <div class="datepicker-mock glass-panel">
              <div class="dp-header font-num">&lt;&lt; 2026年5月 &gt;&gt;</div>
              <div class="dp-weekdays font-num">
                <span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>
              </div>
              <div class="dp-days font-num">
                <span class="other-month">26</span><span class="other-month">27</span>
                <span class="other-month">28</span><span class="other-month">29</span>
                <span class="other-month">30</span><span>1</span><span>2</span>
                <span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span>
                <span>10</span><span>11</span><span>12</span><span>13</span><span class="has-evt">14</span><span>15</span><span>16</span>
                <span>17</span><span>18</span><span class="has-evt">19</span><span>20</span><span class="has-evt font-num">21</span><span>22</span><span>23</span>
                <span>24</span><span>25</span><span class="has-evt">26</span><span class="has-evt">27</span><span class="active">28</span><span>29</span><span>30</span>
                <span>31</span><span class="other-month">1</span><span class="other-month">2</span>
              </div>
            </div>

            <div class="picker-stats font-num">
              <h5>今日预约概览</h5>
              <div class="stats-row">
                <div class="stat-cell blue"><span class="num">4</span><span class="lbl">预约总数</span></div>
                <div class="stat-cell green"><span class="num">1</span><span class="lbl">进行中</span></div>
                <div class="stat-cell yellow"><span class="num">2</span><span class="lbl">待开始</span></div>
                <div class="stat-cell red"><span class="num">0</span><span class="lbl">冲突数</span></div>
              </div>

              <h5 style="margin-top: 15px;">空间使用概览</h5>
              <div class="util-row">
                <div class="util-item green"><span>310实验室</span><strong>2/6</strong></div>
                <div class="util-item blue"><span>401会议室</span><strong>1/4</strong></div>
                <div class="util-item orange"><span>913会议室</span><strong>1/4</strong></div>
              </div>
            </div>
          </div>

          <!-- Middle Timeline Schedule -->
          <div class="calendar-mid-col">
            <div class="timeline-header font-num">2026-05-28 (星期四) 日程安排</div>
            <div class="timeline-scroll">
              <div class="timeline-container">
                <!-- Red line for current time 10:30 -->
                <div class="current-time-indicator" style="top: 25%;">
                  <span class="time-lbl font-num">10:30</span>
                  <div class="line"></div>
                </div>

                <!-- Hours ticks -->
                <div class="hour-tick font-num" v-for="h in timelineHours" :key="h" :style="{ top: getHourPosition(h) }">
                  {{ String(h).padStart(2, '0') }}:00
                </div>

                <!-- Meeting Blocks -->
                <div 
                  v-for="meet in calendarMeetings" 
                  :key="meet.id" 
                  class="meeting-block" 
                  :class="[meet.statusClass, { active: selectedMeetingId === meet.id }]"
                  :style="getMeetingBlockStyle(meet)"
                  @click="selectedMeetingId = meet.id"
                >
                  <div class="block-inner font-num">
                    <span class="m-time">{{ meet.timeStr }}</span>
                    <span class="m-title">{{ meet.title }}</span>
                    <span class="m-room">📍 {{ meet.room }}</span>
                    <span class="m-badge">{{ meet.statusText }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Details -->
          <div class="calendar-right-col font-num">
            <h5>• 当前选中会议</h5>
            <div v-if="selectedMeeting" class="selected-meeting-details">
              <h4>{{ selectedMeeting.title }} <span class="tag" :class="selectedMeeting.statusClass">{{ selectedMeeting.statusText }}</span></h4>
              
              <ul class="meta-details-list">
                <li><span class="lbl">会议主题:</span><span class="val">{{ selectedMeeting.title }}</span></li>
                <li><span class="lbl">时间:</span><span class="val">{{ selectedMeeting.timeStr }}</span></li>
                <li><span class="lbl">空间:</span><span class="val">{{ selectedMeeting.room }}</span></li>
                <li><span class="lbl">使用团队:</span><span class="val">{{ selectedMeeting.team }}</span></li>
                <li><span class="lbl">参与人数:</span><span class="val">{{ selectedMeeting.attendees }} 人</span></li>
                <li><span class="lbl">所需设备:</span><span class="val">{{ selectedMeeting.devices }}</span></li>
                <li><span class="lbl">当前状态:</span><span class="val" :class="selectedMeeting.statusTextClass">{{ selectedMeeting.statusDesc }}</span></li>
              </ul>
            </div>
            <div v-else class="empty-state">
              请在日程表中选择一个会议查看详情
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-outline">查看全部日程</button>
          <button class="btn-outline">查看空间详情</button>
          <button class="btn-primary" @click="closeModal">关闭</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  activeModal: {
    type: String,
    default: 'none'
  }
});

const emit = defineEmits(['close', 'open-modal']);

const closeModal = () => {
  emit('close');
};

const openAdvancedDeviceDetails = () => {
  emit('open-modal', 'device-full-details');
};

// Modal size configuration
const modalSizeClass = computed(() => {
  if (props.activeModal === 'space-details') return 'xl-modal';
  if (props.activeModal === 'device-quick-status') return 'large-modal';
  if (props.activeModal === 'device-full-details') return 'large-modal';
  if (props.activeModal === 'camera-monitor') return 'large-modal';
  if (props.activeModal === 'event-logs') return 'xl-modal';
  if (props.activeModal === 'meeting-calendar') return 'xl-modal';
  return '';
});

// Mock Online Users
const onlineUsersList = [
  { name: '张子轩' },
  { name: '李思雨' },
  { name: '王浩然' },
  { name: '陈一诺' },
  { name: '刘宇航' },
  { name: '孙雨桐' }
];

// Mock Logs Log
const eventLogsList = [
  { time: '09:39:21', type: '设备事件', typeClass: 'blue-tag', target: 'AI训练服务器集群', content: 'AI训练任务 #AIGC-0427 已完成第 36/50 轮训练，准确率 92.4%。', status: '在线', statusClass: 'green-tag', source: '设备物联网平台' },
  { time: '09:25:14', type: '告警事件', typeClass: 'red-tag', target: '3D打印机 #02', content: '材料耗尽告警已恢复，已自动补充耗材，设备恢复正常运行。', status: '已恢复', statusClass: 'green-tag', source: '设备物联网平台' },
  { time: '09:12:07', type: '项目事件', typeClass: 'green-tag', target: '智慧教学质量分析平台', content: '项目进度更新：需求分析完成，进入系统设计阶段（40%）。', status: '进行中', statusClass: 'blue-tag', source: '项目管理系统' },
  { time: '08:58:43', type: '成果事件', typeClass: 'purple-tag', target: '论文《基于知识图谱的...》', content: '论文被 IEEE Access 正式收录，DOI 已生成。', status: '已发表', statusClass: 'green-tag', source: '科研成果系统' },
  { time: '08:41:30', type: '活动事件', typeClass: 'orange-tag', target: '项目评审会', content: '会议室 401 正在进行 "智慧实验室平台" 项目评审会。', status: '进行中', statusClass: 'blue-tag', source: '活动管理系统' },
  { time: '08:15:02', type: '设备事件', typeClass: 'blue-tag', target: '大屏显示系统', content: '播放内容已更新为 "实验室科研成果展示-第15期"。', status: '在线', statusClass: 'green-tag', source: '设备物联网平台' },
  { time: '07:52:11', type: '告警事件', typeClass: 'red-tag', target: '环境传感器 #07', content: '温湿度传感器读取异常（湿度 82%），已自动校准恢复。', status: '已恢复', statusClass: 'green-tag', source: '设备物联网平台' },
  { time: '07:30:45', type: '成果事件', typeClass: 'purple-tag', target: '发明专利：一种智能...', content: '专利进入实质审查阶段，审查通知书已下发。', status: '审批中', statusClass: 'orange-tag', source: '科研成果系统' }
];

// Device Weekly data
const weeklyData = [
  { day: '05-22', val: 2.8, highlight: false },
  { day: '05-23', val: 3.6, highlight: false },
  { day: '05-24', val: 1.9, highlight: false },
  { day: '05-25', val: 2.4, highlight: false },
  { day: '05-26', val: 3.1, highlight: false },
  { day: '05-27', val: 2.6, highlight: false },
  { day: '05-28', val: 4.3, highlight: true }
];

// Meeting calendar schedule variables
const selectedMeetingId = ref(1);
const timelineHours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

const calendarMeetings = [
  { id: 1, startHour: 10, endHour: 11.5, timeStr: '10:00 - 11:30', title: '智能算法团队例会', room: '310实验室', statusText: '进行中', statusClass: 'green-block', team: '智能算法团队', attendees: 12, devices: '投影仪、会议大屏、视频会议终端、白板屏', statusDesc: '进行中 (已进行 30 分钟)', statusTextClass: 'green-text' },
  { id: 2, startHour: 14, endHour: 15.5, timeStr: '14:00 - 15:30', title: '项目评审会', room: '401会议室', statusText: '已预约', statusClass: 'blue-block', team: '项目评审小组', attendees: 8, devices: '投影仪、白板屏', statusDesc: '未开始 (今日 14:00 准时启动)', statusTextClass: 'blue-text' },
  { id: 3, startHour: 16, endHour: 17.5, timeStr: '16:00 - 17:30', title: '产品需求讨论会', room: '913会议室', statusText: '待开始', statusClass: 'orange-block', team: '前端产品部', attendees: 10, devices: '会议大屏、白板屏', statusDesc: '未开始', statusTextClass: 'orange-text' },
  { id: 4, startHour: 19, endHour: 20, timeStr: '19:00 - 20:00', title: '晚间设备巡检', room: '310实验室', statusText: '已安排', statusClass: 'purple-block', team: '运维管理组', attendees: 2, devices: '移动终端、工具箱', statusDesc: '未开始', statusTextClass: 'purple-text' }
];

const selectedMeeting = computed(() => {
  return calendarMeetings.find(m => m.id === selectedMeetingId.value) || null;
});

const getHourPosition = (hour) => {
  const minHour = 8;
  const maxHour = 20;
  const pct = ((hour - minHour) / (maxHour - minHour)) * 100;
  return `${pct}%`;
};

const getMeetingBlockStyle = (meet) => {
  const minHour = 8;
  const maxHour = 20;
  const top = ((meet.startHour - minHour) / (maxHour - minHour)) * 100;
  const height = ((meet.endHour - meet.startHour) / (maxHour - minHour)) * 100;
  return {
    top: `${top}%`,
    height: `${height}%`
  };
};
</script>

<style scoped>
/* 1. Online users dropdown positioning */
.online-users-dropdown {
  position: absolute;
  top: 135px;
  right: 24px;
  width: 200px;
  z-index: 100;
  background: var(--bg-modal);
  border-radius: 6px;
  overflow: hidden;
}

.dropdown-header {
  padding: 8px 12px;
  font-size: 13px;
  color: #38bdf8;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: 6px;
}

.dropdown-list {
  list-style: none;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px dashed rgba(0, 168, 255, 0.08);
  font-size: 13px;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.avatar-wrapper {
  margin-right: 10px;
}

.user-name {
  flex-grow: 1;
  color: #fff;
}

.user-status {
  color: var(--status-online);
  font-size: 11px;
}

/* 2. Modals layout */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(1, 4, 15, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-window {
  width: 90%;
  max-height: 90vh;
  background: var(--bg-modal);
  display: flex;
  flex-direction: column;
  box-shadow: 
    0 24px 64px rgba(0,0,0,0.8),
    0 0 40px rgba(0, 168, 255, 0.15),
    inset 0 0 20px rgba(0, 168, 255, 0.08);
  overflow: hidden;
  animation: modal-enter 0.3s ease-out;
}

@keyframes modal-enter {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.medium-modal { max-width: 600px; }
.large-modal { max-width: 960px; }
.xl-modal { max-width: 1280px; }

.modal-content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 90vh;
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  font-size: 18px;
  color: #fff;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #fff, #38bdf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  font-size: 24px;
  cursor: pointer;
  line-height: 1;
  transition: color 0.2s;
}

.close-btn:hover {
  color: var(--status-alert);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex-grow: 1;
}

.scroll-container::-webkit-scrollbar {
  width: 6px;
}

/* 3. Space Details Modal inner elements */
.details-top {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.room-photo-card {
  width: 280px;
  height: 170px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  overflow: hidden;
  position: relative;
  background: #020617;
}

.room-img {
  width: 100%;
  height: 100%;
}

.photo-overlay-content {
  position: absolute;
  bottom: 10px;
  left: 10px;
}

.photo-tag {
  background: rgba(0, 168, 255, 0.25);
  border: 1px solid var(--color-border-active);
  padding: 2px 8px;
  font-size: 11px;
  border-radius: 3px;
  color: #fff;
}

.room-summary {
  flex-grow: 1;
}

.room-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.room-status-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 3px;
  font-weight: 600;
}

.room-status-badge.green {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid var(--status-online);
  color: var(--status-online);
}

.room-stats-grid {
  display: flex;
  gap: 16px;
  margin-bottom: 15px;
}

.stat-box {
  flex: 1;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(0, 168, 255, 0.1);
  padding: 8px 12px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}

.stat-lbl {
  font-size: 11px;
  color: var(--color-text-secondary);
}

.stat-num {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  margin-top: 4px;
}

.stat-num small {
  font-size: 11px;
  font-weight: normal;
  color: var(--color-text-secondary);
}

.room-current-meeting {
  display: grid;
  grid-template-columns: 80px 1fr;
  row-gap: 8px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.room-current-meeting .val {
  color: #fff;
}

.room-current-meeting .val.text-highlight {
  color: #38bdf8;
  font-weight: bold;
}

.tag {
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 2px;
  margin-left: 6px;
}

.tag.green {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid var(--status-online);
  color: var(--status-online);
}

.tag.gray {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-text-secondary);
  color: var(--color-text-secondary);
}

.avatars-preview {
  margin-left: 10px;
  color: #38bdf8;
  font-size: 11px;
}

.details-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.grid-card {
  background: rgba(0, 168, 255, 0.02);
  border: 1px solid rgba(0, 168, 255, 0.1);
  border-radius: 6px;
  padding: 16px;
}

.grid-card h4 {
  font-size: 13px;
  color: #38bdf8;
  margin-bottom: 10px;
  border-left: 2px solid #38bdf8;
  padding-left: 8px;
}

.description-text {
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.blueprint-view {
  height: 100px;
  background: rgba(0, 168, 255, 0.04);
  border: 1px dashed var(--color-border);
  border-radius: 4px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.blueprint-table {
  width: 140px;
  height: 35px;
  border: 2px solid var(--color-border-active);
  background: rgba(0, 168, 255, 0.1);
  border-radius: 4px;
  position: relative;
}

.blueprint-text {
  position: absolute;
  bottom: 6px;
  font-size: 9px;
  color: var(--color-border-active);
}

.monitor-carousel {
  display: flex;
  align-items: center;
  gap: 10px;
}

.carousel-arrow {
  background: rgba(0, 168, 255, 0.1);
  border: 1px solid var(--color-border);
  color: #fff;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}

.monitor-viewport {
  flex-grow: 1;
  position: relative;
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

.monitor-tag {
  position: absolute;
  top: 6px;
  left: 6px;
  font-size: 9px;
  background: rgba(0,0,0,0.6);
  padding: 1px 6px;
  border-radius: 2px;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 10px;
}

.carousel-dots .dot {
  width: 6px;
  height: 6px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
}

.carousel-dots .dot.active {
  background: #38bdf8;
  box-shadow: 0 0 5px #38bdf8;
}

/* Details bottom grid */
.details-bottom-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.bottom-card {
  background: rgba(0, 168, 255, 0.02);
  border: 1px solid rgba(0, 168, 255, 0.1);
  border-radius: 6px;
  padding: 14px;
}

.bottom-card h4 {
  font-size: 13px;
  color: #38bdf8;
  margin-bottom: 12px;
  border-left: 2px solid #38bdf8;
  padding-left: 6px;
}

.schedule-list-simple {
  list-style: none;
  font-size: 11px;
}

.schedule-list-simple li {
  display: flex;
  flex-direction: column;
  padding: 6px 0;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.05);
}

.schedule-list-simple li:last-child {
  border-bottom: none;
}

.schedule-list-simple li.active {
  color: #38bdf8;
}

.schedule-list-simple .time {
  opacity: 0.7;
}

.schedule-list-simple .title {
  font-weight: bold;
  margin: 2px 0;
}

.schedule-list-simple .status {
  align-self: flex-start;
  font-size: 9px;
  padding: 0px 4px;
  border-radius: 2px;
}

.schedule-list-simple .status.green { background: rgba(16, 185, 129, 0.15); color: var(--status-online); border: 1px solid var(--status-online); }
.schedule-list-simple .status.gray { background: rgba(255,255,255,0.05); color: var(--color-text-secondary); }

/* Donut chart mock */
.chart-donut-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
}

.donut-chart-mock {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: conic-gradient(
    var(--status-online) 0deg 300deg,
    var(--status-offline) 300deg 330deg,
    var(--status-busy) 330deg 360deg
  );
  position: relative;
}

.donut-center {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 60px;
  height: 60px;
  background: var(--bg-modal);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.donut-center .val { font-size: 16px; font-weight: bold; }
.donut-center .lbl { font-size: 9px; color: var(--color-text-secondary); }

.donut-legend {
  font-size: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.donut-legend .legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.donut-legend .bullet {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  display: inline-block;
}

.donut-legend .bullet.online { background-color: var(--status-online); }
.donut-legend .bullet.offline { background-color: var(--status-offline); }
.donut-legend .bullet.busy { background-color: var(--status-busy); }

.donut-legend .pct {
  opacity: 0.6;
  margin-left: auto;
}

/* Env List */
.env-list {
  list-style: none;
  font-size: 11px;
}

.env-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.05);
}

.env-list li:last-child {
  border-bottom: none;
}

.env-list .badge {
  font-size: 9px;
  background: rgba(16, 185, 129, 0.15);
  color: var(--status-online);
  border: 1px solid var(--status-online);
  padding: 0 4px;
  border-radius: 2px;
}

/* Devices avail list */
.devices-avail-list {
  list-style: none;
  font-size: 11px;
}

.devices-avail-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.05);
}

.devices-avail-list li:last-child {
  border-bottom: none;
}

.devices-avail-list .status.clickable {
  color: var(--status-online);
  cursor: pointer;
}

/* 4. Simple Device status modal styles */
.quick-top {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.device-image-box {
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(10,34,80,0.5) 0%, rgba(3,8,22,0.8) 100%);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cube-placeholder {
  color: #38bdf8;
  font-weight: bold;
  font-size: 14px;
  text-shadow: 0 0 10px rgba(0, 168, 255, 0.5);
  border: 1px solid var(--color-border);
  padding: 8px 16px;
  border-radius: 4px;
  background: rgba(0, 168, 255, 0.05);
}

.quick-meta {
  flex-grow: 1;
}

.title-status {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.title-status h3 {
  font-size: 16px;
}

.tag.orange {
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid var(--status-busy);
  color: var(--status-busy);
}

.meta-list {
  list-style: none;
  font-size: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 8px;
  column-gap: 15px;
}

.meta-list li {
  display: flex;
}

.meta-list .lbl {
  color: var(--color-text-secondary);
  width: 75px;
  flex-shrink: 0;
}

.meta-list .val {
  color: #fff;
}

.quick-overview-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.overview-c {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(16, 185, 129, 0.2);
  padding: 10px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.overview-c.warn {
  border-color: rgba(245, 158, 11, 0.3);
  background: rgba(245, 158, 11, 0.02);
  color: var(--status-busy);
}

.overview-c .icon {
  font-size: 16px;
}

.quick-footer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  background: rgba(255,255,255,0.01);
  padding: 12px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.05);
  margin-bottom: 20px;
}

.f-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11px;
}

.f-box .title {
  color: var(--color-text-secondary);
  font-weight: 500;
}

.f-box .text {
  color: #fff;
  font-weight: bold;
}

.f-box .user {
  opacity: 0.8;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 15px;
}

.btn-primary {
  background: linear-gradient(135deg, #0066cc 0%, #00a8ff 100%);
  border: 1px solid rgba(0, 168, 255, 0.5);
  color: #fff;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 0 10px rgba(0, 168, 255, 0.3);
  transition: all 0.2s;
}

.btn-primary:hover {
  box-shadow: 0 0 15px rgba(0, 168, 255, 0.5);
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--color-border);
  color: #fff;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: rgba(0, 168, 255, 0.1);
  border-color: rgba(0, 168, 255, 0.4);
}

/* 5. Advanced Device Details modal styles */
.device-full-top {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.top-img-box {
  width: 140px;
  height: 80px;
  background: radial-gradient(circle, rgba(10,34,80,0.5) 0%, rgba(3,8,22,0.8) 100%);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.top-summary {
  flex-grow: 1;
}

.top-summary .title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.top-summary h3 {
  font-size: 18px;
}

.status-tag.active {
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid var(--status-busy);
  color: var(--status-busy);
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 2px;
}

.green-border { border: 1px solid var(--status-online); color: var(--status-online); font-size:10px; padding:1px 5px; border-radius:2px; }
.blue-border { border: 1px solid var(--status-info); color: var(--status-info); font-size:10px; padding:1px 5px; border-radius:2px; }

.summary-grid {
  display: flex;
  gap: 24px;
  font-size: 12px;
}

.summary-item .lbl {
  color: var(--color-text-secondary);
  margin-right: 6px;
}

.device-full-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.full-card {
  background: rgba(0, 168, 255, 0.02);
  border: 1px solid rgba(0, 168, 255, 0.1);
  padding: 16px;
  border-radius: 6px;
}

.full-card h4 {
  font-size: 14px;
  color: #38bdf8;
  margin-bottom: 12px;
  border-left: 2px solid #38bdf8;
  padding-left: 8px;
}

.full-meta-list {
  list-style: none;
  font-size: 12px;
}

.full-meta-list li {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.04);
}

.full-meta-list li:last-child {
  border-bottom: none;
}

.full-meta-list .lbl {
  color: var(--color-text-secondary);
}

.full-meta-list .val {
  color: #fff;
  font-weight: 500;
}

.telemetry-bar {
  margin-top: 12px;
  background: rgba(255,255,255,0.02);
  padding: 10px;
  border-radius: 4px;
  border: 1px solid rgba(0, 168, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 11px;
}

.telemetry-bar .tel-item {
  display: flex;
  justify-content: space-between;
}

.telemetry-bar .lbl {
  color: var(--color-text-secondary);
}

.telemetry-bar .val {
  color: #38bdf8;
  font-weight: bold;
}

.consumables {
  margin-top: 10px;
}

.consumable-item {
  margin-bottom: 8px;
  font-size: 11px;
}

.consumable-item .lbl-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.progress-bar {
  height: 6px;
  background: rgba(255,255,255,0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar .fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 3px;
}

.progress-bar .fill.warn {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

/* logs panel */
.logs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.log-col {
  display: flex;
  flex-direction: column;
}

.log-col h5 {
  font-size: 11px;
  color: #8da1c4;
  margin-bottom: 6px;
}

.log-entries {
  list-style: none;
  font-size: 10px;
  flex-grow: 1;
}

.log-entries li {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.03);
  color: var(--color-text-secondary);
}

.log-entries .date {
  opacity: 0.6;
}

.log-entries .red-text { color: var(--status-alert); }
.log-entries .warn-text { color: var(--status-busy); }

.log-col .more-link {
  font-size: 9px;
  color: #38bdf8;
  cursor: pointer;
  margin-top: 6px;
  align-self: flex-start;
}

/* weekly chart & loads trends */
.trends-card {
  margin-bottom: 20px;
}

.trends-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: center;
}

.gauges-col {
  display: flex;
  gap: 16px;
  align-items: center;
}

.radial-gauge {
  width: 70px;
  height: 70px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.gauge-ring {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  mask: radial-gradient(transparent 24px, #000 25px);
  -webkit-mask: radial-gradient(transparent 24px, #000 25px);
}

.gauge-center {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gauge-center .val { font-size: 13px; font-weight: bold; }
.gauge-center .lbl { font-size: 8px; color: var(--color-text-secondary); }

.trend-stats {
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.trend-stats strong {
  color: #38bdf8;
}

.weekly-bar-chart {
  display: flex;
  flex-direction: column;
}

.chart-header {
  font-size: 11px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.bars-container {
  display: flex;
  height: 80px;
  align-items: flex-end;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 4px;
}

.bar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.bar-wrapper {
  height: 60px;
  width: 12px;
  background: rgba(255,255,255,0.03);
  position: relative;
  border-radius: 2px 2px 0 0;
  display: flex;
  align-items: flex-end;
}

.bar-wrapper .bar {
  width: 100%;
  background: rgba(0, 168, 255, 0.4);
  border-radius: 2px 2px 0 0;
  transition: height 0.3s;
  position: relative;
}

.bar-wrapper .bar.highlight {
  background: #38bdf8;
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.6);
}

.bar-wrapper .bar:hover .tooltip {
  visibility: visible;
  opacity: 1;
}

.tooltip {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #020617;
  border: 1px solid var(--color-border);
  font-size: 9px;
  padding: 2px 4px;
  border-radius: 2px;
  white-space: nowrap;
  transition: opacity 0.2s;
  z-index: 10;
}

.bar-lbl {
  font-size: 9px;
  margin-top: 4px;
  opacity: 0.6;
}

/* 6. Event Logs table styles */
.event-logs-modal .modal-header {
  display: flex;
  justify-content: space-between;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-filter, .btn-export {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--color-border);
  color: #fff;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-filter:hover, .btn-export:hover {
  background: rgba(0, 168, 255, 0.1);
  border-color: var(--color-border-active);
}

.logs-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  text-align: left;
}

.logs-table th {
  border-bottom: 1px solid var(--color-border);
  padding: 12px 8px;
  color: #38bdf8;
  font-weight: 600;
}

.logs-table td {
  padding: 10px 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: var(--color-text-secondary);
}

.logs-table tbody tr:hover {
  background: rgba(0, 168, 255, 0.02);
}

.logs-table .time-col {
  color: #fff;
}

.type-tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: bold;
}

.blue-tag { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid #3b82f6; }
.red-tag { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid #ef4444; }
.green-tag { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid #10b981; }
.purple-tag { background: rgba(139, 92, 246, 0.15); color: #a78bfa; border: 1px solid #8b5cf6; }
.orange-tag { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid #f59e0b; }

.status-text-glow.green-tag { color: var(--status-online); box-shadow: none; border:none; background:none; }
.status-text-glow.blue-tag { color: var(--status-info); border:none; background:none; }
.status-text-glow.orange-tag { color: var(--status-busy); border:none; background:none; }

.content-col {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #fff;
}

/* 7. Meeting Calendar style designs */
.calendar-modal .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.calendar-title-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.date-navigator {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.03);
  padding: 4px 12px;
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.05);
}

.nav-arrow {
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  font-weight: bold;
}

.date-navigator .date {
  font-size: 13px;
  color: #fff;
}

.curr-time {
  font-size: 12px;
  color: var(--status-alert);
}

.calendar-body-grid {
  display: grid;
  grid-template-columns: 240px 1fr 280px;
  gap: 16px;
  height: 500px;
}

/* Datepicker mock styling */
.datepicker-mock {
  padding: 10px;
  border-radius: 6px;
  background: rgba(4, 15, 38, 0.5);
}

.dp-header {
  font-size: 12px;
  text-align: center;
  margin-bottom: 8px;
  color: #38bdf8;
  font-weight: bold;
}

.dp-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 10px;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
}

.dp-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  row-gap: 6px;
  font-size: 11px;
}

.dp-days span {
  padding: 2px 0;
  cursor: pointer;
  border-radius: 2px;
}

.dp-days span:hover {
  background: rgba(0, 168, 255, 0.2);
}

.dp-days span.other-month {
  opacity: 0.3;
}

.dp-days span.active {
  background: #38bdf8;
  color: #020617;
  font-weight: bold;
}

.dp-days span.has-evt {
  position: relative;
}

.dp-days span.has-evt::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #f59e0b;
}

.picker-stats {
  margin-top: 15px;
}

.picker-stats h5 {
  font-size: 12px;
  color: #38bdf8;
  margin-bottom: 8px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.stat-cell {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(0, 168, 255, 0.08);
  padding: 6px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-cell.blue .num { color: #60a5fa; }
.stat-cell.green .num { color: #34d399; }
.stat-cell.yellow .num { color: #fbbf24; }
.stat-cell.red .num { color: #f87171; }

.stat-cell .num { font-size: 16px; font-weight: bold; }
.stat-cell .lbl { font-size: 8px; color: var(--color-text-secondary); }

.util-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 10px;
}

.util-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 8px;
  background: rgba(255,255,255,0.01);
  border-left: 3px solid transparent;
  border-radius: 2px;
}

.util-item.green { border-left-color: var(--status-online); }
.util-item.blue { border-left-color: var(--status-info); }
.util-item.orange { border-left-color: var(--status-busy); }

/* Timeline middle columns */
.calendar-mid-col {
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: rgba(2, 6, 20, 0.4);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.timeline-header {
  padding: 8px 12px;
  font-size: 12px;
  color: #38bdf8;
  border-bottom: 1px solid var(--color-border);
  background: rgba(4,15,38,0.4);
}

.timeline-scroll {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
}

.timeline-container {
  height: 600px;
  position: relative;
  border-left: 1px solid rgba(255,255,255,0.1);
  margin-left: 60px;
}

.hour-tick {
  position: absolute;
  left: -60px;
  font-size: 10px;
  color: var(--color-text-secondary);
  width: 50px;
  text-align: right;
  transform: translateY(-50%);
}

.current-time-indicator {
  position: absolute;
  left: -60px;
  right: 0;
  display: flex;
  align-items: center;
  z-index: 5;
  pointer-events: none;
}

.current-time-indicator .time-lbl {
  font-size: 10px;
  color: var(--status-alert);
  width: 50px;
  text-align: right;
  font-weight: bold;
  padding-right: 4px;
}

.current-time-indicator .line {
  flex-grow: 1;
  border-bottom: 1px dashed var(--status-alert);
}

.current-time-indicator .line::before {
  content: '';
  display: block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--status-alert);
  transform: translate(-3px, -2px);
}

.meeting-block {
  position: absolute;
  left: 10px;
  right: 10px;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
  border-left: 4px solid transparent;
}

.meeting-block:hover {
  transform: scale(0.99);
}

.meeting-block.active {
  box-shadow: 0 0 15px rgba(0, 168, 255, 0.3);
}

.green-block { background: rgba(16, 185, 129, 0.1); border-left-color: var(--status-online); border: 1px solid rgba(16, 185, 129, 0.2); }
.blue-block { background: rgba(59, 130, 246, 0.1); border-left-color: var(--status-info); border: 1px solid rgba(59, 130, 246, 0.2); }
.orange-block { background: rgba(245, 158, 11, 0.1); border-left-color: var(--status-busy); border: 1px solid rgba(245, 158, 11, 0.2); }
.purple-block { background: rgba(139, 92, 246, 0.1); border-left-color: var(--status-purple); border: 1px solid rgba(139, 92, 246, 0.2); }

.block-inner {
  display: flex;
  flex-direction: column;
  font-size: 11px;
}

.block-inner .m-time { opacity: 0.7; }
.block-inner .m-title { font-weight: bold; font-size:12px; margin:2px 0; color:#fff;}
.block-inner .m-room { opacity: 0.8; }
.block-inner .m-badge {
  position: absolute;
  right: 12px;
  top: 12px;
  font-size: 9px;
  padding: 1px 5px;
  border-radius: 2px;
}

.green-block .m-badge { background: rgba(16, 185, 129, 0.2); color: var(--status-online); }
.blue-block .m-badge { background: rgba(59, 130, 246, 0.2); color: var(--status-info); }
.orange-block .m-badge { background: rgba(245, 158, 11, 0.2); color: var(--status-busy); }
.purple-block .m-badge { background: rgba(139, 92, 246, 0.2); color: var(--status-purple); }

/* Right Details column */
.calendar-right-col {
  background: rgba(0, 168, 255, 0.02);
  border: 1px solid rgba(0, 168, 255, 0.1);
  padding: 16px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
}

.calendar-right-col h5 {
  font-size: 12px;
  color: #38bdf8;
  margin-bottom: 12px;
}

.selected-meeting-details h4 {
  font-size: 14px;
  color: #fff;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selected-meeting-details .tag {
  font-size: 9px;
  padding: 1px 5px;
  border-radius: 2px;
}

.selected-meeting-details .tag.green-block { background: rgba(16, 185, 129, 0.15); color: var(--status-online); border-color: var(--status-online); }
.selected-meeting-details .tag.blue-block { background: rgba(59, 130, 246, 0.15); color: var(--status-info); border-color: var(--status-info); }

.meta-details-list {
  list-style: none;
  font-size: 12px;
}

.meta-details-list li {
  display: flex;
  flex-direction: column;
  padding: 6px 0;
  border-bottom: 1px dashed rgba(255,255,255,0.05);
}

.meta-details-list .lbl {
  color: var(--color-text-secondary);
  font-size: 11px;
}

.meta-details-list .val {
  color: #fff;
  margin-top: 2px;
  font-weight: 500;
}

.green-text { color: var(--status-online); }
.blue-text { color: var(--status-info); }
.orange-text { color: var(--status-busy); }
.purple-text { color: var(--status-purple); }

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Requested readability and positioning refinements */
.online-users-dropdown {
  position: fixed;
  top: 218px;
  right: 430px;
  width: 230px;
  z-index: 1000;
}

.dropdown-header {
  font-size: 15px;
  padding: 12px 14px;
}

.dropdown-item {
  padding: 11px 14px;
  font-size: 15px;
}

.modal-window {
  width: min(94vw, 1280px);
}

.large-modal {
  max-width: 1040px;
}

.xl-modal {
  max-width: 1360px;
}

.modal-header {
  min-height: 62px;
}

.modal-header h2 {
  font-size: 22px;
}

.modal-body {
  font-size: 15px;
}

.details-top {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 26px;
}

.room-photo-card {
  width: 320px;
  height: 190px;
}

.room-summary {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  column-gap: 22px;
  align-items: start;
}

.room-title-row,
.room-stats-grid {
  grid-column: 1 / 2;
}

.room-title-row h3 {
  font-size: 24px;
}

.room-stats-grid {
  gap: 18px;
}

.stat-box {
  min-height: 76px;
}

.stat-box .stat-lbl {
  font-size: 13px;
}

.stat-box .stat-num {
  font-size: 20px;
}

.room-current-meeting {
  grid-column: 2 / 3;
  grid-row: 1 / span 2;
  grid-template-columns: 96px minmax(0, 1fr);
  row-gap: 13px;
  column-gap: 10px;
  padding: 14px;
  border: 1px solid rgba(103, 214, 255, 0.18);
  border-radius: 6px;
  background: rgba(0, 91, 180, 0.08);
  font-size: 14px;
}

.details-grid-2 {
  gap: 22px;
}

.grid-card h4,
.bottom-card h4 {
  font-size: 16px;
}

.description-text,
.schedule-list-simple,
.env-list,
.devices-avail-list,
.donut-legend {
  font-size: 13px;
  line-height: 1.7;
}

.bottom-card {
  padding: 16px;
}

.device-quick-status-modal .modal-body {
  padding: 26px;
}

.quick-top {
  gap: 28px;
}

.device-image-box {
  width: 220px;
  height: 220px;
}

.title-status h3 {
  font-size: 22px;
}

.meta-list {
  font-size: 14px;
  row-gap: 12px;
}

.meta-list .lbl {
  width: 92px;
}

.overview-c {
  min-height: 76px;
  font-size: 14px;
}

.quick-footer-grid {
  padding: 16px;
}

.f-box {
  font-size: 13px;
  gap: 7px;
}

.event-logs-modal .modal-body {
  padding: 28px;
}

.logs-table {
  font-size: 14px;
}

.logs-table th {
  padding: 15px 10px;
}

.logs-table td {
  padding: 14px 10px;
}

.content-col {
  max-width: 430px;
}

.type-tag {
  font-size: 12px;
  padding: 3px 8px;
}

.camera-monitor-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 20px;
  min-height: 560px;
}

.monitor-main-feed {
  position: relative;
  min-height: 560px;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid rgba(103, 214, 255, 0.3);
  background: #061b3d;
}

.monitor-main-feed img {
  width: 100%;
  height: 100%;
  min-height: 560px;
  object-fit: cover;
  opacity: 0.72;
}

.monitor-hud {
  position: absolute;
  padding: 8px 12px;
  border-radius: 4px;
  background: rgba(3, 19, 48, 0.7);
  border: 1px solid rgba(103, 214, 255, 0.25);
  color: #e8f7ff;
  font-size: 14px;
}

.monitor-hud.top-left {
  top: 14px;
  left: 14px;
}

.monitor-hud.bottom-right {
  right: 14px;
  bottom: 14px;
}

.monitor-side-info {
  padding: 20px;
  border: 1px solid rgba(103, 214, 255, 0.18);
  border-radius: 8px;
  background: rgba(4, 28, 72, 0.54);
}

.monitor-side-info h3 {
  font-size: 20px;
  margin-bottom: 12px;
}

.monitor-side-info p {
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-bottom: 18px;
}

.monitor-info-grid {
  display: grid;
  grid-template-columns: 82px 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

.monitor-info-grid span {
  color: var(--color-text-secondary);
}

@media (max-width: 1180px) {
  .online-users-dropdown {
    right: 24px;
  }

  .room-summary,
  .camera-monitor-layout {
    grid-template-columns: 1fr;
  }

  .room-current-meeting {
    grid-column: 1 / -1;
    grid-row: auto;
  }
}
</style>
