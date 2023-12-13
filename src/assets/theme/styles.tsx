import { StyleSheet } from "react-native";
import colors from "./colors";

export const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        color: colors.dark,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
        color: '#3e3e3e',
        fontSize: 18,

    },
    input: {
        width: 300,
        height: 40,
        borderColor: colors.primary,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
        paddingLeft: 10,
        color: colors.dark
    },
    inputRemark: {
        height: 40,
        borderWidth: 2,
        borderColor: colors.accent_primary,
        borderRadius: 10,
        marginBottom: 10,
        paddingLeft: 10,
        color: colors.dark
    },
    button: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        maxHeight: 40,
        borderRadius: 10,
        marginTop: 10,
        backgroundColor: colors.primary,

    },
    passwordContainer: {
        width: 300,
        marginBottom: 10,
    },
    showPasswordButton: {
        position: 'absolute',
        right: 10,
        top: 27,
    },
    fs8: {
        fontSize: 8
    },
    fs10: {
        fontSize: 10
    },
    fs12: {
        fontSize: 12
    },
    fs14: {
        fontSize: 14
    },
    fs16: {
        fontSize: 16
    },
    fs18: {
        fontSize: 18
    },
    fs20: {
        fontSize: 20
    },
    fs24: {
        fontSize: 24
    },
    col3: {
        flex: 3, // Takes 3/12 of the available space
    },
    col4: {
        flex: 4, // Takes 3/12 of the available space
    },
    col6: {
        flex: 6, // Takes 3/12 of the available space
    },
    col8: {
        flex: 8, // Takes 9/12 of the available space
    },
    col9: {
        flex: 9, // Takes 9/12 of the available space
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});
