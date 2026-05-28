# Controle de Média — Rede Frota

Ferramenta web para calcular e monitorar o consumo médio de combustível
de veículos da frota, comparando o resultado com um padrão esperado e
alertando quando o consumo está fora da faixa aceitável.

## Como usar

1. Abra o arquivo `index.html` diretamente no navegador
2. Preencha os campos do formulário
3. Clique em **Calcular**
4. O resultado indica se o consumo está dentro, abaixo ou acima do esperado

## Campos

| Campo                  | Descrição                                               |
|------------------------|---------------------------------------------------------|
| KM Atual               | Leitura atual do hodômetro                              |
| KM Anterior            | Leitura do hodômetro no último abastecimento            |
| Litros Abastecidos     | Volume de combustível adicionado                        |
| Consumo Padrão (km/l)  | Referência de consumo esperado para o veículo           |
| Desvio Inferior (%)    | Tolerância mínima abaixo do padrão                      |
| Desvio Superior (%)    | Tolerância máxima acima do padrão                       |

## Cálculo

```
Consumo Real    = (KM Atual − KM Anterior) ÷ Litros Abastecidos
Limite Inferior = Consumo Padrão × (1 − Desvio Inferior%)
Limite Superior = Consumo Padrão × (1 + Desvio Superior%)
```

## Tecnologias

- HTML5, CSS3, JavaScript Vanilla
- Google Fonts — Barlow / Barlow Condensed
- Sem dependências externas ou build tools

## Licença

MIT © 2026 Rede Frota
