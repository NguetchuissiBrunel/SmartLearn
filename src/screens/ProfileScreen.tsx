import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { User, Award, TrendingUp, ChevronLeft } from 'lucide-react-native';
import { Colors, Spacing, Typography } from '../constants/theme';
import AfricanPattern from '../components/AfricanPattern';
import { db } from '../db/database';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [student, setStudent] = useState<any>(null);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    avgMastery: 0,
    chaptersCompleted: 0
  });

  useEffect(() => {
    db.transaction((tx: any) => {
      // Get student info (latest)
      tx.executeSql('SELECT * FROM students ORDER BY id DESC LIMIT 1', [], (_: any, { rows }: any) => {
        if (rows.length > 0) setStudent(rows.item(0));
      });

      // Get stats
      tx.executeSql('SELECT COUNT(*) as count FROM attempts', [], (_: any, { rows }: any) => {
        setStats(prev => ({ ...prev, totalAttempts: rows.item(0).count }));
      });

      tx.executeSql('SELECT AVG(pL) as avg FROM student_knowledge', [], (_: any, { rows }: any) => {
        setStats(prev => ({ ...prev, avgMastery: rows.item(0).avg || 0 }));
      });
    });
  }, []);

  const getBadgeTitle = (mastery: number) => {
    if (mastery >= 0.8) return 'Lion de la Savane';
    if (mastery >= 0.5) return 'Guerrier Bogolan';
    return 'Apprenti Sâge';
  };

  return (
    <SafeAreaView style={styles.container}>
      <AfricanPattern />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={Colors.primary} size={28} />
        </TouchableOpacity>
        <Text style={Typography.h1 as any}>Mon Profil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <User color={Colors.secondary} size={40} />
          </View>
          <Text style={styles.studentName}>{student?.name || 'Étudiant'}</Text>
          <Text style={styles.schoolName}>{student?.school} - {student?.class}</Text>
          
          <View style={styles.badgeContainer}>
            <Award color="#FFD700" size={24} />
            <Text style={styles.badgeText}>{getBadgeTitle(stats.avgMastery)}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <TrendingUp color={Colors.secondary} size={24} />
            <Text style={styles.statValue}>{stats.totalAttempts}</Text>
            <Text style={styles.statLabel}>Exercices faits</Text>
          </View>
          <View style={styles.statBox}>
            <Award color={Colors.secondary} size={24} />
            <Text style={styles.statValue}>{Math.round(stats.avgMastery * 100)}%</Text>
            <Text style={styles.statLabel}>Maîtrise totale</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ma Progression</Text>
          <View style={styles.progressCard}>
            <Text style={styles.progressLabel}>Compétences acquises</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBar, { width: `${stats.avgMastery * 100}%` }]} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  backBtn: {
    marginRight: Spacing.md,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.secondary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  studentName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  schoolName: {
    fontSize: 16,
    color: '#666',
    marginBottom: Spacing.md,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#B8860B',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: Spacing.lg,
    borderRadius: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  progressCard: {
    backgroundColor: '#FFF',
    padding: Spacing.lg,
    borderRadius: 20,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.secondary,
  }
});

export default ProfileScreen;
