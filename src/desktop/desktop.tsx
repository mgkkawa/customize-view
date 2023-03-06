import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'

const rootId = 'graph-root'

kintone.events.on('app.record.index.show', event => {
  console.log(event)
  if (event.viewId != 5750588) return
  const container = document.getElementById(rootId) as HTMLElement
  const root = ReactDOM.createRoot(container)
  root.render(<App />)
})
