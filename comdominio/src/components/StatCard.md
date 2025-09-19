# StatCard Component

Componente reutilizável para exibir cards de estatísticas com ícones, valores e tendências opcionais.

## Props

| Prop | Tipo | Obrigatório | Padrão | Descrição |
|------|------|-------------|---------|-----------|
| `title` | `string` | ✅ | - | Título do card |
| `value` | `string \| number` | ✅ | - | Valor principal a ser exibido |
| `icon` | `React.ReactNode` | ✅ | - | Ícone SVG do card |
| `bgColor` | `string` | ❌ | `'bg-blue-100'` | Classe Tailwind para cor de fundo do ícone |
| `textColor` | `string` | ❌ | `'text-blue-600'` | Classe Tailwind para cor do ícone |
| `trend` | `{value: string, isPositive: boolean}` | ❌ | - | Tendência com seta e cor |
| `className` | `string` | ❌ | `''` | Classes CSS adicionais |

## Exemplos de Uso

### Uso Básico
\`\`\`tsx
<StatCard
  title="Total de Usuários"
  value="1,234"
  icon={<UserIcon />}
/>
\`\`\`

### Com Cores Personalizadas
\`\`\`tsx
<StatCard
  title="Vendas"
  value="R$ 45,678"
  icon={<DollarIcon />}
  bgColor="bg-green-100"
  textColor="text-green-600"
/>
\`\`\`

### Com Tendência
\`\`\`tsx
<StatCard
  title="Crescimento"
  value="12%"
  icon={<TrendIcon />}
  trend={{ value: "+3%", isPositive: true }}
/>
\`\`\`

### Cores Disponíveis
- **Azul**: `bg-blue-100` / `text-blue-600`
- **Verde**: `bg-green-100` / `text-green-600`
- **Amarelo**: `bg-yellow-100` / `text-yellow-600`
- **Vermelho**: `bg-red-100` / `text-red-600`
- **Roxo**: `bg-purple-100` / `text-purple-600`
- **Cinza**: `bg-gray-100` / `text-gray-600`