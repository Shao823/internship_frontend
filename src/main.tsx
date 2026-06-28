import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';

import App from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#2f80ed',
          colorInfo: '#25c2a0',
          colorSuccess: '#4dd17a',
          colorWarning: '#f2b84b',
          colorError: '#ff6b6b',
          borderRadius: 6,
          fontFamily: 'Inter, "Segoe UI", "PingFang SC", "Microsoft YaHei", Arial, sans-serif',
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
