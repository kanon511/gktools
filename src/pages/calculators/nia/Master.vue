<template>
    <div class="flex flex-col items-center justify-center xl:flex-row xl:items-start">
        <div class="flex flex-col items-center w-full max-w-[600px]">
            <Card class="mt-4 w-full">
                <template #content>
                    <ModeSelect :select_id="2" />
                    <DifficultySelect :select_id="2" :difficulty_options="difficulty_options" />
                    <IdolSelect class="my-4" ref="idol_select_ref" />
                    <div class="flex flex-row items-center mb-2">
                        <p class="mr-2">强化月间·星</p>
                        <ToggleSwitch v-model="is_enhanced_week" />
                        <IconTooltip class="ml-2">
                            <p>除了mas的期末试镜以外，其他试镜的星星数的计算有比较大的误差，特别是得分未达到星星数上限要求时。</p>
                        </IconTooltip>
                    </div>
                    <p>倍率</p>
                    <ParameterMultipleInput :parameters="parameter_bonus">
                        <FloatLabel class="ml-2" variant="on">
                            <InputNumber v-model="initial_item_bonus" :useGrouping="false"
                                :invalid="initial_item_bonus === null" fluid />
                            <label for="on_label">初始道具加成%</label>
                        </FloatLabel>
                    </ParameterMultipleInput>
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
                        <FloatLabel class="ml-2" variant="on" v-if="is_enhanced_week">
                            <InputNumber v-model="parameters.star" :useGrouping="false"
                                :invalid="parameters.star === null" fluid />
                            <label for="on_label">星星数</label>
                        </FloatLabel>
                    </ParameterInput>
                    <p>试镜</p>
                    <SelectButton class="my-2" v-model="audition_select" :options="audition_options" optionLabel="name"
                        optionValue="id" optionDisabled="disabled" :allowEmpty="false" fluid />
                    <p>舞台</p>
                    <SelectButton class="my-2" v-model="stage_select" :options="stage_options" optionLabel="name"
                        optionValue="id" optionDisabled="disabled" :allowEmpty="false" fluid />
                    <StageScoreInfoTable :idol="idol" :stage="stage" :is_enhanced_month="is_enhanced_week"
                        :score_to_star="audition?.score_to_star" />
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
                    <Panel header="推荐得分表" toggleable>
                        <div class="flex flex-row items-center">
                            <p>优先选项</p>
                            <IconTooltip class="ml-2">
                                <p>注意：选择高结算属性优先，同样得分下时，其他剧本有可能同时有高属性和低得分要求，该选项仅能保证在特定得分下获得属性值最高。<br>
                                    输入推荐得分后请切换其他试镜以确实是否含有更好选择。<br>
                                    点击右侧按钮可以一键输入推荐得分验证并修正。</p>
                            </IconTooltip>
                        </div>
                        <SelectButton class="my-2" v-model="priority_select" :options="priority_options"
                            optionLabel="name" optionValue="id" optionDisabled="disabled" :allowEmpty="false" fluid />
                        <!-- <p>试镜中倍率</p>
                        <ParameterMultipleInput :parameters="stage_score_bonus" />
                        <div class="flex flex-row items-center mb-2">
                            <p>卡组类型</p>
                            <IconTooltip class="ml-2">
                                <p>用于设置卡组被动得分占比的预设值，如果卡组体系较为复杂，请使用高级选项。<br>
                                    不设置类型视为没有卡组被动得分。
                                </p>
                            </IconTooltip>
                            <FloatLabel variant="on" class="w-1/4 mx-2">
                                <Select class="w-full" v-model="average_score_multiplier_select"
                                    :options="average_score_multiplier_options" optionLabel="name" optionValue="id" />
                                <label for="on_label">类型</label>
                            </FloatLabel>
                            <p class="mr-2">高级选项</p>
                            <ToggleSwitch v-model="is_average_score_multiplier_option" />
                        </div>
                        <div class="flex flex-row items-center mb-2" v-if="is_average_score_multiplier_option">
                            <p class="w-28">卡组被动得分占比</p>
                            <IconTooltip class="ml-2">
                                <p>卡组在各回合中被动得分在总得分中的占比，如果不会设置请使用预设值。<br>
                                    仅对预期得分的推测有略微影响，设置适当可以提高推测的合理性。<br>
                                    被动/不可操控的得分越高，得分越平均，该值越高，例如好印象。<br>
                                    主动/可操控的得分越高，得分越极端，该值越低，例如干劲。<br>
                                </p>
                            </IconTooltip>
                            <Slider v-model="average_score_multiplier" :step="0.01" :max="1" class="w-full mx-4" />
                            <div class="w-32">
                                <InputNumber v-model="average_score_multiplier" :useGrouping="false" fluid />
                            </div>
                        </div> -->
                        <p>推荐得分</p>
                        <DataTable class="text-sm" :value="recommend_score_table" size="small" stripedRows
                            rowGroupMode="rowspan" groupRowsBy="name">
                            <Column class="!text-center" field="rank">
                                <template #header>
                                    <p class="w-full text-center font-bold">评价</p>
                                </template>
                            </Column>
                            <Column v-for="name in PARAMETER.NAMES" class="!text-center" :field="name">
                                <template #header>
                                    <p class="w-full text-center font-bold">{{ name }}</p>
                                </template>
                            </Column>
                            <Column class="!text-center" field="total_score">
                                <template #header>
                                    <p class="w-full text-center font-bold">总分</p>
                                </template>
                            </Column>
                            <Column class="!text-center" field="total_parameter">
                                <template #header>
                                    <p class="w-full text-center font-bold">总获得属性</p>
                                </template>
                            </Column>
                            <Column class="!text-center" field="stage">
                                <template #header>
                                    <p class="w-full text-center font-bold">剧本</p>
                                </template>
                            </Column>
                            <Column class="!text-end">
                                <template #body="{ data }">
                                    <Button icon="pi pi-check" @click="selectRow(data)" severity="secondary"
                                        size="small" rounded></Button>
                                </template>
                            </Column>
                        </DataTable>
                    </Panel>
                </template>
            </Card>
            <Card class="mt-4 w-full">
                <template #content>
                    <p>试镜获得属性 (vo/da/vi/粉丝数{{ is_enhanced_week ? '/星星数' : '' }})</p>
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
                        <TextCard v-if="is_enhanced_week" theme="purple">
                            {{ increase_parameters.star !== -1 ? '+' + increase_parameters.star : '-' }}
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
                        </div>
                        <p>初始道具加成属性</p>
                        <div class="flex flex-row mt-2">
                            <TextCard theme="red">
                                {{ initial_item_bonu_increase_parameters.vocal !== -1 ? '+' +
                                    initial_item_bonu_increase_parameters.vocal : '-' }}
                            </TextCard>
                            <TextCard theme="blue">
                                {{ initial_item_bonu_increase_parameters.dance !== -1 ? '+' +
                                    initial_item_bonu_increase_parameters.dance : '-' }}
                            </TextCard>
                            <TextCard theme="yellow">
                                {{ initial_item_bonu_increase_parameters.visual !== -1 ? '+' +
                                    initial_item_bonu_increase_parameters.visual : '-'
                                }}
                            </TextCard>
                        </div>
                    </Panel>
                    <p class="mt-2">最终属性 (vo/da/vi/粉丝数{{ is_enhanced_week ? '/星星数' : '' }})</p>
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
                        <TextCard v-if="is_enhanced_week" theme="purple">
                            {{ final_parameters.star !== -1 ? final_parameters.star : '-' }}
                        </TextCard>
                    </div>
                    <FinalScore :final_score="final_score" />
                </template>
            </Card>
            <p class="mt-4">
                ※ 计算公式正在测试中，不能保证准确性。为了验证准确性，麻烦请使用实际训练数据进行测试，并核对结果。反馈错误或建议请加QQ群：262823155。<br>
                ※ 数据来源：<a href="https://seesaawiki.jp/gakumasu/d/N.I.A/%a5%de%a5%b9%a5%bf%a1%bc"
                    target="_blank">WIKI</a> By
                Kanon511
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
        }[],
        score_to_star: [number, number][]
    }[],
    fans_to_final_score: [number, number][],
    enhanced_month: {
        max_star: number,
        star_to_final_score_multiplier: number
    }
}

