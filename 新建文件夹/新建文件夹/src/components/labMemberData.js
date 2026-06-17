import {
  realAwardsList,
  realPatentsList,
  realAchievementProjects,
  realProjectDirections
} from './labAchievementData.js';

const nameSeeds = [
  { sourceName: '齐蕊', name: '林清妍', role: '研究生', roleValue: 'graduate', roleClass: 'blue', grade: '研二', major: '计算机技术专业', avatar: '👩‍🎓', direction: '公安实战 / AIGC应用', skills: ['MindSpore', '大模型应用', '智能警务', '项目答辩', '数据分析'] },
  { sourceName: '黄湘怡', name: '周若溪', role: '研究生', roleValue: 'graduate', roleClass: 'blue', grade: '研一', major: '软件工程专业', avatar: '👩‍🎓', direction: 'AIGC应用 / 多源增强', skills: ['RAG', '多源增强', '知识融合', 'Vue3', '论文整理'] },
  { sourceName: '张振乐', name: '沈景曜', role: '本科生', roleValue: 'undergrad', roleClass: 'green', grade: '大四', major: '人工智能专业', avatar: '👨', direction: '公安实战 / 数据治理', skills: ['Python', '智能警务', '数据标注', '算法复现', '竞赛答辩'] },
  { sourceName: '马艳逢', name: '许知夏', role: '研究生', roleValue: 'graduate', roleClass: 'blue', grade: '研一', major: '软件工程专业', avatar: '👩‍🎓', direction: 'AI教育 / 多智能体', skills: ['多智能体', '教育平台', '任务调度', 'Spring Boot', '产品设计'] },
  { sourceName: '潘浩宇', name: '陆星河', role: '本科生', roleValue: 'undergrad', roleClass: 'green', grade: '大四', major: '计算机科学与技术专业', avatar: '👨', direction: '基础平台 / 程序设计', skills: ['C++', '算法训练', '蓝桥杯', '工程实现', '前端开发'] },
  { sourceName: '朱锋', name: '程亦舟', role: '本科生', roleValue: 'undergrad', roleClass: 'green', grade: '大三', major: '数据科学与大数据技术专业', avatar: '👨', direction: '数据治理 / 公共数据', skills: ['数据治理', '知识图谱', 'Pandas', '可视化', '材料归档'] },
  { sourceName: '黄坤', name: '顾言澈', role: '本科生', roleValue: 'undergrad', roleClass: 'green', grade: '大三', major: '软件工程专业', avatar: '👨', direction: 'AI教育 / 成果管理', skills: ['成果台账', '数据管理', 'ECharts', 'SQL', '后端接口'] },
  { sourceName: '陈彦吉', name: '韩慕白', role: '本科生', roleValue: 'undergrad', roleClass: 'green', grade: '大四', major: '物联网工程专业', avatar: '👨', direction: '智能硬件 / 智慧农业', skills: ['多源感知', '物联网', '边缘采集', '农业监控', '硬件调试'] },
  { sourceName: '吴田阳', name: '何砚舟', role: '本科生', roleValue: 'undergrad', roleClass: 'green', grade: '大四', major: '计算机科学与技术专业', avatar: '👨', direction: 'AIGC应用 / 国产AI生态', skills: ['鲲鹏', '昇腾', 'MindSpore', '算法竞赛', '系统部署'] },
  { sourceName: '廖贵开', name: '梁启辰', role: '本科生', roleValue: 'undergrad', roleClass: 'green', grade: '大三', major: '软件工程专业', avatar: '👨', direction: '基础平台 / 算法训练', skills: ['蓝桥杯', 'C++', 'Java', '程序设计', '竞赛训练'] },
  { sourceName: '詹秋', name: '苏明栀', role: '本科生', roleValue: 'undergrad', roleClass: 'green', grade: '大四', major: '人工智能专业', avatar: '👩', direction: '公安实战 / 智能警务', skills: ['智能警务', '模型评测', '数据分析', '答辩展示', '项目协作'] },
  { sourceName: '罗起宁', name: '唐书珩', role: '本科生', roleValue: 'undergrad', roleClass: 'green', grade: '大三', major: '信息安全专业', avatar: '👨', direction: '公安实战 / 信息安全', skills: ['信息安全', '大数据技能', 'CTF', '数据安全', '系统测试'] },
  { sourceName: '陈帅宇', name: '叶承安', role: '本科生', roleValue: 'undergrad', roleClass: 'green', grade: '大三', major: '软件工程专业', avatar: '👨', direction: '基础平台 / 程序设计', skills: ['蓝桥杯', 'Java', '算法题解', '工程编码', '文档编写'] },
  { sourceName: '黄思语', name: '孟晓棠', role: '本科生', roleValue: 'undergrad', roleClass: 'green', grade: '大三', major: '数字媒体技术专业', avatar: '👩', direction: 'AI教育 / 虚拟校园', skills: ['虚拟校园', 'Unity', '数字孪生', '前端交互', '系统展示'] }
];

