function cloneValue(value, stack = []) {
    let type, result;
    // 基本数据类型
    type = typeof value;
    if(value === null || !(type === "object" || type === "function")) {
        return value;
    }
    
    // 避免循环引用
    const stacked = stack.find(item => item === value);
    if(stacked) return stacked;
    
    // 引用类型分类型拷贝
    type = Object.prototype.toString.call(value).slice(8, -1);
    switch(type) {
        case "Object":
            result = {};
            // 遍历键值
            const keys = [...Object.getOwnPropertyNames(value), ...Object.getOwnPropertySymbols(value)];
            keys.forEach(key => {
                const descriptor = Object.getOwnPropertyDescriptor(value, key);
                if(descriptor.get || descriptor.set) {
                    Object.defineProperty(result, key, {
                        configurable: descriptor.configurable,
                        enumerable: descriptor.enumerable,
                        get: cloneValue(descriptor.get, stack),
                        set: cloneValue(descriptor.set, stack)
                    })
                }else {
                    Object.defineProperty(result, key, {
                        configurable: descriptor.configurable,
                        enumerable: descriptor.enumerable,
                        writable: descriptor.writable,
                        value: cloneValue(descriptor.value)
                    })
                }
            });
            // 设置原型对象
            Object.setPrototypeOf(result, Object.getPrototypeOf(value));
            break;
        case "Function":
            result = (new Function(`return ${value.toString()}`))();
            break;
    }

    return result;
}