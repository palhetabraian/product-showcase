import axios from 'axios'

const LIMITE_PRIMEIRA_GERACAO = 151

export const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
})

export interface PokemonResumo {
  name: string
  url: string
}

interface RespostaListaPokemons {
  count: number
  next: string | null
  previous: string | null
  results: PokemonResumo[]
}

export interface TipoPokemon {
  slot: number
  type: {
    name: string
    url: string
  }
}

export interface HabilidadePokemon {
  is_hidden: boolean
  slot: number
  ability: {
    name: string
    url: string
  }
}

export interface DetalhesPokemon {
  id: number
  name: string
  height: number
  weight: number
  order: number
  sprites: {
    front_default: string | null
    other?: {
      'official-artwork'?: {
        front_default: string | null
      }
    }
  }
  types: TipoPokemon[]
  abilities: HabilidadePokemon[]
}

//Funçao para listar a busca dos 151 pokemons
export async function buscarListaPokemons(): Promise<PokemonResumo[]> {
  const resposta = await api.get<RespostaListaPokemons>('/pokemon', {
    params: {
      limit: LIMITE_PRIMEIRA_GERACAO,
    },
  })

  return resposta.data.results
}

// Busca por detalhes do pokemon
export async function buscarDetalhesPokemonPorNome(
  nomePokemon: string,
): Promise<DetalhesPokemon> {
  const resposta = await api.get<DetalhesPokemon>(`/pokemon/${nomePokemon}`)

  return resposta.data
}
