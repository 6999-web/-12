<template>
  <div class="activity-showcase-container cockpit-page">
    <aside class="activity-left glass-panel font-num">
      <div class="panel-title">
        <span>📅</span>
        <div>
          <h3>活动风采</h3>
          <p>真实成果事件生成</p>
        </div>
      </div>

      <div class="overview-grid">
        <article v-for="item in activitySummaryCards" :key="item.label">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      </div>

      <section class="timeline-section">
        <h4>活动实时流</h4>
        <div class="activity-timeline scroll-container">
          <article v-for="log in recentLogs" :key="log.title">
            <span :class="log.class"></span>
            <time>{{ log.date }}</time>
            <strong>{{ log.title }}</strong>
            <p>{{ log.desc }}</p>
          </article>
        </div>
      </section>
    </aside>

    <main class="activity-center glass-panel font-num">
      <div class="activity-toolbar">
        <div class="segmented">
          <button
            v-for="filter in filters"
            :key="filter.value"
            type="button"
            :class="{ active: selectedFilter === filter.value }"
            @click="selectedFilter = filter.value"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <div class="activity-scroll scroll-container">
        <section v-if="latestActivity" class="featured-activity glass-panel">
          <div class="featured-cover">
            <img :src="latestActivity.cover" :alt="latestActivity.title" />
            <span>{{ latestActivity.type }}</span>
          </div>
          <div class="featured-info">
            <time>{{ latestActivity.date }}</time>
            <h4>{{ latestActivity.title }}</h4>
            <p>{{ latestActivity.desc }}</p>
            <div class="featured-meta">
              <span>地点：{{ latestActivity.location }}</span>
              <span>参与：{{ latestActivity.attendees }}人</span>
              <button type="button" @click="openActivityDetail(latestActivity)">查看纪实</button>
            </div>
          </div>
        </section>

        <section
          ref="activityTrack"
          class="activity-grid"
          @mouseenter="autoScrollPaused = true"
          @mouseleave="autoScrollPaused = false"
        >
          <button
            v-for="activity in carouselActivities"
            :key="activity.id"
            type="button"
            class="activity-card glass-panel"
            @click="openActivityDetail(activity)"
          >
            <div class="activity-image">
              <img :src="activity.cover" :alt="activity.title" />
              <span>{{ activity.type }}</span>
            </div>
            <div>
              <time>{{ activity.date }}</time>
              <h4>{{ activity.title }}</h4>
              <p>{{ activity.desc }}</p>
              <div class="card-meta">
                <span>{{ activity.location }}</span>
                <span>{{ activity.attendees }}人</span>
              </div>
            </div>
          </button>
        </section>

        <section class="trend-panel glass-panel">
          <h4>2025-2026 活动热度趋势</h4>
          <div class="sparkline-chart">
            <article v-for="item in annualTrend" :key="item.month">
              <i><em :style="{ height: trendHeight(item.count) }"></em></i>
              <b>{{ item.count }}</b>
              <span>{{ item.month }}</span>
            </article>
          </div>
        </section>
      </div>
    </main>

    <aside class="activity-right glass-panel font-num">
      <section>
        <h3>实验室日历看板</h3>
        <div class="mini-calendar glass-panel">
          <div class="calendar-head">2026年5月</div>
          <div class="weekdays">
            <span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span>
          </div>
          <div class="days">
            <button
              v-for="day in calendarDays"
              :key="`${day.month}-${day.day}`"
              type="button"
              :class="{ other: day.other, event: day.event, active: selectedCalendarDay === day.day && !day.other }"
              @click="selectCalendarDay(day)"
            >
              {{ day.day }}
            </button>
          </div>
          <div class="calendar-event-panel">
            <time>05-{{ String(selectedCalendarDay).padStart(2, '0') }}</time>
            <h4>{{ selectedCalendarEvent.title }}</h4>
            <p>{{ selectedCalendarEvent.summary }}</p>
            <span>{{ selectedCalendarEvent.location }} · {{ selectedCalendarEvent.attendees }}</span>
          </div>
        </div>
      </section>

      <section>
        <h3>热门活动榜</h3>
        <div class="hot-list">
          <article v-for="(activity, index) in hotActivities" :key="activity.title">
            <b>0{{ index + 1 }}</b>
            <div>
              <strong>{{ activity.title }}</strong>
              <span :class="activity.class">{{ activity.status }}</span>
            </div>
          </article>
        </div>
      </section>

      <section class="ask-card glass-panel">
        <h3>活动问小喵</h3>
        <p>围绕真实成果附件生成活动纪实，可继续用于汇报、复盘和宣传展示。</p>
        <button type="button" @click="selectedFilter = 'contest'">查看竞赛活动</button>
      </section>
    </aside>

    <div v-if="activeActivity" class="detail-dialog-overlay" @click="activeActivity = null">
      <div class="activity-dialog glass-panel font-num" @click.stop>
        <header>
          <div>
            <h3>{{ activeActivity.title }}</h3>
            <p>{{ activeActivity.type }} · {{ activeActivity.date }}</p>
          </div>
          <button type="button" @click="activeActivity = null">×</button>
        </header>
        <div class="dialog-body scroll-container">
          <div class="dialog-top">
            <div class="dialog-cover">
              <img :src="activeActivity.cover" :alt="activeActivity.title" />
            </div>
            <div>
              <p>{{ activeActivity.desc }}</p>
              <ul>
                <li>地点：{{ activeActivity.location }}</li>
                <li>参与人数：{{ activeActivity.attendees }}人</li>
              </ul>
            </div>
          </div>
          <section v-if="activeActivity.highlights?.length">
            <h4>精彩看点 / 成果转化</h4>
            <ul class="highlights-list">
              <li v-for="item in activeActivity.highlights" :key="item">{{ item }}</li>
            </ul>
          </section>
          <section v-if="activeActivity.photos?.length">
            <h4>精彩掠影</h4>
            <div class="photos-grid">
              <img v-for="photo in activeActivity.photos" :key="photo" :src="photo" alt="活动相册" />
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { fetchLabApi } from './labDataApi';
import {
  realActivities,
  realAnnualTrend,
  realCalendarEvents,
  realFeaturedActivity,
  realHotActivities,
  realRecentLogs
} from './labActivityData';