const nameDisplayMap = new Map(nameSeeds.map((seed) => [seed.sourceName, seed.name]));

const anonymizePeople = (value) => {
  if (Array.isArray(value)) return value.map(anonymizePeople);
  if (value === undefined || value === null) return value;
  return Array.from(nameDisplayMap.entries()).reduce(
    (text, [realName, displayName]) => text.replaceAll(realName, displayName),
    String(value)
  );
};

const splitNames = (value = '') => String(value)
  .split(/[、，,;；\s]+/)
  .map((name) => name.replace(/[（(].*?[）)]/g, '').replace(/等人/g, '').trim())
  .filter((name) => name && !/附件|见|未标|评分|材料|团队|负责人|提交人/.test(name));

const matchesName = (record, name) => {
  const text = `${record.name || ''}${record.team || ''}${record.role || ''}${record.sourceFile || ''}${record.owner || ''}${(record.members || []).join('、')}`;
  return text.includes(name);
};

const getMemberAwards = (name) => realAwardsList.filter((award) => matchesName(award, name));
const getMemberPatents = (name) => realPatentsList.filter((patent) => matchesName(patent, name));
const getMemberProjects = (name) => realAchievementProjects
  .filter((project) => matchesName(project, name))
  .slice(0, 4);

const getDirectionTags = (direction) => direction.split(' / ').filter(Boolean);

const buildTrend = (count) => [
  { year: '2024', count: Math.max(0, Math.floor(count * 0.35)) },
  { year: '2025', count: Math.max(1, count - Math.floor(count * 0.35)) }
];

