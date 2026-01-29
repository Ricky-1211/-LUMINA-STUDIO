// services/geminiService.tsx
import { GoogleGenAI } from "@google/genai";

// Types for the service
export interface CodeExplanation {
  explanation: string;
  examples: string[];
  complexity: 'simple' | 'medium' | 'complex';
  bestPractices: string[];
  warnings: string[];
}

export interface RefactoringResult {
  originalCode: string;
  refactoredCode: string;
  changes: CodeChange[];
  improvements: string[];
  complexityReduction: number;
  performanceGain?: string;
}

export interface CodeChange {
  type: 'optimization' | 'refactoring' | 'bugfix' | 'style';
  description: string;
  line: number;
  impact: 'low' | 'medium' | 'high';
}

export interface GeneratedCode {
  code: string;
  language: string;
  explanation: string;
  imports: string[];
  dependencies: string[];
  testCode?: string;
  usageExample: string;
}

export interface CodeAnalysis {
  qualityScore: number;
  issues: CodeIssue[];
  suggestions: string[];
  complexity: number;
  maintainability: number;
  securityIssues?: SecurityIssue[];
}

export interface CodeIssue {
  type: 'error' | 'warning' | 'info' | 'critical';
  message: string;
  line: number;
  column: number;
  suggestion: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface SecurityIssue {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  remediation: string;
  cweId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  codeSnippets?: string[];
  language?: string;
}

export interface AIConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemInstruction: string;
}

// Initialize Gemini AI client
const getAIClient = () => {
  const apiKey = process.env.API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('API key is required. Set process.env.API_KEY or VITE_GEMINI_API_KEY');
  }
  return new GoogleGenAI({ apiKey });
};

// Default configurations for different AI tasks
const AI_CONFIGS = {
  EXPLANATION: {
    model: 'gemini-3-flash-preview',
    temperature: 0.7,
    maxTokens: 1024,
    systemInstruction: "You are a senior software engineer assistant specializing in code explanation. Provide clear, concise explanations with practical examples."
  },
  REFACTORING: {
    model: 'gemini-3-pro-preview',
    temperature: 0.3,
    maxTokens: 2048,
    systemInstruction: "You are an expert code refactoring assistant. Focus on performance, readability, and best practices. Provide detailed explanations of changes."
  },
  GENERATION: {
    model: 'gemini-3-pro-preview',
    temperature: 0.8,
    maxTokens: 4096,
    systemInstruction: "You are a creative code generation assistant. Generate clean, efficient, and well-documented code following industry best practices."
  },
  CHAT: {
    model: 'gemini-3-pro-preview',
    temperature: 0.5,
    maxTokens: 2048,
    systemInstruction: "You are a helpful coding assistant integrated into a web-based IDE. Provide accurate, practical advice for coding problems."
  },
  ANALYSIS: {
    model: 'gemini-3-pro-preview',
    temperature: 0.2,
    maxTokens: 2048,
    systemInstruction: "You are a code quality analyst. Identify issues, suggest improvements, and assess code quality objectively."
  }
};

/**
 * Explain code with detailed analysis
 */
export const explainCode = async (
  code: string, 
  language: string,
  options?: {
    includeComplexity?: boolean;
    includeBestPractices?: boolean;
    targetAudience?: 'beginner' | 'intermediate' | 'expert';
  }
): Promise<CodeExplanation> => {
  const ai = getAIClient();
  const config = AI_CONFIGS.EXPLANATION;
  
  const prompt = `Explain the following ${language} code in detail:
  
\`\`\`${language}
${code}
\`\`\`

Target audience: ${options?.targetAudience || 'intermediate'}
Please include:
1. Code purpose and functionality
2. Key algorithms or patterns used
3. Complexity analysis if requested
4. Best practices followed or suggested
5. Any potential issues or warnings`;

  try {
    const response = await ai.models.generateContent({
      model: config.model,
      contents: prompt,
      config: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
        systemInstruction: config.systemInstruction
      }
    });

    const explanation = response.text || "I couldn't generate an explanation.";
    
    return {
      explanation,
      examples: extractCodeExamples(explanation),
      complexity: analyzeComplexity(code, language),
      bestPractices: extractBestPractices(explanation),
      warnings: extractWarnings(explanation)
    };
  } catch (error) {
    console.error("AI Error in explainCode:", error);
    return {
      explanation: "Failed to generate explanation. Please try again.",
      examples: [],
      complexity: 'medium',
      bestPractices: [],
      warnings: []
    };
  }
};

/**
 * Refactor code with multiple optimization strategies
 */
