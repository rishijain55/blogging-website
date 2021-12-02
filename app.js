//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
mongoose.connect(
  "mongodb+srv://admin:rishi!12345@cluster0.kvkb4.mongodb.net/blogDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
//schema
const blogSchema = {
  title: String,
  post: String,
};
//MODEL
const Blog = mongoose.model("Blog", blogSchema);
//routes
app.get("/", function (req, res) {
  Blog.find({}, function (err, items) {
    if (err) {
      console.log(err);
    } else {
      res.render("home", { content: homeStartingContent, posts: items });
    }
  });
});
app.get("/day/:topic", function (req, res) {
  let topic = req.params.topic;
  Blog.find({}, function (err, items) {
    let post = items;
    console.log(post);
    if (err) {
      console.log(err);
    } else {
      let z = -1;
      for (let i = 0; i < post.length; i++) {
        if (_.lowerCase(post[i].title) == _.lowerCase(topic)) {
          z = i;
          break;
        }
      }
      if (z == -1) {
        res.send("no such blog");
      } else {
        res.render("post", {
          titlePost: post[z].title,
          bodyPost: post[z].post,
        });
      }
    }
  });
});
app.get("/about", function (req, res) {
  res.render("about", { content: aboutContent });
});
app.get("/contact", function (req, res) {
  res.render("contact", { content: contactContent });
});
app.get("/compose", function (req, res) {
  res.render("compose");
});
app.post("/compose", function (req, res) {
  let title = req.body.postTitle;
  let lodashTitle = _.lowerCase();
  let post = req.body.newPost;
  let z = -1;
  Blog.find({}, function (err, items) {
    for (let i = 0; i < items.length; i++) {
      if (_.lowerCase(items[i].title) == _.lowerCase(title)) {
        z = i;
        break;
      }
    }
    if (z == -1) {
      const dataPost = new Blog({
        title: title,
        post: post,
      });
      dataPost.save();
      res.redirect("/");
    } else {
      let q = -1;
      Blog.find({}, function (err, items) {
        for (let i = 0; i < items.length; i++) {
          if (_.lowerCase(items[i].title) == _.lowerCase(title)) {
            q = items[i]._id;
            break;
          }
        }
        console.log("id");
        Blog.updateOne({ _id: q }, { post: post }, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("successful");
          }
        });
        res.redirect("/");
      });
    }
  });
});
let port = process.env.PORT;
if (port == null || port == 0) {
  port = 3000;
}
app.listen(port, function () {
  console.log("Server started on port 3000");
});