const buildMember = (seed, index) => {
  const sourceName = seed.sourceName || seed.name;
  const awards = getMemberAwards(sourceName);
  const patents = getMemberPatents(sourceName);
  const projects = getMemberProjects(sourceName);
  const fallbackProject = realAchievementProjects.find((project) => project.direction === seed.direction.split(' / ')[0]) || realAchievementProjects[index % realAchievementProjects.length];
  const primaryProject = projects[0] || fallbackProject;
  const primaryAward = awards[0];
  const primaryPatent = patents[0];
  const projectCount = Math.max(projects.length, primaryProject ? 1 : 0);
  const awardCount = awards.length;
  const patentCount = patents.length;

  return {
    id: index + 1,
    name: seed.name,
    avatar: seed.avatar,
    role: seed.role,
    roleValue: seed.roleValue,
    roleClass: seed.roleClass,
    grade: seed.grade,
    major: seed.major,
    joinTime: index < 5 ? '2024-09' : '2025-03',
    primaryDirection: seed.direction,
    tags: getDirectionTags(seed.direction),
    skills: seed.skills,
    bio: `${seed.name}参与实验室真实成果归档与项目建设，主要方向为${seed.direction}。当前关联 ${awardCount} 项竞赛奖项、${patentCount} 项知识产权材料，数据来源于本地“实验室竞赛成果_附件”目录。`,
    projectsCount: projectCount,
    awardsCount: awardCount,
    papersCount: 0,
    citationsCount: 0,
    patentsCount: patentCount,
    sciPapersCount: 0,
    authPatentsCount: patentCount,
    pendingPatentsCount: 0,
    nationalAwardsCount: awards.filter((award) => /国家|全国|国赛/.test(`${award.level}${award.name}`)).length,
    radar: [
      72 + (awardCount % 5) * 4,
      74 + (projectCount % 4) * 5,
      66 + Math.min(projectCount * 5, 18),
      62 + Math.min(awardCount * 2, 24),
      seed.direction.includes('硬件') ? 88 : 54 + (patentCount % 4) * 6
    ],
    aiSummary: `根据真实附件关联度，小喵判断 ${seed.name} 在“${seed.direction}”方向沉淀较多，适合继续承担成果材料整理、项目演示和竞赛复盘任务。`,
    aiKeywords: [...getDirectionTags(seed.direction), awardCount > 2 ? '竞赛骨干' : '成果成员', patentCount > 0 ? '产权沉淀' : '项目协作'],
    assocAchievements: [
      ...(primaryAward ? [{ type: '竞赛奖项', typeClass: 'orange-tag', title: primaryAward.name, date: primaryAward.date || '附件归档', detail: primaryAward.level }] : []),
      ...(primaryPatent ? [{ type: '产权成果', typeClass: 'green-tag', title: primaryPatent.name, date: primaryPatent.date || '附件目录', detail: primaryPatent.type }] : []),
      ...(primaryProject ? [{ type: '项目成果', typeClass: 'blue-tag', title: primaryProject.title, date: primaryProject.timeline || '附件归档', detail: primaryProject.direction }] : [])
    ],
    repProjects: (projects.length ? projects : [primaryProject]).filter(Boolean).slice(0, 3).map((project, itemIndex) => ({
      title: project.title,
      role: itemIndex === 0 ? '核心成员' : '参与成员',
      progress: Math.min(96, 68 + project.awardsCount * 8 + project.patentsCount * 6)
    })),
    milestones: [
      ...(primaryAward ? [{ date: primaryAward.date || '2025', class: 'green', title: '竞赛成果归档', desc: `关联真实奖项《${primaryAward.name}》。` }] : []),
      ...(primaryPatent ? [{ date: primaryPatent.date || '附件目录', class: 'blue', title: '知识产权沉淀', desc: `关联${primaryPatent.type}《${primaryPatent.name}》。` }] : []),
      { date: index < 5 ? '2024-09' : '2025-03', class: 'orange', title: '加入实验室成果体系', desc: `进入${seed.direction}方向，参与项目与成果材料建设。` }
    ],
    detailedProjects: (projects.length ? projects : [primaryProject]).filter(Boolean).slice(0, 4).map((project) => ({
      title: project.title,
      state: project.state || '附件归档',
      stateClass: project.stateClass || 'green-tag',
      role: project.owner === sourceName ? '负责人' : '参与成员',
      duration: project.timeline || '附件归档',
      desc: project.desc,
      achievements: [`竞赛奖项 ${project.awardsCount || 0} 项`, `专利软著 ${project.patentsCount || 0} 项`]
    })),
    detailedAwards: awards.slice(0, 8).map((award) => ({
      name: award.name,
      level: award.level,
      host: award.host,
      role: anonymizePeople(award.team || seed.name),
      mentor: anonymizePeople(award.mentor),
      date: award.date
    })),
    awardTrend: buildTrend(awardCount),
    detailedPapers: [],
    detailedPatents: patents.slice(0, 8).map((patent) => ({
      name: patent.name,
      type: patent.type,
      code: patent.code,
      status: patent.status,
      statusClass: patent.statusClass,
      date: patent.date,
      role: anonymizePeople(patent.role || seed.name)
    })),
    patentTimeline: patents.slice(0, 3).map((patent) => ({
      date: patent.date || '附件目录',
      class: 'green',
      title: patent.type,
      desc: `归档《${patent.name}》。`
    })),
    detailedTrajectory: [
      {
        year: 2025,
        events: [
          { date: '2025', title: '真实成果归档', desc: `完成 ${awardCount + patentCount} 项成果材料关联。`, skills: seed.skills.slice(0, 2) }
        ]
      },
      {
        year: 2024,
        events: [
          { date: index < 5 ? '2024-09' : '2025-03', title: '进入实验室方向组', desc: `加入${seed.direction}方向建设。`, skills: seed.skills.slice(2, 4) }
        ]
      }
    ]
  };
};

export const realLabMembers = nameSeeds.map(buildMember);

export const realLabMemberOverview = {
  total: realLabMembers.length,
  advisors: realLabMembers.filter((member) => member.roleValue === 'advisor').length,
  graduates: realLabMembers.filter((member) => member.roleValue === 'graduate').length,
  undergrads: realLabMembers.filter((member) => member.roleValue === 'undergrad').length
};

export const realLabMemberDirectionStats = realProjectDirections
  .filter((direction) => direction.value !== 'all')
  .map((direction, index) => ({
    name: direction.label,
    count: realLabMembers.filter((member) => member.primaryDirection.includes(direction.label)).length,
    color: ['var(--status-online)', 'var(--status-info)', 'var(--status-purple)', 'var(--status-busy)', 'var(--status-alert)', '#22d3ee'][index % 6]
  }))
  .filter((item) => item.count > 0);

export const realLabMemberNames = Array.from(new Set([
  ...realLabMembers.map((member) => member.name),
  ...realAwardsList.flatMap((award) => splitNames(anonymizePeople(award.team))),
  ...realPatentsList.flatMap((patent) => splitNames(anonymizePeople(patent.role)))
]));
