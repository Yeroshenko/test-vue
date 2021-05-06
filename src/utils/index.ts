export const addPercent = (value: number, percent: number) => Math.ceil(value + value / 100 * percent)
export const subtractPercent = (value: number, percent: number) => Math.ceil(value - value / 100 * percent)

export const generatePaymentSchedule = (initial: number, total: number, yearsCount: number) => (
  Array(yearsCount).fill(null).map((_, i) => ({
    year: i + 1,
    paymentAmount: Math.ceil(total / yearsCount),
    percentPay: Math.ceil((total - initial) / yearsCount  * (i + 1)),
    debtPay: Math.ceil(initial / yearsCount  * (i + 1)) ,
    remainder: Math.ceil(total - (total / yearsCount * (i + 1)))
  }))
)
