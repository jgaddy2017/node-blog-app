const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");


const expect = chai.expect;

chai.use(chaiHttp);

describe("Blog Posts", function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it("should list items on GET", function() {

    return chai
      .request(app)
      .get("/BlogPosts")
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a("array");

        expect(res.body.length).to.be.at.least(1);

        const expectedKeys = ["id", "title", "author", "publishDate"];
        res.body.forEach(function(item) {
          expect(item).to.be.a("object");
          expect(item).to.include.keys(expectedKeys);
        });
      });
  });


  it("should add an item on POST", function() {
    const newItem = { title: "titleOne", author: "authorOne", content: "myContent", publishDate: "now" };
    return chai
      .request(app)
      .post("/BlogPosts")
      .send(newItem)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.all.keys(["id", "publishDate", "title", "content", "author"]);

      });
  });


  it("should update blog posts on PUT", function() {
    return (
      chai
        .request(app)
        .get("/BlogPosts")
        .then(function(res) {
          const updatedPost = Object.assign(res.body[0], {
            title: "myTitle",
            content: "myContent"
          });
          return chai
            .request(app)
            .put(`/BlogPosts/${res.body[0].id}`)
            .send(updatedPost)
            .then(function(res) {
              expect(res).to.have.status(204);
            });
        })
    );
  });

  it("should delete items on DELETE", function() {
    return (
      chai
        .request(app)

        .get("/BlogPosts")
        .then(function(res) {
          return chai.request(app).delete(`/BlogPosts/${res.body[0].id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
        })
    );
  });
});