const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.use(chaiHttp);
const should = chai.should();
const expect = chai.expect;

// Helper function to generate random user credentials
function generateRandomString(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Randomly generated user credentials for registration
const newUserCredentials = {
    email: generateRandomString(16) + "@mail.com",
    password: 'admin',
    firstName: 'James',
    lastName: 'Bond'
};

// A variable to hold the token for the logged-in user
let userToken;
let actionId;

describe('User Operations', () => {

    before((done) => {
        // Implement necessary steps to initialize test environment
        done();
    });

    after((done) => {
        console.log('User ID:', newUserCredentials.userId);
        if (!newUserCredentials.userId) {
            console.error('No user ID to delete');
            return done();
        }
    
        chai.request(server)
            .post('/api/auth/login')
            .send({
                email: 'admin@admin.com',
                password: 'admin'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                res.should.have.status(200);
                const adminToken = res.body.accessToken;
    
                chai.request(server)
                    .delete(`/api/user/delete/${newUserCredentials.userId}`)
                    .set('Authorization', `Bearer ${adminToken}`)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        res.should.have.status(204);
                        done();
                    });
            });
    });

    describe('User Registration and Authentication', () => {
        context('Registration', () => {
            it('should register a new user', (done) => {
                chai.request(server)
                    .post('/api/auth/register')
                    .send(newUserCredentials)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('accessToken');
                        if(res.body.userId) {
                            newUserCredentials.userId = res.body.userId;
                        } else {
                            console.error('No userId in the response body');
                        }
                        done();
                    });
            }).timeout(10000);
        });

        context('Login', () => {
            it('should login the newly registered user', (done) => {
                chai.request(server)
                    .post('/api/auth/login')
                    .send({
                        email: newUserCredentials.email,
                        password: newUserCredentials.password
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('accessToken');
                        userToken = res.body.accessToken;
                        done();
                    });
            }).timeout(10000);
        });
    });

    describe('Boarding Process', () => {
        context('Step 1 - Initial Questionnaire', () => {
            it('should complete step 1 of the boarding process for the new user', (done) => {
                chai.request(server)
                    .post(`/api/boarding/1`)
                    .set('Authorization', `Bearer ${userToken}`)
                    .send({
                        Q1: 50,
                        Q2: 50,
                        Q3: 50,
                        Q4: 50
                    })
                    .end((err, res) => {
                        expect(err).to.be.null;
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.message.should.equal('Data received successfully');
                        done();
                    });
            }).timeout(10000);
        });
    
        context('Step 2 - Additional Information', () => {
            it('should complete step 2 of the boarding process for the new user', (done) => {
                chai.request(server)
                    .post(`/api/boarding/2`)
                    .set('Authorization', `Bearer ${userToken}`)
                    .send({
                        Q5: 50,
                        Q6: 50,
                        Q7: 50,
                        Q8: 50
                    })
                    .end((err, res) => {
                        expect(err).to.be.null;
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.message.should.equal('Data received successfully');
                        done();
                    });
            }).timeout(10000);
        });
    
        context('Step 3 - Final Questions', () => {
            it('should complete step 3 of the boarding process for the new user', (done) => {
                chai.request(server)
                    .post(`/api/boarding/3`)
                    .set('Authorization', `Bearer ${userToken}`)
                    .send({
                        Q9: 50,
                        Q10: 50,
                        Q11: 50,
                        Q12: 50
                    })
                    .end((err, res) => {
                        expect(err).to.be.null;
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.message.should.equal('Data received successfully');
                        done();
                    });
            }).timeout(10000);
        });
    
        context('Step 4 - Ranking Priorities', () => {
            it('should complete step 4 of the boarding process for the new user', (done) => {
                const importanceRankings = {
                    Body: 'Most important',
                    Mind: 'Very important',
                    Sense: 'Important',
                    Relations: 'Somewhat important',
                    Journey: 'Not in the focus',
                    Love: 'Least important'
                };
        
                const numericRankings = Object.keys(importanceRankings).reduce((acc, key) => {
                    const importanceScale = {
                        'Most important': 6,
                        'Very important': 5,
                        'Important': 4,
                        'Somewhat important': 3,
                        'Not in the focus': 2,
                        'Least important': 1
                    };
                    acc[key] = importanceScale[importanceRankings[key]];
                    return acc;
                }, {});
        
                chai.request(server)
                    .post(`/api/boarding/4`)
                    .set('Authorization', `Bearer ${userToken}`)
                    .send(numericRankings)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.message.should.equal('Data received successfully');
                        done();
                    });
            });
        }).timeout(10000);
    });    

    describe('Action Listing and Update', () => {
        context('Listing Actions', () => {
            it('should list all available actions', (done) => {
                chai.request(server)
                    .get('/api/admin/action/list')
                    .set('Authorization', `Bearer ${userToken}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('array');
                        if (res.body.length > 0) {
                            actionId = res.body[0]._id; // Save an action ID for later use
                        }
                        done();
                    });
            });
        });

        context('Marking an Action as Done', () => {
            it('should mark an action as done', (done) => {
                if (!actionId) {
                    done(new Error('No actionId to test with'));
                    return;
                }

                chai.request(server)
                    .post('/api/mark-as-done')
                    .set('Authorization', `Bearer ${userToken}`)
                    .send({ actionId: actionId })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Action marked as done');
                        done();
                    });
            });
        });
    });
});