export const refactorCode = async (
  code: string, 
  language: string,
  refactoringType?: 'optimization' | 'readability' | 'performance' | 'all'
): Promise<RefactoringResult> => {
  const ai = getAIClient();
  const config = AI_CONFIGS.REFACTORING;
  
  const refactoringGoal = refactoringType 
    ? getRefactoringGoal(refactoringType)
    : 'Improve overall code quality, maintainability, and performance';

  const prompt = `Refactor the following ${language} code:
  
\`\`\`${language}
${code}
\`\`\`

Goal: ${refactoringGoal}

Please provide:
1. Refactored code with improvements
2. List of specific changes made
3. Explanation of improvements
4. Estimated performance/complexity impact`;

  try {
    const response = await ai.models.generateContent({
      model: config.model,
      contents: prompt,
      config: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
        systemInstruction: config.systemInstruction
      }
    });

    const result = response.text || "";
    const refactoredCode = extractCodeBlock(result, language) || code;
    
    return {
      originalCode: code,
      refactoredCode,
      changes: analyzeCodeChanges(code, refactoredCode),
      improvements: extractImprovements(result),
      complexityReduction: calculateComplexityReduction(code, refactoredCode),
      performanceGain: estimatePerformanceGain(result)
    };
  } catch (error) {
    console.error("AI Error in refactorCode:", error);
    return {
      originalCode: code,
      refactoredCode: code,
      changes: [],
      improvements: ['Refactoring failed. Using original code.'],
      complexityReduction: 0
    };
  }
};

/**
 * Generate code from natural language prompt
 */
export const generateCodeFromPrompt = async (
  prompt: string,
  language: string,
  context?: {
    existingCode?: string;
    requirements?: string[];
    libraries?: string[];
  }
): Promise<GeneratedCode> => {
  const ai = getAIClient();
  const config = AI_CONFIGS.GENERATION;
  
  const fullPrompt = `Generate ${language} code based on this requirement:
  
${prompt}

${context?.existingCode ? `Existing code context:\n\`\`\`${language}\n${context.existingCode}\n\`\`\`` : ''}
${context?.requirements ? `Additional requirements:\n- ${context.requirements.join('\n- ')}` : ''}
${context?.libraries ? `Preferred libraries:\n- ${context.libraries.join('\n- ')}` : ''}

Please provide:
1. Complete, runnable code
2. Explanation of the solution
3. Required imports/dependencies
4. Usage example
5. Optional: Test code`;

  try {
    const response = await ai.models.generateContent({
      model: config.model,
      contents: fullPrompt,
      config: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
        systemInstruction: config.systemInstruction
      }
    });

    const result = response.text || "";
    const generatedCode = extractCodeBlock(result, language) || "";
    
    return {
      code: generatedCode,
      language,
      explanation: extractExplanation(result),
      imports: extractImports(generatedCode, language),
      dependencies: extractDependencies(result),
      testCode: extractTestCode(result),
      usageExample: extractUsageExample(result)
    };
  } catch (error) {
    console.error("AI Error in generateCodeFromPrompt:", error);
    return {
      code: '',
      language,
      explanation: 'Failed to generate code. Please try again.',
      imports: [],
      dependencies: [],
      usageExample: ''
    };
  }
};

/**
 * Chat with Gemini for code-related discussions
 */
export const chatWithGemini = async (
  messages: ChatMessage[],
  context?: {
    currentFile?: string;
    language?: string;
    projectType?: string;
  }
): Promise<{ response: string; suggestions?: string[] }> => {
  const ai = getAIClient();
  const config = AI_CONFIGS.CHAT;

  // Format history for Gemini
  const history = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content + (msg.codeSnippets ? `\n\nCode:\n${msg.codeSnippets.join('\n')}` : '') }]
  }));

  const contextInfo = context ? `
Context:
- Language: ${context.language || 'Not specified'}
- Project Type: ${context.projectType || 'Not specified'}
${context.currentFile ? `- Current File: ${context.currentFile}` : ''}
` : '';

  try {
    const chat = ai.chats.create({
      model: config.model,
      config: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
        systemInstruction: config.systemInstruction + contextInfo
      }
    });

    const lastMessage = history[history.length - 1];
    const response = await chat.sendMessage({ 
      message: lastMessage.parts[0].text 
    });

    const responseText = response.text || "I couldn't process your request.";
    
    return {
      response: responseText,
      suggestions: extractCodeSuggestions(responseText)
    };
  } catch (error) {
    console.error("AI Chat Error:", error);
    return {
      response: "Error communicating with Gemini. Please check your connection and API key.",
      suggestions: []
    };
  }
};

/**
 * Analyze code for quality, issues, and improvements
 */
export const analyzeCode = async (
  code: string,
  language: string
): Promise<CodeAnalysis> => {
  const ai = getAIClient();
  const config = AI_CONFIGS.ANALYSIS;

  const prompt = `Analyze the following ${language} code for quality, issues, and improvements:

