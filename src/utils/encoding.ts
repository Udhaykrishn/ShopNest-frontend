export const parseParams = (params) => ({
    id: atob(params.id)
})

export const stringifyParams = (params) => ({
    id: btoa(params.id)
})


