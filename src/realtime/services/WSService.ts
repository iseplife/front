const instanceByClass = new Map<{ new(): any }, any>()
function getWSService<T>(clazz: { new(): T }): T {
    let instance = instanceByClass.get(clazz)
    if (!instance)
        instanceByClass.set(clazz, instance = new clazz())
    return instance
}

export { getWSService }