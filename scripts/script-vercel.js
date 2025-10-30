/**
 * ========================================
 * CONTROLL IT HELP DESK - JAVASCRIPT
 * Sistema de gestão de chamados técnicos
 * ========================================
 */

// ===== CONFIGURAÇÕES E DADOS =====
const CONFIG = {
    API_BASE_URL: 'api',
    NOTIFICATION_DURATION: 3000,
    CEP_API_URL: 'https://viacep.com.br/ws',
    ANIMATION_DURATION: 300
};

// Dados simulados
let users = [
    { 
        id: 1, 
        username: 'admin', 
        password: 'admin123', 
        name: 'Administrador', 
        email: 'admin@controllit.com.br', 
        type: 'admin' 
    },
    { 
        id: 2, 
        username: 'suporte', 
        password: 'suporte123', 
        name: 'Agente de Suporte', 
        email: 'suporte@controllit.com.br', 
        type: 'support' 
    },
    { 
        id: 3, 
        username: 'usuario', 
        password: 'usuario123', 
        name: 'Usuário Padrão', 
        email: 'usuario@controllit.com.br', 
        type: 'user' 
    }
];

let tickets = [
    { 
        id: 1, 
        title: 'Problema com impressora', 
        description: 'A impressora não está funcionando', 
        status: 'aberto', 
        priority: 'media', 
        category: 'hardware', 
        userId: 3, 
        createdAt: new Date().toISOString() 
    },
    { 
        id: 2, 
        title: 'Erro no sistema', 
        description: 'Sistema apresentando erro', 
        status: 'em_andamento', 
        priority: 'alta', 
        category: 'software', 
        userId: 3, 
        createdAt: new Date().toISOString() 
    }
];

let currentUser = null;

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('🚀 Inicializando Controll IT Help Desk...');
    
    // Verificar se há usuário logado
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard(currentUser.type);
    } else {
        showPage('loginPage');
    }
    
    // Configurar event listeners
    setupEventListeners();
    
    // Carregar dados salvos
    loadSavedData();
    
    console.log('✅ Sistema inicializado com sucesso!');
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    console.log('🔧 Configurando event listeners...');
    
    // Formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Formulário de cadastro de técnicos
    const techForm = document.getElementById('technicianRegisterForm');
    if (techForm) {
        techForm.addEventListener('submit', submitTechnicianRegister);
    }
    
    // Botões de logout
    const logoutBtns = document.querySelectorAll('[id$="LogoutBtn"], [id="logoutBtn"]');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', handleLogout);
    });
    
    // Formulário de novo ticket
    const newTicketForm = document.getElementById('newTicketForm');
    if (newTicketForm) {
        newTicketForm.addEventListener('submit', handleNewTicket);
    }
    
    // Formulário de usuário
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', handleAddUser);
    }
    
    // Botão adicionar usuário
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', openUserModal);
    }
    
    // Botões de fechar modal
    const closeBtns = document.querySelectorAll('.close');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Busca de CEP
    const searchCepBtn = document.getElementById('searchCepBtn');
    if (searchCepBtn) {
        searchCepBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            searchCep();
            return false;
        });
    }
    
    // Formatação de CEP
    const zipcodeInput = document.getElementById('zipcode');
    if (zipcodeInput) {
        zipcodeInput.addEventListener('input', handleZipcodeInput);
    }
    
    // Filtros
    setupFilterListeners();
    
    // Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            switchTab(tab);
        });
    });
    
    // Navegação
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            showPage(page);
        });
    });
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    console.log('✅ Event listeners configurados!');
}

// ===== AUTENTICAÇÃO =====
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showNotification('Preencha todos os campos!', 'error');
        return;
    }
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        showDashboard(user.type);
        showNotification(`Bem-vindo, ${user.name}!`, 'success');
    } else {
        showNotification('Usuário ou senha incorretos!', 'error');
    }
}

function handleLogout() {
    console.log('🚪 Realizando logout...');
    
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    showPage('loginPage');
    showNotification('Logout realizado com sucesso!', 'success');
    
    console.log('✅ Logout concluído!');
}

