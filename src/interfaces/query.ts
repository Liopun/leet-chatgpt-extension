import { IResponse } from "./response"

export type QueryStatus = 'success' | 'error' | undefined

export interface IQuery {
    answer: IResponse
    error: string
    retries: number
    done: boolean
    tip: boolean
    status: QueryStatus
}

export interface IQueryEventRec {
    event: string
    data: IResponse
}

export interface IQueryEvent {
    event: string
    value: string
}