import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { User, GraduationCap, School, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

  const handleRegister = () => {
    if (!name || !school) {
      Alert.alert('Champs requis', 'Veuillez remplir toutes les informations.');
      return;
    }

    db.transaction((tx: any) => {
      tx.executeSql(
        'INSERT INTO students (name, class, school, language) VALUES (?, ?, ?, ?)',
        [name, studentClass, school, language],
        async (_: any, { insertId }: any) => {
          console.log('Student registered with ID:', insertId);
          
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
        },
        (_: any, err: any) => {
          console.error('Error saving student', err);
          return true;
        }
      );
    });
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

        <View style={styles.form}>
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
            <GraduationCap size={20} color={Colors.textSecondary} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Ta classe (ex: 6ème)"
              placeholderTextColor={Colors.textSecondary}
              value={studentClass}
              onChangeText={setStudentClass}
              editable={false} // Defaulted to 6ème as per specs
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
            <Text style={styles.label}>Langue de l'interface</Text>
            <View style={styles.langButtons}>
              <TouchableOpacity 
                style={[styles.langBtn, language === 'fr' && styles.langBtnActive]} 
                onPress={() => setLanguage('fr')}
              >
                <Text style={[styles.langBtnText, language === 'fr' && styles.langBtnTextActive]}>Français</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.langBtn, language === 'ful' && styles.langBtnActive]} 
                onPress={() => setLanguage('ful')}
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
            {!isDownloading && <ArrowRight size={20} color={Colors.primary} />}
          </TouchableOpacity>
        </View>
      </View>

      {isDownloading && (
        <View style={styles.downloadOverlay}>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${downloadProgress * 100}%` }]} />
          </View>
          <Text style={styles.downloadText}>Téléchargement du module de langue Peulh...</Text>
        </View>
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: Spacing.lg,
    borderRadius: 24,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.sm,
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
    marginTop: 12,
  },
  button: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginTop: 15,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
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
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  langBtnActive: {
    borderColor: Colors.secondary,
    backgroundColor: Colors.secondary + '10',
  },
  langBtnText: {
    fontSize: 14,
    color: '#666',
  },
  langBtnTextActive: {
    color: Colors.secondary,
    fontWeight: 'bold',
  },
  downloadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#EEE',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.secondary,
  },
  downloadText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  }
});

export default RegistrationScreen;
