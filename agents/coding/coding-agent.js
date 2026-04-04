const { Ollama } = require('ollama');
const fs = require('fs-extra');
const chokidar = require('chokidar');
const path = require('path');

class CodingAgent {
  constructor() {
    this.ollama = new Ollama({ host: 'http://127.0.0.1:11434' });
    this.model = 'llama3'; // Default model
    this.workspace = path.join(__dirname, '..', '..', 'workspace');
    this.agentName = 'Coding Agent';
    this.status = 'idle';
    this.currentTask = 'Waiting for coding tasks';
  }

  async initialize() {
    console.log(`🤖 ${this.agentName} initializing...`);
    try {
      // Check if Ollama is running by listing models
      await this.ollama.list();
      console.log('✅ Ollama connection established');
      this.status = 'ready';
      this.currentTask = 'Ready for coding tasks';
    } catch (error) {
      console.error('❌ Ollama not available:', error.message);
      this.status = 'error';
      this.currentTask = 'Ollama unavailable';
    }
  }

  async generateCode(prompt, language = 'javascript') {
    this.status = 'busy';
    this.currentTask = `Generating ${language} code`;
    
    try {
      console.log(`💻 Generating ${language} code...`);
      
      const fullPrompt = `
You are an expert ${language} developer. Generate clean, efficient, well-documented code based on the following request:

${prompt}

Requirements:
1. Use modern best practices
2. Include clear comments
3. Handle errors appropriately
4. Follow language conventions
5. Be concise but complete

Return only the code without any additional explanation.
`;

      const response = await this.ollama.generate({
        model: this.model,
        prompt: fullPrompt,
        stream: false
      });

      this.status = 'idle';
      this.currentTask = 'Waiting for coding tasks';
      
      return response.response;
    } catch (error) {
      this.status = 'error';
      this.currentTask = 'Code generation failed';
      console.error('Error generating code:', error.message);
      throw error;
    }
  }

  async reviewCode(code, language = 'javascript') {
    this.status = 'busy';
    this.currentTask = `Reviewing ${language} code`;
    
    try {
      console.log(`🔎 Reviewing ${language} code...`);
      
      const fullPrompt = `
Review the following ${language} code and provide feedback:

${code}

Please analyze:
1. Code quality and best practices
2. Potential bugs or issues
3. Performance considerations
4. Security concerns
5. Suggestions for improvement

Be concise and focus on actionable feedback.
`;

      const response = await this.ollama.generate({
        model: this.model,
        prompt: fullPrompt,
        stream: false
      });

      this.status = 'idle';
      this.currentTask = 'Waiting for coding tasks';
      
      return response.response;
    } catch (error) {
      this.status = 'error';
      this.currentTask = 'Code review failed';
      console.error('Error reviewing code:', error.message);
      throw error;
    }
  }

  async refactorCode(code, refactorInstructions, language = 'javascript') {
    this.status = 'busy';
    this.currentTask = `Refactoring ${language} code`;
    
    try {
      console.log(`🔨 Refactoring ${language} code...`);
      
      const fullPrompt = `
Refactor the following ${language} code according to these instructions:

Code:
${code}

Refactor Instructions:
${refactorInstructions}

Requirements:
1. Maintain the same functionality
2. Improve code quality
3. Follow best practices
4. Add comments explaining changes
5. Return only the refactored code
`;

      const response = await this.ollama.generate({
        model: this.model,
        prompt: fullPrompt,
        stream: false
      });

      this.status = 'idle';
      this.currentTask = 'Waiting for coding tasks';
      
      return response.response;
    } catch (error) {
      this.status = 'error';
      this.currentTask = 'Code refactoring failed';
      console.error('Error refactoring code:', error.message);
      throw error;
    }
  }

  async explainCode(code, language = 'javascript') {
    this.status = 'busy';
    this.currentTask = `Explaining ${language} code`;
    
    try {
      console.log(`📘 Explaining ${language} code...`);
      
      const fullPrompt = `
Explain the following ${language} code in simple terms:

${code}

Please provide:
1. What the code does overall
2. Key functions and their purposes
3. Important variables and data structures
4. Flow of execution
5. Any complex logic explained simply

Write for a beginner-to-intermediate developer.
`;

      const response = await this.ollama.generate({
        model: this.model,
        prompt: fullPrompt,
        stream: false
      });

      this.status = 'idle';
      this.currentTask = 'Waiting for coding tasks';
      
      return response.response;
    } catch (error) {
      this.status = 'error';
      this.currentTask = 'Code explanation failed';
      console.error('Error explaining code:', error.message);
      throw error;
    }
  }

  async writeFile(filepath, content) {
    try {
      const fullPath = path.join(this.workspace, filepath);
      await fs.outputFile(fullPath, content);
      console.log(`💾 File written: ${fullPath}`);
      return fullPath;
    } catch (error) {
      console.error('Error writing file:', error.message);
      throw error;
    }
  }

  async readFile(filepath) {
    try {
      const fullPath = path.join(this.workspace, filepath);
      const content = await fs.readFile(fullPath, 'utf8');
      return content;
    } catch (error) {
      console.error('Error reading file:', error.message);
      throw error;
    }
  }

  getStatus() {
    return {
      agent: this.agentName,
      status: this.status,
      currentTask: this.currentTask,
      model: this.model,
      workspace: this.workspace
    };
  }

  watchWorkspace(callback) {
    const watcher = chokidar.watch(this.workspace, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true
    });

    watcher
      .on('change', (path) => {
        console.log(`📁 File changed: ${path}`);
        if (callback) callback('change', path);
      })
      .on('add', (path) => {
        console.log(`📁 File added: ${path}`);
        if (callback) callback('add', path);
      })
      .on('unlink', (path) => {
        console.log(`📁 File removed: ${path}`);
        if (callback) callback('remove', path);
      });

    return watcher;
  }
}

module.exports = CodingAgent;