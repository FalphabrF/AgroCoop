document.addEventListener("DOMContentLoaded", async () => {
    // 1. Verificação de Segurança (Sessão)
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    // [DIAGNÓSTICO] Se o token estiver inválido, avisa antes de expulsar
    if (!token || token === "undefined" || token === "null") {
        console.warn("Token inválido encontrado:", token);
        // Alert opcional, bom para dev
        // alert("Sessão inválida. Faça login novamente.");
        
        localStorage.clear(); 
        window.location.href = "/login.html";
        return;
    }

    if (!userId) {
        localStorage.clear();
        window.location.href = "/login.html";
        return;
    }

    // 2. Setup Inicial Visual
    const welcomeMsg = document.getElementById("welcome-msg");
    const userName = localStorage.getItem("userName");
    if(welcomeMsg) welcomeMsg.innerText = `Olá, ${userName || 'Cooperado'}`;
    
    const dataHoje = document.getElementById("data-hoje");
    if(dataHoje) dataHoje.innerText = new Date().toLocaleDateString('pt-BR');

    // Funções extras (Cotações) se houver
    if(typeof atualizarCotacoes === 'function') atualizarCotacoes();

    // 3. Inicializar Interatividade (Modais e Botões)
    setupModals();
    
    // Carregar lista de armazéns dinamicamente (Logística)
    if(typeof carregarArmazensNoSelect === 'function') carregarArmazensNoSelect();

    // 4. Busca de Dados na API (BFF)
    try {
        console.log("Fetching dashboard data...");
        
        // [FIX] Rota sem ID na URL (quem define o usuário é o Token)
        const res = await fetch(`/usuarios/dashboard`, { 
             headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
        
        // [FIX] Tratamento Específico para Erros Comuns
        if (res.status === 401) {
            handleSessionExpired(); // Token expirado ou inválido no backend
            return;
        } 
        
        if (res.status === 404) {
            console.error("Erro 404: Rota não encontrada.");
            throw new Error("Erro de Configuração: Rota do Backend não encontrada.");
        }

        if (!res.ok) throw new Error("Falha ao buscar dados do dashboard");
        
        const data = await res.json();
        console.log("Payload recebido:", data);

        // Renderização dos Componentes
        if(data.financeiro) renderFinanceiro(data.financeiro);
        if(data.producao) renderProducaoKPI(data.producao);
        if(data.producao && data.producao.historico) renderGrafico(data.producao.historico);
        if(data.financeiro && data.financeiro.lancamentos_recentes) renderExtrato(data.financeiro.lancamentos_recentes);

        // Renderizar Logística e Campo
        if (data.logistica) renderLogistica(data.logistica);
        if (data.campo) renderCampo(data.campo);

    } catch (error) {
        console.error("Erro dashboard:", error);
    }
});

// [NOVO] Função centralizada para expulsar sessão inválida
function handleSessionExpired() {
    alert("Sessão expirada ou inválida. Por favor, faça login novamente.");
    localStorage.clear();
    window.location.href = "/login.html";
}

// ============================================================
// LÓGICA DE INTERAÇÃO (MODAIS E ENVIO)
// ============================================================

function setupModals() {
    const userId = localStorage.getItem("userId");

    // Referências aos Modais e Botões
    const modalAg = document.getElementById("modal-agendamento");
    const modalAt = document.getElementById("modal-atividade");
    const modalFin = document.getElementById("modal-financeiro");
    const modalProd = document.getElementById("modal-producao");

    const btnAg = document.getElementById("btn-open-agendamento");
    const btnAt = document.getElementById("btn-open-atividade");
    const btnFin = document.getElementById("btn-open-financeiro");
    const btnProd = document.getElementById("btn-open-producao");
    
    // Fechar
    document.querySelectorAll(".close-modal").forEach(span => {
        span.onclick = () => {
            if(modalAg) modalAg.classList.remove("active");
            if(modalAt) modalAt.classList.remove("active");
            if(modalFin) modalFin.classList.remove("active");
            if(modalProd) modalProd.classList.remove("active");
        };
    });

    // Abrir
    if(btnAg && modalAg) btnAg.onclick = () => modalAg.classList.add("active");
    if(btnAt && modalAt) btnAt.onclick = () => modalAt.classList.add("active");
    if(btnFin && modalFin) btnFin.onclick = () => modalFin.classList.add("active");
    if(btnProd && modalProd) btnProd.onclick = () => modalProd.classList.add("active");

    // --- ENVIOS ---

    const formAg = document.getElementById("form-agendamento");
    if(formAg) {
        formAg.addEventListener("submit", async (e) => {
            e.preventDefault();
            const armazemSelect = document.getElementById("ag-armazem");
            const payload = {
                cooperadoId: userId,
                armazemId: armazemSelect ? armazemSelect.value : null,
                data: document.getElementById("ag-data").value,
                hora: document.getElementById("ag-hora").value
            };
            await enviarDados('/operacional/agendamento', payload, modalAg);
        });
    }

    const formAt = document.getElementById("form-atividade");
    if(formAt) {
        formAt.addEventListener("submit", async (e) => {
            e.preventDefault();
            const payload = {
                cooperadoId: userId,
                tipo: document.getElementById("at-tipo").value,
                data: document.getElementById("at-data").value,
                talhao: document.getElementById("at-talhao").value,
                descricao: document.getElementById("at-desc").value
            };
            await enviarDados('/operacional/atividade', payload, modalAt);
        });
    }

    const formFin = document.getElementById("form-financeiro");
    if(formFin) {
        formFin.addEventListener("submit", async (e) => {
            e.preventDefault();
            const payload = {
                cooperadoId: userId,
                tipo: document.getElementById("fin-tipo").value,
                descricao: document.getElementById("fin-desc").value,
                valor: document.getElementById("fin-valor").value,
                data: document.getElementById("fin-data").value
            };
            await enviarDados('/financeiro/lancamento', payload, modalFin);
        });
    }

    const formProd = document.getElementById("form-producao");
    if(formProd) {
        formProd.addEventListener("submit", async (e) => {
            e.preventDefault();
            const payload = {
                cooperadoId: userId,
                tipo: document.getElementById("prod-tipo").value,
                quantidade: document.getElementById("prod-qtd").value,
                data: document.getElementById("prod-data").value,
                qualidade: document.getElementById("prod-qualidade").value
            };
            await enviarDados('/producao/registro', payload, modalProd);
        });
    }
}

// Função Genérica de Envio (AJAX) - BLINDADA CONTRA 401
async function enviarDados(endpoint, payload, modalElement) {
    try {
        const token = localStorage.getItem("token"); // Pega o token atual

        // Validação extra para tokens corrompidos
        if (!token || token === "undefined" || token === "null") {
            handleSessionExpired();
            return;
        }

        const btn = modalElement.querySelector("button[type='submit']");
        if (btn) {
            btn.innerText = "Salvando...";
            btn.disabled = true;
        }

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // A chave mestra
            },
            body: JSON.stringify(payload)
        });

        // Tratamento específico para Token Inválido/Expirado
        if (res.status === 401) {
            handleSessionExpired();
            return;
        }

        const resposta = await res.json();

        if(!res.ok) throw new Error(resposta.error || "Erro ao salvar registro");

        alert("✅ Registro salvo com sucesso!");
        
        modalElement.classList.remove("active");
        window.location.reload(); 

    } catch (error) {
        console.error(error);
        alert("Erro: " + error.message);
    } finally {
        const btn = modalElement.querySelector("button[type='submit']");
        if(btn) {
            btn.innerText = "Confirmar";
            btn.disabled = false;
        }
    }
}

