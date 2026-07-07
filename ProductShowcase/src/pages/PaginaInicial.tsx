import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardPokemon } from '../components/CardPokemon';
import { useTimePokemon } from '../contexts/useTimePokemon';
import { buscarListaPokemons } from '../services/api';
import type { ItemListaPokemon } from '../types/pokemon';

interface PokemonComImagem extends ItemListaPokemon {
  id: number;
  imagemOficial: string;
}

const URL_IMAGEM_OFICIAL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';
const LIMITE_POKEMONS_POR_CHAMADA = 30;
const LIMITE_PRIMEIRA_GERACAO = 151;
const CHAVE_CACHE_POKEMONS = 'pokedex:pokemons';

function ehPokemonComImagem(valor: unknown): valor is PokemonComImagem {
  if (typeof valor !== 'object' || valor === null) {
    return false;
  }

  const pokemon = valor as Record<string, unknown>;

  return (
    typeof pokemon.name === 'string' &&
    typeof pokemon.url === 'string' &&
    typeof pokemon.id === 'number' &&
    typeof pokemon.imagemOficial === 'string'
  );
}

function obterPokemonsDoCache(): PokemonComImagem[] | null {
  const cachePokemons = localStorage.getItem(CHAVE_CACHE_POKEMONS);

  if (!cachePokemons) {
    return null;
  }

  try {
    const pokemonsSalvos: unknown = JSON.parse(cachePokemons);

    if (
      Array.isArray(pokemonsSalvos) &&
      pokemonsSalvos.every(ehPokemonComImagem)
    ) {
      return pokemonsSalvos;
    }
  } catch {
    localStorage.removeItem(CHAVE_CACHE_POKEMONS);
  }

  return null;
}

function salvarPokemonsNoCache(pokemons: PokemonComImagem[]): void {
  localStorage.setItem(CHAVE_CACHE_POKEMONS, JSON.stringify(pokemons));
}

function extrairIdDaUrl(urlPokemon: string): number {
  const partesUrl = urlPokemon.split('/').filter(Boolean);
  const idPokemon = Number(partesUrl.at(-1));

  return idPokemon;
}

function montarImagemOficial(idPokemon: number): string {
  return `${URL_IMAGEM_OFICIAL}/${idPokemon}.png`;
}

function prepararPokemon(pokemon: ItemListaPokemon): PokemonComImagem {
  const idPokemon = extrairIdDaUrl(pokemon.url);

  return {
    ...pokemon,
    id: idPokemon,
    imagemOficial: montarImagemOficial(idPokemon),
  };
}

