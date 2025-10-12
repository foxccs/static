          // 1. 站点统计功能（修复NaN、负数问题，添加localStorage禁用提示）
          function setupSiteStats() {
            // 网站上线日期（可根据实际情况修改）
            const launchDate = new Date('2025-09-01');
            const storageTip = document.getElementById('storageTip');
            
            // 计算运行天数（确保非负）
            function calculateDaysRunning() {
              const today = new Date();
              const timeDiff = today - launchDate;
              return Math.max(Math.floor(timeDiff / (1000 * 60 * 60 * 24)), 0);
            }
            
            // 获取或初始化存储的统计数据（处理localStorage禁用）
            function getStoredStats() {
              try {
                // 检测localStorage是否可用
                if (!window.localStorage) throw new Error('localStorage is disabled');
                
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
                  
                  // 跨天更新数据
                  if (data.lastUpdate !== today) {
                    const newUsers = data.totalUsers + Math.floor(Math.random() * 5) + 1;
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
                  // 初始数据（确保无NaN）
                  const initialData = {
                    lastUpdate: today,
                    totalUsers: 1250,
                    totalDownloads: 8620,
                    daysRunning: calculateDaysRunning()
                  };
                  localStorage.setItem('siteStats', JSON.stringify(initialData));
                  return initialData;
                }
              } catch (error) {
                console.error('Error loading stats:', error);
                // 显示localStorage禁用提示
                storageTip.textContent = '(数据暂存不可用)';
                storageTip.style.display = 'inline';
                
                // 返回初始数据
                const today = new Date().toDateString();
                return {
                  lastUpdate: today,
                  totalUsers: 1250,
                  totalDownloads: 8620,
                  daysRunning: calculateDaysRunning()
                };
              }
            }
            
            // 数字动画效果（根据数值动态调整时长）
            function animateValue(element, start, end) {
              start = isNaN(start) ? 0 : start;
              end = isNaN(end) ? 0 : end;
              
              // 动态计算动画时长（800ms~1800ms）
              const duration = Math.min(1800, Math.max(800, end / 10));
              
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
            const usersElement = document.getElementById('totalUsers'); // 中文ID改为英文
            const downloadsElement = document.getElementById('totalDownloads');
            
            // 应用动画
            animateValue(daysElement, 0, stats.daysRunning);
            animateValue(usersElement, 0, stats.totalUsers);
            animateValue(downloadsElement, 0, stats.totalDownloads);
          }

          // 2. 公告自动轮播功能（保持原有逻辑，优化指示器交互）
          function setupNoticeRotation() {
            const wrapper = document.getElementById('noticeWrapper');
            const indicators = document.querySelectorAll('.indicator');
            let currentIndex = 0;
            const totalSlides = indicators.length;
            let rotationInterval;
            
            // 设置初始状态
            indicators[0].classList.add('active');
            
            // 开始自动轮播（每5秒切换）
            startRotation();
            
            // 自动切换逻辑
            function startRotation() {
              rotationInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % totalSlides;
                updateNoticePosition();
              }, 5000);
            }
            
            // 暂停轮播
            function pauseRotation() {
              clearInterval(rotationInterval);
            }
            
            // 更新公告位置和指示器
            function updateNoticePosition() {
              wrapper.style.top = `-${currentIndex * 30}px`;
              
              indicators.forEach((indicator, index) => {
                if (index === currentIndex) {
                  indicator.classList.add('active');
                } else {
                  indicator.classList.remove('active');
                }
              });
            }
            
            // 指示器点击事件（点击后重置轮播计时器）
            indicators.forEach((indicator, index) => {
              indicator.addEventListener('click', () => {
                currentIndex = index;
                updateNoticePosition();
                pauseRotation();
                startRotation();
              });
            });
            
            // 鼠标悬停暂停/离开继续
            document.getElementById('noticeContainer').addEventListener('mouseenter', pauseRotation);
            document.getElementById('noticeContainer').addEventListener('mouseleave', startRotation);
          }

          // 3. 页面加载完成后初始化所有功能
          window.addEventListener('DOMContentLoaded', () => {
            setupSiteStats();
            setupNoticeRotation();
          });
