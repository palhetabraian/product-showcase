# React + TypeScript + Vite

## Estrutura sugerida para a Pokedex

```txt
src/
  assets/
  components/
    CardPokemon.tsx
    CampoBusca.tsx
    EstadoCarregando.tsx
    ListaPokemons.tsx
  constants/
    pokemon.ts
  hooks/
    useDetalhesPokemon.ts
    usePokemons.ts
  pages/
    PaginaDetalhesPokemon.tsx
    PaginaInicial.tsx
  services/
    api.ts
    pokemonService.ts
  types/
    pokemon.ts
  utils/
    formatarPokemon.ts
```

- `assets`: imagens, icones e arquivos estaticos usados pela interface.
- `components`: componentes reutilizaveis da tela, como cards, listas, busca e estados visuais.
- `constants`: valores fixos da aplicacao, como limites de paginacao, rotas ou textos padrao.
- `hooks`: hooks customizados para concentrar regras de estado e carregamento dos dados da PokeAPI.
- `pages`: telas principais da aplicacao, separando a pagina inicial da pagina de detalhes.
- `services`: configuracao do Axios e funcoes responsaveis por buscar dados na PokeAPI.
- `types`: tipos TypeScript compartilhados, principalmente os formatos de Pokemon usados no app.
- `utils`: funcoes puras de apoio, como formatacao de nomes, numeros, tipos ou sprites.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
