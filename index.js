let isCpf = true;

document.addEventListener("DOMContentLoaded", () => {
  let identificador = document.getElementById("identificador");

  identificador.setAttribute("maxlength", 14);
  identificador.setAttribute("pattern", "(\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2})");

  document.getElementById("cnpjTips").classList.add("hidden");
});

document.getElementById("toggle").addEventListener("change", function () {
  let input = document.getElementById("identificador");
  if (this.checked) {
    isCpf = false;
    input.placeholder = "CNPJ";

    input.setAttribute(
      "pattern",
      "(\\d{2}\\.?\\d{3}\\.?\\d{3}/?\\d{4}-?\\d{2})"
    );
    input.setAttribute("maxlength", 18);

    document.getElementById("cpfTips").classList.add("hidden");
    document.getElementById("cnpjTips").classList.remove("hidden");
  } else {
    isCpf = true;
    input.placeholder = "CPF";

    input.setAttribute("pattern", "(\\d{3}.?\\d{3}\\.?\\d{3}-?\\d{2})");
    input.setAttribute("maxlength", 14);

    document.getElementById("cpfTips").classList.remove("hidden");
    document.getElementById("cnpjTips").classList.add("hidden");
  }

  formatIdentifier(input);
  input.focus();
});

function formatIdentifier(input) {
  let v = input.value;
  v = v.replace(/\D/g, "");

  if (v.length <= 11 && isCpf) {
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else if (!isCpf) {
    v = v.replace(/(\d{2})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1/$2");
    v = v.replace(/(\d{4})(\d)/, "$1-$2");
  } else {
    input.value = v.slice(0, 11);

    return formatIdentifier(input);
  }

  input.value = v;
}


function deleteRow(row) {
  let i = row.parentNode.parentNode.rowIndex;
  document.getElementById("tabela").deleteRow(i);
}

function addRow(event) {
  event.preventDefault();
  let table = document.getElementById("tabela");
  let input = document.getElementById("identificador");
  if (validateRow(input, table)) return;
  let newRow = table.insertRow(table.rows.length);
  newRow.insertCell(0).innerHTML = input.value;
  newRow.insertCell(1).innerHTML =
    '<button onclick="deleteRow(this)">Deletar</button>';
  clearInputs();
}
function validateRow(input, table) {
  let rowLength = table.rows.length;
  let result = false;
  for (i = 0; i < rowLength; i++) {
    let value = table.rows.item(i).cells[0];
    if (value.textContent == input.value) {
      result = true;
      alert("Este identificador já existe!");
      break;
    }
  }
  if(result) return result;
  let validatecnpj = input.value.replace(/[^\d]+/g, "");
  console.log(validatecnpj.length);

  if (validatecnpj.length === 14) {
    result = !cnpjValido(validatecnpj);
    if (result) alert("CNPJ não existe");
  } else {
    result = !cpfValido(validatecnpj);
    if (result) alert("CPF não existe");
  }

  return result;
}

function clearInputs() {
  document.getElementById("identificador").value = "";
}

function cnpjValido(cnpj) {
  cnpj = cnpj.replace(/[^\d]+/g, "");
  if (cnpj == "00000000000000") return false;

  let tamanhoTotal = cnpj.length - 2;
  let cnpjSemDigitos = cnpj.substring(0, tamanhoTotal);
  let digitosVerificadores = cnpj.substring(tamanhoTotal);
  let soma = 0;
  let pos = tamanhoTotal - 7;
  for (i = tamanhoTotal; i >= 1; i--) {
    soma += cnpjSemDigitos.charAt(tamanhoTotal - i) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitosVerificadores.charAt(0)) return false;

  tamanhoTotal = tamanhoTotal + 1;
  cnpjSemDigitos = cnpj.substring(0, tamanhoTotal);
  soma = 0;
  pos = tamanhoTotal - 7;
  for (i = tamanhoTotal; i >= 1; i--) {
    soma += cnpjSemDigitos.charAt(tamanhoTotal - i) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitosVerificadores.charAt(1)) return false;

  return true;
}
function cpfValido(strCPF) {
  let Soma;
  let Resto;
  Soma = 0;
  if (strCPF == "00000000000") return false;

  for (i = 1; i <= 9; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;
  if (Resto != parseInt(strCPF.substring(9, 10))) return false;

  Soma = 0;
  for (i = 1; i <= 10; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;
  if (Resto != parseInt(strCPF.substring(10, 11))) return false;
  return true;
}
