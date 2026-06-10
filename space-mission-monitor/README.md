Space Mission Monitor

Aplicativo mobile de monitoramento de missões espaciais, feito com React Native e Expo.

Sobre o Projeto

Curso: Ciência da Computação
Disciplina: Cross-Platform Application Development
Instituição: FIAP — 2026, 1º Semestre

Pedro Del Neri Correia  RM: 562168
Lucas de Freitas Barbosa  RM: 564685

O que é

O Space Mission Monitor simula o painel de controle de uma central de missões espaciais. Dá pra acompanhar dados de telemetria em tempo real, gerenciar missões ativas e receber alertas automáticos quando algo sai dos parâmetros normais.

Funcionalidades

Dashboard de Telemetria — monitora seis sensores (energia, comunicação, estabilidade orbital, oxigênio, temperatura e radiação) com atualização a cada 5 segundos e indicadores visuais de status.
Alertas Automáticos — gerados quando algum sensor ultrapassa os limites definidos, classificados em INFO, WARNING e CRITICAL. Podem ser confirmados individualmente ou limpos em lote.
Gerenciamento de Missões — criação, edição e exclusão de missões, com campos de nome, destino, data, tripulantes e status (Ativa, Pausada, Concluída ou Abortada).
Formulários com Validação — todos os campos obrigatórios são validados, com feedback visual direto no campo com erro.
Configurações — atualização manual dos sensores e reset dos dados locais.

Arquitetura

Context API + useReducer para estado global sem dependências externas. AsyncStorage para persistência automática dos dados. Expo Router para navegação declarativa baseada em arquivos. Componentes visuais isolados da lógica de negócio.