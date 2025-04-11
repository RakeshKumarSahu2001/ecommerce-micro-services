import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ecommerceStore } from './EcommerceStore/ecommerceStore.js'
import { Provider as ReduxProvider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ReduxProvider store={ecommerceStore}>
        <App />
      </ReduxProvider>
  </StrictMode>,
)
