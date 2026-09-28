import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import Customers from './pages/Customers'
import Memory from './pages/Memory'
import Demo from './pages/Demo'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="chat" element={<Chat />} />
        <Route path="customers" element={<Customers />} />
        <Route path="memory" element={<Memory />} />
        <Route path="demo" element={<Demo />} />
      </Route>
    </Routes>
  )
}
