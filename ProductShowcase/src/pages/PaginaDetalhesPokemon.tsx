import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { buscarDetalhesPokemonPorNome } from '../services/api'
import type { DetalhesPokemon } from '../types/pokemon'

function formatarNome(nomePokemon: string): string {
  return nomePokemon.charAt(0).toUpperCase() + nomePokemon.slice(1)
}

function obterImagemOficial(pokemon: DetalhesPokemon): string | null {
  return pokemon.sprites.other?.['official-artwork']?.front_default ?? null
}

function converterAlturaParaMetros(altura: number): string {
  return `${(altura / 10).toFixed(1)} m`
}

function converterPesoParaQuilos(peso: number): string {
  return `${(peso / 10).toFixed(1)} kg`
}

export function PaginaDetalhesPokemon() {
  const { id } = useParams<{ id: string }>()
  const [pokemon, setPokemon] = useState<DetalhesPokemon | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [mensagemErro, setMensagemErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregarDetalhesPokemon() {
      if (!id) {
        setMensagemErro('Pokemon nao encontrado.')
        setCarregando(false)
        return
      }

      try {
        setCarregando(true)
        setMensagemErro(null)

        const detalhesPokemon = await buscarDetalhesPokemonPorNome(id)

        setPokemon(detalhesPokemon)
      } catch {
        setMensagemErro('Nao foi possivel carregar os detalhes do pokemon.')
      } finally {
        setCarregando(false)
      }
    }

    carregarDetalhesPokemon()
  }, [id])

  if (carregando) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
        <p className="text-center text-lg font-semibold">Carregando detalhes...</p>
      </main>
    )
  }

  if (mensagemErro || !pokemon) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
        <section className="mx-auto max-w-3xl">
          <Link className="text-sm font-semibold text-red-600 hover:text-red-700" to="/">
            Voltar para a Pokedex
          </Link>

          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {mensagemErro ?? 'Pokemon nao encontrado.'}
          </div>
        </section>
      </main>
    )
  }

  const imagemOficial = obterImagemOficial(pokemon)

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <section className="mx-auto max-w-5xl">
        <Link className="text-sm font-semibold text-red-600 hover:text-red-700" to="/">
          Voltar para a Pokedex
        </Link>

        <div className="mt-6 grid gap-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[minmax(0,320px)_1fr] md:p-8">
          <div className="flex aspect-square items-center justify-center rounded-lg bg-slate-100 p-6">
            {imagemOficial ? (
              <img
                alt={`Imagem oficial do ${formatarNome(pokemon.name)}`}
                className="h-full w-full object-contain"
                src={imagemOficial}
              />
            ) : (
              <span className="text-sm font-semibold text-slate-500">
                Imagem indisponivel
              </span>
            )}
          </div>

          <div>
            <span className="text-sm font-semibold text-slate-500">
              #{String(pokemon.id).padStart(3, '0')}
            </span>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              {formatarNome(pokemon.name)}
            </h1>

            <div className="mt-5 flex flex-wrap gap-2">
              {pokemon.types.map((tipoPokemon) => (
                <span
                  className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700"
                  key={tipoPokemon.type.name}
                >
                  {formatarNome(tipoPokemon.type.name)}
                </span>
              ))}
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-4 sm:max-w-md">
              <div className="rounded-lg border border-slate-200 p-4">
                <dt className="text-sm font-semibold text-slate-500">Altura</dt>
                <dd className="mt-1 text-xl font-bold">
                  {converterAlturaParaMetros(pokemon.height)}
                </dd>
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <dt className="text-sm font-semibold text-slate-500">Peso</dt>
                <dd className="mt-1 text-xl font-bold">
                  {converterPesoParaQuilos(pokemon.weight)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </main>
  )
}