// ===== NAVEGAÇÃO =====
function showDashboard(userType) {
    switch(userType) {
        case 'admin':
            showPage('adminDashboard');
            loadAdminData();
            break;
        case 'support':
            showPage('supportDashboard');
            loadSupportData();
            break;
        default:
            showPage('userDashboard');
            loadUserData();
    }
}

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        console.log(`📄 Página ativada: ${pageId}`);
        
        // Reconfigurar listeners específicos da página
        if (pageId === 'technicianRegisterPage') {
            setupTechnicianFormListeners();
        }
    }
}

// ===== TICKETS =====
function handleNewTicket(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const ticket = {
        id: tickets.length + 1,
        title: formData.get('title'),
        description: formData.get('description'),
        status: 'aberto',
        priority: formData.get('priority'),
        category: formData.get('category'),
        userId: currentUser.id,
        createdAt: new Date().toISOString()
    };
    
    tickets.push(ticket);
    saveData();
    loadTickets();
    e.target.reset();
    showNotification('Chamado criado com sucesso!', 'success');
}

function loadTickets() {
    if (!currentUser) return;
    
    const userTickets = tickets.filter(t => t.userId === currentUser.id);
    const tbody = document.getElementById('userTicketsBody');
    
    if (tbody) {
        tbody.innerHTML = userTickets.map(ticket => `
            <tr>
                <td>#${ticket.id}</td>
                <td>${ticket.title}</td>
                <td><span class="status-badge status-${ticket.status}">${getStatusText(ticket.status)}</span></td>
                <td><span class="priority-badge priority-${ticket.priority}">${getPriorityText(ticket.priority)}</span></td>
                <td>${formatDate(ticket.createdAt)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewTicket(${ticket.id})">Ver</button>
                </td>
            </tr>
        `).join('');
    }
}

// ===== USUÁRIOS =====
function handleAddUser(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const user = {
        id: users.length + 1,
        username: formData.get('name').toLowerCase().replace(/\s+/g, ''),
        password: formData.get('password'),
        name: formData.get('name'),
        email: formData.get('email'),
        type: formData.get('type')
    };
    
    users.push(user);
    saveData();
    loadUsers();
    e.target.reset();
    closeModal();
    showNotification('Usuário adicionado com sucesso!', 'success');
}

