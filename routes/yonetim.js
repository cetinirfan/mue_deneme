const express = require("express");
const router = express.Router();
require("moment/locale/tr");
const verifyToken = require("../services/middleware/verify-token");
const Admin = require("../services/modals/Admin");
const Class = require("../services/modals/Class");
const md5 = require("md5");

router.get("/yonetici_ekle", verifyToken, (req, res) => {
  res.render("yonetici_ekle.ejs",{message : req.flash('message')});
});

router.post("/yonetici_ekle", verifyToken, (req, res) => {
  const { fullName, telephone, password, password2 } = req.body;
  if (!password || !telephone || !password2 || !fullName) {
    req.flash('message', ['Lütfen Tüm Alanları Doldurunuz.',"alert alert-danger mb-4" ])
    res.redirect('/yonetim/yonetici_ekle')
  }else{
    if (password != password2) {
      req.flash('message', ['Şifreler Uyuşmadı.',"alert alert-danger mb-4" ])
      res.redirect('/yonetim/yonetici_ekle')
    }else{
      const newAdmin = new Admin({
        fullName: fullName,
        telephone: telephone,
        status: 1,
        password: md5(password),
      });
      newAdmin.save((err, find_admin) => {
        if (err) {
          console.log(err);
          res.render("error.ejs");
        }
        req.flash('message', ['Yönetici Başarıyla Eklendi.',"alert alert-success mb-4" ])
        res.redirect('/yonetim/yonetici_ekle')
      });
    }
  }
});

router.get("/ogretmen_duzenle/:_id", verifyToken, (req, res) => {
  Admin.findOne({ _id: req.params._id }, (err, find_ogretmen) => {
    if (err) {
      return res.render("error.ejs");
    }

    res.render("ogretmen_duzenle.ejs", {
      find_ogretmen,
      message : req.flash('message'),
    });
  });
});

router.post("/ogretmen_duzenle/:_id", verifyToken, (req, res) => {
  const { fullName, telephone, mail } = req.body;
  const _id = req.params._id;

  if (!mail || !telephone || !_id || !fullName) {
    req.flash('message', ['Lütfen Tüm Alanları Doldurunuz.',"alert alert-danger mb-4" ])
    res.redirect('/yonetim/ogretmen_duzenle')
  }
  Admin.updateOne(
    { _id: req.params._id },
    {
      $set: {
        mail,
        telephone,
        fullName,
      },
    },
    (err, find_admin) => {
      if (err) {
        return res.render("error.ejs");
      }
      req.flash('message', ['Güncelleme işlemi başarılı.',"alert alert-success mb-4" ])
      res.redirect('/yonetim/ogretmenler')
    }
  );
});

router.get("/ogretmen_sifre_duzenle/:_id", verifyToken, (req, res) => {
  Admin.findOne({ _id: req.params._id }, (err, find_ogretmen) => {
    if (err) {
      return res.render("error.ejs");
    }

    res.render("ogretmen_sifre_duzenle.ejs", {
      find_ogretmen,
    });
  });
});

router.post("/ogretmen_sifre_duzenle/:_id", verifyToken, (req, res) => {
  const { password, password2 } = req.body;
  const _id = req.params._id;
  if (password != password2) {
    return res.send(
      "<script> alert('Şifreler Uyuşmadı.'); window.location = '../../../yonetim/ogretmen_sifre_duzenle/" +
        _id +
        "'; </script>"
    );
  }
  if (!password || !password2 || !_id) {
    return res.send(
      "<script> alert('Lütfen tüm alanları doldurunuz.'); window.location = '../../../yonetim/ogretmen_sifre_duzenle/" +
        _id +
        "'; </script>"
    );
  }
  Admin.updateOne(
    { _id: req.params._id },
    {
      $set: {
        password: md5(password),
      },
    },
    (err, find_admin) => {
      if (err) {
        return res.render("error.ejs");
      }

      return res.send(
        "<script> alert('Güncelleme işlemi başarılı.'); window.location = '../../../yonetim/ogretmenler/'; </script>"
      );
    }
  );
});

