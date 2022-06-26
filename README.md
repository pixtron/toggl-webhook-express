# toggl-webhook-express

## Install

```
npm install --save toggl-webhook
```

*Warning*: This package is native [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and does not provide a CommonJS export. If your project uses CommonJS, you'll have to [convert to ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) or use the dynamic import() function. Please don't open issues for questions regarding CommonJS / ESM.


## Usage

```
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

## Create a subscription

[toggl-webhook](https://www.npmjs.com/package/toggl-webhook) provides a node.js API wrapper for the [toggl webhook api](https://developers.track.toggl.com/docs/webhooks/subscriptions).
