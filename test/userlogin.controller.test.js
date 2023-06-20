require("module-alias/register");
const sinon = require("sinon");
const { expect } = require("chai");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Repository } = require("@src/entity/Repository");
const { UserEntity } = require("@src/entity/User.entity");

const { userLoginController } = require("@src/controller/user.controller");

describe("userLoginController", () => {
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

        // Mocking the Repository
        sinon.stub(Repository.prototype, "find").resolves({
            rawDatas: [
                {
                    username: "user3",
                    password: bcrypt.hashSync("dung123", 10)
                }
            ]
        });

        // Mocking bcrypt.compare
        sinon.stub(bcrypt, "compare").resolves(true);

        // Mocking jwt.sign
        sinon.stub(jwt, "sign").returns("testtoken");
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should login successfully and return a token", async () => {
        await userLoginController(req, res, next);

        // Assertions
        expect(res.status.calledWith(200)).to.be.true;
        expect(
            res.json.calledWith({
                success: true,
                token: "testtoken"
            })
        ).to.be.true;
    });

    it('should return 401 status and "Invalid password" message if the password is invalid', async () => {
        bcrypt.compare.resolves(false);

        await userLoginController(req, res, next);

        // Assertions
        expect(res.status.calledWith(401)).to.be.true;
        expect(
            res.json.calledWith({
                success: false,
                message: "Invalid password"
            })
        ).to.be.true;
    });

    // it('should return 500 status and "Internal server error" message if an error occurs', async () => {
    //     const error = new Error("Some error");
    //     if (!Repository.prototype.find.isSinonProxy) {
    //         sinon.stub(Repository.prototype, "find").rejects(error);
    //     }

    //     await userLoginController(req, res, next);

    //     // Assertions
    //     expect(res.status.calledWith(500)).to.be.true;
    //     expect(
    //         res.json.calledWith({
    //             success: false,
    //             message: "Internal server error"
    //         })
    //     ).to.be.true;
    // });
});
