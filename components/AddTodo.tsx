import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Keyboard, TouchableOpacity, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Todo, postTodo } from '../api/ApiService';
import { FIREBASE_AUTH } from '../utils/FirebaseConfig';


interface TODOProps {
    onAdded: () => void;
}

const AddTodoComponent: React.FC<TODOProps> = ({ onAdded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [date, setDate] = useState('');

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('Medium');
    const [items, setItems] = useState([
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' }
    ]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [userid, setUserid] = useState(FIREBASE_AUTH.currentUser?.uid || 'default-user-id');


    const [isValidDate, setIsValidDate] = useState<boolean>(true);

    const validateAndConvertDate = (input: string): void => {
        // Regex to check if the date format is YYYY-MM-DD
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (dateRegex.test(input)) {
            const timestamp = Date.parse(input);

            if (!isNaN(timestamp)) {
                setIsValidDate(true);
                //Alert.alert("Valid Date", `The date ${input} is valid.`);
                // Convert to Date object if needed here
                const date = new Date(timestamp);
                console.log(date); // Further processing can be done with the Date object
            } else {
                setError("Invalid Date, the date is formatted correctly but is not valid.");
                // Alert.alert("Invalid Date", "The date is formatted correctly but is not valid.");
            }
        } else {
            setError("Invalid Date, the date is formatted correctly but is not valid.");
            // Alert.alert("Invalid Format", "Please enter the date in YYYY-MM-DD format.");
        }
    };

    const handleAddTodo = async () => {
        const todoData = {
            about: description,
            deadline: date,
            id: 0,
            name: title,
            priority: value.toUpperCase(),
            status: 1,
            statusTimestamp: "",
            userid: userid,
        };


        try {
            setIsLoading(true);
            const result = await postTodo(todoData);
            console.log('Todo Added:', result);
            Keyboard.dismiss();
            // Optionally reset form or navigate away
            resetData();
            onAdded();

        } catch (error) {
            console.error('Failed to add todo:', error);
            setError('Failed to add todo');
        } finally {
            setIsLoading(false);
        }
    };

    function resetData() {

        setTitle("")
        setValue("")
        setError("")
        setIsLoading(false)
        setDate("")
        setDescription("")
    }

    const handleDateChange = (text: string) => {
        const newText = text.replace(/[^0-9]/g, ''); // Removes non-numeric characters
        let formattedText = '';
    
        // Automatically insert dashes after the day and month parts
        if (newText.length > 4) {
            // If more than four digits, format as DD-MM-YYYY
            formattedText = `${newText.slice(0, 2)}-${newText.slice(2, 4)}-${newText.slice(4)}`;
        } else if (newText.length === 4) {
            // When exactly four digits are entered, add the second dash immediately
            formattedText = `${newText.slice(0, 2)}-${newText.slice(2)}-`;
        } else if (newText.length > 2) {
            // When more than two but less than four digits are entered, format as DD-MM
            formattedText = `${newText.slice(0, 2)}-${newText.slice(2)}`;
        } else if (newText.length === 2) {
            // When exactly two digits are entered, add the first dash immediately
            formattedText = `${newText}-`;
        } else {
            // No dashes needed if the length is less than 2
            formattedText = newText;
        }
    
        setDate(formattedText); // Update the state with the formatted text
    };
    
    
    
    
    


    return (
        <View style={styles.container}>
            <View style={{ margin: 16 }}>
                <Text style={styles.heading}>Add Todo</Text>
                <Text style={styles.label}>Title</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                />
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={styles.textArea}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                />
                <Text style={styles.label}>Due Date</Text>
                <TextInput
                    style={styles.input}
                    placeholder="dd-mm-yyy"
                    value={date}
                    onChangeText={(text) => { handleDateChange(text) }}
                    
                    maxLength={10}
                    inputMode='numeric'
                />
                <Text style={styles.label}>Priority</Text>
                <DropDownPicker
                    style={styles.picker}
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    textStyle={styles.pickerItem}
                />

                <TouchableOpacity style={styles.button} onPress={handleAddTodo}>
                    <Text style={styles.buttonText}>Add Todo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onAdded}>
                    <Text style={styles.label_back}>Back to Todos</Text>
                </TouchableOpacity>

                {isLoading && <Text>Loading...</Text>}
                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
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
    textArea: {
        fontSize: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 15,
        borderRadius: 5,
        backgroundColor: '#fff',
        height: 80,
    },
    picker: {
        height: 50,
        width: '100%',
        fontSize: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 15,
        borderRadius: 5,
        backgroundColor: '#fff',

    },
    pickerItem: {
        fontSize: 15,
        color: 'grey',
        borderColor: "#ccc"
    },
    errorText: {
        color: 'red',
        marginTop: 10
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
    label: {
        fontSize: 16,
        marginBottom: 5
    },
    label_back: {
        alignSelf: 'center',
        fontSize: 16,
        marginBottom: 5,
        textDecorationLine: 'underline'
    }



});

export default AddTodoComponent;
