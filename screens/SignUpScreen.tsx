import { NavigationProp } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { FIREBASE_AUTH } from '../utils/FirebaseConfig';

interface SignUpDetails {
    name: string;
    email: string;
    password: string;
}

interface RouterProps {
    navigation: NavigationProp<any, any>
}
const SignUpScreen = ({ navigation }: RouterProps) => {

    const auth = FIREBASE_AUTH;

    const [signUpDetails, setSignUpDetails] = useState<SignUpDetails>({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setloading] = useState(false);


    const handleInputChange = (value: string, field: keyof SignUpDetails) => {
        setSignUpDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleSignUp = async () => {
        setloading(true);

        try {
            const response = await createUserWithEmailAndPassword(auth, signUpDetails.email, signUpDetails.password);
            console.log(response);

        } catch (error: any) {
            alert(error.message)
            console.log(error)


        } finally {
            setloading(false)
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.description}>Create a new account to get started.</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                placeholder="John Doe"
                onChangeText={text => handleInputChange(text, 'name')}
                value={signUpDetails.name}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="john@example.com"
                onChangeText={text => handleInputChange(text, 'email')}
                value={signUpDetails.email}
                keyboardType="email-address"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={text => handleInputChange(text, 'password')}
                value={signUpDetails.password}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                {loading ? (
                    <ActivityIndicator color="#fff" /> // Show loading animation
                ) : (
                    <Text style={styles.buttonText}>Sign in</Text> // Show button text
                )}
            </TouchableOpacity>

            <View style={styles.loginTextContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}>Log In</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
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
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    loginTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    },
    loginText: {
        fontSize: 14,
        color: '#666'
    },
    loginLink: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: 'bold'
    }
});

export default SignUpScreen;
