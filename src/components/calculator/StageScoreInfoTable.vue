<template>
    <Panel class="mb-2" header="舞台得分信息" toggleable collapsed>
        <template #header>
            <div class="flex flex-row items-center">
                <p>舞台得分信息</p>
                <IconTooltip class="ml-2">
                    <p>试镜结束后属性与粉丝数的增加是分段线性增加。<br>
                        其中随着得分增加，属性和粉丝数的增量逐渐减小。<br>
                        表中列出了所选试镜达到对应得分时所获取的属性/粉丝数。其中：<br>
                        属性的对应得分：对应属性的得分。<br>
                        粉丝数的对应得分：总分<br>
                        ※ 通常来说，有属性或者总分达不到第1次衰减的得分时，建议打低一级试镜。
                    </p>
                </IconTooltip>
            </div>
        </template>
        <DataTable :value="stage_score_info" size="small" stripedRows rowGroupMode="rowspan" groupRowsBy="name">
            <Column class="!text-center" field="name" />
            <Column class="!text-center" field="sub_name" />
            <Column v-for="key of PARAMETER.NAMES" class="!text-center" :field="key">
                <template #header>
                    <p class="w-full text-center font-bold">{{ key }}</p>
                </template>
            </Column>
            <Column class="!text-center" field="fans">
                <template #header>
                    <p class="w-full text-center font-bold">粉丝数</p>
                </template>
            </Column>
        </DataTable>
    </Panel>
</template>

<script setup lang="ts">
import { PARAMETER } from '@/constants/parameter'
import { ref, watchEffect } from 'vue'
import IconTooltip from '../IconTooltip.vue'
import { floor } from '@/utils/math'

const { idol, stage, fans_multiple } = defineProps({
    idol: {
        type: [Object],
    },
    stage: {
        type: Object,
        required: true
    },
    fans_multiple: {
        type: Number,
        default: 1
    }
})

const stage_score_info = ref()
watchEffect(() => {
    const value: { [key: string]: any }[] = []
    if (!idol) {
        stage_score_info.value = value
        return
    }

    const collation_value: { [key: string]: any } = {}
    for (const key of PARAMETER.NAMES) {
        collation_value[key] = [...(stage as { [key: string]: any })[idol.type][idol.specialty[key].toString()]]
        if (collation_value[key].length > 0 && collation_value[key][0][0] !== 0) {
            collation_value[key] = [[0, 0], ...collation_value[key]]
        }
    }
    // collation_value.fans = [...(stage as { [key: string]: any }).score_to_fans]
    // for (const value of collation_value.fans) {
    //     value[1] *= fans_multiple
    // }
    collation_value.fans = (() => {
        const result = []
        for (const [score, fans] of (stage as { [key: string]: any }).score_to_fans) {
            result.push([score, floor(fans * fans_multiple)])
        }
        return result
    })()

    if (collation_value.fans.length > 0 && collation_value.fans[0][0] !== 0) {
        collation_value.fans = [[0, 0], ...collation_value.fans]
    }
    let max_line = 0
    for (const key in collation_value) {
        max_line = Math.max(max_line, collation_value[key].length)
    }
    const max_collation_value: { [key: string]: any } = {
        ...(() => {
            const result: { [key: string]: any } = {}
            for (const key in collation_value) {
                if (collation_value[key].length === 0) {
                    result[key] = ["", ""]
                }
                result[key] = collation_value[key].pop()
            }
            return result
        })()
    }

    for (let i = 0; i < max_line; i++) {
        let name = `第${i}衰减节点`
        let get_data = (key: string) => {
            if (collation_value[key].length <= i) {
                return ["", ""]
            }
            return collation_value[key][i]
        }
        if (max_line === 3 && i === 1) {
            name = "衰减节点"
        }
        else if (i === 0) {
            value.push({
                name: "初始值",
                sub_name: "",
                ...(() => {
                    const result: { [key: string]: any } = {}
                    for (const key in collation_value) {
                        result[key] = get_data(key)[1] === "" ? "" : `+${floor(get_data(key)[1])}`
                    }
                    return result
                })()
            })
            continue
        }
        else if (i === max_line - 1) {
            name = "最大值"
            get_data = (key: string) => {
                return max_collation_value[key]
            }
        }

        value.push({
            name,
            sub_name: "对应得分",
            ...(() => {
                const result: { [key: string]: any } = {}
                for (const key in collation_value) {
                    result[key] = get_data(key)[0] === "" ? "" : `${floor(get_data(key)[0])}`
                }
                return result
            })()
        })
        value.push({
            name,
            sub_name: "对应增幅",
            ...(() => {
                const result: { [key: string]: any } = {}
                for (const key in collation_value) {
                    result[key] = get_data(key)[1] === "" ? "" : `+${floor(get_data(key)[1])}`
                }
                return result
            })()
        })
    }
    stage_score_info.value = value
})
</script>