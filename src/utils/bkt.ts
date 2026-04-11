/**
 * Bayesian Knowledge Tracing (BKT) Algorithm
 * 
 * Parameters based on Cahier des Charges:
 * p(L0) = 0.2   (Initial knowledge)
 * p(T)  = 0.3   (Probability of learning)
 * p(G)  = 0.1   (Probability of guessing correctly)
 * p(S)  = 0.05  (Probability of slipping/making a mistake)
 */

const BKT_PARAMS = {
  pL0: 0.2,
  pT: 0.3,
  pG: 0.1,
  pS: 0.05,
};

/**
 * Updates the knowledge probability based on an observation (Correct/Incorrect response)
 * 
 * @param pLPrev Previous probability of mastering the skill
 * @param isCorrect Whether the response was correct
 * @returns Updated knowledge probability
 */
export const updateKnowledge = (pLPrev: number, isCorrect: boolean): number => {
  let pLKnown;

  if (isCorrect) {
    // Probability known given correct response
    pLKnown = (pLPrev * (1 - BKT_PARAMS.pS)) / 
              (pLPrev * (1 - BKT_PARAMS.pS) + (1 - pLPrev) * BKT_PARAMS.pG);
  } else {
    // Probability known given incorrect response
    pLKnown = (pLPrev * BKT_PARAMS.pS) / 
              (pLPrev * BKT_PARAMS.pS) + (1 - pLPrev) * (1 - BKT_PARAMS.pG);
  }

  // Next probability (adding transition/learning chance)
  const pLNext = pLKnown + (1 - pLKnown) * BKT_PARAMS.pT;

  // Clamp value between 0 and 1
  return Math.max(0, Math.min(1, pLNext));
};

/**
 * Calculates the probability that the student will answer the next question correctly
 * 
 * @param pL Current probability of mastering the skill
 * @returns Probability of correct response
 */
export const predictCorrect = (pL: number): number => {
  return pL * (1 - BKT_PARAMS.pS) + (1 - pL) * BKT_PARAMS.pG;
};
