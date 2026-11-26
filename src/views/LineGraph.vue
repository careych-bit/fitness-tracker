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
    for (const d of props.data) {
        linedata.push(
            {
                date: d.Date,
                duration: d.Duration
            }
        )
        // console.log("d.date: ", d.date, " d.duration: ", d.duration)
    }
    // console.log("linedata: ", typeof linedata, linedata)

    const chartConfig = {
        data: {
        datasets: [{
            label: "Workout Duration Over Time",
            data: linedata
        }]
        },
        options: {
            parsing: {
                xAxisKey: "date",
                yAxisKey: "duration"
            }
        }
    
    }

    return chartConfig
})


</script>

<template>
    <main>
        <p>Line Graph Page</p>
        <div>
            <Line :data="sortedData.data" :options="sortedData.options">Cannot load chart</Line>
        </div>
    </main>
</template>