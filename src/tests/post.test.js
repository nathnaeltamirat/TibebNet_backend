const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const Post = require('../models/post.model');
const Like = require('../models/like.model');
const User = require('../models/user.model');

let testUser;
let authToken;
let testPost;

// Connect to test database before running tests
beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
    
    // Create a test user
    testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
    });

    // Get auth token for the test user
    const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'test@example.com',
            password: 'password123'
        });
    
    authToken = loginResponse.body.token;
});

// Clean up after each test
afterEach(async () => {
    await Post.deleteMany({});
    await Like.deleteMany({});
});

// Disconnect from database after all tests
afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
});

describe('Post API', () => {
    describe('Create Post', () => {
        it('should create a new post', async () => {
            const response = await request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    content: 'Test post content',
                    image: 'https://example.com/image.jpg'
                });

            expect(response.status).toBe(201);
            expect(response.body.status).toBe('success');
            expect(response.body.data.content).toBe('Test post content');
            expect(response.body.data.image).toBe('https://example.com/image.jpg');
            expect(response.body.data.author).toBeDefined();
        });

        it('should not create post without content', async () => {
            const response = await request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    image: 'https://example.com/image.jpg'
                });

            expect(response.status).toBe(400);
        });
    });

    describe('Get Posts', () => {
        beforeEach(async () => {
            // Create some test posts
            await Post.create([
                {
                    content: 'Post 1',
                    author: testUser._id
                },
                {
                    content: 'Post 2',
                    author: testUser._id
                }
            ]);
        });

        it('should get all posts with pagination', async () => {
            const response = await request(app)
                .get('/api/posts?page=1&limit=10');

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.results).toBe(2);
            expect(response.body.data.length).toBe(2);
        });

        it('should get a specific post', async () => {
            const post = await Post.findOne({ content: 'Post 1' });
            const response = await request(app)
                .get(`/api/posts/${post._id}`);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.data.content).toBe('Post 1');
        });
    });

    describe('Update Post', () => {
        beforeEach(async () => {
            testPost = await Post.create({
                content: 'Original content',
                author: testUser._id
            });
        });

        it('should update a post', async () => {
            const response = await request(app)
                .patch(`/api/posts/${testPost._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    content: 'Updated content'
                });

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.data.content).toBe('Updated content');
        });

        it('should not update other user\'s post', async () => {
            const otherUser = await User.create({
                name: 'Other User',
                email: 'other@example.com',
                password: 'password123'
            });

            const otherPost = await Post.create({
                content: 'Other post',
                author: otherUser._id
            });

            const response = await request(app)
                .patch(`/api/posts/${otherPost._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    content: 'Trying to update'
                });

            expect(response.status).toBe(403);
        });
    });

    describe('Delete Post', () => {
        beforeEach(async () => {
            testPost = await Post.create({
                content: 'Post to delete',
                author: testUser._id
            });
        });

        it('should delete a post', async () => {
            const response = await request(app)
                .delete(`/api/posts/${testPost._id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(204);

            const deletedPost = await Post.findById(testPost._id);
            expect(deletedPost).toBeNull();
        });
    });
});

describe('Like API', () => {
    beforeEach(async () => {
        testPost = await Post.create({
            content: 'Post to like',
            author: testUser._id
        });
    });

    it('should like a post', async () => {
        const response = await request(app)
            .post(`/api/posts/${testPost._id}/like`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(201);
        expect(response.body.status).toBe('success');
        expect(response.body.liked).toBe(true);

        const updatedPost = await Post.findById(testPost._id).populate('likes');
        expect(updatedPost.likes.length).toBe(1);
    });

    it('should unlike a post', async () => {
        // First like the post
        await request(app)
            .post(`/api/posts/${testPost._id}/like`)
            .set('Authorization', `Bearer ${authToken}`);

        // Then unlike it
        const response = await request(app)
            .post(`/api/posts/${testPost._id}/like`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.liked).toBe(false);

        const updatedPost = await Post.findById(testPost._id).populate('likes');
        expect(updatedPost.likes.length).toBe(0);
    });

    it('should get likes for a post', async () => {
        // First like the post
        await request(app)
            .post(`/api/posts/${testPost._id}/like`)
            .set('Authorization', `Bearer ${authToken}`);

        const response = await request(app)
            .get(`/api/posts/${testPost._id}/likes`);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.results).toBe(1);
        expect(response.body.data[0].user._id.toString()).toBe(testUser._id.toString());
    });
}); 