import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  Lock,
  Mail,
  CheckCircle2,
  Cpu,
  HardHat,
} from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAppState();

  const [email, setEmail] = useState('m.vance@siteguard-ai.demo');
  const [password, setPassword] = useState('SafetyFirst2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid corporate email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await loginUser({ email: email.trim(), password, rememberMe });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50">
      {/* Left Column: Industrial Safety Visual & Branding */}
      <div className="lg:col-span-7 bg-navy-900 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
        {/* Top Brand */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">
                SiteGuard AI
              </span>
              <p className="text-xs text-slate-400">
                Intelligent Construction Safety Monitoring
              </p>
            </div>
          </div>
          <Badge variant="demo">Phase 2 Frontend UI</Badge>
        </div>

        {/* Center Technical Illustration & Value Proposition */}
        <div className="relative z-10 my-10 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-navy-800 border border-slate-700 text-xs text-blue-300 font-mono">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>YOLOv8 PPE Detection • 11 Safety Classes</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
            Automated PPE Compliance & Site Hazard Verification for Industrial Teams
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Monitor construction zones, inspect uploaded site imagery and video feeds, and track personal protective equipment (PPE) compliance with structured incident workflows.
          </p>

          {/* Architectural Construction Safety Schematic Illustration */}
          <div className="rounded-lg bg-navy-950/90 border border-slate-800 p-4 shadow-inner">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-3 mb-3 border-b border-slate-800">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                SCHEMA PREVIEW — ZONE A CRANE BAY
              </span>
              <span>MODEL: model/best.pt</span>
            </div>

            <svg
              viewBox="0 0 560 190"
              className="w-full h-40 rounded bg-slate-900/90 border border-slate-800/80"
              aria-label="Construction safety bounding box illustration"
            >
              {/* Grid lines */}
              <g stroke="#1e293b" strokeWidth="1">
                <line x1="0" y1="45" x2="560" y2="45" />
                <line x1="0" y1="95" x2="560" y2="95" />
                <line x1="0" y1="145" x2="560" y2="145" />
                <line x1="140" y1="0" x2="140" y2="190" />
                <line x1="280" y1="0" x2="280" y2="190" />
                <line x1="420" y1="0" x2="420" y2="190" />
              </g>

              {/* Compliant Worker Box */}
              <g transform="translate(75, 22)">
                <rect
                  x="0"
                  y="0"
                  width="155"
                  height="142"
                  rx="4"
                  fill="#16a34a"
                  fillOpacity="0.08"
                  stroke="#22c55e"
                  strokeWidth="2"
                />
                <rect x="0" y="0" width="128" height="20" fill="#16a34a" />
                <text
                  x="6"
                  y="14"
                  fill="#ffffff"
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="10"
                  fontWeight="600"
                >
                  helmet 97% | vest 94%
                </text>
                {/* Stylized worker silhouette */}
                <path
                  d="M62 46 C62 34, 92 34, 92 46 Z"
                  fill="#f59e0b"
                />
                <circle cx="77" cy="54" r="10" fill="#cbd5e1" />
                <rect x="57" y="68" width="40" height="48" rx="5" fill="#eab308" />
                <rect x="57" y="82" width="40" height="5" fill="#fef08a" />
                <rect x="57" y="98" width="40" height="5" fill="#fef08a" />
              </g>

              {/* Violation Worker Box */}
              <g transform="translate(315, 22)">
                <rect
                  x="0"
                  y="0"
                  width="165"
                  height="142"
                  rx="4"
                  fill="#dc2626"
                  fillOpacity="0.1"
                  stroke="#ef4444"
                  strokeWidth="2"
                />
                <rect x="0" y="0" width="132" height="20" fill="#dc2626" />
                <text
                  x="6"
                  y="14"
                  fill="#ffffff"
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="10"
                  fontWeight="600"
                >
                  no_helmet 94% [ALERT]
                </text>
                <circle cx="82" cy="54" r="11" fill="#cbd5e1" />
                <rect x="62" y="68" width="40" height="48" rx="5" fill="#475569" />
              </g>
            </svg>

            <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Hard Hat & Vest</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Goggles & Gloves</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Safety Footwear</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 pt-4 border-t border-slate-800/80">
          <span>SiteGuard AI — Enterprise HSE Platform</span>
          <span className="font-mono">Phase 2 • Frontend UI Prototype</span>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="lg:col-span-5 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
              <HardHat className="w-4 h-4" />
              <span>HSE Operator Portal</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
              Sign in to SiteGuard AI
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Access site safety telemetry, media analysis, and incident review logs.
            </p>
          </div>

          {/* Explicit Demo Authentication Banner */}
          <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="font-semibold flex items-center justify-between">
              <span>Demo Authentication Mode (Phase 2)</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-100 border border-amber-300">
                No Backend Required
              </span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Backend authentication is scheduled for a future phase. Use the pre-filled demo supervisor credentials below or any valid email to explore the interface.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-md border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmailSent(false);
                    setForgotModalOpen(true);
                  }}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2.5 text-sm rounded-md border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember this workstation</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setEmail('m.vance@siteguard-ai.demo');
                  setPassword('SafetyFirst2026!');
                  setError('');
                }}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                Fill Demo Credentials
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              {loading ? 'Signing in to Demo Portal...' : 'Sign In to Dashboard'}
            </Button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        open={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Password Recovery (Demo Mode)"
        subtitle="Phase 2 Frontend Authentication Notice"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setForgotModalOpen(false)}
            >
              Close
            </Button>
            {!resetEmailSent && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setResetEmailSent(true)}
              >
                Simulate Reset Link
              </Button>
            )}
          </>
        }
      >
        {resetEmailSent ? (
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <p className="font-semibold">Demo Recovery Simulated</p>
            <p>
              In Phase 2, authentication is simulated locally. You can sign in immediately using{' '}
              <code className="font-mono font-semibold">m.vance@siteguard-ai.demo</code> and any password of 6+ characters.
            </p>
          </div>
        ) : (
          <div className="space-y-3 text-xs text-slate-600">
            <p>
              Real user management and password recovery emails will be connected in Phase 3 alongside the Python backend database.
            </p>
            <p>
              To sign in right now, click <strong>Fill Demo Credentials</strong> on the login form or enter any valid email address.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
