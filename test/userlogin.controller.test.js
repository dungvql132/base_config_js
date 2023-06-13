require("module-alias/register");
const chai = require("chai");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserEntity } = require("@src/entity/User.entity"); // Import the UserEntity module
const { Repository } = require("@src/entity/Repository"); // Import the Repository module
const { userLoginController } = require("@src/controller/user.controller");
const expect = chai.expect;

describe("userLoginController", () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                datas: {
                    username: "user1",
                    password: "dung123"
                }
            }
        };
        res = {
            status: function (code) {
                this.statusCode = code;
                return this;
            },
            json: function (data) {
                this.responseData = data;
            }
        };
        next = function (error) {
            throw error;
        };
    });

    it("should successfully login the user and return a JWT token", async () => {
        const repositoryStub = {
            find: function () {
                return Promise.resolve({
                    length: 1,
                    rawDatas: [
                        { username: "user1", password: "hashedpassword" }
                    ]
                });
            }
        };
        const bcryptStub = {
            compare: function () {
                return Promise.resolve(true);
            }
        };
        const jwtStub = {
            sign: function () {
                return "token";
            }
        };
        const loggerStub = {
            log: function () {}
        };
        const consoleErrorStub = {
            error: function () {}
        };

        await userLoginController(req, res, next);

        expect(
            repositoryStub.find.calledOnceWith({
                where: [["username", "=", "user1"]]
            })
        ).to.be.true;
        expect(bcryptStub.compare.calledOnceWith("dung123", "hashedpassword"))
            .to.be.true;
        expect(
            jwtStub.sign.calledOnceWith(
                { username: "user1" },
                process.env.JWT_SECRET_KEY
            )
        ).to.be.true;
        expect(
            loggerStub.log.calledOnceWith(
                "user user1 login successfull with token (token)"
            )
        ).to.be.true;
        expect(res.statusCode).to.equal(200);
        expect(res.responseData).to.deep.equal({
            success: true,
            token: "token"
        });
    });

    it("should return an error if user does not exist", async () => {
        const repositoryStub = {
            find: function () {
                return Promise.resolve({ length: 0 });
            }
        };

        await userLoginController(req, res, next);

        expect(
            repositoryStub.find.calledOnceWith({
                where: [["username", "=", "user1"]]
            })
        ).to.be.true;
        expect(res.statusCode).to.equal(401);
        expect(res.responseData).to.deep.equal({
            success: false,
            message: "Invalid password"
        });
    });

    it("should return an error if the password is invalid", async () => {
        const repositoryStub = {
            find: function () {
                return Promise.resolve({
                    length: 1,
                    rawDatas: [
                        { username: "user1", password: "hashedpassword" }
                    ]
                });
            }
        };
        const bcryptStub = {
            compare: function () {
                return Promise.resolve(false);
            }
        };

        await userLoginController(req, res, next);

        expect(
            repositoryStub.find.calledOnceWith({
                where: [["username", "=", "user1"]]
            })
        ).to.be.true;
        expect(bcryptStub.compare.calledOnceWith("dung123", "hashedpassword"))
            .to.be.true;
        expect(res.statusCode).to.equal(401);
        expect(res.responseData).to.deep.equal({
            success: false,
            message: "Invalid password"
        });
    });

    it("should return an error if an internal server error occurs", async () => {
        const repositoryStub = {
            find: function () {
                return Promise.reject(new Error("Internal server error"));
            }
        };
        const consoleErrorStub = {
            error: function () {}
        };

        await userLoginController(req, res, next);

        expect(
            repositoryStub.find.calledOnceWith({
                where: [["username", "=", "user1"]]
            })
        ).to.be.true;
        expect(consoleErrorStub.error.calledOnce).to.be.true;
        expect(res.statusCode).to.equal(500);
        expect(res.responseData).to.deep.equal({
            success: false,
            message: "Internal server error"
        });
    });
});
