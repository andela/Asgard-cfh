// import should from 'should';
// import mongoose from 'mongoose';
// import supertest from 'supertest';
// import app from '../../server';

// let token;
// const token2 = 'hjbjbjbfjbjbjhfbhbvbrjbbhjbhyurrhbub4urghubjbhbrbjruybhb';

// // Request handler for making API calls
// const request = supertest(app);

// describe('Authentication', () => {
// <<<<<<< HEAD
//   describe('Signup', () => {
//     it('should create a new User', (done) => {
//       request
//         .post('/api/auth/signup')
//         .send({
//           name: 'Fidelis clinton',
//           email: 'clint@example.com',
//           password: 'clint2016'
//         })
//         .expect(201)
//         .end((err, res) => {
//           token = res.body.token;
//           if (err) {
//             return done(err);
//           }
//           (res.body.message).should.be.eql('Signed up successfully, please check email for activation link');
// =======
//   describe('Test for signup with an invalid password', () => {
//     it('Should flag invalid password errors', (done) => {
//       request
//         .post('/api/auth/signup')
//         .send({
//           name: 'tajudeen',
//           email: 'were@taju.com',
//           password: 'qq'
//         })
//         .end((err, res) => {
//           should(res.body.errors[0].msg).equal('passwords must be at least 6 chars long and contain one number');
//           should(res.status).equal(422);
//           if (err) return done(err);
// >>>>>>> 25926f6fe686fe3ae09f4f627cb1e895f19d4e21
//           done();
//         });
//     });
//   });

// <<<<<<< HEAD
//   describe('confirmEmail', () => {
//     it('Should fail if activation link is expired', (done) => {
//       request
//         .get(`/activate/${token2}`)
//         .end((err, res) => {
//           if (err) {
//             return done(err);
//           }
//           (res.body.message).should.be.eql('Activation link has expired');
// =======
//   describe('Test for signup with an invalid name', () => {
//     it('Should flag invalid name errors', (done) => {
//       request
//         .post('/api/auth/signup')
//         .send({
//           name: 'q',
//           email: 'were@taju.com',
//           password: 'qq11ggttre'
//         })
//         .end((err, res) => {
//           should(res.body.errors[0].msg).equal('name must be a minimum of two letters');
//           should(res.status).equal(422);
//           if (err) return done(err);
// >>>>>>> 25926f6fe686fe3ae09f4f627cb1e895f19d4e21
//           done();
//         });
//     });
//   });

// <<<<<<< HEAD
//   describe('confirmEmail', () => {
//     it('confirm users email', (done) => {
//       request
//         .get(`/activate/${token}`)
//         .end((err, res) => {
//           if (err) {
//             return done(err);
//           }
//           (res.status).should.be.eql(302);
// =======
//   describe('Test for signup with an invalid email', () => {
//     it('Should flag invalid email errors', (done) => {
//       request
//         .post('/api/auth/signup')
//         .send({
//           name: 'tajudeen',
//           email: 'com',
//           password: 'hgfh64gt45qq'
//         })
//         .end((err, res) => {
//           should(res.body.errors[0].msg).equal('please enter a valid email');
//           should(res.status).equal(422);
//           if (err) return done(err);
// >>>>>>> 25926f6fe686fe3ae09f4f627cb1e895f19d4e21
//           done();
//         });
//     });
//   });

// <<<<<<< HEAD
//   describe('Login', () => {
//     it('should log in an existing user', (done) => {
//       request
//         .post('/api/auth/login')
//         .send({
//           email: 'clint@example.com',
//           password: 'clint2016',
//         })
//         .expect(200)
//         .end((err, res) => {
//           if (err) {
//             return done(err);
//           }
//           (res.body.message).should.be.eql('Logged in Successfully');
//           should(res.body).have.property('token');
//           done();
//         });
//     });
//   });

//   after((done) => {
//     mongoose.connection.db.dropCollection('users')
//       .then(() => done());
// =======
//   describe('Test for signup with an existing email', () => {
//     it('Should flag duplicate email errors', (done) => {
//       request
//         .post('/api/auth/signup')
//         .send({
//           name: 'tajudeen',
//           email: 'olatunjiyso@gmail.com',
//           password: 'hgfh64gt45qq'
//         })
//         .end((err, res) => {
//           should(res.body.message).equal('this email is in use already');
//           should(res.status).equal(409);
//           if (err) return done(err);
//           done();
//         });
//     });
// >>>>>>> 25926f6fe686fe3ae09f4f627cb1e895f19d4e21
//   });
// });
