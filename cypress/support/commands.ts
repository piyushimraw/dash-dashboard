// Login command using cy.session() for caching
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.session([username, password], () => {
    cy.visit('/login')
    cy.getBySel('userId').type(username)
    cy.getBySel('password').type(password)
    cy.getBySel('userLocation').type('CASFO15')
    cy.getBySel('loginLocation').select('CASFO15')
    cy.getBySel('login-button').click()
    cy.url().should('not.include', '/login')
  })
})

// Selector helpers for data-cy attributes
Cypress.Commands.add('getBySel', (selector: string, ...args) => {
  return cy.get(`[data-cy="${selector}"]`, ...args)
})

Cypress.Commands.add('getBySelLike', (selector: string, ...args) => {
  return cy.get(`[data-cy*="${selector}"]`, ...args)
})