router.get("/ogretmen_sil/:_id", verifyToken, (req, res) => {
  Admin.findOneAndDelete({ _id: req.params._id }, (err, find_admin) => {
    if (err) {
      return res.render("error.ejs");
    }
    req.flash('message', ['Öğretmen Başarıyla Silindi.',"alert alert-success mb-4" ])
    res.redirect('/yonetim/ogretmenler')
  });
});

router.get("/ogretmen_ekle", verifyToken, (req, res) => {
  res.render("ogretmen_ekle.ejs",{message : req.flash('message')});
});

router.post("/ogretmen_ekle", verifyToken, (req, res) => {
  const { fullName, telephone, mail, password, password2 } = req.body;
  if (!password || !telephone || !password2 || !mail || !fullName) {
    req.flash('message', ['Lütfen Tüm Alanları Doldurunuz.',"alert alert-danger mb-4" ])
    res.redirect('/yonetim/ogretmen_ekle')
  }else{
    if (password != password2) {
      req.flash('message', ['Şifreler Uyuşmadı.',"alert alert-danger mb-4" ])
      res.redirect('/yonetim/ogretmen_ekle')
    }else{
      const newTeacher = new Admin({
        fullName: fullName,
        telephone: telephone,
        mail: mail,
        status: 2,
        password: md5(password),
      });
      newTeacher.save((err, find_admin) => {
        if (err) {
          console.log(err);
          res.render("error.ejs");
        }
        req.flash('message', ['Öğretmen Başarıyla Eklendi.',"alert alert-success mb-4" ])
        res.redirect('/yonetim/ogretmen_ekle')
      });
    }
  }
  
});

router.get("/ogretmenler", verifyToken, (req, res) => {
  Admin.find({ status: 2 }, (err, find_ogretmen) => {
    if (err) {
      return res.render("error.ejs");
    }
    res.render("ogretmenler.ejs", {
      find_ogretmen,
      message : req.flash('message')
    });
  });
});

router.get("/ogrenci_duzenle/:_id", verifyToken, (req, res) => {
  Admin.findOne({ _id: req.params._id }, (err, find_ogrenci) => {
    if (err) {
      return res.render("error.ejs");
    }
    Class.find({}, (err, find_sinif) => {
      console.log(find_sinif);
      if (err) {
        return res.render("error.ejs");
      }
      res.render("ogrenci_duzenle.ejs", {
        find_sinif,
        find_ogrenci,
      });
    });
  });
});

router.post("/ogrenci_duzenle/:_id", verifyToken, (req, res) => {
  const { fullName, telephone, tc, no, classType, className } = req.body;
  const _id = req.params._id;

  if (!tc || !telephone || !_id || !no || !classType || !className) {
    return res.send(
      "<script> alert('Lütfen tüm alanları doldurunuz.'); window.location = '../../../yonetim/ogrenci_duzenle/" +
        _id +
        "'; </script>"
    );
  }
  Admin.updateOne(
    { _id: req.params._id },
    {
      $set: {
        tc,
        telephone,
        fullName,
        no,
        classType,
        className,
      },
    },
    (err, find_admin) => {
      if (err) {
        return res.render("error.ejs");
      }

      return res.send(
        "<script> alert('Güncelleme işlemi başarılı.'); window.location = '../../../yonetim/ogrenciler/'; </script>"
      );
    }
  );
});

router.get("/ogrenci_sil/:_id", verifyToken, (req, res) => {
  Admin.findOneAndDelete({ _id: req.params._id }, (err, find_admin) => {
    const _studentID = find_admin._id;
    const classNameOld = find_admin.className;
    Class.findOneAndUpdate(
      { name: classNameOld },
      { $pull: { student: _studentID.toString() } },
      (err, data) => {
        if (err) {
          console.log(err);
        }
        req.flash('message', ['Öğrenci Başarıyla Silindi.',"alert alert-success mb-4" ])
        res.redirect('/yonetim/ogrenciler')
      }
    );
  });
});

router.get("/ogrenci_ekle", verifyToken, (req, res) => {
  Class.find({}, (err, find_sinif) => {
    console.log(find_sinif);
    if (err) {
      return res.render("error.ejs");
    }
    res.render("ogrenci_ekle.ejs", {
      find_sinif,
      message : req.flash('message')
    });
  });
});

