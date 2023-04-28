<template>
    <form @submit.prevent="submitForm">
        <div class="min-w-full card flex justify-content-center align-items-center" style="min-height: 100vh">
            <Dropdown class="m-2" v-model="selectedStopFrom" :options="stops" optionLabel="name" filter
                placeholder="Escolha a cidade de partida" style="width: 350px;" @change="stopDetail" :loading="loading" />
            <Dropdown class="m-2" v-model="selectedStopTo" :options="stops" optionLabel="name" filter
                placeholder="Escolha a cidade de destino" style="width: 350px;" @change="stopDetail" :loading="loading" />
            <Calendar class="m-2" v-model="date" dateFormat="dd/mm/yy" v-on:update:modelValue="checkFields"
                placeholder="Escolha a data" :minDate="minDate" />

            <Button class="m-2" type="submit" label="Buscar" :loading="loading" :disabled="disableButton" />
        </div>
    </form>

    <Dialog v-model:visible="showDialog" modal header="Atenção!" :style="{ width: '30vw' }">
        <p>
            Somente cidades dos estados de SP e PR podem ser selecionadas.
        </p>
    </Dialog>
</template>

<script setup>
import axios from "axios"
import Dropdown from 'primevue/dropdown'
import { onMounted, ref } from "vue"
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { useRouter } from "vue-router"
import Calendar from 'primevue/calendar'

const stopsUrl = 'https://queropassagem.qpdevs.com/ws_v4/stops'
const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/'
const token = 'Basic dGVzdGVfZGV2MjpXaE9uQmNqVHNHc2VZREU5ODE5R2xvSFloZ0g='
const stops = ref()
const selectedStopFrom = ref('')
const selectedStopTo = ref('')
const loading = ref(true)
const showDialog = ref(false)
const disableButton = ref(true)
const router = useRouter()
const date = ref()
const minDate = ref(new Date())

onMounted(async () => {
    await getStops()
})

const getStops = async () => {
    stops.value = await axios.get(corsProxyUrl + stopsUrl, {
        headers: {
            'Authorization': token
        }
    })
        .then((r) => {
            loading.value = false
            return r.data
        })
}

const stopDetail = async (el) => {
    loading.value = true
    checkFields()

    await axios.get(corsProxyUrl + stopsUrl + '/' + el.value.id, {
        headers: {
            'Authorization': token
        }
    })
        .then((r) => {
            if (r.data.state !== 'SP' && r.data.state !== 'PR') {
                showDialog.value = true
                selectedStopFrom.value = ''
                selectedStopTo.value = ''
                checkFields()
            }
        })

    loading.value = false
}

const checkFields = () => {
    disableButton.value = (selectedStopFrom.value.id && selectedStopTo.value.id && date.value) ? false : true
}

const submitForm = (el) => {
    const year = new Date(date.value).getFullYear()
    const month = (new Date(date.value).getMonth() + 1).toLocaleString('pt-BR', { minimumIntegerDigits: 2 })
    const day = new Date(date.value).getDate()
    const travelDate = year + '-' + month + '-' + day

    router.push({ name: 'choose-trip', params: { from: selectedStopFrom.value.id, to: selectedStopTo.value.id, travelDate: travelDate } })
}

</script>