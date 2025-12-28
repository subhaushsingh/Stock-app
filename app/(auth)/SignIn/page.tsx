'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import InputFields from '@/components/forms/inputFields';
import FooterLink from '@/components/forms/Footerlink';

const SignIn = () => {
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: SignInFormData) => {
        try {
            console.log('Sign in',data)
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            <h1 className="ftext-4xl font-bold text-gray-400 mb-10">Welcome back</h1>

            <form  className="space-y-5">
                <InputFields
                    name="email"
                    label="Email"
                    placeholder="sample@gmail.com"
                    register={register}
                    error={errors.email}
                    validation={{ required: 'Email is required', pattern: /^\w+@\w+\.\w+$/ }}
                />

                <InputFields
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ required: 'Password is required', minLength: 8 }}
                />

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? 'Signing In' : 'Sign In'}
                </Button>

                <FooterLink text="Don't have an account?" linkText="Create an account" href="/SignUp" />
            </form>
        </>
    );
};
export default SignIn;