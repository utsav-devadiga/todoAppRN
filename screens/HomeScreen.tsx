import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Keyboard, RefreshControl } from 'react-native'
import { NavigationProp } from '@react-navigation/native'
import { FIREBASE_AUTH } from '../utils/FirebaseConfig'
import { getAllTodos, Todo } from '../api/ApiService';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AddTodoComponent from '../components/AddTodo';
import TodoComponent from '../components/TodoComponent';
import Calendar from '../components/CalendarComponent';
import { Ionicons } from '@expo/vector-icons';
import TaskCard from '../components/TaskCard';
import moment from 'moment';

interface RouterProps {
    navigation: NavigationProp<any, any>
}

const HomeScreen = ({ navigation }: RouterProps) => {

    const [refreshing, setRefreshing] = useState(false);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [upComingTodo, setupComingTodo] = useState<Todo[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>("Oops! Something went wrong.");


    const fetchTodos = async () => {
        try {
            const today = moment();
            today.utcOffset(0, true);
            const localDate = today.format('DD-MM-YYYY');
            console.log(localDate);
            const data = await getAllTodos(FIREBASE_AUTH.currentUser?.uid);
            if (data && data.todo) {  // Check if data and data.todo are defined
                const filteredTodos = data.todo.filter(todo => todo.deadline === localDate);

                const upComingTodos = data.todo.filter(todo => todo.deadline > localDate).sort((a, b) => a.id - b.id);


                const sortedTodo = filteredTodos.sort((a, b) => a.id - b.id);
                setupComingTodo(upComingTodos)
                setTodos(sortedTodo);  // Use data.todo instead of data.data
                setIsLoading(false);
                setError(null); // Set error to null when data fetch is successful
                if (data.todo.length == 0) {
                    setError("No Todos available!")
                }
            } else {
                //console.log(data); // It's helpful to log the data to ensure structure
                setTodos([]);  // Set to empty array if data.todo is undefined
                setError('No todos found or bad data structure');
            }
            setIsLoading(false);
            closeSheet();
        } catch (err) {
            console.error('Error fetching todos:', err); // Log the error to console for debugging
            setError('Failed to fetch todos');
            setIsLoading(false);
        }
    };


    const onRefresh = useCallback(async () => {
        setRefreshing(true);

        try {
            fetchTodos();
        } catch (error) {
            console.error(error);
        }
        setRefreshing(false);
    }, []);

    useEffect(() => {
        fetchTodos();
    }, []);

    // ref
    const bottomSheetRef = useRef<BottomSheet>(null);

    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    const snapPoints = useMemo(() => ['100%'], []);


    const openSheet = () => {
        bottomSheetRef.current?.expand();
    };

    const closeSheet = () => {

        bottomSheetRef.current?.close();
    };


    if (isLoading) {
        return <ActivityIndicator size="large" color="grey" style={{ flex: 1 }} />;
    }

    const errorView = <View style={{
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    }}>
        <Text>{error}</Text>
    </View>;

    if (error) {
        return (errorView)
    }

    return (
        <View style={styles.container}>
            <GestureHandlerRootView style={{ flex: 1, }}>
                <KeyboardAvoidingView style={{ flex: 1, }}>

                    <TaskCard
                        title={'Today\'s Tasks'}
                        todos={todos}
                        error={error}
                        refreshing={refreshing}
                        onRefresh={fetchTodos}
                        onAddTask={openSheet}
                    />

                    <TaskCard
                        title={'Upcoming Tasks'}
                        todos={upComingTodo}
                        error={error}
                        refreshing={refreshing}
                        onRefresh={fetchTodos}
                        onAddTask={openSheet}
                    />

                    <TouchableOpacity
                        style={styles.fab}
                        onPress={openSheet}
                    >
                        <Text style={styles.fabIcon}>+</Text>
                    </TouchableOpacity>

                    <BottomSheet
                        enablePanDownToClose={true}
                        keyboardBehavior='interactive'
                        style={styles.sheet}
                        ref={bottomSheetRef}
                        index={-1}
                        snapPoints={snapPoints}
                        onChange={handleSheetChanges}>
                        <View style={styles.contentContainer}>
                            <AddTodoComponent onAdded={() => {
                                closeSheet();
                                fetchTodos();
                            }} />

                            <Ionicons
                                style={styles.fabclose}
                                name='close'
                                size={24}
                                color='#1f2937'
                                onPress={closeSheet} />

                        </View>
                    </BottomSheet>
                </KeyboardAvoidingView>
            </GestureHandlerRootView>
        </View>

    );
};


const styles = StyleSheet.create({
    sheet: {
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',

    },
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        right: 20,
        bottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        borderRadius: 28,
        elevation: 18
    },
    fabclose: {
        position: 'absolute',
        right: 10,
        top: 10,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fabIcon: {
        fontSize: 24,
        color: 'white'
    },
    fabIconclose: {
        fontSize: 12,
        color: 'grey'
    },
    todoList: {
        marginTop: 4
    },
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
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    taskText: {
        marginLeft: 8,
        fontSize: 16,
    },
    completedTaskText: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
})



export default HomeScreen;