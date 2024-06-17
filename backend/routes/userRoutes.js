import express from 'express';
import {
    signupUser,
    loginUser,
    logoutUser,
    followUser,
    updateUser,
    getUserProfile,
    getSuggestedUsers,
    freezeAccount,
    searchUser,
    forgotPassword,
    verifyResetPasswordToken,
    resetPassword,
    changePassword,
    getLikedAndRepostedUsers,
    getFollowingsAndFollowers,
} from '../controllers/userController.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

// Search user
router.get('/search/:query', searchUser);

// Get profile
router.get('/profile/:query', getUserProfile);

router.get('/liked-reposted/:postId', getLikedAndRepostedUsers);

router.get('/suggested', protectRoute, getSuggestedUsers);

router.get('/follows/:id', protectRoute, getFollowingsAndFollowers);

// Sign up
router.post('/signup', signupUser);

// Login
router.post('/login', loginUser);

// Logout
router.post('/logout', logoutUser);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Verify reset password token
router.get('/reset-password/:userid/:token', verifyResetPasswordToken);

// Reset password
router.post('/reset-password/:userid/:token', resetPassword);

// Change password
router.post('/change-password', protectRoute, changePassword);

// Follow/unfollow
router.post('/follow/:id', protectRoute, followUser); // protectRoute use to prevent non login user from following/unfollowing

// Update user
router.put('/update/:id', protectRoute, updateUser);

router.put('/freeze', protectRoute, freezeAccount);

export default router;
