import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert, PanResponder, Animated } from "react-native"

// Monster data with negative emotions
const monsters = [
    { id: 1, name: "Anger", color: "#FF5252" },
    { id: 2, name: "Sadness", color: "#536DFE" },
    { id: 3, name: "Anxiety", color: "#FFC107" },
    { id: 4, name: "Fear", color: "#7C4DFF" },
    { id: 5, name: "Stress", color: "#4CAF50" },
    { id: 6, name: "Doubt", color: "#FF9800" },
]








export default function NegativeKnockout() {
    const [gameState, setGameState] = useState("start") // start, selection, game, end
    const [selectedMonsters, setSelectedMonsters] = useState([])
    const [remainingShots, setRemainingShots] = useState(5)
    const [score, setScore] = useState(0)
    const [monstersLeft, setMonstersLeft] = useState([])
    const [projectilePosition] = useState(new Animated.ValueXY({ x: 0, y: 0 }))
    const [isShooting, setIsShooting] = useState(false)

    // Handle monster selection
    const toggleMonsterSelection = (monster) => {
        if (selectedMonsters.find((m) => m.id === monster.id)) {
            setSelectedMonsters(selectedMonsters.filter((m) => m.id !== monster.id))
        } else if (selectedMonsters.length < 5) {
            setSelectedMonsters([...selectedMonsters, monster])
        } else {
            Alert.alert("Maximum Selection", "You can only select up to 5 monsters!")
        }
    }

    // Start the game with selected monsters
    const startGame = () => {
        if (selectedMonsters.length < 3) {
            Alert.alert("Not Enough Monsters", "Please select at least 3 monsters!")
            return
        }

        setGameState("game")
        setMonstersLeft([...selectedMonsters])
        setRemainingShots(5)
        setScore(0)
    }

    // Simulate shooting projectile
    const shootProjectile = (power, angle) => {
        setIsShooting(true)

        // Decrease remaining shots
        setRemainingShots((prev) => prev - 1)

        // Animate the projectile
        Animated.timing(projectilePosition, {
            toValue: {
                x: Math.cos(angle) * 300,
                y: Math.sin(angle) * 300
            },
            duration: 500,
            useNativeDriver: true
        }).start(() => {
            // Simulate hit detection (random for this example)
            const hitProbability = Math.min(power / 100, 0.8) // Higher power = better chance to hit

            if (monstersLeft.length > 0 && Math.random() < hitProbability) {
                // Hit a monster!
                const hitMonsterIndex = Math.floor(Math.random() * monstersLeft.length)
                const newMonstersLeft = [...monstersLeft]
                newMonstersLeft.splice(hitMonsterIndex, 1)
                setMonstersLeft(newMonstersLeft)
                setScore((prev) => prev + 100)

                if (newMonstersLeft.length === 0) {
                    // All monsters defeated!
                    setTimeout(() => {
                        setGameState("end")
                        Alert.alert("Victory!", `You defeated all monsters with ${remainingShots - 1} shots remaining!`)
                    }, 500)
                }
            }

            // Check if out of shots
            if (remainingShots <= 1 && monstersLeft.length > 0) {
                setTimeout(() => {
                    setGameState("end")
                    Alert.alert("Game Over", `You defeated ${selectedMonsters.length - monstersLeft.length} monsters.`)
                }, 500)
            }

            // Reset projectile position
            Animated.timing(projectilePosition, {
                toValue: { x: 0, y: 0 },
                duration: 0,
                useNativeDriver: true
            }).start(() => {
                setIsShooting(false)
            })
        })
    }

    // Reset game
    const resetGame = () => {
        setGameState("start")
        setSelectedMonsters([])
    }

    // Pan responder for slingshot
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => !isShooting && remainingShots > 0,
        onPanResponderMove: (evt, gestureState) => {
            // Limit drag distance
            const dx = Math.min(Math.max(gestureState.dx, -100), 100)
            const dy = Math.min(Math.max(gestureState.dy, -150), 0)

            projectilePosition.setValue({ x: dx, y: dy })
        },
        onPanResponderRelease: (evt, gestureState) => {
            const dx = gestureState.dx
            const dy = gestureState.dy

            // Calculate power and angle
            const power = Math.sqrt(dx * dx + dy * dy)
            const angle = Math.atan2(dy, dx)

            // Shoot!
            shootProjectile(power, angle)
        }
    })

    // Render different game states
    const renderStartScreen = () => (
        <View style={styles.container}>
            <Text style={styles.title}>Negative Knockout</Text>
            <Text style={styles.subtitle}>Shoot away your negative emotions!</Text>
            <TouchableOpacity style={styles.startButton} onPress={() => setGameState("selection")}>
                <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
        </View>
    )

    const renderSelectionScreen = () => (
        <View style={styles.container}>
            <Text style={styles.selectionTitle}>Select 3-5 negative emotions to knock out:</Text>
            <Text style={styles.selectionSubtitle}>Selected: {selectedMonsters.length}/5</Text>

            <View style={styles.monsterGrid}>
                {monsters.map((monster) => (
                    <TouchableOpacity
                        key={monster.id}
                        style={[
                            styles.monsterCard,
                            { backgroundColor: monster.color + "33" }, // Adding transparency
                            selectedMonsters.find((m) => m.id === monster.id) && styles.selectedMonster,
                        ]}
                        onPress={() => toggleMonsterSelection(monster)}
                    >
                        <View style={[styles.monsterIcon, { backgroundColor: monster.color }]}>
                            <Text style={styles.monsterEmoji}>😈</Text>
                        </View>
                        <Text style={styles.monsterName}>{monster.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.backButton} onPress={resetGame}>
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.nextButton, selectedMonsters.length < 3 && styles.disabledButton]}
                    onPress={startGame}
                    disabled={selectedMonsters.length < 3}
                >
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    )

    const renderGameScreen = () => (
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
            <TouchableOpacity style={styles.quitButton} onPress={resetGame}>
                <Text style={styles.buttonText}>Quit</Text>
            </TouchableOpacity>
        </View>
    )

    const renderEndScreen = () => (
        <View style={styles.container}>
            <Text style={styles.title}>Game Over!</Text>
            <Text style={styles.scoreTitle}>Final Score: {score}</Text>
            <Text style={styles.subtitle}>
                You knocked out {selectedMonsters.length - monstersLeft.length} negative emotions!
            </Text>
            <TouchableOpacity style={styles.startButton} onPress={resetGame}>
                <Text style={styles.buttonText}>Play Again</Text>
            </TouchableOpacity>
        </View>
    )

    // Render based on game state
    return (
        <View style={styles.mainContainer}>
            {gameState === "start" && renderStartScreen()}
            {gameState === "selection" && renderSelectionScreen()}
            {gameState === "game" && renderGameScreen()}
            {gameState === "end" && renderEndScreen()}
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
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
    selectionTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    selectionSubtitle: {
        fontSize: 16,
        marginBottom: 20,
    },
    monsterGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 30,
    },
    monsterCard: {
        width: "30%",
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
    },
    selectedMonster: {
        borderWidth: 3,
        borderColor: "#2196F3",
    },
    monsterIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    monsterEmoji: {
        fontSize: 30,
    },
    monsterName: {
        fontWeight: "bold",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: "auto",
    },
    backButton: {
        backgroundColor: "#757575",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    nextButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    disabledButton: {
        backgroundColor: "#BDBDBD",
    },
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
    scoreTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
})