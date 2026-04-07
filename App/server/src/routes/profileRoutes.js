const express = require('express');
const router = express.Router();
const createProfile = require('../services/profileServices')


////using /:uid as dynamic parameter to create profile
router.post('/:uid', async (req, res) =>{
    try{
        console.log(typeof req.body, req.body);
        const profile = await createProfile(req.params.uid, req.body);
        res.json(profile);
    }catch (error) {
        console.log(error);
        res.status(500).json('Invalid Credentials')
    }
})

//using /:uid as dynamic parameter to read profile
router.get('/:uid', (req, res) => {
    res.send('placeholder');
});

////using /:uid as dynamic parameter to edit profile
router.patch('/:uid', (req, res) => {
    res.send('placeholder');
});

////using /:uid as dynamic parameter to delete profile
router.delete('/:uid', (req, res) => {
    res.send('placeholder');
});

module.exports = router;