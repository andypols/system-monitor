const TIMEOUT = 1000

// Convert byte to GB
export function toGiga(byte) {
  return (byte / (1024 * 1024 * 1024)).toFixed(2)
}

function getCpuUsage(processors, processorsOld) {
  const usage = []
  for (let i = 0; i < processors.length; i++) {
    const processor = processors[i]

    if (processor.total === 0) continue

    const processorOld = processorsOld[i]
    usage.push(
      processorOld
        ? {
            user: processor.user - processorOld.user,
            kernel: processor.kernel - processorOld.kernel,
            idle: processor.idle - processorOld.idle,
            total: processor.total - processorOld.total,
          }
        : processor,
    )
  }
  return usage
}

export async function getSystemInfo(cb, processorsOld = []) {
  const [cpu, memory] = await Promise.all(
    ['cpu', 'memory'].map(item => {
        return new Promise(resolve => {
          chrome.system[item].getInfo(resolve)
        })
    }),
  )

  const data = {}
  let processors
  if (cpu) {
    processors = cpu.processors.map(({ usage }) => usage)
    data.cpu = {
      usage: getCpuUsage(processors, processorsOld)
    }
  }
  if (memory) data.memory = memory
  if (storage) data.storage = { storage }

  cb(data)
  setTimeout(() => getSystemInfo(cb, processors), TIMEOUT)
}

export const storage = {
  getPopupStatus() {
    return new Promise(resolve => {
      chrome.storage.sync.get(res => {
        if (!res.popup) res.popup = {}
        const {
          cpu = true,
          memory = true
        } = res.popup
        resolve({ cpu, memory, storage })
      })
    })
  },
  setPopupStatus(popup) {
    return new Promise(resolve => {
      chrome.storage.sync.set({ popup }, resolve)
    })
  },
}