const activities = ref(realActivities);
const featuredActivity = ref(realFeaturedActivity);
const recentLogs = ref(realRecentLogs);
const annualTrend = ref(realAnnualTrend);
const hotActivities = ref(realHotActivities);
const calendarEvents = ref(realCalendarEvents);
const selectedFilter = ref('all');
const activeActivity = ref(null);
const selectedCalendarDay = ref(28);
const activityTrack = ref(null);
const autoScrollPaused = ref(false);
let autoScrollTimer = 0;

onMounted(async () => {
  await nextTick();
  startActivityAutoScroll();

  const data = await fetchLabApi('activities', {
    activities: realActivities,
    featuredActivity: realFeaturedActivity,
    recentLogs: realRecentLogs,
    annualTrend: realAnnualTrend,
    hotActivities: realHotActivities,
    calendarEvents: realCalendarEvents
  });
  activities.value = data.activities || realActivities;
  featuredActivity.value = data.featuredActivity || realFeaturedActivity;
  recentLogs.value = data.recentLogs || realRecentLogs;
  annualTrend.value = data.annualTrend || realAnnualTrend;
  hotActivities.value = data.hotActivities || realHotActivities;
  calendarEvents.value = data.calendarEvents || realCalendarEvents;
  await nextTick();
  if (activityTrack.value) activityTrack.value.scrollLeft = 0;
  startActivityAutoScroll();
});

onUnmounted(() => {
  stopActivityAutoScroll();
});

