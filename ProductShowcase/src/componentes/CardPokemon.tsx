interface PropriedadesCardPokemon {
  nome: string
  imagem: string
  aoClicar: () => void
  aoFavoritar?: () => void
  favoritado?: boolean
  desabilitarFavorito?: boolean
}

function formatarNome(nomePokemon: string): string {
  return nomePokemon.charAt(0).toUpperCase() + nomePokemon.slice(1)
}

export function CardPokemon({
  nome,
  imagem,
  aoClicar,
  aoFavoritar,
  favoritado = false,
  desabilitarFavorito = false,
}: PropriedadesCardPokemon) {
  const nomeFormatado = formatarNome(nome)

  return (
    <article className="group rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-red-300 hover:shadow-md">
      <button
        aria-label={`Ver detalhes do ${nomeFormatado}`}
        className="w-full focus:outline-none focus:ring-2 focus:ring-red-500"
        onClick={aoClicar}
        type="button"
      >
        <div className="aspect-square rounded-md bg-slate-100 p-3">
          <img
            alt={`Imagem oficial do ${nomeFormatado}`}
            className="h-full w-full object-contain transition group-hover:scale-105"
            loading="lazy"
            src={imagem}
          />
        </div>

        <h2 className="mt-3 text-base font-bold text-slate-900">{nomeFormatado}</h2>
      </button>

      {aoFavoritar && (
        <button
          className="mt-3 w-full rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
          disabled={favoritado || desabilitarFavorito}
          onClick={aoFavoritar}
          type="button"
        >
          {favoritado ? 'No time' : desabilitarFavorito ? 'Time cheio' : 'Favoritar'}
        </button>
      )}
    </article>
  )
}
