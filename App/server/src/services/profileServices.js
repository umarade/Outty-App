const { db } = require('./firebase');

async function createProfile (uid, profileData){
    try{
       const docRef = db.collection('profiles').doc(uid);
       const doc = await docRef.get();
       if(doc.exists){
          return ('doc exists')
       }
          await docRef.set(profileData);
          return ('profile created');
    }catch (error) {
        console.log(error)
       return ('invalid data')
    }
};

module.exports = createProfile;
