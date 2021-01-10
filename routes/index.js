const express = require('express');
const router = express.Router();
require('moment/locale/tr');
const Test = require("../services/modals/Test");
const verifyToken = require('../services/middleware/verify-token');

router.get('/',verifyToken,(req,res)=>{
      if(req.status!=3){
            res.render('index.ejs');
      }else{
            let find_test = [];
            Test.find({}, (err, find_list) => {
            if (err) {
                  return res.render("error.ejs");
            }
            find_list.map(item=>{
                  const userID = item.solveUser;
                  let status = userID.includes(req._id)
                  find_test.push({name:item.name,questionCount:item.questions.length,classType:item.classStatus,information:status})
            })
                  res.render("index2.ejs", {
                        find_test,
                  });
            });
      }
});

module.exports = router;