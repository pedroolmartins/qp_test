<template>
    <div class="min-w-full flex justify-content-center align-items-center" style="min-height: 100vh">
        <i v-if="loading" class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <div v-else>
            <Card>
                <template #title>
                    <div class="flex justify-content-center m-3">
                        <span class="text-4xl">Mapa de poltronas</span>
                    </div>
                </template>
                <template #content>
                    <div class="flex justify-content-center">
                        <div class="mr-3" v-for="x of xAxis">
                            <div class="card-container yellow-container">
                                <div>
                                    <div v-if="x[4].length === 0"
                                        class="block font-bold text-center p-4 border-round mb-3 w-4rem h-4rem">
                                    </div>
                                    <div v-else>
                                        <div v-if="x[4].occupied"
                                            class="block surface-200 font-bold text-center p-4 border-round mb-3 w-4rem h-4rem">
                                            {{ x[4].seat }}
                                        </div>
                                        <div v-else
                                            class="block bg-green-500 font-bold text-center p-4 border-round mb-3 w-4rem h-4rem">
                                            {{ x[4].seat }}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div v-if="x[3].length === 0"
                                        class="block font-bold text-center p-4 border-round mb-3 w-4rem h-4rem">
                                    </div>
                                    <div v-else>
                                        <div v-if="x[3].occupied"
                                            class="block surface-200 font-bold text-center p-4 border-round mb-3 w-4rem h-4rem">
                                            {{ x[3].seat }}
                                        </div>
                                        <div v-else
                                            class="block bg-green-500 font-bold text-center p-4 border-round mb-3 w-4rem h-4rem">
                                            {{ x[3].seat }}
                                        </div>
                                    </div>
                                </div>
                                <div class="block font-bold text-center p-2 border-round mb-3"></div>
                                <div>
                                    <div v-if="x[1].length === 0"
                                        class="block font-bold text-center p-4 border-round mb-3 w-4rem h-4rem">
                                    </div>
                                    <div v-else>
                                        <div v-if="x[1].occupied"
                                            class="block surface-200 font-bold text-center p-4 border-round mb-3 w-4rem h-4rem">
                                            {{ x[1].seat }}
                                        </div>
                                        <div v-else
                                            class="block bg-green-500 font-bold text-center p-4 border-round mb-3 w-4rem h-4rem">
                                            {{ x[1].seat }}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div v-if="x[0].length === 0"
                                        class="block font-bold text-center p-4 border-round mb-3 w-4rem h-4rem">
                                    </div>
                                    <div v-else>
                                        <div v-if="x[0].occupied"
                                            class="block surface-200 font-bold text-center p-4 border-round mb-3 w-4rem h-4rem">
                                            {{ x[0].seat }}
                                        </div>
                                        <div v-else
                                            class="block bg-green-500 font-bold text-center p-4 border-round mb-3 w-4rem h-4rem">
                                            {{ x[0].seat }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Card from 'primevue/card';

const seatsUrl = 'https://queropassagem.qpdevs.com/ws_v4/new/seats'
const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/'
const token = 'Basic dGVzdGVfZGV2MjpXaE9uQmNqVHNHc2VZREU5ODE5R2xvSFloZ0g='
const route = useRoute()
const seats = ref()
const xAxisLength = ref()
const xAxis = ref([])
const loading = ref(true)


onMounted(async () => {
    await getSeats()
})

const getSeats = async () => {
    seats.value = await axios.post(corsProxyUrl + seatsUrl,
        {
            travelId: route.params.travelId,
        },
        {
            headers: {
                'Authorization': token
            }
        })
        .then((r) => {
            loading.value = false
            return r.data
        })

    xAxisLength.value = seats.value[seats.value.length - 1].position.x

    for (let i = 0; i <= xAxisLength.value; i++) {
        xAxis.value[i] = [[], [], [], [], []]
    }

    seats.value.forEach((el) => {
        xAxis.value[el.position.x][el.position.y] = el
    })
}
</script>