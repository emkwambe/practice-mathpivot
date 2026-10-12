import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Generator from './pages/Generator'
import Practice from './pages/Practice'
import Worksheets from './pages/Worksheets'
import Learn from './pages/Learn'
import About from './pages/About'
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import TeacherDashboard from "./pages/TeacherDashboard"
import ClassDetail from "./pages/ClassDetail"
import StudentClasses from "./pages/StudentClasses"
import AssignmentSession from "./pages/AssignmentSession"

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generator" element={<Generator />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/worksheets" element={<Worksheets />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/class/:id" element={<ClassDetail />} />
        <Route path="/student/classes" element={<StudentClasses />} />
        <Route path="/student/assignment/:id" element={<AssignmentSession />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
