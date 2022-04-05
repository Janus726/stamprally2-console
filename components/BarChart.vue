<script>
import { HorizontalBar, mixins } from 'vue-chartjs'
import chartjsPluginDatalabels from 'chartjs-plugin-datalabels'

export default {
  extends: HorizontalBar,
  mixins: [mixins.reactiveProp],
  props: {
    chartData: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      required: true
    }
  },
  mounted () {
    this.addPlugin(chartjsPluginDatalabels)
    this.renderChart(this.chartData, this.options)
  }
}
</script>

<style scoped>

</style>
