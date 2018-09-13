var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");

// var db = require("./models");

var PORT = 3001;

// Initialize Express
var app = express();

// Configure middleware


// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news-scraper";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


request("https://news.google.com/?hl=en-US&gl=US&ceid=US:en", function(error, response, html) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
  var results = {};

  // With cheerio, find each p-tag with the "title" class
  // (i: iterator. element: the current element)
  $("a.VDXfz").each(function(i, element) {

    // Save the text of the element in a "title" variable
    var link = $(element).attr("href");

    var summary = $(element).parent().text()
    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have
    var title = $(element).parent().text();

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: title,
      link: link
    });
  });

  $("ariticle.SbNwzf").each(function(i, element) {
//saves summary from different element tag
    var summary = $(element).parent().text()

    results.push({
     summary: summary
    });
  });
  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});