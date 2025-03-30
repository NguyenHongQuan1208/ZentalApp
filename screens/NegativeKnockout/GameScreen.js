import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const GAME_DURATION = 30000; // 30 giây

const GameScreen = ({
    score,
    monstersLeft,
    onQuit,
    onHit,
    onGameEnd
}) => {
    const [monsters, setMonsters] = useState([]);
    const [timeLeft, setTimeLeft] = useState(30);
    const spawnIntervalRef = useRef(null);
    const gameTimerRef = useRef(null);
    const crosshairPosition = width / 2;
    const crosshairY = height / 2;
    const crosshairWidth = 50;
    const crosshairHeight = 50;

    // Function to spawn monsters
    const spawnMonster = () => {
        if (monstersLeft.length === 0) return;

        const newMonster = {
            id: Date.now(),
            monster: monstersLeft[Math.floor(Math.random() * monstersLeft.length)],
            position: new Animated.Value(-100),
            yPosition: crosshairY - 40,
            speed: 2000 + Math.random() * 3000,
            width: 80,
            height: 80,
            hit: false,
            scored: false // Thêm trạng thái scored
        };

        setMonsters(prev => [...prev, newMonster]);

        Animated.timing(newMonster.position, {
            toValue: width + 100,
            duration: newMonster.speed,
            useNativeDriver: true
        }).start(({ finished }) => {
            if (finished) {
                setMonsters(prev => prev.filter(m => m.id !== newMonster.id));
            }
        });
    };

    // Handle shooting
    const handleShoot = () => {
        // Kiểm tra tất cả quái vật hiện có
        const hitMonsters = monsters.filter(monster => {
            const monsterX = monster.position.__getValue();
            const monsterRightEdge = monsterX + monster.width;

            // Vùng crosshair
            const crosshairLeft = crosshairPosition - crosshairWidth / 2;
            const crosshairRight = crosshairPosition + crosshairWidth / 2;

            // Kiểm tra va chạm
            const isHitting = (
                monsterRightEdge >= crosshairLeft &&
                monsterX <= crosshairRight &&
                !monster.scored // Chưa được tính điểm
            );

            return isHitting;
        });

        // Nếu có quái vật trúng
        if (hitMonsters.length > 0) {
            hitMonsters.forEach(monster => {
                onHit(monster.monster.id); // Gọi callback tính điểm

                // Đánh dấu đã tính điểm
                setMonsters(prev => prev.map(m =>
                    m.id === monster.id ? { ...m, scored: true } : m
                ));
            });
        }
    };

    // Start game timer
    useEffect(() => {
        gameTimerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(gameTimerRef.current);
                    onGameEnd();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(gameTimerRef.current);
    }, []);

    // Manage monster spawning
    useEffect(() => {
        if (monstersLeft.length > 0) {
            spawnMonster();
            spawnIntervalRef.current = setInterval(spawnMonster, 1000 + Math.random() * 2000);
        }

        return () => {
            if (spawnIntervalRef.current) {
                clearInterval(spawnIntervalRef.current);
            }
        };
    }, [monstersLeft]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.score}>Score: {score}</Text>
                <Text style={styles.shots}>Time: {timeLeft}s</Text>
            </View>

            <View style={styles.gameArea}>
                {monsters.map((monster) => (
                    <Animated.View
                        key={monster.id}
                        style={[
                            styles.monsterContainer,
                            {
                                transform: [{ translateX: monster.position }],
                                top: monster.yPosition,
                                opacity: monster.scored ? 0.5 : 1 // Giảm opacity khi bị bắn trúng
                            }
                        ]}
                    >
                        <Image
                            source={{ uri: monster.monster.image }}
                            style={styles.monsterImage}
                            resizeMode="contain"
                        />
                    </Animated.View>
                ))}

                <Image
                    source={{ uri: "https://i.pinimg.com/1200x/25/08/71/250871a8d00791d857fc3b21b1083d34.jpg" }}
                    style={styles.crosshairImage}
                    resizeMode="contain"
                />
            </View>

            <TouchableOpacity
                style={styles.shootButton}
                onPress={handleShoot}
                disabled={timeLeft <= 0}
            >
                <Text style={styles.shootText}>SHOOT</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quitButton} onPress={onQuit}>
                <Text style={styles.quitText}>QUIT</Text>
            </TouchableOpacity>
        </View>
    );
};

// Styles giữ nguyên như trước
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f8ff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#6a1b9a',
    },
    score: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    shots: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    gameArea: {
        flex: 1,
        position: 'relative',
    },
    monsterContainer: {
        position: 'absolute',
        width: 80,
        height: 80,
    },
    monsterImage: {
        width: '100%',
        height: '100%',
    },
    crosshairImage: {
        position: 'absolute',
        left: width / 2 - 25,
        top: height / 2 - 25,
        width: 50,
        height: 50,
    },
    shootButton: {
        position: 'absolute',
        bottom: 100,
        alignSelf: 'center',
        backgroundColor: '#FF5722',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
    },
    shootText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    quitButton: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        backgroundColor: '#E53935',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    quitText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default GameScreen;