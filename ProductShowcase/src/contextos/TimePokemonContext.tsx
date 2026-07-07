import { createContext, type ReactNode, useContext, useState } from 'react';

export interface PokemonFavorito {
  nome: string;
  imagem: string;
}

interface TimePokemonContexto {
  favoritos: PokemonFavorito[];
  adicionarFavorito: (pokemon: PokemonFavorito) => boolean;
  removerFavorito: (nomePokemon: string) => void;
  estaNoTime: (nomePokemon: string) => boolean;
  timeCheio: boolean;
}

interface PropriedadesTimePokemonProvider {
  children: ReactNode;
}

const LIMITE_TIME_POKEMON = 6;

const TimePokemonContext = createContext<TimePokemonContexto | undefined>(
  undefined
);

export function TimePokemonProvider({
  children,
}: PropriedadesTimePokemonProvider) {
  const [favoritos, setFavoritos] = useState<PokemonFavorito[]>([]);

  const timeCheio = favoritos.length >= LIMITE_TIME_POKEMON;

  function estaNoTime(nomePokemon: string): boolean {
    return favoritos.some((pokemon) => pokemon.nome === nomePokemon);
  }

  function adicionarFavorito(pokemonFavorito: PokemonFavorito): boolean {
    if (estaNoTime(pokemonFavorito.nome) || timeCheio) {
      return false;
    }

    setFavoritos((favoritosAtuais) => [...favoritosAtuais, pokemonFavorito]);
    return true;
  }

  function removerFavorito(nomePokemon: string): void {
    setFavoritos((favoritosAtuais) =>
      favoritosAtuais.filter((pokemon) => pokemon.nome !== nomePokemon)
    );
  }

  const valorContexto = {
    favoritos,
    adicionarFavorito,
    removerFavorito,
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
