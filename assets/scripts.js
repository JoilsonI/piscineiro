$(function() {
  let dados = {};

  // Carrega o JSON
  $.getJSON('assets/data.json')
    .done(function(data) {
      dados = data;
      renderPerfil();
      renderServicos();
      renderAntesDepois();
      configWhats();
    })
    .fail(function() {
      $('.loading-app').html('<p class="text-danger p-4 text-center">Erro ao carregar dados.<br>Verifique assets/data.json</p>');
    });

  // ----- PERFIL -----
  function renderPerfil() {
    const p = dados.perfil;
    $('#fotoPerfil').attr('src', p.foto);
    $('#nomePerfil').text(p.nome);
    $('#cidadePerfil').text(p.cidade);
    $('#horarioPerfil').text(p.horario);
    document.title = p.nome + ' - Piscineiro';
    $('.loading-app').fadeOut('fast');
  }

  // ----- SERVIÇOS -----
  function renderServicos() {
    const $lista = $('#listaServicos').empty();
    dados.servicos.filter(s => s.ativo).forEach(s => {
      $lista.append(`
        <div class="card-servico">
          <img src="${s.foto}" alt="${s.nome}" loading="lazy">
          <div class="corpo">
            <h3>${s.nome}</h3>
            <p class="descricao">${s.descricao}</p>
            <p class="preco mb-0">R$ ${s.preco.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>
      `);
    });
  }

  // ----- ANTES / DEPOIS -----
  function renderAntesDepois() {
    const $lista = $('#listaAntesDepois').empty();
    dados.antes_depois.forEach(item => {
      $lista.append(`
        <div class="card-antes-depois">
          <div class="par">
            <img src="${item.antes}" alt="Antes" loading="lazy">
            <img src="${item.depois}" alt="Depois" loading="lazy">
            <span class="etiqueta antes">Antes</span>
            <span class="etiqueta depois">Depois</span>
          </div>
          <p class="legenda">${item.legenda}</p>
        </div>
      `);
    });
  }

  // ----- WHATSAPP (botão do header) -----
  function configWhats() {
    const numero = dados.perfil.whatsapp.replace(/\D/g, '');
    const msg = encodeURIComponent('Olá! Vi seu site e quero um orçamento para minha piscina.');
    $('#btnWhats').attr('href', `https://wa.me/${numero}?text=${msg}`);
  }

  // ----- FORMULÁRIO → WHATSAPP -----
  $('#formOrcamento').on('submit', function(e) {
    e.preventDefault();
    const f = {};
    $(this).serializeArray().forEach(x => f[x.name] = x.value);

    const msg =
      `🏊 *Pedido de orçamento*\n\n` +
      `👤 Nome: ${f.nome}\n` +
      `📍 Endereço: ${f.endereco}\n` +
      `⚠️ Problema: ${f.problema}\n` +
      (f.obs ? `📝 Obs: ${f.obs}\n` : '');

    const numero = dados.perfil.whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`, '_blank');
  });

  // ----- ANO NO RODAPÉ -----
  $('#ano').text(new Date().getFullYear());
});
