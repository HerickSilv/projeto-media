// ELEMENTOS (centralizados - padrão profissional)
const elementos = {
  hAtual:         document.getElementById("hAtual"),
  hAnterior:      document.getElementById("hAnterior"),
  litros:         document.getElementById("litros"),
  consumoPadrao:  document.getElementById("consumoPadrao"),
  desvioInferior: document.getElementById("desvioInferior"),
  desvioSuperior: document.getElementById("desvioSuperior"),

  media:          document.getElementById("media"),
  limiteInf:      document.getElementById("limiteInf"),
  limiteSup:      document.getElementById("limiteSup"),

  statusBox:      document.getElementById("statusBox"),
  ajusteBox:      document.getElementById("ajusteBox"),

  btnCalcular:    document.getElementById("btnCalcular")
};

// ─────────────────────────────────────────────
// FORMATAÇÃO AUTOMÁTICA
// ─────────────────────────────────────────────

/**
 * Campos decimais: insere vírgula antes das últimas `casas` posições.
 * Ex.: "1234" com 2 casas → "12,34"
 */
function formatarDecimal(valor, casas = 2) {
  const digitos = valor.replace(/\D/g, "");
  if (!digitos) return "";
  const padded  = digitos.padStart(casas + 1, "0");
  const intParte = padded.slice(0, -casas).replace(/^0+/, "") || "0";
  const decParte = padded.slice(-casas);
  return `${intParte},${decParte}`;
}

/**
 * Campos de KM: inteiro com separador de milhar (ponto).
 * Ex.: "48530" → "48.530"
 */
function formatarMilhar(valor) {
  const digitos = valor.replace(/\D/g, "");
  if (!digitos) return "";
  return parseInt(digitos, 10).toLocaleString("pt-BR");
}

/**
 * Converte valor exibido para float nos cálculos.
 * Suporta tanto "12,34" (decimal) quanto "48.530" (milhar inteiro).
 */
function parseDecimal(valor) {
  // Remove pontos de milhar, troca vírgula decimal por ponto
  return parseFloat(valor.replace(/\./g, "").replace(",", "."));
}

// ── Campos com separador de MILHAR (KM) ──────
["hAtual", "hAnterior"].forEach(id => {
  const campo = elementos[id];

  campo.addEventListener("input", function () {
    this.value = formatarMilhar(this.value);
  });

  campo.addEventListener("keydown", function (e) {
    if (e.key === "Backspace" && this.value.replace(/\D/g, "").length <= 1) {
      this.value = "";
    }
  });
});

// ── Campos com CASAS DECIMAIS ─────────────────
const configCasas = {
  litros:        2,   // ex.: 45,62
  consumoPadrao: 2    // ex.: 12,50
};

Object.entries(configCasas).forEach(([id, casas]) => {
  const campo = elementos[id];

  campo.addEventListener("input", function () {
    this.value = formatarDecimal(this.value, casas);
  });

  campo.addEventListener("keydown", function (e) {
    if (e.key === "Backspace" && this.value.replace(/\D/g, "").length <= 1) {
      this.value = "";
    }
  });
});

// ─────────────────────────────────────────────
// EVENTOS
// ─────────────────────────────────────────────
elementos.btnCalcular.addEventListener("click", calcular);

// ─────────────────────────────────────────────
// FUNÇÃO PRINCIPAL
// ─────────────────────────────────────────────
function calcular() {
  const dados = obterDados();
  if (!validarDados(dados)) return;
  const resultado = processarCalculo(dados);
  atualizarInterface(resultado);
}

// CAPTURA DE DADOS (converte vírgula → ponto antes do parseFloat)
function obterDados() {
  return {
    hAtual:         parseDecimal(elementos.hAtual.value),
    hAnterior:      parseDecimal(elementos.hAnterior.value),
    litros:         parseDecimal(elementos.litros.value),
    consumoPadrao:  parseDecimal(elementos.consumoPadrao.value),
    desvioInferior: parseDecimal(elementos.desvioInferior.value),
    desvioSuperior: parseDecimal(elementos.desvioSuperior.value)
  };
}

// VALIDAÇÃO
function validarDados(d) {
  if (!d.hAtual || !d.hAnterior || !d.litros || !d.consumoPadrao) {
    mostrarStatus("Preencha todos os campos obrigatórios", "erro");
    return false;
  }

  if (d.hAtual <= d.hAnterior) {
    mostrarStatus("KM atual deve ser maior que o anterior", "erro");
    return false;
  }

  if (d.litros <= 0) {
    mostrarStatus("Litros deve ser maior que zero", "erro");
    return false;
  }

  return true;
}

// PROCESSAMENTO
function processarCalculo(d) {
  const media = (d.hAtual - d.hAnterior) / d.litros;

  const limiteSup = d.consumoPadrao * (1 + d.desvioSuperior / 100);
  const limiteInf = d.consumoPadrao * (1 - d.desvioInferior / 100);

  let status = "";
  let tipo = "";
  let ajuste = null;

  if (media > limiteSup) {
    const novo = (media / d.consumoPadrao - 1) * 100;
    status = "ACIMA DO ESPERADO";
    tipo = "erro";
    ajuste = `Ajustar desvio superior para ${Math.ceil(novo)}%`;

  } else if (media < limiteInf) {
    const novo = (1 - (media / d.consumoPadrao)) * 100;
    status = "ABAIXO DO ESPERADO";
    tipo = "erro";
    ajuste = `Ajustar desvio inferior para ${Math.ceil(novo)}%`;

  } else {
    status = "DENTRO DO ESPERADO";
    tipo = "ok";
  }

  return { media, limiteInf, limiteSup, status, tipo, ajuste };
}

// ATUALIZA UI (exibe resultados com vírgula decimal)
function atualizarInterface(r) {
  elementos.media.textContent    = r.media.toFixed(2).replace(".", ",");
  elementos.limiteInf.textContent = r.limiteInf.toFixed(2).replace(".", ",");
  elementos.limiteSup.textContent = r.limiteSup.toFixed(2).replace(".", ",");

  mostrarStatus(r.status, r.tipo);

  if (r.ajuste) {
    elementos.ajusteBox.textContent = r.ajuste;
    elementos.ajusteBox.classList.remove("hidden");
  } else {
    elementos.ajusteBox.classList.add("hidden");
  }
}

// STATUS
function mostrarStatus(msg, tipo) {
  elementos.statusBox.textContent = msg;
  elementos.statusBox.className = `status ${tipo}`;
}