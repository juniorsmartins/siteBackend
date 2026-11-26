# APIs DE REDE

**Conceito**: APIs (Application Programming Interface - Interface de Programação de Aplicações) dessa categoria são projetadas para aplicações que se comunicam por meio de uma rede de computadores. As interfaces mais comuns são as APIs web, que são fornecidas pelo servidor web e consumidas pelo navegador. Nesse caso, o navegador utiliza principalmente a API web do JavaScript para interagir com o servidor web.

**Estilo de API**: um paradigma que utiliza padrões, práticas e protocolos para projetar, implementar e expor APIs. Um estilo de API é formado por uma combinação de características (protocolos, restrições de design e etc). Exemplos de estilos de API: Rest/Restful, APIs de consulta (GraphQL), Feed da web (RSS e Atom), Chamada de Procedimento Remoto - RPC (gRPC), Callback (Webhooks), Bidirecional (Websocket e gRPC), API baseada em Broker (Apache ActiveMQ, Apache Kafka e RabbitMQ) e etc.

**Estilo Rest/Restful**: seguem seis restrições descritas na [tese de doutorado de Roy Fielding](https://oreil.ly/vNPXH), proposta no ano 2000. Embora muitas APIs se autodenominem Restful, na prática elas deixam de incluir links de hipermídia, que são um requisito do design de APIs Restful. 

**Modelos de monetização de API**: pagamento por uso (pay-per-use), assinatura, freemium, taxa por transação e divisão de receita.

**Ciclo de vida da API (SDLC)**: planejamento, design, implementação, aplicação de testes, documentação, implantação, manutenção e encerramento.


## Estilo Rest/Restful

1. **Estilo Nulo**: o projetista começa com as necessidades do sistema como um todo, sem restrições, e então identifica e aplica restrições incrementalmente aos elementos do sistema, a fim de diferenciar o espaço de projeto e permitir que as forças que influenciam o comportamento do sistema fluam naturalmente, em harmonia com ele. Esse estilo enfatiza a contenção e a compreensão do contexto do sistema. Entendimento: é só o ponto de partida: um sistema sem nenhuma regra. As restrições abaixo são acrescentadas uma a uma.

2. **Cliente-Servidor**: separar as responsabilidades de quem pede a informação (navegador/Frontend) de quem guarda e processa os dados (Backend/Node.js/MongoDB). Servidores e clientes podem ser desenvolvidos ou substituídos independentemente, desde que a interface entre eles não seja alterada.

3. **Sem Estado**: torne todas as interações cliente-servidor sem estado. O servidor não armazenará nada sobre a última requisição HTTP feita pelo cliente. Ele tratará cada requisição como nova. Sem sessão, sem histórico. O cliente é responsável por gerenciar o estado da aplicação. Cada solicitação do cliente deverá conter todas as informações necessárias para atender à solicitação – incluindo detalhes de autenticação e autorização.

4. **Cache**: para melhorar a eficiência da rede, adicionamos restrições de cache para formar o estilo cliente-cache-servidor sem estado. As restrições de cache exigem que os dados em uma resposta a uma solicitação sejam rotulados implícita ou explicitamente como armazenáveis ​​em cache ou não armazenáveis ​​em cache. Se uma resposta for armazenável em cache, o cache do cliente terá o direito de reutilizar esses dados de resposta para solicitações equivalentes posteriores. Um sistema de cache bem gerenciado elimina parcial ou totalmente algumas interações cliente-servidor, melhorando ainda mais a escalabilidade e o desempenho.

5. **Interface Uniforme**: para obter uma interface uniforme, são necessárias múltiplas restrições arquitetônicas para orientar o comportamento dos componentes. REST é definido por quatro restrições de interface: 

    5.1. Identificação de recursos: os recursos individuais são identificados nas requisições usando URIs. Cada coisa tem o seu.

    5.2. Manipulação de recursos por meio de representações: você troca uma cópia do recurso, em um formato comum. Ex: json ou XML.

    5.3. Mensagens autodescritivas: a resposta explica o que aconteceu.

    5.4. Hipermídia: a resposta traz links para os próximos passos. É a parte que quase ninguém implementa na prática.

6. **Sistema em Camadas**: REST permite usar uma arquitetura de sistema em camadas, onde você implanta as APIs no servidor A, armazena os dados no servidor B e autentica as solicitações no servidor C, por exemplo. Um cliente normalmente não consegue determinar se está conectado diretamente ao servidor final ou a um intermediário no caminho. O cliente só conhece a camada com a qual conversa. 

7. **Código sob demanda**: o servidor pode enviar código para o cliente executar. Bem, essa restrição é opcional. Na maioria das vezes, você enviará as representações estáticas dos recursos na forma de XML ou JSON. Mas, quando necessário, você pode permitir que "return executable code" uma parte da sua aplicação funcione dessa forma; por exemplo, os clientes podem chamar sua API para obter o código de renderização de um widget da interface do usuário ou um script. 


## Padrões de Design

1. **Idioma da API**: inglês

2. **Nomenclatura de APIs**: em uma API Rest, a norma é adotar nomes orientados a recursos (dados) e no plural. Ex: /orders/123. Por outro lado, APIs de GraphQL, gRPC ou Brokers normalmente seguem uma abordagem orientada à finalidade, o que possibilita maior flexibilidade permitindo o uso tanto de nomes no singular quanto no plural. 

3. **Versionamento (ou controle de versão)**: APIs estão em constante mudança e evolução. Por isso, precisamos levar o versionamento em consideração, de modo a permitir que atendam a todos os seus usuários à medida que as mudanças ocorrem. Há várias abordagens de versionamento:

    3.1. Versionamento por caminho (URI): /v1/orders/123.

    3.2. Versionamento por parâmetro de consulta: /orders?api-version=v1 ou /orders?resource-version=4.2.3

    3.3. Versionamento por header (cabeçalho): Accept: application/vnd.example+json;api-version=1

    3.4. Versionamento via payload da mensagem: { "version": "v1", data: {...} }

    3.5. Outras: versionamento semântico; versionamento por calendário; versionamento por hash.

4. **Compressão**: à medida que os dados crescem, o custo de transferência entre sistemas também aumenta e pode afetar a experiência do usuário. Talvez isso não seja perceptível em escala de megabytes, mas, conforme os dados se expandem para gigabytes ou mais, o tempo e o custo envolvidos na movimentação de dados pode se tornar problemático. Por conta disso, esses dados podem ser comprimidos em texto ou em binários. Exemplos de formatos em texto: ASCII, UTF-8, XML, JSON e YAML. Exemplos de formatos em binário (mais eficiente): [Apache Avro](https://avro.apache.org/), Amazon Ion, MessagePack, [Protocol Buffers](https://protobuf.dev/) e [Apache Thrift](https://thrift.apache.org/).  

5. **Filtragem**: a filtragem permite recuperar dados específicos a partir de um conjunto de dados maior, com base em condições de seleção. Em APIs Rest, a forma mais comum de aplicar filtragem é adicionar critérios como parâmetros de consulta ao URI. Ex: https://example.com/api/v1/books?language=en. E existem duas principais abordagens para transferir critérios de filtragem à API: 

    5.1. A primeira utiliza uma string de filtro, que é enviada à API dentro do parâmetro de consulta. O formato dessa string depende da tecnologia de armazenamento utilizada. Por exemplo, se for banco de dados SQL, "country='Denmark' AND snowfall >= 0.5 AND rain >= 0.1". Claro, isso será sanitizado, controlado e interpretado para evitar ataques por injeção de SQL.

    5.2. A segunda abordagem (mais comum), conhecida como filtragem por campo, utiliza dados de filtragem enviados à API como parâmetros de consulta. Por exemplo: /api/v1/books?country=Denmark&snowfall>=0.5&rain>=0.1.

6. **Contagem e Ordenação**: a contagem serve para determinar o número total de registros. A ordenação organiza dadps em ordem crescente ou decrescente, utilizando propriedades como tempo, nome ou números.

7. **Paginação**: é um padrão de design que busca resolver o problema de carregamento de grandes volumes de dados em páginas. Cada página contém um subconjunto dos dados, determinado pelo tamanho da página (número de itens) e funcionando como uma janela sobre o conjunto ao exibir apenas uma parte dos dados por vez. Diversas abordagens podem ser adotadas para implementar a paginação, mas as mais comuns são: 

    7.1. Paginação baseada em deslocamento (offset-based): há duas variações dessa técnica, a primeira utiliza o número de páginas como parâmetro de consulta de requisição. O valor de page nos campos de next e previous é incrementado e decrementado em uma unidade e o campo count indica a quantidade total de objetos no conjunto de dados. A segunda variação utiliza os parâmetros de consulta limit e offset. O parâmetro limit define a quantidade total de itens a ser retornada, enquanto o offset indica o ponto de início dos resultados em relação ao conjunto completo de itens não paginados. A principal vantagem é permitir que os clientes estimem o número total de páginas e tenha acesso direto a uma página específica. Por outro lado, pode se tornar ineficiente em conjuntos de dados muito grandes, resultando em tempos de resposta mais lentos. Outro problema é quando há exclusões ou inserções de itens, pois itens podem deixar de aparecer ou serem repetidos na página seguinte. (livro1: pág.77)

    7.2. Paginação baseada em cursor (cursor-based): utiliza um cursor (ponteiro) para indicar a posição dentro do conjunto de dados. Esse cursor precisa ser um valor único e sequencial para permitir ordenação, como uma chave primária de banco de dados. Ele é codificado e aparece como um token que não é compreendido pelo cliente, mas que a API consegue interpretar. A API sabe como decodificar o cursor e utilizá-lo para navegar pelo banco de dados. (livro1: pág.78)

8. **Tarefas de longa duração**: em geral, clientes e servidores de API utilizam tempos limites (timeouts) predefinidos para evitar espeas indefinidas. Esse mecanismo é eficar apenas para tarefas com duração de processamento relativamente curta, e falha em cenários onde o tempo de execução excede o timeout, como no processamento de grandes volumes de dados ou em transformações de vídeo. Nesses casos, o padrão de tarefa de longa duração (long-running operations) pode ser uma solução útil. Nessa abordagem, o cliente envia uma requisição que dispara o processamento da tarefa. Em vez de retornar o resultado do processamento, a API retorna um identificador único da tarefa, que o cliente usa para consultar seu status (progresso). Quando aceita, a API Rest deve retornar o código de status 202 (accepted). Uma maneira de expor a tarefa é definir um recurso no nível superior da API, como /api/v1/tasks.

9. **Duplicação de requisições**: essa duplicação pode ocorrer por cliques repetidos na interface. Para evitar os efeitos indesejados da duplicação, o cliente pode gerar um ID de requisição e incluí-lo na requisição enviada. Quando a API recebe uma requisição com o mesmo ID pela segunda vez, ela lida com a duplicação de forma adequada, por exemplo, retornando a resposta bem-sucedida anterior ou um erro. 

10. **Repetição de requisições**: outro aspecto que precisamos considerar no design de uma API é o momento adequado para repetir uma requisição malsucedida. Uma requisição pode falhar por estar inválida, falha na rede, erro no servidor ou lógica incorreta na aplicação. Se a falha for causada por um problema do lado da API, a requisição original deve ser reenviada posteriormente. Há várias técnicas, por exemplo: retry storm, cutoff, [circuit breaker](https://oreil.ly/e1mZS). 

11. **Limitação de taxa**: essa técnica impõe um limite ao número de requisições que um único cliente pode realizar a um mesmo endpoint dentro de um intervalo de tempo determinado. Essa abordagem também pode ser utilizada para reduzir o impacto de ataques de força bruta ou de negação de serviço (Denial of Service - DoS).

12. **Cache**: é uma técnica que otimiza o ciclo de requisição-resposta ao reduzir a necessidade de o cliente buscar novamente os recursos no servidor. Ela melhora a capacidade de resposta do cliente e reduz a carga sobre o servidor. Há duas abordagens: cache do lado do cliente e cache do lado do servidor. (livro1: pág 83)

13. **Exclusão**: de acordo com os princípios das APIs Rest, a exclusão de recursos pode ser feita de duas formas: soft delete (exclusão lógica) ou hard delete (exclusão física). O soft delete preserva o recurso, mas o marca como excluído. O hard delete remove o recurso do sistema. Importante: o soft delete não atende completamente aos requisitos de exclusão de dados exigidos por diversas regulamentações de proteção de dados pelo mundo. 


## Segurança em APIs

Os principais riscos de segurança listados pela OWASP podem ser agrupados em três categorias: autenticação e autorização, gerenciamento de inventário e gerenciamento de recursos. 

1. **Criptografia, autenticação e autorização**: a criptografia é o meio mais comum de proteger o tráfego de uma API. Trata-se do processo de converter os dados de seu formato original, texto simples, em um texto cifrado, por meio de algoritmo e chave de criptografia. O texto cifrado não pode ser lido sem a chave de descriptografia. A criptografia do tráfego de APIs normalmente utiliza TLS, que também permite ao cliente autenticar o servidor por meio de um certificado digital emitido por uma autoridade certificadora. Em alguns casos, utiliza-se a autenticação mútua TLS (mTLS), em que cliente e servidor se autenticam mutuamente. Por fim, o TLS assegura a integridade dos dados ao verificar se não foram alterados durante a transmissão. Essa tarefa é feita com o uso de códigos de autenticação de mensagens (Message Authentication Codes - MACs). A autenticação verifica a identidade da entidade e a autorização verifica se essa entidade possui permissão de acesso aos recursos solicitados. (livro1: pág 87)

2. **Use HTTPS**: o HTTPS aparece no URL quando um site é protegido por um certificado [SSL/TLS](https://www.digicert.com/what-is-an-ssl-certificate). O Secure Sockets Layer (SSL) é uma tecnologia de segurança padrão para estabelecer uma conexão criptografada entre um servidor e um cliente — normalmente um servidor web (site) e um navegador, ou um servidor de e-mail e um cliente de e-mail (por exemplo, o Outlook). É mais conhecido do que o Transport Layer Security (TLS), a tecnologia sucessora do SSL. O TLS é uma versão atualizada e mais segura do SSL. 

3. **Menor privilégio**: uma entidade deve ter apenas o conjunto de permissões necessárias para executar as ações para as quais está autorizada e nada mais. Permissões podem ser adicionadas conforme necessário e devem ser revogadas quando não forem mais utilizadas. [Mais informações](https://en.wikipedia.org/wiki/Principle_of_least_privilege) 

4. **Negar por padrão**: o nivel de acesso padrão de um usuário a qualquer recurso do sistema deve ser "negado", a menos que tenha recebido uma "permissão" explícita. 

5. **Hash de senha**: senhas devem sempre ser criptografadas para proteger o sistema (bcrypt, argon2).

6. **OAuth**: delegue acesso sem compartilhar senha, com tokens de expiração curta.

7. **API sem estado (stateless)**: evita ataque de 'session fixation' por não ter armazenado tabelas de sessões. Porém, a segurança depende de como você guarda e revoga os tokens.

8. **Métodos seguros**: GET, HEAD e OPTIONS. São seguros por não modificar recursos no servidor. Mantenha assim. 

9. **Não divulgue informações em URLs**: nomes de usuário, senhas, tokens de sessão e chaves de API não devem aparecer na URL, pois podem ser capturados nos logs do servidor web e históricos. Ex: https://api.domain.com/user-management/users/{id}/someAction?apiKey=abcd123456789. Prefira usar cabeçalhos.

10. **Adicione carimbo de data/hora à solicitação**: juntamente com outros parâmetros de solicitação, você pode adicionar um carimbo de data/hora da solicitação como um cabeçalho HTTP personalizado em solicitações de API. O servidor comparará o carimbo de data/hora atual com o carimbo de data/hora da solicitação e só aceitará a solicitação se tiver ocorrido após um período razoável (30 segundos, por exemplo). Isso impedirá ataques de repetição (Replay attack) que não alterem esse registro de data e hora. 

11. **Segredos fora do código e do repositório**: coloque segredos no arquivo .env e avise o .gitignore. 

12. **Rate limiting**: limite as requisições por cliente para barrar força bruta e abuso.

13. **Responda só o necessário**; não responda requisições com o documento inteiro do banco. E não mostre o stack trace nos erros e nas mensagens genéricas.

14. **Sanitização e Validação**: a sanitização garante que os dados estejam em um formato seguro para processamento. Significa remover entradas indesejadas, como caracteres inesperados, ou eliminar espaços em branco no início e no fim da string de entrada. Já a validação buscar garantir que a entrada respeite as restrições e políticas definidas. Por exemplo: espera-se que os dados validados estejam dentro de um intervalo aceitável e que strings sigam o formato correto, como um CEP válido. 

15. **Mitigação de Scraping**: o scraping de dados permite que um programa extraia dados de outro programa. A forma mais comum de scraping é o web scraping, que extrai dados de sites. Outras variações envolvem a extração de dados de APIs, aplicativos de desktop ou bancos de dados. Para proteger seu site dos web crawlers mais conhecidos e "bem-comportados", você pode disponibilizar o arquivo robots.txt na raiz do servidor da API. Vale observar que o robots.txt é um padrão voluntário e nem todos os bots o respeitam. Outro padrão utilizado para proteger endpoins públicos de API consiste em evitar o uso de sequências previsíveis para identificadores de recursos. Se estes foram números inteiros, como o 1 em /api/v1/books/1, scrapers podem capturar todos os recursos apenas incrementando o identificador. Se, em vez de números inteiros, utilizarmos identificadores UUIDv4 no formato, os demais scrapers levariam muito tempo para tentar advinhar. (livro1: pág 89) 


## Referências

1. [Guia de design de APIs do Google](https://google.aip.dev/1); 
2. [Guia de projeto da API do Google](https://docs.cloud.google.com/apis/design?hl=pt-br);
3. [Diretrizes de design de APIs Rest da Microsoft](https://learn.microsoft.com/pt-br/azure/architecture/best-practices/api-design);
4. [Rest API tutorial](https://restapitutorial.com/);
5. [Restful API tutorial](https://restfulapi.net/);
6. [Livro1: Dominando Estilos de APIs](https://m.media-amazon.com/images/I/71+n66Bbt3L.jpg);


