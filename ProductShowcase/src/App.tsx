import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PaginaDetalhesPokemon } from './pages/PaginaDetalhesPokemon'
import { PaginaInicial } from './pages/PaginaInicial'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PaginaInicial />} path="/" />
        <Route element={<PaginaDetalhesPokemon />} path="/pokemon/:id" />
      </Routes>
    </BrowserRouter>
  )
}

export default App
