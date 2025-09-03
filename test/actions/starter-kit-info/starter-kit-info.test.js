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

const action = require("../../../actions/starter-kit-info/index.js");

jest.mock("@adobe/aio-commerce-lib-auth", () => {
  const originalModule = jest.requireActual("@adobe/aio-commerce-lib-auth");
  return {
    __esModule: true,
    ...originalModule,
    getImsAuthProvider: jest.fn(),
  };
});

const { getImsAuthProvider } = require("@adobe/aio-commerce-lib-auth");

jest.mock("node-fetch");
const fetch = require("node-fetch");

describe("Given the starter kit info action", () => {
  describe("When method main is defined", () => {
    test("Then is an instance of Function", () => {
      expect(action.main).toBeInstanceOf(Function);
    });
  });
  describe("When invoked", () => {
    test("The starter kit version is included in the response", async () => {
      getImsAuthProvider.mockImplementation(() => {
        return {
          getAccessToken: () => {
            return "test-token";
          },
        };
      });

      const params = {
        OAUTH_CLIENT_ID: "OAUTH_CLIENT_ID",
        OAUTH_CLIENT_SECRET: "OAUTH_CLIENT_SECRET",
        OAUTH_TECHNICAL_ACCOUNT_ID: "example@adobe-ds.com",
        OAUTH_TECHNICAL_ACCOUNT_EMAIL: "example2@adobe-ds.com",
        OAUTH_ORG_ID: "OAUTH_ORG_ID",
        OAUTH_SCOPES: "scope1,scope2",
        IO_MANAGEMENT_BASE_URL: "https://example.com",
        IO_CONSUMER_ID: "IO_CONSUMER_ID",
        IO_PROJECT_ID: "IO_PROJECT_ID",
        IO_WORKSPACE_ID: "IO_WORKSPACE_ID",
      };

      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });
      const response = await action.main(params);

      expect(response).toHaveProperty("body.message.starter_kit_version");
    });
    test("The registrations are included in the response", async () => {
      const params = {
        OAUTH_CLIENT_ID: "OAUTH_CLIENT_ID",
        OAUTH_CLIENT_SECRET: "OAUTH_CLIENT_SECRET",
        OAUTH_TECHNICAL_ACCOUNT_ID: "example@adobe-ds.com",
        OAUTH_TECHNICAL_ACCOUNT_EMAIL: "example2@adobe-ds.com",
        OAUTH_ORG_ID: "OAUTH_ORG_ID",
        OAUTH_SCOPES: "scope1,scope2",
        IO_MANAGEMENT_BASE_URL: "https://example.com",
        IO_CONSUMER_ID: "IO_CONSUMER_ID",
        IO_PROJECT_ID: "IO_PROJECT_ID",
        IO_WORKSPACE_ID: "IO_WORKSPACE_ID",
      };
      const response = await action.main(params);

      expect(response).toHaveProperty("body.message.registrations");
    });
  });
});
