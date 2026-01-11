import { Tweet, AnalysisResult, RiskFactor } from "../types";

// Extended list of triggers including "moon", "gem", "alpha", etc.
const CRYPTO_WORDS = ['nft', 'crypto', 'claim', 'airdrop', 'giveaway', 'wallet', 'presale', 'mint', 'moon', 'gem', 'alpha', 'pump', 'whitelist', 'hodl', 'bullish'];

const TOXIC_WORDS = ['idiot', 'stupid', 'scam', 'fake', 'hate', 'kill', 'ugly', 'worst', 'shitty', 'damn', 'fuck', 'shit', 'bitch'];

export const analyzeProfile = (tweets: Tweet[], isVerified: boolean): AnalysisResult => {
  let score = 100;
  const totalTweets = tweets.length;
  
  if (totalTweets === 0) {
     return {
        score: 100,
        verdict: 'Safe',
        riskLevel: 'LOW',
        factors: [],
        tweetsScanned: 0,
        recommendations: ["No data packets available for analysis."]
     };
  }

  // Accumulators for penalties
  let cryptoPenalty = 0;
  let toxicPenalty = 0;
  let hashtagPenalty = 0;
  let linkPenalty = 0;
  let lowEffortPenalty = 0;
  let emojiPenalty = 0;
  let capsPenalty = 0;
  let retweetPenalty = 0;

  // Occurrence counters
  let cryptoCount = 0;
  let toxicCount = 0;
  let hashtagCount = 0;
  let linkCount = 0;
  let lowEffortCount = 0;
  let emojiCount = 0;
  let capsCount = 0;
  let retweetCount = 0;

  const factors: RiskFactor[] = [];

  // --- Verification Status Check ---
  // If NOT verified (False), deduct 20 points.
  if (!isVerified) {
    const unverifiedDeduction = 20;
    score -= unverifiedDeduction;
    factors.push({
      id: 'unverified_status',
      name: 'Unverified Identity',
      deduction: unverifiedDeduction,
      detected: true,
      count: 1,
      description: "Unverified identity detected. Account classified as 'Tier 3 / Low Trust' by ranking algorithms (-20 pts)."
    });
  }

  tweets.forEach(t => {
    const textLower = t.text.toLowerCase();
    
    // Check for Retweet (starts with "RT @")
    // Note: We check text.trim() to be safe
    if (t.text.trim().startsWith("RT @")) {
        retweetCount++;
    }

    // 1. Crypto/Hype Keywords (-13 pts)
    if (CRYPTO_WORDS.some(w => textLower.includes(w))) {
      cryptoCount++;
      cryptoPenalty += 13;
    }

    // 2. Toxicity/Bad Language (-17 pts)
    if (TOXIC_WORDS.some(w => textLower.includes(w))) {
      toxicCount++;
      toxicPenalty += 17;
    }

    // 3. Hashtag Spam > 3 (-7 pts)
    const hashtags = (t.text.match(/#[a-z0-9_]+/gi) || []).length;
    if (hashtags > 3) {
      hashtagCount++;
      hashtagPenalty += 7;
    }

    // 4. Link Spam (cumulative -4 pts per tweet)
    if (/(https?:\/\/[^\s]+)/g.test(t.text)) {
      linkCount++;
      linkPenalty += 4;
    }

    // 5. Low Effort < 30 chars (-3 pts)
    // We usually ignore retweets for low effort checks to be fair, but specification says "Low Effort" logic generally.
    // However, RTs are often short if they just copy the header. 
    // We will keep the logic strict as requested.
    if (t.text.length < 30) {
      lowEffortCount++;
      lowEffortPenalty += 3;
    }

    // 6. Emoji Overload > 3 (-6 pts)
    // Using Unicode property escapes for broad emoji support
    const emojis = (t.text.match(/[\p{Extended_Pictographic}]/gu) || []).length;
    if (emojis > 3) {
      emojiCount++;
      emojiPenalty += 6;
    }

    // 7. Caps Lock > 60% (-9 pts)
    const letters = t.text.replace(/[^a-zA-Z]/g, '');
    if (letters.length > 0) {
      const upper = letters.replace(/[^A-Z]/g, '').length;
      if ((upper / letters.length) > 0.6) {
        capsCount++;
        capsPenalty += 9;
      }
    }
  });

  // --- NEW RULE: Retweet Ratio Check ---
  // If > 60% of tweets are RTs, deduct 9 points
  const retweetRatio = totalTweets > 0 ? retweetCount / totalTweets : 0;
  if (retweetRatio > 0.60) {
      retweetPenalty = 9;
  }

  // Apply Deductions
  score -= cryptoPenalty;
  score -= toxicPenalty;
  score -= hashtagPenalty;
  score -= linkPenalty;
  score -= lowEffortPenalty;
  score -= emojiPenalty;
  score -= capsPenalty;
  score -= retweetPenalty;

  // 8. Algorithmic Uncertainty (Random noise -2 to -5)
  const uncertainty = Math.floor(Math.random() * 4) + 2;
  score -= uncertainty;

  // Floor score at 0
  score = Math.max(0, score);

  // Construct Risk Factors
  if (retweetPenalty > 0) {
      factors.push({
          id: 'retweets',
          name: 'Low Original Content',
          deduction: retweetPenalty,
          detected: true,
          count: retweetCount,
          description: `High amplification ratio detected (>60% reposts). Account flagged for 'Low Original Content' distribution (-9 pts).`
      });
  }

  if (cryptoCount > 0) {
      factors.push({
          id: 'crypto',
          name: 'Commercial Intent',
          deduction: cryptoPenalty,
          detected: true,
          count: cryptoCount,
          description: `Commercial trigger words identified in ${cryptoCount} tweets (-13 pts each).`
      });
  }
  if (toxicCount > 0) {
      factors.push({
          id: 'toxicity',
          name: 'Sentiment Volatility',
          deduction: toxicPenalty,
          detected: true,
          count: toxicCount,
          description: `Negative sentiment markers detected in ${toxicCount} tweets (-17 pts each).`
      });
  }
  if (hashtagCount > 0) {
      factors.push({
          id: 'hashtags',
          name: 'Tag Density',
          deduction: hashtagPenalty,
          detected: true,
          count: hashtagCount,
          description: `Excessive tag density detected in ${hashtagCount} tweets (-7 pts each).`
      });
  }
  if (linkCount > 0) {
      factors.push({
          id: 'links',
          name: 'External Routing',
          deduction: linkPenalty,
          detected: true,
          count: linkCount,
          description: `Outbound traffic attempts identified in ${linkCount} tweets (-4 pts each).`
      });
  }
  if (lowEffortCount > 0) {
      factors.push({
          id: 'low_effort',
          name: 'Low Entropy',
          deduction: lowEffortPenalty,
          detected: true,
          count: lowEffortCount,
          description: `Low-entropy content flagged in ${lowEffortCount} tweets (-3 pts each).`
      });
  }
  if (emojiCount > 0) {
      factors.push({
          id: 'emoji',
          name: 'Visual Noise',
          deduction: emojiPenalty,
          detected: true,
          count: emojiCount,
          description: `High density of non-text glyphs in ${emojiCount} tweets (-6 pts each).`
      });
  }
  if (capsCount > 0) {
      factors.push({
          id: 'caps',
          name: 'Typographic Aggression',
          deduction: capsPenalty,
          detected: true,
          count: capsCount,
          description: `Aggressive casing patterns detected in ${capsCount} tweets (-9 pts each).`
      });
  }

  // Always add uncertainty factor
  factors.push({
      id: 'uncertainty',
      name: 'Algorithmic Noise',
      deduction: uncertainty,
      detected: true,
      count: 1,
      description: `Baseline behavioral pattern interference.`
  });

  // Verdict Logic
  let verdict: AnalysisResult['verdict'] = 'Safe';
  let riskLevel: AnalysisResult['riskLevel'] = 'LOW';
  const recommendations: string[] = [];

  if (score >= 80) {
      verdict = 'Safe';
      riskLevel = 'LOW';
      recommendations.push("Profile aligns with organic baseline patterns.");
      recommendations.push("Maintain current content variance entropy.");
  } else if (score >= 50) {
      verdict = 'Moderate Risk';
      riskLevel = 'MEDIUM';
      recommendations.push("Reduce outbound link frequency immediately.");
      recommendations.push("Normalize capitalization and emoji usage.");
      if (!isVerified) recommendations.push("Consider Verified subscription to bypass Tier 3 filters.");
      if (retweetPenalty > 0) recommendations.push("Reduce Retweet ratio. Post more original content.");
      recommendations.push("Increase text entropy (longer, more unique tweets).");
  } else {
      verdict = 'High Risk';
      riskLevel = 'HIGH';
      recommendations.push("CRITICAL: Cease all automated or repetitive activity.");
      if (!isVerified) recommendations.push("Account trust score critically low due to unverified status.");
      if (retweetPenalty > 0) recommendations.push("Stop amplification (RT) behavior. Account marked as distribution node.");
      recommendations.push("Remove content containing commercial trigger keywords.");
      recommendations.push("Enter dormant state for 48h to reset algorithmic trust.");
  }

  return {
    score,
    verdict,
    riskLevel,
    factors,
    tweetsScanned: totalTweets,
    recommendations
  };
};