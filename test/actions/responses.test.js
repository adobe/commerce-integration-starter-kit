const { HTTP_OK, HTTP_BAD_REQUEST } = require('../../actions/constants')
const responses = require('../../actions/responses')

describe('Given responses file', () => {
  describe('When method errorResponse is called', () => {
    test('Then returns error response', () => {
      const res = responses.errorResponse(HTTP_BAD_REQUEST, 'errorMessage')
      expect(res).toEqual({
        error: {
          statusCode: HTTP_BAD_REQUEST,
          body: {
            error: 'errorMessage'
          }
        }
      })
    })
  })

  describe('When method actionErrorResponse is called', () => {
    test('Then returns action error response', () => {
      const res = responses.actionErrorResponse(HTTP_BAD_REQUEST,
        'errorMessage')
      expect(res).toEqual({
        statusCode: HTTP_BAD_REQUEST,
        body: {
          success: false,
          error: 'errorMessage'
        }
      })
    })
  })

  describe('When method actionSuccessResponse is called', () => {
    test('Then returns action success response', () => {
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

  describe('When method successResponse is called', () => {
    test('Then returns success response', () => {
      const res = responses.successResponse('eventType',
        { success: true, message: 'successMessage' })
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
})
