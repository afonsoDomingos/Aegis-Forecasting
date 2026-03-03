# 🛡️ Aegis Moçambique - Sistema Inteligente de Previsão

## 🌟 O que é o Aegis?
O **Aegis Moçambique** é uma plataforma de análise preditiva de última geração, desenvolvida especificamente para o contexto empresarial e industrial moçambicano. Utilizando algoritmos avançados de Inteligência Artificial e Machine Learning, o sistema transforma dados históricos em insights estratégicos para o futuro.

## 🚀 O que o Sistema faz?
O sistema atua como um "cérebro digital" para gestores, realizando as seguintes funções:
1.  **Análise de Séries Temporais**: Processa dados históricos de consumo ou vendas.
2.  **Previsão Multi-Modelo**: Executa simultaneamente quatro modelos de IA (ARIMA, Prophet, Random Forest e LSTM) para encontrar a tendência mais precisa.
3.  **Simulação de Cenários**: Permite ajustar variáveis como clima (ondas de calor) e eventos locais (feriados nacionais) para ver como eles impactarão a procura.
4.  **Recomendações Dinâmicas**: Gera alertas automáticos sobre stock e logística baseados em eventos específicos de Moçambique.

## 💡 O que ele Resolve? (Problemas Solucionados)
*   **Rutura de Stock**: Evita que empresas fiquem sem produtos em momentos críticos (como o período da Ide ou Natal).
*   **Desperdício de Recursos**: Previne o excesso de inventário, economizando capital de giro.
*   **Incerteza Climática**: Ajuda a prever o impacto de ondas de calor no consumo de energia e conservação de produtos, algo vital para o clima tropical de Moçambique.
*   **Tomada de Decisão Lenta**: Substitui o "palpite" por estatísticas exatas em poucos segundos.

## 🛠️ Tecnologias Utilizadas
*   **Frontend**: React 19 + Vite (Rápido e responsivo).
*   **Backend**: Node.js + Express (Processamento de API).
*   **Base de Dados**: MongoDB Atlas (Cloud database para armazenamento em tempo real).
*   **Visualização**: Recharts (Gráficos interativos).

## 🌍 Adaptação para Moçambique
*   **Moeda**: Todos os cálculos e visualizações utilizam o **Metical (MT)**.
*   **Contexto Local**: Monitorização de eventos como o "Dia da Revolução" (25 de Setembro) e outras datas nacionais que afetam o comércio.
*   **Clima**: Calibrado para os padrões térmicos do país (Alertas do INAM simulados).

---
### 📖 Guia de Documentação
Para detalhes técnicos sobre os modelos matemáticos, consulte:
👉 **[DOCUMENTACAO.md](./DOCUMENTACAO.md)**

### ⚙️ Como Instalar e Rodar
1. Clone o repositório.
2. Instale as dependências: `npm install`.
3. Configure o seu `.env` com a URI do MongoDB.
4. Inicie o backend: `npm run server`.
5. Em outro terminal, inicie o frontend: `npm run dev`.

---
*Desenvolvido como projeto de destaque na Maratona de 15 Projetos.*
