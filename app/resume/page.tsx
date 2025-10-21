import Link from 'next/link';

export default function ResumePage() {
  const resumes = [
    {
      id: '1',
      title: 'Full Stack Developer Resume',
      career: 'Full Stack Developer',
      lastUpdated: '2 days ago',
      score: 85,
      version: 3,
      status: 'optimized' as const,
      progress: 85
    },
    {
      id: '2', 
      title: 'Data Science Portfolio',
      career: 'Data Scientist',
      lastUpdated: '1 week ago',
      score: 72,
      version: 2,
      status: 'needs-improvement' as const,
      progress: 72
    },
    {
      id: '3',
      title: 'Frontend Developer CV',
      career: 'Frontend Developer', 
      lastUpdated: '3 weeks ago',
      score: 65,
      version: 1,
      status: 'needs-work' as const,
      progress: 65
    }
  ]

  type StatusType = 'optimized' | 'needs-improvement' | 'needs-work';
  type ScoreType = number;

  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case 'optimized': return 'bg-green-100 text-green-800';
      case 'needs-improvement': return 'bg-yellow-100 text-yellow-800';
      case 'needs-work': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  const getScoreColor = (score: ScoreType) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">My Resumes</h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Create, manage, and optimize your resumes for different career opportunities with AI-powered insights.
            </p>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/resume/templates"
              className="bg-white text-gray-700 px-6 py-3 rounded-xl border border-gray-300 hover:border-gray-400 transition-all font-semibold shadow-sm hover:shadow-md"
            >
              📄 Browse Templates
            </Link>
            <Link 
              href="/resume/builder"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <span>+</span>
              Create New Resume
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-2xl font-bold text-gray-900">{resumes.length}</div>
            <div className="text-gray-600">Total Resumes</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-2xl font-bold text-green-600">85%</div>
            <div className="text-gray-600">Best Score</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-gray-600">Career Paths</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-2xl font-bold text-purple-600">6</div>
            <div className="text-gray-600">Total Versions</div>
          </div>
        </div>

        {/* Resume Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {resumes.map((resume) => (
            <div key={resume.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{resume.title}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold">
                    v{resume.version}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Career Target</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(resume.status)}`}>
                    {resume.status.replace('-', ' ')}
                  </span>
                </div>
                <p className="font-semibold text-gray-800 text-lg">{resume.career}</p>
              </div>

              {/* Progress Bar */}
              <div className="px-6 pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">AI Optimization Score</span>
                  <span className={`font-bold ${getScoreColor(resume.score)}`}>{resume.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      resume.score >= 80 ? 'bg-green-500' : 
                      resume.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${resume.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <span>🕒</span>
                    <span>Updated {resume.lastUpdated}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    href={`/resume/${resume.id}`}
                    className="bg-blue-600 text-white text-center py-3 rounded-xl hover:bg-blue-700 transition font-semibold shadow-sm hover:shadow-md"
                  >
                    View & Edit
                  </Link>
                  <Link 
                    href={`/resume/${resume.id}/analyze`}
                    className="bg-white text-blue-600 text-center py-3 rounded-xl border border-blue-600 hover:bg-blue-50 transition font-semibold shadow-sm hover:shadow-md"
                  >
                    AI Analysis
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 border border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">Resume Optimization Tips</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</span>
                Best Practices
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Use action verbs and quantify achievements with metrics</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Tailor your resume for each specific job application</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Include relevant keywords from the job description</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Keep it clean, professional, and easy to scan (1-2 pages)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Highlight technical skills and project experience</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm">✗</span>
                Things to Avoid
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Irrelevant personal information or photos</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Spelling mistakes and grammatical errors</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Unprofessional email addresses</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Generic, non-specific objective statements</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Listing every single job without relevance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}