import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CardPokemon } from '../componentes/CardPokemon'
import { buscarListaPokemons } from '../services/api'
import type { ItemListaPokemon } from '../types/pokemon'

interface PokemonComImagem extends ItemListaPokemon {
  id: number
  imagemOficial: string
}

const URL_IMAGEM_OFICIAL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'

function extrairIdDaUrl(urlPokemon: string): number {
  const partesUrl = urlPokemon.split('/').filter(Boolean)
  const idPokemon = Number(partesUrl.at(-1))

  return idPokemon
}

function montarImagemOficial(idPokemon: number): string {
  return `${URL_IMAGEM_OFICIAL}/${idPokemon}.png`
}

function prepararPokemon(pokemon: ItemListaPokemon): PokemonComImagem {
  const idPokemon = extrairIdDaUrl(pokemon.url)

  return {
    ...pokemon,
    id: idPokemon,
    imagemOficial: montarImagemOficial(idPokemon),
  }
}

export function PaginaInicial() {
  const navegar = useNavigate()
  const [pokemons, setPokemons] = useState<PokemonComImagem[]>([])
  const [carregando, setCarregando] = useState(true)
  const [mensagemErro, setMensagemErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregarPokemons() {
      try {
        setCarregando(true)
        setMensagemErro(null)

        const listaPokemons = await buscarListaPokemons()
        const pokemonsComImagem = listaPokemons.map(prepararPokemon)

        setPokemons(pokemonsComImagem)
      } catch {
        setMensagemErro('Nao foi possivel carregar os pokemons.')
      } finally {
        setCarregando(false)
      }
    }

    carregarPokemons()
  }, [])

  if (carregando) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
        <p className="text-center text-lg font-semibold">Carregando pokemons...</p>
      </main>
    )
  }

  if (mensagemErro) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
        <div className="mx-auto max-w-xl rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700">
          {mensagemErro}
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Primeira geracao
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Pokedex</h1>
        </header>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {pokemons.map((pokemon) => (
            <CardPokemon
              aoClicar={() => navegar(`/pokemon/${pokemon.name}`)}
              imagem={pokemon.imagemOficial}
              key={pokemon.name}
              nome={pokemon.name}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
