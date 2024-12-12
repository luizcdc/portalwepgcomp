
export const formatOptions = (options: any[], labelField: string) => {
    return options.map(v => {
        return {
            label: v[labelField],
            value: v.id
        }
    })
}