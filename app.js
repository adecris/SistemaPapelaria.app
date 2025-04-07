
import jsPDF from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm';
import { Chart } from 'https://cdn.jsdelivr.net/npm/chart.js/+esm';

const appState = {
  pedidos: [],
  clientes: [],
  produtos: [],
  filtro: '',
  status: 'todos'
};

function salvar() {
  localStorage.setItem('pedidos', JSON.stringify(appState.pedidos));
  localStorage.setItem('clientes', JSON.stringify(appState.clientes));
  localStorage.setItem('produtos', JSON.stringify(appState.produtos));
  render();
}

function carregar() {
  const p = localStorage.getItem('pedidos');
  const c = localStorage.getItem('clientes');
  const pr = localStorage.getItem('produtos');
  if (p) appState.pedidos = JSON.parse(p);
  if (c) appState.clientes = JSON.parse(c);
  if (pr) appState.produtos = JSON.parse(pr);
}

function adicionarPedido(e) {
  e.preventDefault();
  const cliente = document.getElementById('cliente').value;
  const produto = document.getElementById('produto').value;
  const valor = parseFloat(document.getElementById('valor').value);
  const status = document.getElementById('status').value;
  const dataEntrega = document.getElementById('data').value;
  const obs = document.getElementById('obs').value;
  if (!cliente || !produto || isNaN(valor)) return;
  appState.pedidos.push({ cliente, produto, valor, status, dataEntrega, obs });
  salvar();
  document.getElementById('pedido-form').reset();
}

function exportarPDF() {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Lista de Pedidos", 10, 10);
  doc.setFontSize(10);
  appState.pedidos.forEach((p, i) => {
    const y = 20 + i * 20;
    doc.text(`${p.cliente} - ${p.produto}`, 10, y);
    doc.text(`R$ ${p.valor.toFixed(2)} - ${p.status} - Entrega: ${p.dataEntrega}`, 10, y + 6);
    doc.text(`Obs: ${p.obs}`, 10, y + 12);
  });
  doc.save("pedidos.pdf");
}

function atualizarGrafico() {
  const ctx = document.getElementById('grafico').getContext('2d');
  const dados = {};
  appState.pedidos.forEach(p => {
    if (p.status === 'Pago') {
      const mes = p.dataEntrega?.substring(0, 7) || 'Sem Data';
      dados[mes] = (dados[mes] || 0) + p.valor;
    }
  });
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(dados),
      datasets: [{
        label: 'Total R$ por mês',
        data: Object.values(dados),
        backgroundColor: '#f9a8d4'
      }]
    }
  });
}

function render() {
  const lista = document.getElementById('lista-pedidos');
  lista.innerHTML = '';
  const pedidosFiltrados = appState.pedidos.filter(p =>
    (appState.filtro === '' || p.cliente.toLowerCase().includes(appState.filtro.toLowerCase())) &&
    (appState.status === 'todos' || p.status === appState.status)
  );
  pedidosFiltrados.forEach((p, i) => {
    const item = document.createElement('div');
    item.className = 'pedido';
    item.innerHTML = `
      <strong>${p.cliente}</strong> - ${p.produto} - R$${p.valor.toFixed(2)}<br>
      <small>Status: ${p.status} | Entrega: ${p.dataEntrega}</small><br>
      <small>Obs: ${p.obs}</small><br>
      <button onclick="removerPedido(${i})">Remover</button>
    `;
    lista.appendChild(item);
  });

  atualizarGrafico();
}

function removerPedido(i) {
  if (confirm("Remover este pedido?")) {
    appState.pedidos.splice(i, 1);
    salvar();
  }
}

function cadastrarCliente() {
  const nome = prompt("Nome do cliente:");
  if (nome) {
    appState.clientes.push(nome);
    salvar();
  }
}

function cadastrarProduto() {
  const nome = prompt("Nome do produto:");
  if (nome) {
    appState.produtos.push(nome);
    salvar();
  }
}

function preencherSelects() {
  const clienteSelect = document.getElementById('cliente');
  const produtoSelect = document.getElementById('produto');
  clienteSelect.innerHTML = '<option></option>';
  produtoSelect.innerHTML = '<option></option>';
  appState.clientes.forEach(c => clienteSelect.innerHTML += `<option>${c}</option>`);
  appState.produtos.forEach(p => produtoSelect.innerHTML += `<option>${p}</option>`);
}

function init() {
  document.getElementById('pedido-form').addEventListener('submit', adicionarPedido);
  document.getElementById('filtro').addEventListener('input', e => {
    appState.filtro = e.target.value;
    render();
  });
  document.getElementById('status-filtro').addEventListener('change', e => {
    appState.status = e.target.value;
    render();
  });
  document.getElementById('exportar').addEventListener('click', exportarPDF);
  document.getElementById('add-cliente').addEventListener('click', cadastrarCliente);
  document.getElementById('add-produto').addEventListener('click', cadastrarProduto);
  carregar();
  preencherSelects();
  render();
}

window.onload = init;
