import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConfigProvider, App as AntApp, Spin } from 'antd'
import './index.css'
import App from './App.jsx'
import { bootstrapStore } from './store/index.js'

const theme = {
  token: {
    colorPrimary: '#3f51b5',
    borderRadius: 12,
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
}

const root = createRoot(document.getElementById('root'))

root.render(
  <ConfigProvider theme={theme}>
    <AntApp>
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <Spin size="large" tip="Đang tải dữ liệu app..." />
      </div>
    </AntApp>
  </ConfigProvider>,
)

bootstrapStore().then((store) => {
  root.render(
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
})
