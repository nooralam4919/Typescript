const asyncHandler = (reqHandler: any) => {
    return async (req: any, res: any, next: any) => {
        Promise
            .resolve(reqHandler(req, res, next))
            .catch((error) => next(error));
    };
};

export { asyncHandler };