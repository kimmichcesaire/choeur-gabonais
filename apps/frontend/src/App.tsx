import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar      from './components/Navbar'
import Footer      from './components/Footer'
import HomePage    from './pages/HomePage'
import EventsPage  from './pages/EventsPage'
import MediaPage   from './pages/MediaPage'
import GalleryPage from './pages/GalleryPage'
import AboutPage   from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"           element={<HomePage />}    />
          <Route path="/evenements" element={<EventsPage />}  />
          <Route path="/medias"     element={<MediaPage />}   />
          <Route path="/galerie"    element={<GalleryPage />} />
          <Route path="/a-propos"   element={<AboutPage />}   />
          <Route path="/contact"    element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
