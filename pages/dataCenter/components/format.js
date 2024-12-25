// 格式化日期 YYYY-MM-DD
export const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 格式化显示日期 MM月DD日
export const formatDisplayDate = (date) => {
  const d = new Date(date);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
};

// 格式化持续时间 HH:MM:SS
export const formatDuration = (seconds) => {
  if (!seconds) return '0'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
};

// 格式化配速 MM'SS"/100m
export const formatPace = (pace) => {
  if (!pace) return '0'
  const minutes = Math.floor(pace / 60)
  const seconds = Math.floor(pace % 60)
  return `${minutes}'${seconds.toString().padStart(2, '0')}"/100m`
};

// 格式化距离 添加千分位
export const formatDistance = (distance) => {
  if (!distance) return '0'
  return distance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
};

// 格式化时间段 YYYY年MM月
export const formatYearMonth = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}年${d.getMonth() + 1}月`;
};

// 格式化星期
export const formatWeekDay = (date) => {
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const d = new Date(date);
  return weekDays[d.getDay()];
};

// 获取某个日期所在的周的起止日期
export const getWeekRange = (date) => {
  const currentDate = new Date(date);
  const day = currentDate.getDay() || 7; // 将周日从0转换为7
  const monday = new Date(currentDate);
  monday.setDate(currentDate.getDate() - day + 1);
  const sunday = new Date(currentDate);
  sunday.setDate(currentDate.getDate() - day + 7);
  
  return {
    start: formatDate(monday),
    end: formatDate(sunday)
  };
};

// 获取某个日期所在月份的起止日期
export const getMonthRange = (date) => {
  const d = new Date(date);
  const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  
  return {
    start: formatDate(firstDay),
    end: formatDate(lastDay)
  };
};

// 获取某个日期所在年份的起止日期
export const getYearRange = (date) => {
  const d = new Date(date);
  const firstDay = new Date(d.getFullYear(), 0, 1);
  const lastDay = new Date(d.getFullYear(), 11, 31);
  
  return {
    start: formatDate(firstDay),
    end: formatDate(lastDay)
  };
};

// 计算两个日期之间的天数
export const getDaysBetween = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate - startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// 判断是否是同一天
export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

// 获取日期范围内的所有日期
export const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);
  
  while (currentDate <= end) {
    dates.push(formatDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};