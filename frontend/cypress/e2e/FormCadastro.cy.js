describe('Componente do Formulário de Cadastro', () => {
    beforeEach(() => {
      cy.visit('/cadastro');
      cy.fixture('usuarios').as('userData');
    });

    it('Deve validar campos obrigatórios', () => {
      // Tenta enviar o formulário vazio
      cy.get('button[type="submit"]').click();
  
      // Valida mensagens de erro
      cy.contains('O nome é obrigatório.').should('be.visible');
      cy.contains('O email é obrigatório.').should('be.visible');
      cy.contains('A senha é obrigatória e deve ter, pelo menos, 8 caracteres.').should('be.visible');
      cy.contains('Confirmação de senha é obrigatória!').should('be.visible');
    });
  
    it('Deve validar o formato do e-mail', () => {
      cy.get('button[type="submit"]').click();
      cy.get('#email').type('email-invalido');
  
      cy.contains('E-mail inválido!').should('be.visible');
    });

    it('Deve validar o formato da matrícula', () => {
      cy.get('input[value="doutorando"]').check();
      cy.get('#matricula').type('abcdefg123');
      cy.get('button[type="submit"]').click();
      cy.contains('A matrícula precisa conter apenas números e ter menos de 20 dígitos.').should('be.visible');
    });
  
    it('Deve validar o preenchimento da matrícula para perfil de doutorando', () => {
      // Seleciona o perfil de doutorando
      cy.get('input[value="doutorando"]').check();
  
      // Tenta enviar o formulário sem matrícula
      cy.get('button[type="submit"]').click();
  
      cy.contains('A matrícula é obrigatória.').should('be.visible');
    });

    it('Deve validar o preenchimento da matrícula para perfil de professor', () => {
      // Seleciona o perfil de doutorando
      cy.get('input[value="professor"]').check();
  
      // Tenta enviar o formulário sem matrícula
      cy.get('button[type="submit"]').click();
  
      cy.contains('A matrícula é obrigatória.').should('be.visible');
    });
  
    it('Deve verificar que as senhas coincidem', () => {
      cy.get('#senha').type('SenhaValida123!');
      cy.get('#confirmaSenha').type('OutraSenha123!');
      cy.get('button[type="submit"]').click();
  
      cy.contains('As senhas não conferem!').should('be.visible');
    });
  
    it('Deve cadastrar um usuário Doutorando com sucesso', function() {
      const { doutorando } = this.userData;
      cy.get('#nome').type(doutorando.nome);
      cy.get(`input[value="${doutorando.perfil}"]`).check();
      cy.get('#matricula').type(doutorando.matricula);
      cy.get('#email').type(doutorando.email);
      cy.get('#senha').type(doutorando.senha);
      cy.get('#confirmaSenha').type(doutorando.senha);
  
      cy.get('button[type="submit"]').click();

      cy.contains('Cadastro realizado com sucesso!').should('be.visible');
      // Checando se foi redirecionado para a página de Login
      cy.url().should('include', '/login');
    });
  
    it('Deve cadastrar um usuário Professor com sucesso', function() {
      const { professor } = this.userData;
      cy.get('#nome').type(professor.nome);
      cy.get(`input[value="${professor.perfil}"]`).check();
      cy.get('#matricula').type(professor.matricula);
      cy.get('#email').type(professor.email);
      cy.get('#senha').type(professor.senha);
      cy.get('#confirmaSenha').type(professor.senha);
  
      cy.get('button[type="submit"]').click();

      cy.contains('Cadastro realizado com sucesso!').should('be.visible');
      cy.url().should('include', '/login');
    });
  
    it('Deve cadastrar um usuário Ouvinte com sucesso', function() {
      const { ouvinte } = this.userData;
      cy.get('#nome').type(ouvinte.nome);
      cy.get(`input[value="${ouvinte.perfil}"]`).check();
      cy.get('#email').type(ouvinte.email);
      cy.get('#senha').type(ouvinte.senha);
      cy.get('#confirmaSenha').type(ouvinte.senha);
  
      cy.get('button[type="submit"]').click();

      cy.contains('Cadastro realizado com sucesso!').should('be.visible');
      cy.url().should('include', '/login');
    });
  });
  