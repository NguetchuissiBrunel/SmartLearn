import { initLlama, LlamaContext } from 'llama.rn';
import { Paths } from 'expo-file-system';

const MODEL_FILENAME = 'smollm2-135m-q4_k_m.gguf';
// In SDK 55, documentDirectory is found via Paths.document
const MODEL_DIR = `${Paths.document.uri}models/`;

export class LLMService {
  private static context: LlamaContext | null = null;
  private static isInitializing = false;

  /**
   * Initializes the Llama context with the model file.
   * Note: The model file must be present in the device's document directory.
   */
  static async init() {
    if (this.context || this.isInitializing) return;

    this.isInitializing = true;
    try {
      // Check if the native module is available (prevent crash in Expo Go)
      if (typeof initLlama === 'undefined') {
        console.warn('LLM Service: initLlama is undefined. This module requires a development build (expo-dev-client).');
        this.isInitializing = false;
        return;
      }

      const modelPath = `${MODEL_DIR}${MODEL_FILENAME}`;
      const fileInfo = Paths.info(modelPath);

      if (!fileInfo.exists) {
        console.warn('LLM Model file not found at:', modelPath);
        this.isInitializing = false;
        return;
      }

      console.log('LLM Service: Initializing Llama with path:', modelPath);
      this.context = await initLlama({
        model: modelPath,
        use_mlock: true,
        n_ctx: 1024,
      });
      console.log('LLM Context initialized successfully');
    } catch (error) {
      console.error('Failed to initialize LLM:', error);
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * Generates a response based on the prompt.
   */
  static async generate(prompt: string): Promise<string> {
    if (!this.context) {
      await this.init();
    }

    if (!this.context) {
      return 'Désolé, le assistant Peulh est hors ligne.';
    }

    try {
      const response = await this.context.completion({
        prompt: `Assistant en langue Peulh. Question: ${prompt}\nRéponse:`,
        n_predict: 128,
        stop: ['\n', 'Question:'],
      });
      return response.text.trim();
    } catch (error) {
      console.error('Generation error:', error);
      return 'Erreur de génération.';
    }
  }
}
