describe('Componente do Formulário de Contato', () => {
    beforeEach(() => {
      cy.visit('/');
      
    });
    it('Deve clicar no Botão Contato' , () => {
      cy.get('a[href*="Home#Contato"]').click()
    });

    function validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    
    describe('Teste de validação de e-mail', () => {
      it('Deve validar e-mails corretamente', () => {
        const validEmail = 'teste@exemplo.com';
        const invalidEmail = 'teste@exemplo';
    
        // Validação de um e-mail válido
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(validateEmail(validEmail)).to.be.true;
    
        // Validação de um e-mail inválido
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(validateEmail(invalidEmail)).to.be.false;
      });
    
      it('Deve validar o campo de e-mail no formulário', () => {
        cy.visit('/Home#Contato');
    
        const emailInput = 'input[name="email"]';
        const invalidEmail = 'usuario@sem-dominio';
        const validEmail = 'usuario@dominio.com';
    
        // Testa um e-mail inválido
        cy.get(emailInput).clear().type(invalidEmail);
        cy.get('button[type="submit"]').click();
        cy.contains('E-mail inválido').should('be.visible');
    
        // Testa um e-mail válido
        cy.get(emailInput).clear().type(validEmail);
        cy.get('button[type="submit"]').click();
        cy.contains('E-mail inválido').should('not.exist');
      });
    });

    
      describe('Formulário de Contato - Validação de Campo de Mensagem', () => {
        it('Não deve permitir o envio do formulário se o campo de mensagem estiver vazio', () => {
          // Visita a página onde o formulário está renderizado
          cy.visit('http://localhost:3000/Home#Contato');
      
          // Seletores dos elementos do formulário
          const nameInput = 'input[placeholder="Insira seu nome"]';
          const emailInput = 'input[placeholder="Insira seu e-mail"]';
          const messageTextarea = 'textarea[placeholder="Digite sua mensagem"]';
          const submitButton = 'button[type="submit"]';
      
          // Preenche os campos de nome e e-mail, mas deixa o campo de mensagem vazio
          cy.get(nameInput).type('João da Silva');
          cy.get(emailInput).type('joao@exemplo.com');
          cy.get(messageTextarea).clear();
      
          // Clica no botão de envio
          cy.get(submitButton).click();
      
          // Verifica que a mensagem de erro aparece
          cy.contains('A mensagem não pode ser vazia!').should('be.visible');

        });
      
        it('Deve permitir o envio do formulário quando o campo de mensagem for preenchido', () => {
          // Visita a página onde o formulário está renderizado
          cy.visit('/Home#Contato');
      
          // Seletores dos elementos do formulário
          const nameInput = 'input[placeholder="Insira seu nome"]';
          const emailInput = 'input[placeholder="Insira seu e-mail"]';
          const messageTextarea = 'textarea[placeholder="Digite sua mensagem"]';
          const submitButton = 'button[type="submit"]';
      
          // Preenche todos os campos
          cy.get(nameInput).type('João da Silva');
          cy.get(emailInput).type('joao@exemplo.com');
          cy.get(messageTextarea).type('Esta é uma mensagem válida.');
      
          // Clica no botão de envio
          cy.get(submitButton).click();
      
          // Verifica que uma mensagem de sucesso aparece
          cy.contains('Mensagem enviada com sucesso!').should('be.visible');
        });
      });
    });