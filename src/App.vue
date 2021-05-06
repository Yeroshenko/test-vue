<template>
  <div class='app' v-if='loaded'>
    <vs-select
      block
      placeholder='Выберете цель кридита'
      v-model='target'
      class='mb-20'
    >
      <template #message-success v-if='submitted && !$v.target.targetIsCorrect'>
        <span class='error-message'>Это обязательное поле</span>
      </template>
      <vs-option
        v-for='({ label, value }, i) in targetList'
        :key='i' :value='value' :label='label'
      >
        {{ label }}
      </vs-option>
    </vs-select>
    <vs-checkbox v-model='haveSalaryCard'>
      Есть зарплатная карта
    </vs-checkbox>
    <custom-slider
      :min='housingCoastParams.min'
      :max='housingCoastParams.max'
      :step='housingCoastParams.step'
      v-model='housingCost'
      class='mx-20'
    />
    <p>Стоимость жилья: {{ +housingCost | currency }}</p>
    <custom-slider
      :min='initialFeeParams.min'
      :max='initialFeeParams.max'
      :step='initialFeeParams.step'
      v-model='initialFee'
    />
    <p>Первоначальный взнос: {{ +initialFee | currency }}</p>
    <span class='error-message' v-if='submitted && !$v.initialFee.belowThePrice'>
      Первоначальный взнос не может перевышать стоимость жилья
    </span>
    <custom-slider
      :min='creditTermParams.min'
      :max='creditTermParams.max'
      step='1'
      v-model='creditTerm'
    />
    <p class='mb-20'>Срок кредита: {{ +creditTerm | years }}</p>
    <vs-button size='large' block @click='this.submit'>График платежей</vs-button>
    <vs-dialog scroll overflow-hidden auto-width v-model='paymentScheduleIsOpen'>
      <template #header>
        <h3>График Платежей</h3>
      </template>
      <vs-table striped>
        <template #thead>
          <vs-tr>
            <vs-th>Год</vs-th>
            <vs-th class='text-center'>Сума платежа</vs-th>
            <vs-th class='text-center'>Погашение процентов</vs-th>
            <vs-th class='text-center'>Погашение основного долга</vs-th>
            <vs-th class='text-center'>Остаток догла</vs-th>
          </vs-tr>
        </template>
        <template #tbody>
          <vs-tr v-for='(tr, i) in paymentScheduleData' :key='i' :data='tr'>
            <vs-td>{{ tr.year }}</vs-td>
            <vs-td class='text-center'>{{ tr.paymentAmount | currency }}</vs-td>
            <vs-td class='text-center'>{{ tr.percentPay | currency }}</vs-td>
            <vs-td class='text-center'>{{ tr.debtPay | currency }}</vs-td>
            <vs-td class='text-center'>{{ tr.remainder | currency }}</vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vs-dialog>
  </div>
</template>

<script lang='ts'>
//@ts-ignore
import CustomSlider from 'vue-custom-range-slider'
import { Component, Vue } from 'vue-property-decorator'
import 'vue-custom-range-slider/dist/vue-custom-range-slider.css'
import { Api, CreditTerm, HousingCoast, InitialFee, TargetList } from '@/api'
import { addPercent, generatePaymentSchedule, subtractPercent } from '@/utils'

type PaymentScheduleItem = {
  year: number,
  paymentAmount: number,
  percentPay: number,
  debtPay: number,
  remainder: number
}

const belowThePrice = (value: number, vm: App) => value < +vm.housingCost
const targetIsCorrect = (value: number) => value > 0


@Component({
  name: 'App',
  components: { CustomSlider },
  validations: {
    target: { targetIsCorrect },
    initialFee: { belowThePrice }
  }
})
export default class App extends Vue {
  loaded = false
  submitted = false

  target = 0
  haveSalaryCard = false
  housingCost = '0'
  initialFee = '0'
  creditTerm = '1'

  betSize = 0
  paymentScheduleData = null as null | Array<PaymentScheduleItem>
  paymentScheduleIsOpen = false

  targetList = null as null | TargetList
  salaryCardDivider = 0
  housingCoastParams = {} as HousingCoast
  creditTermParams = {} as CreditTerm
  initialFeeParams = {} as InitialFee


  async mounted() {
    const res = await Api.getInitialValues()
    const { target, creditTerm, housingCost, initialFee, salaryCardDivider } = res.data

    this.targetList = target
    this.salaryCardDivider = salaryCardDivider
    this.housingCoastParams = housingCost
    this.initialFeeParams = initialFee
    this.creditTermParams = creditTerm

    this.housingCost = housingCost.min
    this.initialFee = initialFee.min
    this.creditTerm = creditTerm.min

    this.loaded = true
  }

  addPercentForBetSize(percent: number) {
    this.betSize = addPercent(this.betSize, +percent)
  }

  subtractPercentForBetSize(percent: number) {
    this.betSize = subtractPercent(this.betSize, +percent)
  }

  submit() {
    this.submitted = true

    this.$v.$touch()

    if (!this.$v.$invalid) {
      this.betSize = +this.housingCost
      this.addPercentForBetSize(this.target)
      this.haveSalaryCard
        ? this.subtractPercentForBetSize(this.salaryCardDivider)
        : this.addPercentForBetSize(this.salaryCardDivider)
      this.betSize = this.betSize - +this.initialFee

      this.paymentScheduleData = generatePaymentSchedule(
        +this.housingCost - +this.initialFee,
        this.betSize, +this.creditTerm
      )

      this.paymentScheduleIsOpen = true
    }
  }
}
</script>
