import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConfigProvider, App as AntApp } from 'antd'
import './index.css'
import App from './App.jsx'
import { store } from './store/index.js'

const theme = {
  token: {
    colorPrimary: '#3f51b5',
    borderRadius: 12,
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <AntApp>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AntApp>
      </ConfigProvider>
    </Provider>
  </StrictMode>,
)
