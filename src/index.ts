import { ServiceError, credentials } from "@grpc/grpc-js";
import { VectorServiceClient, FitRequest, TransformRequest, VectorResponse, FloatArray, Empty } from "./vector_grpc/protos/vector_services";
import dotenv from "dotenv"
import { Store } from "./store";
import fs from "fs"
import path from "path"
import { MarkdownTextSplitter } from "langchain/text_splitter"
import { Document } from "langchain/document";
import minimist = require("minimist");

dotenv.configDotenv()
const argv = minimist(process.argv.slice(2))

function toProtobufArray(arr: number[][]): FloatArray[] {
    return arr.map(v => ({ values: v }))
}

function fromProtobufArray(arr: FloatArray[]): number[][] {
    return arr.map(v => v.values)
}

class AsyncClient {
    client: VectorServiceClient
    constructor(){
        this.client = new VectorServiceClient(
            `localhost:${process.env.VECTOR_SERVICE_PORT}`,
            credentials.createInsecure()
        )
    }

    async asyncFit(fitRequest: FitRequest) {
        return new Promise((resolve, reject) => {
            this.client.fit(fitRequest, (err: ServiceError | null) => {
                if(err){
                    reject(err)
                }else{
                    resolve("👍")
                }
            })
        })
    }
    
    async asyncTransform(transformRequest: TransformRequest): Promise<VectorResponse> {
        return new Promise((resolve, reject) => {
            this.client.transform(transformRequest, (err: ServiceError | null, resp: VectorResponse) => {
                if(err){
                    reject(err)
                }else{
                    resolve(resp)
                }
            })
        })
    }

    async asyncLoad(){
        const nothing: Empty = {}
        return new Promise((resolve, reject) => {
            this.client.load(nothing, (err: ServiceError | null) => {
                if(err){
                    reject(err)
                }else{
                    resolve("👍")
                }
            })
        })
    }
}

async function loadTestData(loadFiles?: string[]) {
    const docFilenames = fs.readdirSync(path.join("documents"))
    const splitter = new MarkdownTextSplitter({
        chunkSize: 1024,
        chunkOverlap: 256
    })
    const docsPromise = docFilenames.map(async (filename) => {
        const fullPath = path.join("documents", filename)
        const docText = fs.readFileSync(fullPath, "utf-8")
        const split = await splitter.splitText(docText)
        const metadata = split.map(() => {
            return {
                filename,
                fullPath
            }
        })
        return splitter.createDocuments(split, metadata)
    })

    return Promise.all(docsPromise).then(docs => {
        if (loadFiles) {
            return docs.filter(doc => {
                return loadFiles.includes(doc[0].metadata.filename)
            }).flat()
        } else {
            return docs.flat()
        }
    })
}

function findMinMax (vectors: number[][]) {
    return vectors.reduce((acc, v) => {
        if(acc[0][0] > v[0]){
            acc[0][0] = v[0]
        }
        if(acc[0][1] < v[0]){
            acc[0][1] = v[0]
        }

        if(acc[1][0] > v[1]){
            acc[1][0] = v[1]
        }
        if(acc[1][1] < v[1]){
            acc[1][1] = v[1]
        }

        if(acc[2][0] > v[2]){
            acc[2][0] = v[2]
        }
        if(acc[2][1] < v[2]){
            acc[2][1] = v[2]
        }
        return acc
    },
    [
        [Infinity, -Infinity],
        [Infinity, -Infinity],
        [Infinity, -Infinity],
    ])
}

