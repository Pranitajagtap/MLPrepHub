'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const interests = [
  'Working with data and analytics',
  'Creating AI and machine learning models', 
  'Building predictive models',
  'Data visualization and storytelling',
  'Natural language processing',
  'Computer vision and image recognition',
  'Deep learning and neural networks',
  'Statistical analysis and modeling',
  'Big data and distributed systems',
  'ML model deployment and serving',
  'Research and experimentation',
  'Optimizing algorithms for performance'
]

const mlCareers = [
  {
    title: 'Machine Learning Engineer',
    description: 'Design, build, and deploy ML models and systems at scale',
    demand: 'Very High',
    salary: '₹8-25L for freshers',
    skills: ['Python', 'TensorFlow', 'MLOps', 'Deep Learning'],
    matches: ['Creating AI and machine learning models', 'Building predictive models', 'ML model deployment and serving', 'Optimizing algorithms for performance']
  },
  {
    title: 'Data Scientist',
    description: 'Extract insights from data and build predictive models for business decisions',
    demand: 'High',
    salary: '₹6-20L for freshers', 
    skills: ['Python', 'Statistics', 'SQL', 'Data Analysis'],
    matches: ['Working with data and analytics', 'Statistical analysis and modeling', 'Data visualization and storytelling', 'Building predictive models']
  },
  {
    title: 'AI Research Scientist',
    description: 'Push the boundaries of AI through research and development of new algorithms',
    demand: 'High',
    salary: '₹10-30L for freshers',
    skills: ['Research', 'Mathematics', 'PyTorch', 'Publications'],
    matches: ['Research and experimentation', 'Deep learning and neural networks', 'Creating AI and machine learning models']
  },
  {
    title: 'MLOps Engineer',
    description: 'Build and maintain ML infrastructure for model deployment and monitoring',
    demand: 'Very High',
    salary: '₹7-22L for freshers',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'Cloud Platforms'],
    matches: ['ML model deployment and serving', 'Big data and distributed systems', 'Optimizing algorithms for performance']
  },
  {
    title: 'Data Engineer',
    description: 'Build data pipelines and infrastructure to support ML systems',
    demand: 'High',
    salary: '₹5-18L for freshers',
    skills: ['SQL', 'Spark', 'Data Pipelines', 'ETL'],
    matches: ['Big data and distributed systems', 'Working with data and analytics', 'ML model deployment and serving']
  },
  {
    title: 'Computer Vision Engineer',
    description: 'Develop algorithms for image and video analysis and understanding',
    demand: 'High',
    salary: '₹8-24L for freshers',
    skills: ['OpenCV', 'CNN', 'Image Processing', 'Deep Learning'],
    matches: ['Computer vision and image recognition', 'Deep learning and neural networks', 'Creating AI and machine learning models']
  },
  {
    title: 'NLP Engineer',
    description: 'Build systems that understand and generate human language',
    demand: 'High',
    salary: '₹7-22L for freshers',
    skills: ['Transformers', 'NLP', 'Language Models', 'Text Mining'],
    matches: ['Natural language processing', 'Deep learning and neural networks', 'Creating AI and machine learning models']
  }
]

