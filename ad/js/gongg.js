// 站点统计功能（修复NaN问题，调整下载量增长范围）
function setupSiteStats() {
  // 网站上线日期（可根据实际情况修改）
  const launchDate = new Date('2025-09-01');
  
  // 计算运行天数
  function calculateDaysRunning() {
    const today = new Date();
    const timeDiff = today - launchDate;
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  }
  
  // 获取或初始化存储的统计数据（修复NaN问题）
  function getStoredStats() {
    try {
      const stored = localStorage.getItem('siteStats');
      const today = new Date().toDateString();
      
      if (stored) {
        const data = JSON.parse(stored);
        
        // 验证数据完整性，防止NaN
        if (typeof data !== 'object' || data === null ||
            typeof data.lastUpdate !== 'string' ||
            typeof data.totalUsers !== 'number' || isNaN(data.totalUsers) ||
            typeof data.totalDownloads !== 'number' || isNaN(data.totalDownloads)) {
          throw new Error('Invalid stats data');
        }
        
        // 如果不是同一天，更新数据
        if (data.lastUpdate !== today) {
          // 每天随机增加1-5位站长
          const newUsers = data.totalUsers + Math.floor(Math.random() * 5) + 1;
          // 每天随机增加1-8个下载量（根据需求调整）
          const newDownloads = data.totalDownloads + Math.floor(Math.random() * 8) + 1;
          const updatedData = {
            lastUpdate: today,
            totalUsers: newUsers,
            totalDownloads: newDownloads,
            daysRunning: calculateDaysRunning()
          };
          localStorage.setItem('siteStats', JSON.stringify(updatedData));
          return updatedData;
        }
        return data;
      } else {
        // 初始数据，确保不会出现NaN
        const initialData = {
          lastUpdate: today,
          totalUsers: 1250, // 初始站长数量
          totalDownloads: 8620, // 初始下载量
          daysRunning: calculateDaysRunning()
        };
        localStorage.setItem('siteStats', JSON.stringify(initialData));
        return initialData;
      }
    } catch (error) {
      console.error('Error loading stats, using initial data:', error);
      // 发生错误时使用初始数据，避免NaN
      const today = new Date().toDateString();
      const initialData = {
        lastUpdate: today,
        totalUsers: 1250,
        totalDownloads: 8620,
        daysRunning: calculateDaysRunning()
      };
      localStorage.setItem('siteStats', JSON.stringify(initialData));
      return initialData;
    }
  }
  
  // 数字动画效果
  function animateValue(element, start, end, duration) {
    // 确保开始和结束值都是有效数字
    start = isNaN(start) ? 0 : start;
    end = isNaN(end) ? 0 : end;
    
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      element.textContent = Math.floor(progress * (end - start) + start);
      element.classList.add('count-animate');
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setTimeout(() => {
          element.classList.remove('count-animate');
        }, 500);
      }
    };
    window.requestAnimationFrame(step);
  }
  
  // 初始化统计数据
  const stats = getStoredStats();
  const daysElement = document.getElementById('daysRunning');
  const usersElement = document.getElementById('站长数量');
  const downloadsElement = document.getElementById('totalDownloads');
  
  // 应用动画显示统计数据
  animateValue(daysElement, 0, stats.daysRunning, 1000);
  animateValue(usersElement, 0, stats.totalUsers, 1500);
  animateValue(downloadsElement, 0, stats.totalDownloads, 1800);
}

// 公告自动轮播功能
function setupNoticeRotation() {
  const wrapper = document.getElementById('noticeWrapper');
  const indicators = document.querySelectorAll('.indicator');
  let currentIndex = 0;
  const totalSlides = indicators.length;
  let rotationInterval;
  
  // 设置初始状态
  indicators[0].style.background = '#07377a';
  indicators[0].classList.add('active');
  
  // 开始自动轮播
  startRotation();
  
  // 自动切换公告（每5秒）
  function startRotation() {
    rotationInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateNoticePosition();
    }, 5000);
  }
  
  // 暂停自动轮播
  function pauseRotation() {
    clearInterval(rotationInterval);
  }
  
  // 更新公告位置和指示器状态
  function updateNoticePosition() {
    wrapper.style.top = `-${currentIndex * 30}px`;
    
    // 更新指示器
    indicators.forEach((indicator, index) => {
      if (index === currentIndex) {
        indicator.style.background = '#07377a';
        indicator.classList.add('active');
      } else {
        indicator.style.background = '#ccc';
        indicator.classList.remove('active');
      }
    });
  }
  
  // 为指示器添加点击事件
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      currentIndex = index;
      updateNoticePosition();
      // 点击后重置自动轮播计时器
      pauseRotation();
      startRotation();
    });
  });
  
  // 鼠标悬停时暂停轮播，离开时继续
  document.getElementById('noticeContainer').addEventListener('mouseenter', pauseRotation);
  document.getElementById('noticeContainer').addEventListener('mouseleave', startRotation);
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', () => {
  setupSiteStats();
  setupNoticeRotation();
});
