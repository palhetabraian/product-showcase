import { type ReactNode, useState } from 'react'
import {
  LIMITE_TIME_POKEMON,
  TimePokemonContext,
  type PokemonFavorito,
} from './timePokemonContexto'
import {
  limparTimePokemonDoCache,
  obterTimePokemonDoCache,
  salvarTimePokemonNoCache,
} from './timePokemonCache'

interface PropriedadesTimePokemonProvider {
  children: ReactNode
}

export function TimePokemonProvider({
  children,
}: PropriedadesTimePokemonProvider) {
  const [favoritos, setFavoritos] = useState<PokemonFavorito[]>(
    obterTimePokemonDoCache,
  )

  const timeCheio = favoritos.length >= LIMITE_TIME_POKEMON

  function estaNoTime(nomePokemon: string): boolean {
    return favoritos.some((pokemon) => pokemon.nome === nomePokemon)
  }

  function adicionarFavorito(pokemonFavorito: PokemonFavorito): boolean {
    if (estaNoTime(pokemonFavorito.nome) || timeCheio) {
      return false
    }

    setFavoritos((favoritosAtuais) => {
      const novoTimePokemon = [...favoritosAtuais, pokemonFavorito]
      salvarTimePokemonNoCache(novoTimePokemon)

      return novoTimePokemon
    })

    return true
  }

  function removerFavorito(nomePokemon: string): void {
    setFavoritos((favoritosAtuais) => {
      const novoTimePokemon = favoritosAtuais.filter(
        (pokemon) => pokemon.nome !== nomePokemon,
      )
      salvarTimePokemonNoCache(novoTimePokemon)

      return novoTimePokemon
    })
  }

  function limparTimePokemon(): void {
    limparTimePokemonDoCache()
    setFavoritos([])
  }

  const valorContexto = {
    favoritos,
    adicionarFavorito,
    removerFavorito,
    limparTimePokemon,
    estaNoTime,
    timeCheio,
  }

  return (
    <TimePokemonContext.Provider value={valorContexto}>
      {children}
    </TimePokemonContext.Provider>
  )
}
