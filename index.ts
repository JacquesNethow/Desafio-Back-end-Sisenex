import express,{Request, Response} from 'express';// importa a dependencia express
var fs = require('fs');// Declara fs para poder ler arquivos

export interface Dado{
    id:               number;
    descricaoTipo:    string;
    ementa:           string;
    dataApresentacao: string;
    autores:          Autore[];
}
export interface Autore {
    nomeAutor:         string;
    idAutor:           number;
    siglaPartidoAutor: string;
}

const app = express(); //Definindo app para usar os metodos do express
const routes = express.Router();// Definindo routes para a funçao express.Router
const json = express.json();// Definindo json para usar a funçao express.json

app.use(json);// Usando app e a funçao json
app.use(routes);//Usando app e a funçao routes

const listar=() => {
    const info = fs.readFileSync('./dados.json',"utf-8");
    return info;
}// Criar a funçao listar para ler os dados no arquivo dados.json

routes.get('/listardado',(req: Request,res: Response) =>{
    res.send(JSON.parse(listar()));
})//Criando a rota /listardado e listando nele os conteudo do dados.json


routes.get('/listadetipos/:tipo', async(req: Request, res: Response) =>{
    const listartipo = JSON.parse(listar());//ler o dados.json
    const tipo = req.params.tipo;// Recebe o parametro pela rota
    const tiposprojeto = await listartipo.dados.filter((dados: Dado) => dados.descricaoTipo === tipo );// Compara e retorna do mesmo tipo
    res.send(tiposprojeto);

})//Criando a rota /listardado/:tipo para listar apenas pelo tipo inserido

routes.get('/listadeautor/:autor',(req: Request, res: Response) =>{
    const ListarAutor = JSON.parse(listar());
    const Autor = req.params.autor;
    
    var AutoresSelecionados: Dado[] = [];//Criar AutoresSelecionados como um array para armazenar os dados

    ListarAutor.dados.map((dados: Dado) => {dados.autores.forEach((autores: Autore) =>{
            if(autores.nomeAutor === Autor){
                AutoresSelecionados.push(dados);
            }
        })
    })
    res.send(AutoresSelecionados); 
})

app.listen(3333,() => {console.log("Servido esta na porta 3333")});//Abrindo o server