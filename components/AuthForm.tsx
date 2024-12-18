import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FaGoogle } from 'react-icons/fa';
import { LoaderIcon } from 'lucide-react';
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Import eye icons

interface FormProps {
  title: string;
  description: string;
  buttonText: string;
  onSubmit: (email: string, password: string) => void;
  loading: boolean;
  googleLogin: () => void;
  showGoogleButton: boolean;
  showLinks?: boolean;
  showLoginLink?: boolean; // Optional prop for sign-up to show login link
}

const AuthForm: React.FC<FormProps> = ({
  title,
  description,
  buttonText,
  onSubmit,
  loading,
  googleLogin,
  showGoogleButton,
  showLinks,
  showLoginLink, // Receive the new optional prop
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <h2 className="text-2xl font-bold text-center">{title}</h2>
          <p className="text-center text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'} // Toggle password visibility
                  value={password}
                  placeholder="type your password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-2 flex items-center text-muted-foreground"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
              {buttonText}
            </Button>
          </form>

          {showGoogleButton && (
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
          )}

          {showGoogleButton && (
            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={googleLogin}
            >
              <FaGoogle className="mr-2 h-4 w-4" />
              Google
          </Button>
          )}
        </CardContent>

        {showLinks && (
          <CardFooter className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm text-muted-foreground">
              <span>Don&apos;t have an account? </span>
              <Link
                href="/auth/signup"
                className="text-primary underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </div>
            <Link
              href="/auth/reset-password"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </CardFooter>
        )}

        {/* Optional sign-up footer for login link */}
        {showLoginLink && (
          <CardFooter>
            <div className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-primary underline-offset-4 hover:underline"
              >
                Login
              </Link>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default AuthForm;
