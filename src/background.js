import {getSystemInfo} from './utils';
import ActivityIcon from './activity-icon';

const activityIcon = new ActivityIcon({border: '#1874cd', background: '#4876ff'});

getSystemInfo(({cpu: {usage}}) => {
  const totals = usage.reduce((acc, core) => {
    return {
      idle: acc.idle + core.idle,
      user: acc.user + core.user,
      total: acc.total + core.total,
      kernel: acc.kernel + core.kernel
    }
  }, {idle: 0, total: 0, kernel: 0, user: 0})

  console.log({
    '@timestamp': new Date().toISOString(),
    browser: "Andy's Chrome",
    cpu: {
      totalValue: totals.total,
      idleValue: totals.idle,
      idlePct: (totals.idle / totals.total * 100).toFixed(0),
      kernelValue: totals.kernel,
      kernelPct:(totals.kernel / totals.total * 100).toFixed(0),
      userValue: totals.user,
      userPct: (totals.user / totals.total * 100).toFixed(0)
    }
  });

  chrome.browserAction.setTitle({
    title: `Usage: ${(100 * (1 - totals.idle)).toFixed(0)}%`
  })

  activityIcon.update(totals.idle);
  chrome.browserAction.setIcon({
    imageData: activityIcon.getImageData()
  })
})
