import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import FabricSimulator from './pages/FabricSimulator'
import LicenseComparator from './pages/LicenseComparator'
import DaxReference from './pages/DaxReference'
import TechCards from './pages/TechCards'
import RoiCalculator from './pages/RoiCalculator'
import PerformanceChecklist from './pages/PerformanceChecklist'
import ArchitecturePatterns from './pages/ArchitecturePatterns'
import DaxFormatter from './pages/DaxFormatter'
import ToolsDownloads from './pages/ToolsDownloads'
import Resources from './pages/Resources'
import WhatsNew from './pages/WhatsNew'
import AiPowerBi from './pages/AiPowerBi'
import Certifications from './pages/Certifications'
import NotebookTemplates from './pages/NotebookTemplates'
import ApiReference from './pages/ApiReference'
import CiCdPipelines from './pages/CiCdPipelines'
import Chatbot from './components/Chatbot'

export default function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulator" element={<FabricSimulator />} />
          <Route path="/licenses" element={<LicenseComparator />} />
          <Route path="/dax" element={<DaxReference />} />
          <Route path="/fiches" element={<TechCards />} />
          <Route path="/roi" element={<RoiCalculator />} />
          <Route path="/performance" element={<PerformanceChecklist />} />
          <Route path="/architecture" element={<ArchitecturePatterns />} />
          <Route path="/formatter" element={<DaxFormatter />} />
          <Route path="/tools" element={<ToolsDownloads />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/whatsnew" element={<WhatsNew />} />
          <Route path="/ai" element={<AiPowerBi />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/notebooks" element={<NotebookTemplates />} />
          <Route path="/api" element={<ApiReference />} />
          <Route path="/cicd" element={<CiCdPipelines />} />
        </Routes>
      </Layout>
      <Chatbot />
    </>
  )
}
