import { LoginForm } from '../features/auth/LoginForm';
import logo from '../assets/logo.png';
import heroImage from '../assets/hero-image.png';

export const LoginPage = ({ onLoginSuccess }) => {
  return (
    <div className="h-screen w-full bg-gray-50 flex items-center justify-center p-0 md:p-6 font-sans overflow-hidden">
      <div className="w-full h-full max-w-7xl max-h-[850px] grid grid-cols-1 md:grid-cols-2 bg-white rounded-none md:rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Left Side - Hero Image with Scrim Effect */}
        <div className="relative h-full w-full bg-primary-red overflow-hidden">
          <img 
            src={heroImage} 
            alt="University Life" 
            className="absolute inset-0 w-full h-full object-cover object-center transform scale-105"
          />
          
          {/* Logo - Circular Overlay */}
          <div className="absolute top-8 left-8 z-20">
            <div className="bg-white p-2 rounded-full shadow-lg border-2 border-primary-red/20 overflow-hidden w-16 h-16 flex items-center justify-center">
              <img src={logo} alt="U-Pocket" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* The Scrim / Gradient Blur Effect */}
          <div className="absolute bottom-0 left-0 w-full h-2/3 scrim-blur z-10 flex flex-col justify-end p-12">
            <div className="relative z-20 text-white">
              <p className="text-xl font-medium leading-relaxed opacity-95">
                The smartest way to pay for cafeteria services, printing, and transport at your university.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="h-1 w-12 bg-accent-yellow rounded-full"></span>
                <span className="text-sm font-bold uppercase tracking-widest text-accent-yellow">Digital Wallet App</span>
              </div>
            </div>
          </div>
          
          {/* Base overlay to ensure readability */}
          <div className="absolute inset-0 bg-black/10 z-0"></div>
        </div>

        {/* Right Side - Form & Hero Titles */}
        <div className="p-8 md:p-16 flex flex-col bg-white overflow-y-auto">
          <div className="mb-10">
            {/* Logo for mobile */}
            <div className="md:hidden mb-6 bg-white p-1 rounded-full shadow-md w-12 h-12 flex items-center justify-center border border-gray-100">
              <img src={logo} alt="Logo" className="w-full h-full object-cover rounded-full" />
            </div>

            {/* Hero Words moved to the right side as requested */}
            <h1 className="text-4xl lg:text-5xl font-extrabold text-primary-red leading-tight mb-2">
              Your Campus Wallet, <br/>
              <span className="text-neutral-dark">Simplified.</span>
            </h1>
            <div className="h-1 w-20 bg-accent-yellow mb-8 rounded-full"></div>
            
            <h2 className="text-2xl font-bold text-neutral-dark tracking-tight">Welcome back</h2>
            <p className="text-gray-500 mt-1">Enter your student credentials to continue</p>
          </div>
          
          <LoginForm onLoginSuccess={onLoginSuccess} />
          
          <div className="mt-auto pt-8 text-center md:text-left">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
              Official University System • Secure Encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
