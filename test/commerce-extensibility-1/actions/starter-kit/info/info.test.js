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

import * as action from "#src/starter-kit/info/index";

describe("Given the starter kit info action", () => {
  describe("When method main is defined", () => {
    test("Then is an instance of Function", () => {
      expect(action.main).toBeInstanceOf(Function);
    });
  });
  describe("When invoked", () => {
    test("Then the starter kit version is included in the response", async () => {
      const response = await action.main({});
      expect(response).toHaveProperty("body.message.starter_kit_version");
    });
    test("Then the registrations are included in the response", async () => {
      const response = await action.main({});
      expect(response).toHaveProperty("body.message.registrations");
    });
  });
});
