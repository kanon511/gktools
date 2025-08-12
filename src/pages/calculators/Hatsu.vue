<template>
    <div class="flex flex-col items-center justify-center xl:flex-row xl:items-start">
        <div class="flex flex-col items-center w-full max-w-[600px]">
            <Card class="mt-4 w-full">
                <template #content>
                    <ModeSelect :select_id="1" />
                    <p>难度</p>
                    <SelectButton class="my-2" v-model="difficulty_select" :options="difficulty_options"
                        optionLabel="name" optionValue="id" optionDisabled="disabled" :allowEmpty="false" fluid />
                    <div class="flex flex-row items-center mt-2">
                        <p class="mr-2">强化月间·星</p>
                        <ToggleSwitch v-model="is_enhanced_month" />
                        <IconTooltip class="ml-2">
                            <p>实验性功能，不支持评价所需得分。</p>
                        </IconTooltip>
                    </div>
                </template>
            </Card>
            <Card class="mt-4 w-full">
                <template #content>
                    <p>试镜前属性</p>
                    <ParameterInput :parameters="parameters">
                        <FloatLabel class="ml-2" variant="on" v-if="is_enhanced_month">
                            <InputNumber v-model="parameters.star" :useGrouping="false"
                                :invalid="parameters.star === null" fluid />
                            <label for="on_label">星星数</label>
                        </FloatLabel>
                    </ParameterInput>
                    <div class="flex flex-row items-center mt-4">
                        <p class="flex-8/16">试镜中得分</p>
                        <div class="flex flex-1/8 items-center justify-center" v-if="difficulty_select < 3">
                            <p>*好感度低于4</p>
                            <ToggleSwitch class="mx-2" v-model="is_first" />
                            <IconTooltip>
                                <p>尚未核实，在实际情况中，游玩角色的第一次时，即好感度小于4时，最终一位的各属性只会增加10点。</p>
                            </IconTooltip>
                        </div>
                    </div>
                    <FloatLabel class="mt-4" variant="on">
                        <InputNumber v-model="total_score" :useGrouping="false" :invalid="total_score === null" fluid />
                        <label for="on_label">总分</label>
                    </FloatLabel>
                    <p class="mt-4">排名</p>
                    <SelectButton class="my-2" v-model="rank" :options="rank_options" optionLabel="name"
                        optionValue="value" optionDisabled="disabled" :allowEmpty="false" fluid />
                </template>
            </Card>
        </div>
        <div class="flex flex-col items-center w-full max-w-[600px] xl:ml-4">
            <Card class="mt-4 w-full">
                <template #content>
                    <Panel header="评价总分表" toggleable>
                        <div class="flex flex-row items-center mb-2">
                            <p class="mr-2">显示过高得分</p>
                            <ToggleSwitch v-model="is_display_high_score" />
                        </div>
                        <DataTable :value="target_score" size="small" stripedRows>
                            <Column class="!text-center" field="name">
                                <template #header>
                                    <p class="w-full text-center font-bold">评价</p>
                                </template>
                            </Column>
                            <Column class="!text-center" field="score">
                                <template #header>
                                    <p class="w-full text-center font-bold">所需总分</p>
                                </template>
                            </Column>
                            <Column class="w-24 !text-end">
                                <template #body="{ data }">
                                    <Button icon="pi pi-check" @click="selectRow(data)" severity="secondary"
                                        rounded></Button>
                                </template>
                            </Column>
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
                        <TextCard v-if="is_enhanced_month" theme="purple">
                            {{ final_parameters.star !== -1 ? final_parameters.star : '-' }}
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
        max_parameter: number,
        high_score: number,
        enhanced_month: {
            score_to_star: [number, number][],
            max_star: number,
            star_to_final_score_multiplier: number
        }
    }[],
    score_to_final_score: [number, number][],
    rank_bonus: {
        parameter: number,
        score: number
    }[]
}