const filters = [
  { label: '全部活动', value: 'all' },
  { label: '学术交流', value: 'academic' },
  { label: '竞赛活动', value: 'contest' },
  { label: '对外参访', value: 'visit' },
  { label: '团队建设', value: 'teambuilding' }
];

const typeMap = {
  academic: '学术交流',
  contest: '竞赛活动',
  visit: '对外参访',
  teambuilding: '团队建设'
};

const filteredActivities = computed(() => {
  if (selectedFilter.value === 'all') return activities.value;
  return activities.value.filter((activity) => activity.type === typeMap[selectedFilter.value]);
});

const featuredMatchesFilter = computed(() => selectedFilter.value === 'all' || featuredActivity.value.type === typeMap[selectedFilter.value]);

const sortedVisibleActivities = computed(() => {
  const list = [...filteredActivities.value];
  if (featuredMatchesFilter.value && featuredActivity.value) list.push(featuredActivity.value);
  return list.sort((a, b) => {
    const dateDiff = Date.parse(b.date || '') - Date.parse(a.date || '');
    if (Number.isFinite(dateDiff) && dateDiff !== 0) return dateDiff;
    return Number(b.id || 0) - Number(a.id || 0);
  });
});

const latestActivity = computed(() => sortedVisibleActivities.value[0] || null);
const carouselActivities = computed(() => sortedVisibleActivities.value.slice(1));

const stopActivityAutoScroll = () => {
  if (!autoScrollTimer) return;
  clearInterval(autoScrollTimer);
  autoScrollTimer = 0;
};

const startActivityAutoScroll = () => {
  stopActivityAutoScroll();
  autoScrollTimer = window.setInterval(stepActivityAutoScroll, 32);
};

const stepActivityAutoScroll = () => {
  const track = activityTrack.value;
  if (!track || autoScrollPaused.value) return;

  const maxScroll = track.scrollWidth - track.clientWidth;
  if (maxScroll <= 2) return;

  track.scrollLeft += 1.8;

  if (track.scrollLeft >= maxScroll - 1) {
    track.scrollLeft = 0;
  }
};

watch(
  () => [selectedFilter.value, carouselActivities.value.length],
  async () => {
    await nextTick();
    if (activityTrack.value) activityTrack.value.scrollLeft = 0;
    startActivityAutoScroll();
  }
);

const activitySummary = computed(() => ({
  total: activities.value.length + (featuredActivity.value ? 1 : 0),
  month: activities.value.filter((activity) => activity.date.startsWith('2026-05')).length + (featuredActivity.value?.date?.startsWith('2026-05') ? 1 : 0),
  attendees: activities.value.reduce((sum, activity) => sum + Number(activity.attendees || 0), Number(featuredActivity.value?.attendees || 0)),
  reports: activities.value.filter((activity) => activity.cover).length + (featuredActivity.value?.cover ? 1 : 0)
}));

const activitySummaryCards = computed(() => [
  { label: '\u7d2f\u8ba1\u6d3b\u52a8', value: activitySummary.value.total },
  { label: '\u672c\u6708\u4e3e\u529e', value: activitySummary.value.month },
  { label: '\u5a92\u4f53\u6750\u6599', value: activitySummary.value.reports }
]);

const calendarDays = computed(() => [
  { month: 4, day: 27, other: true },
  { month: 4, day: 28, other: true },
  { month: 4, day: 29, other: true },
  { month: 4, day: 30, other: true },
  ...Array.from({ length: 31 }, (_, index) => {
    const day = index + 1;
    return { month: 5, day, event: Boolean(calendarEvents.value[day]) };
  })
]);

const selectedCalendarEvent = computed(() => calendarEvents.value[selectedCalendarDay.value] || {
  title: '实验室开放日常',
  summary: '当日暂无重点活动安排，实验室保持常规开放与项目自研节奏。',
  location: '310实验室',
  attendees: '常规值守'
});

