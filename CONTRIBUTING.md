# Contribuição

Obrigado por contribuir com o Controll IT Help Desk! Para mantermos a qualidade e consistência do projeto, siga as diretrizes abaixo.

## Fluxo de Trabalho
1. Faça um fork do repositório
2. Crie uma branch a partir de `main`:
   - `feat/nome-da-feature`
   - `fix/descricao-bug`
   - `chore/tarefa-geral`
3. Faça commits seguindo o padrão [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat: adiciona nova funcionalidade`
   - `fix: corrige bug na tela de login`
   - `chore: atualiza dependências`
4. Abra um Pull Request descrevendo claramente as mudanças
5. Aguarde revisão e feedback

## Padrões de Código
- Use `.editorconfig` para formatação consistente
- HTML/CSS/JS legíveis e organizados
- Evite código morto/comentado
- Priorize acessibilidade e responsividade

## Estrutura de Pastas
- `scripts/` para CSS/JS
- `api/` para endpoints PHP
- `tests/` para testes (HTML/PHP)
- `assets/` para imagens e estáticos

## Testes
- Adicione/atualize páginas em `tests/html` quando necessário
- Não publique páginas de teste no build de produção

## Segurança
- Não commitar segredos/credenciais
- Utilize `.env` e variáveis de ambiente

## Dúvidas
Abra uma issue com o template adequado descrevendo o contexto e os passos para reproduzir (se aplicável).
