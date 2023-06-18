# **Documentação da biblioteca paged.js**

## Introdução

A biblioteca paged.js é uma ferramenta poderosa para formatar livros, documentos e relatórios. Ela oferece recursos avançados de formatação, como tamanho de página, margens, cabeçalhos e rodapés, permitindo criar visualizações semelhantes a uma página impressa diretamente no navegador.

Esta documentação apresenta o uso da biblioteca paged.js em uma aplicação front-end baseada em Razor Pages.

## Instalação

Para começar a utilizar a biblioteca paged.js, você pode incluir o arquivo CSS e o script JavaScript em seu projeto. Você pode baixar os arquivos diretamente do repositório oficial da biblioteca ou usar uma CDN. Aqui está um exemplo de como importar os arquivos:

``````html
<!-- Inclua o script JavaScript via arquivo no projeto -->
<script src="paged.js"></script>
<!-- Ou inclua o script JavaScript via CDN -->
<script src="https://cdn.jsdelivr.net/npm/pagedjs/dist/paged.polyfill.js"></script>
``````

## Configuração

A configuração da biblioteca paged.js é realizada por meio de CSS personalizado. Você pode definir o tamanho da folha, as margens e os elementos de cabeçalho e rodapé para cada página. Aqui está um exemplo de código CSS:

``````html
<style media="print">
  /* Configurações aplicadas a cada página */
  @page {
    /* 
       Define o tamanho da folha (A4 com orientação paisagem) 
       Outros tamanhos de folha suportados:
       https://pagedjs.org/documentation/5-web-design-for-print/#page-size-property
    */
    size: A4 landscape;
    /* Define as margens da folha */
    margin-top: 10mm;
    margin-right: 20mm;
    margin-bottom: 25mm;
    margin-left: 15mm;

    @top-center {
      /* Utilizado para inserir o elemento headerEl no cabeçalho de cada página */
      content: element(headerEl);
      /* Estilos personalizáveis para as propriedades do elemento */
      text-transform: uppercase;
    }

    @bottom-center {
      /* Utilizado para inserir o elemento footerEl no rodapé de cada página */
      content: element(footerEl);
      /* Estilos personalizáveis para as propriedades do elemento */
      text-transform: uppercase;
    }
  }

  #ReportHeader {
    /* Define o elemento headerEl (utilizado no @top-center) */
    position: running(headerEl);
    /* Estilos personalizáveis para as propriedades do elemento */
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    font-family: sans-serif;
    color: #000000;
  }

  #ReportFooter {
    /* Define o elemento footerEl (utilizado no @bottom-center) */
    position: running(footerEl);
    /* Estilos personalizáveis para as propriedades do elemento */
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    font-family: sans-serif;
    color: #000000;
  }
</style>

``````

Neste exemplo, as configurações de tamanho de folha, margens, cabeçalho e rodapé são definidas no bloco `@page` do CSS. Os elementos `#ReportHeader` com `position: running(headerEl);` e `#ReportFooter` com `position: running(footerEl);` devem ser criados no código HTML do relatório para representar o cabeçalho e o rodapé de cada página.

## Utilização

Após a instalação e configuração da biblioteca paged.js, você pode utilizá-la para formatar seus relatórios e documentos. Certifique-se de criar os elementos `#ReportHeader` e `#ReportFooter` em seu código HTML, pois eles serão inseridos automaticamente nas páginas formatadas.

Para gerar a visualização formatada, é necessário rodar o método `preview` do objeto `Previewer`, a biblioteca paged.js então aplicará a formatação automaticamente quando a página for carregada.

### Utilização do JavaScript

Além da configuração CSS, é necessário utilizar o JavaScript para garantir que o layout do relatório seja apresentado separadamente em páginas. Para isso, utilize os seguintes comandos:

``````js
/* Registra a biblioteca paged.js da própria página em uma variavel */
const pagedjs = window.Paged;
/* Registra um objeto Previewer */
let paged = new pagedjs.Previewer();

/* Elementos da página */
let reportContent = document.getElementById("Report");
let documentPlaceholder = document.getElementById("documentPlaceholder");

/* Pré-visualização do relatório com o paged.js */
/*
    @param content: elemento que contém o conteúdo do relatório
    @param stylesheets: arquivo que deverá ser utilizado para os estilos do relatório;
                        se for nulo, o paged.js utilizará os estilos da página HTML
    @param documentPlaceholder: elemento que irá conter o conteúdo formatado pelo paged.js
*/
let flow = paged.preview(reportContent, null, documentPlaceholder).then((flow) => {
    /* Esconde o conteúdo original do relatório após a formatação do paged.js */
    reportContent.style.display = "none";
});
``````

Neste exemplo, utilizamos a biblioteca paged.js para criar uma visualização prévia do relatório. O elemento `reportContent` é o contêiner que contém o conteúdo do relatório. O elemento `documentPlaceholder` é o local onde o conteúdo formatado pelo paged.js será inserido.

