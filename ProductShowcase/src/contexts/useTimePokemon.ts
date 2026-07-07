import { useContext } from 'react'
import {
  TimePokemonContext,
  type TimePokemonContexto,
} from './timePokemonContexto'

export function useTimePokemon(): TimePokemonContexto {
  const contexto = useContext(TimePokemonContext)

  if (!contexto) {
    throw new Error('Erro dentro do time de pokemon')
  }

  return contexto
}
