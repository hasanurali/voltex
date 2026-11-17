const filterDirtyInputs = <T extends object, U extends Partial<T>>(savedData: T, currentInputData: U): Partial<U> => {

    const saved = savedData as Record<string, unknown>;

    const filteredInputs = Object.entries(currentInputData).filter(([key, val]) => {
        return (saved[key] ?? '') !== val;
    });

    return Object.fromEntries(filteredInputs) as Partial<U>;
};

export default filterDirtyInputs;