// Função para buscar armazéns (Logística)
async function carregarArmazensNoSelect() {
    try {
        const token = localStorage.getItem("token");
        const select = document.getElementById("ag-armazem");
        if (!select) return;

        const res = await fetch('/operacional/armazens', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            const armazens = await res.json();
            select.innerHTML = '<option value="" disabled selected>Selecione a Unidade...</option>';
            armazens.forEach(a => {
                const option = document.createElement("option");
                option.value = a.id; 
                option.textContent = a.nome;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Erro ao carregar armazéns:", error);
    }
}

// ============================================================
// LÓGICA DE RENDERIZAÇÃO (VIEWS)
// ============================================================

function renderFinanceiro(fin) {
    const fmt = (v) => Number(v).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    const elSaldo = document.getElementById("saldo-conta");
    const elCota = document.getElementById("cota-capital");
    if(elSaldo) elSaldo.innerText = fmt(fin.saldo_atual);
    if(elCota) elCota.innerText = fmt(fin.cota_capital);
}

function renderProducaoKPI(prod) {
    const historico = prod.historico;
    const elUltima = document.getElementById("ultima-producao");
    const elDetalhe = document.getElementById("detalhe-producao");
    if (!elUltima || !elDetalhe) return;
    
    if (historico && historico.length > 0) {
        const ultima = historico[historico.length - 1];
        elUltima.innerText = `${ultima.quantidade} ${ultima.tipo === 'LEITE' ? 'L' : 'Kg'}`;
        elDetalhe.innerText = `${ultima.tipo} - ${new Date(ultima.data_entrega).toLocaleDateString()}`;
    } else {
        elUltima.innerText = "---";
        elDetalhe.innerText = "Nenhuma entrega recente";
    }
}

function renderGrafico(historico) {
    const ctx = document.getElementById('productionChart');
    if (!ctx || !historico.length) return;
    if (window.myChart instanceof Chart) window.myChart.destroy();

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: historico.map(p => new Date(p.data_entrega).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})),
            datasets: [{
                label: 'Volume de Produção',
                data: historico.map(p => p.quantidade),
                borderColor: '#2e7d32',
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function renderExtrato(lancamentos) {
    const lista = document.getElementById("lista-movimentacoes");
    if (!lista) return;
    lista.innerHTML = "";
    if (!lancamentos || lancamentos.length === 0) {
        lista.innerHTML = "<li style='padding:15px; text-align:center; color:#999'>Nenhuma movimentação recente.</li>";
        return;
    }
    lancamentos.forEach(l => {
        const isCredito = l.tipo === 'CREDITO';
        const classeCor = isCredito ? 'credito' : 'debito';
        const sinal = isCredito ? '+' : '-';
        const valorFmt = Number(l.valor).toLocaleString('pt-BR', {minimumFractionDigits: 2});
        const html = `
            <li>
                <div>
                    <span class="trans-desc">${l.descricao}</span>
                    <span class="trans-date">${new Date(l.data_movimento).toLocaleDateString()}</span>
                </div>
                <div class="trans-value ${classeCor}">
                    ${sinal} R$ ${valorFmt}
                </div>
            </li>
        `;
        lista.innerHTML += html;
    });
}

function renderLogistica(agendamentos) {
    const container = document.getElementById("lista-agendamentos");
    if (!container) return;
    container.innerHTML = "";
    if (!agendamentos || agendamentos.length === 0) {
        container.innerHTML = "<p style='color:#777; text-align:center; padding: 20px;'>Nenhum agendamento futuro.</p>";
        return;
    }
    agendamentos.forEach(item => {
        const dataParts = item.data_agendada.split('-');
        const dateObj = new Date(dataParts[0], dataParts[1] - 1, dataParts[2]); 
        const dia = dateObj.getDate();
        const mes = dateObj.toLocaleDateString('pt-BR', { month: 'short' });
        const armazem = item.Armazem ? item.Armazem.nome : 'Armazém Geral';
        const html = `
            <div class="ticket-card status-${item.status}">
                <div class="ticket-date">
                    <span class="day">${dia}</span>
                    <span class="month">${mes}</span>
                </div>
                <div class="ticket-info">
                    <h4>${armazem}</h4>
                    <p>Horário: ${item.hora_agendada}:00h • Protocolo: <strong>${item.protocolo || '---'}</strong></p>
                    <p style="font-size:0.75rem; text-transform:uppercase; margin-top:4px; font-weight:bold; color:#555">${item.status}</p>
                </div>
                <div class="ticket-qr"><span style="font-size: 1.5rem;">🏁</span></div>
            </div>
        `;
        container.innerHTML += html;
    });
}

function renderCampo(atividades) {
    const container = document.getElementById("lista-atividades");
    if (!container) return;
    container.innerHTML = "";
    if (!atividades || atividades.length === 0) {
        container.innerHTML = "<p style='color:#777; padding: 20px;'>Nenhuma atividade recente.</p>";
        return;
    }
    atividades.forEach(ativ => {
        let corDot = '#999';
        if(ativ.tipo === 'PLANTIO') corDot = '#27ae60';
        if(ativ.tipo === 'PULVERIZACAO') corDot = '#e67e22';
        if(ativ.tipo === 'COLHEITA') corDot = '#f1c40f';
        const dataParts = ativ.data_atividade.split('-');
        const dateObj = new Date(dataParts[0], dataParts[1] - 1, dataParts[2]);
        const html = `
            <div class="timeline-item">
                <div class="timeline-dot" style="border-color: ${corDot}"></div>
                <div class="timeline-content">
                    <h4>${ativ.tipo} - Talhão ${ativ.talhao || 'Geral'}</h4>
                    <span class="timeline-date">${dateObj.toLocaleDateString('pt-BR')}</span>
                    <div class="timeline-desc">${ativ.descricao}</div>
                </div>
            </div>
        `;
        container.innerHTML += html;
    });
}