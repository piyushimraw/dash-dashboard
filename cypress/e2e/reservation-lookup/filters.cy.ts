describe('Reservation Filters', () => {
  beforeEach(() => {
    // Login before each test
    cy.login('counter', 'counter123')
    cy.visit('/reservation_lookup')
    // Wait for page container to load first
    cy.getBySel('reservation-lookup-page', { timeout: 15000 }).should('exist')
    // Add a small wait for React to finish mounting
    cy.wait(1000)
    // Then wait for data table
    cy.getBySel('data-table', { timeout: 15000 }).should('exist')
  })

  it('opens filter panel when filter button is clicked', () => {
    cy.viewport(1280, 720)
    cy.getBySel('filter-button').click()
    cy.getBySel('filter-start-date').should('be.visible')
    cy.getBySel('filter-end-date').should('be.visible')
    cy.getBySel('filter-status').should('be.visible')
    cy.getBySel('filter-arrival-location').should('be.visible')
  })

  it('applies date filter and shows filter chip', () => {
    cy.viewport(1280, 720)
    cy.getBySel('filter-button').click()

    // Set start date
    cy.getBySel('filter-start-date').type('2024-01-01')

    // Apply filters
    cy.getBySel('filter-apply-button').click()

    // Verify filter chip appears
    cy.getBySel('filter-chips').should('exist')
    cy.getBySel('filter-chip-startDate').should('be.visible')
  })

  it('applies status filter and shows filter chip', () => {
    cy.viewport(1280, 720)
    cy.getBySel('filter-button').click()

    // Select status
    cy.getBySel('filter-status').click()
    cy.contains('Confirmed').click()

    // Apply filters
    cy.getBySel('filter-apply-button').click()

    // Verify filter chip appears
    cy.getBySel('filter-chips').should('exist')
    cy.getBySel('filter-chip-status').should('be.visible')
  })

  it('resets all filters using Reset All button', () => {
    cy.viewport(1280, 720)
    cy.getBySel('filter-button').click()

    // Apply a filter
    cy.getBySel('filter-arrival-location').type('CCUAIR')
    cy.getBySel('filter-apply-button').click()

    // Verify chip appears
    cy.getBySel('filter-chip-arrivalLocation').should('be.visible')

    // Click reset button
    cy.getBySel('reset-filters-button').click()

    // Verify chip is gone
    cy.getBySel('filter-chips').should('not.exist')
  })

  it('removes individual filter chip', () => {
    cy.viewport(1280, 720)
    cy.getBySel('filter-button').click()

    // Apply a filter
    cy.getBySel('filter-arrival-location').type('CCUAIR')
    cy.getBySel('filter-apply-button').click()

    // Verify chip appears
    cy.getBySel('filter-chip-arrivalLocation').should('be.visible')

    // Remove the chip
    cy.getBySel('filter-chip-remove-arrivalLocation').click()

    // Verify chip is gone
    cy.getBySel('filter-chips').should('not.exist')
  })
})