import { computed, ref, watch } from 'vue'
import { dictionarySum, floor, piecewiseLinearInterpolation } from '@/utils/math'
import { PARAMETER } from '@/constants'

import ToggleSwitch from 'primevue/toggleswitch';

import mode_data from '@/data/mode.json'
// import average_score_multiplier_data from '@/data/player_cards_type.json'

const rank_data: { [key: string]: number } = await fetch(import.meta.env.VITE_DATA_URL + "rank.json")
    .then(res => res.json())

const mode = mode_data.find(item => item.id === 2)

const difficulty_options = ref(mode ? mode.difficulty : [])
const difficulty_select = ref(2)
const difficulty_data = computed(() => difficulty_options.value ? difficulty_options.value.find(item => item.id === difficulty_select.value) : null)

const difficulty: NiaMasData = await fetch(import.meta.env.VITE_DATA_URL + (difficulty_data.value ? difficulty_data.value.data_path : ""))
    .then(res => res.json())

const is_enhanced_week = ref(false)

const idol_select_ref = ref()
const idol = computed(() => idol_select_ref.value?.select_option)

const parameter_bonus = ref<{ [key: string]: number | null }>({
    vocal: null,
    dance: null,
    visual: null,
})
const initial_item_bonus = ref(40)

const parameters = ref<{ [key: string]: number | null }>({
    vocal: null,
    dance: null,
    visual: null,
    fans: null,
    star: null,
})