function loadUsers() {
    const tbody = document.getElementById('usersBody');
    
    if (tbody) {
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="type-badge type-${user.type}">${getTypeText(user.type)}</span></td>
                <td><span class="status-badge status-active">Ativo</span></td>
                <td>${formatDate(new Date().toISOString())}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editUser(${user.id})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Excluir</button>
                </td>
            </tr>
        `).join('');
    }
}

// ===== DASHBOARDS =====
function loadUserData() {
    if (!currentUser) return;
    
    loadSavedData();
    
    const userTickets = tickets.filter(t => t.userId === currentUser.id);
    const openTickets = userTickets.filter(t => t.status === 'aberto').length;
    const pendingTickets = userTickets.filter(t => t.status === 'em_andamento').length;
    const closedTickets = userTickets.filter(t => t.status === 'fechado').length;
    
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userOpenTickets').textContent = openTickets;
    document.getElementById('userPendingTickets').textContent = pendingTickets;
    document.getElementById('userClosedTickets').textContent = closedTickets;
    
    loadTickets();
    setupCepListeners();
}

function loadSupportData() {
    if (!currentUser) return;
    
    loadSavedData();
    
    const openTickets = tickets.filter(t => t.status === 'aberto').length;
    const assignedTickets = tickets.filter(t => t.assignedTo === currentUser.id).length;
    const inProgressTickets = tickets.filter(t => t.status === 'em_andamento').length;
    const closedTickets = tickets.filter(t => t.status === 'fechado').length;
    
    document.getElementById('supportUserName').textContent = currentUser.name;
    document.getElementById('supportOpenTickets').textContent = openTickets;
    document.getElementById('supportAssignedTickets').textContent = assignedTickets;
    document.getElementById('supportInProgressTickets').textContent = inProgressTickets;
    document.getElementById('supportClosedTickets').textContent = closedTickets;
    
    loadSupportTickets();
}

function loadAdminData() {
    if (!currentUser) return;
    
    loadSavedData();
    
    const totalTickets = tickets.length;
    const totalUsers = users.length;
    const supportUsers = users.filter(u => u.type === 'support').length;
    
    document.getElementById('adminUserName').textContent = currentUser.name;
    document.getElementById('adminTotalTickets').textContent = totalTickets;
    document.getElementById('adminTotalUsers').textContent = totalUsers;
    document.getElementById('adminSupportUsers').textContent = supportUsers;
    
    setupAdminUserFilter();
    loadAdminTickets();
    loadUsers();
}

// ===== FILTROS =====
function setupFilterListeners() {
    // Filtros do suporte
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterSupportTickets);
    }
    
    if (priorityFilter) {
        priorityFilter.addEventListener('change', filterSupportTickets);
    }
    
    // Filtros do administrador
    const adminStatusFilter = document.getElementById('adminStatusFilter');
    const adminPriorityFilter = document.getElementById('adminPriorityFilter');
    const adminUserFilter = document.getElementById('adminUserFilter');
    
    if (adminStatusFilter) {
        adminStatusFilter.addEventListener('change', filterAdminTickets);
    }
    
    if (adminPriorityFilter) {
        adminPriorityFilter.addEventListener('change', filterAdminTickets);
    }
    
    if (adminUserFilter) {
        adminUserFilter.addEventListener('change', filterAdminTickets);
    }
}

function filterSupportTickets() {
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    
    const statusValue = statusFilter ? statusFilter.value : '';
    const priorityValue = priorityFilter ? priorityFilter.value : '';
    
    let filteredTickets = [...tickets];
    
    if (statusValue) {
        filteredTickets = filteredTickets.filter(ticket => ticket.status === statusValue);
    }
    
    if (priorityValue) {
        filteredTickets = filteredTickets.filter(ticket => ticket.priority === priorityValue);
    }
    
    updateSupportTicketsTable(filteredTickets);
}

function filterAdminTickets() {
    const statusFilter = document.getElementById('adminStatusFilter');
    const priorityFilter = document.getElementById('adminPriorityFilter');
    const userFilter = document.getElementById('adminUserFilter');
    
    const statusValue = statusFilter ? statusFilter.value : '';
    const priorityValue = priorityFilter ? priorityFilter.value : '';
    const userValue = userFilter ? userFilter.value : '';
    
    let filteredTickets = [...tickets];
    
    if (statusValue) {
        filteredTickets = filteredTickets.filter(ticket => ticket.status === statusValue);
    }
    
    if (priorityValue) {
        filteredTickets = filteredTickets.filter(ticket => ticket.priority === priorityValue);
    }
    
    if (userValue) {
        filteredTickets = filteredTickets.filter(ticket => ticket.userId == userValue);
    }
    
    updateAdminTicketsTable(filteredTickets);
}

// ===== TABELAS =====
function updateSupportTicketsTable(filteredTickets) {
    const tbody = document.getElementById('supportTicketsBody');
    
    if (tbody) {
        if (filteredTickets.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">Nenhum ticket encontrado com os filtros aplicados</td></tr>';
            return;
        }
        
        tbody.innerHTML = filteredTickets.map(ticket => {
            const user = users.find(u => u.id === ticket.userId);
            return `
                <tr>
                    <td>#${ticket.id}</td>
                    <td>${ticket.title}</td>
                    <td>${user ? user.name : 'N/A'}</td>
                    <td><span class="status-badge status-${ticket.status}">${getStatusText(ticket.status)}</span></td>
                    <td><span class="priority-badge priority-${ticket.priority}">${getPriorityText(ticket.priority)}</span></td>
                    <td>${formatDate(ticket.createdAt)}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="viewTicket(${ticket.id})">Ver</button>
                        <button class="btn btn-sm btn-secondary" onclick="assignTicket(${ticket.id})">Atribuir</button>
                        <div class="btn-group" style="margin-top: 5px;">
                            <button class="btn btn-sm btn-success" onclick="changeTicketStatus(${ticket.id}, 'aberto')" ${ticket.status === 'aberto' ? 'disabled' : ''}>Abrir</button>
                            <button class="btn btn-sm btn-warning" onclick="changeTicketStatus(${ticket.id}, 'em_andamento')" ${ticket.status === 'em_andamento' ? 'disabled' : ''}>Em Andamento</button>
                            <button class="btn btn-sm btn-danger" onclick="changeTicketStatus(${ticket.id}, 'fechado')" ${ticket.status === 'fechado' ? 'disabled' : ''}>Fechar</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }
}

