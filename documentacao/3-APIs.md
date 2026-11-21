# APIs DE REDE

**Conceito**: APIs (Application Programming Interface - Interface de Programação de Aplicações) dessa categoria são projetadas para aplicações que se comunicam por meio de uma rede de computadores. As interfaces mais comuns são as APIs web, que são fornecidas pelo servidor web e consumidas pelo navegador. Nesse caso, o navegador utiliza principalmente a API web do JavaScript para interagir com o servidor web.

**Estilo de API**: um paradigma que utiliza padrões, práticas e protocolos para projetar, implementar e expor APIs. Um estilo de API é formado por uma combinação de características (protocolos, restrições de design e etc). Exemplos de estilos de API: Rest/Restful, APIs de consulta (GraphQL), Feed da web (RSS e Atom), Chamada de Procedimento Remoto - RPC (gRPC), Callback (Webhooks), Bidirecional (Websocket e gRPC), API baseada em Broker (Apache ActiveMQ, Apache Kafka e RabbitMQ) e etc.

**Estilo Rest/Restful**: seguem seis restrições descritas na tese de Roy Fielding (https://oreil.ly/vNPXH). Embora muitas APIs se autodenominem Restful, na prática elas deixam de incluir links de hipermídia, que são um requisito do design de APIs Restful.  

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


## Documentações de referência

1. [Guia de design de APIs do Google](https://google.aip.dev/1); 
2. [Guia de projeto da API do Google](https://docs.cloud.google.com/apis/design?hl=pt-br);
3. [Diretrizes de design de APIs Rest da Microsoft](https://learn.microsoft.com/pt-br/azure/architecture/best-practices/api-design);
4. [Rest API tutorial](https://restapitutorial.com/);
5. [Restful API tutorial](https://restfulapi.net/).


