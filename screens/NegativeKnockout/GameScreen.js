import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const GameScreen = ({
    score,
    remainingShots,
    monstersLeft,
    projectilePosition,
    panResponder,
    isShooting,
    onQuit
}) => {
    return (
        <View style={styles.gameContainer}>
            {/* Score and shots display */}
            <View style={styles.gameHeader}>
                <Text style={styles.scoreText}>Score: {score}</Text>
                <Text style={styles.shotsText}>Shots: {remainingShots}</Text>
            </View>

            {/* Monsters */}
            {monstersLeft.map((monster, index) => (
                <View
                    key={monster.id}
                    style={[
                        styles.gameMonster,
                        {
                            top: 50 + (index % 3) * 80,
                            left: 100 + index * 120,
                            backgroundColor: monster.color,
                        },
                    ]}
                >
                    <Text style={styles.monsterLabel}>{monster.name}</Text>
                </View>
            ))}

            {/* Slingshot base */}
            <View style={styles.slingshotBase} />

            {/* Projectile */}
            {remainingShots > 0 && (
                <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                        styles.projectile,
                        {
                            transform: [
                                { translateX: projectilePosition.x },
                                { translateY: projectilePosition.y }
                            ]
                        }
                    ]}
                >
                    <Text style={styles.projectileText}>Pull</Text>
                </Animated.View>
            )}

            {/* Back button */}
            <TouchableOpacity style={styles.quitButton} onPress={onQuit}>
                <Text style={styles.buttonText}>Quit</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    gameContainer: {
        flex: 1,
        backgroundColor: "#E3F2FD",
    },
    gameHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20,
    },
    scoreText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    shotsText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    gameMonster: {
        position: "absolute",
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: "center",
        justifyContent: "center",
    },
    monsterLabel: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    slingshotBase: {
        position: "absolute",
        bottom: 20,
        left: "50%",
        marginLeft: -20,
        width: 40,
        height: 100,
        backgroundColor: "#8B4513",
        borderRadius: 10,
    },
    projectile: {
        position: "absolute",
        bottom: 120,
        left: "50%",
        marginLeft: -25,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#E53935",
        alignItems: "center",
        justifyContent: "center",
    },
    projectileText: {
        color: "white",
        fontWeight: "bold",
    },
    quitButton: {
        position: "absolute",
        bottom: 20,
        left: 20,
        backgroundColor: "#757575",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default GameScreen;