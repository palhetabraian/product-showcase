import {
  LIMITE_TIME_POKEMON,
  type PokemonFavorito,
} from './timePokemonContexto'

const CHAVE_CACHE_TIME_POKEMON = 'pokedex:time-pokemon'

function ehPokemonFavorito(valor: unknown): valor is PokemonFavorito {
  if (typeof valor !== 'object' || valor === null) {
    return false
  }

  const pokemon = valor as Record<string, unknown>

  return typeof pokemon.nome === 'string' && typeof pokemon.imagem === 'string'
}

export function obterTimePokemonDoCache(): PokemonFavorito[] {
  const cacheTimePokemon = localStorage.getItem(CHAVE_CACHE_TIME_POKEMON)

  if (!cacheTimePokemon) {
    return []
  }

  try {
    const favoritosSalvos: unknown = JSON.parse(cacheTimePokemon)

    if (
      Array.isArray(favoritosSalvos) &&
      favoritosSalvos.every(ehPokemonFavorito)
    ) {
      return favoritosSalvos.slice(0, LIMITE_TIME_POKEMON)
    }
  } catch {
    localStorage.removeItem(CHAVE_CACHE_TIME_POKEMON)
  }

  return []
}

export function salvarTimePokemonNoCache(favoritos: PokemonFavorito[]): void {
  localStorage.setItem(CHAVE_CACHE_TIME_POKEMON, JSON.stringify(favoritos))
}

export function limparTimePokemonDoCache(): void {
  localStorage.removeItem(CHAVE_CACHE_TIME_POKEMON)
}