export default function Onboarding() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in by checking for user data in localStorage
    const userData = localStorage.getItem('user')
    const isUserLoggedIn = !!userData
    setIsLoggedIn(isUserLoggedIn)

    // If user is logged in and has guest data, clear it
    if (isUserLoggedIn) {
      localStorage.removeItem('guestOnboarding')
    }
  }, [])

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
    setError('') // Clear error when user interacts
  }

  // Calculate matching careers based on selected interests
  const getMatchingCareers = () => {
    const careerScores = mlCareers.map(career => {
      const matchCount = career.matches.filter(match => 
        selectedInterests.includes(match)
      ).length
      return { ...career, score: matchCount }
    })

    // Filter careers that have at least one match and sort by match score
    const matchingCareers = careerScores
      .filter(career => career.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3) // Show top 3 matches

    // If no matches found, show top 3 popular careers
    if (matchingCareers.length === 0) {
      return mlCareers.slice(0, 3).map(career => ({ ...career, score: 0 }))
    }

    return matchingCareers
  }

  const handleNextStep = () => {
    // For both logged in and guest users, just move to next step
    setCurrentStep(2)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError('')

    try {
      if (isLoggedIn) {
        // User is logged in - save to database and go to dashboard
        const userData = localStorage.getItem('user')
        if (userData) {
          const user = JSON.parse(userData)
          
          // Save onboarding data to database via API
          const response = await fetch('/api/onboarding', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              interests: selectedInterests,
              careerMatches: getMatchingCareers().map(c => c.title)
            }),
          })

          const result = await response.json()

          if (response.ok && result.success) {
            // Update user data with onboarding completion
            const updatedUser = {
              ...user,
              hasCompletedOnboarding: true,
              targetRole: getMatchingCareers()[0]?.title || 'ML Student'
            }
            localStorage.setItem('user', JSON.stringify(updatedUser))
            
            // Trigger auth event to update FloatingProfile
            window.dispatchEvent(new CustomEvent('authChange', { 
              detail: { user: updatedUser, action: 'update' } 
            }))
            
            router.push('/dashboard')
          } else {
            throw new Error(result.message || 'Failed to save onboarding data')
          }
        } else {
          throw new Error('User data not found')
        }
      } else {
        // Guest user - redirect to register page with onboarding data
        const guestOnboardingData = {
          selectedInterests,
          matchingCareers: getMatchingCareers(),
          completedAt: new Date().toISOString()
        }
        localStorage.setItem('guestOnboarding', JSON.stringify(guestOnboardingData))
        router.push('/auth/register?from=onboarding')
      }
    } catch (error) {
      console.error('Error saving onboarding:', error)
      setError(error instanceof Error ? error.message : 'Failed to save your data. Please try again.')
      
      // Fallback: redirect to dashboard even if save fails
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)
    } finally {
      setIsLoading(false)
    }
  }

  if (currentStep === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              What excites you about Machine Learning?
            </h1>
            <p className="text-gray-600">
              {`Select 2-3 areas that interest you most. We'll suggest the best ML career paths for you.`}
            </p>
            {!isLoggedIn && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-700 text-sm">
                  💡 <strong>Exploring as a guest:</strong> You can try our career matcher without creating an account first.
                </p>
              </div>
            )}
            {isLoggedIn && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm">
                  ✅ <strong>Welcome!</strong> Complete onboarding to personalize your learning experience.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {interests.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`p-4 rounded-lg border-2 text-left transition ${
                  selectedInterests.includes(interest)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-200 hover:bg-blue-25'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={handleNextStep}
              disabled={selectedInterests.length === 0}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold"
            >
              Discover Your ML Path ({selectedInterests.length} selected)
            </button>
          </div>
        </div>
      </div>
    )
  }

  const matchingCareers = getMatchingCareers()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your Personalized ML Career Matches
          </h1>
          <p className="text-gray-600">
            Based on your interests in <span className="text-blue-600 font-semibold">{selectedInterests.join(', ')}</span>
          </p>
          {!isLoggedIn && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 text-sm">
                🚀 <strong>Great matches!</strong> Create an account to save your career matches and start your learning journey.
              </p>
            </div>
          )}
          {isLoggedIn && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">
                🎯 <strong>Your career path is ready!</strong> Save your preferences to get personalized content.
              </p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">
              ⚠️ {error} Redirecting you to dashboard...
            </p>
          </div>
        )}

        <div className="space-y-6 mb-8">
          {matchingCareers.map((career, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition hover:shadow-md">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl text-blue-600">{career.title}</h3>
                {career.score > 0 && (
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    {career.score} interest match{career.score > 1 ? 'es' : ''}
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-3">{career.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {career.skills.map((skill, skillIndex) => (
                  <span key={skillIndex} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                    {skill}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`text-sm font-semibold ${
                  career.demand === 'Very High' ? 'text-green-600' : 'text-blue-600'
                }`}>
                  {career.demand} Demand
                </span>
                <span className="text-sm text-gray-500 font-medium">{career.salary}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4 text-sm">
            Not seeing your perfect match? You can explore all ML careers later.
          </p>
          
          {isLoggedIn ? (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition font-semibold"
            >
              {isLoading ? 'Saving...' : 'Save & Continue to Dashboard'}
            </button>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition font-semibold"
              >
                {isLoading ? 'Processing...' : 'Create Account & Save Matches'}
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition font-semibold"
              >
                Continue Exploring as Guest
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}