function updateAdminTicketsTable(filteredTickets) {
    const tbody = document.getElementById('adminTicketsBody');
    
    if (tbody) {
        if (filteredTickets.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8">Nenhum ticket encontrado com os filtros aplicados</td></tr>';
            return;
        }
        
        tbody.innerHTML = filteredTickets.map(ticket => {
            const user = users.find(u => u.id === ticket.userId);
            const assignedUser = users.find(u => u.id === ticket.assignedTo);
            return `
                <tr>
                    <td>#${ticket.id}</td>
                    <td>${ticket.title}</td>
                    <td>${user ? user.name : 'N/A'}</td>
                    <td><span class="status-badge status-${ticket.status}">${getStatusText(ticket.status)}</span></td>
                    <td><span class="priority-badge priority-${ticket.priority}">${getPriorityText(ticket.priority)}</span></td>
                    <td>${assignedUser ? assignedUser.name : 'Não atribuído'}</td>
                    <td>${formatDate(ticket.createdAt)}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="viewTicket(${ticket.id})">Ver</button>
                        <button class="btn btn-sm btn-secondary" onclick="editTicket(${ticket.id})">Editar</button>
                    </td>
                </tr>
            `;
        }).join('');
    }
}

// ===== MODAIS =====
function openUserModal() {
    const modal = document.getElementById('userModal');
    if (modal) {
        const form = document.getElementById('userForm');
        if (form) {
            form.reset();
        }
        
        const title = document.getElementById('userModalTitle');
        if (title) {
            title.textContent = 'Adicionar Usuário';
        }
        
        modal.style.display = 'block';
    }
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.style.display = 'none');
}

// ===== TABS =====
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// ===== CEP =====
function setupCepListeners() {
    const searchCepBtn = document.getElementById('searchCepBtn');
    if (searchCepBtn) {
        searchCepBtn.removeEventListener('click', searchCep);
        searchCepBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            searchCep();
            return false;
        });
    }
    
    const zipcodeInput = document.getElementById('zipcode');
    if (zipcodeInput) {
        zipcodeInput.removeEventListener('input', handleZipcodeInput);
        zipcodeInput.addEventListener('input', handleZipcodeInput);
    }
}

function handleZipcodeInput(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 8) {
        if (value.length >= 5) {
            e.target.value = value.replace(/(\d{5})(\d{0,3})/, '$1-$2');
        } else {
            e.target.value = value;
        }
        
        if (value.length === 8) {
            setTimeout(() => searchCep(), 500);
        }
    }
}

async function searchCep() {
    const zipcodeInput = document.getElementById('zipcode');
    if (!zipcodeInput) {
        showNotification('Campo de CEP não encontrado!', 'error');
        return;
    }
    
    const zipcode = zipcodeInput.value.replace(/\D/g, '');
    if (zipcode.length !== 8) {
        showNotification('CEP deve conter 8 dígitos!', 'error');
        return;
    }
    
    const searchBtn = document.getElementById('searchCepBtn');
    const originalText = searchBtn ? searchBtn.textContent : '';
    
    if (searchBtn) {
        searchBtn.textContent = 'Buscando...';
        searchBtn.disabled = true;
    }
    
    try {
        const response = await fetch(`${CONFIG.CEP_API_URL}/${zipcode}/json/`);
        const data = await response.json();
        
        if (data.erro) {
            showNotification('CEP não encontrado!', 'error');
            return;
        }
        
        // Preencher campos
        const addressInput = document.getElementById('address');
        const cityInput = document.getElementById('city');
        const stateInput = document.getElementById('state');
        
        if (addressInput) {
            let endereco = data.logradouro || '';
            if (data.complemento) endereco += ', ' + data.complemento;
            if (data.bairro) endereco += ' - ' + data.bairro;
            
            const wasReadonly = addressInput.hasAttribute('readonly');
            if (wasReadonly) addressInput.removeAttribute('readonly');
            
            addressInput.value = endereco.trim();
            addressInput.dispatchEvent(new Event('input', { bubbles: true }));
            addressInput.dispatchEvent(new Event('change', { bubbles: true }));
            
            if (wasReadonly) addressInput.setAttribute('readonly', 'readonly');
        }
        
        if (cityInput) {
            const wasReadonly = cityInput.hasAttribute('readonly');
            if (wasReadonly) cityInput.removeAttribute('readonly');
            
            cityInput.value = data.localidade || '';
            cityInput.dispatchEvent(new Event('input', { bubbles: true }));
            cityInput.dispatchEvent(new Event('change', { bubbles: true }));
            
            if (wasReadonly) cityInput.setAttribute('readonly', 'readonly');
        }
        
        if (stateInput) {
            const wasReadonly = stateInput.hasAttribute('readonly');
            if (wasReadonly) stateInput.removeAttribute('readonly');
            
            stateInput.value = data.uf || '';
            stateInput.dispatchEvent(new Event('input', { bubbles: true }));
            stateInput.dispatchEvent(new Event('change', { bubbles: true }));
            
            if (wasReadonly) stateInput.setAttribute('readonly', 'readonly');
        }
        
        showNotification('CEP encontrado e preenchido!', 'success');
        
    } catch (error) {
        console.error('Erro na busca de CEP:', error);
        showNotification('Erro ao buscar CEP. Verifique sua conexão!', 'error');
    } finally {
        if (searchBtn) {
            searchBtn.textContent = originalText;
            searchBtn.disabled = false;
        }
    }
}