import { computed, ref } from 'vue'
import { piecewiseLinearInterpolation, inversePiecewiseLinearInterpolation, floor, ceil, parameterSum } from '@/utils/math'
import { PARAMETER } from '@/constants'

import ToggleSwitch from 'primevue/toggleswitch';

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

const is_enhanced_month = ref(false)

const parameters = ref<{ [key: string]: number | null }>({
    vocal: null,
    dance: null,
    visual: null,
    star: null,
})
const total_score = ref<number | null>(null)
const rank = ref(0)

const is_first = ref(false)
const is_display_high_score = ref(false)

const rank_bonus_parameter = computed(() => {
    if (is_first.value && rank.value < 3 && difficulty.value && difficulty.value.id < 3) {
        return 10
    }
    return mode_external_data.rank_bonus[rank.value].parameter
})

const final_parameters = computed(() => {
    const add_parameter = rank_bonus_parameter.value
    const add_star = floor(piecewiseLinearInterpolation(
        [[0, 0], ...difficulty.value ? difficulty.value.enhanced_month.score_to_star : []],
        total_score.value || 0
    ))
    const max_parameter = difficulty.value ? difficulty.value.max_parameter : 1000
    const value: { [key: string]: number } = {
        vocal: parameters.value.vocal !== null ? Math.min(parameters.value.vocal + add_parameter, max_parameter) : -1,
        dance: parameters.value.dance !== null ? Math.min(parameters.value.dance + add_parameter, max_parameter) : -1,
        visual: parameters.value.visual !== null ? Math.min(parameters.value.visual + add_parameter, max_parameter) : -1,
        star: parameters.value.star !== null ? Math.min(parameters.value.star + add_star, difficulty.value ? difficulty.value.enhanced_month.max_star : 500) : -1
    }
    return value
})
const total_parameter = computed(() => parameterSum(final_parameters.value))

const rank_data: { [key: string]: number } = await fetch(import.meta.env.VITE_DATA_URL + "rank.json")
    .then(res => res.json())
const target_score = computed(() => {
    const value: { name: string, score: number }[] = []
    for (const key of [...PARAMETER.NAMES]) {
        if (final_parameters.value[key] === -1) {
            return value
        }
    }

    if (is_enhanced_month.value) return value

    if (total_parameter.value === undefined) {
        return value
    }
    let minimum_value
    for (const key in rank_data) {
        let required_score = rank_data[key] -
            mode_external_data.rank_bonus[rank.value].score -
            floor(total_parameter.value * 2.3)

        const add_value = {
            name: key,
            score: ceil(inversePiecewiseLinearInterpolation(mode_external_data.score_to_final_score, required_score))
        }

        if (add_value.score <= 0 || (rank.value === 0 && add_value.score <= 4000)) {
            minimum_value = add_value
        }
        else {
            if (value.length < 2 || is_display_high_score.value ||
                (!is_display_high_score.value && add_value.score < (difficulty.value ? difficulty.value.high_score : 100000))) {
                value.unshift(add_value)
            }
        }
    }
    if (minimum_value) {
        value.push(minimum_value)
    }
    return value
})

function selectRow(data: { name: string, score: number }) {
    total_score.value = data.score
}

const final_score = computed(() => {
    let value = 0
    for (const key of PARAMETER.NAMES) {
        if (final_parameters.value[key] === -1) {
            return -1
        }
    }
    if (total_score.value === null) {
        return -1
    }
    if (total_parameter.value === undefined) {
        return -1
    }

    value = floor(total_parameter.value * 2.3) +
        floor(piecewiseLinearInterpolation(mode_external_data.score_to_final_score, total_score.value)) +
        mode_external_data.rank_bonus[rank.value].score

    if (is_enhanced_month.value) {
        if (parameters.value.star === null || !difficulty.value) {
            return -1
        }
        value = floor(value * 0.6) + floor(final_parameters.value.star * difficulty.value.enhanced_month.star_to_final_score_multiplier)
    }

    return value
})
</script>