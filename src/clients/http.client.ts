export class HttpClient {
    async get<T>(url: string, options?:RequestInit): Promise<T>{
        try {
            const response = await fetch(url, {
                method: 'GET',
                ...options
            })
    
            if(!response.ok){
                const errorBody = await response.text();
                throw new Error(`GET ${url} -> ${response.status}: ${errorBody}`)
            }
    
            return response.json() as Promise<T>
        } catch (error) {
            throw new Error(`GET Unexcepted error ${error}`)
        }
    }

    async post<T>(url: string, body: unknown, options?: RequestInit){
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    ...(options?.headers || {})
                },
                body: JSON.stringify(body),
                ...options
            })
    
            if(!response.ok){
                const errorBody = await response.text();
                throw new Error(`POST ${url} -> ${response.status}: ${errorBody}`)
            }
    
            return response.json() as Promise<T>
        } catch (error) {
            throw new Error(`POST Unexcepted error ${error}`)
        }
    }
}