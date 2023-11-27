import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const WIDTH = Dimensions.get('window').width;

export default function DateTime({ data, appearance, getValue }) {
    const [isDatePickerVisible, setIsDatePickerVisible] = React.useState(false);
    const [date, setDate] = React.useState();

    const showDatePicker = () => {
        setIsDatePickerVisible(true);
    };

    const hideDatePicker = () => {
        setIsDatePickerVisible(false);
    };

    const handleDatePicker = date => {
        setDate(date);
        hideDatePicker();
    };
    return (
        <View>
            <TouchableOpacity
                style={{
                    height: 48,
                    borderRadius: 10,
                    width: WIDTH * 0.8,
                    paddingHorizontal: 10,
                    marginTop: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: '#000000',
                    backgroundColor: '#FFFFFF',
                    borderColor: '#000000',
                    borderWidth: 1,
                }}
                onPress={showDatePicker}>
                {date ? (
                    <Text style={{ fontWeight: '600' }}>
                        {/* {moment(date).format('DD MMMM YYYY')} */}
                        {DateTimeFormat(date)}
                    </Text>
                ) : (
                    <Text style={{ color: 'grey' }}>Tanggal</Text>
                )}
            </TouchableOpacity>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDatePicker}
                onCancel={hideDatePicker}
            />
        </View>
    );
}
