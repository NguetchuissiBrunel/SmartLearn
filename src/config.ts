/**
 * SMARTLearn Configuration
 * Change these values for production deployment.
 */
export const Config = {
  // The URL of your backend (FastAPI/Spring Boot) for data synchronization
  SYNC_URL: 'https://api.smartlearn.cm/v1/sync',
  
  // The URL to download the LLM model if missing
  MODEL_DOWNLOAD_URL: 'https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct-GGUF/resolve/main/smollm2-135m-instruct-q4_k_m.gguf',
  
  // BKT Algorithm default parameters
  BKT: {
    pL0: 0.2, // Initial knowledge
    pT: 0.3,  // Probability of learning
    pG: 0.1,  // Probability of guessing
    pS: 0.05, // Probability of slipping
  }
};
