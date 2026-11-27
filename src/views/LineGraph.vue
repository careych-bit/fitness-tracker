<script setup>
import { computed, onMounted } from "vue"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps(["data"]);

// console.log("data: ", typeof props.data, props.data);

// check user state

const sortedData = computed(() => {
    if (props.data == null){
        return "No data to display";
    }

    const linedata = [];
    const xAxis = [];
    for (const d of props.data) {
        linedata.push(
            {
                date: d.Date,
                duration: d.Duration
            }
        )

        xAxis.push(d.Date)
        // console.log("d.Date: ", d.Date, " d.Duration: ", d.Duration)
        // console.log("d: ", Object.values(d))
    }
    console.log("xAxis: ", xAxis)
    // console.log("linedata: ", typeof linedata, linedata)


    const chartConfig = {
        data: {
        datasets: [{
            label: "Workout Duration Over Time",
            data: linedata
        }],
        labels: [],
        },
        options: {
            parsing: {
                xAxisKey: "date",
                yAxisKey: "duration"
            },
            responsive: true,
            maintainAspectRatio: true
        }
    
    }

    console.log("Chart: ", chartConfig)
    return chartConfig
})


</script>

<template>
    <main>
        <div class="linegraph-div">
            <Line id="linegraph" :data="sortedData.data" :options="sortedData.options">Cannot load chart</Line>
        </div>
    </main>
</template>

<style scoped>

/* .linegraph-div {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
} */

</style>