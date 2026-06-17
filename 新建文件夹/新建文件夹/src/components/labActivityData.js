import {
  realAwardsList,
  realPatentsList,
  realAchievementProjects
} from './labAchievementData.js';

const topAwards = realAwardsList
  .filter((award) => award.image)
  .slice(0, 8);

const topPatents = realPatentsList
  .filter((patent) => patent.image)
  .slice(0, 4);

const topProjects = realAchievementProjects
  .filter((project) => project.cover)
  .slice(0, 5);

export const realCalendarEvents = {
  15: {
    title: '成果材料归档复盘会',
    summary: `完成 ${realAwardsList.length} 项赛事奖项与 ${realPatentsList.length} 项知识产权材料核验。`,
    location: '310实验室',
    attendees: '成果组'
  },
  20: {
    title: '国产AI生态项目交流',
    summary: '围绕鲲鹏、昇腾、MindSpore相关竞赛材料复盘国产AI生态应用路径。',
    location: '401学术汇报厅',
    attendees: '15人'
  },
  28: {
    title: '智能警务项目结题研讨',
    summary: '对智警杯、大数据智能警务挑战赛、公安院校科技应用成果进行项目化梳理。',
    location: '401学术汇报厅',
    attendees: '45人'
  }
};

export const realRecentLogs = [
  { date: '05-28', class: 'blue', title: '智能警务成果结题研讨', desc: '围绕智警杯与公安院校科技应用附件，完成项目群复盘。' },
  { date: '05-20', class: 'green', title: '国产AI生态成果交流', desc: '复盘鲲鹏、昇腾、MindSpore竞赛与应用创新材料。' },
  { date: '05-15', class: 'orange', title: '竞赛与知识产权台账核验', desc: `已接入 ${realAwardsList.length} 项奖项、${realPatentsList.length} 项产权附件。` }
];

export const realAnnualTrend = [
  { month: '24-09', count: 4 },
  { month: '24-12', count: 9 },
  { month: '25-03', count: 12 },
  { month: '25-06', count: 18 },
  { month: '25-09', count: 16 },
  { month: '26-03', count: 10 }
];

export const realHotActivities = [
  { title: topAwards[0]?.name || '第七届智警杯成果归档', status: '已归档', class: 'green-t' },
  { title: topProjects[0]?.title || '智能警务项目群研讨', status: '已完成', class: 'gray-t' },
  { title: topPatents[0]?.name || '知识产权附件核验', status: '已归档', class: 'green-t' }
];

export const realActivities = [
  ...topProjects.map((project, index) => ({
    id: 100 + index,
    title: `${project.title}项目复盘会`,
    type: index % 2 === 0 ? '学术交流' : '竞赛活动',
    date: index < 2 ? '2026-05-28' : '2025-12-18',
    location: index < 2 ? '401学术汇报厅' : '310实验室',
    attendees: 18 + index * 4,
    cover: project.cover,
    desc: project.desc,
    highlights: [
      `关联竞赛奖项 ${project.awardsCount || 0} 项`,
      `关联专利软著 ${project.patentsCount || 0} 项`,
      `方向：${project.direction}`
    ],
    photos: [project.cover]
  })),
  ...topAwards.map((award, index) => ({
    id: 200 + index,
    title: `${award.name}获奖材料分享`,
    type: '竞赛活动',
    date: award.date && /^\d{4}$/.test(award.date) ? `${award.date}-06-15` : '2025-06-15',
    location: '310实验室成果墙',
    attendees: 20 + (index % 5) * 3,
    cover: award.image,
    desc: `基于真实附件《${award.sourceFile || award.name}》生成的活动纪实，围绕参赛过程、证书材料、团队分工与后续成果转化展开复盘。`,
    highlights: [
      `奖项等级：${award.level}`,
      `参赛成员：${award.team}`,
      `附件类型：${award.sourceType || '图片附件'}`
    ],
    photos: [award.image]
  })),
  ...topPatents.map((patent, index) => ({
    id: 300 + index,
    title: `${patent.name}知识产权归档会`,
    type: '学术交流',
    date: '2026-04-18',
    location: '310实验室',
    attendees: 12 + index * 2,
    cover: patent.image,
    desc: `围绕${patent.type}《${patent.name}》开展材料核验、附件归档与成果展示字段整理。`,
    highlights: [
      `产权类型：${patent.type}`,
      `状态：${patent.status}`,
      `关联人员：${patent.role || '附件未标注'}`
    ],
    photos: [patent.image]
  })),
  {
    id: 400,
    title: '实验室成果台账接入评审会',
    type: '团队建设',
    date: '2026-05-15',
    location: '310实验室',
    attendees: 26,
    cover: '/assets/image8.png',
    desc: `围绕成果展示、项目动态、成员大厅和活动风采四个页面，完成真实附件数据口径统一，确保奖项、产权、项目、成员互相关联。`,
    highlights: ['统一成果数据源', '复核成员关联字段', '完成页面弹窗链路检查'],
    photos: ['/assets/image8.png', '/assets/image1.png']
  }
];

export const realFeaturedActivity = {
  id: 500,
  title: '智能实验室真实成果数据接入专项会',
  type: '学术交流',
  date: '2026-05-28',
  location: '401学术汇报厅',
  attendees: 45,
  cover: topProjects[0]?.cover || topAwards[0]?.image || '/assets/image1.png',
  desc: `围绕本地“实验室竞赛成果_附件”目录，完成 ${realAwardsList.length} 项赛事奖项、${realPatentsList.length} 项知识产权和 ${realAchievementProjects.length} 条项目化成果的页面接入与交互核验。`,
  highlights: ['成员大厅按真实成果关联生成成员档案', '成果展示直接读取奖项与产权附件', '项目动态按成果方向自动归类', '活动风采由真实成果事件生成'],
  photos: [
    topProjects[0]?.cover || '/assets/image1.png',
    topAwards[0]?.image || '/assets/image2.png'
  ]
};
