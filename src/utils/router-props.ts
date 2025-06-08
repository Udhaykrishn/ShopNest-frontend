export const validateSearch = (search) => {
    return {
        page: search.page || 1,
        limit: search.limit || 10,
        search: search.search || ""

    }
}

type Search = {
    page: object,
    limit: object,
    search: object
}

export const loaderDeps = ({ search: { limit, page, search } }: { search: Search }) => {
    return { page, limit, search }
}