'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import Grid from '@/components/ui/Grid';
import Shape from '@/components/ui/Shapes';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useInstallation } from '@/hooks/useInstallation';
import InstallPrompt from '@/components/InstallPrompt';
import IOSInstallInstructions from '@/components/IOSInstallInstructions';
import { useState } from 'react';
import { fitnessFeatures } from '@/data/fitness-features';

export default function Home() {
  const { state } = useAuth();
  const { 
    canInstall, 
    isInstalled, 
    platform, 
    shouldShowPrompt, 
    showInstallPrompt 
  } = useInstallation();
  const [showInstallModal, setShowInstallModal] = useState(false);

  return (
    <main className="min-h-screen bg-brutal-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brutal-blue-50 to-brutal-green-50 border-b-brutal border-brutal-black">
        <div className="brutal-container py-12 md:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Typography variant="h1" weight="bold" className="mb-4 md:mb-6 text-brutal-black">
              My Kaizen App
            </Typography>
            <Typography variant="h3" weight="medium" className="mb-6 md:mb-8 text-brutal-gray max-w-2xl mx-auto">
              Transform your fitness journey with continuous improvement
            </Typography>
            <Typography variant="body" className="mb-8 md:mb-10 text-brutal-gray-600 max-w-xl mx-auto">
              Track progress, build lasting habits, and achieve your fitness goals one step at a time. 
              Your journey to a healthier, stronger you starts here.
            </Typography>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {state.isAuthenticated ? (
                <Link href="/dashboard">
                  <Button variant="default" size="lg" className="w-full sm:w-auto">
                    Continue Journey
                  </Button>
                </Link>
              ) : (
                <Link href="/register">
                  <Button variant="default" size="lg" className="w-full sm:w-auto">
                    Start Your Journey
                  </Button>
                </Link>
              )}
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20">
        <div className="brutal-container">
          <div className="text-center mb-12 md:mb-16">
            <Typography variant="h2" weight="bold" className="mb-4">
              Everything You Need
            </Typography>
            <Typography variant="body" className="text-brutal-gray max-w-2xl mx-auto">
              Comprehensive tools to track your fitness journey and build sustainable habits
            </Typography>
          </div>
          
          <Grid cols={2} gap="lg" className="mb-16">
            {fitnessFeatures.map((feature) => (
              <Card key={feature.id} className="p-6 md:p-8">
                <div className="text-center">
                  <Shape 
                    shape={feature.shapeType} 
                    color="primary" 
                    className="w-16 h-16 mb-4 mx-auto"
                  >
                    <Typography variant="h4" weight="bold" color="default">
                      {feature.icon}
                    </Typography>
                  </Shape>
                  <Typography variant="h5" weight="bold" className="mb-3">
                    {feature.title}
                  </Typography>
                  <Typography variant="body" className="text-brutal-gray">
                    {feature.description}
                  </Typography>
                </div>
              </Card>
            ))}
          </Grid>
        </div>
      </section>

      {/* Progress Showcase Section */}
      <section className="py-12 md:py-20 bg-brutal-gray-50">
        <div className="brutal-container">
          <div className="text-center mb-12 md:mb-16">
            <Typography variant="h2" weight="bold" className="mb-4">
              See Your Progress
            </Typography>
            <Typography variant="body" className="text-brutal-gray max-w-2xl mx-auto">
              Track your journey with visual progress indicators that celebrate every milestone
            </Typography>
          </div>
          
          <Card className="p-6 md:p-8">
            <Grid cols={4} gap="md" className="mb-8">
              <div className="text-center">
                <Shape shape="circle" color="primary" className="w-16 h-16 mx-auto mb-3">
                  <Typography variant="h5" weight="bold" color="default">
                    8/8
                  </Typography>
                </Shape>
                <Typography variant="caption" weight="bold" className="text-brutal-gray">
                  Glasses Today
                </Typography>
              </div>
              
              <div className="text-center">
                <Shape shape="square" color="secondary" className="w-16 h-16 mx-auto mb-3">
                  <Typography variant="h5" weight="bold" color="default">
                    -5
                  </Typography>
                </Shape>
                <Typography variant="caption" weight="bold" className="text-brutal-gray">
                  Lbs This Month
                </Typography>
              </div>
              
              <div className="text-center">
                <Shape shape="triangle" color="accent" className="w-16 h-16 mx-auto mb-3">
                  <Typography variant="h5" weight="bold" color="default">
                    1850
                  </Typography>
                </Shape>
                <Typography variant="caption" weight="bold" className="text-brutal-gray">
                  Calories Today
                </Typography>
              </div>
              
              <div className="text-center">
                <Shape shape="rectangle" color="destructive" className="w-16 h-16 mx-auto mb-3">
                  <Typography variant="h5" weight="bold" color="default">
                    12
                  </Typography>
                </Shape>
                <Typography variant="caption" weight="bold" className="text-brutal-gray">
                  Workouts This Week
                </Typography>
              </div>
            </Grid>
            
            <Typography variant="body" className="text-center text-brutal-gray">
              Every number tells your story of continuous improvement. Start tracking today and 
              watch your kaizen journey unfold with meaningful, measurable progress.
            </Typography>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-20">
        <div className="brutal-container">
          <div className="text-center mb-12 md:mb-16">
            <Typography variant="h2" weight="bold" className="mb-4">
              How It Works
            </Typography>
            <Typography variant="body" className="text-brutal-gray max-w-2xl mx-auto">
              Simple steps to transform your fitness journey with continuous improvement
            </Typography>
          </div>
          
          <Grid cols={4} gap="lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-brutal-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Typography variant="h4" weight="bold" className="text-brutal-blue">
                  1
                </Typography>
              </div>
              <Typography variant="h5" weight="bold" className="mb-3">
                Set Goals
              </Typography>
              <Typography variant="body" className="text-brutal-gray">
                Define your fitness targets and track progress daily
              </Typography>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-brutal-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Typography variant="h4" weight="bold" className="text-brutal-green">
                  2
                </Typography>
              </div>
              <Typography variant="h5" weight="bold" className="mb-3">
                Track Progress
              </Typography>
              <Typography variant="body" className="text-brutal-gray">
                Log your activities and see your improvements over time
              </Typography>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-brutal-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Typography variant="h4" weight="bold" className="text-brutal-orange">
                  3
                </Typography>
              </div>
              <Typography variant="h5" weight="bold" className="mb-3">
                Stay Motivated
              </Typography>
              <Typography variant="body" className="text-brutal-gray">
                Celebrate achievements and maintain momentum
              </Typography>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-brutal-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Typography variant="h4" weight="bold" className="text-brutal-red">
                  4
                </Typography>
              </div>
              <Typography variant="h5" weight="bold" className="mb-3">
                Build Habits
              </Typography>
              <Typography variant="body" className="text-brutal-gray">
                Create sustainable routines that last a lifetime
              </Typography>
            </div>
          </Grid>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-brutal-black text-white">
        <div className="brutal-container">
          <div className="text-center max-w-3xl mx-auto">
            <Typography variant="h2" weight="bold" className="mb-6">
              Ready to Transform Your Life?
            </Typography>
            <Typography variant="body" className="mb-8 text-brutal-gray-300">
              Join thousands who have embraced the kaizen approach to fitness. Your fitness journey 
              is unique, and MYKA adapts to your lifestyle, helping you make continuous 
              improvements that compound into extraordinary results.
            </Typography>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {state.isAuthenticated ? (
                <Link href="/dashboard">
                  <Button variant="default" size="lg" className="w-full sm:w-auto">
                    Continue Your Journey
                  </Button>
                </Link>
              ) : (
                <Link href="/register">
                  <Button variant="default" size="lg" className="w-full sm:w-auto">
                    Begin Your Fitness Journey
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      {!isInstalled && canInstall && (
        <section className="py-12 md:py-16 bg-brutal-green-50">
          <div className="brutal-container">
            <Card className="text-center p-6 md:p-8">
              <Typography variant="h3" weight="bold" className="mb-4">
                Take MYKA Everywhere 📱
              </Typography>
              <Typography variant="body" className="mb-6 text-brutal-gray">
                Install MYKA on your home screen for instant access to your fitness journey. 
                Track workouts, log meals, and monitor progress - even when you&apos;re offline at the gym.
              </Typography>
              <Button 
                variant="default" 
                size="lg" 
                onClick={() => {
                  if (platform === 'android') {
                    showInstallPrompt();
                  } else {
                    setShowInstallModal(true);
                  }
                }}
                className="w-full sm:w-auto"
              >
                Install MYKA
              </Button>
            </Card>
          </div>
        </section>
      )}

      {isInstalled && (
        <section className="py-12 md:py-16 bg-brutal-green-50">
          <div className="brutal-container">
            <Card className="text-center p-6 md:p-8 bg-green-100">
              <Typography variant="h3" weight="bold" className="mb-4">
                MYKA Installed! 🎉
              </Typography>
              <Typography variant="body" className="text-brutal-gray">
                Your fitness companion is now ready on your home screen. 
                Start tracking your kaizen journey anytime, anywhere!
              </Typography>
            </Card>
          </div>
        </section>
      )}

      {/* Installation Prompts */}
      {shouldShowPrompt && platform === 'android' && (
        <InstallPrompt />
      )}
      
      {shouldShowPrompt && platform === 'ios' && (
        <IOSInstallInstructions />
      )}

      {showInstallModal && platform === 'ios' && (
        <IOSInstallInstructions onClose={() => setShowInstallModal(false)} />
      )}
    </main>
  )
}