const { expect } = require("chai");
const request = require("supertest");
const app = require("../app");

describe("GET /user", () => {
  it("Endpoint should return a list of users", async () => {
    const response = await request(app).get("/user");
    const expectedProperties = [
      "id",
      "name",
      "email",
      "password",
      "createdAt",
      "updatedAt",
    ];

    response.body.users.forEach((user) => {
      expect(user).to.be.an("object");

      expectedProperties.forEach((property) => {
        expect(user).to.have.property(property);
      });
    });
  });
});

describe("CREATE UPDATE and DELETE the user", () => {
  let userId;

  it("Endpoint should create a new user", async () => {
    const newUser = {
      name: "Janko Jankovic",
      email: "janko3@janko.com",
      password: "password123",
    };

    const response = await request(app).post("/user").send(newUser);

    expect(response.status).to.equal(200);
    expect(response.body.user).to.be.an("object");
    expect(response.body.user).to.have.property("id");
    expect(response.body.user.name).to.equal(newUser.name);
    expect(response.body.user.email).to.equal(newUser.email);

    userId = response.body.user.id;
  });

  it("Endpoint should update the user", async () => {
    const updatedName = "Marko";

    const response = await request(app).put(`/user/${userId}`).send({
      name: updatedName,
      email: "janko3@janko.com",
      password: "password123",
    });

    expect(response.status).to.equal(200);
    expect(response.body.user).to.be.an("object");
    expect(response.body.user).to.have.property("id");
    expect(response.body.user.name).to.equal(updatedName);
  });

  it("Endpoint should delete the user", async () => {
    const response = await request(app).delete(`/user/${userId}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("object");
    expect(response.body).to.have.property("isDeleted");
    expect(response.body.isDeleted).to.equal(true);
  });
});
