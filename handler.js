'use strict';
const { promises: { readFile } } = require('fs')
class Handler {
  constructor({ rekognitionService, translatorService }) {
    this.rekognitionService = rekognitionService
    this.translatorService = translatorService
  }

  async detectImageLabels(buffer) {
    const result = await this.rekognitionService.detectLabels({
      Image: {
        Bytes: buffer
      }
    }).promise()
    const workingItems = result.Labels.filter(({ Confidence }) => Confidence > 80)
    const names = workingItems.map(({ Name }) => Name).join(', ')
    return { names, workingItems }
  }

  async translateText(text) {
    const params = {
      SourceLanguageCode: 'en',
      TargetLanguageCode: 'pt',
      Text: text
    }
    const result = await this.translatorService.translateText(params).promise()
    console.log(JSON.stringify(result))
  }

  async main(event) {
    try {
      const imageBuffer = await readFile('./images/cat.png')
      const { names, workingItems } = await this.detectImageLabels(imageBuffer)
      const texts = await this.translateText(names)
      return {
        statusCode: 200,
        body: 'Hello!'
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: 'Internal server error.'
      }
    }
  }
}

// Factory:
const aws = require('aws-sdk')
const rekognition = new aws.Rekognition()
const translator = new aws.Translate()
const handler = new Handler({
  rekognitionService: rekognition,
  translatorService: translator
})
module.exports.main = handler.main.bind(handler)
