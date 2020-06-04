import {getSystemInfo} from './utils';
import ActivityIcon from './activity-icon';
const ICON_SIZE = 19;
const BORDER_WIDTH = 2;

const colourConfig = {
  cpu: {
    border: '#1874cd',
    background: '#4876ff',
  },
  memory: {
    border: '#008744',
    background: '#66cdaa',
  },
}

// 3 => [1, 1, 1]
function fill(count) {
  const arr = []
  for(let i = 0; i < count; i += 1) {
    arr.push(1)
  }
  return arr
}

const cpuIdleArray = fill(ICON_SIZE);
const activityIcon = new ActivityIcon(colourConfig.cpu);

getSystemInfo(({cpu: {usage}}) => {
  const idle = usage.reduce((a, b) => a + b.idle / b.total, 0) / usage.length

  cpuIdleArray.push(idle)
  cpuIdleArray.shift();
  chrome.browserAction.setTitle({
    title: `Usage: ${(100 * (1 - idle)).toFixed(0)}%`
  })
  activityIcon.update(cpuIdleArray);
  chrome.browserAction.setIcon({
    imageData: activityIcon.getImageData()
  })
})
