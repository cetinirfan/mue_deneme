const express = require("express");
const router = express.Router();
require("moment/locale/tr");
const Test = require("../services/modals/Test");
const Class = require("../services/modals/Class");
const Admin = require("../services/modals/Admin");
const Result = require("../services/modals/Result");
const verifyToken = require("../services/middleware/verify-token");
var multer = require("multer");
const fs = require("fs");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // here we specify the destination . in this case i specified the current directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // here we specify the file saving name . in this case i specified the original file name
  },
});

var uploadDisk = multer({ storage: storage });

router.get("/soru_ekle/:_id", verifyToken, (req, res) => {
  res.render("soru_ekle.ejs");
});

router.post(
  "/soru_ekle/:_id",
  uploadDisk.single("image"),
  verifyToken,
  (req, res) => {
    const { correctOption, questionSubject } = req.body;
    const _id = req.params._id;
    Test.updateOne(
      { _id: req.params._id },
      {
        $push: {
          questions: {
            questionImage: "/uploads/" + req.file.filename,
            option1: "A",
            option2: "B",
            option3: "C",
            option4: "D",
            option5: "E",
            correctOption: correctOption.toUpperCase(),
            questionSubject: questionSubject,
          },
        },
      },
      (err, find_question) => {
        if (err) {
          return res.render("error.ejs");
        }
        Test.findOne({ _id: _id }, (err, find_test) => {
          res.render("soru_ekle.ejs", {
            find_test,
          });
        });
      }
    );
  }
);

router.get("/test_sil/:_id", verifyToken, (req, res) => {
  Test.findOneAndDelete({ _id: req.params._id }, (err, find_test) => {
    if (err) {
      return res.render("error.ejs");
    }
    req.flash('message', ['Test Başarıyla Silindi.',"alert alert-success mb-4" ])
    res.redirect('/testler/testler_yonetim')
  });
});

router.get("/testler_yonetim", verifyToken, (req, res) => {
  Test.find({}, (err, find_test) => {
    if (err) {
      return res.render("error.ejs");
    }
    res.render("testler.ejs", {
      find_test,
      message : req.flash('message')
    });
  });
});

router.get("/testlerim", verifyToken, (req, res) => {
  let find_test = [];
  Test.find({}, (err, find_list) => {
    if (err) {
      return res.render("error.ejs");
    }
    find_list.map(item=>{
      const userID = item.solveUser;
      let status = userID.includes(req._id)
      if(status===false){
        find_test.push(item)
      }
    })
    res.render("testlerim.ejs", {
      find_test,
    });
  });
});

router.get("/test/:_id", verifyToken, (req, res) => {
  Test.findOne({ _id: req.params._id }, (err, data) => {
    const find_question = data.questions;
    const find_Id = data._id;
    if (err) {
      return res.render("error.ejs");
    }
    res.render("test.ejs", {
      find_question,
      find_Id,
    });
  });
});

router.post("/sonuc/:_id", verifyToken, (req, res) => {
  Test.findOne({ _id: req.params._id }, (err, data) => {
    const find_question = data.questions;
    const testName = data.name;
    if (err) {
      return res.render("error.ejs");
    }
    const questionCount = find_question.length;
    let emptyQuestion = 0;
    let correctQuestion = 0;
    let wrongQuestion = 0;
    let wrongQuestionSubject = [];
    for (let i = 0; i < questionCount; i++) {
      if (req.body[Object.keys(req.body)[i]] === undefined) {
        emptyQuestion++;
      } else {
        if (req.body[Object.keys(req.body)[i]] === find_question[i].correctOption) {
          correctQuestion++;
        } else {
          wrongQuestion++,
            wrongQuestionSubject.push(find_question[i].questionSubject);
        }
      }
    }
    let x = 100 / questionCount;
    let z = correctQuestion * x;
    let percentQuestion = Math.trunc(z);
    let y = 0.25 * wrongQuestion;
    let netQuestion = questionCount - emptyQuestion - wrongQuestion - y;
    const newResult = new Result({
      percentQuestion: percentQuestion,
      emptyQuestion: emptyQuestion,
      correctQuestion: correctQuestion,
      countQuestion: questionCount,
      wrongQuestion: wrongQuestion,
      netQuestion: netQuestion,
      testName: testName,
      testID: req.params._id,
      userID: req.user_id,
    });
    newResult.save((err, find_result) => {
      if (err) {
        res.render("error.ejs");
      }
      Test.updateOne(
        { _id: req.params._id },
        {
          $push: {
            solveUser:req._id
          },
        },
        (err, find_admin) => {
          if (err) {
            return res.render("error.ejs");
          }
          res.render("sonuc.ejs", {
            percentQuestion,
            emptyQuestion,
            correctQuestion,
            wrongQuestion,
            netQuestion,
            wrongQuestionSubject,
          });
        }
      );
      
    });
  });
});

router.get("/test_ekle", verifyToken, (req, res) => {
  res.render("test_ekle.ejs");
});

router.post("/test_ekle", verifyToken, (req, res) => {
  const { name, classStatus } = req.body;
  const newTest = new Test({
    name: name,
    classStatus: classStatus,
  });
  newTest.save((err, find_test) => {
    const testId = find_test._id;
    if (err) {
      res.render("error.ejs");
    }
    res.render("soru_ekle.ejs", {
      find_test,
    });
  });
});

router.get("/sonuclar", verifyToken, (req, res) => {
  Result.find({ userID: req.user_id }, (err, find_sonuc) => {
    if (err) {
      return res.render("error.ejs");
    }
    res.render("tum_sonuclar.ejs", {
      find_sonuc,
    });
  });
});

router.get("/tum_sonuclar/:_id", verifyToken, (req, res) => {
  Result.find({ testID: req.params._id }, (err, find_sonuc) => {
    if (err) {
      return res.render("error.ejs");
    }
    res.render("sonuclar.ejs", {
      find_sonuc,
    });
  });
});

router.get("/test_tanimla/:_id", verifyToken, (req, res) => {
  const TestId = req.params._id
  Class.find({}, (err, find_class) => {
    if (err) {
      return res.render("error.ejs");
    }
    res.render("test_tanimla.ejs", {
      find_class,
      TestId
    });
  });
});

router.get("/test_sinif_tanimla/:_testId/:_classId", verifyToken, (req, res) => {
  const TestId = req.params._testId
  const ClassId = req.params._classId
  Class.findOne({_id:ClassId}, (err, find_class) => {
    const studentsId = find_class.student
    if (err) {
      return res.render("error.ejs");
    }
    studentsId.map(studentId=>{
      Admin.findOneAndUpdate({_id:studentId},{ 
        $push: {
          test:TestId 
        }, 
      },(err,find_ogrenci)=>{
        if(find_ogrenci){
          console.log(find_ogrenci)
        }
      })
    })
    return res.send(
      "<script> alert('Test başarıyla eklendi.'); window.location = '../../../../testler/test_tanimla/" +
      TestId +
        "'; </script>"
    );
  });
});


module.exports = router;
