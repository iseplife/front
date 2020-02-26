import axios, {AxiosPromise} from "axios";

export const toggleThreadLike = (id: number): AxiosPromise<void> => {
    return axios.put(`/thread/${id}/like`);
};