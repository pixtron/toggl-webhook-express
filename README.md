# toggl-webhook-express

## Install

```
npm install --save toggl-webhook
```

*Warning*: This package is native [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and does not provide a CommonJS export. If your project uses CommonJS, you'll have to [convert to ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) or use the dynamic import() function. Please don't open issues for questions regarding CommonJS / ESM.


## Usage

```ts
import express from 'express';
import { webhookHandler } from 'toggl-webhook-express';

const app = express();
const port = 3001;

app.use(express.json());

const webhook = webhookHandler({
  secretProvider: 'shhhh' // same secret as used in your webhook subscription
});

app.post('/hook/', webhook, (req, res) => {
	const { body } = req;

  console.log('valid webhook event recieved', {date: new Date(), body});
	res.json({status: 'OK'});
});
```

### Provide a secret based on incoming request

```ts
const webhook = webhookHandler({
  secretProvider: async (req: Request): Promise<string | null> => {
    // return secret based on request params (eg. based on userId)
  }
});
```

### Disable autoValidate

By default all incoming ping requests that have a `validation_code` set in the body are [validated](https://developers.track.toggl.com/docs/webhooks_start/url_endpoint_validation) by default. All other ping requests are just logged. To disable this feature set `autoValidate` to false.

```ts
const webhook = webhookHandler({
  autoValidate: false
});
```

### Provide a custom logger

```ts
import {LogFn, Logger} from 'toggl-webhook-express';

const logFn: LogFn = (msg: string, tag: string, meta: unknown): void => {
  console.log(tag, msg, meta);
}

export const logger: Logger = {
  silly: logFn,
  debug: logFn,
  notice: logFn,
  info: logFn,
  warning: logFn,
  error: logFn,
}

const webhook = webhookHandler({
  logger: logger
});
```

## Create a subscription

[toggl-webhook](https://www.npmjs.com/package/toggl-webhook) provides a node.js API wrapper for the [toggl webhook api](https://developers.track.toggl.com/docs/webhooks/subscriptions).
