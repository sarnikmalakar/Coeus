import path from 'path'
import fs from 'fs/promises'
import crypto from 'crypto'

class Coeus{
    constructor(repoPath = '.'){
        // This is when we will create an (.coeus) `folder` on typing (coeus init) `command` in the current directory 
        this.repoPath = path.join(repoPath, '.coeus')
        // .coeus/objects
        this.objectsPath = path.join(this.repoPath, 'objects')
        // .coeus/HEAD
        this.headPath = path.join(this.repoPath, 'HEAD')
        // .coeus/index
        this.indexPath = path.join(this.repoPath, 'index')
        // This is used to initialize the .coeus folder
        this.init()
    }

    async init(){
        await fs.mkdir(this.objectsPath, {recursive: true})
        try{
            // The purpose of wx is that it is open for writing, but fails if file already exist
            await fs.writeFile(this.headPath, '', {flag: 'wx'})  // This creates HEAD file
            await fs.writeFile(this.indexPath, JSON.stringify([]), {flag: 'wx'}); // This creates index file
        }catch(error){
            // We handel the error here if file already exist
            console.log("Already initialised the .coeus folder")
        }
    }

    hashObject(content){
        // Git actually uses SHA-1 hash which generates a 40 character hexadecimal string for any input
        return crypto.createHash('sha1').update(content, 'utf-8').digest('hex')
    }

    async add(fileToBeAdded){
        const fileData = await fs.readFile(fileToBeAdded, {encoding: 'utf-8'})
        const fileHash = this.hashObject(fileData)
        //console.log(fileHash) can be used for verification
        const newFileHashedObjectPath = path.join(this.objectsPath, fileHash)
        await fs.writeFile(newFileHashedObjectPath, fileData)
    }


}

const coeus = new Coeus();