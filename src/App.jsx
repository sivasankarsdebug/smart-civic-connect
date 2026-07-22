import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'

// Placeholder for routes that exist for navigation purposes but whose
// pages are built in a later milestone. Kept inline since it isn't one
// of this milestone's files.
function ComingSoon({ title }) {
  return (
    <div className="coming-soon">
      <h2>{title}</h2>
      <p>This page is being built in an upcoming milestone.</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submit" element={<ComingSoon title="Submit Complaint" />} />
        <Route path="/track" element={<ComingSoon title="Track Complaint" />} />
      </Routes>
    </BrowserRouter>
  )
}
