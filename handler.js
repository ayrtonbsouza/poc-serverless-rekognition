'use strict';
class Handler {
  constructor({ rekognitionService }) {
    this.rekognitionService = rekognitionService
  }

  async main(event) {
    try {
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
const handler = new Handler({
  rekognitionService = rekognition
})
module.exports.main = handler.main.bind(handler)
