describe('Componente do Formulário de Alterar Senha', () => {
  beforeEach(() => {
    const userId = '33f8090a-8064-44b9-8406-d84ec3edae8a'; // substituir por ID de um usuário válido
    cy.generateJwtToken(userId).then((token) => {
      cy.visit(`/alterar-senha/${token}`);
    });
  });

  it('Deve exibir mensagens de erro para campos obrigatórios vazios', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Senha é obrigatória!');
    cy.contains('Confirmação de senha é obrigatória!');
  });

  it('Deve exibir mensagem de erro se as senhas não coincidirem', () => {
    cy.get('#senha').type('SenhaSegura123!');
    cy.get('#confirmaSenha').type('SenhaDiferente123!');
    cy.get('button[type="submit"]').click();
    cy.contains('As senhas não conferem!');
  });

  it('Deve exibir erros para senha abaixo do comprimento mínimo', () => {
    cy.get('#senha').type('12345');
    cy.get('#confirmaSenha').type('12345');
    cy.get('button[type="submit"]').click();
    cy.contains('A senha deve ter no mínimo 8 caracteres.');
  });

  it('Deve exibir ícones de validação para os requisitos de senha', () => {
    cy.get('#senha').type('senhafraca');
    cy.get('.list-title.text-success').should('have.length', 2); // Exemplo baseado em 3 requisitos, 2 atendidos
    cy.get('.list-title.text-danger').should('have.length', 1); // 1 requisito não atendido
  });

  it('Deve redefinir senha com sucesso com token válido', () => {
    cy.get('#senha').type('NovaSenhaSegura123');
    cy.get('#confirmaSenha').type('NovaSenhaSegura123');
    cy.get('button[type="submit"]').click();

    // Checando se foi redirecionado para a página de Login
    cy.url().should('include', '/login');
    cy.contains('Senha alterada com sucesso').should('be.visible');
  });

  it('Deve exibir erro para token inválido ou expirado', () => {
    cy.visit('/alterar-senha/invalidToken');

    cy.get('#senha').type('NovaSenhaSegura123!');
    cy.get('#confirmaSenha').type('NovaSenhaSegura123!');
    cy.get('button[type="submit"]').click();

    cy.contains('Token inválido ou expirado.').should('be.visible');
  });

});