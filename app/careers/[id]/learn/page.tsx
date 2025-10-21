import Link from 'next/link'
import { use } from 'react' // Import the use hook

export default function CareerLearnPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params promise
  const resolvedParams = use(params)
  const { id } = resolvedParams
  
  const careerModules = {
    'full-stack': [
      {
        id: 1,
        title: 'HTML5, CSS3 & JavaScript',
        duration: '4 weeks',
        progress: 100,
        topics: ['Semantic HTML', 'CSS Grid/Flexbox', 'JavaScript ES6+', 'DOM Manipulation'],
        gradient: 'from-green-500 to-emerald-500'
      },
      {
        id: 2,
        title: 'React.js Fundamentals',
        duration: '5 weeks',
        progress: 75,
        topics: ['Components & Props', 'State & Hooks', 'React Router', 'Context API'],
        gradient: 'from-blue-500 to-cyan-500'
      },
      {
        id: 3,
        title: 'Node.js & Express',
        duration: '6 weeks',
        progress: 50,
        topics: ['Server Setup', 'REST APIs', 'Middleware', 'Authentication'],
        gradient: 'from-purple-500 to-pink-500'
      },
      {
        id: 4,
        title: 'Database Management',
        duration: '4 weeks',
        progress: 25,
        topics: ['MongoDB/PostgreSQL', 'ORM/ODM', 'Data Modeling', 'Query Optimization'],
        gradient: 'from-orange-500 to-red-500'
      },
      {
        id: 5,
        title: 'Full Stack Projects',
        duration: '6 weeks',
        progress: 0,
        topics: ['E-commerce App', 'Social Media Platform', 'Real-time Chat', 'API Integration'],
        gradient: 'from-indigo-500 to-purple-500'
      }
    ],
    'data-scientist': [
      {
        id: 1,
        title: 'Python for Data Science',
        duration: '5 weeks',
        progress: 100,
        topics: ['Python Basics', 'NumPy Arrays', 'Pandas DataFrames', 'Data Cleaning'],
        gradient: 'from-green-500 to-emerald-500'
      },
      {
        id: 2,
        title: 'Statistics & Mathematics',
        duration: '6 weeks',
        progress: 75,
        topics: ['Probability', 'Statistical Tests', 'Linear Algebra', 'Calculus'],
        gradient: 'from-blue-500 to-cyan-500'
      },
      {
        id: 3,
        title: 'Data Visualization',
        duration: '4 weeks',
        progress: 50,
        topics: ['Matplotlib', 'Seaborn', 'Plotly', 'Dashboard Creation'],
        gradient: 'from-purple-500 to-pink-500'
      },
      {
        id: 4,
        title: 'Machine Learning',
        duration: '8 weeks',
        progress: 25,
        topics: ['Regression', 'Classification', 'Clustering', 'Model Evaluation'],
        gradient: 'from-orange-500 to-red-500'
      },
      {
        id: 5,
        title: 'Advanced ML & Deployment',
        duration: '6 weeks',
        progress: 0,
        topics: ['Deep Learning', 'NLP', 'Model Deployment', 'MLOps'],
        gradient: 'from-indigo-500 to-purple-500'
      }
    ],
    'ml-engineer': [
      {
        id: 1,
        title: 'Mathematics for ML',
        duration: '6 weeks',
        progress: 100,
        topics: ['Linear Algebra', 'Calculus', 'Probability', 'Statistics'],
        gradient: 'from-green-500 to-emerald-500'
      },
      {
        id: 2,
        title: 'Python & ML Libraries',
        duration: '5 weeks',
        progress: 75,
        topics: ['NumPy', 'Pandas', 'Scikit-learn', 'Data Preprocessing'],
        gradient: 'from-blue-500 to-cyan-500'
      },
      {
        id: 3,
        title: 'Deep Learning Fundamentals',
        duration: '7 weeks',
        progress: 50,
        topics: ['Neural Networks', 'TensorFlow/PyTorch', 'CNNs', 'RNNs'],
        gradient: 'from-purple-500 to-pink-500'
      },
      {
        id: 4,
        title: 'ML Systems & MLOps',
        duration: '6 weeks',
        progress: 25,
        topics: ['Model Deployment', 'Monitoring', 'Pipeline Automation', 'Scalability'],
        gradient: 'from-orange-500 to-red-500'
      },
      {
        id: 5,
        title: 'Advanced ML Projects',
        duration: '8 weeks',
        progress: 0,
        topics: ['Computer Vision', 'NLP Systems', 'Recommendation Engines', 'ML Infrastructure'],
        gradient: 'from-indigo-500 to-purple-500'
      }
    ],
    'frontend': [
      {
        id: 1,
        title: 'Advanced HTML/CSS',
        duration: '4 weeks',
        progress: 100,
        topics: ['CSS Grid', 'Flexbox', 'Animations', 'Responsive Design'],
        gradient: 'from-green-500 to-emerald-500'
      },
      {
        id: 2,
        title: 'Modern JavaScript',
        duration: '5 weeks',
        progress: 75,
        topics: ['ES6+ Features', 'Async/Await', 'Modules', 'Web APIs'],
        gradient: 'from-blue-500 to-cyan-500'
      },
      {
        id: 3,
        title: 'React Ecosystem',
        duration: '6 weeks',
        progress: 50,
        topics: ['Hooks', 'State Management', 'Testing', 'Performance'],
        gradient: 'from-purple-500 to-pink-500'
      },
      {
        id: 4,
        title: 'UI/UX & Tools',
        duration: '4 weeks',
        progress: 25,
        topics: ['Design Systems', 'Figma', 'Accessibility', 'Web Vitals'],
        gradient: 'from-orange-500 to-red-500'
      },
      {
        id: 5,
        title: 'Advanced Frontend',
        duration: '5 weeks',
        progress: 0,
        topics: ['TypeScript', 'Next.js', 'PWA', 'Build Tools'],
        gradient: 'from-indigo-500 to-purple-500'
      }
    ],
    'backend': [
      {
        id: 1,
        title: 'Backend Fundamentals',
        duration: '5 weeks',
        progress: 100,
        topics: ['Node.js/Python', 'REST Principles', 'HTTP Protocol', 'Server Architecture'],
        gradient: 'from-green-500 to-emerald-500'
      },
      {
        id: 2,
        title: 'Database Design',
        duration: '6 weeks',
        progress: 75,
        topics: ['SQL/NoSQL', 'Data Modeling', 'Indexing', 'Transactions'],
        gradient: 'from-blue-500 to-cyan-500'
      },
      {
        id: 3,
        title: 'API Development',
        duration: '5 weeks',
        progress: 50,
        topics: ['RESTful APIs', 'GraphQL', 'Authentication', 'Rate Limiting'],
        gradient: 'from-purple-500 to-pink-500'
      },
      {
        id: 4,
        title: 'System Architecture',
        duration: '6 weeks',
        progress: 25,
        topics: ['Microservices', 'Message Queues', 'Caching', 'Load Balancing'],
        gradient: 'from-orange-500 to-red-500'
      },
      {
        id: 5,
        title: 'Cloud & Deployment',
        duration: '5 weeks',
        progress: 0,
        topics: ['AWS/Azure', 'Docker', 'CI/CD', 'Monitoring'],
        gradient: 'from-indigo-500 to-purple-500'
      }
    ],
    'devops': [
      {
        id: 1,
        title: 'Linux & System Admin',
        duration: '5 weeks',
        progress: 100,
        topics: ['Linux Commands', 'Shell Scripting', 'User Management', 'Process Control'],
        gradient: 'from-green-500 to-emerald-500'
      },
      {
        id: 2,
        title: 'Networking & Security',
        duration: '6 weeks',
        progress: 75,
        topics: ['TCP/IP', 'DNS', 'Firewalls', 'SSL/TLS'],
        gradient: 'from-blue-500 to-cyan-500'
      },
      {
        id: 3,
        title: 'Containerization',
        duration: '5 weeks',
        progress: 50,
        topics: ['Docker', 'Docker Compose', 'Container Security', 'Image Optimization'],
        gradient: 'from-purple-500 to-pink-500'
      },
      {
        id: 4,
        title: 'Cloud & Infrastructure',
        duration: '6 weeks',
        progress: 25,
        topics: ['AWS Services', 'Terraform', 'Kubernetes', 'Service Mesh'],
        gradient: 'from-orange-500 to-red-500'
      },
      {
        id: 5,
        title: 'CI/CD & Monitoring',
        duration: '5 weeks',
        progress: 0,
        topics: ['Jenkins/GitLab CI', 'Monitoring Stack', 'Logging', 'SRE Practices'],
        gradient: 'from-indigo-500 to-purple-500'
      }
    ]
  }

  const careerTitles = {
    'full-stack': 'Full Stack Developer',
    'data-scientist': 'Data Scientist', 
    'ml-engineer': 'Machine Learning Engineer',
    'frontend': 'Frontend Developer',
    'backend': 'Backend Developer',
    'devops': 'DevOps Engineer'
  }

  const careerTitle = careerTitles[id as keyof typeof careerTitles] || 'Developer'
  const modules = careerModules[id as keyof typeof careerModules] || careerModules['full-stack']

  const totalProgress = Math.round(modules.reduce((sum, module) => sum + module.progress, 0) / modules.length)
  const completedTopics = modules.reduce((sum, module) => sum + Math.floor(module.topics.length * (module.progress / 100)), 0)
  const totalTopics = modules.reduce((sum, module) => sum + module.topics.length, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href={`/careers/${id}`} className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold">
          ← Back to Career Details
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {careerTitle} Learning Path
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Master the skills needed to become a professional <span className="font-semibold text-blue-600">{careerTitle}</span>
          </p>
        </div>

        {/* Modules */}
        <div className="space-y-6 mb-8">
          {modules.map((module, index) => (
            <div key={module.id} className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 text-blue-800 rounded-2xl w-14 h-14 flex items-center justify-center font-bold text-xl">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{module.title}</h3>
                    <p className="text-gray-600">⏱️ {module.duration} • 📚 {module.topics.length} topics</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{module.progress}%</div>
                  <div className="text-sm text-gray-500">Complete</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 font-medium">Module Progress</span>
                  <span className="font-semibold text-gray-900">{module.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-3 rounded-full bg-gradient-to-r ${module.gradient} transition-all duration-1000 ease-out`}
                    style={{ width: `${module.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-3 mb-6">
                {module.topics.map((topic) => (
                  <span key={topic} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-medium border border-gray-200">
                    {topic}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Link 
                  href={`/learn/${module.id}`}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold"
                >
                  {module.progress > 0 ? 'Continue' : 'Start'} Learning
                </Link>
                {module.progress > 0 && (
                  <Link 
                    href={`/learn/assessments/${module.id}`}
                    className="border-2 border-blue-500 text-blue-600 px-8 py-3 rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 font-semibold"
                  >
                    Take Assessment
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Overall Progress */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Overall Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{totalProgress}%</div>
              <div className="text-gray-700 font-semibold">Complete</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{completedTopics}/{totalTopics}</div>
              <div className="text-gray-700 font-semibold">Topics Mastered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">86%</div>
              <div className="text-gray-700 font-semibold">Average Score</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${totalProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}