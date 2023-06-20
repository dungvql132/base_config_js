require("module-alias/register");
const sinon = require("sinon");
const { expect } = require("chai");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Repository } = require("@src/entity/Repository");
const { UserEntity } = require("@src/entity/User.entity");

const { userRegisterController } = require("@src/controller/user.controller");

describe("userRegisterController", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            body: {
                datas: {
                    username: "user3",
                    password: "dung123"
                }
            }
        };

        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };

        next = sinon.stub();

        // Mocking bcrypt.hash
        sinon.stub(bcrypt, "hash").resolves("hashedpassword");

        // Mocking the Repository
        sinon
            .stub(Repository.prototype, "add")
            .resolves({ data: { rowCount: 1 } });

        // Mocking jwt.sign
        sinon.stub(jwt, "sign").returns("testtoken");
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should register a user successfully and return a token", async () => {
        await userRegisterController(req, res, next);

        // Assertions
        expect(bcrypt.hash.calledOnce).to.be.true;
        expect(bcrypt.hash.calledWith("dung123", Number(process.env.HASH_TIME)))
            .to.be.true;

        expect(Repository.prototype.add.calledOnce).to.be.true;
        expect(
            Repository.prototype.add.calledWith({
                username: "user3",
                password: "hashedpassword"
            })
        ).to.be.true;

        expect(res.status.calledWith(200)).to.be.true;
        expect(
            res.json.calledWith({
                token: "testtoken",
                sqlback: { rowCount: 1 }
            })
        ).to.be.true;
    });

    it("should return 500 status and call next with the error if an error occurs", async () => {
        const error = new Error("Some error");
        sinon.stub(Repository.prototype, "add").rejects(error);

        await userRegisterController(req, res, next);

        // Assertions
        expect(res.status.called).to.be.false;
        expect(res.json.called).to.be.false;

        expect(next.calledOnce).to.be.true;
        expect(next.calledWith(error)).to.be.true;
    });
});
