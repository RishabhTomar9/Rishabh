import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import useLenis from './hooks/useLenis';

// Global Layout Components - Keep Header/Footer eager for perceived performance
import Header from './components/Header/Header';
import Loader from './components/Loader/Loader';
import CursorTracker from './components/CursorTracker/CursorTracker';

const lazyWithPreload = (factory) => {
  const Component = lazy(factory);
  Component.preload = factory;
  return Component;
};

// Lazy Load & Preload Home Page Components
const Hero = lazyWithPreload(() => import('./components/Hero/Hero'));
const About = lazyWithPreload(() => import('./components/About/About'));
const Experience = lazyWithPreload(() => import('./components/Experience/Experience'));
const Skills = lazyWithPreload(() => import('./components/Skills/Skills'));
const CertificateAchievements = lazyWithPreload(() => import('./components/CertificateAchievements/CertificateAchievements'));
const Projects = lazyWithPreload(() => import('./components/Projects/Projects'));
const Footer = lazyWithPreload(() => import('./components/Footer/Footer'));

// Lazy Load Other Pages
const Resume = lazy(() => import('./components/Resume/Resume'));
const ProjectDetail = lazy(() => import('./components/Projects/ProjectDetail'));

// Lazy Load Admin Components
const Login = lazy(() => import('./components/Admin/Login'));
const Dashboard = lazy(() => import('./components/Admin/Dashboard'));

import useDataPrefetch from './hooks/useDataPrefetch';

// Scroll To Top Utility
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Home Page Component (Renders all sections for SPA feel)
const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Skills />
      <CertificateAchievements />
      <Projects />
    </>
  );
};

// AppContent component to handle conditional layout
const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      <CursorTracker />

      {/* Header stays visible on all pages, hidden on admin */}
      <AnimatePresence mode="wait">
        {!isAdmin && <Header key="site-header" />}
      </AnimatePresence>

      <main className="min-h-screen">
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
          <Routes>
            {/* Home Route Renders All Sections */}
            <Route path="/" element={<Home />} />

            {/* Individual Page Routes */}
            <Route path="/about" element={<About />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/credentials" element={<CertificateAchievements />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<Login />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />

            {/* Redirect any unknown route to Home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </main>

      {/* Footer stays visible on all pages, hidden on admin */}
      {!isAdmin && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);
  const isDataReady = useDataPrefetch(500); // 500ms safety buffer

  // Initialize Lenis smooth scrolling
  useLenis(!loading);

  // Preload heavy components in the background while loader is active
  useEffect(() => {
    Hero.preload();
    About.preload();
    Experience.preload();
    Skills.preload();
    CertificateAchievements.preload();
    Projects.preload();
    Footer.preload();
  }, []);

  return (
    <AnimatePresence>
      {loading ? (
        <Loader key="global-loader" isReady={isDataReady} onFinish={() => setLoading(false)} />
      ) : (
        <motion.div 
          key="main-content" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-0"
        >
          <Router>
            <ScrollToTop />
            <AppContent />
          </Router>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;