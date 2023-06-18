/* Registra biblioteca paged.js na própria pagina  */
const pagedjs = window.Paged;


let paged = new pagedjs.Previewer();

/* Elementos da pagina */
let reportContent = document.getElementById("Report");
let documentPlaceholder = document.getElementById("documentPlaceholder");

/* Preview do relatorio com o paged.js */
/*
    @param content: elemento que contem o conteudo do relatorio
    @param stylesheets: Arquivo que devera ser utilizado para os estilos do relatorio, se for 
                        nulo o paged.js ira utilizar os estilos da pagina HTML
    @param documentPlaceholder: elemento que irá conter o conteudo formatado pelo paged.js
*/
let flow = paged.preview(reportContent, null, documentPlaceholder).then((flow) => {
    /* Esconde conteudo original do relatorio após a formatação do paged.js */
    reportContent.style.display = "none";
});

/* função para remover os elementos da pagina que não devem ser impressos, antes da impressão */
function formatarParaImpressao() {
    let bodyEls = document.getElementsByClassName("noPrintElement");
    for (var i of bodyEls) {
        i.style.display = "none";
    }
}
/* função para mostrar os elementos da pagina após a impressão */
function formatarParaAposImpressao() {
    let bodyEls = document.getElementsByClassName("noPrintElement");
    for (var i of bodyEls) {
        i.style.display = "block";
    }
}
/* função para imprimir o documento */
function imprimir() {
    print()
}

/* Handler para que quando uma tabela quebre para outra pagina o header seja gerado tambem na outra pagina */
class TableHeatherHandler extends Paged.Handler {
    constructor(chunker, polisher, caller) {
        super(chunker, polisher, caller);
    }

    afterRendered(pages) {
        var tables = documentPlaceholder.getElementsByTagName("table");
        var theads = {};
        var tabelasSemThead = [];

        for (var table of tables) {
            var th = table.querySelectorAll("thead");
            if (th[0] !== undefined) {
                var att = table.getAttribute("data-ref-table");
                theads[att] = th[0];
            } else {
                tabelasSemThead.push(table);
            }
        }
        for (var table of tabelasSemThead) {
            var att = table.getAttribute("data-ref-table");
            var thead = theads[att];
            if (thead !== undefined) {
                table.appendChild(thead.cloneNode(true));
            }
        }
    }
}
/* registra handler para heaters de tabelas */
paged.registerHandlers(TableHeatherHandler);