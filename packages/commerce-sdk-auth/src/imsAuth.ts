/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

// @ts-ignore
import { ClientCredentials } from 'simple-oauth2';

export interface ImsAuthParams {
  host?: string;
  clientId: string;
  clientSecret: string;
  scopes: Array<string>;
}

interface ImsTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: string;
}

/**
 * Generate access token to connect with Adobe tools (e.g. IO Events)
 *
 * @param {object} params includes env parameters
 * @returns {Promise<ImsTokenResponse>} returns the access token
 * @throws {Error} in case of any failure
 */
export async function getImsAccessToken({
  clientId,
  clientSecret,
  host = 'https://ims-na1.adobelogin.com',
  scopes,
}: ImsAuthParams): Promise<ImsTokenResponse> {

  const config = {
    client: {
      id: clientId,
      secret: clientSecret,
    },
    auth: {
      tokenHost: host,
      tokenPath: '/ims/token/v3',
    },
    options: {
      bodyFormat: 'form',
      authorizationMethod: 'body',
    },
  };

  const client = new ClientCredentials(config);

  const tokenParams = {
    scope: scopes,
  };

  try {
    const accessToken = await client.getToken(tokenParams);
    return accessToken.token;
  } catch (error) {
    throw new Error(`Unable to get access token ${error.message}`);
  }
}
