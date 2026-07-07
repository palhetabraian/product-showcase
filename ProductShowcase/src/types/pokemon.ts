export interface ItemListaPokemon {
  name: string;
  url: string;
}

export interface RespostaListaPokemons {
  count: number;
  next: string | null;
  previous: string | null;
  results: ItemListaPokemon[];
}

export interface ImagemOficialPokemon {
  front_default: string | null;
}

export interface SpritesPokemon {
  front_default: string | null;
  other?: {
    'official-artwork'?: ImagemOficialPokemon;
  };
}

export interface TipoPokemon {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface HabilidadePokemon {
  is_hidden: boolean;
  slot: number;
  ability: {
    name: string;
    url: string;
  };
}

export interface MedidasPokemon {
  height: number;
  weight: number;
}

export interface DetalhesPokemon extends MedidasPokemon {
  id: number;
  name: string;
  order: number;
  sprites: SpritesPokemon;
  types: TipoPokemon[];
  abilities: HabilidadePokemon[];
}