// ===== MÁSCARAS =====
document.addEventListener('input', function(e) {
    const id = e.target.id || '';
    const el = e.target;
    
    // CPF
    if (id === 'tecCpf') {
        let v = el.value.replace(/\D/g, '').slice(0, 11);
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        el.value = v;
    }
    
    // CNPJ
    if (id === 'empCnpj') {
        let v = el.value.replace(/\D/g, '').slice(0, 14);
        v = v.replace(/(\d{2})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d)/, '$1/$2');
        v = v.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
        el.value = v;
    }
    
    // CEP
    if (id === 'tecCep' || id === 'empCep') {
        let v = el.value.replace(/\D/g, '').slice(0, 8);
        if (v.length > 5) v = v.replace(/(\d{5})(\d{0,3})/, '$1-$2');
        el.value = v;
    }
    
    // Telefone/Celular
    if (id === 'tecCel1' || id === 'tecCel2' || id === 'tecWhats' || id === 'tecTelFixo') {
        let v = el.value.replace(/\D/g, '').slice(0, 11);
        if (v.length <= 10) {
            v = v.replace(/(\d{2})(\d)/, '($1) $2');
            v = v.replace(/(\d{4})(\d)/, '$1-$2');
        } else {
            v = v.replace(/(\d{2})(\d)/, '($1) $2');
            v = v.replace(/(\d{5})(\d)/, '$1-$2');
        }
        el.value = v;
    }
});

// ===== CADASTRO DE TÉCNICOS =====
function setupTechnicianFormListeners() {
    const techForm = document.getElementById('technicianRegisterForm');
    if (techForm) {
        techForm.removeEventListener('submit', submitTechnicianRegister);
        techForm.addEventListener('submit', submitTechnicianRegister);
    }
}

