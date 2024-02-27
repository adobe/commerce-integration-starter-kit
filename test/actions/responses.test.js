const { HTTP_OK } = require('../../actions/constants')
const responses = require('../../actions/responses')

describe('errorResponse', () => {
  test('(statusCode, errorMessage)', () => {
    const res = responses.errorResponse(400, 'errorMessage')
    expect(res).toEqual({
      error: {
        statusCode: 400,
        body: {
          error: 'errorMessage'
        }
      }
    })
  })
})

describe('actionErrorResponse', () => {
  test('(statusCode, errorMessage)', () => {
    const res = responses.actionErrorResponse(400, 'errorMessage')
    expect(res).toEqual({
      statusCode: 400,
      body: {
        success: false,
        error: 'errorMessage'
      }
    })
  })
})

describe('actionSuccessResponse', () => {
  test('(successMessage)', () => {
    const res = responses.actionSuccessResponse('successMessage')
    expect(res).toEqual({
      statusCode: HTTP_OK,
      body: {
        success: true,
        message: 'successMessage'
      }
    })
  })
})

describe('successResponse', () => {
  test('(type, response)', () => {
    const res = responses.successResponse('eventType', { success: true, message: 'successMessage' })
    expect(res).toEqual({
      statusCode: HTTP_OK,
      body: {
        type: 'eventType',
        response: {
          success: true,
          message: 'successMessage'
        }
      }
    })
  })
})
