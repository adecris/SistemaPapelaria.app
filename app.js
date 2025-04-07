
const appState = {
  pedidos: [],
  filtro: '',
  status: 'todos'
};

function salvarPedidos() {
  localStorage.setItem('pedidos', JSON.stringify(appState.pedidos));
  render();
}

function carregarPedidos() {
  const dados = localStorage.getItem('pedidos');
  if (dados) appState.pedidos = JSON.parse(dados);
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
  salvarPedidos();
  document.getElementById('pedido-form').reset();
}

function removerPedido(i) {
  if (confirm("Remover este pedido?")) {
    appState.pedidos.splice(i, 1);
    salvarPedidos();
  }
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
  carregarPedidos();
  render();
}

window.onload = init;
