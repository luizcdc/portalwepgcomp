describe('Componente do Formulário de Contato', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.get('a[href*="home#Contato"]').click()
    });

    it('Deve exibir erros de validação ao enviar campos vazios', () => {

      cy.get('button[type="submit"]').click();
  
      cy.contains('Nome é obrigatório!').should('be.visible');
      cy.contains('E-mail é obrigatório!').should('be.visible');
      cy.contains('A mensagem não pode ser vazia!').should('be.visible');
    });
  
    it('Deve validar o campo de e-mail no formulário', () => {
      
      const emailInput = 'input[placeholder="Insira seu e-mail"]';
      const invalidEmail = 'usuario@sem-dominio';
  
      // Testa um e-mail inválido
      cy.get(emailInput).as('email').clear();
      cy.get('@email').type(invalidEmail);
      cy.get('button[type="submit"]').click();
      cy.contains('E-mail inválido').should('be.visible');
    });
  
    it('Não deve permitir o envio do formulário se o campo de mensagem estiver vazio', () => {
      
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