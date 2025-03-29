import { useState } from "react";
import { View, StyleSheet, Alert, PanResponder, Animated } from "react-native";
import SelectionScreen from "../screens/NegativeKnockout/SelectionScreen";
import GameScreen from "../screens/NegativeKnockout/GameScreen";
import EndScreen from "../screens/NegativeKnockout/EndScreen";

// Monster data with negative emotions
const monsters = [
    { id: 1, name: "Anger" },
    { id: 2, name: "Sadness" },
    { id: 3, name: "Anxiety" },
    { id: 4, name: "Fear" },
    { id: 5, name: "Stress" },
    { id: 6, name: "Doubt" },
];

export default function NegativeKnockout() {
    const [gameState, setGameState] = useState("selection"); //selection, game, end
    const [selectedMonsters, setSelectedMonsters] = useState([]);
    const [remainingShots, setRemainingShots] = useState(5);
    const [score, setScore] = useState(0);
    const [monstersLeft, setMonstersLeft] = useState([]);
    const [projectilePosition] = useState(new Animated.ValueXY({ x: 0, y: 0 }));
    const [isShooting, setIsShooting] = useState(false);

    // Handle monster selection
    const toggleMonsterSelection = (monster) => {
        if (selectedMonsters.find((m) => m.id === monster.id)) {
            setSelectedMonsters(selectedMonsters.filter((m) => m.id !== monster.id));
        } else if (selectedMonsters.length < 5) {
            setSelectedMonsters([...selectedMonsters, monster]);
        } else {
            Alert.alert("Maximum Selection", "You can only select up to 5 monsters!");
        }
    };

    // Start the game with selected monsters
    const startGame = () => {
        if (selectedMonsters.length < 3) {
            Alert.alert("Not Enough Monsters", "Please select at least 3 monsters!");
            return;
        }

        setGameState("game");
        setMonstersLeft([...selectedMonsters]);
        setRemainingShots(5);
        setScore(0);
    };

    // Simulate shooting projectile
    const shootProjectile = (power, angle) => {
        setIsShooting(true);

        // Decrease remaining shots
        setRemainingShots((prev) => prev - 1);

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
            const hitProbability = Math.min(power / 100, 0.8); // Higher power = better chance to hit

            if (monstersLeft.length > 0 && Math.random() < hitProbability) {
                // Hit a monster!
                const hitMonsterIndex = Math.floor(Math.random() * monstersLeft.length);
                const newMonstersLeft = [...monstersLeft];
                newMonstersLeft.splice(hitMonsterIndex, 1);
                setMonstersLeft(newMonstersLeft);
                setScore((prev) => prev + 100);

                if (newMonstersLeft.length === 0) {
                    // All monsters defeated!
                    setTimeout(() => {
                        setGameState("end");
                        Alert.alert("Victory!", `You defeated all monsters with ${remainingShots - 1} shots remaining!`);
                    }, 500);
                }
            }

            // Check if out of shots
            if (remainingShots <= 1 && monstersLeft.length > 0) {
                setTimeout(() => {
                    setGameState("end");
                    Alert.alert("Game Over", `You defeated ${selectedMonsters.length - monstersLeft.length} monsters.`);
                }, 500);
            }

            // Reset projectile position
            Animated.timing(projectilePosition, {
                toValue: { x: 0, y: 0 },
                duration: 0,
                useNativeDriver: true
            }).start(() => {
                setIsShooting(false);
            });
        });
    };

    // Reset game
    const resetGame = () => {
        setGameState("selection");
        setSelectedMonsters([]);
    };

    // Pan responder for slingshot
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => !isShooting && remainingShots > 0,
        onPanResponderMove: (evt, gestureState) => {
            // Limit drag distance
            const dx = Math.min(Math.max(gestureState.dx, -100), 100);
            const dy = Math.min(Math.max(gestureState.dy, -150), 0);

            projectilePosition.setValue({ x: dx, y: dy });
        },
        onPanResponderRelease: (evt, gestureState) => {
            const dx = gestureState.dx;
            const dy = gestureState.dy;

            // Calculate power and angle
            const power = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);

            // Shoot!
            shootProjectile(power, angle);
        }
    });

    const addCustomMonster = (newMonster) => {
        if (selectedMonsters.length >= 5) {
            Alert.alert("Maximum Selection", "You can only select up to 5 monsters!");
            return;
        }
        setSelectedMonsters([...selectedMonsters, newMonster]);
    };

    const removeMonster = (id) => {
        setSelectedMonsters(selectedMonsters.filter(monster => monster.id !== id));
    };

    return (
        <View style={styles.mainContainer}>
            {gameState === "selection" && (
                <SelectionScreen
                    monsters={monsters}
                    selectedMonsters={selectedMonsters}
                    onToggleMonster={toggleMonsterSelection}
                    onBack={resetGame}
                    onStartGame={startGame}
                    onAddCustomMonster={addCustomMonster}
                    onRemoveMonster={removeMonster}
                />
            )}

            {gameState === "game" && (
                <GameScreen
                    score={score}
                    remainingShots={remainingShots}
                    monstersLeft={monstersLeft}
                    projectilePosition={projectilePosition}
                    panResponder={panResponder}
                    isShooting={isShooting}
                    onQuit={resetGame}
                />
            )}

            {gameState === "end" && (
                <EndScreen
                    score={score}
                    selectedMonsters={selectedMonsters}
                    monstersLeft={monstersLeft}
                    onPlayAgain={resetGame}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
});