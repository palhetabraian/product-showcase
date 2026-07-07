import { createContext } from 'react'

export interface PokemonFavorito {
  nome: string
  imagem: string
}

export interface TimePokemonContexto {
  favoritos: PokemonFavorito[]
  adicionarFavorito: (pokemon: PokemonFavorito) => boolean
  removerFavorito: (nomePokemon: string) => void
  limparTimePokemon: () => void
  estaNoTime: (nomePokemon: string) => boolean
  timeCheio: boolean
}

export const LIMITE_TIME_POKEMON = 6

export const TimePokemonContext = createContext<
  TimePokemonContexto | undefined
>(undefined)
