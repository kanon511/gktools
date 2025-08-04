<template>
    <div class="flex flex-col items-center justify-center xl:flex-row xl:items-start">
        <div class="flex flex-col items-center w-full max-w-[600px]">
            <Card class="mt-4 w-full">
                <template #content>
                    <ModeSelect :select_id="2" />
                    <DifficultySelect :select_id="1" :difficulty_options="difficulty_options" />
                    <div class="flex flex-row my-4">
                        <IdolSelect class="flex-3/4" ref="idol_select_ref" />
                        <FloatLabel class="ml-2 flex-1/4" variant="on">
                            <InputNumber v-model="favorable" :useGrouping="false"
                                :invalid="favorable === null || favorable < 10 || favorable > 20" fluid />
                            <label for="on_label">好感度</label>
                        </FloatLabel>
                    </div>
                    <p>倍率</p>
                    <ParameterMultipleInput :parameters="parameter_bonus" />
                </template>
            </Card>
            <Card class="mt-4 w-full">
                <template #content>
                    <p>试镜前属性</p>
                    <ParameterInput :parameters="parameters">
                        <FloatLabel class="ml-2" variant="on">
                            <InputNumber v-model="parameters.fans" :useGrouping="false"
                                :invalid="parameters.fans === null" fluid />
                            <label for="on_label">粉丝数</label>
                        </FloatLabel>
                    </ParameterInput>
                    <p>试验</p>
                    <SelectButton class="my-2" v-model="audition_select" :options="audition_options" optionLabel="name"
                        optionValue="id" optionDisabled="disabled" :allowEmpty="false" fluid />
                    <p>舞台</p>
                    <SelectButton class="my-2" v-model="stage_select" :options="stage_options" optionLabel="name"
                        optionValue="id" optionDisabled="disabled" :allowEmpty="false" fluid />
                    <StageScoreInfoTable :idol="idol" :stage="stage" />
                    <p>试镜中得分</p>
                    <ParameterInput :parameters="scores" />
                    <!-- <p>是否为一位</p>
                    <SelectButton class="my-2" v-model="is_first" :options="boolean_options" optionLabel="name"
                        optionValue="value" optionDisabled="disabled" :allowEmpty="false" fluid /> -->
                </template>
            </Card>
        </div>
        <div class="flex flex-col items-center w-full max-w-[600px] xl:ml-4">
            <Card class="mt-4 w-full">
                <template #content>
                    <p>试镜获得属性 (vo/da/vi/粉丝数)</p>
                    <div class="flex flex-row mt-2">
                        <TextCard theme="red">
                            {{ increase_parameters.vocal !== -1 ? '+' + increase_parameters.vocal : '-' }}
                        </TextCard>
                        <TextCard theme="blue">
                            {{ increase_parameters.dance !== -1 ? '+' + increase_parameters.dance : '-' }}
                        </TextCard>
                        <TextCard theme="yellow">
                            {{ increase_parameters.visual !== -1 ? '+' + increase_parameters.visual : '-' }}
                        </TextCard>
                        <TextCard theme="green">
                            {{ increase_parameters.fans !== -1 ? '+' + increase_parameters.fans : '-' }}
                        </TextCard>
                    </div>
                    <Panel header="获得属性详细" toggleable collapsed>
                        <p>基础属性</p>
                        <div class="flex flex-row mt-2">
                            <TextCard theme="red">
                                {{ base_increase_parameters.vocal !== -1 ? '+' + base_increase_parameters.vocal : '-' }}
                            </TextCard>
                            <TextCard theme="blue">
                                {{ base_increase_parameters.dance !== -1 ? '+' + base_increase_parameters.dance : '-' }}
                            </TextCard>
                            <TextCard theme="yellow">
                                {{ base_increase_parameters.visual !== -1 ? '+' + base_increase_parameters.visual : '-'
                                }}
                            </TextCard>
                            <TextCard theme="green">
                                {{ base_increase_parameters.fans !== -1 ? '+' + base_increase_parameters.fans : '-' }}
                            </TextCard>
                        </div>
                        <p>属性加成属性</p>
                        <div class="flex flex-row mt-2">
                            <TextCard theme="red">
                                {{ bonu_increase_parameters.vocal !== -1 ? '+' + bonu_increase_parameters.vocal : '-' }}
                            </TextCard>
                            <TextCard theme="blue">
                                {{ bonu_increase_parameters.dance !== -1 ? '+' + bonu_increase_parameters.dance : '-' }}
                            </TextCard>
                            <TextCard theme="yellow">
                                {{ bonu_increase_parameters.visual !== -1 ? '+' + bonu_increase_parameters.visual : '-'
                                }}
                            </TextCard>
                            <TextCard theme="green">
                                -
                            </TextCard>
                        </div>
                    </Panel>
                    <p class="mt-2">最终属性 (vo/da/vi/粉丝数)</p>
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
                        <TextCard theme="green">
                            {{ final_parameters.fans !== -1 ? final_parameters.fans : '-' }}
                        </TextCard>
                    </div>
                    <FinalScore :final_score="final_score" />
                </template>
            </Card>
            <p class="mt-4">
                ※ 计算公式正在测试中，不能保证准确性。为了验证准确性，麻烦请使用实际训练数据进行测试，并核对结果。如果出现错误，请反馈给作者。 By Kanon511
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
interface NiaMasData {
    max_parameter: number,
    audition: {
        id: number,
        name: string,
        stage: {
            id: number,
            name: string,
            disabled?: boolean,
            balance?: any,
            radical?: any,
            score_to_fans?: [number, number][],
        }[]
    }[],
    fans_to_final_score: [number, number][]
}

