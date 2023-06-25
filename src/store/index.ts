// import DatabaseConstructor, { Database } from "better-sqlite3"
import { HNSWLib } from "langchain/vectorstores/hnswlib"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { SynchronousInMemoryDocstore } from "langchain/stores/doc/in_memory"
import { Document } from "langchain/document"
import { uuid } from 'uuidv4'
import omit from 'lodash/omit'
import path from "path"

// const sqlitePath = path.resolve(path.join("db", "store.sqlite"))
const dbPath = path.resolve("db")
console.log(dbPath)

export class Store {
    // db?: Database
    vs?: HNSWLib

    async initialize(load: boolean){
        // this.db = new DatabaseConstructor("./db/store.sqlite")
        if(load){
            this.vs = await HNSWLib.load(dbPath, new OpenAIEmbeddings())
        }else{
            // const createTable = this.db.prepare("CREATE TABLE IF NOT EXISTS documents (id TEXT PRIMARY KEY, page_content TEXT, metadata JSON, embeddings JSON)")
            // createTable.run()
            this.vs = new HNSWLib(new OpenAIEmbeddings(), {
                space: "cosine",
                docstore: new SynchronousInMemoryDocstore()
            })
        }
    }

    async similaritySearch(query: number[], k: number, filter?: Map<string, any>){
        if(!this.vs){// || !this.db){
            throw new Error("Not Initialized!!!")
        }
        let filterFunc: ((doc: Document) => boolean) | undefined;
        if(filter){
            filterFunc = (doc: Document) => {
                const keys = Array.from(filter.keys())
                return keys.reduce((acc: boolean, key: string) => {
                    return acc && doc.metadata[key] === filter.get(key)
                }, true)
            }
        }
        return this.vs.similaritySearchVectorWithScore(query, k, filterFunc)
    }

    async documentsInsert(documents: Document[], save: boolean = true){
        if(!this.vs){
            throw new Error("Not Initialized!!!")
        }

        const texts = documents.map(({ pageContent }) => pageContent);
        const vectors = await this.vs.embeddings.embedDocuments(texts)
        return this.vectorsInsert(vectors, documents, save)
    }

    async vectorsInsert(vectors: number[][], documents: Document[], save: boolean = true){
        if(!this.vs){// || !this.db){
            throw new Error("Not Initialized!!!")
        }

        const docsCopy = documents.map((document) => {
            if(!document.metadata?.id){
                const metadata = document.metadata
                metadata.id = uuid()
                return new Document({
                    pageContent: document.pageContent,
                    metadata
                })
            }

            return document
        })

        await this.vs.addVectors(vectors, docsCopy)
        if(save) {
            console.log("saving")
            await this.vs.save(dbPath)
        }

        const docsDb = docsCopy.map((doc, idx) => {
            return {
                id: doc.metadata.id,
                page_content: doc.pageContent,
                metadata: omit(doc.metadata, ["id"]), // JSON.stringify(omit(doc.metadata, ["id"])),
                embeddings: vectors[idx] // JSON.stringify(vectors[idx])
            }
        })

        return docsDb

        // const insert = this.db.prepare("INSERT INTO documents (id, page_content, metadata, embeddings) VALUES (@id, @page_content, @metadata, @embeddings)")
        // const insertMany = this.db.transaction((docs) => {
        //     for (const doc of docs) insert.run(doc) 
        // })

        // insertMany(docsDb)
    }

    getVectors(): number[][]{
        if(!this.vs){
            throw new Error("Not Initialized!!!")
        }
        const count = this.vs.index.getCurrentCount()
        const vectors = []
        for(let k = 0; k < count; k++){
            vectors.push(this.vs.index.getPoint(k))
        }

        return vectors
    }
}