export function PaginaInicial() {
  const navegar = useNavigate();
  const {
    favoritos,
    adicionarFavorito,
    removerFavorito,
    limparTimePokemon,
    estaNoTime,
    timeCheio,
  } = useTimePokemon();
  const [pokemons, setPokemons] = useState<PokemonComImagem[]>([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  const termoBuscaNormalizado = termoBusca.trim().toLowerCase();
  const pokemonsFiltrados = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(termoBuscaNormalizado)
  );
  const podeCarregarMais = pokemons.length < LIMITE_PRIMEIRA_GERACAO;

  const carregarPokemons = useCallback(async (deslocamento = 0) => {
    const quantidadeRestante = LIMITE_PRIMEIRA_GERACAO - deslocamento;
    const limite = Math.min(LIMITE_POKEMONS_POR_CHAMADA, quantidadeRestante);

    if (limite <= 0) {
      return;
    }

    try {
      if (deslocamento === 0) {
        setCarregando(true);
      } else {
        setCarregandoMais(true);
      }

      setMensagemErro(null);

      const listaPokemons = await buscarListaPokemons(limite, deslocamento);
      const pokemonsComImagem = listaPokemons.map(prepararPokemon);

      if (deslocamento === 0) {
        setPokemons(pokemonsComImagem);
        salvarPokemonsNoCache(pokemonsComImagem);
      } else {
        setPokemons((pokemonsAtuais) => {
          const novaListaPokemons = [...pokemonsAtuais, ...pokemonsComImagem];
          salvarPokemonsNoCache(novaListaPokemons);

          return novaListaPokemons;
        });
      }
    } catch {
      setMensagemErro('Nao foi possivel carregar os pokemons.');
    } finally {
      if (deslocamento === 0) {
        setCarregando(false);
      } else {
        setCarregandoMais(false);
      }
    }
  }, []);

  function favoritarPokemon(pokemon: PokemonComImagem) {
    adicionarFavorito({
      nome: pokemon.name,
      imagem: pokemon.imagemOficial,
    });
  }

  useEffect(() => {
    const pokemonsSalvos = obterPokemonsDoCache();

    if (pokemonsSalvos) {
      setPokemons(pokemonsSalvos);
      setCarregando(false);
      return;
    }

    carregarPokemons();
  }, [carregarPokemons]);

  if (carregando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-900">
        <p className="rounded-xl border border-slate-200 bg-white px-6 py-4 text-center text-lg font-semibold shadow-sm">
          Carregando pokemons...
        </p>
      </main>
    );
  }

  if (mensagemErro) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-900">
        <div className="mx-auto max-w-xl rounded-xl border border-red-200 bg-red-50 p-5 text-center font-semibold text-red-700 shadow-sm">
          {mensagemErro}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-red-600">
              Primeira geracao
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Pokedex
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Explore, filtre e monte seu time com ate seis pokemons.
            </p>
          </div>

          <button
            className="w-full rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 sm:w-auto"
            disabled={favoritos.length === 0}
            onClick={limparTimePokemon}
            type="button"
          >
            Limpar lista
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Meu time Pokemon
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {favoritos.length}/6 favoritos
              </p>
            </div>
          </div>

          {favoritos.length === 0 ? (
            <p className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
              Nenhum pokemon favoritado ainda.
            </p>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {favoritos.map((pokemon) => (
                <div
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center transition hover:border-red-200 hover:bg-white"
                  key={pokemon.nome}
                >
                  <img
                    alt={`Imagem oficial do ${pokemon.nome}`}
                    className="mx-auto h-20 w-20 object-contain sm:h-24 sm:w-24"
                    src={pokemon.imagem}
                  />
                  <strong className="mt-2 block text-sm capitalize">
                    {pokemon.nome}
                  </strong>
                  <button
                    className="mt-2 rounded-md border border-red-200 px-3 py-1 text-sm font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-700"
                    onClick={() => removerFavorito(pokemon.nome)}
                    type="button"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                Lista de pokemons
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {pokemonsFiltrados.length} resultado(s) exibido(s)
              </p>
            </div>

            <div className="w-full lg:max-w-md">
              <label
                className="mb-2 block text-sm font-semibold text-slate-700"
                htmlFor="busca-pokemon"
              >
                Buscar pokemon
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                id="busca-pokemon"
                onChange={(evento) => setTermoBusca(evento.target.value)}
                placeholder="Digite o nome do pokemon"
                type="search"
                value={termoBusca}
              />
            </div>
          </div>

          {pokemonsFiltrados.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
              Nenhum pokemon encontrado.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {pokemonsFiltrados.map((pokemon) => (
                <CardPokemon
                  aoFavoritar={() => favoritarPokemon(pokemon)}
                  aoClicar={() => navegar(`/pokemon/${pokemon.name}`)}
                  desabilitarFavorito={timeCheio && !estaNoTime(pokemon.name)}
                  favoritado={estaNoTime(pokemon.name)}
                  imagem={pokemon.imagemOficial}
                  key={pokemon.name}
                  nome={pokemon.name}
                  numero={pokemon.id}
                />
              ))}
            </div>
          )}
        </section>

        {podeCarregarMais && (
          <div className="flex flex-col items-center gap-4 pt-2">
            {carregandoMais && (
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-red-600" />
                Carregando mais pokemons...
              </div>
            )}

            <button
              className="w-full rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
              disabled={carregandoMais}
              onClick={() => carregarPokemons(pokemons.length)}
              type="button"
            >
              {carregandoMais ? 'Carregando...' : 'Carregar mais pokemons'}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
