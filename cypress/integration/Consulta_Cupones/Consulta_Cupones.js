import {Given, When, Then} from 'cypress-cucumber-preprocessor/steps'
const env = require('../config').env

var response = '';
var rut = '';

Given('Set Data', () => {
 rut = '11793067K';
})

When('Consulto Cupones', () => {
  cy.request({
    method : 'GET', 
    url : env.host + '/api/v1/ejemplo, 
    headers :{ 'Content-Type': 'application/json', 
    'x-rut' : {rut}.rut
    }
  }).then((res) =>{
    response = res
  })
})

Then('Validaciones', () => {
  expect(response).to.have.property('status', 200)
  expect(response.body).to.not.be.null
})