import { computed, ref, watch } from 'vue'
import { piecewiseLinearInterpolation } from '@/utils/math'
import { PARAMETER } from '@/constants'

import mode_data from '@/data/mode.json'

const mode = mode_data.find(item => item.id === 2)

const difficulty_options = ref(mode ? mode.difficulty : [])
const difficulty_select = ref(1)
const difficulty_data = computed(() => difficulty_options.value ? difficulty_options.value.find(item => item.id === difficulty_select.value) : null)

const difficulty: NiaMasData = await fetch(import.meta.env.VITE_DATA_URL + (difficulty_data.value ? difficulty_data.value.data_path : ""))
    .then(res => res.json())

const idol_select_ref = ref()
const idol = computed(() => idol_select_ref.value?.select_option)
const favorable = ref(20)

const parameter_bonus = ref<{ [key: string]: number | null }>({
    vocal: null,
    dance: null,
    visual: null,
})

const parameters = ref<{ [key: string]: number | null }>({
    vocal: null,
    dance: null,
    visual: null,
    fans: null,
})

const audition_options = computed(() => difficulty.audition)
const audition_select = ref(audition_options.value[audition_options.value.length - 1].id)
const audition = computed(() => audition_options.value.find(item => item.id === audition_select.value))

const stage_options = computed(() => audition.value ? audition.value?.stage : [])
const stage_select = ref(stage_options.value[stage_options.value.length - 1].id)
const stage = computed(() => stage_options.value.find(item => item.id === stage_select.value))

watch(stage_options, (new_value) => {
    stage_select.value = new_value[new_value.length - 1].id
})

const scores = ref<{ [key: string]: number | null }>({
    vocal: null,
    dance: null,
    visual: null,
})

const is_first = ref(true)

const base_increase_parameters = computed(() => {
    const value: { [key: string]: number } = { fans: 0 }
    for (const key of PARAMETER.NAMES) {
        if (scores.value[key] === null || !idol.value) {
            value[key] = -1
            value.fans = -1
        }
        else {
            value[key] = Math.floor(piecewiseLinearInterpolation(
                [[0, 0], ...(stage.value as { [key: string]: any })[idol.value.type][idol.value.specialty[key].toString()]],
                scores.value[key]
            ))
            value.fans = value.fans === -1 ? -1 : (value.fans + scores.value[key])
        }
    }
    value.fans = value.fans === -1 ? -1 : Math.floor(piecewiseLinearInterpolation(
        (stage.value as { [key: string]: any }).score_to_fans,
        value.fans
    ))
    if (!is_first.value) {
        value.fans = 0
    }
    return value
})

const bonu_increase_parameters = computed(() => {
    const value: { [key: string]: number } = {}
    for (const key of PARAMETER.NAMES) {
        if (base_increase_parameters.value[key] === -1 || parameter_bonus.value[key] === null) {
            value[key] = -1
        } else {
            value[key] = Math.floor(base_increase_parameters.value[key] * parameter_bonus.value[key] / 100)
        }
    }
    return value
})

const increase_parameters = computed(() => {
    const value: { [key: string]: number } = { "fans": base_increase_parameters.value.fans }
    for (const key of PARAMETER.NAMES) {
        if (parameter_bonus.value[key] === null || scores.value[key] === null) {
            value[key] = -1
        } else {
            value[key] = base_increase_parameters.value[key]
                + Math.floor(base_increase_parameters.value[key] * parameter_bonus.value[key] / 100)
        }
    }
    return value
})

const final_parameters = computed(() => {
    const value: { [key: string]: number } = {}
    for (const key of [...PARAMETER.NAMES, 'fans']) {
        if (parameters.value[key] === null || increase_parameters.value[key] === -1) {
            value[key] = -1
        }
        else {
            value[key] = parameters.value[key] + increase_parameters.value[key]
            if (key !== 'fans') {
                value[key] = Math.min(value[key], difficulty.max_parameter ?? 0)
            }
        }
    }
    return value
})

const final_score = computed(() => {
    for (const key of [...PARAMETER.NAMES, 'fans']) {
        if (final_parameters.value[key] === -1) {
            return -1
        }
    }

    return Math.floor((final_parameters.value.vocal + final_parameters.value.dance + final_parameters.value.visual) * 2.3)
        + Math.floor(piecewiseLinearInterpolation([[0, 0], ...(difficulty.fans_to_final_score as [])], final_parameters.value.fans))
})
</script>