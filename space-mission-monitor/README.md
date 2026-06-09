# 🛰️ Space Mission Monitor

**Central de Monitoramento de Missões Espaciais** — App Cross-Platform desenvolvido com React Native + Expo.

## 👨‍🚀 Integrantes

| Nome Completo | RM |
|---|---|
| [SEU NOME AQUI] | RM000000 |
| [NOME INTEGRANTE 2] | RM000001 |
| [NOME INTEGRANTE 3] | RM000002 |

## 📱 Descrição

Aplicativo mobile que simula uma central de controle de missões espaciais, com dashboard em tempo real, sistema de alertas automáticos, gerenciamento de missões e persistência de dados.

## ✅ Funcionalidades Implementadas

- **Dashboard** com dados de sensores: energia, comunicação, estabilidade orbital, oxigênio, temperatura e radiação
- **Alertas automáticos** disparados quando parâmetros atingem níveis críticos ou de atenção
- **Formulários com validação** completa para cadastro e edição de missões
- **Navegação entre telas** com Expo Router (tabs + stack)
- **Persistência local** com AsyncStorage (dados das missões e configurações)
- **Gerenciamento de estado global** com Context API

## 🛠️ Tecnologias

- React Native + Expo SDK 51
- Expo Router (roteamento por arquivo)
- AsyncStorage (persistência local)
- Context API + useReducer (estado global)
- TypeScript

## 🚀 Como Rodar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo Go no celular (iOS ou Android) — ou emulador configurado

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar o projeto
npm start
```

Escaneie o QR Code com o Expo Go ou pressione `a` (Android) / `i` (iOS) para abrir no emulador.

## 📁 Estrutura do Projeto

```
space-mission-monitor/
├── app/
│   ├── _layout.tsx          # Root layout (provider + stack)
│   ├── mission-form.tsx     # Tela de criação/edição de missões
│   └── (tabs)/
│       ├── _layout.tsx      # Tab bar com badge de alertas
│       ├── index.tsx        # Dashboard principal
│       ├── alerts.tsx       # Central de alertas
│       ├── missions.tsx     # Lista de missões
│       └── settings.tsx     # Configurações + form de sensores
├── components/
│   ├── AlertCard.tsx        # Card de alerta com acknowledge
│   ├── GaugeBar.tsx         # Barra de gauge com estado visual
│   ├── SectionHeader.tsx    # Cabeçalho de seção
│   └── StatusBadge.tsx      # Badge de status da missão
├── constants/
│   ├── colors.ts            # Paleta de cores tema espacial
│   └── types.ts             # TypeScript types
└── context/
    └── MissionContext.tsx   # Context API + AsyncStorage + alertas automáticos
```

## 📋 Disciplina

Cross-Platform Application Development — FIAP 2026/1 — 2ª CC
