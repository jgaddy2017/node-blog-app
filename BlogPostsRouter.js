const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./model');


BlogPosts.create("Somthingtitle", "Somethingcontent", "Somethingauthor", "now");
BlogPosts.create("Somthingtitle2", "Somethingcontent2", "Somethingauthor2", "now2");
BlogPosts.create("Somthingtitle3", "Somethingcontent3", "Somethingauthor3", "now3");

router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'publishDate'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    const blog = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
    res.status(201).json(blog);
});

router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted item \`${req.params.id}\``);
    res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'publishDate'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    if (req.params.id !== req.body.id) {
      const message = (
        `Request path id (${req.params.id}) and request body id `
        `(${req.body.id}) must match`);
      console.error(message);
      return res.status(400).send(message);
    }
    console.log(`Updating shopping list item \`${req.params.id}\``);
    const updatedItem = BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate || Date.now()
    });
    res.status(204).end();
  });

  module.exports = router;