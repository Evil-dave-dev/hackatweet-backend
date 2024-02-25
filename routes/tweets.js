var express = require("express");
var router = express.Router();

const Tweet = require('../models/tweets')
const User = require('../models/users')

router.post('/display', (req, res)=>{
    User.findOne({token: req.body.token})
        .then(dataUser=>{
            Tweet.find()
            .populate("user")
            .then(data=>{
                dataReturn = []
                for (let i=0; i<data.length; i++){
                    console.log(data[i].user.username, dataUser.username)
                    if(data[i].like.includes(dataUser.id)){
                        if(data[i].user.username === dataUser.username){
                            dataReturn.push({message: data[i].message, trend: data[i].trend, date: data[i].date, userName: data[i].user.username, firstName: data[i].user.firstname, isLiked: true, likeCount: data[i].like.length, trash: true})        
                        } else {
                            dataReturn.push({message: data[i].message, trend: data[i].trend, date: data[i].date, userName: data[i].user.username, firstName: data[i].user.firstname, isLiked: true, likeCount: data[i].like.length, trash: false})
                        }
                    } else {
                        if(data[i].user.username === dataUser.username){
                        dataReturn.push({message: data[i].message, trend: data[i].trend, date: data[i].date, userName: data[i].user.username, firstName: data[i].user.firstname, isLiked: false, likeCount: data[i].like.length, trash: true})    
                        } else {
                        dataReturn.push({message: data[i].message, trend: data[i].trend, date: data[i].date, userName: data[i].user.username, firstName: data[i].user.firstname, isLiked: false, likeCount: data[i].like.length, trash: false})
                        }
                    }
                    
                }
                res. json({result: true, dataReturn})
            })
        })
})

router.post('/', (req, res)=>{
    User.findOne({token: req.body.token})
        .then(data=>{
            const regex = /#(\w+)/g
            if(regex.test(req.body.message)){
                const trend = req.body.message.match(regex)
                const mess = req.body.message.replace(regex, '')
                const newTweet = new Tweet ({
                    message: mess,
                    trend: trend.join(''),
                    date: new Date(),
                    user: data.id,
                    like: []
                })  
                newTweet.save()
                .then(data=>{
                    res.json({result: true})
                })
            } else {
                const newTweet = new Tweet ({
                    message: req.body.message,
                    trend: '',
                    date: new Date(),
                    user: data.id,
                    like: []
                })  
                newTweet.save()
                .then(data=>{
                    res.json({result: true})
                })
            }
           
        })
    
})

router.post('/like', (req, res)=>{
    User.findOne({token: req.body.token})
        .then(data=>{
            Tweet.findOne({message: req.body.message, like: data.id})
                .populate('like')
                .then(messData=>{
                     if(messData){
                         Tweet.updateOne({message: req.body.message, }, {$pull: {like: data.id}})
                         .then(dataLike=>{
                             res.json({result: `${data.id} retiré`})
                         })
                     } else {
                         Tweet.updateOne({message: req.body.message, }, {$push: {like: data.id}})
                         .then(dataLike=>{
                             res.json({result: `${data.id} push`})
                         })
                     }
                })
        })
    
})

router.post('/delete', (req, res)=>{
    Tweet.deleteOne({message: req.body.message})
    .then(data=>{
        console.log(data)
    })
})

router.get('/trends', (req, res)=>{
    Tweet.find()
        .then(data=>{
            const trend = data.map(e=>e.trend)
            let occurence = {}
            trend.forEach(function (element){
                if(occurence[element]){
                    occurence[element]++
                } else {
                    occurence[element] = 1
                }
            })

            let tabResult = []
            for (const element in occurence){
                tabResult.push({element: element, occurence: occurence[element]})
            }
            res.json(tabResult)
        })
})

module.exports = router;