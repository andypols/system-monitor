import React from 'react'
import {render} from 'react-dom'
import {storage} from './utils'

class Option extends React.Component {
  state = {
    ready: false,
    popup: {},
  }

  setParams = params => {
    const result = {...this.state.popup, ...params}
    this.setState({popup: result}, () => {
      storage.setPopupStatus(result)
    })
  }

  componentDidMount() {
    storage.getPopupStatus().then(popup => {
      this.setState({popup, ready: true})
    })
  }

  textMap = {
    cpu: 'CPU',
  }

  render() {
    return (
      this.state.ready && (
        <div style={{lineHeight: 1.8}}>
          <h2>Popup settings</h2>
          <div style={{marginTop: 12, marginBottom: 12}}>
            {['cpu', 'memory'].map(item => (
              <div key={item}>
                <input
                  id={item}
                  type="checkbox"
                  checked={this.state.popup[item]}
                  onChange={e => {
                    this.setParams({[item]: e.target.checked})
                  }}
                />
                <label
                  style={{
                    userSelect: 'none',
                    marginLeft: 2,
                  }}
                  htmlFor={item}
                >
                  Show {this.textMap[item] || item}
                </label>
              </div>
            ))}
          </div>
        </div>
      )
    )
  }
}

const root = document.createElement('div')
document.body.appendChild(root)
render(<Option/>, root)
