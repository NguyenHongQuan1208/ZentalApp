import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, FlatList } from 'react-native';

// Màu sắc chung
const COLORS = {
    primary: '#6a1b9a',
    secondary: '#9c27b0',
    background: '#f5f5f5',
    text: '#333',
    border: '#ddd',
    selected: '#2196f3',
    danger: '#e53935'
};

const SelectionScreen = ({
    monsters,
    selectedMonsters,
    onToggleMonster,
    onBack,
    onStartGame,
    onAddCustomMonster,
    onRemoveMonster
}) => {
    const [customMonsterName, setCustomMonsterName] = useState('');

    const handleAddCustomMonster = () => {
        if (selectedMonsters.length >= 5) {
            Alert.alert("Giới hạn", "Chỉ được chọn tối đa 5 cảm xúc!");
            return;
        }

        if (!customMonsterName.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập tên cảm xúc!");
            return;
        }

        const newMonster = {
            id: Date.now(),
            name: customMonsterName.trim()
        };

        onAddCustomMonster(newMonster);
        setCustomMonsterName('');
    };

    const renderSelectedItem = ({ item }) => (
        <View style={styles.selectedItem}>
            <Text style={styles.selectedItemText}>{item.name}</Text>
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemoveMonster(item.id)}
            >
                <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chọn cảm xúc tiêu cực</Text>
            <Text style={styles.subtitle}>Chọn 3-5 cảm xúc để loại bỏ</Text>

            {/* Danh sách đã chọn */}
            <View style={styles.selectedContainer}>
                <Text style={styles.sectionTitle}>Đã chọn ({selectedMonsters.length}/5):</Text>
                <FlatList
                    horizontal
                    data={selectedMonsters}
                    renderItem={renderSelectedItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.selectedList}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            {/* Thêm cảm xúc mới */}
            <View style={styles.addContainer}>
                <Text style={styles.sectionTitle}>Thêm cảm xúc mới:</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập cảm xúc của bạn..."
                        value={customMonsterName}
                        onChangeText={setCustomMonsterName}
                    />
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddCustomMonster}
                    >
                        <Text style={styles.addButtonText}>Thêm</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Danh sách cảm xúc mặc định */}
            <View style={styles.defaultContainer}>
                <Text style={styles.sectionTitle}>Cảm xúc mặc định:</Text>
                <View style={styles.monsterGrid}>
                    {monsters.map((monster) => (
                        <TouchableOpacity
                            key={monster.id}
                            style={[
                                styles.monsterCard,
                                selectedMonsters.some(m => m.id === monster.id) && styles.selectedCard
                            ]}
                            onPress={() => onToggleMonster(monster)}
                        >
                            <Text style={styles.monsterText}>{monster.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Nút điều khiển */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.secondaryButton} onPress={onBack}>
                    <Text style={styles.buttonText}>Quay lại</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.primaryButton, selectedMonsters.length < 3 && styles.disabledButton]}
                    onPress={onStartGame}
                    disabled={selectedMonsters.length < 3}
                >
                    <Text style={styles.buttonText}>Bắt đầu</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 5,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.text,
        marginBottom: 20,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 10,
    },
    selectedContainer: {
        marginBottom: 20,
    },
    selectedList: {
        paddingVertical: 5,
    },
    selectedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 15,
        marginRight: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    selectedItemText: {
        marginRight: 8,
        color: COLORS.text,
    },
    removeButton: {
        backgroundColor: COLORS.danger,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 16,
        lineHeight: 18,
    },
    addContainer: {
        marginBottom: 20,
    },
    inputRow: {
        flexDirection: 'row',
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        marginRight: 10,
    },
    addButton: {
        backgroundColor: COLORS.secondary,
        paddingHorizontal: 20,
        borderRadius: 8,
        justifyContent: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    defaultContainer: {
        flex: 1,
        marginBottom: 20,
    },
    monsterGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    monsterCard: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    selectedCard: {
        borderColor: COLORS.selected,
        borderWidth: 2,
        backgroundColor: '#e3f2fd',
    },
    monsterText: {
        textAlign: 'center',
        color: COLORS.text,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 8,
        flex: 1,
        marginLeft: 10,
    },
    secondaryButton: {
        backgroundColor: COLORS.secondary,
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 8,
        flex: 1,
        marginRight: 10,
    },
    disabledButton: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default SelectionScreen;