async function submitTechnicianRegister(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const name = formData.get('name');
    const email = formData.get('email');
    const cpfRaw = (formData.get('cpf') || '').toString();
    const username = cpfRaw.replace(/\D/g, '') || (email ? email.split('@')[0] : 'tecnico');
    
    if (!name || !email || !username) {
        showNotification('Preencha nome, email e CPF.', 'error');
        return;
    }
    
    try {
        const payload = {
            name,
            email,
            username,
            naturalidade: formData.get('naturalidade') || null,
            rg: formData.get('rg') || null,
            cpf: formData.get('cpf') || null,
            data_nascimento: formData.get('data_nascimento') || null,
            genero: formData.get('genero') || null,
            nome_mae: formData.get('nome_mae') || null,
            nome_pai: formData.get('nome_pai') || null,
            cep: formData.get('cep') || null,
            endereco: formData.get('endereco') || null,
            numero: formData.get('numero') || null,
            bairro: formData.get('bairro') || null,
            cidade: formData.get('cidade') || null,
            estado: formData.get('estado') || null,
            pais: formData.get('pais') || null,
            celular1: formData.get('celular1') || null,
            celular2: formData.get('celular2') || null,
            whats: formData.get('whats') || null,
            telefone_fixo: formData.get('telefone_fixo') || null,
            chave_pix: formData.get('chave_pix') || null,
            banco: formData.get('banco') || null,
            cod_banco: formData.get('cod_banco') || null,
            agencia: formData.get('agencia') || null,
            conta: formData.get('conta') || null,
            tipo_conta: formData.get('tipo_conta') || null,
            operacao: formData.get('operacao') || null,
            favorecido: formData.get('favorecido') || null,
            emp_razao_social: formData.get('emp_razao_social') || null,
            emp_nome_fantasia: formData.get('emp_nome_fantasia') || null,
            emp_cnpj: formData.get('emp_cnpj') || null,
            emp_inscricao_estadual: formData.get('emp_inscricao_estadual') || null,
            emp_inscricao_municipal: formData.get('emp_inscricao_municipal') || null,
            emp_cep: formData.get('emp_cep') || null,
            emp_endereco: formData.get('emp_endereco') || null,
            emp_numero: formData.get('emp_numero') || null,
            emp_bairro: formData.get('emp_bairro') || null,
            emp_cidade: formData.get('emp_cidade') || null,
            emp_estado: formData.get('emp_estado') || null,
            emp_pais: formData.get('emp_pais') || null,
            emp_chave_pix: formData.get('emp_chave_pix') || null,
            emp_banco: formData.get('emp_banco') || null,
            emp_cod_banco: formData.get('emp_cod_banco') || null,
            emp_agencia: formData.get('emp_agencia') || null,
            emp_conta: formData.get('emp_conta') || null,
            emp_tipo_conta: formData.get('emp_tipo_conta') || null,
            emp_operacao: formData.get('emp_operacao') || null,
            emp_favorecido: formData.get('emp_favorecido') || null
        };
        
        const resp = await fetch(`${CONFIG.API_BASE_URL}/technicians.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const result = await resp.json();
        
        if (!resp.ok || result.success === false) {
            throw new Error(result.message || 'Erro ao cadastrar técnico');
        }
        
        showNotification('Técnico cadastrado com sucesso!', 'success');
        form.reset();
        
    } catch (err) {
        console.error(err);
        showNotification('Falha no cadastro: ' + err.message, 'error');
    }
}

// ===== FUNÇÕES AUXILIARES =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, CONFIG.NOTIFICATION_DURATION);
}

function getStatusText(status) {
    const statusMap = {
        'aberto': 'Aberto',
        'em_andamento': 'Em Andamento',
        'fechado': 'Fechado'
    };
    return statusMap[status] || status;
}

function getPriorityText(priority) {
    const priorityMap = {
        'baixa': 'Baixa',
        'media': 'Média',
        'alta': 'Alta',
        'critica': 'Crítica'
    };
    return priorityMap[priority] || priority;
}

function getCategoryText(category) {
    const categoryMap = {
        'hardware': 'Hardware',
        'software': 'Software',
        'rede': 'Rede',
        'email': 'E-mail',
        'outros': 'Outros'
    };
    return categoryMap[category] || category;
}

function getTypeText(type) {
    const typeMap = {
        'user': 'Usuário',
        'support': 'Suporte',
        'admin': 'Administrador'
    };
    return typeMap[type] || type;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function saveData() {
    localStorage.setItem('tickets', JSON.stringify(tickets));
    localStorage.setItem('users', JSON.stringify(users));
}

function loadSavedData() {
    const savedTickets = localStorage.getItem('tickets');
    const savedUsers = localStorage.getItem('users');
    
    if (savedTickets) {
        tickets = JSON.parse(savedTickets);
    }
    
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }
}

// ===== FUNÇÕES GLOBAIS =====
function viewTicket(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    
    const user = users.find(u => u.id === ticket.userId);
    const assignedUser = users.find(u => u.id === ticket.assignedTo);
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="ticket-details">
            <h4>${ticket.title}</h4>
            <p><strong>Descrição:</strong> ${ticket.description}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${ticket.status}">${getStatusText(ticket.status)}</span></p>
            <p><strong>Prioridade:</strong> <span class="priority-badge priority-${ticket.priority}">${getPriorityText(ticket.priority)}</span></p>
            <p><strong>Categoria:</strong> ${getCategoryText(ticket.category)}</p>
            <p><strong>Usuário:</strong> ${user ? user.name : 'N/A'}</p>
            <p><strong>Atribuído a:</strong> ${assignedUser ? assignedUser.name : 'Não atribuído'}</p>
            <p><strong>Data de Criação:</strong> ${formatDate(ticket.createdAt)}</p>
        </div>
    `;
    
    document.getElementById('modalTitle').textContent = `Chamado #${ticket.id}`;
    document.getElementById('ticketModal').style.display = 'block';
}

function assignTicket(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    
    ticket.assignedTo = currentUser.id;
    ticket.status = 'em_andamento';
    saveData();
    loadSupportTickets();
    showNotification('Chamado atribuído com sucesso!', 'success');
}

function changeTicketStatus(ticketId, newStatus) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) {
        showNotification('Ticket não encontrado!', 'error');
        return;
    }
    
    const validStatuses = ['aberto', 'em_andamento', 'fechado'];
    if (!validStatuses.includes(newStatus)) {
        showNotification('Status inválido!', 'error');
        return;
    }
    
    if (ticket.status === newStatus) {
        showNotification('O ticket já está com este status!', 'info');
        return;
    }
    
    ticket.status = newStatus;
    saveData();
    loadSupportTickets();
    
    const statusText = getStatusText(newStatus);
    showNotification(`Status alterado para: ${statusText}`, 'success');
}

