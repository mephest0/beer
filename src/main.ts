import Koa from 'koa';

const PORT_NUMBER = 31337

console.log('hello world');
const app = new Koa();

app.use(async (ctx) => {
	console.log('got request');

	ctx.body = '<html><body><h1>rock on</h1></body></html>';
})

app.listen(PORT_NUMBER)

console.log('all set up')