router.post("/ogrenci_ekle", verifyToken, (req, res) => {
  const { no, fullName, tc, telephone, classType, className } = req.body;
  if (!no || !fullName || !tc || !telephone || !classType || !className) {
    req.flash('message', ['Lütfen Tüm Alanları Doldurunuz.',"alert alert-danger mb-4" ])
    res.redirect('/yonetim/ogrenci_ekle')
  }else{
    let password = tc.slice(0, 5);
  const newStudent = new Admin({
    fullName: fullName,
    no: no,
    telephone: telephone,
    tc: tc,
    status: 3,
    classType: classType,
    className: className,
    password: md5(password),
  });
  newStudent.save((err, find_ogrenci) => {
    const _studentID = find_ogrenci._id;
    if (err) {
      console.log(err);
      res.render("error.ejs");
    } else {
      Class.findOneAndUpdate(
        { name: className },
        { $push: { student: _studentID.toString() } },
        (err, data) => {
          if (err) {
            console.log(err);
          }
          req.flash('message', ['Öğrenci Başarıyla Eklendi.',"alert alert-success mb-4" ])
          res.redirect('/yonetim/ogrenci_ekle')
        }
      );
    }
  });
  }
});

router.get("/ogrenciler", verifyToken, (req, res) => {
  Admin.find({ status: 3 }, (err, find_ogrenci) => {
    if (err) {
      return res.render("error.ejs");
    }
    res.render("ogrenciler.ejs", {
      find_ogrenci,
      message : req.flash('message')
    });
  });
});

router.get("/sinif_sil/:_id", verifyToken, (req, res) => {
  Class.findOneAndDelete({ _id: req.params._id }, (err, find_sinif) => {
    if (err) {
      return res.render("error.ejs");
    }
    req.flash('message', ['Sınıf Başarıyla Silindi.',"alert alert-success mb-4" ])
    res.redirect('/yonetim/siniflar')
  });
});

router.get("/sinif_duzenle/:_id", verifyToken, (req, res) => {
  Class.findOne({ _id: req.params._id }, (err, find_sinif) => {
    if (err) {
      return res.render("error.ejs");
    }
    res.render("sinif_duzenle.ejs", {
      find_sinif,
    });
  });
});

router.post("/sinif_duzenle/:_id", verifyToken, (req, res) => {
  const { name, classType, classTeacher } = req.body;
  const _id = req.params._id;

  if (!name || !classType || !_id || !classTeacher) {
    return res.send(
      "<script> alert('Lütfen tüm alanları doldurunuz.'); window.location = '../../../yonetim/sinif_duzenle/" +
        _id +
        "'; </script>"
    );
  }
  Class.updateOne(
    { _id: req.params._id },
    {
      $set: {
        name,
        classType,
        classTeacher,
      },
    },
    (err, find_sinif) => {
      if (err) {
        return res.render("error.ejs");
      }

      return res.send(
        "<script> alert('Güncelleme işlemi başarılı.'); window.location = '../../../yonetim/ogrenciler/'; </script>"
      );
    }
  );
});

router.get("/sinif_ekle", verifyToken, (req, res) => {
  res.render("sinif_ekle.ejs",{message : req.flash('message')});
});

router.post("/sinif_ekle", verifyToken, (req, res) => {
  const { name, classTeacher, classType } = req.body;
  if (!name || !classTeacher || !classType) {
    req.flash('message', ['Lütfen Tüm Alanları Doldurunuz.',"alert alert-danger mb-4" ])
    res.redirect('/yonetim/sinif_ekle')
  }else{
    const newClass = new Class({
      name: name,
      classType: classType,
      classTeacher: classTeacher,
    });
    newClass.save((err, find_sinif) => {
      if (err) {
        console.log(err);
        res.render("error.ejs");
      }
      req.flash('message', ['Sınıf Başarıyla Eklendi.',"alert alert-success mb-4" ])
      res.redirect('/yonetim/sinif_ekle')
    });
  }
});

router.get("/siniflar", verifyToken, (req, res) => {
  Class.find({}, (err, find_sinif) => {
    if (err) {
      return res.render("error.ejs");
    }
    res.render("siniflar.ejs", {
      find_sinif,
      message : req.flash('message')
    });
  });
});

module.exports = router;
