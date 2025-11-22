import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const navigate = useNavigate();
    const { toast } = useToast();
    const { register } = useAuth();

    const validate = () => {
      const newErrors: {[key: string]: string} = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Por favor, ingrese un email válido.';
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      if (!passwordRegex.test(password)) {
        newErrors.password = 'La contraseña debe tener 8+ caracteres, una mayúscula, una minúscula y un número.';
      }

      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden.';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            toast({ title: "Error de validación", description: "Por favor, corrija los errores.", variant: "destructive" });
            return;
        }
        
        register({ email });
        toast({
            title: "¡Registro exitoso!",
            description: "Te hemos enviado un email para verificar tu cuenta. ¡Ya podés iniciar sesión!",
        });
        navigate('/login');
    };

    const benefits = [
        "Publicar propiedades GRATIS",
        "Guardar tus propiedades favoritas",
        "Recibir contactos directos de interesados",
        "Crear alertas de búsqueda personalizadas"
    ];

    return (
        <>
            <Helmet>
                <title>Crear Cuenta - PropiedadesArgentinas.com</title>
            </Helmet>
            <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-200px)]">
                <div className="w-full max-w-4xl grid md:grid-cols-2 gap-10 bg-card border rounded-lg shadow-lg overflow-hidden">
                    <div className="p-8 space-y-6">
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold text-foreground">Creá tu cuenta gratis</h1>
                            <p className="text-muted-foreground mt-2">
                                ¿Ya tenés cuenta? <Link to="/login" className="font-medium text-primary hover:underline">Iniciá sesión</Link>
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="email-register">Email</Label>
                                <Input id="email-register" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="tu@email.com" />
                                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div className="space-y-1 relative">
                                <Label htmlFor="password-register">Contraseña</Label>
                                <Input id="password-register" type={passwordVisible ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Mínimo 8 caracteres" />
                                <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute right-3 top-9 text-muted-foreground">
                                    {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                                <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Repetir contraseña" />
                                {errors.confirmPassword && <p className="text-destructive text-xs mt-1">{errors.confirmPassword}</p>}
                            </div>
                            <Button type="submit" className="w-full">
                                Registrarme
                            </Button>
                        </form>
                    </div>
                    <div className="hidden md:block bg-primary p-8 text-primary-foreground">
                        <h2 className="text-2xl font-bold mb-6">Registrate GRATIS para:</h2>
                        <ul className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start">
                                    <CheckCircle className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
