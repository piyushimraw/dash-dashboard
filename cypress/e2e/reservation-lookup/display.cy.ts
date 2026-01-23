describe('Reservation Display', () => {
  beforeEach(() => {
    // Login before each test
    cy.login('counter', 'counter123')
    cy.visit('/reservation_lookup')
  })

  it('displays page title correctly', () => {
    cy.viewport(1280, 720)
    cy.getBySel('page-title').should('be.visible')
    cy.getBySel('page-title').should('contain', 'Reservation Search Results')
  })

  it('displays data table with results', () => {
    cy.viewport(1280, 720)
    cy.getBySel('data-table').should('exist')
    cy.getBySel('data-table-body').should('exist')
  })

  it('displays reservation data in table format on desktop', () => {
    cy.viewport(1280, 720)
    cy.getBySel('data-table').should('be.visible')
    // Wait for data to load
    cy.getBySel('data-table-body').find('tr').should('have.length.greaterThan', 0)
  })

  it('displays reservation data in card format on mobile', () => {
    cy.viewport(375, 667)
    cy.getBySel('data-table').should('exist')
    // Wait for data to load and verify cards exist
    cy.getBySelLike('data-card').should('have.length.greaterThan', 0)
  })

  it('shows loading state while fetching data', () => {
    cy.viewport(1280, 720)
    // Intercept the API call to simulate loading
    cy.intercept('GET', '**/rent-vehicle/list', (req) => {
      req.reply((res) => {
        res.delay = 1000 // Delay response to see loading state
        return res
      })
    }).as('getData')

    cy.visit('/reservation_lookup')

    // Should show loading skeleton initially
    cy.getBySel('table-loading').should('exist')

    // Wait for request and verify data loads
    cy.wait('@getData')
    cy.getBySel('data-table').should('exist')
  })

  it('navigates to reservation lookup page after login', () => {
    cy.viewport(1280, 720)
    // Already logged in via beforeEach
    cy.getBySel('reservation-lookup-page').should('exist')
    cy.url().should('include', '/reservation_lookup')
  })
})
