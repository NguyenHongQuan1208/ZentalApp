import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const EndScreen = ({ score, selectedMonsters, monstersLeft, onPlayAgain }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Game Over!</Text>
            <Text style={styles.scoreTitle}>Final Score: {score}</Text>
            <Text style={styles.subtitle}>
                You knocked out {selectedMonsters.length - monstersLeft.length} negative emotions!
            </Text>
            <TouchableOpacity style={styles.startButton} onPress={onPlayAgain}>
                <Text style={styles.buttonText}>Play Again</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 20,
    },
    scoreTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 30,
        textAlign: "center",
    },
    startButton: {
        backgroundColor: "#2196F3",
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default EndScreen;