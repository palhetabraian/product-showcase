import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { TimePokemonProvider } from './contextos/TimePokemonContext'
import { PaginaDetalhesPokemon } from './pages/PaginaDetalhesPokemon'
import { PaginaInicial } from './pages/PaginaInicial'

function App() {
  return (
    <TimePokemonProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PaginaInicial />} path="/" />
          <Route element={<PaginaDetalhesPokemon />} path="/pokemon/:nome" />
        </Routes>
      </BrowserRouter>
    </TimePokemonProvider>
  )
}

export default App
