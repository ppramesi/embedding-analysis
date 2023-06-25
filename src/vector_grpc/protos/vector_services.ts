/* eslint-disable */
import {
  CallOptions,
  ChannelCredentials,
  Client,
  ClientOptions,
  ClientUnaryCall,
  handleUnaryCall,
  makeGenericClientConstructor,
  Metadata,
  ServiceError,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "vector_analysis";

export interface FitRequest {
  vectors: FloatArray[];
}

export interface TransformRequest {
  modelName: string;
  vectors: FloatArray[];
}

/** The response message containing the server's vector. */
export interface VectorResponse {
  vectors: FloatArray[];
}

export interface Empty {
}

export interface FloatArray {
  values: number[];
}

function createBaseFitRequest(): FitRequest {
  return { vectors: [] };
}

export const FitRequest = {
  encode(message: FitRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.vectors) {
      FloatArray.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FitRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFitRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.vectors.push(FloatArray.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FitRequest {
    return { vectors: Array.isArray(object?.vectors) ? object.vectors.map((e: any) => FloatArray.fromJSON(e)) : [] };
  },

  toJSON(message: FitRequest): unknown {
    const obj: any = {};
    if (message.vectors) {
      obj.vectors = message.vectors.map((e) => e ? FloatArray.toJSON(e) : undefined);
    } else {
      obj.vectors = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FitRequest>, I>>(base?: I): FitRequest {
    return FitRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<FitRequest>, I>>(object: I): FitRequest {
    const message = createBaseFitRequest();
    message.vectors = object.vectors?.map((e) => FloatArray.fromPartial(e)) || [];
    return message;
  },
};

function createBaseTransformRequest(): TransformRequest {
  return { modelName: "", vectors: [] };
}

export const TransformRequest = {
  encode(message: TransformRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.modelName !== "") {
      writer.uint32(10).string(message.modelName);
    }
    for (const v of message.vectors) {
      FloatArray.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransformRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransformRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.modelName = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.vectors.push(FloatArray.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TransformRequest {
    return {
      modelName: isSet(object.modelName) ? String(object.modelName) : "",
      vectors: Array.isArray(object?.vectors) ? object.vectors.map((e: any) => FloatArray.fromJSON(e)) : [],
    };
  },

  toJSON(message: TransformRequest): unknown {
    const obj: any = {};
    message.modelName !== undefined && (obj.modelName = message.modelName);
    if (message.vectors) {
      obj.vectors = message.vectors.map((e) => e ? FloatArray.toJSON(e) : undefined);
    } else {
      obj.vectors = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TransformRequest>, I>>(base?: I): TransformRequest {
    return TransformRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TransformRequest>, I>>(object: I): TransformRequest {
    const message = createBaseTransformRequest();
    message.modelName = object.modelName ?? "";
    message.vectors = object.vectors?.map((e) => FloatArray.fromPartial(e)) || [];
    return message;
  },
};

function createBaseVectorResponse(): VectorResponse {
  return { vectors: [] };
}

export const VectorResponse = {
  encode(message: VectorResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.vectors) {
      FloatArray.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VectorResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVectorResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.vectors.push(FloatArray.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): VectorResponse {
    return { vectors: Array.isArray(object?.vectors) ? object.vectors.map((e: any) => FloatArray.fromJSON(e)) : [] };
  },

  toJSON(message: VectorResponse): unknown {
    const obj: any = {};
    if (message.vectors) {
      obj.vectors = message.vectors.map((e) => e ? FloatArray.toJSON(e) : undefined);
    } else {
      obj.vectors = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<VectorResponse>, I>>(base?: I): VectorResponse {
    return VectorResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<VectorResponse>, I>>(object: I): VectorResponse {
    const message = createBaseVectorResponse();
    message.vectors = object.vectors?.map((e) => FloatArray.fromPartial(e)) || [];
    return message;
  },
};

function createBaseEmpty(): Empty {
  return {};
}

export const Empty = {
  encode(_: Empty, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Empty {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEmpty();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): Empty {
    return {};
  },

  toJSON(_: Empty): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<Empty>, I>>(base?: I): Empty {
    return Empty.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Empty>, I>>(_: I): Empty {
    const message = createBaseEmpty();
    return message;
  },
};

function createBaseFloatArray(): FloatArray {
  return { values: [] };
}

export const FloatArray = {
  encode(message: FloatArray, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    writer.uint32(10).fork();
    for (const v of message.values) {
      writer.float(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FloatArray {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFloatArray();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag === 13) {
            message.values.push(reader.float());

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.values.push(reader.float());
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FloatArray {
    return { values: Array.isArray(object?.values) ? object.values.map((e: any) => Number(e)) : [] };
  },

  toJSON(message: FloatArray): unknown {
    const obj: any = {};
    if (message.values) {
      obj.values = message.values.map((e) => e);
    } else {
      obj.values = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FloatArray>, I>>(base?: I): FloatArray {
    return FloatArray.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<FloatArray>, I>>(object: I): FloatArray {
    const message = createBaseFloatArray();
    message.values = object.values?.map((e) => e) || [];
    return message;
  },
};

/** The service definition. */
export type VectorServiceService = typeof VectorServiceService;
export const VectorServiceService = {
  /** Sends a VectorRequest and gets a VectorResponse */
  fit: {
    path: "/vector_analysis.VectorService/Fit",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: FitRequest) => Buffer.from(FitRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => FitRequest.decode(value),
    responseSerialize: (value: Empty) => Buffer.from(Empty.encode(value).finish()),
    responseDeserialize: (value: Buffer) => Empty.decode(value),
  },
  transform: {
    path: "/vector_analysis.VectorService/Transform",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: TransformRequest) => Buffer.from(TransformRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => TransformRequest.decode(value),
    responseSerialize: (value: VectorResponse) => Buffer.from(VectorResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => VectorResponse.decode(value),
  },
  load: {
    path: "/vector_analysis.VectorService/Load",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: Empty) => Buffer.from(Empty.encode(value).finish()),
    requestDeserialize: (value: Buffer) => Empty.decode(value),
    responseSerialize: (value: Empty) => Buffer.from(Empty.encode(value).finish()),
    responseDeserialize: (value: Buffer) => Empty.decode(value),
  },
} as const;

export interface VectorServiceServer extends UntypedServiceImplementation {
  /** Sends a VectorRequest and gets a VectorResponse */
  fit: handleUnaryCall<FitRequest, Empty>;
  transform: handleUnaryCall<TransformRequest, VectorResponse>;
  load: handleUnaryCall<Empty, Empty>;
}

export interface VectorServiceClient extends Client {
  /** Sends a VectorRequest and gets a VectorResponse */
  fit(request: FitRequest, callback: (error: ServiceError | null, response: Empty) => void): ClientUnaryCall;
  fit(
    request: FitRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: Empty) => void,
  ): ClientUnaryCall;
  fit(
    request: FitRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: Empty) => void,
  ): ClientUnaryCall;
  transform(
    request: TransformRequest,
    callback: (error: ServiceError | null, response: VectorResponse) => void,
  ): ClientUnaryCall;
  transform(
    request: TransformRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: VectorResponse) => void,
  ): ClientUnaryCall;
  transform(
    request: TransformRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: VectorResponse) => void,
  ): ClientUnaryCall;
  load(request: Empty, callback: (error: ServiceError | null, response: Empty) => void): ClientUnaryCall;
  load(
    request: Empty,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: Empty) => void,
  ): ClientUnaryCall;
  load(
    request: Empty,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: Empty) => void,
  ): ClientUnaryCall;
}

export const VectorServiceClient = makeGenericClientConstructor(
  VectorServiceService,
  "vector_analysis.VectorService",
) as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): VectorServiceClient;
  service: typeof VectorServiceService;
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
