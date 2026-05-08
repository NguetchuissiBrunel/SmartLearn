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
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors, Spacing, Typography } from '../constants/theme';
import AfricanPattern from '../components/AfricanPattern';
import { db } from '../db/database';
import { predictCorrect } from '../utils/bkt';
import { Brain, Zap, Target } from 'lucide-react-native';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [student, setStudent] = useState<any>(null);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    avgMastery: 0,
    chaptersCompleted: 0
  });

  useEffect(() => {
    try {
      const studentData = db.getFirstSync<any>('SELECT * FROM students ORDER BY id DESC LIMIT 1');
      if (studentData) setStudent(studentData);

      const attemptsCount = db.getFirstSync<{count: number}>('SELECT COUNT(*) as count FROM attempts');
      if (attemptsCount) setStats(prev => ({ ...prev, totalAttempts: attemptsCount.count || 0 }));

      const masteryAvg = db.getFirstSync<{avg: number}>('SELECT AVG(pL) as avg FROM student_knowledge');
      if (masteryAvg) setStats(prev => ({ ...prev, avgMastery: masteryAvg.avg || 0 }));
    } catch (err) {
      console.error('Error fetching profile stats', err);
    }
  }, []);

  const nextSuccessProb = predictCorrect(stats.avgMastery);

  const getBadgeTitle = (mastery: number) => {
    if (mastery >= 0.8) return 'Lion de la Savane';
    if (mastery >= 0.5) return 'Guerrier Bogolan';
    return 'Apprenti Sâge';
  };

  return (
    <LinearGradient colors={[Colors.bgGradientStart, Colors.bgGradientEnd]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <AfricanPattern />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeft color={Colors.primary} size={28} />
          </TouchableOpacity>
          <Text style={Typography.h1 as any}>Mon Profil</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <BlurView intensity={80} tint="light" style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <User color={Colors.secondary} size={40} />
            </View>
            <Text style={styles.studentName}>{student?.name || 'Étudiant'}</Text>
            <Text style={styles.schoolName}>{student?.school} - {student?.class}</Text>
            
            <View style={styles.badgeContainer}>
              <Award color="#FFD700" size={24} />
              <Text style={styles.badgeText}>{getBadgeTitle(stats.avgMastery)}</Text>
            </View>
          </BlurView>

          <View style={styles.statsGrid}>
            <BlurView intensity={80} tint="light" style={styles.statBox}>
              <TrendingUp color={Colors.secondary} size={24} />
              <Text style={styles.statValue}>{stats.totalAttempts}</Text>
              <Text style={styles.statLabel}>Exercices faits</Text>
            </BlurView>
            <BlurView intensity={80} tint="light" style={styles.statBox}>
              <Award color={Colors.secondary} size={24} />
              <Text style={styles.statValue}>{Math.round(stats.avgMastery * 100)}%</Text>
              <Text style={styles.statLabel}>Maîtrise totale</Text>
            </BlurView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Analyse IA Prédictive</Text>
            <BlurView intensity={90} tint="light" style={styles.predictionCard}>
              <View style={styles.predictionHeader}>
                <Brain color={Colors.primary} size={28} />
                <Text style={styles.predictionTitle}>Calcul de réussite</Text>
              </View>
              <Text style={styles.predictionDesc}>
                Basé sur ton historique, l'IA estime tes chances de réussir le prochain défi à :
              </Text>
              <View style={styles.probContainer}>
                <Text style={styles.probValue}>{Math.round(nextSuccessProb * 100)}%</Text>
                <View style={styles.probTrack}>
                  <LinearGradient 
                    colors={[Colors.secondary, Colors.primary]} 
                    style={[styles.probFill, { width: `${nextSuccessProb * 100}%` }]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  />
                </View>
              </View>
              <View style={styles.aiBadge}>
                <Zap color={Colors.accent} size={14} />
                <Text style={styles.aiBadgeText}>Moteur BKT Temps Réel</Text>
              </View>
            </BlurView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ma Progression</Text>
            <BlurView intensity={80} tint="light" style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Target color={Colors.secondary} size={20} />
                <Text style={styles.progressLabel}>Compétences acquises</Text>
              </View>
              <View style={styles.progressBarBg}>
                <LinearGradient 
                  colors={[Colors.gradientStart, Colors.gradientEnd]} 
                  style={[styles.progressBar, { width: `${stats.avgMastery * 100}%` }]} 
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
            </BlurView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
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
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 32,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    overflow: 'hidden',
  },
  avatarContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.secondary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  studentName: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 4,
  },
  schoolName: {
    fontSize: 16,
    color: Colors.textSecondary,
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
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: Spacing.lg,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    overflow: 'hidden',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.primary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: '600',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h2,
    fontSize: 20,
    marginBottom: Spacing.md,
  },
  predictionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 32,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  predictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: 12,
  },
  predictionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primary,
  },
  predictionDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  probContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  probValue: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 8,
  },
  probTrack: {
    width: '100%',
    height: 10,
    backgroundColor: Colors.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  probFill: {
    height: '100%',
    borderRadius: 5,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 6,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: Spacing.lg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    overflow: 'hidden',
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  progressBarBg: {
    height: 12,
    backgroundColor: Colors.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  }
});

export default ProfileScreen;
