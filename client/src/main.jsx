import React from 'react'
import ReactDOM from 'react-dom/client'
import MainPage from './MainPage.jsx'

document.getElementById('root').style.height = '100%';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MainPage />
  </React.StrictMode>,
)
