import { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import SelectionScreen from "../screens/NegativeKnockout/SelectionScreen";
import GameScreen from "../screens/NegativeKnockout/GameScreen";
import EndScreen from "../screens/NegativeKnockout/EndScreen";

const monsters = [
    { id: 1, name: "Anger", image: "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Monster/monster1.png" },
    { id: 2, name: "Sadness", image: "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Monster/monster2.png" },
    { id: 3, name: "Anxiety", image: "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Monster/monster3.png" },
    { id: 4, name: "Fear", image: "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Monster/monster4.png" },
    { id: 5, name: "Stress", image: "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Monster/monster5.png" },
    { id: 6, name: "Doubt", image: "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Monster/monster6.png" },
];

export default function NegativeKnockout({ navigation }) {
    const [gameState, setGameState] = useState("selection");
    const [selectedMonsters, setSelectedMonsters] = useState([]);
    const [score, setScore] = useState(0);
    const [monstersLeft, setMonstersLeft] = useState([]);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameStarted, setGameStarted] = useState(false);

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

    // Add custom monster
    const addCustomMonster = (newMonster) => {
        if (selectedMonsters.length >= 5) {
            Alert.alert("Maximum Selection", "You can only select up to 5 monsters!");
            return;
        }
        setSelectedMonsters([...selectedMonsters, newMonster]);
    };

    // Remove monster
    const removeMonster = (id) => {
        setSelectedMonsters(selectedMonsters.filter(monster => monster.id !== id));
    };

    // Start the game with selected monsters
    const startGame = () => {
        if (selectedMonsters.length < 3) {
            Alert.alert("Not Enough Monsters", "Please select at least 3 monsters!");
            return;
        }

        setGameState("game");
        setMonstersLeft([...selectedMonsters]);
        setScore(0);
        setTimeLeft(30);
        setGameStarted(true);
    };

    // Handle hit
    const handleHit = (monsterId) => {
        setScore(prev => prev + 100);
        setMonstersLeft(prev => prev.filter(m => m.id !== monsterId));
    };

    // Handle game end
    const handleGameEnd = () => {
        setGameState("end");
        setGameStarted(false);
    };

    // Reset game
    const resetGame = () => {
        setGameState("selection");
        setSelectedMonsters([]);
        setScore(0);
        setMonstersLeft([]);
        setGameStarted(false);
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    // Game timer effect
    useEffect(() => {
        let timer;
        if (gameStarted && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleGameEnd();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [gameStarted, timeLeft]);

    return (
        <View style={styles.mainContainer}>
            {gameState === "selection" && (
                <SelectionScreen
                    monsters={monsters}
                    selectedMonsters={selectedMonsters}
                    onToggleMonster={toggleMonsterSelection}
                    onBack={handleGoBack}
                    onStartGame={startGame}
                    onAddCustomMonster={addCustomMonster}
                    onRemoveMonster={removeMonster}
                />
            )}

            {gameState === "game" && (
                <GameScreen
                    score={score}
                    timeLeft={timeLeft}
                    monstersLeft={monstersLeft}
                    onQuit={resetGame}
                    onHit={handleHit}
                    onGameEnd={handleGameEnd}
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
        marginTop: 32
    },
});