const maxTrend = computed(() => Math.max(...annualTrend.value.map((item) => item.count), 1));
const trendHeight = (count) => `${Math.max(8, Math.round((count / maxTrend.value) * 100))}%`;

const selectCalendarDay = (day) => {
  if (day.other) return;
  selectedCalendarDay.value = day.day;
};

const openActivityDetail = (activity) => {
  activeActivity.value = activity;
};
</script>

<style scoped>
.activity-showcase-container {
  height: calc(100vh - 121px);
  width: 100%;
  display: grid;
  grid-template-columns: 300px minmax(560px, 1fr) 300px;
  gap: 18px;
  padding: 18px 22px;
  overflow: hidden;
}

.activity-left,
.activity-center,
.activity-right {
  min-height: 0;
  overflow: hidden;
}

.activity-left,
.activity-right {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
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
.activity-right h3 {
  color: #fff;
  font-size: 19px;
}

.panel-title p,
.ask-card p {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.overview-grid article {
  min-height: 78px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(67, 183, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
}

.overview-grid span {
  font-size: 12px;
}

.overview-grid strong {
  color: #fff;
  font-size: 24px;
}

.timeline-section {
  flex: 1;
  min-height: 0;
}

.timeline-section h4,
.trend-panel h4,
.dialog-body h4 {
  color: #eaf8ff;
  font-size: 15px;
  margin-bottom: 10px;
  padding-left: 8px;
  border-left: 2px solid #43b7ff;
}

.activity-timeline {
  height: calc(100% - 32px);
  overflow-y: auto;
  border-left: 1px solid rgba(67, 183, 255, 0.28);
  padding-left: 16px;
}

.activity-timeline article {
  position: relative;
  margin-bottom: 16px;
}

.activity-timeline article > span {
  position: absolute;
  left: -21px;
  top: 8px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #43b7ff;
  box-shadow: 0 0 10px currentColor;
}

.activity-timeline article > span.green {
  background: #2ee6a6;
}

.activity-timeline article > span.orange {
  background: #ffae42;
}

.activity-timeline time,
.featured-info time,
.activity-card time,
.calendar-event-panel time {
  color: #72e7ff;
  font-size: 12px;
}

.activity-timeline strong,
.hot-list strong {
  display: block;
  color: #fff;
  font-size: 13px;
}

.activity-timeline p {
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.5;
}

.activity-center {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.activity-toolbar {
  flex-shrink: 0;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(67, 183, 255, 0.2);
}

.segmented {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.segmented button,
.featured-meta button,
.ask-card button {
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid rgba(67, 183, 255, 0.38);
  border-radius: 6px;
  background: rgba(13, 58, 103, 0.72);
  color: #cbeeff;
  cursor: pointer;
}

.segmented button.active,
.featured-meta button {
  background: linear-gradient(180deg, rgba(42, 162, 255, 0.78), rgba(8, 70, 142, 0.82));
  color: #fff;
}

.activity-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.featured-activity {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 16px;
  min-height: 210px;
  padding: 12px;
  margin-bottom: 16px;
}

.featured-cover,
.activity-image,
.dialog-cover {
  position: relative;
  background: #020617;
  border: 1px solid rgba(57, 166, 255, 0.22);
  border-radius: 6px;
  overflow: hidden;
}

.featured-cover img,
.activity-image img,
.dialog-cover img,
.photos-grid img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.92;
}

.featured-cover span,
.activity-image span {
  position: absolute;
  left: 10px;
  top: 10px;
  border-radius: 4px;
  border: 1px solid rgba(67, 183, 255, 0.34);
  background: rgba(16, 77, 133, 0.72);
  color: #dff7ff;
  font-size: 12px;
  padding: 3px 8px;
}

.featured-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.featured-info h4,
.activity-card h4 {
  color: #fff;
  font-size: 18px;
  line-height: 1.35;
}

.featured-info p,
.activity-card p,
.calendar-event-panel p,
.dialog-body p,
.dialog-body li {
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.55;
}

.featured-meta,
.card-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px dashed rgba(67, 183, 255, 0.18);
  font-size: 12px;
}

.activity-grid {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(280px, 340px);
  grid-template-columns: none;
  gap: 14px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 10px;
}

.activity-card {
  display: flex;
  flex-direction: column;
  min-height: 286px;
  padding: 0;
  text-align: left;
  cursor: pointer;
  overflow: hidden;
}

.activity-image {
  height: 132px;
  border-width: 0 0 1px;
  border-radius: 8px 8px 0 0;
}

.activity-card > div:last-child {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.activity-card p {
  max-height: 42px;
  overflow: hidden;
}

.trend-panel {
  padding: 14px;
  margin-top: 16px;
}

.sparkline-chart {
  height: 120px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.sparkline-chart article {
  flex: 1;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr auto auto;
  justify-items: center;
  gap: 4px;
}

.sparkline-chart i {
  width: 16px;
  height: 82px;
  display: flex;
  align-items: flex-end;
  border-radius: 99px;
  background: rgba(12, 53, 93, 0.74);
  overflow: hidden;
}

.sparkline-chart em {
  width: 100%;
  display: block;
  border-radius: inherit;
  background: linear-gradient(180deg, #34edc3, #43b7ff);
}

.sparkline-chart b {
  color: #fff;
  font-size: 12px;
}

.sparkline-chart span {
  font-size: 11px;
}

.mini-calendar {
  padding: 12px;
}

.calendar-head {
  text-align: center;
  color: #72e7ff;
  font-weight: 800;
  margin-bottom: 8px;
}

.weekdays,
.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  text-align: center;
}

.weekdays span {
  font-size: 12px;
}

.days button {
  min-height: 26px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.days button.other {
  opacity: 0.25;
  cursor: default;
}

.days button.event {
  border-color: rgba(67, 183, 255, 0.48);
  background: rgba(67, 183, 255, 0.14);
  color: #dff7ff;
}

.days button.active {
  background: #43b7ff;
  color: #020617;
  font-weight: 800;
}

.calendar-event-panel {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid rgba(67, 183, 255, 0.2);
  border-radius: 6px;
  background: rgba(67, 183, 255, 0.06);
}

.calendar-event-panel h4 {
  color: #fff;
  font-size: 14px;
  margin: 4px 0;
}

.calendar-event-panel span {
  display: block;
  color: #bfe7ff;
  font-size: 12px;
  margin-top: 6px;
}

.hot-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hot-list article {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px;
  border: 1px solid rgba(67, 183, 255, 0.18);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.02);
}

.hot-list b {
  color: #ffae42;
  font-size: 20px;
}

.hot-list span {
  font-size: 12px;
}

.ask-card {
  padding: 12px;
  margin-top: auto;
}

.ask-card button {
  width: 100%;
  margin-top: 10px;
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

.activity-dialog {
  width: min(840px, 92vw);
  max-height: 86vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.activity-dialog header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 18px;
  border-bottom: 1px solid rgba(67, 183, 255, 0.24);
}

.activity-dialog h3 {
  color: #fff;
}

.activity-dialog header p {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.activity-dialog button {
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
  grid-template-columns: 280px 1fr;
  gap: 18px;
}

.dialog-cover {
  height: 190px;
}

.dialog-body ul {
  padding-left: 18px;
  margin-top: 10px;
}

.highlights-list li {
  margin-bottom: 6px;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.photos-grid img {
  height: 92px;
  border-radius: 6px;
  border: 1px solid rgba(57, 166, 255, 0.22);
}

@media (max-width: 1180px) {
  .activity-showcase-container {
    grid-template-columns: 260px 1fr;
  }

  .activity-right {
    display: none;
  }
}
</style>
