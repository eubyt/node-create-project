let objAssign = (_new, _old) => {
    Object.keys(_new).forEach((key) => {
        if (typeof _new[key] === "object" && !Array.isArray(_new[key])) {
            _old[key] = objAssign(_new[key], _old[key] ?? {});
        } else if (Array.isArray(_new[key]) && Array.isArray(_old[key])) {
            _old[key] = _new[key].concat(_old[key]);
        } else {
            _old[key] = _new[key];
        }
    });
    return _old;
};

export { objAssign };
