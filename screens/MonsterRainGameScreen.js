import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Vibration, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GlobalColors } from '../constants/GlobalColors';
import GameModal from '../components/BalloonGame/GameModal';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const MonsterRainGameScreen = ({ route }) => {
    // Game state
    const { selectedMonsters } = route.params;
    const navigation = useNavigation();
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(10);
    const [monsters, setMonsters] = useState([]);
    const [explosions, setExplosions] = useState([]);
    const [speedMultiplier, setSpeedMultiplier] = useState(1);
    const [gameOver, setGameOver] = useState(false);

    // Refs
    const monsterRefs = useRef([]);
    const animationRef = useRef(null);
    const scaleAnims = useRef({}).current;

    // Game over handler
    const handleGameOver = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    // Monster press handler
    const handleMonsterPress = useCallback((id, x, y) => {
        if (gameOver) return;

        Vibration.vibrate(50);
        setScore(prev => prev + 1);

        Animated.timing(scaleAnims[id], {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setMonsters(prev => prev.filter(monster => monster.id !== id));
            setExplosions(prev => [...prev, { id: Date.now(), x, y }]);
            delete scaleAnims[id];
        });
    }, [gameOver, scaleAnims]);

    // Spawn monsters
    useEffect(() => {
        const spawnMonsters = () => {
            const newMonster = {
                id: Date.now(),
                type: Math.floor(Math.random() * selectedMonsters.length),
                x: Math.random() * (SCREEN_WIDTH - 80),
                y: -100,
                speed: (2 + Math.random() * 3) * speedMultiplier
            };
            scaleAnims[newMonster.id] = new Animated.Value(1);
            setMonsters(prev => [...prev, newMonster]);

            const delay = 500 + Math.random() * 1000;
            animationRef.current = setTimeout(spawnMonsters, delay);
        };

        spawnMonsters();

        return () => clearTimeout(animationRef.current);
    }, [speedMultiplier, selectedMonsters.length, scaleAnims]);

    // Move monsters
    useEffect(() => {
        const moveMonsters = () => {
            setMonsters(prev => {
                const updatedMonsters = prev.map(monster => ({
                    ...monster,
                    y: monster.y + monster.speed
                }));

                const reachedBottom = updatedMonsters.filter(monster => monster.y >= SCREEN_HEIGHT);
                if (reachedBottom.length > 0) {
                    setLives(prev => Math.max(0, prev - reachedBottom.length));
                }

                return updatedMonsters.filter(monster => monster.y < SCREEN_HEIGHT);
            });

            requestAnimationFrame(moveMonsters);
        };

        const animationFrame = requestAnimationFrame(moveMonsters);
        return () => cancelAnimationFrame(animationFrame);
    }, []);

    // Clean up explosions
    useEffect(() => {
        const timer = setTimeout(() => {
            if (explosions.length > 0) {
                setExplosions(prev => prev.slice(1));
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [explosions]);

    // Increase difficulty
    useEffect(() => {
        if (score > 0 && score % 10 === 0) {
            setSpeedMultiplier(prev => prev + 0.2);
        }
    }, [score]);

    // Game over condition
    useEffect(() => {
        if (lives <= 0) {
            setGameOver(true);
        }
    }, [lives]);

    // Render monster
    const renderMonster = useCallback((monster, index) => {
        const monsterData = selectedMonsters[monster.type];
        return (
            <TouchableOpacity
                key={monster.id}
                ref={el => monsterRefs.current[index] = el}
                style={[styles.monsterContainer, { left: monster.x, top: monster.y }]}
                activeOpacity={0.7}
                onPress={() => handleMonsterPress(monster.id, monster.x, monster.y)}
            >
                <Animated.View style={{ transform: [{ scale: scaleAnims[monster.id] }] }}>
                    <Image
                        source={{ uri: monsterData.image }}
                        style={styles.monsterImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.monsterName}>{monsterData.name}</Text>
                </Animated.View>
            </TouchableOpacity>
        );
    }, [handleMonsterPress, selectedMonsters, scaleAnims]);

    return (
        <View style={styles.gameContainer}>
            <GameModal
                visible={gameOver}
                message={`Game Over!\nYour Score: ${score}`}
                onClose={handleGameOver}
                buttonText="OK"
            />

            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.quitButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.quitButtonText}>Quit</Text>
                </TouchableOpacity>

                <View style={styles.hudContainer}>
                    <View style={styles.hudItem}>
                        <Text style={styles.hudLabel}>Score</Text>
                        <View style={[styles.valueContainer, styles.scoreContainer]}>
                            <Text style={styles.valueText}>{score}</Text>
                        </View>
                    </View>

                    <View style={styles.hudItem}>
                        <Text style={styles.hudLabel}>Lives</Text>
                        <View style={[styles.valueContainer, styles.livesContainer]}>
                            <Text style={styles.valueText}>{lives}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {monsters.map(renderMonster)}
            {explosions.map(explosion => (
                <Animated.View
                    key={explosion.id}
                    style={[
                        styles.explosion,
                        {
                            left: explosion.x - 25,
                            top: explosion.y - 25,
                            opacity: 0.7,
                        }
                    ]}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    gameContainer: {
        flex: 1,
        backgroundColor: GlobalColors.primaryWhite,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
        backgroundColor: GlobalColors.pureWhite,
        borderBottomWidth: 1,
        borderBottomColor: GlobalColors.primaryGrey,
    },
    hudContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 25,
    },
    hudItem: {
        alignItems: 'center',
    },
    hudLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: GlobalColors.secondBlack,
        marginBottom: 4,
    },
    valueContainer: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        minWidth: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreContainer: {
        backgroundColor: GlobalColors.primaryColor,
    },
    livesContainer: {
        backgroundColor: GlobalColors.errorRed,
    },
    valueText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: GlobalColors.pureWhite,
    },
    quitButton: {
        backgroundColor: GlobalColors.error500,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        elevation: 3,
        zIndex: 3,
    },
    quitButtonText: {
        color: GlobalColors.pureWhite,
        fontSize: 16,
        fontWeight: 'bold',
    },
    monsterContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    monsterImage: {
        width: 70,
        height: 70,
        borderRadius: 10,
        shadowColor: GlobalColors.primaryBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    monsterName: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: 'bold',
        color: GlobalColors.primaryColor,
        textAlign: 'center',
    },
    explosion: {
        position: 'absolute',
        width: 60,
        height: 60,
        backgroundColor: GlobalColors.error500 + 'E6',
        borderRadius: 30,
        zIndex: 10,
        elevation: 5,
    },
});

export default React.memo(MonsterRainGameScreen);