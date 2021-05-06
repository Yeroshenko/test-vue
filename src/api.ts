const mockData = {
  target: [
    { label: 'Готовое жилье', value: 7.3 },
    { label: 'Новостройка', value: 0.9 },
    { label: 'Господдержка 2020', value: 10 },
    { label: 'Для семей с детьми', value: 2 },
    { label: 'Дальневосточная ипотека', value: 1 }
  ],
  salaryCardDivider: 0.1,
  housingCost: { min: '300000', max: '30000000', step: '50000' },
  initialFee: { min: '28000', max: '2000000', step: '20000' },
  creditTerm: { min: '1', max: '20' }
}

export type TargetList = typeof mockData.target
export type HousingCoast = typeof mockData.housingCost
export type InitialFee = typeof mockData.initialFee
export type CreditTerm = typeof mockData.creditTerm

type Response = ResponseStatus & { data: ResponseData }
type ResponseStatus = { status: string }
type ResponseData = typeof mockData

export class Api {
  static getInitialValues() {
    return new Promise<Response>((resolve, reject) => {
      setTimeout(() => {
        resolve({
          'status': 'success',
          'data': mockData
        })
        reject(new Error('Registration error'))
      }, 200)
    })
  }
}
