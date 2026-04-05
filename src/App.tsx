import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import FabricSimulator from './pages/FabricSimulator'
import LicenseComparator from './pages/LicenseComparator'
import RoiCalculator from './pages/RoiCalculator'
import DaxFormatter from './pages/DaxFormatter'
import DaxReference from './pages/DaxReference'
import TechCards from './pages/TechCards'
import Exercises from './pages/Exercises'
import Certifications from './pages/Certifications'
import FabricDeepDive from './pages/FabricDeepDive'
import ArchitecturePatterns from './pages/ArchitecturePatterns'
import NotebookTemplates from './pages/NotebookTemplates'
import CiCdPipelines from './pages/CiCdPipelines'
import SharingAccess from './pages/SharingAccess'
import ApiReference from './pages/ApiReference'
import AiPowerBi from './pages/AiPowerBi'
import ToolsDownloads from './pages/ToolsDownloads'
import WhatsNew from './pages/WhatsNew'
import Roadmap from './pages/Roadmap'
import Resources from './pages/Resources'
import PerformanceChecklist from './pages/PerformanceChecklist'
import Chatbot from './components/Chatbot'

export default function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulator" element={<FabricSimulator />} />
          <Route path="/licenses" element={<LicenseComparator />} />
          <Route path="/roi" element={<RoiCalculator />} />
          <Route path="/formatter" element={<DaxFormatter />} />
          <Route path="/dax" element={<DaxReference />} />
          <Route path="/fiches" element={<TechCards />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/fabric" element={<FabricDeepDive />} />
          <Route path="/architecture" element={<ArchitecturePatterns />} />
          <Route path="/notebooks" element={<NotebookTemplates />} />
          <Route path="/cicd" element={<CiCdPipelines />} />
          <Route path="/sharing" element={<SharingAccess />} />
          <Route path="/api" element={<ApiReference />} />
          <Route path="/ai" element={<AiPowerBi />} />
          <Route path="/tools" element={<ToolsDownloads />} />
          <Route path="/whatsnew" element={<WhatsNew />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/performance" element={<PerformanceChecklist />} />
        </Routes>
      </Layout>
      <Chatbot />
    </>
  )
}
