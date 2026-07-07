interface PropriedadesCardPokemon {
  nome: string
  imagem: string
  aoClicar: () => void
}

function formatarNome(nomePokemon: string): string {
  return nomePokemon.charAt(0).toUpperCase() + nomePokemon.slice(1)
}

export function CardPokemon({
  nome,
  imagem,
  aoClicar,
}: PropriedadesCardPokemon) {
  const nomeFormatado = formatarNome(nome)

  return (
    <button
      aria-label={`Ver detalhes do ${nomeFormatado}`}
      className="group w-full rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-red-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
  )
}
