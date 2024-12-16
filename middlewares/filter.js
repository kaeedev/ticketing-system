export default function buildFilter(req, res, next) {
    const {status, priority, search} = req.query
    let filter = {}

    if(status) {
        filter.status = status //Si existe status, lo metemos en el filtro
    }

    if (priority) {
        filter.priority = priority //Si existe priority, lo metemos en el filtro
    }

    if (search) {
        filter.$or = [
            {title: { $regex: search, $options: "i"}},
            {description: { $regex: search, $options: "i"}}
        ]
    }

    req.filter = filter

    next()
}
