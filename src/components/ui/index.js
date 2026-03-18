/**
 * @file index.js
 * @description Barrel export de todos os componentes genéricos da pasta ui/.
 *
 * Importe sempre por aqui, não diretamente dos arquivos:
 *
 * @example
 * import { Button, Label, Badge, Card, Modal } from '../ui'
 *
 * Componentes disponíveis:
 *
 * | Componente    | Descrição                                           |
 * |---------------|-----------------------------------------------------|
 * | Button        | Botão com variantes primary/secondary/ghost/danger  |
 * | Label         | Label de seção estilo monospace âmbar               |
 * | Badge         | Tag/pílula para keywords, ratings e status          |
 * | Card          | Container superfície com variantes de borda         |
 * | SelectOption  | Botão de seleção exclusiva (toggle card/pill)       |
 * | Modal         | Overlay + painel central animado                    |
 * | TextInput     | Input com label, hint, erro e toggle show/hide      |
 * | FilterPill    | Grupo de filtros em pílula estilo aba               |
 * | StatCard      | Card de métrica com valor em destaque               |
 * | EmptyState    | Estado vazio para listas sem itens                  |
 * | Spinner       | Indicador de carregamento circular                  |
 * | ProgressBar   | Barra de progresso horizontal animada               |
 * | ErrorBanner   | Banner de erro/alerta inline                        |
 */

export { default as Button }       from './Button'
export { default as Label }        from './Label'
export { default as Badge }        from './Badge'
export { default as Card }         from './Card'
export { default as SelectOption } from './SelectOption'
export { default as Modal }        from './Modal'
export { default as TextInput }    from './TextInput'
export { default as FilterPill }   from './FilterPill'
export { default as StatCard }     from './StatCard'
export { default as EmptyState }   from './EmptyState'
export { default as Spinner }      from './Spinner'
export { default as ProgressBar }  from './ProgressBar'
export { default as ErrorBanner }  from './ErrorBanner'