\`\`\`${language}
${code}
\`\`\`

Please provide:
1. Quality score (0-100)
2. List of issues with severity
3. Improvement suggestions
4. Complexity assessment
5. Maintainability score
6. Security issues if any`;

  try {
    const response = await ai.models.generateContent({
      model: config.model,
      contents: prompt,
      config: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
        systemInstruction: config.systemInstruction
      }
    });

    const result = response.text || "";
    
    return {
      qualityScore: extractQualityScore(result),
      issues: extractIssues(result, code),
      suggestions: extractSuggestions(result),
      complexity: analyzeComplexityValue(code),
      maintainability: calculateMaintainability(code),
      securityIssues: extractSecurityIssues(result)
    };
  } catch (error) {
    console.error("AI Error in analyzeCode:", error);
    return {
      qualityScore: 50,
      issues: [],
      suggestions: ['Analysis failed. Please try again.'],
      complexity: 5,
      maintainability: 5
    };
  }
};

// Helper functions
const extractCodeBlock = (text: string, language: string): string => {
  const regex = new RegExp(`\`\`\`${language}?\\n([\\s\\S]*?)\`\`\``, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : text;
};

const extractCodeExamples = (text: string): string[] => {
  const codeRegex = /```[\w]*\n([\s\S]*?)```/g;
  const matches = text.match(codeRegex) || [];
  return matches.map(match => match.replace(/```[\w]*\n/, '').replace(/```/, '').trim());
};

const extractBestPractices = (text: string): string[] => {
  const practiceRegex = /(?:Best practices?|Recommendations?):?\s*\n([\s\S]*?)(?:\n\n|\n[A-Z]|$)/i;
  const match = text.match(practiceRegex);
  if (match) {
    return match[1].split('\n').map(line => line.replace(/^[-•*]\s*/, '').trim()).filter(Boolean);
  }
  return [];
};

const extractWarnings = (text: string): string[] => {
  const warningRegex = /(?:Warning|Caution|Issue)s?:?\s*\n([\s\S]*?)(?:\n\n|\n[A-Z]|$)/i;
  const match = text.match(warningRegex);
  if (match) {
    return match[1].split('\n').map(line => line.replace(/^[-•*]\s*/, '').trim()).filter(Boolean);
  }
  return [];
};

const analyzeComplexity = (code: string, language: string): 'simple' | 'medium' | 'complex' => {
  const lines = code.split('\n').length;
  if (lines < 20) return 'simple';
  if (lines < 100) return 'medium';
  return 'complex';
};

const getRefactoringGoal = (type: string): string => {
  const goals = {
    optimization: 'Optimize for performance and efficiency',
    readability: 'Improve code readability and maintainability',
    performance: 'Enhance execution speed and resource usage',
    all: 'Improve all aspects: performance, readability, maintainability, and best practices'
  };
  return goals[type as keyof typeof goals] || goals.all;
};

const analyzeCodeChanges = (original: string, refactored: string): CodeChange[] => {
  const changes: CodeChange[] = [];
  const originalLines = original.split('\n');
  const refactoredLines = refactored.split('\n');
  
  // Simple diff analysis (for demo - in production use a proper diff library)
  if (refactoredLines.length < originalLines.length) {
    changes.push({
      type: 'optimization',
      description: 'Reduced code lines',
      line: 0,
      impact: 'medium'
    });
  }
  
  if (refactored.includes('async') && !original.includes('async')) {
    changes.push({
      type: 'optimization',
      description: 'Added async/await pattern',
      line: 0,
      impact: 'high'
    });
  }
  
  return changes;
};

const extractImprovements = (text: string): string[] => {
  const improvementRegex = /(?:Improvements?|Changes):?\s*\n([\s\S]*?)(?:\n\n|\n[A-Z]|$)/i;
  const match = text.match(improvementRegex);
  if (match) {
    return match[1].split('\n').map(line => line.replace(/^[-•*]\s*/, '').trim()).filter(Boolean);
  }
  return ['Code has been improved for better quality'];
};

const calculateComplexityReduction = (original: string, refactored: string): number => {
  const originalLines = original.split('\n').length;
  const refactoredLines = refactored.split('\n').length;
  return Math.round(((originalLines - refactoredLines) / originalLines) * 100);
};

const estimatePerformanceGain = (text: string): string => {
  const performanceRegex = /performance.*?(improved|increased|better).*?(\d+)%/i;
  const match = text.match(performanceRegex);
  return match ? `${match[2]}% performance improvement` : 'Performance optimized';
};

const extractImports = (code: string, language: string): string[] => {
  const importRegex = /import\s+.*?\s+from\s+['"].*?['"]/g;
  const matches = code.match(importRegex) || [];
  return matches;
};

const extractDependencies = (text: string): string[] => {
  const depRegex = /(?:dependencies|packages|libraries):?\s*\n([\s\S]*?)(?:\n\n|\n[A-Z]|$)/i;
  const match = text.match(depRegex);
  if (match) {
    return match[1].split('\n').map(line => line.replace(/^[-•*]\s*/, '').trim()).filter(Boolean);
  }
  return [];
};

const extractTestCode = (text: string): string | undefined => {
  const testRegex = /```(?:javascript|typescript|python)?\n([\s\S]*?test[\s\S]*?)```/i;
  const match = text.match(testRegex);
  return match ? match[1].trim() : undefined;
};

const extractUsageExample = (text: string): string => {
  const exampleRegex = /(?:Usage|Example):?\s*\n```[\w]*\n([\s\S]*?)```/i;
  const match = text.match(exampleRegex);
  return match ? match[1].trim() : '// Usage example not provided';
};

const extractExplanation = (text: string): string => {
  const explanationRegex = /(?:Explanation|Description):?\s*\n([\s\S]*?)(?:\n\n|\n```|\n[A-Z]|$)/i;
  const match = text.match(explanationRegex);
  return match ? match[1].trim() : 'No explanation provided';
};

const extractCodeSuggestions = (text: string): string[] => {
  const suggestionRegex = /(?:Suggestion|Recommendation|Tip):?\s*["']?([^"\n]+)["']?/gi;
  const matches = text.match(suggestionRegex) || [];
  return matches.map(m => m.replace(/^(?:Suggestion|Recommendation|Tip):?\s*/i, '').trim());
};

const extractQualityScore = (text: string): number => {
  const scoreRegex = /quality.*?score.*?(\d+)/i;
  const match = text.match(scoreRegex);
  return match ? parseInt(match[1], 10) : 75;
};

const extractIssues = (text: string, code: string): CodeIssue[] => {
  const issues: CodeIssue[] = [];
  const issueRegex = /Line\s+(\d+):\s*(.*?)(?=\nLine|\n\n|$)/gi;
  let match;
  
  while ((match = issueRegex.exec(text)) !== null) {
    const line = parseInt(match[1], 10);
    const message = match[2].trim();
    
    issues.push({
      type: message.toLowerCase().includes('error') ? 'error' : 
            message.toLowerCase().includes('warning') ? 'warning' : 'info',
      message,
      line,
      column: 1,
      suggestion: getSuggestionForIssue(message),
      severity: message.toLowerCase().includes('critical') ? 'critical' : 
               message.toLowerCase().includes('major') ? 'high' : 'medium'
    });
  }
  
  return issues;
};

const getSuggestionForIssue = (issue: string): string => {
  if (issue.toLowerCase().includes('security')) {
    return 'Review security best practices and validate inputs';
  }
  if (issue.toLowerCase().includes('performance')) {
    return 'Consider optimizing algorithm or reducing complexity';
  }
  if (issue.toLowerCase().includes('readability')) {
    return 'Add comments and improve variable naming';
  }
  return 'Review and refactor as needed';
};

const extractSuggestions = (text: string): string[] => {
  const suggestionRegex = /(?:Suggest|Recommend|Improve):\s*(.*?)(?=\n|$)/gi;
  const matches = text.match(suggestionRegex) || [];
  return matches.map(m => m.replace(/^(?:Suggest|Recommend|Improve):\s*/i, '').trim());
};

const analyzeComplexityValue = (code: string): number => {
  const lines = code.split('\n').length;
  if (lines < 50) return 3;
  if (lines < 200) return 6;
  return 9;
};

const calculateMaintainability = (code: string): number => {
  // Simple heuristic - in production use proper metrics
  const lines = code.split('\n').length;
  const comments = (code.match(/\/\/|\/\*|\*/g) || []).length;
  const commentRatio = comments / lines;
  
  if (commentRatio > 0.3) return 9;
  if (commentRatio > 0.1) return 7;
  return 5;
};

const extractSecurityIssues = (text: string): SecurityIssue[] => {
  const securityRegex = /Security\s+Issue[:\s]+(.*?)(?=\n\n|\n[A-Z]|$)/gi;
  const matches = text.match(securityRegex) || [];
  
  return matches.map(match => ({
    type: 'Security',
    description: match.replace(/Security\s+Issue[:\s]+/i, '').trim(),
    severity: 'high',
    remediation: 'Follow security best practices and conduct security review'
  }));
};

// Export all functions
export default {
  explainCode,
  refactorCode,
  generateCodeFromPrompt,
  chatWithGemini,
  analyzeCode,
  AI_CONFIGS
};