const audition_options = computed(() => difficulty.audition)
const audition_select = ref(audition_options.value[audition_options.value.length - 1].id)
const audition = computed(() => audition_options.value.find(item => item.id === audition_select.value))

const stage_options = computed(() => audition.value ? audition.value.stage : [])
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

const priority_options = ref([
    { id: 1, name: '低得分要求优先' },
    { id: 2, name: '高结算属性优先' },
])
const priority_select = ref(priority_options.value[0].id)

// const stage_score_bonus = ref({
//     vocal: null,
//     dance: null,
//     visual: null,
// })

const recommend_score_table = computed(() => {
    const value = []
    if (!idol.value || parameters.value.fans === null || initial_item_bonus.value === null) return []
    if (is_enhanced_week.value && parameters.value.star === null) return []
    for (const rank in rank_data) {
        let rank_value
        for (const stage of stage_options.value) {
            if (stage.disabled) continue
            const calculate_parameter = (score: { [key: string]: number }) => {
                const value: { [key: string]: number } = { fans: 0 }
                let total_score = 0
                for (const key of PARAMETER.NAMES) {
                    if (parameters.value[key] === null || parameter_bonus.value[key] === null) {
                        return null
                    }
                    else {
                        value[key] = floor(piecewiseLinearInterpolation(
                            [[0, 0], ...(stage as { [key: string]: any })[idol.value.type][idol.value.specialty[key].toString()]],
                            score[key]
                        ))
                        value[key] += floor(value[key] * parameter_bonus.value[key] / 100) +
                            floor(value[key] * initial_item_bonus.value / 100)
                        total_score += score[key]
                    }
                }

                value.fans = floor(piecewiseLinearInterpolation(
                    (stage as { [key: string]: any }).score_to_fans,
                    total_score
                ))

                if (is_enhanced_week.value && audition.value) {
                    value.star = floor(piecewiseLinearInterpolation(
                        [[0, 0], ...audition.value?.score_to_star],
                        total_score
                    ))
                }

                if (!is_first.value) {
                    value.fans = 0
                }
                return value
            }
            const run_func = (score: { [key: string]: number }) => {
                const max_growth_rate_parameter = {
                    name: '',
                    value: 0,
                    max_add_score: 0,
                }
                for (const key of PARAMETER.NAMES) {
                    let growth_rate = 0
                    let max_add_score = 0
                    const idol_parameter_rank = idol.value.specialty[key]
                    const stage_parameter_list = [[0, 0], ...(stage as { [key: string]: any })[idol.value.type][idol_parameter_rank.toString()]]

                    for (let i = 0; i < stage_parameter_list.length - 1; i++) {
                        const [start_score, start_parameter] = stage_parameter_list[i]
                        const [end_score, end_parameter] = stage_parameter_list[i + 1]
                        if (score[key] >= start_score && score[key] < end_score) {
                            growth_rate = (end_parameter - start_parameter) / (end_score - start_score)
                            max_add_score = end_score - score[key]
                            break
                        }
                    }

                    if (growth_rate > max_growth_rate_parameter.value) {
                        max_growth_rate_parameter.name = key
                        max_growth_rate_parameter.value = growth_rate
                        max_growth_rate_parameter.max_add_score = max_add_score
                    }
                }

                const growth_rate_fans = {
                    value: 0,
                    max_add_score: 0,
                }
                const stage_fans_list = (stage as { [key: string]: any }).score_to_fans
                for (let i = 0; i < stage_fans_list.length - 1; i++) {
                    const [start_score, start_fans] = stage_fans_list[i]
                    const [end_score, end_fans] = stage_fans_list[i + 1]
                    if (dictionarySum(score) >= start_score && dictionarySum(score) < end_score) {
                        growth_rate_fans.value = (end_fans - start_fans) / (end_score - start_score)
                        growth_rate_fans.max_add_score = end_score - dictionarySum(score)
                        break
                    }
                }

                let max_add_score = 0
                if (max_growth_rate_parameter.value <= 0) {
                    max_add_score = growth_rate_fans.max_add_score
                    max_growth_rate_parameter.name = (() => {
                        for (const key of PARAMETER.NAMES) {
                            if (idol.value.specialty[key] === 1) return key
                        }
                        return ""
                    })()
                }
                else if (growth_rate_fans.value <= 0) {
                    max_add_score = max_growth_rate_parameter.max_add_score
                }
                else {
                    max_add_score = Math.min(max_growth_rate_parameter.max_add_score, growth_rate_fans.max_add_score)
                }

                const calculate_score = (scores: { [key: string]: number }) => {
                    const parameter = calculate_parameter(scores)
                    let score = 0
                    if (parameter === null) return score
                    for (const key in parameter) {
                        if (parameters.value[key] === null) return score
                        parameter[key] += parameters.value[key]

                        if (key !== "fans" && key !== "star") {
                            parameter[key] = Math.min(parameter[key], difficulty.max_parameter ?? 0)
                        } else if (key === "star") {
                            parameter[key] = Math.min(parameter[key], difficulty.enhanced_month.max_star ?? 0)
                        }
                    }

                    score = floor((parameter.vocal + parameter.dance + parameter.visual) * 2.3)
                        + floor(piecewiseLinearInterpolation([[0, 0], ...(difficulty.fans_to_final_score as [])], parameter.fans))

                    if (is_enhanced_week.value) {
                        score = floor(score * 0.7) + floor(parameter.star * difficulty.enhanced_month.star_to_final_score_multiplier)
                    }

                    return score
                }
                const value: { [key: string]: number } = { ...score }
                value[max_growth_rate_parameter.name] += max_add_score
                const max_score = calculate_score(value)

                if (max_add_score <= 0) return null

                const calculate_final_score = (score: { [key: string]: number }, max_add_score: number) => {
                    // 二分法
                    const raw_score = calculate_score(score)
                    if (raw_score >= rank_data[rank]) {
                        return { ...score }
                    }

                    const value: { [key: string]: number } = { ...score }
                    const add_score = floor(max_add_score / 2)
                    value[max_growth_rate_parameter.name] += add_score
                    const value_score = calculate_score(value)

                    if (add_score === 0) {
                        const value: { [key: string]: number } = { ...score }
                        value[max_growth_rate_parameter.name] += 1
                        return value
                    }
                    if (value_score >= rank_data[rank]) {
                        return calculate_final_score(score, add_score)
                    }
                    else {
                        return calculate_final_score(value, max_add_score - add_score)
                    }
                    // 注释部分为相等时直接返回结果，不是最小值，但是计算次数少
                    // if (value_score > rank_data[rank]) {
                    //     return calculate_final_score(score, add_score)
                    // }
                    // else if (value_score < rank_data[rank]) {
                    //     return calculate_final_score(value, max_add_score - add_score)
                    // }
                    // else {
                    //     return value
                    // }
                }

                if (max_score >= rank_data[rank]) {
                    // const raw_score = calculate_score(score)
                    // if (rank_data[rank] <= raw_score) {
                    //     return { ...score }
                    // }
                    // const growth_rate = (max_score - raw_score) / max_add_score
                    // const add_score = (rank_data[rank] - raw_score) / growth_rate
                    // console.log(growth_rate, max_score, raw_score, max_add_score, add_score, rank_data[rank], "run_func1")
                    // const value: { [key: string]: number } = { ...score }
                    // value[max_growth_rate_parameter.name] += floor(add_score)
                    // return value
                    return calculate_final_score(score, max_add_score)
                }
                else {
                    return run_func(value)
                }
            }
            const score = run_func({
                vocal: 0,
                dance: 0,
                visual: 0,
            })

            if (score === null) {
                continue
            }

            const parameter = calculate_parameter(score)
            if (parameter === null) {
                return []
            }
            const value = {
                rank,
                ...score,
                total_score: dictionarySum(score),
                total_parameter: parameter["vocal"] + parameter["dance"] + parameter["visual"],
                stage: stage.name,
            }
            if (!rank_value) {
                rank_value = value
            }
            else {
                if (priority_select.value === 1) {
                    if (value.total_score < rank_value.total_score) {
                        rank_value = value
                    }
                }
                else if (priority_select.value === 2) {
                    if (value.total_parameter > rank_value.total_parameter) {
                        rank_value = value
                    }
                }
            }
        }
        if (rank_value) {
            if (value.length > 0 && value[value.length - 1].total_score === 0 && rank_value.total_score === 0) {
                value.pop()
            }
            value.push(rank_value)
        }
    }
    value.reverse()
    return value
})

