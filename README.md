# Sistema Help Desk - Controll IT

Sistema web completo de help desk com 3 níveis de acesso, desenvolvido com HTML, CSS e JavaScript puro.

## 🚀 Funcionalidades

### 🔐 Sistema de Autenticação

* **3 Níveis de Acesso:**  
   * **Usuário Padrão:** Abertura de chamados e visualização dos próprios chamados  
   * **Agente de Suporte:** Visualização de todos os chamados, alteração de status e atribuição  
   * **Administrador:** Todas as permissões + gerenciamento de usuários e relatórios

### 📋 Gestão de Chamados

* Abertura de chamados com categorias (Hardware, Software, Rede, E-mail, Outros)
* Sistema de prioridades (Baixa, Média, Alta, Crítica)
* Status de acompanhamento (Aberto, Em Andamento, Fechado)
* Atribuição de chamados para agentes de suporte
* Histórico completo de alterações

### 👥 Gerenciamento de Usuários (Admin)

* Criação e edição de usuários
* Ativação/desativação de contas
* Controle de tipos de acesso
* Relatórios de performance

### 📊 Relatórios e Analytics (Admin)

* Gráficos de chamados por status
* Análise de prioridades
* Performance dos agentes
* Tempo médio de resolução

## 🎨 Interface

* **Design Moderno:** Interface limpa e profissional
* **Totalmente Responsivo:** Funciona em desktop, tablet e mobile
* **Logomarca Controll IT:** Integrada com a identidade visual da empresa
* **Animações Suaves:** Transições e efeitos visuais modernos
* **Tema Consistente:** Paleta de cores profissional

## 🛠️ Tecnologias Utilizadas

* **HTML5:** Estrutura semântica e acessível
* **CSS3:** Estilização moderna com Grid, Flexbox e animações
* **JavaScript ES6+:** Lógica de negócio e interatividade
* **Chart.js:** Gráficos interativos para relatórios
* **Font Awesome:** Ícones profissionais
* **LocalStorage:** Persistência de dados no navegador

## 📱 Responsividade

O sistema é totalmente responsivo e se adapta a diferentes tamanhos de tela:

* **Desktop:** Layout completo com todas as funcionalidades
* **Tablet:** Interface otimizada para telas médias
* **Mobile:** Menu hambúrguer, botões maiores e layout vertical

## 🚀 Como Usar

### 1. Acesso ao Sistema

Abra o arquivo `index.html` em qualquer navegador moderno.

### 2. Credenciais de Demonstração

O sistema vem com usuários pré-configurados:

| Tipo                  | Usuário | Senha    | Funcionalidades          |
| --------------------- | ------- | -------- | ------------------------ |
| **Usuário Padrão**    | usuario | senha123 | Abertura de chamados     |
| **Agente de Suporte** | suporte | senha123 | Gestão de chamados       |
| **Administrador**     | admin   | senha123 | Todas as funcionalidades |

### 3. Fluxo de Trabalho

#### Para Usuários Padrão:

1. Faça login com suas credenciais
2. Visualize estatísticas dos seus chamados
3. Abra novos chamados preenchendo o formulário
4. Acompanhe o status dos seus chamados

#### Para Agentes de Suporte:

1. Faça login e acesse o dashboard de suporte
2. Visualize todos os chamados abertos
3. Use os filtros para organizar a visualização
4. Atribua chamados para você mesmo
5. Altere o status conforme o progresso
6. Feche chamados quando resolvidos

#### Para Administradores:

1. Acesse o dashboard administrativo
2. **Aba Chamados:** Gerencie todos os chamados do sistema
3. **Aba Usuários:** Crie e gerencie contas de usuários
4. **Aba Relatórios:** Visualize analytics e métricas

## 🔧 Personalização

### Cores e Tema

As cores podem ser alteradas no arquivo `scripts/styles.css` através das variáveis CSS:

```css
:root {
    --primary-color: #0f766e;
    --primary-light: #14b8a6;
    --secondary-color: #334155;
    /* ... outras variáveis */
}
```

### Logomarca

Para alterar a logomarca, substitua o arquivo `logo-controll-it.png` no diretório raiz.

### Funcionalidades

O código JavaScript está bem estruturado em classes, facilitando a adição de novas funcionalidades.

## 💾 Persistência de Dados

Os dados são armazenados localmente no navegador usando `localStorage`:

* **Chamados:** `helpDeskTickets`
* **Usuários:** `helpDeskUsers`
* **Usuário Logado:** `currentUser`

## 🔒 Segurança

⚠️ **Nota de Segurança:** Este é um sistema de demonstração. Para uso em produção, considere:

* Implementar autenticação com backend seguro
* Criptografar senhas
* Validar dados no servidor
* Implementar HTTPS

## 🌟 Recursos Avançados

* **Filtros Dinâmicos:** Filtre chamados por status, prioridade e usuário
* **Gráficos Interativos:** Visualizações com Chart.js
* **Modais Responsivos:** Detalhes de chamados em popups
* **Validação de Formulários:** Validação client-side
* **Estados de Loading:** Feedback visual para o usuário
* **Animações CSS:** Transições suaves entre estados

## 📞 Suporte

Para dúvidas ou sugestões sobre o sistema, entre em contato com a equipe de desenvolvimento da Controll IT.

---

**Desenvolvido com ❤️ pela Controll IT**