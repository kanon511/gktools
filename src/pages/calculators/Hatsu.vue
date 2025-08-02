<template>
    <div class="flex flex-col items-center justify-center xl:flex-row xl:items-start">
        <div class="flex flex-col items-center w-full max-w-[600px]">
            <Card class="mt-4 w-full">
                <template #content>
                    <ModeSelect :select_id="1" />
                    <p>难度</p>
                    <SelectButton class="my-2" v-model="difficulty_select" :options="difficulty_options"
                        optionLabel="name" optionValue="id" optionDisabled="disabled" :allowEmpty="false" fluid />
                </template>
            </Card>
            <Card class="mt-4 w-full">
                <template #content>
                    <p>试镜前属性</p>
                    <ParameterInput :parameters="parameters" />
                    <p>试镜中得分</p>
                    <ParameterInput :parameters="scores" />
                    <p>排名</p>
                    <SelectButton class="my-2" v-model="rank" :options="rank_options" optionLabel="name"
                        optionValue="value" optionDisabled="disabled" :allowEmpty="false" fluid />
                </template>
            </Card>
        </div>
        <div class="flex flex-col items-center w-full max-w-[600px] xl:ml-4">
            <Card class="mt-4 w-full">
                <template #content>
                    <Panel header="评价总分表" toggleable>
                        <DataTable :value="target_score" size="small" stripedRows rowHove>
                            <Column field="name" header="评价" />
                            <Column field="score" header="所需总分" />
                        </DataTable>
                    </Panel>
                    <p class="mt-4">最终属性 (vo/da/vi)</p>
                    <div class="flex flex-row mt-2">
                        <TextCard theme="red">
                            {{ final_parameters.vocal !== -1 ? final_parameters.vocal : '-' }}
                        </TextCard>
                        <TextCard theme="blue">
                            {{ final_parameters.dance !== -1 ? final_parameters.dance : '-' }}
                        </TextCard>
                        <TextCard theme="yellow">
                            {{ final_parameters.visual !== -1 ? final_parameters.visual : '-' }}
                        </TextCard>
                    </div>
                    <FinalScore :final_score="final_score" />
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
interface HatsuData {
    difficulty: {
        id: number,
        name: string,
        max_parameter: number
    }[],
    score_to_final_score: [number, number][],
    rank_bonus: {
        parameter: number,
        score: number
    }[]
}

import { computed, ref } from 'vue'
import { piecewiseLinearInterpolation, inversePiecewiseLinearInterpolation, dictionarySum, floor } from '@/utils/math'
import { PARAMETER } from '@/constants'

import mode_data from '@/data/mode.json'

const rank_options = ref([
    { name: '1位', value: 0 },
    { name: '2位', value: 1 },
    { name: '3位', value: 2 },
    { name: '4位以下', value: 3 },
])

const mode = mode_data.find(item => item.id === 1)
const mode_external_data: HatsuData = await fetch(import.meta.env.VITE_DATA_URL + (mode ? mode.data_path : ""))
    .then(res => res.json())

const difficulty_options = computed(() => mode_external_data.difficulty)
const difficulty_select = ref(3)
const difficulty = computed(() => difficulty_options.value ? difficulty_options.value.find(item => item.id === difficulty_select.value) : null)

const parameters = ref<{ [key: string]: number | null }>({
    vocal: null,
    dance: null,
    visual: null,
})

const scores = ref<{ [key: string]: number | null }>({
    vocal: null,
    dance: null,
    visual: null,
})

const total_score = computed(() => {
    let value = 0
    for (const key of [...PARAMETER.NAMES]) {
        if (scores.value[key] === null) {
            return -1
        }
        value += scores.value[key]
    }
    return value
})

const rank = ref(0)

const final_parameters = computed(() => {
    const add_parameter = mode_external_data.rank_bonus[rank.value].parameter
    const max_parameter = difficulty.value ? difficulty.value.max_parameter : 1000
    const value: { [key: string]: number } = {
        vocal: parameters.value.vocal !== null ? Math.min(parameters.value.vocal + add_parameter, max_parameter) : -1,
        dance: parameters.value.dance !== null ? Math.min(parameters.value.dance + add_parameter, max_parameter) : -1,
        visual: parameters.value.visual !== null ? Math.min(parameters.value.visual + add_parameter, max_parameter) : -1,
    }
    return value
})

const rank_data: { [key: string]: number } = await fetch(import.meta.env.VITE_DATA_URL + "rank.json")
    .then(res => res.json())
const target_score = computed(() => {
    const value = []
    let minimum_value
    for (const key in rank_data) {
        let required_score = rank_data[key] -
            mode_external_data.rank_bonus[rank.value].score -
            floor(dictionarySum(final_parameters.value) * 2.3)

        const add_value = {
            name: key,
            score: floor(inversePiecewiseLinearInterpolation(mode_external_data.score_to_final_score, required_score))
        }

        if (add_value.score <= 0 || (rank.value === 0 && add_value.score <= 5000)) {
            minimum_value = add_value
        }
        else {
            value.unshift(add_value)
        }
    }
    value.push(minimum_value)
    return value
})

const final_score = computed(() => {
    for (const key of [...PARAMETER.NAMES]) {
        if (final_parameters.value[key] === -1) {
            return -1
        }
    }
    if (total_score.value === -1) {
        return -1
    }

    return floor(dictionarySum(final_parameters.value) * 2.3) +
        floor(piecewiseLinearInterpolation(mode_external_data.score_to_final_score, total_score.value)) +
        mode_external_data.rank_bonus[rank.value].score
})
</script>