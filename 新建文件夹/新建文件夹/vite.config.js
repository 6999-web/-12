import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const sendJson = (res, payload) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

const labDataApiPlugin = () => ({
  name: 'lab-data-api',
  configureServer(server) {
    server.middlewares.use('/api/lab', async (req, res, next) => {
      try {
        const [achievementData, memberData, activityData] = await Promise.all([
          server.ssrLoadModule('/src/components/labAchievementData.js'),
          server.ssrLoadModule('/src/components/labMemberData.js'),
          server.ssrLoadModule('/src/components/labActivityData.js')
        ])

        if (req.url?.startsWith('/members')) {
          sendJson(res, {
            members: memberData.realLabMembers,
            overview: memberData.realLabMemberOverview,
            directions: memberData.realLabMemberDirectionStats,
            names: memberData.realLabMemberNames
          })
          return
        }

        if (req.url?.startsWith('/achievements')) {
          sendJson(res, {
            awards: achievementData.realAwardsList,
            patents: achievementData.realPatentsList,
            projects: achievementData.realAchievementProjects,
            directions: achievementData.realProjectDirections,
            overviewStats: achievementData.getOverviewStats()
          })
          return
        }

        if (req.url?.startsWith('/projects')) {
          sendJson(res, {
            projects: achievementData.realAchievementProjects,
            directions: achievementData.realProjectDirections,
            directionCounts: achievementData.getDirectionCounts(achievementData.realAchievementProjects)
          })
          return
        }

        if (req.url?.startsWith('/activities')) {
          sendJson(res, {
            activities: activityData.realActivities,
            featuredActivity: activityData.realFeaturedActivity,
            recentLogs: activityData.realRecentLogs,
            annualTrend: activityData.realAnnualTrend,
            hotActivities: activityData.realHotActivities,
            calendarEvents: activityData.realCalendarEvents
          })
          return
        }

        sendJson(res, { ok: true, endpoints: ['members', 'achievements', 'projects', 'activities'] })
      } catch (error) {
        next(error)
      }
    })
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), labDataApiPlugin()],
  server: {
    proxy: {
      '/api': {
        target: 'https://38.76.205.127',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
