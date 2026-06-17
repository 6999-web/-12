export const fetchPrinterDashboard = async () => {
  const response = await fetch('/api/bambuddy/dashboard');
  if (!response.ok) throw new Error(`接口返回 ${response.status}`);
  return response.json();
};

export const formatPrinterNumber = (value, digits = 0) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return '--';
  return number.toLocaleString('zh-CN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
};

export const getPrinterCards = (dashboard) => {
  const data = dashboard || {};
  const printsByPrinter = data.prints_by_printer || {};
  const accuracyByPrinter = data.time_accuracy_by_printer || {};
  const totalPrints = Number(data.total_prints) || 0;

  return Object.keys(printsByPrinter).map((name, index) => {
    const prints = Number(printsByPrinter[name]) || 0;
    const share = totalPrints > 0 ? (prints / totalPrints) * 100 : 0;
    return {
      id: `3DP-310-${String(index + 1).padStart(3, '0')}`,
      name,
      model: name === 'P1SC' ? 'Bambu Lab P1S Combo' : 'Bambu Lab 3D Printer',
      location: '310实验室',
      prints,
      accuracy: formatPrinterNumber(accuracyByPrinter[name], 1),
      share: formatPrinterNumber(share, 1),
      status: prints > 0 ? '在线' : '暂无记录'
    };
  });
};

export const getFilamentStats = (dashboard) => {
  const stats = dashboard?.prints_by_filament_type || {};
  return Object.entries(stats).map(([name, count]) => ({ name, count }));
};