function editTicket(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    
    const newStatus = prompt('Novo status (aberto, em_andamento, fechado):', ticket.status);
    if (newStatus && ['aberto', 'em_andamento', 'fechado'].includes(newStatus)) {
        ticket.status = newStatus;
        saveData();
        loadAdminTickets();
        showNotification('Chamado atualizado com sucesso!', 'success');
    }
}

function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const newName = prompt('Novo nome:', user.name);
    if (newName) {
        user.name = newName;
        saveData();
        loadUsers();
        showNotification('Usuário atualizado com sucesso!', 'success');
    }
}

function deleteUser(userId) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        users = users.filter(u => u.id !== userId);
        saveData();
        loadUsers();
        showNotification('Usuário excluído com sucesso!', 'success');
    }
}

function setupAdminUserFilter() {
    const userFilter = document.getElementById('adminUserFilter');
    if (userFilter) {
        userFilter.innerHTML = '<option value="">Todos os Usuários</option>';
        
        users.forEach(user => {
            if (user.type === 'user') {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = user.name;
                userFilter.appendChild(option);
            }
        });
    }
}

function loadSupportTickets() {
    filterSupportTickets();
}

function loadAdminTickets() {
    filterAdminTickets();
}

// ===== AUTO PREENCHIMENTO DE CEP =====
async function autoFillCep(cepInputId, addressMap) {
    const cepEl = document.getElementById(cepInputId);
    if (!cepEl) return;
    
    const cep = cepEl.value.replace(/\D/g, '');
    if (cep.length !== 8) return;
    
    try {
        const resp = await fetch(`${CONFIG.CEP_API_URL}/${cep}/json/`);
        const data = await resp.json();
        
        if (data.erro) return;
        
        if (addressMap.endereco) {
            document.getElementById(addressMap.endereco).value = `${data.logradouro || ''}`.trim();
        }
        if (addressMap.bairro) {
            document.getElementById(addressMap.bairro).value = `${data.bairro || ''}`.trim();
        }
        if (addressMap.cidade) {
            document.getElementById(addressMap.cidade).value = `${data.localidade || ''}`.trim();
        }
        if (addressMap.estado) {
            document.getElementById(addressMap.estado).value = `${data.uf || ''}`.trim();
        }
        if (addressMap.pais) {
            document.getElementById(addressMap.pais).value = 'Brasil';
        }
    } catch (e) {
        console.error('Erro ViaCEP:', e);
    }
}

// Configurar auto preenchimento para campos de CEP
['tecCep', 'empCep'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    
    el.addEventListener('blur', () => {
        if (id === 'tecCep') {
            autoFillCep('tecCep', { 
                endereco: 'tecEndereco', 
                bairro: 'tecBairro', 
                cidade: 'tecCidade', 
                estado: 'tecEstado', 
                pais: 'tecPais' 
            });
        } else {
            autoFillCep('empCep', { 
                endereco: 'empEndereco', 
                bairro: 'empBairro', 
                cidade: 'empCidade', 
                estado: 'empEstado', 
                pais: 'empPais' 
            });
        }
    });
});

console.log('✅ Controll IT Help Desk - JavaScript carregado com sucesso!');