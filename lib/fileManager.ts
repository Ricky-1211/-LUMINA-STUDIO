/**
 * File Manager Utility
 * Handles file operations, language detection, and file metadata
 */

export interface FileMetadata {
  name: string;
  extension: string;
  language: string;
  icon: string;
}

const languageMap: Record<string, string> = {
  // Web
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  html: 'html',
  htm: 'html',
  css: 'css',
  scss: 'scss',
  sass: 'sass',
  less: 'less',
  json: 'json',
  xml: 'xml',
  yaml: 'yaml',
  yml: 'yaml',

  // Python
  py: 'python',
  pyw: 'python',
  pyx: 'python',

  // Java
  java: 'java',
  class: 'java',
  jar: 'java',

  // C/C++
  c: 'c',
  cpp: 'cpp',
  cc: 'cpp',
  cxx: 'cpp',
  h: 'cpp',
  hpp: 'cpp',

  // C#
  cs: 'csharp',
  csproj: 'xml',

  // Ruby
  rb: 'ruby',
  erb: 'erb',
  gemfile: 'ruby',

  // PHP
  php: 'php',
  php3: 'php',
  php4: 'php',
  php5: 'php',

  // Go
  go: 'go',

  // Rust
  rs: 'rust',

  // Shell
  sh: 'shell',
  bash: 'shell',
  zsh: 'shell',
  fish: 'shell',

  // SQL
  sql: 'sql',
  db: 'sql',

  // Markdown
  md: 'markdown',
  markdown: 'markdown',
  mdown: 'markdown',
  mkdn: 'markdown',
  mkd: 'markdown',
  mdwn: 'markdown',
  mdtxt: 'markdown',
  mdtext: 'markdown',

  // Docker
  dockerfile: 'dockerfile',

  // Git
  gitignore: 'plaintext',
  gitattributes: 'plaintext',

  // Config
  env: 'plaintext',
  config: 'plaintext',
  conf: 'plaintext',
  cfg: 'plaintext',
  ini: 'ini',
  toml: 'toml',

  // Plaintext
  txt: 'plaintext',
};

export function detectLanguage(filename: string): string {
  const parts = filename.toLowerCase().split('.');
  
  // Handle special cases
  if (filename.toLowerCase() === 'dockerfile') return 'dockerfile';
  if (filename.toLowerCase() === '.gitignore') return 'plaintext';
  if (filename.toLowerCase() === '.env') return 'plaintext';
  if (filename.toLowerCase() === 'makefile') return 'makefile';

  // Get extension
  const extension = parts.length > 1 ? parts[parts.length - 1] : '';
  
  return languageMap[extension] || 'plaintext';
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
}

export function getFileMetadata(filename: string): FileMetadata {
  const extension = getFileExtension(filename);
  const language = detectLanguage(filename);

  return {
    name: filename,
    extension,
    language,
    icon: getFileIcon(language),
  };
}

export function getFileIcon(language: string): string {
  const iconMap: Record<string, string> = {
    javascript: '📄',
    typescript: '📘',
    python: '🐍',
    java: '☕',
    cpp: '⚙️',
    csharp: '🟦',
    ruby: '💎',
    php: '🐘',
    go: '🐹',
    rust: '🦀',
    html: '🌐',
    css: '🎨',
    json: '📋',
    markdown: '📝',
    dockerfile: '🐳',
    shell: '💻',
    sql: '🗄️',
    plaintext: '📄',
  };

  return iconMap[language] || '📄';
}

export function generateFileId(): string {
  return `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function createNewFile(
  name: string,
  content: string = '',
  path: string = '/'
) {
  const id = generateFileId();
  const language = detectLanguage(name);

  return {
    id,
    name,
    path: path.endsWith('/') ? path + name : path + '/' + name,
    content,
    language,
    isDirty: false,
    isOpen: true,
    lastModified: Date.now(),
    encoding: 'utf-8',
    lineEnding: 'LF' as const,
    indentSize: 2,
    indentUsingSpaces: true,
    trimWhitespace: true,
  };
}

export function validateFilename(filename: string): boolean {
  // Check for invalid characters
  const invalidChars = /[<>:"|?*\x00-\x1f]/g;
  if (invalidChars.test(filename)) return false;

  // Check for reserved names (Windows)
  const reserved = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
  if (reserved.test(filename.split('.')[0])) return false;

  // Check length
  if (filename.length === 0 || filename.length > 255) return false;

  return true;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function getLineCount(content: string): number {
  return content.split('\n').length;
}

export function getCharacterCount(content: string): number {
  return content.length;
}

export function getWordCount(content: string): number {
  return content.trim().split(/\s+/).length;
}
