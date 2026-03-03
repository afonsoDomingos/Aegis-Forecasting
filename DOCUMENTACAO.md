# 🛡️ Aegis Forecasting System - Documentação

O **Sistema de Previsão Aegis** é uma plataforma avançada de análise preditiva projetada para otimizar a gestão de recursos e o planeamento estratégico. Este documento explica o funcionamento técnico e operacional do sistema.

## 🚀 1. Visão Geral
O sistema utiliza modelos matemáticos e de inteligência artificial para prever a procura futura com base em dados históricos. Ele permite que os gestores visualizem tendências e simulem cenários externos (como variações de temperatura ou eventos sazonais) para tomar decisões baseadas em dados.

## 🧠 2. Motores Preditivos (Modelos)
O sistema oferece quatro tipos de modelos, cada um adequado para diferentes situações:

*   **ARIMA (AutoRegressive Integrated Moving Average)**: Um modelo estatístico clássico que analisa a correlação dos dados consigo mesmos no passado. É ideal para séries temporais estáveis.
*   **Prophet**: Desenvolvido pelo Facebook, este modelo é excelente para lidar com sazonalidade (diária, semanal, anual) e efeitos de feriados. Ele decompõe a série em tendência e componentes sazonais.
*   **Random Forest (Regressão)**: Um modelo de Machine Learning que utiliza múltiplas "árvores de decisão" para prever valores. É muito robusto para capturar relações não-lineares complexas.
*   **LSTM (Long Short-Term Memory)**: Uma rede neural recorrente (Deep Learning) especializada em aprender dependências de longo prazo em sequências de dados. É o modelo mais sofisticado do sistema.

## 📊 3. Funcionamento do simulador
Uma das funcionalidades centrais é o **Simulador de Cenário Operacional**. Ele funciona através de:

1.  **Variáveis Externas**: O usuário pode ajustar o "Offset de Temperatura" e a "Frequência de Eventos".
2.  **Cálculo de Impacto**: O motor de previsão (`ForecastingEngine.js`) recebe esses parâmetros e aplica pesos sobre o valor base previsto.
3.  **Recomendação Estratégica**: O sistema analisa o resultado simulado e gera um conselho automático (ex: "Aumentar stock em 15%") caso detete picos de procura.

## 📈 4. Métricas de Avaliação
Para garantir a confiança, o sistema calcula três métricas em tempo real:
*   **MAE (Mean Absolute Error)**: A média do erro absoluto entre o previsto e o real.
*   **RMSE (Root Mean Square Error)**: Penaliza erros maiores, sendo útil para identificar grandes desvios.
*   **MAPE (Mean Absolute Percentage Error)**: Indica a precisão em percentagem (ex: 94% de confiança).

## 🛠️ 5. Tecnologias Utilizadas
*   **React + Vite**: Para uma interface rápida e reativa.
*   **Recharts**: Biblioteca de visualização de dados para os gráficos dinâmicos.
*   **Lucide React**: Ícones modernos e minimalistas.
*   **CSS Custom Properties**: Design system baseado em variáveis para facilitar a manutenção visual.

---
*Este sistema faz parte da Maratona de 15 Projetos.*
