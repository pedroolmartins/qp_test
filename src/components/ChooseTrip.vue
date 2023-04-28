<template>
    <div class="min-w-full flex card justify-content-center">
        <Card>
            <template #title>
                <div class="flex justify-content-center m-3">
                    <span class="text-4xl">Resultados da pesquisa</span>
                </div>
            </template>
            <template #content>
                <DataTable :value="results" class="p-datatable-sm text-xs" sortField="departure.time" :sortOrder="1"
                    tableStyle="min-width: 50rem" :rowHover="true" :loading="loading" paginator :rows="11" showGridlines>
                    <template #empty>
                        <span class="flex justify-content-center">Nenhum resultado encontrado</span>
                    </template>
                    <Column sortable field="company.name" header="Empresa"></Column>
                    <Column sortable field="from.name" header="Origem"></Column>
                    <Column sortable field="to.name" header="Destino"></Column>
                    <Column sortable field="availableSeats" header="Poltronas disponíveis"></Column>
                    <Column sortable field="withBPE" header="BPE">
                        <template #body="slotProps">
                            {{ slotProps.data.withBPE ? 'Sim' : 'Não' }}
                        </template>
                    </Column>
                    <Column sortable field="departure.time" header="Horário de embarque"></Column>
                    <Column sortable field="arrival.time" header="Horário de chegada"></Column>
                    <Column sortable field="travelDuration" header="Duração da viagem">
                        <template #body="slotProps">
                            {{ secondsToHours(slotProps.data.travelDuration) }}
                        </template>
                    </Column>
                    <Column sortable field="seatClass" header="Tipo de assento"></Column>
                    <Column sortable field="price.price" header="Preço">
                        <template #body="slotProps">
                            <span
                                v-tooltip="'Imposto: ' + formatCurrency(slotProps.data.price.taxPrice) + ' Assento:' + formatCurrency(slotProps.data.price.seatPrice)">
                                {{ formatCurrency(slotProps.data.price.price) }}
                            </span>
                        </template>
                    </Column>
                    <Column sortable field="insurance" header="Seguro">
                        <template #body="slotProps">
                            {{ formatCurrency(slotProps.data.insurance) }}
                        </template>
                    </Column>
                    <Column sortable field="allowCanceling" header="Aceita cancelamento">
                        <template #body="slotProps">
                            {{ slotProps.data.allowCanceling ? 'Sim' : 'Não' }}
                        </template>
                    </Column>
                    <Column sortable field="travelCancellationLimitDate" header="Data limite de cancelamento de viagem">
                        <template #body="slotProps">
                            {{ formatDate(slotProps.data.travelCancellationLimitDate) }}
                        </template>
                    </Column>
                    <Column header="Opções">
                        <template #body="slotProps">
                            <span v-if="slotProps.data.availableSeats == 0">
                                <Button icon="pi pi-angle-right" size="small" disabled />
                            </span>
                            <span v-else>
                                <Button icon="pi pi-angle-right" size="small" v-tooltip.left="'Acessar mapa de poltronas'"
                                    @click="viewSeats(slotProps.data.id)" />
                            </span>
                        </template>
                    </Column>
                </DataTable>
            </template>
        </Card>
    </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';
import Button from 'primevue/button';

const newSearchUrl = 'https://queropassagem.qpdevs.com/ws_v4/new/search'
const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/'
const token = 'Basic dGVzdGVfZGV2MjpXaE9uQmNqVHNHc2VZREU5ODE5R2xvSFloZ0g='
const route = useRoute()
const router = useRouter()
const results = ref()
const loading = ref(true)
const showDialog = ref(false)
const travelId = ref()

onMounted(async () => {
    await search()
})

const search = async () => {
    results.value = await axios.post(corsProxyUrl + newSearchUrl,
        {
            affiliateCode: 'DEE',
            from: route.params.from,
            to: route.params.to,
            travelDate: route.params.travelDate,
        },
        {
            headers: {
                'Authorization': token
            }
        })
        .then((r) => r.data)

    loading.value = false
}

const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const secondsToHours = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const remainingSeconds = seconds % 3600
    const minutes = Math.floor(remainingSeconds / 60)
    const remainingMinutes = remainingSeconds % 60

    const formattedHours = hours < 10 ? `0${hours}` : hours
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const formattedSeconds = remainingMinutes < 10 ? `0${remainingMinutes}` : remainingMinutes

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}

const formatDate = (dateString) => {
    const date = new Date(dateString)

    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()

    const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year} ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`

    return formattedDate
}

const viewSeats = (id) => {
    router.push({ name: 'seats', params: { travelId: id } })
}
</script>