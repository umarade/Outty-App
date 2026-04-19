import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
  Image
} from 'react-native';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase';

type Message = {
  id: string;
  message?: string;
  sentAt?: any;
};

export default function MessagingScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'user-message'), orderBy('sentAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messageList as Message[]);
    });
    return () => unsubscribe();
  }, []);

  const saveMessageToDb = async () => {
    if (!messageInput.trim()) return;
    try {
      setLoading(true);
      await addDoc(collection(db, 'user-message'), {
        message: messageInput,
        sentAt: serverTimestamp(),
      });
      setMessageInput('');
    } catch (error) {
      Alert.alert('Error', 'Could not send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text>Back</Text>
        </TouchableOpacity>

        <View style={styles.topBar}>
          <View style={styles.profileImageOuterDiv}>
            <Image
              source={require('../temp-images/hiker_stock.png')}
              style={styles.profileImage}
            />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>John Doe</Text>
            <Text>Online</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.messagesOuterContainer}>
          <ScrollView showsVerticalScrollIndicator contentContainerStyle={styles.messagesScrollContent}>
            {messages.map((item) => (
              <View key={item.id} style={styles.messageWrapper}>
                <View style={styles.outgoingGroup}>
                  <View style={styles.outgoingMessage}>
                    <Text style={styles.whiteText}>{item.message ?? ''}</Text>
                  </View>
                  <Text style={styles.messageTimestamp}>
                    {item.sentAt?.toDate
                      ? item.sentAt.toDate().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                      : 'Sending...'}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageTextInput}
            placeholder="Type message here..."
            value={messageInput}
            onChangeText={setMessageInput}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={saveMessageToDb}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send Message'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e8f5f0', justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', width: '90%', borderRadius: 20, padding: 20 },
  backBtn: { marginBottom: 10 },
  topBar: { flexDirection: 'row', alignItems: 'center' },
  profileImageOuterDiv: { marginRight: 15 },
  profileImage: { width: 50, height: 50, borderRadius: 25 },
  userInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  messagesOuterContainer: { height: 300 },
  messagesScrollContent: { paddingVertical: 10 },
  messageWrapper: { marginBottom: 15, marginRight: 20 },
  outgoingGroup: { alignItems: 'flex-end' },
  outgoingMessage: { backgroundColor: '#2D9B6F', padding: 10, borderRadius: 15 },
  whiteText: { color: '#fff' },
  messageTimestamp: { fontSize: 10, color: '#888', marginTop: 4 },
  inputContainer: { marginBottom: 20 },
  messageTextInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10 },
  button: { backgroundColor: '#2D9B6F', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});