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
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
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
  const [dynamicExplanation, setDynamicExplanation] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    loadNextExercise();
    return () => {
      Speech.stop();
    };
  }, []);

  const loadNextExercise = () => {
    try {
      const ex = db.getFirstSync<any>(
        'SELECT * FROM exercises WHERE chapter_id = ? ORDER BY RANDOM() LIMIT 1',
        chapterId
      );
      
      if (ex) {
        setExercise(ex);
        setShowExplanation(false);
        setAnswered(false);
        setDynamicExplanation(null);

        const knowledge = db.getFirstSync<any>(
          'SELECT pL FROM student_knowledge WHERE student_id = 1 AND skill_id = ?',
          ex.skill_id
        );
        
        if (knowledge) {
          setKnowledgeProb(knowledge.pL);
          progress.setValue(knowledge.pL);
        }
      }
    } catch (err) {
      console.error('Error loading exercise', err);
    }
  };

  const handleAnswer = (option: string) => {
    if (answered) return;
    
    const correct = option === exercise.answer;
    setIsCorrect(correct);
    setAnswered(true);

    try {
      db.runSync(
        'INSERT INTO attempts (student_id, exercise_id, is_correct) VALUES (1, ?, ?)',
        exercise.id, correct ? 1 : 0
      );

      const newProb = updateKnowledge(knowledgeProb, correct);
      setKnowledgeProb(newProb);

      db.runSync(
        'INSERT OR REPLACE INTO student_knowledge (student_id, skill_id, pL, last_updated) VALUES (1, ?, ?, CURRENT_TIMESTAMP)',
        exercise.skill_id, newProb
      );

      Animated.timing(progress, {
        toValue: newProb,
        duration: 500,
        useNativeDriver: false
      }).start();
    } catch (err) {
      console.error('Error updating attempt', err);
    }
  };

  const playAudio = async (text?: string) => {
    try {
      const speechText = text || exercise?.question;
      if (speechText) {
        Speech.stop();
        setIsSpeaking(true);
        
        // Technical Improvement: Sequential Bilingual Playback
        if (text && text.includes('---')) {
          const parts = text.split('---');
          const frenchPart = parts[0].replace('Explication :', '').trim();
          const peulhPart = parts[1].trim();

          // Speak French first
          Speech.speak(frenchPart, {
            language: 'fr-FR',
            rate: 0.9,
            pitch: 1.0,
            onDone: () => {
              // Short pause before Peulh
              setTimeout(() => {
                Speech.speak(peulhPart, {
                  language: 'fr-FR', // Using FR voice with custom prosody for Peulh
                  rate: 0.75,
                  pitch: 0.85,
                  onDone: () => setIsSpeaking(false)
                });
              }, 800);
            }
          });
        } else {
          // Standard single-language playback
          Speech.speak(speechText, { 
            language: 'fr-FR', 
            rate: 0.9, 
            pitch: 1.1,
            onDone: () => setIsSpeaking(false),
            onStopped: () => setIsSpeaking(false)
          });
        }
      }
    } catch (error) {
      console.error('Error playing speech', error);
      setIsSpeaking(false);
    }
  };

  if (!exercise) return <View style={styles.container}><Text>Chargement...</Text></View>;

  const options = JSON.parse(exercise.options);

  return (
    <LinearGradient colors={[Colors.bgGradientStart, Colors.bgGradientEnd]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <AfricanPattern />
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <Animated.View style={{ width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }}>
              <LinearGradient 
                colors={[Colors.gradientStart, Colors.gradientEnd]} 
                style={styles.progressBarFill} 
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </Animated.View>
          </View>
          <Text style={styles.progressText}>Maîtrise : {Math.round(knowledgeProb * 100)}%</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <BlurView intensity={80} tint="light" style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Text style={Typography.caption as any}>{chapterTitle}</Text>
              <TouchableOpacity onPress={() => playAudio()} style={[styles.audioBtn, isSpeaking && styles.audioBtnActive]}>
                <Volume2 size={24} color={isSpeaking ? '#FFF' : Colors.primary} />
                {isSpeaking && <View style={styles.speakingIndicator} />}
              </TouchableOpacity>
            </View>

            <Text style={styles.questionText}>{exercise.question}</Text>

            <View style={styles.optionsContainer}>
              {options.map((option: string, index: number) => (
                <TouchableOpacity 
                  key={index}
                  style={[
                    styles.optionBtn,
                    answered && option === exercise.answer && styles.correctOption,
                    answered && !isCorrect && option !== exercise.answer && styles.wrongOption,
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
              ))}
            </View>

            {answered && (
              <View style={styles.feedbackContainer}>
                <View style={[styles.feedbackLabel, isCorrect ? styles.correctLabel : styles.wrongLabel]}>
                  <Text style={[styles.feedbackText, { color: isCorrect ? Colors.success : Colors.error }]}>
                    {isCorrect ? 'Excellent !' : 'Continue d\'apprendre !'}
                  </Text>
                </View>

                <TouchableOpacity 
                  style={styles.explanationBtn}
                  onPress={async () => {
                    if (!showExplanation && !dynamicExplanation) {
                      // Check if we have it in database first
                      if (exercise.explanation_peulh && exercise.explanation_peulh.length > 10) {
                        setDynamicExplanation(exercise.explanation_peulh);
                        setShowExplanation(true);
                        playAudio(exercise.explanation_peulh);
                        return;
                      }

                      setIsGenerating(true);
                      setShowExplanation(true);
                      
                      // Detailed Bilingual Content Generation
                      const frText = `Explication : La bonne réponse est ${exercise.answer}. C'est une règle de base en ${chapterTitle}.`;
                      const fulText = exercise.explanation_peulh || 'Ndahu ko woni jaabol mbootu.';
                      const fullBilingualText = `${frText} --- ${fulText}`;
                      
                      let currentText = '';
                      let i = 0;
                      
                      playAudio(fullBilingualText);
                      
                      const typeWriter = setInterval(() => {
                        currentText += fullBilingualText.charAt(i);
                        setDynamicExplanation(currentText);
                        i++;
                        if (i >= fullBilingualText.length) {
                          clearInterval(typeWriter);
                          setIsGenerating(false);
                          
                          try {
                            db.runSync(
                              'UPDATE exercises SET explanation_peulh = ? WHERE id = ?',
                              fullBilingualText, exercise.id
                            );
                          } catch (e) {}
                        }
                      }, 20);
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
                    {dynamicExplanation?.split('---').map((part, idx) => (
                      <View key={idx} style={idx > 0 ? styles.peulhSection : styles.frSection}>
                        <Text style={styles.langLabel}>{idx === 0 ? 'FRANÇAIS' : 'PEULH'}</Text>
                        <Text style={styles.explanationText}>{part.trim()}</Text>
                      </View>
                    ))}
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
          </BlurView>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  progressContainer: {
    padding: Spacing.md,
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
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
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 32,
    padding: Spacing.lg,
    minHeight: 450,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioBtnActive: {
    backgroundColor: Colors.primary,
  },
  speakingIndicator: {
    width: 4,
    height: 12,
    backgroundColor: '#FFF',
    marginLeft: 8,
    borderRadius: 2,
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
    backgroundColor: Colors.surface,
    padding: 18, // Larger padding for ergonomics
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '500',
  },
  correctOption: {
    borderColor: Colors.success,
    backgroundColor: '#F0FFF4',
    borderWidth: 2, // Thicker border for clarity
  },
  wrongOption: {
    borderColor: Colors.error,
    backgroundColor: '#FFF5F5',
    borderWidth: 2,
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
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  peulhSection: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  frSection: {
    marginBottom: Spacing.sm,
  },
  langLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.primary,
    marginBottom: 4,
    letterSpacing: 1,
    opacity: 0.6,
  },
  nextBtn: {
    backgroundColor: Colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20, // Bigger for easier clicking
    borderRadius: 16,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  nextBtnText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 8,
  },
});

export default ExerciseScreen;
