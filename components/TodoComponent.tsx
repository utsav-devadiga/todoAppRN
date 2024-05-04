import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or any other icon library
import TouchableScale from "react-native-touchable-scale";
import { Ionicons } from '@expo/vector-icons';
import { Todo, deleteTodo, updateTodo } from '../api/ApiService';

type TodoComponentProps = {
    item: Todo;
    onDelete: (id: number) => void;
    onToggleStatus: (id: number) => void;
};

const TodoComponent: React.FC<TodoComponentProps> = ({ item, onDelete, onToggleStatus }) => {
    // Initialize the checked state based on the item's status
    const [checked, setChecked] = useState(item.status === 2);

    // Update the checked state when the item's status changes
    useEffect(() => {
        setChecked(item.status === 2);
    }, [item.status]); // Dependency array ensures this effect runs only when item.status changes

    const deleteItem = async () => {
        try {
            const result = await deleteTodo(item.id);
            console.log('Todo deleted:', result);
            onDelete(item.id);
        } catch (error) {
            console.error('Failed to delete todo:', error);
        }
    };

    const updateItem = async () => {
        const newStatus = item.status === 1 ? 2 : 1;
        try {
            const updatedItem = { ...item, status: newStatus };
            const result = await updateTodo(item.id, updatedItem);
            console.log('Todo updated:', result);
            onToggleStatus(item.id);
            setChecked(newStatus === 2);
        } catch (error) {
            console.error('Failed to update todo:', error);
        }
    };

    return (
        <TouchableScale
            style={styles.container}
            activeScale={0.9}
            tension={10}
            onPress={updateItem}
        >
            <Ionicons
                name={checked ? 'checkbox' : 'square-outline'}
                size={24}
                color="black"
            />
            <Text style={[styles.text, checked && styles.completedText]}>{item.name}</Text>
            <Icon
                name="delete-outline"
                size={24}
                color="#6B7280"
                style={styles.deleteIcon}
                onPress={deleteItem}
            />
        </TouchableScale>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        marginVertical: 4,
    },
    text: {
        flex: 1,
        marginLeft: 8,
        fontSize: 15,
        color: '#1f2937',
    },
    completedText: {
        textDecorationLine: 'line-through',
    },
    deleteIcon: {
        position: 'absolute',
        right: 15,
    },
});

export default TodoComponent;
