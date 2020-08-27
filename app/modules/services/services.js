import { apiKey } from "../config/config.js";

function getTrending() {
    const data = fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=25&rating=G`)
        .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
        .then(res => res.json())
        .then(res => {
            const { data } = res;
            return data
        })
        .catch(rej => console.error(rej));
    return data
};

function search(search) {
    const data = fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${search}&limit=25&offset=0&rating=G&lang=en`)
        .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
        .then(res => res.json())
        .then(res => {
            const { data } = res;
            return data
        })
        .catch(rej => console.error(rej));
    return data
};

export { getTrending, search };