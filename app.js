const Koa = require('koa')
const koaRouter = require('koa-router')
const render = require('koa-art-template')
const app = new Koa()
const router = new koaRouter()
const path = require('path')
const session = require('koa-session')

app.keys = ['some secret hurr'+Math.random().toString()]//内容随便填，字符串加密
const CONFIG = {
    key: 'koa:sess',//默认
    maxAge: 86400000,//cookie过期时间 [需要修改]
    overwrite: true,//默认
    httpOnly: true,//true表示只有服务器端可以获取cookie
    signed: true,//默认签名
    rolling: true,//在每次请求时强制设置cookie,将重置cookie过期时间，默认为false [需要修改]
    renew: false//当cookie快过期的时候重新设置cookie [需要修改]
}
//配置template模板引擎
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
})
//配置session中间件
app.use(session(CONFIG, app))

// router.get('/', async (ctx) => {
//     //设置cookie
//     ctx.cookies.set('userInfo', 'zhangsan', {
//         maxAge: 60 * 1000 * 60,//配置时间
//         // expires:'2020-06-15',
//         path: '/news',//配置可以访问cookie的页面
//         domain: '',//正常情况下不用设置  默认就是当前域下面的所有页面都可以访问
//         httpOnly: true
//     })
//     await ctx.render('index', {
//         title: '我是标题'
//     })
// })
router.get('/', async (ctx) => {
    //获取session
    console.log(ctx.session.userInfo)
    await ctx.render('index', {
        title: '我是标题'
    })
})
router.get('/login', async (ctx) => {
    ctx.session.userInfo = "张三"
    ctx.body = "登录成功"

})

// router.get('/news', async (ctx) => {
//     console.log(ctx.cookies.get('userInfo'))
//     await ctx.render('news', {
//         list: ['美食', '动画', '军事', '时政']
//     })
// })
// router.get('/shop', async (ctx) => {
//     console.log(ctx.cookies.get('userInfo'))
//     ctx.body = '这是一个商品页面'
// })


app.use(router.routes())
app.use(router.allowedMethods())
app.listen(8000)
