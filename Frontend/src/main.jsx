import { StrictMode } from 'react'
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
     <HashRouter>
<App />
     </HashRouter>
    
  </StrictMode>,
)
