var config = require('../config')
if(!process.env.NODE_ENV) process.env.NODE_ENV = config.dev.env
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var opn = require('opn')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
	publicPath: webpackConfig.output.publicPath,
	stats: {
		colors: true,
		chunks: false
	}
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function(compilation) {
	compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
		hotMiddleware.publish({
			action: 'reload'
		})
		cb()
	})
})

// proxy api requests
Object.keys(proxyTable).forEach(function(context) {
	var options = proxyTable[context]
	if(typeof options === 'string') {
		options = {
			target: options
		}
	}
	app.use(proxyMiddleware(context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

app.get('/', function(req, res) {
	res.send('Hello world!');
});

module.exports = app.listen(port, function(err) {
	if(err) {
		console.log(err)
		return
	}
	var uri = 'http://localhost:' + port
	console.log('Listening at ' + uri + '\n')
	opn(uri)
})

//  模拟数据

var apiRoutes = express.Router() //4.
app.use('/api', apiRoutes) //5.通过路由请求数据  

// 模拟数据请求
app.get(/^(\/api\/)([A-Za-z0-9]*)/, (req, res) => {
	var regExp = /^(\/api\/)([A-Za-z0-9]*)/;
	var appData = require('../false_data/' + regExp.exec(req.path)[2] + '.json'); //3.加载本地数据文件
	res.json(appData) //接口返回json数据，上面配置的数据appData就赋值给data请求后调用
});
app.post(/^(\/api\/)[A-Za-z0-9]/, (req, res) => {
  var regExp = /^(\/api\/)([A-Za-z0-9]*)/;
	var appData = require('../false_data/' + regExp.exec(req.path)[2] + '.json'); //3.加载本地数据文件
	res.json(appData)
})