// import { SandBox000 } from './games/sandbox000.js';
// import { SandBox001 } from './games/sandbox001.js';

const routes={
    "001":{
        "className":"SandBox001",
        "path":'/sandbox/games/sandbox001.js'
    }
}
try{
    let params = new URL(document.location).searchParams;
    const numSandbox=params.get("sb")
    const classe=routes[params.get("sb")]
    if(classe){
        import(classe.path).then((module) => {
            let sandbox = new module[classe.className]//routes[params.get("sb")]
            // let sandbox=new SandBox001();
            sandbox.start()
        })
    }
    
}catch(e){
    console.error ("Erreur de chargement de bac à sable",e)
    alert("L'application ne fonctionne pas sur mobile actuellement, désolé")
}