// const average_score_multiplier_options = ref(average_score_multiplier_data)
// const average_score_multiplier_select = ref()
// const average_score_multiplier = ref(0)
// watch(average_score_multiplier_select, (new_value) => {
//     const value = average_score_multiplier_options.value.find(item => item.id === new_value)
//     if (value) {
//         average_score_multiplier.value = value.average_score_multiplier
//     }
// })

// const is_average_score_multiplier_option = ref(false)
// watch(is_average_score_multiplier_option, () => {
//     const value = average_score_multiplier_options.value.find(item => item.id === average_score_multiplier_select.value)
//     if (value) {
//         average_score_multiplier.value = value.average_score_multiplier
//     }
// })

function selectRow(data: { [key: string]: any }) {
    for (const key of PARAMETER.NAMES) {
        scores.value[key] = data[key]
    }
    const stage_id = stage_options.value.find(item => item.name === data.stage)?.id
    stage_select.value = stage_id ? stage_id : stage_options.value[stage_options.value.length - 1].id
}

const base_increase_parameters = computed(() => {
    const value: { [key: string]: number } = { fans: 0, star: -1 }
    let total_score = 0
    for (const key of PARAMETER.NAMES) {
        if (scores.value[key] === null || !idol.value) {
            value[key] = -1
            total_score = -1
        }
        else {
            value[key] = floor(piecewiseLinearInterpolation(
                [[0, 0], ...(stage.value as { [key: string]: any })[idol.value.type][idol.value.specialty[key].toString()]],
                scores.value[key]
            ))
            total_score = total_score === -1 ? -1 : (total_score + scores.value[key])
        }
    }
    value.fans = total_score === -1 ? -1 : floor(piecewiseLinearInterpolation(
        (stage.value as { [key: string]: any }).score_to_fans,
        total_score
    ))

    if (is_enhanced_week.value && audition.value) {
        value.star = total_score === -1 ? -1 : floor(piecewiseLinearInterpolation(
            [[0, 0], ...audition.value?.score_to_star],
            total_score
        ))
    }

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
            value[key] = floor(base_increase_parameters.value[key] * parameter_bonus.value[key] / 100)
        }
    }
    return value
})

