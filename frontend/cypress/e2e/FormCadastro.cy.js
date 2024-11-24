describe('Componente do Formulário de Cadastro', () => {
    beforeEach(() => {
      cy.visit('/Cadastro');
      cy.fixture('usuarios').as('userData');
    });
    //TO-DO: descomentar testes abaixo após resolução do 'bug'
    // it('Deve validar campos obrigatórios e regras do formulário', () => {
    //   // Tenta enviar o formulário vazio
    //   cy.get('button[type="submit"]').click();
  
    //   // Valida mensagens de erro
    //   cy.contains('Nome é obrigatório!').should('be.visible');
    //   cy.contains('A escolha do perfil é obrigatória!').should('be.visible');
    //   cy.contains('E-mail é obrigatório!').should('be.visible');
    //   cy.contains('Senha é obrigatória!').should('be.visible');
    //   cy.contains('Confirmação de senha é obrigatória!').should('be.visible');
    // });
  
    // it('Deve validar o formato do e-mail', () => {
    //   cy.get('#email').type('email-invalido');
    //   cy.get('button[type="submit"]').click();
  
    //   cy.contains('E-mail inválido!').should('be.visible');
    // });

    it('Deve validar o formato da matrícula', () => {
      cy.get('input[value="doutorando"]').check();
      cy.get('#matricula').type('abcdefg123');
      cy.get('button[type="submit"]').click();
      cy.contains('A matrícula precisa conter apenas números e ter exatamente 10 dígitos.').should('be.visible');
    });
  
    it('Deve validar o preenchimento da matrícula para perfis de doutorandos', () => {
      // Seleciona o perfil de doutorando
      cy.get('input[value="doutorando"]').check();
  
      // Tenta enviar o formulário sem matrícula
      cy.get('button[type="submit"]').click();
  
      cy.contains('A matrícula precisa ser preenchida corretamente!').should('be.visible');
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
      //TO-DO: descomentar a linha abaixo quando o toast de sucesso for implementado
      // cy.contains('Cadastro realizado com sucesso!').should('be.visible');
      // Checando se foi redirecionado para a página de Login
      cy.url().should('include', '/Login');
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
      //TO-DO: descomentar a linha abaixo quando o toast de sucesso for implementado
      // cy.contains('Cadastro realizado com sucesso!').should('be.visible');
      cy.url().should('include', '/Login');
    });
  
    it('Deve cadastrar um usuário Ouvinte com sucesso', function() {
      const { ouvinte } = this.userData;
      cy.get('#nome').type(ouvinte.nome);
      cy.get(`input[value="${ouvinte.perfil}"]`).check();
      cy.get('#email').type(ouvinte.email);
      cy.get('#senha').type(ouvinte.senha);
      cy.get('#confirmaSenha').type(ouvinte.senha);
  
      cy.get('button[type="submit"]').click();
      //TO-DO: descomentar a linha abaixo quando o toast de sucesso for implementado
      // cy.contains('Cadastro realizado com sucesso!').should('be.visible');
      cy.url().should('include', '/Login');
    });
  });
  