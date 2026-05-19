// ELEMENTOS (centralizados - padrão profissional)
const elementos = {
  hAtual: document.getElementById("hAtual"),
  hAnterior: document.getElementById("hAnterior"),
  litros: document.getElementById("litros"),
  consumoPadrao: document.getElementById("consumoPadrao"),
  desvioInferior: document.getElementById("desvioInferior"),
  desvioSuperior: document.getElementById("desvioSuperior"),

  media: document.getElementById("media"),
  limiteInf: document.getElementById("limiteInf"),
  limiteSup: document.getElementById("limiteSup"),

  statusBox: document.getElementById("statusBox"),
  ajusteBox: document.getElementById("ajusteBox"),

  btnCalcular: document.getElementById("btnCalcular"),
  btnRecalcular: document.getElementById("btnRecalcular")
};

// EVENTOS
elementos.btnCalcular.addEventListener("click", calcular);
elementos.btnRecalcular.addEventListener("click", resetar);

// FUNÇÃO PRINCIPAL
function calcular() {
  const dados = obterDados();

  if (!validarDados(dados)) return;

  const resultado = processarCalculo(dados);

  atualizarInterface(resultado);
}

// CAPTURA DE DADOS
function obterDados() {
  return {
    hAtual: parseFloat(elementos.hAtual.value),
    hAnterior: parseFloat(elementos.hAnterior.value),
    litros: parseFloat(elementos.litros.value),
    consumoPadrao: parseFloat(elementos.consumoPadrao.value),
    desvioInferior: parseFloat(elementos.desvioInferior.value),
    desvioSuperior: parseFloat(elementos.desvioSuperior.value)
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
    ajuste = `Ajustar desvio superior para ${novo.toFixed(2)}%`;

  } else if (media < limiteInf) {
    const novo = (1 - (media / d.consumoPadrao)) * 100;

    status = "ABAIXO DO ESPERADO";
    tipo = "erro";
    ajuste = `Ajustar desvio inferior para ${novo.toFixed(2)}%`;

  } else {
    status = "DENTRO DO ESPERADO";
    tipo = "ok";
  }

  return {
    media,
    limiteInf,
    limiteSup,
    status,
    tipo,
    ajuste
  };
}

// ATUALIZA UI
function atualizarInterface(r) {
  elementos.media.textContent = r.media.toFixed(2);
  elementos.limiteInf.textContent = r.limiteInf.toFixed(2);
  elementos.limiteSup.textContent = r.limiteSup.toFixed(2);

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

// RESET
function resetar() {
  Object.values(elementos).forEach(el => {
    if (el.tagName === "INPUT") el.value = "";
  });

  elementos.media.textContent = "-";
  elementos.limiteInf.textContent = "-";
  elementos.limiteSup.textContent = "-";

  elementos.statusBox.classList.add("hidden");
  elementos.ajusteBox.classList.add("hidden");
}