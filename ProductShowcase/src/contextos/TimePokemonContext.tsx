import { createContext, type ReactNode, useContext, useState } from 'react';

export interface PokemonFavorito {
  nome: string;
  imagem: string;
}

interface TimePokemonContexto {
  favoritos: PokemonFavorito[];
  adicionarFavorito: (pokemon: PokemonFavorito) => boolean;
  removerFavorito: (nomePokemon: string) => void;
  limparTimePokemon: () => void;
  estaNoTime: (nomePokemon: string) => boolean;
  timeCheio: boolean;
}

interface PropriedadesTimePokemonProvider {
  children: ReactNode;
}

const LIMITE_TIME_POKEMON = 6;
const CHAVE_CACHE_TIME_POKEMON = 'pokedex:time-pokemon';

const TimePokemonContext = createContext<TimePokemonContexto | undefined>(
  undefined
);

function ehPokemonFavorito(valor: unknown): valor is PokemonFavorito {
  if (typeof valor !== 'object' || valor === null) {
    return false;
  }

  const pokemon = valor as Record<string, unknown>;

  return typeof pokemon.nome === 'string' && typeof pokemon.imagem === 'string';
}

function obterTimePokemonDoCache(): PokemonFavorito[] {
  const cacheTimePokemon = localStorage.getItem(CHAVE_CACHE_TIME_POKEMON);

  if (!cacheTimePokemon) {
    return [];
  }

  try {
    const favoritosSalvos: unknown = JSON.parse(cacheTimePokemon);

    if (
      Array.isArray(favoritosSalvos) &&
      favoritosSalvos.every(ehPokemonFavorito)
    ) {
      return favoritosSalvos.slice(0, LIMITE_TIME_POKEMON);
    }
  } catch {
    localStorage.removeItem(CHAVE_CACHE_TIME_POKEMON);
  }

  return [];
}

function salvarTimePokemonNoCache(favoritos: PokemonFavorito[]): void {
  localStorage.setItem(CHAVE_CACHE_TIME_POKEMON, JSON.stringify(favoritos));
}

export function TimePokemonProvider({
  children,
}: PropriedadesTimePokemonProvider) {
  const [favoritos, setFavoritos] = useState<PokemonFavorito[]>(
    obterTimePokemonDoCache
  );

  const timeCheio = favoritos.length >= LIMITE_TIME_POKEMON;

  function estaNoTime(nomePokemon: string): boolean {
    return favoritos.some((pokemon) => pokemon.nome === nomePokemon);
  }

  function adicionarFavorito(pokemonFavorito: PokemonFavorito): boolean {
    if (estaNoTime(pokemonFavorito.nome) || timeCheio) {
      return false;
    }

    setFavoritos((favoritosAtuais) => {
      const novoTimePokemon = [...favoritosAtuais, pokemonFavorito];
      salvarTimePokemonNoCache(novoTimePokemon);

      return novoTimePokemon;
    });
    return true;
  }

  function removerFavorito(nomePokemon: string): void {
    setFavoritos((favoritosAtuais) => {
      const novoTimePokemon = favoritosAtuais.filter(
        (pokemon) => pokemon.nome !== nomePokemon
      );
      salvarTimePokemonNoCache(novoTimePokemon);

      return novoTimePokemon;
    });
  }

  function limparTimePokemon(): void {
    localStorage.removeItem(CHAVE_CACHE_TIME_POKEMON);
    setFavoritos([]);
  }

  const valorContexto = {
    favoritos,
    adicionarFavorito,
    removerFavorito,
    limparTimePokemon,
    estaNoTime,
    timeCheio,
  };

  return (
    <TimePokemonContext.Provider value={valorContexto}>
      {children}
    </TimePokemonContext.Provider>
  );
}

export function useTimePokemon(): TimePokemonContexto {
  const contexto = useContext(TimePokemonContext);

  if (!contexto) {
    throw new Error('Erro dentro do time de pokemon');
  }

  return contexto;
}
