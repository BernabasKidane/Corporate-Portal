import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Shield, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Welcome to <span className="text-primary">Employee Portal</span>
            </h1>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
              Your comprehensive platform for employee onboarding, training, and
              development. Start your journey with us today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth/signin">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="outline" size="lg">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center">
            Everything you need to succeed
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<CheckCircle2 className="w-10 h-10 text-primary" />}
              title="Structured Onboarding"
              description="Follow our comprehensive onboarding program designed to set you up for success from day one."
            />
            <FeatureCard
              icon={<Users className="w-10 h-10 text-primary" />}
              title="Team Collaboration"
              description="Connect with your team members and managers through our integrated platform."
            />
            <FeatureCard
              icon={<Shield className="w-10 h-10 text-primary" />}
              title="Secure Access"
              description="Your data is protected with enterprise-grade security and role-based access control."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to get started?</h2>
          <p className="mb-8 text-lg opacity-90">
            Join our team and begin your journey with us today.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="gap-2">
              Create Account <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
