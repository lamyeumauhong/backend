const routes = (app) =>{
    app.get('/api/user', (req,res)=>{
        res.send('User page')
    })
}
module.exports = routes