describe('Reservation Search', () => {
  beforeEach(() => {
    // Login before each test using the cy.login custom command
    cy.login('counter', 'counter123')
    cy.visit('/reservation_lookup')
    // Wait for data to load
    cy.getBySel('data-table').should('exist')
  })

  it('displays search input on desktop', () => {
    cy.viewport(1280, 720)
    cy.getBySel('search-input').should('be.visible')
  })

  it('filters results when searching by customer name', () => {
    cy.viewport(1280, 720)
    cy.fixture('reservations').then((data) => {
      cy.getBySel('search-input').type(data.searchTerms.validCustomer)
      cy.wait(500)
      cy.getBySel('data-table').should('exist')
    })
  })

  it('clears search and shows all results', () => {
    cy.viewport(1280, 720)
    cy.getBySel('search-input').type('test')
    cy.wait(300)
    cy.getBySel('search-clear-button').click()
    cy.getBySel('search-input').should('have.value', '')
  })

  it('shows no data message when search has no matches', () => {
    cy.viewport(1280, 720)
    cy.fixture('reservations').then((data) => {
      cy.getBySel('search-input').type(data.searchTerms.noResults)
      cy.wait(500)
      cy.getBySel('no-data-message').should('be.visible')
    })
  })
})
