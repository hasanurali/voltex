const executeWithConfig = async (query, queryConfig = {}) => {

    if (queryConfig.select) {
        query = query.select(queryConfig.select);
    };

    if (queryConfig.populate) {
        query = query.populate(queryConfig.populate);
    };

    if (queryConfig.lean) {
        query = query.lean();
    };

    return await query;
};

export default executeWithConfig;