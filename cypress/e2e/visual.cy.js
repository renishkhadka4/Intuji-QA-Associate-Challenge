/// <reference types="cypress" />
import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';

// Initialize the image snapshot command
addMatchImageSnapshotCommand({
  failureThreshold: 0.03,              // 3% threshold
  failureThresholdType: 'percent',     // threshold type
  customDiffConfig: { threshold: 0.1 },// sensitivity
  capture: 'viewport',                 // fullPage or viewport
});

// Optional helper to wait for full page load
Cypress.Commands.add('waitForPageLoad', () => {
  cy.document().its('readyState').should('eq', 'complete');
});

describe(' Visual Regression - Homepage', () => {
  before(() => {
    cy.visit('/');
    cy.waitForPageLoad();
    cy.wait(2000); // wait for dynamic assets
  });

  it('should match the homepage visual snapshot', () => {
    // Optional: hide dynamic content to stabilize snapshot
    // cy.get('.some-banner, .popup').invoke('hide');

    cy.matchImageSnapshot('homepage');
  });
});
