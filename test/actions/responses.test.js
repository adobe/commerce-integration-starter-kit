/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

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
