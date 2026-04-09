const redis = require('redis')

const redisclient = redis.createClient({
    username: 'default',
    password: process.env.Redis_pass,
    socket: {
        host: 'redis-11766.crce179.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 11766
    }
});

module.exports = redisclient