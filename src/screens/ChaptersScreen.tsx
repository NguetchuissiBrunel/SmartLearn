import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BookOpen, ChevronRight, Calculator, Shapes, Hash, CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography } from '../constants/theme';
import AfricanPattern from '../components/AfricanPattern';
import { db } from '../db/database';

const ChapterIcon = ({ title, size, color }: { title: string, size: number, color: string }) => {
  if (title.includes('Numération')) return <Hash size={size} color={color} />;
  if (title.includes('Opérations')) return <Calculator size={size} color={color} />;
  if (title.includes('Fractions')) return <Shapes size={size} color={color} />;
  return <BookOpen size={size} color={color} />;
};

const ChaptersScreen = () => {
  const navigation = useNavigation<any>();
  const [chapters, setChapters] = useState<any[]>([]);

  useEffect(() => {
    try {
      const rows = db.getAllSync<any>(`
        SELECT c.*, AVG(sk.pL) as avg_mastery 
        FROM chapters c 
        LEFT JOIN skills s ON s.chapter_id = c.id 
        LEFT JOIN student_knowledge sk ON sk.skill_id = s.id 
        GROUP BY c.id
      `);
      
      const data = rows.map(ch => ({ ...ch, mastery: ch.avg_mastery || 0 }));
      setChapters(data);
    } catch (err) {
      console.error('Error fetching chapters', err);
    }
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('Exercise', { chapterId: item.id, chapterTitle: item.title })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <ChapterIcon title={item.title} size={28} color={Colors.secondary} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.chapterTitle}>{item.title}</Text>
          <Text style={styles.chapterDesc}>{item.description}</Text>
        </View>
        {item.mastery >= 0.8 && <CheckCircle color="#4CAF50" size={20} />}
      </View>
      <View style={styles.masteryBarContainer}>
        <LinearGradient 
          colors={[Colors.gradientStart, Colors.gradientEnd]} 
          style={[styles.masteryBar, { width: `${item.mastery * 100}%` }]} 
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AfricanPattern />
      <View style={styles.header}>
        <Text style={Typography.h1 as any}>Choisis ton chapitre</Text>
        <Text style={Typography.caption as any}>Continue ton aventure d'apprentissage.</Text>
      </View>

      <FlatList
        data={chapters}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.xl,
    marginTop: Spacing.md,
  },
  list: {
    padding: Spacing.md,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 24, // Bigger padding
    borderRadius: 20,
    marginBottom: 24, // More space between cards
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 4, // Better shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.secondary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 22, // Larger, more readable title
    fontWeight: '900',
    color: Colors.text, // Use theme text color instead of primary for better readability
    marginBottom: 6,
  },
  chapterDesc: {
    fontSize: 14,
    color: '#666',
  },
  masteryBarContainer: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginTop: 16,
    overflow: 'hidden',
  },
  masteryBar: {
    height: '100%',
    borderRadius: 4,
  },
});

export default ChaptersScreen;
