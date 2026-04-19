import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, DocumentData } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { RootStackParamList } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Signup'>;
};

const ADVENTURE_TYPES = ['Hiking', 'Kayaking', 'Rock Climbing', 'Skiing', 'Backpacking', 'Camping', 'Cycling', 'Surfing', 'Mountaineering', 'Travel'];
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const ATTITUDES = ['Relaxed', 'Moderate', 'Intense', 'Extreme'];
const TOTAL_STEPS = 4;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GREEN = '#2D9B6F';

export default function SignupScreen({ navigation }: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [nameErr, setNameErr] = useState('');
  const [ageErr, setAgeErr] = useState('');
  const [locationErr, setLocationErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');

  const [adventures, setAdventures] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState('');
  const [attitude, setAttitude] = useState('');
  const [maxDistance, setMaxDistance] = useState(50);

  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');

  const validateStep1 = (): boolean => {
    let valid = true;
    if (!name.trim()) { setNameErr('Required'); valid = false; } else setNameErr('');
    if (!age.trim()) { setAgeErr('Required'); valid = false; }
    else if (isNaN(Number(age)) || Number(age) < 18) { setAgeErr('Must be 18+'); valid = false; }
    else setAgeErr('');
    if (!location.trim()) { setLocationErr('Required'); valid = false; } else setLocationErr('');
    if (!email.trim()) { setEmailErr('Required'); valid = false; }
    else if (!EMAIL_REGEX.test(email)) { setEmailErr('Enter a valid email'); valid = false; }
    else setEmailErr('');
    if (!password) { setPasswordErr('Required'); valid = false; }
    else if (password.length < 6) { setPasswordErr('At least 6 characters'); valid = false; }
    else setPasswordErr('');
    return valid;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 3 && (!skillLevel || !attitude)) {
      Alert.alert('Selection Required', 'Please select a skill level and adventure attitude.');
      return;
    }
    setStep(step + 1);
  };

  const toggleAdventure = (item: string) => {
    setAdventures((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name.trim() });

      const userData: DocumentData = {
        uid: user.uid,
        email: email.trim(),
        name: name.trim(),
        age: Number(age),
        location: location.trim(),
        bio: bio.trim(),
        adventures,
        skillLevel,
        attitude,
        maxDistance,
        social: { instagram: instagram.trim(), facebook: facebook.trim(), twitter: twitter.trim() },
        role: 'user',
        provider: 'email',
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      Alert.alert('Success', 'Account created! You can now log in.');
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (err: any) {
      const code = err.code ?? '';
      if (code === 'auth/email-already-in-use') Alert.alert('Error', 'Email already in use.');
      else Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  // ... (Remainder of the render logic remains similar but with single quotes and standard spacing)
}
// Styles omitted for brevity but should follow the pattern in MessagingScreen