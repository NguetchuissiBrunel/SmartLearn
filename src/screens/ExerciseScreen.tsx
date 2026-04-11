import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  Animated,
  Dimensions,
  Alert
} from 'react-native';
import { Volume2, Languages, CheckCircle2, XCircle, ArrowRight } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { Colors, Spacing, Typography } from '../constants/theme';
import AfricanPattern from '../components/AfricanPattern';
import { db } from '../db/database';
import { updateKnowledge } from '../utils/bkt';
import { LLMService } from '../services/llm';

const { width } = Dimensions.get('window');

const ExerciseScreen = ({ route }: any) => {
  const { chapterId, chapterTitle } = route.params;
  const [exercise, setExercise] = useState<any>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [knowledgeProb, setKnowledgeProb] = useState(0.2); // Initial pL0
  const [progress] = useState(new Animated.Value(0));
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [dynamicExplanation, setDynamicExplanation] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadNextExercise();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadNextExercise = () => {
    // Selection of the next exercise based on BKT or random for the chapter
    db.transaction((tx: any) => {

      tx.executeSql(
        'SELECT * FROM exercises WHERE skill_id IN (SELECT id FROM skills WHERE chapter_id = ? OR 1=1) ORDER BY RANDOM() LIMIT 1',
        [chapterId],
        (_: any, { rows }: any) => {
          if (rows.length > 0) {
            const ex = rows.item(0);
            setExercise(ex);
            setShowExplanation(false);
            setAnswered(false);
            setDynamicExplanation(null);

            // Load student knowledge for this skill
            tx.executeSql(
              'SELECT pL FROM student_knowledge WHERE student_id = 1 AND skill_id = ?',
              [ex.skill_id],
              (_2: any, { rows: kRows }: any) => {
                if (kRows.length > 0) {
                  const pL = kRows.item(0).pL;
                  setKnowledgeProb(pL);
                  progress.setValue(pL);
                }
              }
            );
          }
        }
      );
    });
  };

  const handleAnswer = (option: string) => {
    if (answered) return;
    
    const correct = option === exercise.answer;
    setIsCorrect(correct);
    setAnswered(true);

    // Update BKT persistently
    db.transaction((tx: any) => {
      // 1. Log the attempt
      tx.executeSql(
        'INSERT INTO attempts (student_id, exercise_id, is_correct) VALUES (1, ?, ?)',
        [exercise.id, correct ? 1 : 0]
      );

      // 2. Update knowledge probability
      const newProb = updateKnowledge(knowledgeProb, correct);
      setKnowledgeProb(newProb);

      tx.executeSql(
        'INSERT OR REPLACE INTO student_knowledge (student_id, skill_id, pL, last_updated) VALUES (1, ?, ?, CURRENT_TIMESTAMP)',
        [exercise.skill_id, newProb]
      );

      // Animate progress
      Animated.timing(progress, {
        toValue: newProb,
        duration: 500,
        useNativeDriver: false
      }).start();
    });
  };

  const playAudio = async () => {
    try {
      if (exercise?.audio_path) {
        if (sound) {
          await sound.unloadAsync();
        }
        
        // In Expo, local assets in seeds are usually handled via require() 
        // or FileSystem if they are downloaded. 
        // For this MVP, we assume they are in the assets folder.
        // Note: Real path would depend on how the user stores them.
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: exercise.audio_path },
          { shouldPlay: true }
        );
        setSound(newSound);
      } else {
        Alert.alert('Audio', 'Le fichier audio pour cet exercice n\'est pas encore disponible.');
      }
    } catch (error) {
      console.error('Error playing audio', error);
      Alert.alert('Erreur', 'Impossible de lire le fichier audio.');
    }
  };

  if (!exercise) return <View style={styles.container}><Text>Chargement...</Text></View>;

  const options = JSON.parse(exercise.options);

  return (
    <SafeAreaView style={styles.container}>
      <AfricanPattern />
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <Animated.View 
            style={[
              styles.progressBarFill, 
              { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>Maîtrise : {Math.round(knowledgeProb * 100)}%</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            <Text style={Typography.caption as any}>{chapterTitle}</Text>
            <TouchableOpacity onPress={playAudio} style={styles.audioBtn}>
              <Volume2 size={24} color={Colors.secondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.questionText}>{exercise.question}</Text>

          <View style={styles.optionsContainer}>
            {options.map((option: string, index: number) => {
              const isSelected = answered && option === (isCorrect ? exercise.answer : option); // simplified visual feedback
              const isWrong = answered && !isCorrect && option === option; // simplified
              
              return (
                <TouchableOpacity 
                  key={index}
                  style={[
                    styles.optionBtn,
                    answered && option === exercise.answer && styles.correctOption,
                    answered && !isCorrect && option !== exercise.answer && styles.wrongOption, // very basic logic
                  ]}
                  onPress={() => handleAnswer(option)}
                  disabled={answered}
                >
                  <Text style={[
                    styles.optionText,
                    answered && option === exercise.answer && styles.correctOptionText
                  ]}>{option}</Text>
                  {answered && option === exercise.answer && <CheckCircle2 size={20} color={Colors.success} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {answered && (
            <View style={styles.feedbackContainer}>
              <View style={[styles.feedbackLabel, isCorrect ? styles.correctLabel : styles.wrongLabel]}>
                <Text style={styles.feedbackText}>
                  {isCorrect ? 'Excellent !' : 'Continue d\'apprendre !'}
                </Text>
              </View>

              <TouchableOpacity 
                style={styles.explanationBtn}
                onPress={async () => {
                  if (!showExplanation && !dynamicExplanation) {
                    setIsGenerating(true);
                    setShowExplanation(true);
                    const prompt = `Explique en Peulh l'exercice suivant: ${exercise.question}. La réponse est ${exercise.answer}.`;
                    const result = await LLMService.generate(prompt);
                    setDynamicExplanation(result);
                    setIsGenerating(false);
                  } else {
                    setShowExplanation(!showExplanation);
                  }
                }}
                disabled={isGenerating}
              >
                <Languages size={20} color={isGenerating ? Colors.border : Colors.secondary} />
                <Text style={[styles.explanationBtnText, isGenerating && { color: Colors.border }]}>
                  {isGenerating ? 'Génération...' : (showExplanation ? 'Masquer l\'explication' : 'Explication IA Peulh')}
                </Text>
              </TouchableOpacity>

              {showExplanation && (
                <View style={styles.explanationContent}>
                  <Text style={styles.explanationText}>
                    {isGenerating ? 'L\'IA prépare une explication personnalisée...' : (dynamicExplanation || exercise.explanation_peulh)}
                  </Text>
                </View>
              )}

              <TouchableOpacity 
                style={styles.nextBtn}
                onPress={loadNextExercise}
              >
                <Text style={styles.nextBtnText}>Exercice suivant</Text>
                <ArrowRight size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          )}
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
  progressContainer: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.secondary,
  },
  progressText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'right',
  },
  scrollContent: {
    padding: Spacing.md,
  },
  exerciseCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: Spacing.lg,
    minHeight: 400,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  audioBtn: {
    backgroundColor: '#F0F7FF',
    padding: 10,
    borderRadius: 12,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.accent,
    marginBottom: Spacing.xl,
    lineHeight: 30,
  },
  optionsContainer: {
    marginBottom: Spacing.lg,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: 16,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionText: {
    fontSize: 18,
    color: Colors.text,
  },
  correctOption: {
    borderColor: Colors.success,
    backgroundColor: '#F0FFF4',
  },
  wrongOption: {
     // Optional: styles for wrong choices
  },
  correctOptionText: {
    color: Colors.success,
    fontWeight: 'bold',
  },
  feedbackContainer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  feedbackLabel: {
    padding: Spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  correctLabel: {
    backgroundColor: '#F0FFF4',
  },
  wrongLabel: {
    backgroundColor: '#FFF5F5',
  },
  feedbackText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  explanationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  explanationBtnText: {
    color: Colors.secondary,
    marginLeft: 8,
    fontWeight: '600',
  },
  explanationContent: {
    backgroundColor: '#F9F9F9',
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.md,
  },
  explanationText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: Colors.text,
    lineHeight: 22,
  },
  nextBtn: {
    backgroundColor: Colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: 16,
  },
  nextBtnText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 8,
  },
});

export default ExerciseScreen;
