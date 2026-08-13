const pagination = (page = 1, limit = 10, maxLimit = 50) => {

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    const safePage = Number.isFinite(parsedPage)
        ? Math.max(Math.floor(parsedPage), 1)
        : 1;

    const safeLimit = Number.isFinite(parsedLimit)
        ? Math.min(Math.max(Math.floor(parsedLimit), 1), maxLimit)
        : 10;

    const skip = (safePage - 1) * safeLimit;

    return {
        page: safePage,
        limit: safeLimit,
        skip
    };
};

export default pagination;