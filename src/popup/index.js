import React, { Component, Fragment } from 'react'
import { render } from 'react-dom'
import { getSystemInfo, storage } from '../utils'
import CpuComponent from './cpu'
import MemoryComponent from './memory'
import StorageComponent from './storage'

class Container extends Component {
  state = {
    status: {
      cpu: false,
      memory: false,
      storage: false
    },
    supportBatteryAPI: false,
    cpu: {
      modelName: '',
      usage: [],
      temperatures: [],
    },
    memory: {
      capacity: 1,
      availableCapacity: 1,
    },
    storage: { storage: [] }
  }

  async componentDidMount() {
    const status = await storage.getPopupStatus()
    this.setState({ status }, async () => {
      // Trigger CPU, memory and storage status update periodly
      getSystemInfo(this.setState.bind(this))

      // Battery
      if (typeof navigator.getBattery === 'function') {
        this.setState({
          supportBatteryAPI: true,
        })
      }
    })
  }

  render() {
    const { state } = this

    return (
      <div style={{ width: 230 }}>
        {state.status.cpu && <CpuComponent {...state.cpu} />}
        {state.status.memory && <MemoryComponent {...state.memory} />}
        {state.status.storage && <StorageComponent {...state.storage} />}
        {location.search === '' && (
          <div style={{ lineHeight: 1.5, marginTop: 8 }}>
            <a
              href="#"
              style={{ outline: 'none', display: 'block' }}
              onClick={e => {
                e.preventDefault()
                const { clientWidth, clientHeight } = document.documentElement
                window.open(
                  chrome.runtime.getURL('dist/popup.html?window=1'),
                  undefined,
                  `width=${clientWidth},height=${clientHeight + 24}`,
                )
              }}
            >
              Open as new window
            </a>
            <a
              href="#"
              style={{ outline: 'none', display: 'block' }}
              onClick={e => {
                e.preventDefault()
                chrome.runtime.openOptionsPage()
              }}
            >
              Settings
            </a>
          </div>
        )}
      </div>
    )
  }
}

const root = document.createElement('div')
document.body.appendChild(root)
render(<Container />, root)
