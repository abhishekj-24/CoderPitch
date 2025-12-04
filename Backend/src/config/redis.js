const redis = require('redis')

const redisclient = redis.createClient({
    username: 'default',
    password: process.env.Redis_pass,
    socket: {
        host: 'redis-10900.c301.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 10900
    }
});

module.exports = redisclient