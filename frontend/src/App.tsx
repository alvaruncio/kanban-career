import { Routes, Route, Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-5xl font-bold mb-4">Career-Flow</h1>
      <p className="text-lg text-purple-200 mb-8">Impulsa tu carrera profesional</p>
      <nav className="flex gap-4">
        <Link to="/" className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition">Inicio</Link>
        <Link to="/about" className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition">Acerca</Link>
      </nav>
    </div>
  )
}

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-4xl font-bold mb-4">Acerca de Career-Flow</h1>
      <p className="text-purple-200 mb-8">Plataforma para el desarrollo y crecimiento profesional.</p>
      <Link to="/" className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition">Volver</Link>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}

export default App
