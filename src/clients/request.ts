const BASE_URL = "https://chat.openai.com/backend-api";

export function request(token: string, method: string, path: string, data?: unknown) {
    return fetch(BASE_URL + path, {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: data === undefined ? undefined : JSON.stringify(data),
    })
}