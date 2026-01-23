/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log in a user via UI with session caching
       * @param username - User ID to log in with
       * @param password - Password for the user
       * @example cy.login('admin', 'password123')
       */
      login(username: string, password: string): Chainable<void>

      /**
       * Custom command to select DOM element by data-cy attribute
       * @param selector - The data-cy attribute value
       * @example cy.getBySel('submit-button')
       */
      getBySel(selector: string, ...args: any[]): Chainable<JQuery<HTMLElement>>

      /**
       * Custom command to select DOM element by partial data-cy attribute match
       * @param selector - Partial data-cy attribute value
       * @example cy.getBySelLike('reservation-row')
       */
      getBySelLike(selector: string, ...args: any[]): Chainable<JQuery<HTMLElement>>
    }
  }
}

export {}
