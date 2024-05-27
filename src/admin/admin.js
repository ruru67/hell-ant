import {createConnection} from 'mysql'
import { configDotenv } from 'dotenv';
import {fileURLToPath} from 'node:url'
import {dirname} from 'node:path'
configDotenv()
const DB_DISTANT=true
export class Admin{
    static url
    static dir
    static getDir(){
        if(!this.url){
            this.url=fileURLToPath(import.meta.url)
            this.dir=dirname(dirname(dirname(this.url)))
        }
        return this.dir
    }
    static isLocal(){
        // console.log(this.getDir(),process.env.YOUR_LOCAL_DIR,this.getDir()===process.env.YOUR_LOCAL_DIR)
        return this.getDir()===process.env.YOUR_LOCAL_DIR
    }

    static gedDb(){
        if(!this.db){
            this.connectDB()
        }
        return this.db
    }

    static connectDB(){
        let options={ 
            host: process.env.LOCAL_HOST,
            user: process.env.LOCAL_USER,
            password: process.env.LOCAL_PASSWORD,
            database: process.env.LOCAL_DATABASE
        }
        try{
            if(DB_DISTANT){
                options={ 
                    host: process.env.DISTANT_HOST,
                    user: process.env.DISTANT_USER,
                    password: process.env.DISTANT_PASSWORD,
                    database: process.env.DISTANT_DATABASE
                }
            }
            this.db = createConnection(options);
            this.db.connect((err) => {
                if (err) {
                    console.warn('erreur connexion a db!',err)}
                else
                    console.log('Connected!');
            });
        }
        catch(e){
            console.log(e)
        }
    }
    static isMobile(){
        return [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i
        ].some((toMatchItem) => {
            return windows.navigator.userAgent.match(toMatchItem);
        });
    }
}