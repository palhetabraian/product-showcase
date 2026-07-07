interface PropriedadesCardPokemon {
  nome: string
  imagem: string
  aoClicar: () => void
  numero?: number
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
  numero,
  aoFavoritar,
  favoritado = false,
  desabilitarFavorito = false,
}: PropriedadesCardPokemon) {
  const nomeFormatado = formatarNome(nome)
  const numeroFormatado = numero ? `#${String(numero).padStart(3, '0')}` : null

  return (
    <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-red-300 hover:shadow-lg">
      <button
        aria-label={`Ver detalhes do ${nomeFormatado}`}
        className="w-full p-4 text-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
        onClick={aoClicar}
        type="button"
      >
        <div className="aspect-square rounded-lg bg-gradient-to-b from-slate-50 to-slate-100 p-4">
          <img
            alt={`Imagem oficial do ${nomeFormatado}`}
            className="h-full w-full object-contain transition group-hover:scale-105"
            loading="lazy"
            src={imagem}
          />
        </div>

        {numeroFormatado && (
          <span className="mt-4 block text-xs font-bold text-slate-500">
            {numeroFormatado}
          </span>
        )}

        <h2 className="mt-1 text-base font-bold text-slate-950">
          {nomeFormatado}
        </h2>
      </button>

      {aoFavoritar && (
        <button
          className="mx-4 mb-4 w-[calc(100%-2rem)] rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400"
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
