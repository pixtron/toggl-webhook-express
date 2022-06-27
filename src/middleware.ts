import { createHmac, timingSafeEqual } from 'node:crypto';
import { Request, RequestHandler } from 'express';

import { SecretProvider, WebhookHandlerOptions, WebhookEvent } from './types.js';
import { logger as defaultLogger } from './logger.js';

const allowedAlgorithms = ['sha256']
const LOG_TAG = 'TOGGL_WEBHOOK';

const validateRequestSignature = (req: Request, secret: string | null): boolean => {
  if (typeof secret !== 'string') return false;

  const webhookSignature = req.headers['x-webhook-signature-256'];

	if (!webhookSignature || typeof webhookSignature !== 'string') return false;

	const [algorithm, signature] = webhookSignature.split('=');

	if (!algorithm || !allowedAlgorithms.includes(algorithm) || !signature) return false;

  const checksum = Buffer.from(signature, 'utf8');
	const digest = Buffer.from(
		createHmac(algorithm, secret).update(JSON.stringify(req.body)).digest('hex'),
		'utf8'
	);

	return (checksum.length === digest.length && timingSafeEqual(checksum, digest));
}

const validateRequestBody = (body: WebhookEvent): boolean => {
  return !(!body || !body.subscription_id || !body.payload || !body.metadata);
}

const getSecret = async (
  req: Request,
  provider: SecretProvider
): Promise<string | null> => {
  if (typeof provider === 'string') return provider;

  return provider(req);
}

const webhookHandler = (
  options: WebhookHandlerOptions
): RequestHandler<{[key: string]: string}, unknown, WebhookEvent> => {
  const {
    secretProvider,
    autoValidate = true,
    logger = defaultLogger
  } = options;

  if (!secretProvider) throw new Error('No secretProvider passed');

  return async (req, res, next) => {
    const { body } = req;

    if (!validateRequestBody(body)) {
      logger.warning('Invalid request body sending 400', LOG_TAG, body);
      res.status(400).send('Bad Request');
      return;
    }

    const secret = await getSecret(req, secretProvider);

    if (!validateRequestSignature(req, secret)) {
      logger.warning('Invalid signature', LOG_TAG, { body: req.body, headers: req.headers });
      res.status(403).send('Forbidden');
      return;
    }

    if (autoValidate && body.payload === 'ping') {
      if (body.validation_code) {
        logger.info('Ping with validation code recieved. Validating subscription',
          LOG_TAG,
          body
        );

        res.json({ validation_code: body.validation_code });
      } else {
        logger.info('Ping recieved', LOG_TAG, body);

        res.json({ status: 'OK' });
      }
    } else {
      next();
    }
  };
}

export {
  webhookHandler
}
