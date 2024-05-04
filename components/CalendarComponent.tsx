import React, { useState, useMemo } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import moment from 'moment';

interface DateItemProps {
    item: {
        key: string;
        day: string;
        date: number;
        selected: boolean;
    };
}

const DateItem: React.FC<DateItemProps> = ({ item }) => {
    const itemStyle = item.selected ? styles.selectedDateItem : styles.dateItem;
    const itemtextDateStyle = item.selected ? styles.selectedDateText : styles.dateText;
    const itemtextdayStyle = item.selected ? styles.selectedDayText : styles.dayText;

    return (
        <View style={itemStyle}>
            <Text style={itemtextDateStyle}>{item.date}</Text>
            <Text style={itemtextdayStyle}>{item.day}</Text>
        </View>
    );
};

interface DateHeaderProps {
    month: string;
    onNextWeek: () => void;
    onPreviousWeek: () => void;
}

const DateHeader: React.FC<DateHeaderProps> = ({ month, onNextWeek, onPreviousWeek }) => (
    <View style={styles.header}>
        <TouchableOpacity onPress={onPreviousWeek}>
            <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{month}</Text>
        <TouchableOpacity onPress={onNextWeek}>
            <AntDesign name="right" size={24} color="black" />
        </TouchableOpacity>
    </View>
);

const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState<moment.Moment>(moment());

    const weekDays = useMemo(() => {
        let startOfWeek = currentDate.clone().startOf('week');
        let days = [];
        for (let i = 0; i < 7; i++) {
            let day = startOfWeek.clone().add(i, 'days');
            days.push({
                key: day.format('YYYY-MM-DD'),
                day: day.format('ddd').toUpperCase(),
                date: day.date(),
                selected: day.isSame(moment(), 'day'),
            });
        }
        return days;
    }, [currentDate]);

    const onNextWeek = () => {
        setCurrentDate(currentDate.clone().add(1, 'week'));
    };

    const onPreviousWeek = () => {
        setCurrentDate(currentDate.clone().subtract(1, 'week'));
    };

    return (
        <View style={{ marginTop: 10,marginHorizontal:12 }} >
            {  /*  <DateHeader
                month={currentDate.format('MMMM YYYY')}
                onNextWeek={onNextWeek}
                onPreviousWeek={onPreviousWeek}
            /> */
            }
            <FlatList

                bounces={false}
                horizontal
                data={weekDays}
                renderItem={({ item }) => <DateItem item={item} />}
                keyExtractor={item => item.key}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: 'white'
    },
    headerText: {
        fontSize: 20
    },
    dateItem: {
        width: 43,
        paddingVertical: 6,
        paddingHorizontal: 6,
        marginHorizontal: 5,
        alignItems: 'center',
        borderRadius: 40,
        backgroundColor: '#D7E8FF',
        alignContent: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    selectedDateItem: {
        width: 43,
        paddingVertical: 6,
        paddingHorizontal: 6,
        marginHorizontal: 5,
        alignItems: 'center',
        backgroundColor: '#023574',
        borderRadius: 40,
        alignContent: 'center',
        justifyContent: 'center',
        alignSelf: 'center'

    },
    selectedDateText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        alignContent: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    selectedDayText: {
        color: 'white',
        fontSize: 10
    },
    dateText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#023574',
        alignContent: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    dayText: {
        color: '#023574',
        fontSize: 10
    }
});

export default Calendar;
