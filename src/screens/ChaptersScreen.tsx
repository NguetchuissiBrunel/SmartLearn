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
import { BookOpen } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors, Spacing, Typography } from '../constants/theme';
import AfricanPattern from '../components/AfricanPattern';
import { db } from '../db/database';
import { translations, Language } from '../utils/i18n';

const ChapterIcon = ({ title, size, color }: { title: string, size: number, color: string }) => {
  return <BookOpen size={size} color={color} />;
};

const ChaptersScreen = () => {
  const navigation = useNavigation<any>();
  const [chapters, setChapters] = useState<any[]>([]);
  const [lang, setLang] = useState<Language>('fr');

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

      const student = db.getFirstSync<any>('SELECT language FROM students ORDER BY id DESC LIMIT 1');
      if (student?.language) setLang(student.language);
    } catch (err) {
      console.error('Error fetching chapters', err);
    }
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate('Exercise', { chapterId: item.id })}
    >
      <BlurView intensity={70} tint="light" style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <BookOpen color={Colors.primary} size={28} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.chapterTitle}>{item.title}</Text>
            <Text style={styles.chapterDesc}>{item.description}</Text>
          </View>
        </View>

        <View style={styles.masteryBarContainer}>
          <LinearGradient 
            colors={[Colors.gradientStart, Colors.gradientEnd]} 
            style={[styles.masteryBar, { width: `${item.mastery * 100}%` }]} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
      </BlurView>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={[Colors.bgGradientStart, Colors.bgGradientEnd]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <AfricanPattern />
        <View style={styles.header}>
          <Text style={Typography.h1 as any}>{translations[lang].select_chapter}</Text>
          <Text style={Typography.caption as any}>{translations[lang].chapters_subtitle}</Text>
        </View>

        <FlatList
          data={chapters}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.xl,
    marginTop: Spacing.md,
  },
  list: {
    padding: Spacing.md,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)', // Semi-transparent for blur
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    overflow: 'hidden', // Required for BlurView rounding
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
