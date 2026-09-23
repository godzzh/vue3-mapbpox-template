import dayjs from "dayjs"
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

//时间范围-快捷选择
export const dateRangeShortcuts: Record<string, [number, number]> = {
    "今日": [
        dayjs().startOf('day').unix() * 1000,
        dayjs().endOf('day').unix() * 1000
    ],
    "近三日": [
        dayjs().subtract(2, "day").startOf('day').unix() * 1000,
        dayjs().endOf('day').unix() * 1000
    ],
    "近七日": [
        dayjs().subtract(6, "day").startOf('day').unix() * 1000,
        dayjs().endOf('day').unix() * 1000,
    ],
    "近一月": [
        dayjs().subtract(1, "month").startOf('day').unix() * 1000,
        dayjs().endOf('day').unix() * 1000,
    ]
}

// 普通单行文本不允许输入首尾空格；密码、正文等保留原始内容的字段不要使用。
export const noSideSpace = (value: string) => {
    return !/^\s|\s$/.test(value)
}

//只能输入数字
export const onlyAllowNumber = (value: string) => {
    return !value || /^\d+$/.test(value)
}
