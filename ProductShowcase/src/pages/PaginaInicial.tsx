import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CardPokemon } from '../componentes/CardPokemon'
import { useTimePokemon } from '../contextos/TimePokemonContext'
import { buscarListaPokemons } from '../services/api'
import type { ItemListaPokemon } from '../types/pokemon'

interface PokemonComImagem extends ItemListaPokemon {
  id: number
  imagemOficial: string
}

const URL_IMAGEM_OFICIAL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'
const LIMITE_POKEMONS_POR_CHAMADA = 30
const LIMITE_PRIMEIRA_GERACAO = 151

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
  const {
    favoritos,
    adicionarFavorito,
    removerFavorito,
    estaNoTime,
    timeCheio,
  } = useTimePokemon()
  const [pokemons, setPokemons] = useState<PokemonComImagem[]>([])
  const [termoBusca, setTermoBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [carregandoMais, setCarregandoMais] = useState(false)
  const [mensagemErro, setMensagemErro] = useState<string | null>(null)

  const termoBuscaNormalizado = termoBusca.trim().toLowerCase()
  const pokemonsFiltrados = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(termoBuscaNormalizado),
  )
  const podeCarregarMais = pokemons.length < LIMITE_PRIMEIRA_GERACAO

  const carregarPokemons = useCallback(async (deslocamento = 0) => {
    const quantidadeRestante = LIMITE_PRIMEIRA_GERACAO - deslocamento
    const limite = Math.min(LIMITE_POKEMONS_POR_CHAMADA, quantidadeRestante)

    if (limite <= 0) {
      return
    }

    try {
      if (deslocamento === 0) {
        setCarregando(true)
      } else {
        setCarregandoMais(true)
      }

      setMensagemErro(null)

      const listaPokemons = await buscarListaPokemons(limite, deslocamento)
      const pokemonsComImagem = listaPokemons.map(prepararPokemon)

      if (deslocamento === 0) {
        setPokemons(pokemonsComImagem)
      } else {
        setPokemons((pokemonsAtuais) => [
          ...pokemonsAtuais,
          ...pokemonsComImagem,
        ])
      }
    } catch {
      setMensagemErro('Nao foi possivel carregar os pokemons.')
    } finally {
      if (deslocamento === 0) {
        setCarregando(false)
      } else {
        setCarregandoMais(false)
      }
    }
  }, [])

  function favoritarPokemon(pokemon: PokemonComImagem) {
    adicionarFavorito({
      nome: pokemon.name,
      imagem: pokemon.imagemOficial,
    })
  }

  useEffect(() => {
    carregarPokemons()
  }, [carregarPokemons])

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

        <section className="mb-8 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">Meu time Pokemon</h2>
              <p className="text-sm text-slate-500">{favoritos.length}/6 favoritos</p>
            </div>
          </div>

          {favoritos.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              Nenhum pokemon favoritado ainda.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {favoritos.map((pokemon) => (
                <div
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center"
                  key={pokemon.nome}
                >
                  <img
                    alt={`Imagem oficial do ${pokemon.nome}`}
                    className="mx-auto h-20 w-20 object-contain"
                    src={pokemon.imagem}
                  />
                  <strong className="mt-2 block text-sm capitalize">
                    {pokemon.nome}
                  </strong>
                  <button
                    className="mt-2 text-sm font-semibold text-red-600 hover:text-red-700"
                    onClick={() => removerFavorito(pokemon.nome)}
                    type="button"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="mb-6 max-w-md">
          <label
            className="mb-2 block text-sm font-semibold text-slate-700"
            htmlFor="busca-pokemon"
          >
            Buscar pokemon
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
            id="busca-pokemon"
            onChange={(evento) => setTermoBusca(evento.target.value)}
            placeholder="Digite o nome do pokemon"
            type="search"
            value={termoBusca}
          />
        </div>

        {pokemonsFiltrados.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-600">
            Nenhum pokemon encontrado.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {pokemonsFiltrados.map((pokemon) => (
              <CardPokemon
                aoFavoritar={() => favoritarPokemon(pokemon)}
                aoClicar={() => navegar(`/pokemon/${pokemon.name}`)}
                desabilitarFavorito={timeCheio && !estaNoTime(pokemon.name)}
                favoritado={estaNoTime(pokemon.name)}
                imagem={pokemon.imagemOficial}
                key={pokemon.name}
                nome={pokemon.name}
              />
            ))}
          </div>
        )}

        {podeCarregarMais && (
          <div className="mt-8 flex justify-center">
            <button
              className="rounded-lg bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={carregandoMais}
              onClick={() => carregarPokemons(pokemons.length)}
              type="button"
            >
              {carregandoMais ? 'Carregando...' : 'Carregar mais pokemons'}
            </button>
          </div>
        )}
      </section>
    </main>
  )
}
