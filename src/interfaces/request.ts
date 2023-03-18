export type RequestParams = {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

export interface RequestParamsMessage {
  url: string;
  options?: RequestParams;
}

export interface RequestResponseMetadata {
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
}

export interface RequestResponseMetadataMessage {
  type: 'RESPONSE_METADATA';
  metadata: RequestResponseMetadata;
}

export type RequestResponseBodyChunkMessage = {
  type: 'RESPONSE_BODY_CHUNK';
} & ({ done: true } | { done: false; value: string });
