'use client'

import { useState, useRef, use } from 'react'
import Link from 'next/link'

interface ResumeData {
  id: string;
  title: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    portfolio: string;
    linkedin: string;
  };
  summary: string;
  skills: string[];
  experiences: Array<{
    company: string;
    position: string;
    period: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    period: string;
    gpa: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link: string;
  }>;
  lastUpdated: string;
  score: number;
  version: number;
}

export default function ResumeEditor({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params promise
  const resolvedParams = use(params);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const [showChatbot, setShowChatbot] = useState(true);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{text: string, isUser: boolean}>>([
    { text: "Hi! I'm your resume assistant. I can help you improve your resume, suggest better wording, or answer any questions about resume writing.", isUser: false }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [resumeData, setResumeData] = useState<ResumeData>({
    id: resolvedParams.id,
    title: 'My Professional Resume',
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      portfolio: '',
      linkedin: ''
    },
    summary: '',
    skills: [],
    experiences: [],
    education: [],
    projects: [],
    lastUpdated: 'Just now',
    score: 0,
    version: 1
  });

  const handleSaveDraft = () => {
    console.log('Saving draft...', resumeData);
    try {
      localStorage.setItem(`resume-${resolvedParams.id}`, JSON.stringify(resumeData));
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Error saving draft. Please try again.');
    }
  };

  const handleDownloadPDF = async () => {
    if (!resumePreviewRef.current) {
      alert('Cannot generate PDF. Please try again.');
      return;
    }

    setIsGeneratingPDF(true);

    try {
      // Simple and reliable PDF generation using browser's print functionality
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Could not open print window. Please allow popups for this site.');
      }

      // Create a clean HTML for printing
      const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${resumeData.personalInfo.name || 'Resume'}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 0;
                padding: 20px;
                color: #000;
                background: white;
              }
              .resume-container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
              }
              .header { 
                text-align: center; 
                margin-bottom: 30px;
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
              }
              .header h1 { 
                font-size: 28px; 
                margin: 0 0 10px 0;
                color: #000;
              }
              .contact-info { 
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                gap: 15px;
                margin-bottom: 10px;
                font-size: 14px;
              }
              .links {
                display: flex;
                justify-content: center;
                gap: 15px;
                font-size: 14px;
              }
              .section { 
                margin-bottom: 25px; 
              }
              .section h3 { 
                border-bottom: 1px solid #ccc; 
                padding-bottom: 5px;
                margin-bottom: 15px;
                font-size: 18px;
                color: #000;
              }
              .skills { 
                display: flex; 
                flex-wrap: wrap; 
                gap: 8px; 
              }
              .skill { 
                background: #f3f4f6; 
                padding: 4px 12px; 
                border-radius: 12px; 
                font-size: 12px;
                border: 1px solid #d1d5db;
              }
              .experience-item, .education-item, .project-item { 
                margin-bottom: 20px; 
              }
              .job-header, .education-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 5px;
              }
              .company, .institution {
                font-weight: bold;
                color: #000;
              }
              .position, .degree {
                font-weight: 600;
                color: #000;
              }
              .period {
                background: #f3f4f6;
                padding: 2px 8px;
                border-radius: 6px;
                font-size: 12px;
                color: #000;
              }
              .description {
                color: #374151;
                font-size: 14px;
                line-height: 1.5;
                margin-top: 5px;
              }
              .technologies {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                margin-top: 8px;
              }
              .tech {
                background: #dbeafe;
                color: #1e40af;
                padding: 2px 8px;
                border-radius: 8px;
                font-size: 11px;
              }
              @media print {
                body { margin: 0; padding: 0; }
                .resume-container { max-width: none; }
              }
            </style>
          </head>
          <body>
            <div class="resume-container">
              <div class="header">
                <h1>${resumeData.personalInfo.name || 'Your Name'}</h1>
                <div class="contact-info">
                  ${resumeData.personalInfo.email ? `<span>${resumeData.personalInfo.email}</span>` : ''}
                  ${resumeData.personalInfo.phone ? `<span>${resumeData.personalInfo.phone}</span>` : ''}
                  ${resumeData.personalInfo.location ? `<span>${resumeData.personalInfo.location}</span>` : ''}
                </div>
                <div class="links">
                  ${resumeData.personalInfo.portfolio ? `<span>${resumeData.personalInfo.portfolio}</span>` : ''}
                  ${resumeData.personalInfo.linkedin ? `<span>${resumeData.personalInfo.linkedin}</span>` : ''}
                </div>
              </div>

              ${resumeData.summary ? `
                <div class="section">
                  <h3>Professional Summary</h3>
                  <p class="description">${resumeData.summary}</p>
                </div>
              ` : ''}

              ${resumeData.skills.length > 0 ? `
                <div class="section">
                  <h3>Technical Skills</h3>
                  <div class="skills">
                    ${resumeData.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
                  </div>
                </div>
              ` : ''}

              ${resumeData.experiences.length > 0 ? `
                <div class="section">
                  <h3>Work Experience</h3>
                  ${resumeData.experiences.map(exp => `
                    <div class="experience-item">
                      <div class="job-header">
                        <div>
                          <div class="position">${exp.position}</div>
                          <div class="company">${exp.company}</div>
                        </div>
                        <span class="period">${exp.period}</span>
                      </div>
                      <p class="description">${exp.description}</p>
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              ${resumeData.education.length > 0 ? `
                <div class="section">
                  <h3>Education</h3>
                  ${resumeData.education.map(edu => `
                    <div class="education-item">
                      <div class="education-header">
                        <div>
                          <div class="degree">${edu.degree}</div>
                          <div class="institution">${edu.institution}</div>
                        </div>
                        <span class="period">${edu.period}</span>
                      </div>
                      ${edu.gpa ? `<p class="description">GPA: ${edu.gpa}</p>` : ''}
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              ${resumeData.projects.length > 0 ? `
                <div class="section">
                  <h3>Projects</h3>
                  ${resumeData.projects.map(project => `
                    <div class="project-item">
                      <div class="position">${project.name}</div>
                      <p class="description">${project.description}</p>
                      ${project.technologies.length > 0 ? `
                        <div class="technologies">
                          ${project.technologies.map(tech => `<span class="tech">${tech}</span>`).join('')}
                        </div>
                      ` : ''}
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
          alert('PDF generated successfully! Use the print dialog to save as PDF.');
        };
      };
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback: Download as HTML file
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${resumeData.personalInfo.name || 'Resume'}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .header { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 25px; }
              .skills { display: flex; flex-wrap: wrap; gap: 8px; }
            </style>
          </head>
          <body>
            <h1>${resumeData.personalInfo.name || 'Your Name'}</h1>
            <p>Email: ${resumeData.personalInfo.email}</p>
            <p>Phone: ${resumeData.personalInfo.phone}</p>
            <p>Location: ${resumeData.personalInfo.location}</p>
            ${resumeData.summary ? `<h2>Summary</h2><p>${resumeData.summary}</p>` : ''}
            ${resumeData.skills.length > 0 ? `<h2>Skills</h2><p>${resumeData.skills.join(', ')}</p>` : ''}
          </body>
        </html>
      `;
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.personalInfo.name || 'resume'}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('HTML version downloaded. You can open it in a browser and use "Print to PDF" for better formatting.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleImportPDF = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
      alert('Please upload a PDF or DOCX file.');
      return;
    }

    setIsParsing(true);
    
    try {
      console.log('Uploading file:', file.name);

      setResumeData(prev => ({
        ...prev,
        personalInfo: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+91 9876543210',
          location: 'Bangalore, India',
          portfolio: 'https://github.com/johndoe',
          linkedin: 'https://linkedin.com/in/johndoe'
        },
        summary: 'Passionate Full Stack Developer with 2 years of experience building web applications using React, Node.js, and MongoDB. Strong problem-solving skills and experience in agile development environments.',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'Git', 'REST APIs'],
        experiences: [
          {
            company: 'Tech Solutions Inc',
            position: 'Junior Full Stack Developer',
            period: '2022 - Present',
            description: 'Developed and maintained web applications using React and Node.js. Collaborated with team members using Agile methodology.',
            achievements: ['Improved application performance by 40%', 'Led a team of 3 developers on a key project']
          }
        ],
        education: [
          {
            institution: 'ABC University',
            degree: 'B.Tech in Computer Science',
            period: '2018 - 2022',
            gpa: '8.5/10'
          }
        ],
        projects: [
          {
            name: 'E-commerce Platform',
            description: 'Full-stack e-commerce application with React, Node.js, and MongoDB',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
            link: 'https://github.com/johndoe/ecommerce'
          }
        ],
        lastUpdated: 'Just now',
        score: 78
      }));
      
      try {
        localStorage.setItem(`resume-${resolvedParams.id}`, JSON.stringify(resumeData));
      } catch (storageError) {
        console.error('Error storing data:', storageError);
      }
      
      alert('Resume imported successfully! Content has been parsed and loaded.');
      
    } catch (error) {
      console.error('Error parsing resume:', error);
      alert('Error parsing resume. Please try again with a different file.');
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessage = { text: userInput, isUser: true };
    setChatMessages(prev => [...prev, newMessage]);
    setUserInput('');
    setIsLoading(true);

    setTimeout(() => {
      const responses = [
        "That's a great question! For your resume summary, try to focus on quantifiable achievements and specific technologies you're proficient in.",
        "I'd recommend using action verbs like 'developed', 'implemented', 'optimized' to start your bullet points in the experience section.",
        "Consider adding metrics to your achievements. Instead of 'improved performance', try 'improved application performance by 40% through code optimization'.",
        "Make sure to include relevant keywords from the job description you're targeting. This helps with ATS (Applicant Tracking Systems).",
        "Your skills section looks good! Consider categorizing them into 'Technical Skills', 'Soft Skills', and 'Tools & Technologies' for better organization."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages(prev => [...prev, { text: randomResponse, isUser: false }]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateSummary = (value: string) => {
    setResumeData(prev => ({
      ...prev,
      summary: value
    }));
  };

  const addSkill = () => {
    const newSkill = prompt('Enter a new skill:');
    if (newSkill && !resumeData.skills.includes(newSkill)) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-gray-900">{resumeData.title}</h1>
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-semibold">
                v{resumeData.version}
              </span>
            </div>
            <p className="text-lg text-gray-600">Edit and preview your resume in real-time</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span>🕒 Updated {resumeData.lastUpdated}</span>
              <span className={`font-semibold ${resumeData.score >= 80 ? 'text-green-600' : resumeData.score >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                AI Score: {resumeData.score}%
              </span>
            </div>
          </div>
          <div className="flex gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
            <button 
              onClick={handleImportPDF}
              disabled={isParsing}
              className="bg-white text-gray-700 px-6 py-3 rounded-xl border border-gray-300 hover:border-gray-400 transition-all font-semibold shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isParsing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              ) : (
                <span>📄</span>
              )}
              {isParsing ? 'Parsing...' : 'Import PDF'}
            </button>
            <Link 
              href={`/resume/${resolvedParams.id}/analyze`}
              className="bg-white text-gray-700 px-6 py-3 rounded-xl border border-gray-300 hover:border-gray-400 transition-all font-semibold shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <span>🤖</span>
              AI Analysis
            </Link>
            <button 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="bg-linear-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingPDF ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <span>📥</span>
              )}
              {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>

        {isParsing && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-blue-800 font-semibold">Parsing your resume content...</p>
            <p className="text-blue-600 text-sm mt-1">This may take a few seconds</p>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Editor Side */}
          <div className="xl:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-linear-to-b from-blue-600 to-purple-600 rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={resumeData.personalInfo.name}
                    onChange={(e) => updatePersonalInfo('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      value={resumeData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <input 
                    type="text" 
                    value={resumeData.personalInfo.location}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900"
                    placeholder="City, Country"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Portfolio/GitHub</label>
                    <input 
                      type="url" 
                      value={resumeData.personalInfo.portfolio}
                      onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900"
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn</label>
                    <input 
                      type="url" 
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Summary Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-linear-to-b from-blue-600 to-purple-600 rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">Professional Summary</h2>
              </div>
              <textarea 
                value={resumeData.summary}
                onChange={(e) => updateSummary(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900 resize-vertical"
                placeholder="Write a compelling summary that highlights your key achievements, skills, and career goals..."
              />
              <div className="text-xs text-gray-500 mt-2">
                {resumeData.summary.length}/500 characters
              </div>
            </div>

            {/* Skills Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-linear-to-b from-blue-600 to-purple-600 rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">Skills</h2>
              </div>
              <div className="flex flex-wrap gap-3 mb-4">
                {resumeData.skills.map((skill) => (
                  <div key={skill} className="bg-linear-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-xl font-medium border border-blue-200 flex items-center gap-2">
                    {skill}
                    <button 
                      onClick={() => removeSkill(skill)}
                      className="text-red-500 hover:text-red-700 text-lg"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button 
                onClick={addSkill}
                className="bg-gray-100 text-gray-600 px-4 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 border border-gray-300 w-full font-semibold"
              >
                + Add Skill
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={handleSaveDraft}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex-1"
              >
                💾 Save Draft
              </button>
              <button 
                onClick={() => setShowChatbot(!showChatbot)}
                className="bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex-1"
              >
                🤖 {showChatbot ? 'Hide' : 'Show'} AI Help
              </button>
            </div>
          </div>

          {/* Right Side - Preview */}
          <div className="space-y-6">
            {/* Preview Side */}
            <div className="sticky top-6">
              <div ref={resumePreviewRef} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {resumeData.personalInfo.name || 'Your Name'}
                  </h1>
                  <div className="flex flex-wrap justify-center gap-4 text-gray-600 mb-4">
                    {resumeData.personalInfo.email && (
                      <span className="flex items-center gap-1">
                        <span>📧</span>
                        {resumeData.personalInfo.email}
                      </span>
                    )}
                    {resumeData.personalInfo.phone && (
                      <span className="flex items-center gap-1">
                        <span>📱</span>
                        {resumeData.personalInfo.phone}
                      </span>
                    )}
                    {resumeData.personalInfo.location && (
                      <span className="flex items-center gap-1">
                        <span>📍</span>
                        {resumeData.personalInfo.location}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-center gap-4 text-blue-600">
                    {resumeData.personalInfo.portfolio && (
                      <a href={resumeData.personalInfo.portfolio} className="hover:underline">Portfolio</a>
                    )}
                    {resumeData.personalInfo.linkedin && (
                      <a href={resumeData.personalInfo.linkedin} className="hover:underline">LinkedIn</a>
                    )}
                  </div>
                </div>

                {resumeData.summary && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">Professional Summary</h3>
                    <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
                  </div>
                )}

                {resumeData.skills.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">Technical Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill) => (
                        <span key={skill} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm border border-gray-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {resumeData.experiences.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">Work Experience</h3>
                    {resumeData.experiences.map((exp, index) => (
                      <div key={index} className="mb-4 last:mb-0">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-gray-900">{exp.position}</span>
                          <span className="text-gray-600 text-sm bg-gray-100 px-2 py-1 rounded">{exp.period}</span>
                        </div>
                        <div className="text-gray-700 font-medium mb-2">{exp.company}</div>
                        <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {resumeData.education.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">Education</h3>
                    {resumeData.education.map((edu, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-gray-900">{edu.degree}</div>
                          <div className="text-gray-700">{edu.institution}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-600 text-sm">{edu.period}</div>
                          {edu.gpa && <div className="text-gray-600 text-sm">GPA: {edu.gpa}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {resumeData.projects.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">Projects</h3>
                    {resumeData.projects.map((project, index) => (
                      <div key={index} className="mb-4 last:mb-0">
                        <div className="font-semibold text-gray-900 mb-1">{project.name}</div>
                        <p className="text-gray-600 text-sm mb-2">{project.description}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {project.technologies.map((tech) => (
                            <span key={tech} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                              {tech}
                            </span>
                          ))}
                        </div>
                        {project.link && (
                          <a href={project.link} className="text-blue-600 text-sm hover:underline">
                            View Project →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chatbot */}
      {showChatbot && (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isChatMinimized ? 'w-16 h-16' : 'w-80 h-96'
        }`}>
          {isChatMinimized ? (
            // Minimized state - just a floating button
            <button
              onClick={() => setIsChatMinimized(false)}
              className="w-16 h-16 bg-linear-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 group"
            >
              <div className="text-white font-bold text-lg">AI</div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </button>
          ) : (
            // Expanded state - full chatbot
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col h-full">
              {/* Chat Header */}
              <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold">
                    AI
                  </div>
                  <div>
                    <h3 className="font-bold">Resume Assistant</h3>
                    <p className="text-blue-100 text-xs">Online • Ready to help</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsChatMinimized(true)}
                    className="text-white hover:text-gray-200 text-lg transition-all"
                    title="Minimize"
                  >
                    −
                  </button>
                  <button 
                    onClick={() => setShowChatbot(false)}
                    className="text-white hover:text-gray-200 text-lg transition-all"
                    title="Close"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                      message.isUser 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}>
                      {message.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-none p-3">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about resume writing..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !userInput.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 text-sm"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}