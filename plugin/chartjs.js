import Vue from 'vue'
import { Doughnut, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

Vue.component('DoughnutChart', {
  extends: Doughnut,
  mixins: [reactiveProp],
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
})
