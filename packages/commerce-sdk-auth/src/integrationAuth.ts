import crypto from 'crypto';
import OAuth1a from "oauth-1.0a";

export interface IntegrationAuthParams {
  consumerKey: string;
  consumerSecret: string;
}

export function getOAuthHeader({
    consumerKey,
    consumerSecret,
    }: IntegrationAuthParams): OAuth1a {
    return new OAuth1a({
        consumer: {
            key: consumerKey,
            secret: consumerSecret,
        },
        signature_method: 'HMAC-SHA256',
        hash_function: (baseString: string, key: string) => crypto.createHmac('sha256', key).update(baseString).digest('base64'),
    })
}
