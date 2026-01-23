describe('Login Flow', () => {
  beforeEach(() => {
    // Start fresh - clear any existing session
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
    cy.visit('/login')
  })

  it('displays login form elements', () => {
    cy.getBySel('userId').should('be.visible')
    cy.getBySel('password').should('be.visible')
    cy.getBySel('userLocation').should('be.visible')
    cy.getBySel('loginLocation').should('be.visible')
    cy.getBySel('login-button').should('be.visible')
  })

  it('successfully logs in with valid credentials', () => {
    cy.fixture('users').then((users) => {
      const { username, password, userLocation, loginLocation } = users.validUser

      cy.getBySel('userId').type(username)
      cy.getBySel('password').type(password)
      cy.getBySel('userLocation').type(userLocation)
      cy.getBySel('loginLocation').select(loginLocation)
      cy.getBySel('login-button').click()

      // Should redirect to dashboard after successful login
      cy.url().should('include', '/dashboard')
      // Should not show login error
      cy.getBySel('login-error').should('not.exist')
    })
  })

  it('shows error message with invalid credentials', () => {
    cy.fixture('users').then((users) => {
      const { username, password } = users.invalidUser

      cy.getBySel('userId').type(username)
      cy.getBySel('password').type(password)
      cy.getBySel('userLocation').type('CASFO15')
      cy.getBySel('loginLocation').select('CASFO15')
      cy.getBySel('login-button').click()

      // Should stay on login page
      cy.url().should('include', '/login')
      // Should show error message
      cy.getBySel('login-error')
        .should('be.visible')
        .and('contain', 'incorrect')
    })
  })

  it('validates required fields - shows error for empty userId', () => {
    // Submit without filling userId
    cy.getBySel('password').type('somepassword')
    cy.getBySel('userLocation').type('CASFO15')
    cy.getBySel('loginLocation').select('CASFO15')
    cy.getBySel('login-button').click()

    // Should show validation error for userId
    cy.getBySel('userId-error')
      .should('be.visible')
      .and('contain', 'required')
  })

  it('validates password minimum length', () => {
    cy.getBySel('userId').type('admin')
    cy.getBySel('password').type('12345') // Less than 6 chars
    cy.getBySel('userLocation').type('CASFO15')
    cy.getBySel('loginLocation').select('CASFO15')
    cy.getBySel('login-button').click()

    // Should show validation error for password
    cy.getBySel('password-error')
      .should('be.visible')
      .and('contain', '6 characters')
  })

  it('redirects authenticated users away from login page', () => {
    // First, log in successfully
    cy.fixture('users').then((users) => {
      const { username, password, userLocation, loginLocation } = users.validUser

      cy.getBySel('userId').type(username)
      cy.getBySel('password').type(password)
      cy.getBySel('userLocation').type(userLocation)
      cy.getBySel('loginLocation').select(loginLocation)
      cy.getBySel('login-button').click()

      cy.url().should('include', '/dashboard')

      // Try to visit login page again
      cy.visit('/login')

      // Should redirect back to dashboard (not stay on login)
      cy.url().should('include', '/dashboard')
    })
  })
})
