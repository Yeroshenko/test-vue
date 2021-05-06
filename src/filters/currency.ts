export const currencyFilter = (value: number) => new Intl.NumberFormat('ru', {
  style: 'currency',
  currency: 'RUB',
  minimumFractionDigits: 0
}).format(value)
