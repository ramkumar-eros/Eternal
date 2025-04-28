// src/services/gpt.js
import axios from 'axios';

// Replace with your actual API endpoint and key management strategy
const API_ENDPOINT = process.env.REACT_APP_GPT_API_ENDPOINT
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY 

/**
 * Generates a personalized aura reading and profile based on user answers
 * @param {Array} answers - Array of question-answer objects
 * @returns {Object} - GPT generated profile with aura colors, personality insights, and recommendations
 */
export const generateGPTResponse = async (answers) => {
  try {
    console.log("Starting GPT request with answers:", answers);
    
    // If no API key is configured, return mock response
    if (!API_KEY) {
      console.log("No API key found, using mock response");
      return getMockResponse();
    }
    
    // Create a prompt from the user's answers
    const prompt = createPromptFromAnswers(answers);
    
    console.log("Sending request to GPT API");
    
    // Call the GPT API
    const response = await axios.post(
      API_ENDPOINT,
      {
        model: "gpt-4-turbo", // You can change this to a more appropriate model if needed
        messages: [
          {
            role: "system",
            content: "You are Eternal, an expert spiritual guide specializing in aura reading and personalized energy analysis. Based on the answers provided, create a highly personalized aura reading that includes dominant aura colors, personality insights, energy analysis (what boosts and drains their energy), and specific alignment recommendations. Be insightful, specific, and compassionate."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );

    console.log("GPT API response received");
    
    // Process the response
    const result = response.data.choices[0].message.content;
    
    // Structure the result into sections
    return processGPTResponse(result);
  } catch (error) {
    console.error('Error generating GPT response:', error);
    console.log("Falling back to mock response due to error");
    // Return mock data on error to prevent app from breaking
    return getMockResponse();
  }
};

/**
 * Creates a prompt string from the user's answers
 * @param {Array} answers - Array of question-answer objects
 * @returns {String} - Formatted prompt string
 */
const createPromptFromAnswers = (answers) => {
  let prompt = "Generate a personalized spiritual aura reading based on the following responses.\n\n";
  
  // Add question answers
  prompt += "Here are their responses to the questionnaire:\n\n";
  
  answers.forEach((item, index) => {
    prompt += `Question ${index + 1}: ${item.question}\nAnswer: ${item.answer}\n\n`;
  });
  
  prompt += "Based on these responses, please provide:\n\n";
  prompt += "1. AURA COLORS: Their dominant aura colors and what they represent about their energy and spiritual essence\n";
  prompt += "2. PERSONALITY: Key personality traits and tendencies revealed by their answers\n";
  prompt += "3. SPIRITUAL: Their spiritual strengths and challenges\n";
  prompt += "4. ENERGY BOOSTERS: List 5 specific things that are boosting their energy based on their answers\n";
  prompt += "5. ENERGY DRAINS: List 5 specific things that are draining their energy based on their answers\n";
  prompt += "6. ALIGNMENT: Detailed recommendations for how they can stay aligned with their true essence\n";
  prompt += "7. DAILY PRACTICE: A specific daily practice tailored to their unique energy profile\n\n";
  
  prompt += "Format your response with clear section headers in ALL CAPS followed by detailed content that feels personalized to them based on their answers. Use beautiful, insightful language that resonates with spiritual wisdom but remains practical.";
  
  return prompt;
};

/**
 * Processes the GPT response into structured sections
 * @param {String} response - Raw GPT response text
 * @returns {Object} - Structured response object
 */
const processGPTResponse = (response) => {
  // Create a basic structure for the response
  try {
    const sections = {
      auraColors: extractSection(response, "AURA COLORS", "PERSONALITY"),
      personality: extractSection(response, "PERSONALITY", "SPIRITUAL"),
      spiritualProfile: extractSection(response, "SPIRITUAL", "ENERGY BOOSTERS"),
      energyBoosters: extractSection(response, "ENERGY BOOSTERS", "ENERGY DRAINS"),
      energyDrains: extractSection(response, "ENERGY DRAINS", "ALIGNMENT"),
      alignment: extractSection(response, "ALIGNMENT", "DAILY PRACTICE"),
      dailyPractice: extractSection(response, "DAILY PRACTICE", null)
    };
    
    // Make sure we have some content in each section
    if (Object.values(sections).some(section => !section)) {
      console.log("Some sections are missing, trying alternate extraction");
      // Simple fallback: just return the whole response
      return {
        fullReading: response,
        // Extract colors using regex pattern matching
        auraColors: extractAuraColorsFallback(response)
      };
    }
    
    return sections;
  } catch (error) {
    console.error("Error processing GPT response:", error);
    return {
      fullReading: response,
      auraColors: extractAuraColorsFallback(response)
    };
  }
};

/**
 * Extracts a section from the GPT response text
 * @param {String} text - Full GPT response text
 * @param {String} startMarker - Section starting keyword
 * @param {String|null} endMarker - Section ending keyword, null if it's the last section
 * @returns {String} - Extracted section content
 */
const extractSection = (text, startMarker, endMarker) => {
  try {
    // Case insensitive search for flexibility
    const startRegex = new RegExp(`${startMarker}[:\\s]*`, 'i');
    const startMatch = text.match(startRegex);
    
    if (!startMatch) return null;
    
    const startIndex = startMatch.index + startMatch[0].length;
    let endIndex;
    
    if (endMarker) {
      const endRegex = new RegExp(`${endMarker}[:\\s]*`, 'i');
      const endMatch = text.substring(startIndex).match(endRegex);
      endIndex = endMatch ? startIndex + endMatch.index : text.length;
    } else {
      endIndex = text.length;
    }
    
    return text.substring(startIndex, endIndex).trim();
  } catch (error) {
    console.error('Error extracting section:', error);
    return null;
  }
};

/**
 * Fallback method to extract aura colors using pattern matching
 * @param {String} text - Full GPT response text
 * @returns {Array} - Array of identified aura colors
 */
const extractAuraColorsFallback = (text) => {
  const colorPatterns = [
    'blue', 'purple', 'violet', 'indigo', 'red', 'orange',
    'yellow', 'green', 'pink', 'white', 'gold', 'silver',
    'bronze', 'brown', 'black', 'gray', 'turquoise'
  ];
  
  const foundColors = [];
  
  colorPatterns.forEach(color => {
    if (new RegExp(`\\b${color}\\b`, 'i').test(text)) {
      foundColors.push(color);
    }
  });
  
  return foundColors.length > 0 ? foundColors : ['blue', 'purple']; // Default fallback
};

/**
 * Provides a mock GPT response in case of API issues
 * @returns {Object} - Mock response with all required sections
 */
const getMockResponse = () => {
  return {
    auraColors: "Your dominant aura colors are indigo blue and emerald green. The indigo blue represents your heightened intuition and deep inner wisdom. You have a natural ability to connect with your higher self and perceive truths beyond what is immediately visible. The emerald green indicates a strong heart center and healing energy. You naturally provide balance and harmony to environments and people around you.",
    
    personality: "You demonstrate a thoughtful and introspective personality. Your responses show someone who values quality rest and physical wellbeing, suggesting you understand the importance of self-care. You have a rich inner life with vivid mental imagery and sensitivity to sensory experiences, particularly sound and music. Your approach to social interaction is balanced – you appreciate connection but also recognize the importance of personal space and energy management.",
    
    spiritualProfile: "Your spiritual strengths lie in your intuition and ability to process experiences through multiple channels – both visual and auditory. You're naturally introspective, which provides you with deep insights about yourself and others. Your main spiritual challenge involves finding consistency in your practices and creating routines that support your spiritual growth without feeling restrictive. There's also a tendency to absorb others' energies, which can sometimes cloud your connection to your own spiritual truth.",
    
    energyBoosters: "1. Spending time in nature - particularly environments with water or lush greenery\n2. Creative expression through visual arts or music\n3. Meaningful one-on-one conversations with trusted friends\n4. Regular physical movement that connects you to your body\n5. Moments of solitude for reflection and processing experiences",
    
    energyDrains: "1. Crowded, noisy environments with chaotic energy\n2. Irregular sleep patterns that disrupt your natural rhythm\n3. Extended periods of screen time or digital consumption\n4. Interactions with people who frequently complain or focus on negativity\n5. Rushing through activities without allowing time for mental and emotional processing",
    
    alignment: "To stay aligned with your true essence, establish a consistent morning and evening routine that honors your energy patterns. Create boundaries around your time and energy, particularly with people who tend to drain you. Make deliberate choices about the environments you spend time in, prioritizing spaces that feel harmonious and peaceful. Schedule regular time for both creative expression and quiet reflection. Listen to your body's signals about hunger, rest, and movement, and respond with compassionate attention. Finally, connect with others who share your values and spiritual interests, but maintain your unique path rather than conforming to others' expectations.",
    
    dailyPractice: "Begin each day with a 5-minute visualization practice. Sit comfortably with your eyes closed and imagine your body surrounded by a protective bubble of indigo blue and emerald green light. Breathe deeply into this space, allowing the colors to become more vibrant with each breath. Set an intention for how you wish to engage with the world that day. Throughout the day, take brief moments (even 30 seconds) to reconnect with this colored energy field, particularly before entering new environments or beginning new tasks. In the evening, spend a few minutes journaling about moments when you felt most connected and energized, as well as moments when you felt drained or disconnected. Over time, this practice will strengthen your awareness of your energy patterns and help you make choices that support your authentic spiritual alignment."
  };
};

export default {
  generateGPTResponse
};