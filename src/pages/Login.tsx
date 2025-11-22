import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Chrome } from 'lucide-react';
import { Label } from '@/components/ui/label';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const { login } = useAuth();

    const from = location.state?.from?.pathname || "/panel";

    const validateEmail = (email: string) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(email)) {
            setError('Por favor, ingrese un email válido.');
            toast({ title: "Error de validación", description: 'Por favor, ingrese un email válido.', variant: "destructive" });
            return;
        }

        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            toast({ title: "Error de validación", description: 'La contraseña debe tener al menos 8 caracteres.', variant: "destructive" });
            return;
        }

        // Mock Login Logic
        if (email === "test@test.com" && password === "password123") {
            login({ email, name: 'Usuario Test' });
            toast({ title: "¡Bienvenido de vuelta!" });
            navigate(from, { replace: true });
        } else {
            setError('Email o contraseña incorrectos.');
            toast({ title: "Error de inicio de sesión", description: 'Email o contraseña incorrectos.', variant: "destructive" });
        }
    };

    const handleGoogleLogin = () => {
        toast({
            title: "🚧 ¡Función no implementada!",
            description: "El inicio de sesión con Google estará disponible pronto. 🚀",
        });
    };

    const handlePasswordRecovery = () => {
         toast({
            title: "Recuperación de contraseña",
            description: "Si el email está registrado, recibirás un correo para recuperar tu contraseña.",
        });
    };

    return (
        <>
            <Helmet>
                <title>Iniciar Sesión - PropiedadesArgentinas.com</title>
            </Helmet>
            <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-200px)]">
                <div className="w-full max-w-md p-8 space-y-6 bg-card border rounded-lg shadow-lg">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-foreground">Iniciar Sesión</h1>
                        <p className="text-muted-foreground mt-2">
                            ¿No tenés cuenta? <Link to="/registro" className="font-medium text-primary hover:underline">Registrate gratis</Link>
                        </p>
                    </div>
                    {error && <p className="text-destructive text-sm text-center">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="tu@email.com"
                                aria-describedby="email-error"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                             <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Mínimo 8 caracteres"
                                aria-describedby="password-error"
                            />
                        </div>
                        <div className="flex items-center justify-end">
                            <button type="button" onClick={handlePasswordRecovery} className="text-sm text-primary hover:underline">¿Olvidaste tu contraseña?</button>
                        </div>
                        <Button type="submit" className="w-full">
                            Ingresar
                        </Button>
                    </form>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">O continuá con</span>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                        <Chrome className="mr-2 h-5 w-5" /> Google
                    </Button>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
