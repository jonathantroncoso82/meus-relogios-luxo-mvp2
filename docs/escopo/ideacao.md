# Ideação — Visão de Produto

## Ideia principal

Uma plataforma digital para colecionadores de relógios de luxo gerenciarem seu acervo pessoal, permitindo o cadastro e consulta de informações essenciais de cada peça, como marca, modelo, ano de fabricação, data de aquisição e tipo de movimento (bateria ou automático).

## Valor para o negócio

Centralizar o cadastro dos relógios da coleção reduz o tempo gasto em controles manuais dispersos (planilhas, anotações), minimiza erros de registro e oferece visibilidade imediata sobre o patrimônio acumulado. Para colecionadores que gerenciam múltiplos itens de alto valor, isso se traduz em maior segurança na tomada de decisões de compra, venda e manutenção, além de facilitar eventuais processos de seguro ou avaliação. Estima-se redução de até 70% no tempo dedicado à organização manual da coleção e aumento significativo na confiabilidade das informações registradas.

## Requisitos não funcionais

O sistema deve estar disponível ao menos 99% do tempo em horário comercial, dado o perfil de uso pessoal e não crítico da aplicação. O tempo de resposta para consultas e registros de relógios deve ser inferior a 2 segundos em condições normais de uso. Por se tratar de uma coleção pessoal com dados sensíveis de patrimônio, o acesso deve ser protegido por autenticação, com dados armazenados de forma segura e criptografada em repouso e em trânsito. Em conformidade com a LGPD, os dados do colecionador devem ser tratados com finalidade específica, sendo vedado o compartilhamento com terceiros sem consentimento explícito, e o titular deve ter meios para solicitar a exclusão ou exportação de seus dados a qualquer momento. O sistema deve suportar o volume de uma coleção individual, sem necessidade de escala horizontal no curto prazo, mas com arquitetura que permita crescimento futuro sem reescrita.

## Personas

Colecionador de relógios de luxo que deseja registrar e organizar os itens da sua coleção pessoal, acompanhando informações como marca, modelo, ano de fabricação, data de aquisição e tipo de movimento do relógio. Pode ser um entusiasta individual ou um colecionador com grande volume de peças que precisa de controle centralizado para consulta e gestão do acervo.

## Funcionalidades

- Cadastro de relógios com informações de marca, modelo, ano de fabricação, data de compra e tipo de movimento (bateria ou automático)
- Listagem e visualização da coleção de relógios cadastrados
- Edição e exclusão de registros de relógios existentes
- Filtro e busca de relógios por marca, modelo, ano ou tipo de movimento
- Painel resumo com totais e estatísticas básicas da coleção

## Stakeholders

Colecionador de relógios (usuário principal e aprovador das decisões do produto), avaliadores ou peritos em relógios de luxo (influenciadores na definição dos atributos relevantes de cada peça), seguradoras (interessadas nos dados de aquisição e valor da coleção para fins de apólice), familiares ou herdeiros do colecionador (informados sobre o patrimônio registrado) e eventuais compradores ou vendedores do mercado secundário de relógios (impactados pela rastreabilidade e histórico das peças).

## Regras de negócio

O ano de fabricação do relógio não pode ser futuro em relação à data atual. A data de compra não pode ser anterior ao ano de fabricação do relógio. O tipo de movimento deve ser restrito a dois valores possíveis: bateria ou automático, não sendo permitido valor nulo ou livre. Marca e modelo são campos obrigatórios e não podem ser registrados em branco ou apenas com espaços. O ano de fabricação deve ser um valor numérico inteiro positivo e representar um ano plausível para relógios de luxo, não sendo aceitos anos anteriores ao século XIX, período em que relógios de pulso passaram a existir. Cada relógio cadastrado deve ser tratado como um item único da coleção, não sendo permitido o registro duplicado de um mesmo exemplar com marca, modelo e ano idênticos associados à mesma data de compra. A data de compra não pode ser uma data futura.

