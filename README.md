[![Travis Build Status](https://travis-ci.org/globocom/share-bar.svg)](https://travis-ci.org/globocom/share-bar)
[![Dependencies Status](https://david-dm.org/globocom/share-bar.svg)](https://david-dm.org/globocom/share-bar#info=dependencies)
[![Dev Dependencies Status](https://david-dm.org/globocom/share-bar/dev-status.svg)](https://david-dm.org/globocom/share-bar#info=devDependencies)
[![Coverage Status](https://img.shields.io/coveralls/globocom/share-bar.svg)](https://coveralls.io/r/globocom/share-bar)

ShareBar
========

Plugin js que automatiza a criação de barra de share de acordo com as redes sociais desejadas. O ShareBar não depende de nenhuma lib JS e já conta com todos os recursos necessários embedados em seu próprios estáticos. Além disso ele é totalmente responsive, baseando-se no tamanho da área onde está sendo aplicado e também no device onde está sendo exibido.

[demo](http://globocom.github.io/share-bar/)

Compatibilidade
----

| Browser           | Versão         |
| ----------------- |:--------------:|
| Chrome            | Todas          |
| Firefox           | 3.6+           |
| Safari            | 5+             |
| IE                | 9+             |

| Devices                            |
| ---------------------------------- |
| Windows Surface                    |
| Android 2.3+                       |
| IOS                                |


Como instalar
----

Você pode instalar o plugin através do bower, usando o comando abaixo:
```
bower install share-bar
```

ou, pode instalar manualmente fazendo download dos arquivos abaixo e colocando-os em seu projeto:

https://raw.githubusercontent.com/globocom/share-bar/master/dist/css/share.bar.min.css
https://raw.githubusercontent.com/globocom/share-bar/master/dist/js/share.bar.min.js


Como usar
----

Para utilizar o share, basta inserir na página os arquivos JS e CSS e instanciar o plugin:

```
<link rel="stylesheet" href="path_to_css/share.bar.min.css">
<script src="path_to_js/share.bar.min.js"></script>
<script>
    new ShareBar({'facebookAppId': 'APP_ID'});
</script>
```

* Caso não seja informado o APP_ID do facebook, o mesmo será obtido da página via [meta tag open graph](https://developers.facebook.com/docs/sharing/webmasters#basic) do facebook. Uma vez sem APP_ID, o share funcionará somente com a inicialização de outra barra com APP_ID na mesma página. De qualquer forma, é recomendado passar a APP_ID do facebook se esta rede social estiver incluida na barra.

O elemento que deverá instanciar o share deverá seguir o exemplo abaixo
```
<div class="share-bar" data-title="Teste do lightbox para imagem" data-url="Vale a pena testar de novo" data-image-url="http://lorempixel.com/1080/700/" data-hashtags="#example #sharebar"></div>
```

Um exemplo de utilização do plugin pode ser visto no arquivo "demo/index.html".

Opções de inicialização do plugin
----

O plugin permite algumas customizações e configurações afim de flexibilizar seu funcionamento.

**selector**

Permite alterar o seletor padrão utilizado para instanciar o share.

Default: ```.share-bar```
```
<script>
    new ShareBar({'selector': '.meu-seletor'});
</script>
```

**theme**

Permite alterar o tema padrão utilizado no share, por padrão existem dois temas disponíveis: natural e dark. O tema dark abre o share com icones em preto e branco, e o natural com botões coloridos. Caso deseje criar um outro tema basta usar a classe .share-[SEU TEMA] para estilizar os botões e configurar o plugin com o tema criado.

Default: ```natural```
```
<script>
    new ShareBar({'theme': 'dark'});
</script>
```

**classPopup**

Permite alterar a classe utilizada para abrir as redes sociais em popup. Só é necessário mudar essa configuração caso a classe default já esteja sendo utilizada em seu projeto com outro objetivo.

Default: ```share-popup```
```
<script>
    new ShareBar({'classPopup': 'class-popup'});
</script>
```

**buttonWidth**

Permite alterar a largura reservada para um botão em tamanho reduzido. Essa propriedade não afeta na largura do botão, o plugin apenas utiliza essa informação para calcular quantos botões cabem na barra. Só altere essa propriedade se já tiver alterado a largura de botões através do css.

Default: ```34```
```
<script>
    new ShareBar({'buttonWidth': 50});
</script>
```

**buttonFullWidth**

Permite alterar a largura reservada para um botão em tamanho expandido. Essa propriedade não afeta na largura do botão, o plugin apenas utiliza essa informação para calcular quantos botões cabem na barra. Só altere essa propriedade se já tiver alterado a largura de botões expandidos através do css.

Default: ```110```
```
<script>
    new ShareBar({'buttonFullWidth': 150});
</script>
```

**buttonPadding**

Permite alterar o padding esquerdo reservada para um botão. Essa propriedade não afeta no padding do botão, o plugin apenas utiliza essa informação para calcular quantos botões cabem na barra. Só altere essa propriedade se já tiver alterado o padding dos botões através do css.

Default: ```4```
```
<script>
    new ShareBar({'buttonPadding': 4});
</script>
```

**maxSocialButtons**

Permite alterar a quantidade máxima de redes sociais a serem exibidas na barra. Só altere essa propriedade caso deseje exibir mais do que 6 botões na barra. O plugin usa essa propriedade apenas como limitador máximo, para exibir menos basta passar menos redes sociais.

Default: ```6```
```
<script>
    new ShareBar({'maxSocialButtons': 10});
</script>
```

**networks**

Permite alterar as redes sociais habilitadas na barra de share. É através dessa configuração que se pode adicionar ou remover botões das redes sociais na barra de share.

Default:
```
[
    facebook,
    twitter,
    whatsapp,
    google,
    pinterest,
    email
]
```

```
<script>
    new ShareBar({
        'networks': [
            'facebook',
            'twitter',
            function createSampleButton(container, buttonClass) {
                var data = this.getMetadataFromElement(container);
                buttonClass = buttonClass || '';

                this.createButton(
                    container, 'sample', buttonClass,
                    'http://www.sample.com/sample-sharer.php?u=' + data['url']
                );
            }
        ]
    });
</script>
```

```
Ps: Uma nota importante com relação ao ícone do whatsapp. Seu aparecimento se dá em devices com telas menores que 768px e que possuem touch(seja o sistema operacional Android ou Ios).
```

**context**

Permite alterar o contexto de renderização da barra, essa informação é enviada via parâmetro utm_medium. Essa informação pode ser usada caso haja diferentes templates onde a barra é renderizada e existe a necessidade de filtrar no google analytics visitas baseada nessa informação de contexto.

Default: ```desktop```
```
<script>
    new ShareBar({'context': 'mobile'});
</script>
```

**onCreateBar**

Callback que permite executar uma ação após a criação da barra. Ela recebe por parâmetro a barra que acabou de ser criada.

Default: ```function (bar) { return false; }```
```
<script>
    new ShareBar({'onCreateBar': function (bar) { alert(bar.innerHTML); }});
</script>
```

**onCreateButton**

Callback que permite executar uma ação após a criação de um botão de share. Ela recebe por parâmetro o botão que acabou de ser criadao. Essa callback é chamada na criação de cada um dos botões que compõem a barra.

Default: ```function (button) { return false; }```
```
<script>
    new ShareBar({'onCreateBar': function (button) { alert(button.innerHTML); }});
</script>
```

**onShare**

Callback que permite executar uma ação após o click em algum botão de share. Ela recebe por parâmetro o botão que foi clicado.

Default: ```function (button) { return false; }```
```
<script>
    new ShareBar({'onShare': function (button) { alert(button.innerHTML); }});
</script>
```
**createBar**

É possivel chamar diretamente o método createBar para criar uma barra quando quiser.

Exemplo:
```
var la = new ShareBar({'maxSocialButtons': 10});
la.createBar(document.querySelector('.minha-barra'));
```

PS: para funcionar, o elemento que será utilizado para colocar a barra precisa conter todos os data-attributes já descritos anteriormente.

Instalação
----
Esse projeto depende do npm.

Para instalar o projeto em sua máquina afim de fazer modificações basta seguir o passo abaixo:
```
$ make setup
```

Para verificar se a instalação funcionou corretamente, basta rodar os testes:
```
$ make test
```

Para iniciar um servidor localhost e permitir abrir o arquivo demonstração, basta rodar o comando run:
```
$ make run
```

**ícones**

Os ícones hoje utilizados no projeto são svg's embedados junto ao javascript. Existe também um fallback para browsers que não suportam svg e são fontes geradas a partir dos svg's no projeto. A fonte de ícones está embedada no css gerado.

Adicionando ícones svg ao projeto:
1 - Adicione o seu svg ao path de imagens
```
$ mv ~/caminho/da/imagem.svg caminho/do/share/src/img/
```
2 - Regere o svg embeded e a fonte de ícones
```
$ grunt icon
```
3 - Altere os temas( css ) para o svg e a fonte se comportarem da maneira desejada

4 - Caso queira adicione a função de callback de criação de botão


**Versão**

Para gerar uma nova versão (tag) do plugin basta rodar o comando de bump:
```
$ grunt bump
```


License
----

The MIT License (MIT)

Copyright (c) 2014 globo.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
