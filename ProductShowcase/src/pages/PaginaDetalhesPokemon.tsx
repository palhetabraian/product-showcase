import { Link, useParams } from 'react-router-dom'

function formatarNome(nomePokemon: string): string {
  return nomePokemon.charAt(0).toUpperCase() + nomePokemon.slice(1)
}

export function PaginaDetalhesPokemon() {
  const { nome } = useParams<{ nome: string }>()
  const nomePokemon = nome ? formatarNome(nome) : 'Pokemon'

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <section className="mx-auto max-w-3xl">
        <Link className="text-sm font-semibold text-red-600 hover:text-red-700" to="/">
          Voltar para a Pokedex
        </Link>
        <h1 className="mt-6 text-3xl font-bold">{nomePokemon}</h1>
      </section>
    </main>
  )
}
