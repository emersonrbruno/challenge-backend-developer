var result = [];
var espc;
var fs = require("fs");

var contents = fs.readFileSync("books.json");

var jsonContent = JSON.parse(contents);

function comparerAsc(a, b) {
    if (a.price < b.price)
        return -1;

    if (a.price > b.price)
        return 1;

    return 0;
}

function comparerDesc(a, b) {
    if (a.price < b.price)
        return 1;

    if (a.price > b.price)
        return -1;

    return 0;
}

function listarBooks(filtro) {
    var indice = 0;

    for(var i = 0; i < jsonContent.length;i++){
        if(jsonContent[i].name.indexOf(filtro) >= 0){
            result[indice] = jsonContent[i];
            indice++;
        }
    }
    if(result.length > 0){
        for(var i = 0; i < result.length;i++){
            console.log("Nome:", result[i].name, " Price:",result[i].price);
        }
    } else {
        console.log("Nenhum resultado encontrado");
    }
}

//jsonContent.sort(comparerAsc);
function ordenar(tipo) {
    if(tipo == 1){
        result.sort(comparerAsc);
    } else {
        result.sort(comparerDesc);
    }
    for(var i = 0; i < result.length;i++){
        console.log("Nome:", result[i].name, " Price:",result[i].price);
    }
}

function pesquisa(){
    console.log("Por favor informar palavra chave para pesquisar os produtos?");
    var stdin = process.openStdin();

    stdin.addListener("data", function(d) {
        listarBooks(d.toString().trim());
        stdin.pause();
        novaPesquisa();
    });

}

function novaPesquisa() {
    console.log("Deseja Realizar uma nova pesquisa?");
    var stdin0 = process.openStdin();

    stdin0.addListener("data", function(d) {
        if(d.toString().trim() == "N"){
            console.log("Gostaria de ordenar a lista de qual maneira, 1 para asc e 2 para desc")
        }
        //listarBooks(d.toString().trim());
    });
}

function quebraEspecificacao(tipoEsp) {
    espc = tipoEsp.split(",");
}

function pesquisarEspecificacao(tipoEsp) {
    var filtroEspc = tipoEsp.split(",");
    var resultSearch = [];
    var contem = 0;
    var ncontem = 0;

    for(var num = 0; num < result.length;num++){
        ncontem = 0;
        for(var i = 0; i < espc.length;i++){
            if(espc[i] == 1){
                if(result[num].specifications.Originally_published.indexOf(filtroEspc[i]) < 0){
                    ncontem++;
                }
            }
            if(espc[i] == 2){
                if(result[num].specifications.Author.indexOf(filtroEspc[i]) < 0){
                    ncontem++;
                }
            }
            if(espc[i] == 3){
                if(result[num].specifications.Page_count.toString().indexOf(filtroEspc[i]) < 0){
                    ncontem++;
                }
            }
            if(espc[i] == 4){
                for(var a = 0; a < result[num].specifications.Illustrator.length;a++){
                    if(result[num].specifications.Illustrator[a].indexOf(filtroEspc[i]) >= 0){
                        ncontem = 0;
                        break;
                    } else {
                        ncontem++;
                    }
                }
            }
            if(espc[i] == 5){
                for(var a = 0; a < result[num].specifications.Genres.length;a++){
                    if(result[num].specifications.Genres[a].indexOf(filtroEspc[i]) >= 0){
                        ncontem = 0;
                        break;
                    } else {
                        ncontem++;
                    }
                }
            }
        }
        if(ncontem == 0){
            resultSearch[contem] = result[num];
            contem++;
        }
    }

    for(var b = 0; b < resultSearch.length;b++){
        console.log("Nome:", resultSearch[b].name);
    }

}

const questions = [
    "Por favor informar palavra chave para pesquisar os produtos ?",
    "Gostaria de ordenar a lista de qual maneira, 1 para asc e 2 para desc",
    "Por qual especificação gostaria de pesquisar? 1 - Originally published, 2 - Author, 3 - Page count, 4 - Illustrator e 5 - Genres. Para pesquisar por mais de uma especificação, separar os núemros com virgula",
    "Por favor preencher os filtros separados com virgula de acordo com a pergunta anterior",
];

(async () => {
    var count = 0;

    questions[Symbol.asyncIterator] = async function * () {
        const stdin = process.openStdin()

        for (const q of this) {
            // The promise won't be solved until you type something
            const res = await new Promise((resolve, reject) => {
                console.log(q)

                stdin.addListener('data', data => {
                    resolve(data.toString())
                    reject('err')
                });
            })

            yield [q, res];
        }

    };

    for await (const res of questions) {
        if(count == 0){
            listarBooks(res[1].trim());
        } else if (count == 1){
            if(res[1].trim() == 1 || res[1].trim() == 2){
                ordenar(res[1].trim());
            }else{
                console.log("Valor diferente do solicitado")
            }
        } else if(count == 2){
            quebraEspecificacao(res[1].trim());
        } else {
            pesquisarEspecificacao(res[1].trim());
        }

        console.log(res)
        count++;
    }

    process.exit(0)
})();


