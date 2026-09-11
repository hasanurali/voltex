const filterDirtyInputs = <T extends Record<string, any>, U extends Partial<T>>(savedData: T, currentInputData: U): Partial<U> => {

    const filteredInputs = Object.entries(currentInputData).filter(([key, val]) => {
        return (savedData[key] ?? '') !== val;
    });

    return Object.fromEntries(filteredInputs) as Partial<U>;
};

export default filterDirtyInputs;