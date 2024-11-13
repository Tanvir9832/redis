const express = require('express');
const redis = require('redis');


const app = express();

let publisher = redis.createClient({
    url: 'redis://localhost:6379'
});
publisher.on('error',(err)=>{
    console.log("redis error")
})
publisher.on('connect',(err)=>{
    console.log("redis connected")
})

const connect = async ()=>{
    await publisher.connect();
}

connect();



app.get('/', (req, res)=>{
    res.send({
        message : "Publisher active",
    })
})

app.get('/publish', async(req, res)=>{
    try {
        const id = Math.floor(Math.random()*10);
        const data = {
            id, message: `message- ${id}`,
        }
        await publisher.publish('message',JSON.stringify(data));
        return res.json({
            messgae : "data published"
        })
    } catch (error) {
        return res.json({
            message : "publish error",
        })
    }
})

app.listen(3000,()=>{
    console.log("server listening on port 3000");
});