import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, FlatList, Image, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Color scheme
const COLORS = {
    primary: '#6a1b9a',
    secondary: '#9c27b0',
    background: '#f5f5f5',
    text: '#333',
    border: '#ddd',
    selected: '#2196f3',
    danger: '#e53935'
};

const NegativeKnockout = ({ navigation }) => {
    const [monsters] = useState([
        { id: 1, name: "Anger", image: "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Monster/monster1.png" },
        { id: 2, name: "Sadness", image: "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Monster/monster2.png" },
        { id: 3, name: "Anxiety", image: "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Monster/monster3.png" },
        { id: 4, name: "Fear", image: "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Monster/monster4.png" },
        { id: 5, name: "Stress", image: "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Monster/monster5.png" },
        { id: 6, name: "Doubt", image: "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Monster/monster6.png" },
    ]);
    const [selectedMonsters, setSelectedMonsters] = useState([]);
    const [customMonsterName, setCustomMonsterName] = useState('');

    const onToggleMonster = (monster) => {
        if (selectedMonsters.some(m => m.id === monster.id)) {
            setSelectedMonsters(selectedMonsters.filter(m => m.id !== monster.id));
        } else {
            if (selectedMonsters.length < 5) {
                setSelectedMonsters([...selectedMonsters, monster]);
            } else {
                Alert.alert("Limit", "You can only select up to 5 emotions!");
            }
        }
    };

    const onRemoveMonster = (id) => {
        setSelectedMonsters(selectedMonsters.filter(m => m.id !== id));
    };

    const handleAddCustomMonster = () => {
        if (!customMonsterName.trim()) {
            Alert.alert("Error", "Please enter an emotion name!");
            return;
        }

        const newMonster = {
            id: Date.now(),
            name: customMonsterName.trim(),
            image: "https://mtgvdotkhgwbvsmxgjol.supabase.co/storage/v1/object/public/ZentalApp/Monster/monster-default.png"
        };

        setSelectedMonsters([...selectedMonsters, newMonster]);
        setCustomMonsterName('');
    };

    const renderSelectedItem = ({ item }) => (
        <View style={styles.selectedItem}>
            <Image source={{ uri: item.image }} style={styles.selectedImage} resizeMode="contain" />
            <Text style={styles.selectedItemText}>{item.name}</Text>
            <TouchableOpacity style={styles.removeButton} onPress={() => onRemoveMonster(item.id)}>
                <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Select Negative Emotions</Text>
                    <View style={styles.headerSpacer} />
                </View>

                {/* Selected emotions */}
                <View style={styles.selectedContainer}>
                    <Text style={styles.sectionTitle}>Selected ({selectedMonsters.length}/5):</Text>
                    {selectedMonsters.length > 0 ? (
                        <FlatList
                            horizontal
                            data={selectedMonsters}
                            renderItem={renderSelectedItem}
                            keyExtractor={item => item.id.toString()}
                            contentContainerStyle={styles.selectedList}
                            showsHorizontalScrollIndicator={false}
                        />
                    ) : (
                        <Text style={styles.emptyText}>No emotions selected yet</Text>
                    )}
                </View>

                {/* Add custom emotion */}
                <View style={styles.addContainer}>
                    <Text style={styles.sectionTitle}>Add custom emotion:</Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter emotion name..."
                            value={customMonsterName}
                            onChangeText={setCustomMonsterName}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={handleAddCustomMonster}>
                            <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Default emotions */}
                <View style={styles.defaultContainer}>
                    <Text style={styles.sectionTitle}>Default emotions:</Text>
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
                                <Image source={{ uri: monster.image }} style={styles.monsterImage} resizeMode="contain" />
                                <Text style={styles.monsterText}>{monster.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Fixed buttons at bottom */}
            <View style={styles.fixedFooter}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.primaryButton, selectedMonsters.length < 3 && styles.disabledButton]}
                    onPress={() => Alert.alert('Game Started')}
                    disabled={selectedMonsters.length < 3}
                >
                    <Text style={styles.buttonText}>Start</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        marginTop: 30,
        flexDirection: 'row',
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        marginBottom: 8,
    },
    backButton: {
        padding: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
        textAlign: 'center',
        flex: 1,
    },
    headerSpacer: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 10,
        paddingBottom: 100,
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
    selectedImage: {
        width: 30,
        height: 30,
        marginRight: 8,
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
    emptyText: {
        color: COLORS.text,
        fontStyle: 'italic',
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
        width: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
    },
    defaultContainer: {
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
        alignItems: 'center',
    },
    selectedCard: {
        borderColor: COLORS.selected,
        borderWidth: 2,
        backgroundColor: '#e3f2fd',
    },
    monsterImage: {
        width: 60,
        height: 60,
        marginBottom: 8,
    },
    monsterText: {
        textAlign: 'center',
        color: COLORS.text,
    },
    fixedFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: COLORS.background,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
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

export default NegativeKnockout;
