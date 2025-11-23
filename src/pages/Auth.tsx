import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, Home, Building2 } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('Email inválido').max(255);
const passwordSchema = z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(100);

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const validateForm = () => {
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      
      if (!isLogin && !fullName.trim()) {
        toast.error('Por favor ingresa tu nombre completo');
        return false;
      }
      
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Email o contraseña incorrectos');
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success('¡Bienvenido de nuevo!');
        navigate(from, { replace: true });
      } else {
        const { error } = await signUp(email, password, fullName);
        
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('Este email ya está registrado');
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success('¡Cuenta creada exitosamente!');
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error('Ocurrió un error. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? 'Iniciar Sesión' : 'Registrarse'} - Portal Inmobiliario</title>
        <meta name="description" content={isLogin ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta gratuita'} />
      </Helmet>

      <div className="min-h-screen flex">
        {/* Left side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-background">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">Portal Inmobiliario</span>
              </div>
              <h1 className="text-3xl font-bold">
                {isLogin ? 'Bienvenido de nuevo' : 'Crear cuenta'}
              </h1>
              <p className="text-muted-foreground">
                {isLogin 
                  ? 'Ingresa tus credenciales para continuar' 
                  : 'Completa el formulario para registrarte'
                }
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nombre completo</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Juan Pérez"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                    maxLength={100}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={255}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    maxLength={100}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {!isLogin && (
                  <p className="text-xs text-muted-foreground">
                    Mínimo 6 caracteres
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
              </Button>
            </form>

            {/* Toggle */}
            <div className="text-center space-y-4">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {isLogin ? (
                  <>
                    ¿No tienes cuenta?{' '}
                    <span className="text-primary font-semibold">Regístrate</span>
                  </>
                ) : (
                  <>
                    ¿Ya tienes cuenta?{' '}
                    <span className="text-primary font-semibold">Inicia sesión</span>
                  </>
                )}
              </button>

              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                Volver al inicio
              </Button>
            </div>
          </div>
        </div>

        {/* Right side - Image/Info */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 via-primary/5 to-background items-center justify-center p-12">
          <div className="max-w-md space-y-6 text-center">
            <Building2 className="h-24 w-24 mx-auto text-primary" />
            <h2 className="text-4xl font-bold">
              {isLogin ? 'Tu portal inmobiliario' : 'Únete a nosotros'}
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg">
                ✓ Publica propiedades en venta o alquiler
              </p>
              <p className="text-lg">
                ✓ Guarda tus favoritos y comparaciones
              </p>
              <p className="text-lg">
                ✓ Contacta directamente con propietarios
              </p>
              <p className="text-lg">
                ✓ Accede a proyectos de inversión exclusivos
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
