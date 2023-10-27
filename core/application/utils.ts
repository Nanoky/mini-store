import { Response } from "./ports";

export function handleQuery<TResponseData>(query: Promise<Response<TResponseData>>) {
    return query
        .then((res) => {
            if (res.isSuccess) {
                return res;
            } else {
                throw new Error(res.message);
            }
        })
        .catch((err) => {
            throw new Error(err);
        });
}
