import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BriefcaseIcon, SearchIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Find Your Next Opportunity</h1>
          <p className="text-muted-foreground text-lg">
            Connect with local gigs and talent in your area
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <SearchIcon className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">Find Gigs</h2>
              <p className="text-muted-foreground mb-4">
                Browse local opportunities that match your skills and location
              </p>
              <Link href="/auth?type=seeker">
                <Button className="w-full">Join as Seeker</Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <BriefcaseIcon className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">Post Gigs</h2>
              <p className="text-muted-foreground mb-4">
                Create opportunities and find talented individuals in your area
              </p>
              <Link href="/auth?type=seeking">
                <Button className="w-full">Join as Seeking</Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <UserIcon className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">Sign In</h2>
              <p className="text-muted-foreground mb-4">
                Already have an account? Sign in to continue
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}