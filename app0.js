// import { configDotenv } from 'dotenv';
import express from 'express';
import {join} from 'node:path'
import {Admin} from './src/admin/admin.js'
import { listSandboxes, loadSandbox } from './src/actions/sandboxes.js';
// import { RecordNotFoundError } from './src/errors/record_not_found.js';
import { errorHandler } from './src/errors/error.js';
// configDotenv()

const publicPath= join(Admin.getDir(),"www")
//Local or not
// console.log(Admin.isMobile())

const hostname = Admin.isLocal()?'127.0.0.1':'';

const app = express();
app.set('view engine', 'ejs');
app.set('views', join(Admin.getDir(), 'templates'));

app.all("*", (req, res, next) => {
    const url=new URL(req.url, `http://${req.headers.host}`);
    console.log(req.method,url.pathname)
    next();
});

app.get('/bac-a-sable', loadSandbox)
app.use(express.static(publicPath));

app.get('/', listSandboxes);
// app.get("/sandbox.html",loadSandbox)

// app.use(errorHandler)

app.listen(process.env.PORT, () => {
  console.log(`Application à l'écoute sur le port ${process.env.PORT} - host ${hostname}!`);
});
