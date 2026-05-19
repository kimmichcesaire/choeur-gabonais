import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar          from './components/Navbar'
import Footer          from './components/Footer'
import HomePage        from './pages/HomePage'
import EventsPage      from './pages/EventsPage'
import MediaPage       from './pages/MediaPage'
import GalleryPage     from './pages/GalleryPage'
import AboutPage       from './pages/AboutPage'
import ContactPage     from './pages/ContactPage'
import AdminLogin      from './pages/admin/AdminLogin'
import AdminDashboard  from './pages/admin/AdminDashboard'
import AdminEvents     from './pages/admin/AdminEvents'
import AdminMedia      from './pages/admin/AdminMedia'
import AdminGallery    from './pages/admin/AdminGallery'
import AdminRoute      from './components/admin/AdminRoute'
import './App.css'

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<><Navbar /><main><HomePage /></main><Footer /></>} />
        <Route path="/evenements" element={<><Navbar /><main><EventsPage /></main><Footer /></>} />
        <Route path="/medias" element={<><Navbar /><main><MediaPage /></main><Footer /></>} />
        <Route path="/galerie" element={<><Navbar /><main><GalleryPage /></main><Footer /></>} />
        <Route path="/a-propos" element={<><Navbar /><main><AboutPage /></main><Footer /></>} />
        <Route path="/contact" element={<><Navbar /><main><ContactPage /></main><Footer /></>} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/evenements" element={<AdminRoute><AdminEvents /></AdminRoute>} />
        <Route path="/admin/medias" element={<AdminRoute><AdminMedia /></AdminRoute>} />
        <Route path="/admin/galerie" element={<AdminRoute><AdminGallery /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
