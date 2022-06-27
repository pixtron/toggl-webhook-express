# toggl-webhook-express

## Install

```
npm install --save toggl-webhook
```

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
import { Logger } from 'toggl-webhook-express';

class MyLogger implements Logger {
  info(msg: string, tag: string, meta: unknown) {
    console.info(tag, msg, meta);
  }
  warning(msg: string, tag: string, meta: unknown) {
    console.warn(tag, msg, meta);
  }
}

const webhook = webhookHandler({
  logger: new MyLogger()
});
```

## Create a subscription

[toggl-webhook](https://www.npmjs.com/package/toggl-webhook) provides a node.js API wrapper for the [toggl webhook api](https://developers.track.toggl.com/docs/webhooks/subscriptions).
