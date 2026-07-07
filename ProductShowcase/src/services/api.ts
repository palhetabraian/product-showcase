import axios from 'axios'
import type {
  DetalhesPokemon,
  ItemListaPokemon,
  RespostaListaPokemons,
} from '../types/pokemon'

const LIMITE_PRIMEIRA_GERACAO = 151

export const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
})

export async function buscarListaPokemons(): Promise<ItemListaPokemon[]> {
  const resposta = await api.get<RespostaListaPokemons>('/pokemon', {
    params: {
      limit: LIMITE_PRIMEIRA_GERACAO,
    },
  })

  return resposta.data.results
}

export async function buscarDetalhesPokemonPorNome(
  nomePokemon: string,
): Promise<DetalhesPokemon> {
  const resposta = await api.get<DetalhesPokemon>(`/pokemon/${nomePokemon}`)

  return resposta.data
}
