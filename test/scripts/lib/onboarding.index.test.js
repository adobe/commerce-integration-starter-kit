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

/** biome-ignore-all lint/suspicious/noEmptyBlockStatements: For testing purposes */

const { main } = require("../../../scripts/onboarding/index");
const ansis = require("ansis");

const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
const consoleErrorSpy = jest
  .spyOn(console, "error")
  .mockImplementation(() => {});

describe("onboarding index", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("should print an error when COMMERCE_BASE_URL, IO_PROJECT_ID, IO_CONSUMER_ID and IO_WORKSPACE_ID and EVENT_PREFIX are missing", async () => {
    // Mock process.env to simulate missing environment variables
    const mockEnv = {};
    jest.replaceProperty(process, "env", mockEnv);
    const result = await main();

    expect(result).toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalled();

    const errorCalls = consoleErrorSpy.mock.calls;
    const errorMessages = errorCalls.map((call) => call.join(" "));
    const fullErrorMessage = ansis.strip(errorMessages.join(" "));

    expect(fullErrorMessage).toContain("ENVIRONMENT_VARIABLES");
    expect(fullErrorMessage).toContain("INVALID_ENV_VARS");
    expect(fullErrorMessage).toContain(
      "Missing or invalid environment variables for Onboarding script",
    );
    expect(fullErrorMessage).toContain("Invalid environment variables");
    expect(fullErrorMessage).toContain("COMMERCE_BASE_URL");
    expect(fullErrorMessage).toContain("IO_PROJECT_ID");
    expect(fullErrorMessage).toContain("IO_CONSUMER_ID");
    expect(fullErrorMessage).toContain("IO_WORKSPACE_ID");
    expect(fullErrorMessage).toContain("EVENT_PREFIX");
  });

  test("should print an error when IMS Auth Parameters are missing", async () => {
    // Mock process.env to simulate missing environment variables
    const mockEnv = {
      COMMERCE_BASE_URL: "https://commerce.test/",
      IO_CONSUMER_ID: "test",
      IO_WORKSPACE_ID: "test",
      IO_PROJECT_ID: "test",
      EVENT_PREFIX: "test",
    };
    jest.replaceProperty(process, "env", mockEnv);
    const result = await main();

    expect(result).toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalled();

    const errorCalls = consoleErrorSpy.mock.calls;
    const errorMessages = errorCalls.map((call) => call.join(" "));
    const fullErrorMessage = ansis.strip(errorMessages.join(" "));

    expect(fullErrorMessage).toContain("IMS_AUTH_PARAMS");
    expect(fullErrorMessage).toContain("INVALID_IMS_AUTH_PARAMS");
    expect(fullErrorMessage).toContain(
      "Missing or invalid environment variables for Adobe IMS authentication.",
    );
    expect(fullErrorMessage).toContain("Invalid ImsAuthProvider configuration");
    expect(fullErrorMessage).toContain("clientId");
    expect(fullErrorMessage).toContain("clientSecrets");
    expect(fullErrorMessage).toContain("technicalAccountId");
    expect(fullErrorMessage).toContain("technicalAccountEmail");
    expect(fullErrorMessage).toContain("imsOrgId");
    expect(fullErrorMessage).not.toContain("scopes");
  });

  test("should print an error when IMS Auth clientSecrets is empty", async () => {
    // Mock process.env to simulate missing environment variables
    const mockEnv = {
      COMMERCE_BASE_URL: "https://commerce.test/",
      IO_CONSUMER_ID: "test-consumer-id",
      IO_WORKSPACE_ID: "test-workspace-id",
      IO_PROJECT_ID: "test-project-id",
      EVENT_PREFIX: "test-prefix",
      IO_MANAGEMENT_BASE_URL: "https://io-management.test/",
      OAUTH_CLIENT_ID: "test-client-id",
      OAUTH_TECHNICAL_ACCOUNT_ID: "test-tech-account-id",
      OAUTH_TECHNICAL_ACCOUNT_EMAIL: "test@example.com",
      OAUTH_ORG_ID: "test-org-id",
    };
    jest.replaceProperty(process, "env", mockEnv);
    const result = await main();

    expect(result).toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalled();

    const errorCalls = consoleErrorSpy.mock.calls;
    const errorMessages = errorCalls.map((call) => call.join(" "));
    const fullErrorMessage = ansis.strip(errorMessages.join(" "));

    expect(fullErrorMessage).toContain("IMS_AUTH_PARAMS");
    expect(fullErrorMessage).toContain("INVALID_IMS_AUTH_PARAMS");
    expect(fullErrorMessage).toContain(
      "Missing or invalid environment variables for Adobe IMS authentication.",
    );
    expect(fullErrorMessage).toContain("Invalid ImsAuthProvider configuration");
    expect(fullErrorMessage).toContain("clientSecrets");
    expect(fullErrorMessage).toContain(
      "Expected at least one client secret for IMS auth",
    );
    expect(fullErrorMessage).not.toContain("clientId");
    expect(fullErrorMessage).not.toContain("technicalAccountId");
    expect(fullErrorMessage).not.toContain("technicalAccountEmail");
    expect(fullErrorMessage).not.toContain("imsOrgId");
    expect(fullErrorMessage).not.toContain("scopes");
  });

  test("should print an error when IMS Auth clientSecrets.0 is defined but an empty string", async () => {
    // Mock process.env to simulate missing environment variables
    const mockEnv = {
      COMMERCE_BASE_URL: "https://commerce.test/",
      IO_CONSUMER_ID: "test-consumer-id",
      IO_WORKSPACE_ID: "test-workspace-id",
      IO_PROJECT_ID: "test-project-id",
      EVENT_PREFIX: "test-prefix",
      IO_MANAGEMENT_BASE_URL: "https://io-management.test/",
      OAUTH_CLIENT_ID: "test-client-id",
      OAUTH_TECHNICAL_ACCOUNT_ID: "test-tech-account-id",
      OAUTH_TECHNICAL_ACCOUNT_EMAIL: "test@example.com",
      OAUTH_ORG_ID: "test-org-id",
      OAUTH_CLIENT_SECRET: "",
    };
    jest.replaceProperty(process, "env", mockEnv);
    const result = await main();

    expect(result).toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalled();

    const errorCalls = consoleErrorSpy.mock.calls;
    const errorMessages = errorCalls.map((call) => call.join(" "));
    const fullErrorMessage = ansis.strip(errorMessages.join(" "));

    expect(fullErrorMessage).toContain("IMS_AUTH_PARAMS");
    expect(fullErrorMessage).toContain("INVALID_IMS_AUTH_PARAMS");
    expect(fullErrorMessage).toContain(
      "Missing or invalid environment variables for Adobe IMS authentication.",
    );
    expect(fullErrorMessage).toContain("Invalid ImsAuthProvider configuration");
    expect(fullErrorMessage).toContain("clientSecrets");
    expect(fullErrorMessage).toContain(
      "Expected at least one client secret for IMS auth",
    );
    expect(fullErrorMessage).not.toContain("clientId");
    expect(fullErrorMessage).not.toContain("technicalAccountId");
    expect(fullErrorMessage).not.toContain("technicalAccountEmail");
    expect(fullErrorMessage).not.toContain("imsOrgId");
    expect(fullErrorMessage).not.toContain("scopes");
  });

  test("should complete successfully when all required values are provided", async () => {
    // Mock all required dependencies for this test
    const { assertImsAuthParams } = jest.requireActual(
      "@adobe/aio-commerce-lib-auth",
    );
    jest.doMock("@adobe/aio-commerce-lib-auth", () => ({
      __esModule: true,
      getImsAuthProvider: jest.fn().mockReturnValue({
        getHeaders: jest.fn().mockResolvedValue({
          Authorization: "Bearer test-token",
          "x-api-key": "test-api-key",
        }),
      }),
      assertImsAuthParams,
    }));

    jest.doMock("../../../scripts/lib/providers", () => ({
      main: jest.fn().mockResolvedValue({
        success: true,
        result: [
          {
            key: "commerce",
            id: "COMMERCE_PROVIDER_ID",
            instanceId: "AC_INSTANCE_ID",
            label: "Commerce Provider - test",
          },
          {
            key: "backoffice",
            id: "BACKOFFICE_PROVIDER_ID",
            instanceId: "BO_INSTANCE_ID",
            label: "Backoffice Provider - test",
          },
        ],
      }),
    }));

    jest.doMock("../../../scripts/lib/metadata", () => ({
      main: jest.fn().mockResolvedValue({
        success: true,
        result: [
          {
            entity: "product",
            label: "Commerce Provider",
          },
          {
            entity: "product",
            label: "Backoffice Provider",
          },
        ],
      }),
    }));

    jest.doMock("../../../scripts/lib/registrations", () => ({
      main: jest.fn().mockResolvedValue({
        success: true,
        registrations: ["product", "customer", "order", "stock"],
      }),
    }));

    jest.doMock("../../../scripts/lib/configure-eventing", () => ({
      main: jest.fn().mockResolvedValue({
        success: true,
      }),
    }));

    jest.doMock(
      "../../../scripts/onboarding/config/workspace.json",
      () => ({
        id: "test-workspace-id",
        name: "test-workspace",
      }),
      { virtual: true },
    );

    jest.doMock(
      "../../../scripts/onboarding/config/starter-kit-registrations.json",
      () => ({
        product: ["commerce", "backoffice"],
        customer: ["commerce"],
        order: ["commerce"],
        stock: ["commerce"],
      }),
      { virtual: true },
    );

    // Set up required environment variables
    const mockEnv = {
      COMMERCE_BASE_URL: "https://commerce.test/",
      IO_CONSUMER_ID: "test-consumer-id",
      IO_WORKSPACE_ID: "test-workspace-id",
      IO_PROJECT_ID: "test-project-id",
      EVENT_PREFIX: "test-prefix",
      IO_MANAGEMENT_BASE_URL: "https://io-management.test/",
      OAUTH_CLIENT_ID: "test-client-id",
      OAUTH_CLIENT_SECRET: "test-client-secret",
      OAUTH_TECHNICAL_ACCOUNT_ID: "test-tech-account-id",
      OAUTH_TECHNICAL_ACCOUNT_EMAIL: "test@example.com",
      OAUTH_ORG_ID: "test-org-id",
    };
    jest.replaceProperty(process, "env", mockEnv);
    jest.resetModules();

    const {
      main: onboardingMain,
    } = require("../../../scripts/onboarding/index");
    const result = await onboardingMain();

    // Verify the success flow
    expect(result).toBeDefined();
    expect(result.providers).toEqual([
      {
        key: "commerce",
        id: "COMMERCE_PROVIDER_ID",
        instanceId: "AC_INSTANCE_ID",
        label: "Commerce Provider - test",
      },
      {
        key: "backoffice",
        id: "BACKOFFICE_PROVIDER_ID",
        instanceId: "BO_INSTANCE_ID",
        label: "Backoffice Provider - test",
      },
    ]);
    expect(result.registrations).toEqual([
      "product",
      "customer",
      "order",
      "stock",
    ]);

    // Verify console logs for success messages
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Starting the process of on-boarding based on your registration choices",
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Onboarding completed successfully:",
      result.providers,
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Starting the process of configuring Adobe I/O Events module in Commerce...",
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Process of configuring Adobe I/O Events module in Commerce completed successfully",
    );

    // Verify no errors were logged
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    // Clean up mocks
    jest.dontMock("../../../utils/adobe-auth");
    jest.dontMock("../../../scripts/lib/providers");
    jest.dontMock("../../../scripts/lib/metadata");
    jest.dontMock("../../../scripts/lib/registrations");
    jest.dontMock("../../../scripts/lib/configure-eventing");
    jest.dontMock("../../../scripts/onboarding/config/workspace.json");
    jest.dontMock(
      "../../../scripts/onboarding/config/starter-kit-registrations.json",
    );
  });

  test("should print an error when workspace.json file is missing", async () => {
    // Mock all required dependencies for this test
    const { assertImsAuthParams } = jest.requireActual(
      "@adobe/aio-commerce-lib-auth",
    );
    jest.doMock("@adobe/aio-commerce-lib-auth", () => ({
      __esModule: true,
      getImsAuthProvider: jest.fn().mockReturnValue({
        getHeaders: jest.fn().mockResolvedValue({
          Authorization: "Bearer test-token",
          "x-api-key": "test-api-key",
        }),
      }),
      assertImsAuthParams,
    }));

    jest.doMock("../../../scripts/lib/providers", () => ({
      main: jest.fn().mockResolvedValue({
        success: true,
        result: [
          {
            key: "commerce",
            id: "COMMERCE_PROVIDER_ID",
            instanceId: "AC_INSTANCE_ID",
            label: "Commerce Provider - test",
          },
          {
            key: "backoffice",
            id: "BACKOFFICE_PROVIDER_ID",
            instanceId: "BO_INSTANCE_ID",
            label: "Backoffice Provider - test",
          },
        ],
      }),
    }));

    jest.doMock("../../../scripts/lib/metadata", () => ({
      main: jest.fn().mockResolvedValue({
        success: true,
        result: [
          {
            entity: "product",
            label: "Commerce Provider",
          },
          {
            entity: "product",
            label: "Backoffice Provider",
          },
        ],
      }),
    }));

    jest.doMock("../../../scripts/lib/registrations", () => ({
      main: jest.fn().mockResolvedValue({
        success: true,
        registrations: ["product", "customer", "order", "stock"],
      }),
    }));

    jest.doMock("../../../scripts/lib/configure-eventing", () => ({
      main: jest.fn().mockResolvedValue({
        success: true,
      }),
    }));

    jest.doMock(
      "../../../scripts/onboarding/config/starter-kit-registrations.json",
      () => ({
        product: ["commerce", "backoffice"],
        customer: ["commerce"],
        order: ["commerce"],
        stock: ["commerce"],
      }),
      { virtual: true },
    );

    // Mock workspace.json to throw MODULE_NOT_FOUND error
    jest.doMock(
      "../../../scripts/onboarding/config/workspace.json",
      () => {
        const error = new Error(
          "Cannot find module '../../../scripts/onboarding/config/workspace.json'",
        );
        error.code = "MODULE_NOT_FOUND";
        throw error;
      },
      { virtual: true },
    );

    // Set up required environment variables
    const mockEnv = {
      COMMERCE_BASE_URL: "https://commerce.test/",
      IO_CONSUMER_ID: "test-consumer-id",
      IO_WORKSPACE_ID: "test-workspace-id",
      IO_PROJECT_ID: "test-project-id",
      EVENT_PREFIX: "test-prefix",
      IO_MANAGEMENT_BASE_URL: "https://io-management.test/",
      OAUTH_CLIENT_ID: "test-client-id",
      OAUTH_CLIENT_SECRET: "test-client-secret",
      OAUTH_TECHNICAL_ACCOUNT_ID: "test-tech-account-id",
      OAUTH_TECHNICAL_ACCOUNT_EMAIL: "test@example.com",
      OAUTH_ORG_ID: "test-org-id",
    };
    jest.replaceProperty(process, "env", mockEnv);
    jest.resetModules();

    const {
      main: onboardingMain,
    } = require("../../../scripts/onboarding/index");
    const result = await onboardingMain();

    // Verify the error flow
    expect(result).toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalled();

    const errorCalls = consoleErrorSpy.mock.calls;
    const errorMessages = errorCalls.map((call) => call.join(" "));
    const fullErrorMessage = ansis.strip(errorMessages.join(" "));

    // Verify error message contains expected content
    expect(fullErrorMessage).toContain("CONFIGURE_EVENTING");
    expect(fullErrorMessage).toContain("MISSING_WORKSPACE_FILE");
    expect(fullErrorMessage).toContain(
      'The "workspace.json" file was not found.',
    );
    expect(fullErrorMessage).toContain(
      "scripts/onboarding/config/workspace.json",
    );
    expect(fullErrorMessage).toContain(
      "https://developer.adobe.com/commerce/extensibility/events/project-setup/#download-the-workspace-configuration-file",
    );
    expect(fullErrorMessage).toContain(
      'make sure the file is named "workspace.json"',
    );

    // Verify success messages up to the point of failure
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Starting the process of on-boarding based on your registration choices",
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Onboarding completed successfully:",
      expect.any(Array),
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Starting the process of configuring Adobe I/O Events module in Commerce...",
    );

    // Verify final success message was NOT logged (because workspace.json failed)
    expect(consoleLogSpy).not.toHaveBeenCalledWith(
      "Process of configuring Adobe I/O Events module in Commerce completed successfully",
    );

    // Clean up mocks
    jest.dontMock("../../../utils/adobe-auth");
    jest.dontMock("../../../scripts/lib/providers");
    jest.dontMock("../../../scripts/lib/metadata");
    jest.dontMock("../../../scripts/lib/registrations");
    jest.dontMock("../../../scripts/lib/configure-eventing");
    jest.dontMock("../../../scripts/onboarding/config/workspace.json");
    jest.dontMock(
      "../../../scripts/onboarding/config/starter-kit-registrations.json",
    );
  });
});
