import { fullAwardsList } from './labAwardsFullData.js';
import { patentImageAttachments } from './labPatentImageData.js';

const awardPdfAttachments = [
  { sourceFile: '2025AI赋能千行百业超级联赛——信访赛道.pdf', pdfUrl: '/achievement-assets/award-pdfs/award-pdf-01.pdf' },
  { sourceFile: '2025年中华职业创新创业大赛.pdf', pdfUrl: '/achievement-assets/award-pdfs/award-pdf-02.pdf' },
  { sourceFile: '2025中国国际大学生创新创业大赛.pdf', pdfUrl: '/achievement-assets/award-pdfs/award-pdf-03.pdf' },
  { sourceFile: '陈悦等人获全国大学生数学建模竞赛广西赛区三等奖.pdf', pdfUrl: '/achievement-assets/award-pdfs/award-pdf-04.pdf' },
  { sourceFile: '第十五届公安院校学生科技应用创新大赛.pdf', pdfUrl: '/achievement-assets/award-pdfs/award-pdf-05.pdf' },
  { sourceFile: '廖贵开获第十六届蓝桥杯全国软件和信息技术专业人才大赛国赛一等奖.pdf', pdfUrl: '/achievement-assets/award-pdfs/award-pdf-06.pdf' },
  { sourceFile: '王文婕等人获全国大学生数学建模竞赛广西赛区二等奖.pdf', pdfUrl: '/achievement-assets/award-pdfs/award-pdf-07.pdf' },
  { sourceFile: '杨议等人获2023年海峡两岸暨港澳地区大学生计算机创新作品赛广西赛区选拔赛特等奖.pdf', pdfUrl: '/achievement-assets/award-pdfs/award-pdf-08.pdf' },
  { sourceFile: '詹秋等人获首届大数据智能警务挑战赛特等奖.pdf', pdfUrl: '/achievement-assets/award-pdfs/award-pdf-09.pdf' },
  { sourceFile: '张芷铭等人获2023年海峡两岸暨港澳地区大学生计算机创新作品赛广西赛区选拔赛特等奖.pdf', pdfUrl: '/achievement-assets/award-pdfs/award-pdf-10.pdf' }
];

const awardTeamOverrides = {
  'award-img-001': '齐蕊',
  'award-img-002': '李章澜、齐蕊、黄湘怡、张振乐、邓旭珍',
  'award-img-003': '高怡然、黄湘怡、林艺、朱锋、郑光洋、何梓源、黄思语、覃玮琪、农雪媚、潘浩宇',
  'award-img-004': '齐蕊、方乔、黄湘怡',
  'award-img-005': '高怡然、黄湘怡、沈洁、马艳逢、农熏衣',
  'award-img-006': '马艳逢、张振乐、陈悦、林艺、郑光洋',
  'award-img-007': '李章澜、黄湘怡、李培明、陈彦吉、高彩凤',
  'award-img-008': '李章澜、黄湘怡、高彩凤、李培明、陈彦吉',
  'award-img-009': '沈洁、翟宇佳、曾环、韦堡钟、杨祥臻',
  'award-img-010': '朱婉婷、陈春荣、植芯儿、陈红铭、施婷、李佳欣、梁诗海、黄丽桔、姜洲、宾映红、李欣雨、谢文诗、陈俐冰、秦少婷、许家嘉、朱为、蒋佳桐、谭伊心',
  'award-img-011': '李欣雨、谢文诗、陈俐冰、秦少婷',
  'award-img-012': '附件评分表未标明具体个人',
  'award-img-013': '朱为（负责人）',
  'award-img-014': '黎熙颖（负责人）',
  'award-img-015': '附件评分表未标明具体个人',
  'award-img-016': '黄彩菊（材料提交人）',
  'award-img-017': '李佳欣（负责人）',
  'award-img-018': '陈鹏丞、齐蕊、秦健翔、陈悦、郑光洋、韦堡钟、马艳逢、陈彦吉、张馨月、农熏衣、张振乐、罗起宁、何梓源、郑壁旋、吴东泽',
  'award-img-019': '吴东泽、沈洁、张龄雯、韦堡钟、秦振凯、高怡然',
  'award-img-021': '黄坤、朱锋、潘浩宇、农雪媚、郑光洋',
  'award-img-022': '邓旭珍、梁雪怡、郭树昌、潘思翰、张振乐',
  'award-img-036': '齐蕊、张振乐、吴东泽、李培明',
  'award-img-037': '马艳逢、邓旭珍、农熏衣、陈彦吉、黄湘怡、黄思语、韦建良、陈永梧',
  'award-img-045': '附件未标明具体个人',
  'award-img-076': '韦建良、曾环、马艳逢',
  'award-img-077': '方乔、潘浩宇、李章澜',
  'award-img-078': '朱锋、黄坤、张振乐',
  'award-img-079': '黄湘怡',
  'award-img-080': '农熏衣、秦健翔、曾环',
  'award-img-081': '马艳逢、杨祥、黄坤',
  'award-img-082': '农熏衣、秦健翔、曾环',
  'award-img-083': '杨祥、马艳逢、齐蕊',
  'award-img-084': '李玲莹、高彩凤、李章澜',
  'award-img-085': '张振乐、方乔、沈洁',
  'award-img-086': '曾环、黄湘怡、梁雪怡',
  'award-img-087': '沈洁、罗起宁、杨祥、方贻辑、覃玮琪',
  'award-img-088': '向秋焱、朱锋、黄湘怡、陈彦吉、齐蕊',
  'award-img-091': '黄湘怡',
  'award-img-092': '齐蕊',
  'award-img-093': '李培明',
  'award-img-094': '张振乐',
  'award-img-104': '黄坤、马艳逢、张振乐、农熏衣、秦健翔',
  'award-pdf-003': '附件未标明具体个人'
};

