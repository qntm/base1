describe('base1 IIFE', () => {
  it('works', () => {
    cy.visit('http://localhost:3000/test-built/index.html')
    cy.contains('yo')
  })
})