const initial_item_bonu_increase_parameters = computed(() => {
    const value: { [key: string]: number } = {}
    for (const key of PARAMETER.NAMES) {
        if (base_increase_parameters.value[key] === -1 || initial_item_bonus.value === null) {
            value[key] = -1
        } else {
            value[key] = floor(base_increase_parameters.value[key] * initial_item_bonus.value / 100)
        }
    }
    return value
})

const increase_parameters = computed(() => {
    const value: { [key: string]: number } = { fans: base_increase_parameters.value.fans, star: base_increase_parameters.value.star }
    for (const key of PARAMETER.NAMES) {
        if (parameter_bonus.value[key] === null || initial_item_bonus.value === null || scores.value[key] === null) {
            value[key] = -1
        } else {
            value[key] = base_increase_parameters.value[key]
                + floor(base_increase_parameters.value[key] * parameter_bonus.value[key] / 100)
                + floor(base_increase_parameters.value[key] * initial_item_bonus.value / 100)
        }
    }
    return value
})

const final_parameters = computed(() => {
    const value: { [key: string]: number } = {}
    for (const key of [...PARAMETER.NAMES, 'fans', 'star']) {
        if (parameters.value[key] === null || increase_parameters.value[key] === -1) {
            value[key] = -1
        }
        else {
            value[key] = parameters.value[key] + increase_parameters.value[key]
            if (key !== 'fans' && key !== 'star') {
                value[key] = Math.min(value[key], difficulty.max_parameter ?? 0)
            } else if (key === 'star') {
                value[key] = Math.min(value[key], difficulty.enhanced_month.max_star ?? 0)
            }
        }
    }
    return value
})

const final_score = computed(() => {
    let score = 0
    for (const key of [...PARAMETER.NAMES, 'fans']) {
        if (final_parameters.value[key] === -1) {
            return -1
        }
    }

    score = floor((final_parameters.value.vocal + final_parameters.value.dance + final_parameters.value.visual) * 2.3)
        + floor(piecewiseLinearInterpolation([[0, 0], ...(difficulty.fans_to_final_score as [])], final_parameters.value.fans))

    if (is_enhanced_week.value) {
        if (final_parameters.value.star === -1) {
            return -1
        }
        score = floor(score * 0.7) + floor(final_parameters.value.star * difficulty.enhanced_month.star_to_final_score_multiplier)
    }

    return score
})
</script>