const normalizeAwardAttachmentName = (value) => String(value || '')
  .replace(/\.[a-z0-9]+$/i, '')
  .replace(/\([0-9]+\)$/g, '')
  .replace(/[获荣获得]/g, '')
  .replace(/[\s_—\-·“”"《》（）()]/g, '')
  .toLowerCase();

const findAwardPdf = (award) => {
  const normalizedAwardSource = normalizeAwardAttachmentName(award.sourceFile || award.name);
  const normalizedAwardName = normalizeAwardAttachmentName(award.name);
  const sourceMatchedPdf = awardPdfAttachments.find((attachment) => {
    const normalizedPdf = normalizeAwardAttachmentName(attachment.sourceFile);
    return normalizedAwardSource.includes(normalizedPdf)
      || normalizedPdf.includes(normalizedAwardSource);
  });
  if (sourceMatchedPdf) return sourceMatchedPdf;
  return awardPdfAttachments.find((attachment) => {
    const normalizedPdf = normalizeAwardAttachmentName(attachment.sourceFile);
    return normalizedAwardName.includes(normalizedPdf)
      || normalizedPdf.includes(normalizedAwardName);
  });
};

export const realAwardsList = fullAwardsList.map((award) => {
  const matchedPdf = findAwardPdf(award);
  return {
    ...award,
    ...(awardTeamOverrides[award.id] ? { team: awardTeamOverrides[award.id] } : {}),
    ...(matchedPdf ? { pdfUrl: matchedPdf.pdfUrl } : {})
  };
});

export const realPatentsList = [
  { name: '一种基于大语言模型的多模态实体识别方法', type: '发明专利', code: '附件/说明书', date: '附件目录', status: '已归档', statusClass: 'green-tag', role: '附件未标注', image: '/achievement-assets/patent-multimodal-entity.png' },
  { name: '基于大语言模型的多模态文档结构化处理与知识提取方法', type: '发明专利', code: '附件/说明书', date: '附件目录', status: '已归档', statusClass: 'green-tag', role: '附件未标注' },
  { name: '一种基于新闻来源可信度的舆情知识图谱过滤方法', type: '发明专利', code: '附件/说明书', date: '附件目录', status: '已归档', statusClass: 'green-tag', role: '附件未标注' },
  { name: '一种基于知识图谱的案件笔录中多重证据关联方法', type: '发明专利', code: '附件/说明书', date: '附件目录', status: '已归档', statusClass: 'green-tag', role: '附件未标注' },
  { name: '基于知识图谱的动态职业能力与岗位匹配的教育评估方法', type: '发明专利', code: '附件/说明书', date: '附件目录', status: '已归档', statusClass: 'green-tag', role: '附件未标注' },
  { name: '一种基于深度学习的医疗实体识别与关系抽取方法', type: '发明专利', code: '附件/说明书', date: '附件目录', status: '已归档', statusClass: 'green-tag', role: '附件未标注' },
  { name: '一种摄像头升降结构', type: '实用新型专利', code: '附件/说明书', date: '附件目录', status: '已归档', statusClass: 'green-tag', role: '附件未标注' },
  { name: '一种教室计时器', type: '实用新型专利', code: '附件/说明书', date: '附件目录', status: '已归档', statusClass: 'green-tag', role: '附件未标注' },
  { name: '一种舆情采集装置', type: '实用新型专利', code: '附件/说明书', date: '附件目录', status: '已归档', statusClass: 'green-tag', role: '附件未标注' },
  { name: '基于MindSpore的智能语音审讯记录系统', type: '软件著作权', code: 'PDF附件', date: '附件目录', status: '已登记', statusClass: 'green-tag', role: '齐蕊' },
  { name: '基于向量检索与RAG技术的知识融合生成系统', type: '软件著作权', code: 'PDF附件', date: '附件目录', status: '已登记', statusClass: 'green-tag', role: '附件未标注' },
  { name: '基于多智能体链式推理的任务自动化编排系统', type: '软件著作权', code: 'PDF附件', date: '附件目录', status: '已登记', statusClass: 'green-tag', role: '附件未标注' },
  { name: '基于多模态深度特征的AI换脸检测系统', type: '软件著作权', code: 'PDF附件', date: '附件目录', status: '已登记', statusClass: 'green-tag', role: '附件未标注' },
  { name: '基于深度伪造识别与安全溯源的AI换脸防范系统', type: '软件著作权', code: 'PDF附件', date: '附件目录', status: '已登记', statusClass: 'green-tag', role: '附件未标注' },
  { name: '基于多源感知技术的农业监控系统', type: '软件著作权', code: 'PDF附件', date: '附件目录', status: '已登记', statusClass: 'green-tag', role: '陈彦吉' },
  { name: '基于大数据分析的智能农业决策支持系统', type: '软件著作权', code: 'PDF附件', date: '附件目录', status: '已登记', statusClass: 'green-tag', role: '附件未标注' },
  { name: '基于人工智能的编程实训教学平台', type: '软件著作权', code: 'PDF附件', date: '附件目录', status: '已登记', statusClass: 'green-tag', role: '附件未标注' },
  { name: '基于知识图谱的产教融合实验教学平台', type: '软件著作权', code: 'PDF附件', date: '附件目录', status: '已登记', statusClass: 'green-tag', role: '附件未标注' },
  { name: '智校方舟多智能体协同调度平台', type: '软件著作权', code: 'PDF附件', date: '附件目录', status: '已登记', statusClass: 'green-tag', role: '马艳逢' },
  { name: '智校方舟教育服务运营管理平台', type: '软件著作权', code: 'PDF附件', date: '附件目录', status: '已登记', statusClass: 'green-tag', role: '马艳逢' },
  { name: '桂警展虚拟校园展示平台', type: '软件著作权', code: 'PDF附件', date: '附件目录', status: '已登记', statusClass: 'green-tag', role: '黄思语' },
  { name: '虚拟校园安全监控与设备管理系统', type: '软件著作权', code: 'PDF附件', date: '附件目录', status: '已登记', statusClass: 'green-tag', role: '黄思语' },
  { name: '高校学生成果数据管理系统', type: '软件著作权', code: 'PDF附件', date: '附件目录', status: '已登记', statusClass: 'green-tag', role: '黄坤' },
  { name: '高校学生成果智能分析系统', type: '软件著作权', code: 'PDF附件', date: '附件目录', status: '已登记', statusClass: 'green-tag', role: '黄坤' }
];

export const realAchievementProjects = [
  {
    id: 1,
    title: '大数据智能警务竞赛作品群',
    direction: '公安实战',
    state: '附件归档',
    stateClass: 'green-tag',
    cover: '/achievement-assets/zhijing-llm.png',
    desc: '来源于智警杯、大数据智能警务挑战赛、公安院校科技应用创新大赛等真实获奖材料，围绕警用大模型、大数据技能和智能警务实战作品沉淀。',
    owner: '见附件证书',
    members: ['汤祖懿', '詹秋', '罗起宁', '潘浩宇'],
    papersCount: 0,
    patentsCount: 2,
    awardsCount: 8,
    timeline: '2024 至 2025'
  },
  {
    id: 2,
    title: '公共数据开放与数据要素应用平台',
    direction: '数据治理',
    state: '附件归档',
    stateClass: 'green-tag',
    cover: '/achievement-assets/public-data-first.jpg',
    desc: '对应第四届广西公共数据开放创新应用大赛一等奖/二等奖及2025年数据要素大赛材料，沉淀公共数据开放、知识图谱过滤和成果数据管理能力。',
    owner: '朱锋',
    members: ['向秋焱', '黄坤'],
    papersCount: 0,
    patentsCount: 3,
    awardsCount: 3,
    timeline: '2024 至 2025'
  },
  {
    id: 3,
    title: '蓝桥杯与程序设计竞赛训练体系',
    direction: '基础平台',
    state: '附件归档',
    stateClass: 'green-tag',
    cover: '/achievement-assets/lanqiao-national-first.jpg',
    desc: '来自第十五届、第十六届蓝桥杯国赛/广西赛区获奖以及码蹄杯、南宁市程序设计竞赛材料，用于支撑算法训练、竞赛备赛与编程实训。',
    owner: '廖贵开',
    members: ['潘浩宇', '陈帅宇', '吴田阳'],
    papersCount: 0,
    patentsCount: 2,
    awardsCount: 9,
    timeline: '2024 至 2025'
  },
  {
    id: 4,
    title: 'AI赋能信访与法律智能体应用',
    direction: 'AIGC应用',
    state: '附件归档',
    stateClass: 'orange-tag',
    cover: '/achievement-assets/ai-petition.png',
    desc: '来源于2025AI赋能千行百业超级联赛信访赛道与CAIL2025智能体模拟调解赛道获奖材料，结合大模型、多智能体链式推理和RAG系统。',
    owner: '汤祖懿',
    members: ['黄湘怡', '见附件证书'],
    papersCount: 0,
    patentsCount: 4,
    awardsCount: 2,
    timeline: '2025 至今'
  },
  {
    id: 5,
    title: '智慧农业与多源感知系统',
    direction: '智能硬件',
    state: '附件归档',
    stateClass: 'blue-tag',
    cover: '/achievement-assets/smart-agriculture.jpg',
    desc: '对应广西AI赋能千行百业超级联赛智慧农业创新大赛，以及多源感知农业监控、智能农业决策支持相关知识产权。',
    owner: '陈彦吉',
    members: ['见附件证书'],
    papersCount: 0,
    patentsCount: 2,
    awardsCount: 1,
    timeline: '2025 至今'
  },
  {
    id: 6,
    title: '智慧教育与产教融合实验平台',
    direction: 'AI教育',
    state: '附件归档',
    stateClass: 'green-tag',
    cover: '/achievement-assets/ai-programming-platform.png',
    desc: '来源于基于人工智能的编程实训教学平台、基于知识图谱的产教融合实验教学平台、动态职业能力与岗位匹配教育评估方法等真实产权材料。',
    owner: '马艳逢',
    members: ['黄坤', '见附件证书'],
    papersCount: 0,
    patentsCount: 5,
    awardsCount: 1,
    timeline: '2024 至 2026'
  },
  {
    id: 7,
    title: '国产AI生态应用创新项目群',
    direction: 'AIGC应用',
    state: '附件归档',
    stateClass: 'green-tag',
    cover: '/achievement-assets/kunpeng-2025.jpg',
    desc: '来自鲲鹏应用创新大赛、鲲鹏创新大赛华南区域赛、昇腾AI创新大赛、MindSpore昇思大赛等材料，沉淀国产算力与AI框架应用经验。',
    owner: '吴田阳',
    members: ['朱锋', '潘浩宇'],
    papersCount: 0,
    patentsCount: 1,
    awardsCount: 6,
    timeline: '2024 至 2025'
  }
];

export const realProjectDirections = [
  { label: '全部项目方向', value: 'all' },
  { label: '公安实战', value: '公安实战' },
  { label: 'AI教育', value: 'AI教育' },
  { label: '智能硬件', value: '智能硬件' },
  { label: 'AIGC应用', value: 'AIGC应用' },
  { label: '数据治理', value: '数据治理' },
  { label: '基础平台', value: '基础平台' }
];

const normalizeAttachmentName = (value) => String(value || '')
  .replace(/\.[a-z0-9]+$/i, '')
  .replace(/\([0-9]+\)$/g, '')
  .replace(/[\s_———\-·“”"《》（）()、]/g, '')
  .toLowerCase();

const findPatentImage = (patentName) => {
  const normalizedPatentName = normalizeAttachmentName(patentName);
  return patentImageAttachments.find((attachment) => {
    const normalizedFile = normalizeAttachmentName(attachment.sourceFile);
    return normalizedFile.includes(normalizedPatentName) || normalizedPatentName.includes(normalizedFile);
  });
};

const getAwardDirection = (award) => {
  const text = `${award.name}${award.team}${award.sourceFile}`;
  if (/蓝桥|码蹄|程序设计|计算机设计/.test(text)) return '基础平台';
  if (/智警|警务|公安|信息安全|CAIL|法律|开源情报/.test(text)) return '公安实战';
  if (/公共数据|数据要素|数学建模|数据/.test(text)) return '数据治理';
  if (/农业|摄像头|计时器|采集装置|仿真/.test(text)) return '智能硬件';
  if (/AI|昇腾|鲲鹏|MindSpore|华为|腾讯/.test(text)) return 'AIGC应用';
  return 'AI教育';
};

const getPatentDirection = (patent) => {
  const text = `${patent.name}${patent.type}`;
  if (/教育|教学|职业|学生|校园/.test(text)) return 'AI教育';
  if (/农业|摄像头|计时器|采集装置/.test(text)) return '智能硬件';
  if (/知识图谱|数据|文档|成果/.test(text)) return '数据治理';
  if (/审讯|案件|舆情/.test(text)) return '公安实战';
  return 'AIGC应用';
};

realPatentsList.forEach((patent) => {
  if (!patent.image) {
    const matchedImage = findPatentImage(patent.name);
    if (matchedImage) patent.image = matchedImage.image;
  }
});

const attachmentAwardProjects = realAwardsList.map((award, index) => ({
  id: 1000 + index,
  title: award.name,
  direction: getAwardDirection(award),
  state: '附件归档',
  stateClass: 'green-tag',
  cover: award.image || '',
  pdfUrl: award.pdfUrl || '',
  desc: `来源：${award.sourceType || '赛事奖项附件'}；附件文件：${award.sourceFile || award.name}`,
  owner: award.team || '附件未标明具体个人',
  members: [award.team || '附件未标明具体个人'],
  papersCount: 0,
  patentsCount: 0,
  awardsCount: 1,
  timeline: award.date || '附件归档'
}));

const attachmentPatentProjects = realPatentsList.map((patent, index) => ({
  id: 2000 + index,
  title: patent.name,
  direction: getPatentDirection(patent),
  state: '附件归档',
  stateClass: 'green-tag',
  cover: patent.image || '',
  desc: `来源：知识产权附件；类型：${patent.type}；编号/登记：${patent.code}`,
  owner: patent.role || '附件未标明具体个人',
  members: [patent.role || '附件未标明具体个人'],
  papersCount: 0,
  patentsCount: 1,
  awardsCount: 0,
  timeline: patent.date || '附件归档'
}));

realAchievementProjects.push(...attachmentAwardProjects, ...attachmentPatentProjects);

realPatentsList.forEach((patent) => {
  patent.date = '附件目录';
  if (patent.role === '实验室成果') patent.role = '附件未标注';
});

realAchievementProjects.forEach((project) => {
  project.state = '附件归档';
  project.stateClass = 'green-tag';
  project.progress = project.patentsCount + project.awardsCount;
});

export const getDirectionCounts = (projects) => {
  return realProjectDirections
    .filter((direction) => direction.value !== 'all')
    .map((direction) => ({
      name: direction.label,
      count: projects.filter((project) => project.direction === direction.value).length
    }))
    .filter((item) => item.count > 0);
};

export const getProjectPhaseDistribution = (projects) => {
  return [{
    phase: '附件归档',
    count: projects.filter((project) => project.state === '附件归档').length
  }];
};

export const getOverviewStats = () => [
  { label: '成果总数', val: realAwardsList.length + realPatentsList.length + realAchievementProjects.length, icon: '🏆', class: '' },
  { label: '竞赛获奖', val: realAwardsList.length, icon: '🥇', class: 'orange-s' },
  { label: '专利软著', val: realPatentsList.length, icon: '💡', class: 'green-s' },
  { label: '项目分组', val: realAchievementProjects.length, icon: '📁', class: 'blue-s' }
];
