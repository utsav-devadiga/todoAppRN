import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Todo } from '../api/ApiService';
import TodoComponent from './TodoComponent';

interface TaskCardProps {
    title: string;
    todos: Todo[];
    error: string | null;
    onAddTask: () => void;
    refreshing: boolean;
    onRefresh: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ title, todos, error, refreshing, onAddTask, onRefresh }) => {
    const errorView = (
        <View style={styles.center}>
            <Text>{error}</Text>
        </View>
    );

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.headerText}>{title}</Text>
                <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{todos.length} tasks</Text>
                </View>
                <TouchableOpacity onPress={onAddTask} style={styles.addButton}>
                    <Ionicons name="add" size={24} color="black" />
                </TouchableOpacity>
            </View>
            {todos.length > 0 ? (
                <FlatList
                    style={styles.todoList}
                    data={todos}
                    keyExtractor={(item) => item.id.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    renderItem={({ item }) => (
                        <TodoComponent item={item}
                            onDelete={onRefresh}
                            onToggleStatus={onRefresh} />
                    )}
                />
            ) : (
                errorView
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        marginHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    badgeContainer: {
        backgroundColor: '#fff',
        borderColor: '#D5D8DE',
        borderWidth: 1,
        borderRadius: 15,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginHorizontal: 8, // Adjust spacing between text and badge
    },
    badgeText: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#6B7280'
    },
    addButton: {

    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    todoList: {
        marginTop: 4
    },
});

export default TaskCard;
