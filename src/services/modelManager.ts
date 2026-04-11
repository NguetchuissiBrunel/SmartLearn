import { Paths } from 'expo-file-system';
import * as FileSystem from 'expo-file-system';
import { Config } from '../config';

const MODEL_FILENAME = 'smollm2-135m-q4_k_m.gguf';
const MODEL_URL = Config.MODEL_DOWNLOAD_URL;
const MODEL_DIR = `${Paths.document.uri}models/`;
const MODEL_PATH = `${MODEL_DIR}${MODEL_FILENAME}`;

export class ModelManager {
  /**
   * Checks if the model file already exists.
   */
  static async checkModelExists(): Promise<boolean> {
    try {
      const info = Paths.info(MODEL_PATH);
      return info.exists;
    } catch {
      return false;
    }
  }

  /**
   * Downloads the model file from Hugging Face.
   * @param onProgress Callback function for download progress (0 to 1).
   */
  static async downloadModel(onProgress: (progress: number) => void): Promise<string> {
    try {
      // Ensure directory exists
      const dirInfo = Paths.info(MODEL_DIR);
      if (!dirInfo.exists) {
        // We'll use the legacy API for directory creation if new one is complex
        await FileSystem.makeDirectoryAsync(MODEL_DIR, { intermediates: true });
      }

      const downloadResumable = FileSystem.createDownloadResumable(
        MODEL_URL,
        MODEL_PATH,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          onProgress(progress);
        }
      );

      const result = await downloadResumable.downloadAsync();
      return result?.uri || '';
    } catch (error) {
      console.error('Model download error:', error);
      throw error;
    }
  }

  /**
   * Returns the local path to the model.
   */
  static getModelPath(): string {
    return MODEL_PATH;
  }
}
