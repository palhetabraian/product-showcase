## 1. Resumo do projeto

O projeto foi feito com React, TypeScript, Axios, React Router Dom e TailwindCss.

A apliçao possui duas telas principais:
- Home: Lista os pokemons, permite buscar por nome e favorita pokemon.
- Detalhes: exibe dados completos de um pokemon selecionado (nome, tipagem, altura e peso).

Também foram implementados os bonus
- Context API para montar um Time pokemon.
- Limite de 6 pokemons favoritos. (Pedi ajuda ao codex com context)
- Cache com localStorage
- Persistencia do time favorito ao atualizar a pagina 
- Carregamento paginado de 30 em 30 pokemons
- Layout responsivo com TailWindCSS.

## 3. Estrutura de pastas 
src/
  components/
    CardPokemon.tsx
  contexts/
    TimePokemonContext.tsx
    timePokemonCache.ts
    timePokemonContexto.ts
    useTimePokemon.ts
  pages/
    PaginaInicial.tsx
    PaginaDetalhesPokemon.tsx
  services/
    api.ts
  types/
    pokemon.ts
  App.tsx
  main.tsx
  index.css

  ### Justificativa
  - components: componentes reutilizaveis da aplicação
  - pages: telas completas da aplicação, separando home e detalhes do pokemon
  - types: interfaces Typescript dos dados vindo da API
  - contexts: Estados do react, hooks de acesso ao contexto e funções de cache.

  ### 4. Consumo da API
  O arquivo principal é: 
  src/services.api.ts

  ## 5. Home
  Arquivo: 
  src/pages/PaginaInicial.tsx

### Solução para imagem na lista

O endpoint de lista da PokeAPI retorna apenas:

name
url

Problema: a lista da PokeAPI nao traz imagem.
Solução: extrair o id da URL do pokemon e montar a URL da imagem oficial.

### Time pokemon sumia ao atualizar a pagina
Problema: O time estava apenas no estado React.
Solução: persistir favoritos no localStorage


## 4. Dificuldades encontradas

Escalabilidade do projeto: 
Conforme novas funcionalidades foram sendo adicionadas, surgiram duvidas sobre organização e estrutura do projeto. Tive dificuldades em manter o codigo limpo e organizado.

Context API e Hooks:
Tive dificuldades com a pasta Hooks, principalmente para entender o papel dos Contextos e dos hooks personalizados.

Axis:
Por estar há algum tempo sem trabalhar com a biblioteca. foi necessario ajuda do Codex para utilizar as requisições a API

Tipagem com TypeScript no React:
Por estar adquirindo experiencia com TypeScript. Em alguns momentos foramn necessario compreender melhor como tipar propiedades, estados, hooks, Context apis e os dados retornados pela API.

## 5. Auxlio com Inteligência Artificial
Durante o desenvolvimento, utilizei o Codex(GPT-5.5) como apoio ao processo do desenvolvimento. A IA foi utilizada para esclarecer dúvidas, revisar trechos de código, sugerir melhorias na organização do projeto, auxiliar na documentação e explicar conceitos relacionados ao React, TypeScript, Context API e outras tecnologias utilizadas. Todas as decisões de implementação, adaptações, validações e testes das funcionalidades foram realizados por mim, utilizando a IA como uma ferramenta de suporte ao aprendizado e à produtividade.