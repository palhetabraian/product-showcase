import axios from 'axios'
import type {
  DetalhesPokemon,
  ItemListaPokemon,
  RespostaListaPokemons,
} from '../types/pokemon'


const LIMITE_PADRAO_POKEMONS = 30

const LIMITE_PRIMEIRA_GERACAO = 151


export const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
})


export async function buscarListaPokemons(
  limite = LIMITE_PADRAO_POKEMONS,
  deslocamento = 0,
): Promise<ItemListaPokemon[]> {
  const resposta = await api.get<RespostaListaPokemons>('/pokemon', {
    params: {
      limit: limite,
      offset: deslocamento,

export async function buscarListaPokemons(): Promise<ItemListaPokemon[]> {
  const resposta = await api.get<RespostaListaPokemons>('/pokemon', {
    params: {
      limit: LIMITE_PRIMEIRA_GERACAO,
 9846886 (feat(rotas): configura a rota entre Home e DetalhesPokemon)
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
