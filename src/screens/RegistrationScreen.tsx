import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  Vibration,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { User, GraduationCap, School, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors, Spacing, Typography } from '../constants/theme';
import AfricanPattern from '../components/AfricanPattern';
import { db } from '../db/database';
import { ModelManager } from '../services/modelManager';

const RegistrationScreen = () => {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('6ème');
  const [school, setSchool] = useState('');
  const [language, setLanguage] = useState('fr'); // 'fr' or 'ful'
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleRegister = async () => {
    if (!name || !school) {
      Alert.alert('Champs requis', 'Veuillez remplir toutes les informations.');
      return;
    }

    try {
      const result = db.runSync(
        'INSERT INTO students (name, class, school, language) VALUES (?, ?, ?, ?)',
        name, studentClass, school, language
      );
      console.log('Student registered with ID:', result.lastInsertRowId);
      
      // Check if model needs download
      const exists = await ModelManager.checkModelExists();
      if (!exists) {
        setIsDownloading(true);
        try {
          // DEMO MODE: Simulate fast download for the video presentation
          let p = 0;
          const interval = setInterval(() => {
            p += 0.25;
            if (p > 1) p = 1;
            setDownloadProgress(p);
            if (p >= 1) {
              clearInterval(interval);
              setIsDownloading(false);
              navigation.navigate('Chapters');
            }
          }, 600); // 2.4 seconds total fake download
        } catch (error) {
          Alert.alert('Erreur', 'Échec du téléchargement du cerveau de l\'IA. Veuillez vérifier votre connexion.');
          setIsDownloading(false);
        }
      } else {
        navigation.navigate('Chapters');
      }
    } catch (err) {
      console.error('Error saving student', err);
    }
  };

  return (
    <LinearGradient
      colors={[Colors.gradientStart, Colors.gradientEnd]}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <AfricanPattern />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[Typography.h1, { color: '#FFF' }] as any}>SMARTLearn</Text>
            <Text style={[Typography.caption, { color: 'rgba(255,255,255,0.8)' }] as any}>Apprendre à mon rythme, partout.</Text>
          </View>

          <BlurView intensity={80} tint="light" style={styles.form}>
            <View style={styles.inputContainer}>
              <User size={20} color={Colors.textSecondary} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Ton nom complet"
                placeholderTextColor={Colors.textSecondary}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <School size={20} color={Colors.textSecondary} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nom de ton école"
                placeholderTextColor={Colors.textSecondary}
                value={school}
                onChangeText={setSchool}
              />
            </View>

            <View style={styles.languageContainer}>
              <Text style={styles.label}>Choisis ta classe</Text>
              <View style={styles.langButtons}>
                {['CM1', 'CM2', '6ème', '5ème'].map((c) => (
                  <TouchableOpacity 
                    key={c}
                    style={[styles.langBtn, studentClass === c && styles.langBtnActive]} 
                    onPress={() => {
                      setStudentClass(c);
                      Vibration.vibrate(10);
                    }}
                  >
                    <Text style={[styles.langBtnText, studentClass === c && styles.langBtnTextActive]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.languageContainer}>
              <Text style={styles.label}>Langue de l'interface</Text>
              <View style={styles.langButtons}>
                <TouchableOpacity 
                  style={[styles.langBtn, language === 'fr' && styles.langBtnActive]} 
                  onPress={() => {
                    setLanguage('fr');
                    Vibration.vibrate(10);
                  }}
                >
                  <Text style={[styles.langBtnText, language === 'fr' && styles.langBtnTextActive]}>Français</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.langBtn, language === 'ful' && styles.langBtnActive]} 
                  onPress={() => {
                    setLanguage('ful');
                    Vibration.vibrate(10);
                  }}
                >
                  <Text style={[styles.langBtnText, language === 'ful' && styles.langBtnTextActive]}>Peulh</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.button, isDownloading && { opacity: 0.7 }]} 
              onPress={handleRegister}
              disabled={isDownloading}
            >
              <Text style={styles.buttonText}>
                {isDownloading ? `Initialisation IA... ${Math.round(downloadProgress * 100)}%` : 'Commencer'}
              </Text>
              {!isDownloading && <ArrowRight size={20} color="#FFF" />}
            </TouchableOpacity>
          </BlurView>
        </View>

        {isDownloading && (
          <BlurView intensity={90} tint="dark" style={styles.downloadOverlay}>
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={Colors.secondary} />
              <Text style={styles.percentageText}>{Math.round(downloadProgress * 100)}%</Text>
            </View>
            <Text style={styles.downloadText}>Initialisation du cerveau de l'IA...</Text>
          </BlurView>
        )}
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xl * 2,
    alignItems: 'center',
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: Spacing.lg,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    overflow: 'hidden',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
  },
  icon: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: Typography.body.fontSize,
    color: Colors.text,
  },
  label: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
    marginTop: 8,
    marginLeft: 4,
  },
  button: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18, // increased for ergonomics
    borderRadius: 16,
    marginTop: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  languageContainer: {
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  langButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  langBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  langBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  langBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  langBtnTextActive: {
    color: '#FFF',
  },
  downloadOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loaderContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  percentageText: {
    position: 'absolute',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  downloadText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
  }
});

export default RegistrationScreen;
