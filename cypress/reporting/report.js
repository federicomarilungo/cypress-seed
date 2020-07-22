#!/usr/bin/env node
/**
 * This script is executed by the 'yarn report' step and augments the cucumber report 
 * files of failed features with screenshots and snapshots. Mechanism was inspired by:
 * https://github.com/jcundill/cypress-cucumber-preprocessor/blob/master/fixJson.js
 * It also leverages the multiple-cucumber-html-reporter library to generate a HTML 
 * report based on the augmented cucumber report files.
 */

const report = require('multiple-cucumber-html-reporter')
const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')

const cucumberJsonDir = './cypress/test-results/cucumber-json'
const cucumberReportFileMap = {}
const cucumberReportMap = {}
const htmlReportDir = './cypress/test-results/html'

getCucumberReportMaps()
generateReport()

function getCucumberReportMaps() {
  const files = fs.readdirSync(cucumberJsonDir).filter(file => {
    return file.indexOf('.json') > -1
  })
  files.forEach(file => {
    const json = JSON.parse(
      fs.readFileSync(path.join(cucumberJsonDir, file))
    )
    if (!json[0]) { return }
    const [feature] = json[0].uri.split('/').reverse()
    cucumberReportFileMap[feature] = file
    cucumberReportMap[feature] = json
  })
}

function generateReport() {
  if (!fs.existsSync(cucumberJsonDir)) {
    console.warn(chalk.yellow(`WARNING: Folder './${cucumberJsonDir}' not found. REPORT CANNOT BE CREATED!`))
  } else {
    report.generate({
      jsonDir: cucumberJsonDir,
      reportPath: htmlReportDir,
      displayDuration: true,
      pageTitle: 'Falabella - Digital Payments',
      reportName: `QA-Test Report - ${new Date().toLocaleString()}`,
      metadata: {
        browser: {
          name: 'chrome'
        },
        device: 'VM',
        platform: {
          name: 'linux'
        }
      }
    })
  }
}