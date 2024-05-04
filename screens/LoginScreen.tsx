import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../utils/FirebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { NavigationProp } from '@react-navigation/native';

interface RouterProps {
    navigation: NavigationProp<any, any>
}
const LoginScreen = ({ navigation }: RouterProps) => {

    const [email, setEmail] = useState('');
    const [password, setpassword] = useState('');
    const [loading, setloading] = useState(false);

    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setloading(true);

        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
            alert('Sign in success')
        } catch (error: any) {
            console.log(error)
            alert('Sign in failed: ' + error.message)
        } finally {
            setloading(false)
        }

    }


    return (
        <KeyboardAvoidingView behavior='padding' style={{ flex: 1, backgroundColor: "#fff" }}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Login</Text>
                <Text style={styles.description}>Sign in to your account to continue.</Text>

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    placeholder='Email'
                    onChangeText={(text) => setEmail(text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    placeholder='Password'
                    onChangeText={(text) => setpassword(text)}
                    secureTextEntry={true}
                />

                <TouchableOpacity style={styles.button} onPress={signIn}>
                    {loading ? (
                        <ActivityIndicator color="#fff" /> // Show loading animation
                    ) : (
                        <Text style={styles.buttonText}>Login</Text> // Show button text
                    )}
                </TouchableOpacity>

                <View style={styles.signupTextContainer}>
                    <Text style={styles.signupText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
                        <Text style={styles.signupLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>

    );
}

export default LoginScreen

const styles = StyleSheet.create({

    container: {
        backgroundColor: "#fff",
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center'
    },
    label: {
        fontSize: 16,
        marginBottom: 5
    },
    input: {
        fontSize: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 15,
        borderRadius: 5,
        backgroundColor: '#fff'
    },
    button: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    signupTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    },
    signupText: {
        fontSize: 14,
        color: '#666'
    },
    signupLink: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: 'bold'
    }

})