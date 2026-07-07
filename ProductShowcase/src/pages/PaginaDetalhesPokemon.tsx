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
  const { nome } = useParams<{ nome: string }>()
  const [pokemon, setPokemon] = useState<DetalhesPokemon | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [mensagemErro, setMensagemErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregarDetalhesPokemon() {
      if (!nome) {
        setMensagemErro('Pokemon nao encontrado.')
        setCarregando(false)
        return
      }

      try {
        setCarregando(true)
        setMensagemErro(null)

        const detalhesPokemon = await buscarDetalhesPokemonPorNome(nome)

        setPokemon(detalhesPokemon)
      } catch {
        setMensagemErro('Nao foi possivel carregar os detalhes do pokemon.')
      } finally {
        setCarregando(false)
      }
    }

    carregarDetalhesPokemon()
  }, [nome])

  if (carregando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-900">
        <p className="rounded-xl border border-slate-200 bg-white px-6 py-4 text-center text-lg font-semibold shadow-sm">
          Carregando detalhes...
        </p>
      </main>
    )
  }

  if (mensagemErro || !pokemon) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
        <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <Link
            className="inline-flex rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-700"
            to="/"
          >
            Voltar para a Pokedex
          </Link>

          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
            {mensagemErro ?? 'Pokemon nao encontrado.'}
          </div>
        </section>
      </main>
    )
  }

  const imagemOficial = obterImagemOficial(pokemon)

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <Link
            className="w-fit rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-700"
            to="/"
          >
            Voltar para a Pokedex
          </Link>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-red-600">
              Detalhes do pokemon
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {formatarNome(pokemon.name)}
            </h1>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[minmax(0,340px)_1fr] md:p-8">
          <div className="flex aspect-square items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 p-6">
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

          <div className="flex flex-col justify-center">
            <span className="text-sm font-bold text-slate-500">
              #{String(pokemon.id).padStart(3, '0')}
            </span>
            <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-5xl">
              {formatarNome(pokemon.name)}
            </h2>

            <div className="mt-5 flex flex-wrap gap-2">
              {pokemon.types.map((tipoPokemon) => (
                <span
                  className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-bold text-red-700"
                  key={tipoPokemon.type.name}
                >
                  {formatarNome(tipoPokemon.type.name)}
                </span>
              ))}
            </div>

            <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <dt className="text-sm font-semibold text-slate-500">Altura</dt>
                <dd className="mt-1 text-2xl font-black text-slate-950">
                  {converterAlturaParaMetros(pokemon.height)}
                </dd>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <dt className="text-sm font-semibold text-slate-500">Peso</dt>
                <dd className="mt-1 text-2xl font-black text-slate-950">
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
