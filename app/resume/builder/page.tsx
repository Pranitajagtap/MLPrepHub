'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface ResumeData {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    portfolio: string
    linkedin: string
  }
  targetPosition: string
  summary: string
  skills: string[]
  experiences: Array<{
    company: string
    position: string
    period: string
    description: string
    achievements: string[]
  }>
  education: Array<{
    institution: string
    degree: string
    period: string
    gpa: string
  }>
  projects: Array<{
    name: string
    description: string
    technologies: string[]
    link: string
  }>
}

// Create a separate component that uses useSearchParams
function ResumeBuilderContent() {
  const searchParams = useSearchParams()
  const resumePreviewRef = useRef<HTMLDivElement>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [showAIGuide, setShowAIGuide] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [targetPosition, setTargetPosition] = useState('')
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [newExperience, setNewExperience] = useState({
    company: '',
    position: '',
    period: '',
    description: '',
    achievements: ['']
  })
  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    period: '',
    gpa: ''
  })
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    technologies: [''],
    link: ''
  })
  const [showDetailedFeedback, setShowDetailedFeedback] = useState(false)

  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      portfolio: '',
      linkedin: ''
    },
    targetPosition: '',
    summary: '',
    skills: [],
    experiences: [],
    education: [],
    projects: []
  })

  useEffect(() => {
    if (searchParams.get('aiGuide') === 'true') {
      setShowAIGuide(true)
    }
  }, [searchParams])

  const steps = [
    { number: 1, title: 'Position', description: 'Set your career target' },
    { number: 2, title: 'Personal Info', description: 'Basic contact information' },
    { number: 3, title: 'Summary', description: 'Your professional pitch' },
    { number: 4, title: 'Skills', description: 'Technical and soft skills' },
    { number: 5, title: 'Experience', description: 'Work history and achievements' },
    { number: 6, title: 'Education', description: 'Academic background' },
    { number: 7, title: 'Projects', description: 'Portfolio showcase' }
  ]

  const positionTemplates = {
    'Full Stack Developer': {
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'Git', 'REST APIs'],
      summary: 'Experienced Full Stack Developer with expertise in modern web technologies. Passionate about building scalable applications and solving complex problems.',
      icon: '💻'
    },
    'Data Scientist': {
      skills: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'TensorFlow', 'Data Visualization'],
      summary: 'Data Scientist with strong analytical skills and experience in machine learning. Skilled in extracting insights from complex datasets.',
      icon: '📊'
    },
    'Frontend Developer': {
      skills: ['React', 'TypeScript', 'CSS', 'HTML', 'Redux', 'Next.js'],
      summary: 'Frontend Developer specializing in creating responsive and user-friendly web applications. Focused on performance and user experience.',
      icon: '🎨'
    },
    'Machine Learning Engineer': {
      skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'Deep Learning', 'AWS'],
      summary: 'Machine Learning Engineer with experience in developing and deploying AI models. Strong background in data pipelines and model optimization.',
      icon: '🤖'
    },
    'DevOps Engineer': {
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux'],
      summary: 'DevOps Engineer with expertise in cloud infrastructure and automation. Focused on improving deployment processes and system reliability.',
      icon: '⚙️'
    },
    'Product Manager': {
      skills: ['Agile', 'JIRA', 'User Research', 'Roadmapping', 'SQL', 'Analytics'],
      summary: 'Product Manager with experience in driving product strategy and execution. Skilled in market analysis and cross-functional team leadership.',
      icon: '📈'
    }
  }

  const handlePositionSelect = (position: string) => {
    setTargetPosition(position)
    setResumeData(prev => ({
      ...prev,
      targetPosition: position,
      skills: positionTemplates[position as keyof typeof positionTemplates]?.skills || [],
      summary: positionTemplates[position as keyof typeof positionTemplates]?.summary || ''
    }))
    setCurrentStep(2)
  }

  const getAISuggestion = (step: number) => {
    const suggestions = {
      1: "Choose a position that matches your skills and career goals. Consider the job market demand and your long-term aspirations.",
      2: "Ensure your contact information is professional. Use a portfolio/GitHub to showcase your work and include relevant links.",
      3: "Write a compelling summary that highlights your unique value proposition and key achievements. Keep it concise and targeted.",
      4: "Include both technical and soft skills. Prioritize skills mentioned in your target job descriptions.",
      5: "Use action verbs and quantify achievements. Show impact with numbers and specific results.",
      6: "Highlight relevant coursework, projects, and academic achievements that support your career goals.",
      7: "Showcase projects that demonstrate your skills for the target position with live links when possible."
    }
    setAiSuggestion(suggestions[step as keyof typeof suggestions] || '')
  }

  const getDetailedFeedback = () => {
    const feedback = {
      personalInfo: `Your contact information looks ${resumeData.personalInfo.name && resumeData.personalInfo.email ? 'good' : 'incomplete'}. ${!resumeData.personalInfo.portfolio ? 'Consider adding a portfolio link to showcase your work.' : ''}`,
      summary: `Your summary is ${resumeData.summary.length > 50 ? 'good but could be more impactful' : 'too short'}. Try to include specific achievements and technologies.`,
      skills: `You have ${resumeData.skills.length} skills listed. ${resumeData.skills.length < 5 ? 'Consider adding more relevant skills for your target position.' : 'Good variety of skills!'}`,
      experiences: `You have ${resumeData.experiences.length} work experiences. ${resumeData.experiences.length === 0 ? 'Add your work history to strengthen your resume.' : 'Great job detailing your experience.'}`,
      education: `${resumeData.education.length > 0 ? 'Your education section looks complete.' : 'Consider adding your educational background.'}`,
      projects: `${resumeData.projects.length > 0 ? 'Projects help demonstrate practical skills.' : 'Adding projects can showcase your abilities.'}`
    }
    
    return Object.values(feedback).filter(fb => fb).join(' ')
  }

  useEffect(() => {
    getAISuggestion(currentStep)
  }, [currentStep])

  const addSkill = () => {
    if (newSkill.trim() && !resumeData.skills.includes(newSkill.trim())) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const addExperience = () => {
    if (newExperience.company && newExperience.position) {
      setResumeData(prev => ({
        ...prev,
        experiences: [...prev.experiences, { ...newExperience }]
      }))
      setNewExperience({
        company: '',
        position: '',
        period: '',
        description: '',
        achievements: ['']
      })
    }
  }

  const removeExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }))
  }

  const addEducation = () => {
    if (newEducation.institution && newEducation.degree) {
      setResumeData(prev => ({
        ...prev,
        education: [...prev.education, { ...newEducation }]
      }))
      setNewEducation({
        institution: '',
        degree: '',
        period: '',
        gpa: ''
      })
    }
  }

  const removeEducation = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  const addProject = () => {
    if (newProject.name && newProject.description) {
      setResumeData(prev => ({
        ...prev,
        projects: [...prev.projects, { ...newProject }]
      }))
      setNewProject({
        name: '',
        description: '',
        technologies: [''],
        link: ''
      })
    }
  }

  const removeProject = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }))
  }

  const handleDownloadPDF = async () => {
    if (!resumePreviewRef.current) {
      alert('Cannot generate PDF. Please try again.')
      return
    }

    setIsGeneratingPDF(true)

    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Could not open print window. Please allow popups for this site.');
      }

      const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${resumeData.personalInfo.name || 'Resume'}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 0;
                padding: 40px;
                color: #000;
                background: white;
                line-height: 1.4;
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
                font-weight: bold;
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
                font-weight: bold;
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
                body { margin: 0; padding: 20px; }
                .resume-container { max-width: none; box-shadow: none; }
              }
            </style>
          </head>
          <body>
            <div class="resume-container">
              <div class="header">
                <h1>${resumeData.personalInfo.name || 'Your Name'}</h1>
                <div class="contact-info">
                  ${resumeData.personalInfo.email ? `<span>📧 ${resumeData.personalInfo.email}</span>` : ''}
                  ${resumeData.personalInfo.phone ? `<span>📱 ${resumeData.personalInfo.phone}</span>` : ''}
                  ${resumeData.personalInfo.location ? `<span>📍 ${resumeData.personalInfo.location}</span>` : ''}
                </div>
                <div class="links">
                  ${resumeData.personalInfo.portfolio ? `<span>🔗 ${resumeData.personalInfo.portfolio}</span>` : ''}
                  ${resumeData.personalInfo.linkedin ? `<span>💼 ${resumeData.personalInfo.linkedin}</span>` : ''}
                </div>
              </div>

              ${resumeData.targetPosition ? `
                <div class="section">
                  <h3>Target Position</h3>
                  <p class="description"><strong>${resumeData.targetPosition}</strong></p>
                </div>
              ` : ''}

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
                      ${edu.gpa ? `<p class="description"><strong>GPA:</strong> ${edu.gpa}</p>` : ''}
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              ${resumeData.projects.length > 0 ? `
                <div class="section">
                  <h3>Projects</h3>
                  ${resumeData.projects.map(project => `
                    <div class="project-item">
                      <div class="position"><strong>${project.name}</strong></div>
                      <p class="description">${project.description}</p>
                      ${project.technologies.length > 0 ? `
                        <div class="technologies">
                          <strong>Technologies:</strong> ${project.technologies.map(tech => `<span class="tech">${tech}</span>`).join('')}
                        </div>
                      ` : ''}
                      ${project.link ? `<p class="description"><strong>Link:</strong> ${project.link}</p>` : ''}
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
      
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
          alert('PDF generated successfully! Use the print dialog to save as PDF.');
        };
      }, 500);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${resumeData.personalInfo.name || 'Resume'}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .section { margin-bottom: 25px; }
              .skills { display: flex; flex-wrap: wrap; gap: 8px; }
              .skill { background: #f3f4f6; padding: 4px 12px; border-radius: 12px; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${resumeData.personalInfo.name || 'Your Name'}</h1>
              <p>Email: ${resumeData.personalInfo.email || 'Not provided'}</p>
              <p>Phone: ${resumeData.personalInfo.phone || 'Not provided'}</p>
              <p>Location: ${resumeData.personalInfo.location || 'Not provided'}</p>
            </div>
            ${resumeData.targetPosition ? `<div class="section"><h2>Target Position</h2><p>${resumeData.targetPosition}</p></div>` : ''}
            ${resumeData.summary ? `<div class="section"><h2>Summary</h2><p>${resumeData.summary}</p></div>` : ''}
            ${resumeData.skills.length > 0 ? `<div class="section"><h2>Skills</h2><div class="skills">${resumeData.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}</div></div>` : ''}
            ${resumeData.experiences.length > 0 ? `<div class="section"><h2>Experience</h2>${resumeData.experiences.map(exp => `<p><strong>${exp.position}</strong> at ${exp.company} (${exp.period})<br>${exp.description}</p>`).join('')}</div>` : ''}
            ${resumeData.education.length > 0 ? `<div class="section"><h2>Education</h2>${resumeData.education.map(edu => `<p><strong>${edu.degree}</strong> from ${edu.institution} (${edu.period})${edu.gpa ? `<br>GPA: ${edu.gpa}` : ''}</p>`).join('')}</div>` : ''}
            ${resumeData.projects.length > 0 ? `<div class="section"><h2>Projects</h2>${resumeData.projects.map(proj => `<p><strong>${proj.name}</strong><br>${proj.description}${proj.technologies.length > 0 ? `<br>Technologies: ${proj.technologies.join(', ')}` : ''}${proj.link ? `<br>Link: ${proj.link}` : ''}</p>`).join('')}</div>` : ''}
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

  const saveDraft = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('resume-draft', JSON.stringify(resumeData))
      alert('Draft saved successfully!')
    }
  }

  const handleGetDetailedFeedback = () => {
    setShowDetailedFeedback(true)
    setTimeout(() => {
      setShowDetailedFeedback(false)
    }, 5000)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Build Your Resume</h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              AI-guided resume builder with position-specific templates and real-time optimization
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowAIGuide(!showAIGuide)}
              className="bg-white text-gray-700 px-6 py-3 rounded-xl border border-gray-300 hover:border-gray-400 transition-all font-semibold shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <span>🤖</span>
              {showAIGuide ? 'Hide AI Guide' : 'Show AI Guide'}
            </button>
            <button 
              onClick={saveDraft}
              className="bg-white text-gray-700 px-6 py-3 rounded-xl border border-gray-300 hover:border-gray-400 transition-all font-semibold shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <span>💾</span>
              Save Draft
            </button>
            <button 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50"
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Progress Steps */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
              <div className="flex justify-between relative">
                {steps.map((step) => (
                  <div key={step.number} className="flex flex-col items-center z-10 flex-1">
                    <button
                      onClick={() => setCurrentStep(step.number)}
                      className={`w-14 h-14 rounded-full flex items-center justify-center font-semibold border-2 transition-all duration-300 ${
                        currentStep > step.number 
                          ? 'bg-linear-to-r from-green-500 to-blue-600 text-white border-transparent shadow-lg' 
                          : currentStep === step.number
                          ? 'border-blue-600 bg-white text-blue-600 shadow-lg scale-110'
                          : 'bg-gray-100 text-gray-400 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {currentStep > step.number ? '✓' : step.number}
                    </button>
                    <div className="text-center mt-3">
                      <div className={`text-sm font-semibold ${
                        currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 hidden sm:block">
                        {step.description}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="absolute top-7 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
                <div 
                  className="absolute top-7 left-0 h-0.5 bg-linear-to-r from-green-500 to-blue-600 -z-10 transition-all duration-500"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step Content */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
              {/* Step 1: Position Selection */}
              {currentStep === 1 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-8 bg-linear-to-b from-blue-600 to-purple-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900">Choose Your Target Position</h2>
                  </div>
                  <p className="text-gray-600 mb-8">Select a position to auto-fill relevant skills and templates</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(positionTemplates).map(([position, template]) => (
                      <button
                        key={position}
                        onClick={() => handlePositionSelect(position)}
                        className="p-6 border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-xl transition-all duration-300 text-left group bg-white hover:bg-blue-50"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl">{template.icon}</span>
                          <h3 className="font-bold text-gray-900 text-lg">{position}</h3>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {template.skills.slice(0, 4).map((skill) => (
                            <span key={skill} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {skill}
                            </span>
                          ))}
                          {template.skills.length > 4 && (
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                              +{template.skills.length - 4} more
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {template.summary.slice(0, 100)}...
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Personal Info */}
              {currentStep === 2 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-8 bg-linear-to-b from-blue-600 to-purple-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Full Name *</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.name}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, name: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Email *</label>
                      <input
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, email: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Phone</label>
                      <input
                        type="tel"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, phone: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900"
                        placeholder="+91 9876543210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Location</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.location}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, location: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900"
                        placeholder="Bangalore, India"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Portfolio/GitHub</label>
                      <input
                        type="url"
                        value={resumeData.personalInfo.portfolio}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, portfolio: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900"
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">LinkedIn</label>
                      <input
                        type="url"
                        value={resumeData.personalInfo.linkedin}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Summary */}
              {currentStep === 3 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-8 bg-linear-to-b from-blue-600 to-purple-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900">Professional Summary</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Your Summary *</label>
                      <textarea
                        value={resumeData.summary}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          summary: e.target.value
                        }))}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900 resize-vertical"
                        placeholder="Write a compelling professional summary that highlights your key achievements, skills, and career goals..."
                      />
                    </div>
                    <div className="text-sm text-gray-500">
                      {resumeData.summary.length}/500 characters
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Skills */}
              {currentStep === 4 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-8 bg-linear-to-b from-blue-600 to-purple-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900"
                        placeholder="Add a new skill"
                      />
                      <button
                        onClick={addSkill}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold"
                      >
                        Add Skill
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
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
                  </div>
                </div>
              )}

              {/* Step 5: Experience */}
              {currentStep === 5 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-8 bg-linear-to-b from-blue-600 to-purple-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Company *</label>
                        <input
                          type="text"
                          value={newExperience.company}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, company: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900"
                          placeholder="Company Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Position *</label>
                        <input
                          type="text"
                          value={newExperience.position}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, position: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900"
                          placeholder="Job Title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Period</label>
                        <input
                          type="text"
                          value={newExperience.period}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, period: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900"
                          placeholder="e.g., 2020 - Present"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
                        <input
                          type="text"
                          value={newExperience.description}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900"
                          placeholder="Brief description of your role"
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={addExperience}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold"
                    >
                      Add Experience
                    </button>

                    <div className="space-y-4">
                      {resumeData.experiences.map((exp, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                              <p className="text-gray-700">{exp.company} • {exp.period}</p>
                              <p className="text-gray-600 text-sm mt-1">{exp.description}</p>
                            </div>
                            <button
                              onClick={() => removeExperience(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Education */}
              {currentStep === 6 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-8 bg-linear-to-b from-blue-600 to-purple-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900">Education</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Institution *</label>
                        <input
                          type="text"
                          value={newEducation.institution}
                          onChange={(e) => setNewEducation(prev => ({ ...prev, institution: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900"
                          placeholder="University Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Degree *</label>
                        <input
                          type="text"
                          value={newEducation.degree}
                          onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900"
                          placeholder="e.g., B.Tech Computer Science"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Period</label>
                        <input
                          type="text"
                          value={newEducation.period}
                          onChange={(e) => setNewEducation(prev => ({ ...prev, period: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900"
                          placeholder="e.g., 2018 - 2022"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">GPA</label>
                        <input
                          type="text"
                          value={newEducation.gpa}
                          onChange={(e) => setNewEducation(prev => ({ ...prev, gpa: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900"
                          placeholder="e.g., 8.5/10"
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={addEducation}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold"
                    >
                      Add Education
                    </button>

                    <div className="space-y-4">
                      {resumeData.education.map((edu, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                              <p className="text-gray-700">{edu.institution} • {edu.period}</p>
                              {edu.gpa && <p className="text-gray-600 text-sm mt-1">GPA: {edu.gpa}</p>}
                            </div>
                            <button
                              onClick={() => removeEducation(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Projects */}
              {currentStep === 7 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-8 bg-linear-to-b from-blue-600 to-purple-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Project Name *</label>
                        <input
                          type="text"
                          value={newProject.name}
                          onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900"
                          placeholder="Project Title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Description *</label>
                        <textarea
                          value={newProject.description}
                          onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900 resize-vertical"
                          placeholder="Describe your project and its features"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Technologies</label>
                        <input
                          type="text"
                          value={newProject.technologies.join(', ')}
                          onChange={(e) => setNewProject(prev => ({ ...prev, technologies: e.target.value.split(', ').filter(t => t.trim()) }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900"
                          placeholder="React, Node.js, MongoDB (comma separated)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Project Link</label>
                        <input
                          type="url"
                          value={newProject.link}
                          onChange={(e) => setNewProject(prev => ({ ...prev, link: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900"
                          placeholder="https://github.com/username/project"
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={addProject}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold"
                    >
                      Add Project
                    </button>

                    <div className="space-y-4">
                      {resumeData.projects.map((project, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">{project.name}</h4>
                              <p className="text-gray-700 text-sm mt-1">{project.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {project.technologies.map((tech) => (
                                  <span key={tech} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                              {project.link && (
                                <a href={project.link} className="text-blue-600 text-sm hover:underline mt-2 inline-block">
                                  View Project
                                </a>
                              )}
                            </div>
                            <button
                              onClick={() => removeProject(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className="bg-gray-500 text-white px-8 py-4 rounded-xl hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <span>←</span>
                Previous
              </button>
              <button
                onClick={() => currentStep === steps.length ? handleDownloadPDF() : setCurrentStep(prev => Math.min(steps.length, prev + 1))}
                className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                {currentStep === steps.length ? 'Finish & Generate PDF' : 'Next Step'}
                <span>→</span>
              </button>
            </div>
          </div>

          {/* AI Guide Sidebar */}
          {showAIGuide && (
            <div className="lg:col-span-1">
              <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-6 border border-blue-100 sticky top-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    AI
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">AI Guide</h3>
                    <p className="text-xs text-gray-600">Step {currentStep}/7</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-blue-200">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">💡</span>
                    <p className="text-sm text-gray-700 leading-relaxed">{aiSuggestion}</p>
                  </div>
                </div>

                {showDetailedFeedback && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-0.5">✨</span>
                      <p className="text-sm text-yellow-800 leading-relaxed">
                        {getDetailedFeedback()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Current Position</div>
                    <div className="font-semibold text-gray-900">
                      {targetPosition || 'Not selected'}
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleGetDetailedFeedback}
                    className="w-full bg-linear-to-r from-green-500 to-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:from-green-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>✨</span>
                    Get Detailed Feedback
                  </button>
                  
                  <div className="text-xs text-gray-500 text-center">
                    AI-powered real-time optimization
                  </div>
                </div>
              </div>

              {/* Resume Preview */}
              <div ref={resumePreviewRef} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mt-6">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {resumeData.personalInfo.name || 'Your Name'}
                  </h1>
                  <div className="flex flex-wrap justify-center gap-3 text-gray-600 text-sm mb-3">
                    {resumeData.personalInfo.email && (
                      <span>📧 {resumeData.personalInfo.email}</span>
                    )}
                    {resumeData.personalInfo.phone && (
                      <span>📱 {resumeData.personalInfo.phone}</span>
                    )}
                    {resumeData.personalInfo.location && (
                      <span>📍 {resumeData.personalInfo.location}</span>
                    )}
                  </div>
                  <div className="flex justify-center gap-4 text-blue-600 text-sm">
                    {resumeData.personalInfo.portfolio && (
                      <span>🔗 Portfolio</span>
                    )}
                    {resumeData.personalInfo.linkedin && (
                      <span>💼 LinkedIn</span>
                    )}
                  </div>
                </div>

                {resumeData.targetPosition && (
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 mb-2 border-b pb-1">Target Position</h3>
                    <p className="text-gray-700 text-sm">{resumeData.targetPosition}</p>
                  </div>
                )}

                {resumeData.summary && (
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 mb-2 border-b pb-1">Summary</h3>
                    <p className="text-gray-700 text-sm">{resumeData.summary}</p>
                  </div>
                )}

                {resumeData.skills.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 mb-2 border-b pb-1">Skills</h3>
                    <div className="flex flex-wrap gap-1">
                      {resumeData.skills.map((skill) => (
                        <span key={skill} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {resumeData.experiences.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 mb-2 border-b pb-1">Experience</h3>
                    {resumeData.experiences.map((exp, index) => (
                      <div key={index} className="mb-3">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-900 text-sm">{exp.position}</span>
                          <span className="text-gray-600 text-xs">{exp.period}</span>
                        </div>
                        <div className="text-gray-700 text-sm">{exp.company}</div>
                        <p className="text-gray-600 text-xs mt-1">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {resumeData.education.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 mb-2 border-b pb-1">Education</h3>
                    {resumeData.education.map((edu, index) => (
                      <div key={index} className="mb-2">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-900 text-sm">{edu.degree}</span>
                          <span className="text-gray-600 text-xs">{edu.period}</span>
                        </div>
                        <div className="text-gray-700 text-sm">{edu.institution}</div>
                        {edu.gpa && <div className="text-gray-600 text-xs">GPA: {edu.gpa}</div>}
                      </div>
                    ))}
                  </div>
                )}

                {resumeData.projects.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 border-b pb-1">Projects</h3>
                    {resumeData.projects.map((project, index) => (
                      <div key={index} className="mb-3">
                        <div className="font-semibold text-gray-900 text-sm">{project.name}</div>
                        <p className="text-gray-600 text-xs mt-1">{project.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Main component with Suspense boundary
export default function ResumeBuilder() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Resume Builder...</p>
        </div>
      </div>
    }>
      <ResumeBuilderContent />
    </Suspense>
  )
}