async function start() {
    const docs = await loadTestData([
        "auth.md", 
        "benchmarking.md", 
        "cancellation.md",
        "compression.md",
        "custom-backend-metrics.md",
        "custom-load-balancing.md",
        "custom-name-resolution.md",
        "deadlines.md",
        "error.md",
        "keepalive.md"
    ])
    const store = new Store()
    const client = new AsyncClient()

    if(argv.load){
        await Promise.all([
            store.initialize(true),
            client.asyncLoad()
        ])
    }else{
        await store.initialize(false)
        const embeddings = await store.vs!.embeddings.embedDocuments(docs.map(v => v.pageContent))
        const protobufEmbeddings = toProtobufArray(embeddings)
    
        const fitRequest: FitRequest = {
            vectors: protobufEmbeddings
        }
        await client.asyncFit(fitRequest)
        const transformed = await client.asyncTransform({
            modelName: "umap",
            vectors: protobufEmbeddings
        })

        const transformedVectors = fromProtobufArray(transformed.vectors)
        for(let i = 0; i < docs.length; i++){
            docs[i].metadata.transformed = transformedVectors[i]
        }

        await store.vectorsInsert(embeddings, docs, true)
    }
    const vectors = store.getVectors()
    const storeDocs = Array.from(store.vs!.docstore._docs.values())

    const [ pca, pcaUmap, umap, kernel ] = await Promise.all([
        client.asyncTransform({
            modelName: "pca",
            vectors: toProtobufArray(vectors)
        }),
        client.asyncTransform({
            modelName: "pca_umap",
            vectors: toProtobufArray(vectors)
        }),
        client.asyncTransform({
            modelName: "umap",
            vectors: toProtobufArray(vectors)
        }),
        client.asyncTransform({
            modelName: "kernel",
            vectors: toProtobufArray(vectors)
        })
    ])

    const minMax = {
        pca: findMinMax(fromProtobufArray(pca.vectors)),
        pca_umap: findMinMax(fromProtobufArray(pcaUmap.vectors)),
        umap: findMinMax(fromProtobufArray(umap.vectors)),
        kernel: findMinMax(fromProtobufArray(kernel.vectors)),
    }

    const normalize = (val: number, min: number, max: number) => 2 * (val - min) / (max - min) - 1

    const formattedDocs = storeDocs.map(v => ({ content: v.pageContent, filename: v.metadata.filename }))
    const stuff = {
        pca: fromProtobufArray(pca.vectors).map((vector, idx) => {
            return {
                vector,
                normalized_vector: [
                    normalize(vector[0], minMax.pca[0][0], minMax.pca[0][1]),
                    normalize(vector[1], minMax.pca[1][0], minMax.pca[1][1]),
                    normalize(vector[2], minMax.pca[2][0], minMax.pca[2][1])
                ],
                ...formattedDocs[idx]
            }
        }),
        pca_umap: fromProtobufArray(pcaUmap.vectors).map((vector, idx) => {
            return {
                vector,
                normalized_vector: [
                    normalize(vector[0], minMax.pca_umap[0][0], minMax.pca_umap[0][1]),
                    normalize(vector[1], minMax.pca_umap[1][0], minMax.pca_umap[1][1]),
                    normalize(vector[2], minMax.pca_umap[2][0], minMax.pca_umap[2][1])
                ],
                ...formattedDocs[idx]
            }
        }),
        umap: fromProtobufArray(umap.vectors).map((vector, idx) => {
            return {
                vector,
                normalized_vector: [
                    normalize(vector[0], minMax.umap[0][0], minMax.umap[0][1]),
                    normalize(vector[1], minMax.umap[1][0], minMax.umap[1][1]),
                    normalize(vector[2], minMax.umap[2][0], minMax.umap[2][1])
                ],
                ...formattedDocs[idx]
            }
        }),
        kernel: fromProtobufArray(kernel.vectors).map((vector, idx) => {
            return {
                vector,
                normalized_vector: [
                    normalize(vector[0], minMax.kernel[0][0], minMax.kernel[0][1]),
                    normalize(vector[1], minMax.kernel[1][0], minMax.kernel[1][1]),
                    normalize(vector[2], minMax.kernel[2][0], minMax.kernel[2][1])
                ],
                ...formattedDocs[idx]
            }
        })
    }

    fs.writeFileSync(path.resolve(path.join("db", "reduced_dimensions.json")), JSON.stringify(stuff, null, 2), "utf-8")
}

start().then(() => {
    process.exit(0)
})