Ao chamar `paged.preview()`, o paged.js cria a visualização formatada do relatório. É possível fornecer um arquivo de estilos externo como parâmetro em `stylesheets`, caso contrário, o paged.js utilizará os estilos definidos na página HTML.

Após a formatação, o conteúdo original do relatório é ocultado definindo `reportContent.style.display = "none"`. Isso garante que apenas o conteúdo formatado seja exibido.

### Handlers para Geração de Pré-visualização

O paged.js permite a criação de handlers, que são comandos que são executados em diferentes fases da geração da pré-visualização. Isso permite personalizar o comportamento da formatação do paged.js de acordo com suas necessidades. Abaixo, segue um exemplo de criação de um handler:

``````js
/* 
   Handler para que, quando uma tabela quebrar para outra página, 
   o cabeçalho seja gerado também na outra página 
*/
class TableHeaderHandler extends Paged.Handler {
    constructor(chunker, polisher, caller) {
        super(chunker, polisher, caller);
    }

    afterRendered(pages) {
        var tables = documentPlaceholder.getElementsByTagName("table");
        var theads = {};
        var tablesWithoutThead = [];

        for (var table of tables) {
            var th = table.querySelectorAll("thead");
            if (th[0] !== undefined) {
                var att = table.getAttribute("data-ref-table");
                theads[att] = th[0];
            } else {
                tablesWithoutThead.push(table);
            }
        }

        for (var table of tablesWithoutThead) {
            var att = table.getAttribute("data-ref-table");
            var thead = theads[att];
            if (thead !== undefined) {
                table.appendChild(thead.cloneNode(true));
            }
        }
    }
}

/* Registra o handler para cabeçalhos de tabela */
paged.registerHandlers(TableHeaderHandler);

``````

Neste exemplo, criamos um handler chamado `TableHeaderHandler` que é responsável por garantir que, quando uma tabela quebrar para outra página, o cabeçalho seja gerado novamente na nova página. O método `afterRendered()` é executado após a formatação das páginas.

No método `afterRendered()`, recuperamos todas as tabelas presentes no elemento `documentPlaceholder`. Em seguida, verificamos se cada tabela possui um cabeçalho (`<thead>`) associado a ela. Caso tenha, armazenamos o cabeçalho em um objeto `theads`, utilizando o atributo `data-ref-table` como referência para a tabela correspondente. Se uma tabela não possuir cabeçalho, ela é armazenada no array `tablesWithoutThead`.

Em seguida, percorremos as tabelas sem cabeçalho e verificamos se há um cabeçalho correspondente armazenado em `theads`. Se houver, copiamos o cabeçalho (`<thead>`) e o anexamos à tabela.

Por fim, registramos o handler `TableHeaderHandler` usando o método `paged.registerHandlers()`, para que ele seja acionado durante o processo de pré-visualização.

Você pode criar handlers personalizados para atender às suas necessidades específicas durante a geração da pré-visualização.

### Impressão do Relatório

A impressão do relatório formatado pode ser realizada utilizando os seguintes comandos JavaScript:

``````js
/* Função para remover os elementos da página que não devem ser impressos antes da impressão */
function formatarParaImpressao() {
    let bodyEls = document.getElementsByClassName("noPrintElement");
    for (var i of bodyEls) {
        i.style.display = "none";
    }
}

/* Função para mostrar os elementos da página após a impressão */
function formatarParaAposImpressao() {
    let bodyEls = document.getElementsByClassName("noPrintElement");
    for (var i of bodyEls) {
        i.style.display = "block";
    }
}

/* Função para imprimir o documento */
function imprimir() {
    print();
}
``````

No exemplo acima, utilizamos três funções relacionadas à impressão do relatório:

1. A função `formatarParaImpressao()` é responsável por ocultar os elementos da página que não devem ser impressos. Ela seleciona os elementos com a classe "noPrintElement" e define a propriedade `display` como "none", tornando-os invisíveis na página antes da impressão.
2. A função `formatarParaAposImpressao()` é responsável por mostrar novamente os elementos ocultados após a impressão. Ela seleciona os elementos com a classe "noPrintElement" e define a propriedade `display` como "block", fazendo com que eles voltem a ser exibidos normalmente na página após a impressão.
3. A função `imprimir()` é responsável por acionar o comando de impressão do navegador. Ao chamar `print()`, o navegador abrirá a janela de impressão com o conteúdo formatado do relatório. Nesse momento, os elementos ocultos pela função `formatarParaImpressao()` não serão exibidos na impressão.

É importante ressaltar que essa forma de impressão é apenas um exemplo em desenvolvimento e pode não ser a solução final adotada. Certifique-se de adaptar o processo de impressão de acordo com as necessidades e requisitos do seu caso.

## Recursos Adicionais

- Documentação oficial do Paged.js: [link para a documentação](https://www.pagedjs.org/)
- Repositório do Paged.js no GitHub: [link para o repositório](https://github.com/pagedjs/pagedjs)
