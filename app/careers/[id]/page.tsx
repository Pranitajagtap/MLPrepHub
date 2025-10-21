import { use } from 'react'
import Link from 'next/link'

export default function CareerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params promise
  const resolvedParams = use(params)
  const { id } = resolvedParams

  const careerData = {
    'full-stack': {
      title: 'Full Stack Developer',
      description: 'Build complete web applications from frontend to backend. Master both client-side and server-side technologies.',
      salary: '$85,000 - $140,000',
      demand: 'Very High',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'Git'],
      growth: '22% (Much faster than average)',
      companies: ['Google', 'Meta', 'Netflix', 'Amazon', 'Startups'],
      icon: '💻'
    },
    'data-scientist': {
      title: 'Data Scientist',
      description: 'Extract insights from complex data using statistical analysis and machine learning algorithms.',
      salary: '$95,000 - $155,000',
      demand: 'High',
      skills: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'Data Visualization'],
      growth: '31% (Much faster than average)',
      companies: ['Microsoft', 'IBM', 'Tesla', 'Uber', 'Research Labs'],
      icon: '📊'
    },
    'ml-engineer': {
      title: 'Machine Learning Engineer',
      description: 'Design and implement machine learning systems and deploy AI models to production.',
      salary: '$110,000 - $170,000',
      demand: 'Very High',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'Deep Learning'],
      growth: '28% (Much faster than average)',
      companies: ['OpenAI', 'NVIDIA', 'Tesla', 'Apple', 'Amazon'],
      icon: '🤖'
    },
    'frontend': {
      title: 'Frontend Developer',
      description: 'Create beautiful, responsive user interfaces and ensure excellent user experiences.',
      salary: '$75,000 - $130,000',
      demand: 'High',
      skills: ['React', 'TypeScript', 'CSS', 'HTML', 'UI/UX Design'],
      growth: '18% (Faster than average)',
      companies: ['Spotify', 'Airbnb', 'Figma', 'Shopify', 'Creative Agencies'],
      icon: '🎨'
    },
    'backend': {
      title: 'Backend Developer',
      description: 'Build robust server-side applications, APIs, and database architectures.',
      salary: '$90,000 - $150,000',
      demand: 'High',
      skills: ['Node.js/Python', 'SQL/NoSQL', 'API Design', 'System Architecture'],
      growth: '20% (Faster than average)',
      companies: ['Stripe', 'Twilio', 'PayPal', 'Banks', 'Enterprise'],
      icon: '⚙️'
    },
    'devops': {
      title: 'DevOps Engineer',
      description: 'Streamline development processes, manage infrastructure, and ensure system reliability.',
      salary: '$100,000 - $160,000',
      demand: 'Very High',
      skills: ['AWS/Azure', 'Docker', 'Kubernetes', 'CI/CD', 'Monitoring'],
      growth: '25% (Much faster than average)',
      companies: ['Netflix', 'Amazon', 'Google Cloud', 'Startups', 'Enterprise'],
      icon: '🚀'
    }
  }

  const career = careerData[id as keyof typeof careerData] || careerData['full-stack']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/careers" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold">
          ← Back to Careers
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{career.icon}</div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {career.title}
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            {career.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Career Overview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Career Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">💰 Average Salary</h3>
                    <p className="text-2xl font-bold text-green-600">{career.salary}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">📈 Job Growth</h3>
                    <p className="text-xl font-bold text-blue-600">{career.growth}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">🔥 Market Demand</h3>
                    <p className="text-2xl font-bold text-orange-600">{career.demand}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">🏢 Top Companies</h3>
                    <p className="text-lg text-gray-700">{career.companies.slice(0, 3).join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Skills */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Skills Required</h2>
              <div className="flex flex-wrap gap-3">
                {career.skills.map((skill, index) => (
                  <span key={index} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold text-lg">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Learning Path CTA */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Start Your Journey</h3>
              <p className="text-blue-100 mb-6">
                Begin your path to becoming a {career.title} with our structured learning program.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">📚</div>
                  <span className="font-semibold">Structured Curriculum</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">🎯</div>
                  <span className="font-semibold">Real-world Projects</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">🤖</div>
                  <span className="font-semibold">AI-Powered Guidance</span>
                </div>
              </div>

              <Link 
                href={`/careers/${id}/learn`}
                className="block w-full bg-white text-blue-600 text-center py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                Explore Learning Path
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Career Outlook</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Remote Opportunities</span>
                  <span className="font-semibold text-green-600">High</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Learning Curve</span>
                  <span className="font-semibold text-orange-600">Moderate</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Career Flexibility</span>
                  <span className="font-semibold text-blue-600">High</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              href={`/careers/${id}/learn`}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-2xl mb-2">📚</div>
              <h3 className="font-bold text-lg mb-2">Learning Path</h3>
              <p className="text-green-100">Structured curriculum with projects</p>
            </Link>
            
            <Link 
              href="/assessments"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-bold text-lg mb-2">Skill Assessment</h3>
              <p className="text-blue-100">Test your current knowledge</p>
            </Link>
            
            <Link 
              href="/community"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-2xl mb-2">👥</div>
              <h3 className="font-bold text-lg mb-2">Community</h3>
              <p className="text-purple-100">Connect with other learners</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}