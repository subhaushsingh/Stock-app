'use client'

import{ CountrySelectField} from '@/components/forms/CountrySelectField'
import FooterLink from '@/components/forms/Footerlink'
import InputFields from '@/components/forms/inputFields'
import SelectField from '@/components/forms/SelectField'
import { Button } from '@/components/ui/button'
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from '@/lib/constants'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import {useRouter} from 'next/navigation'
import {toast} from "sonner";
import {signUpWithEmail} from "@/lib/actions/auth.action";

const SignUp = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState:{errors,isSubmitting},
  } = useForm<SignUpFormData>({
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            country: 'US',
            investmentGoals: 'Growth',
            riskTolerance: 'Medium',
            preferredIndustry: 'Technology'
        },
        mode: 'onBlur'
    },);

   const onSubmit = async (data: SignUpFormData) => {
        try {
            const result = await signUpWithEmail(data);
            if(result.success) router.push('/');
        } catch (e) {
            console.error(e);
            toast.error('Sign in failed', {
                description: e instanceof Error ? e.message : 'Failed to sign in.'
            })
        }
    }

  return (
    <>
    <h1 className='text-4xl font-bold text-gray-400 mb-10'>Sign UP & Personalize</h1>
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
    <InputFields
                    name="fullName"
                    label="Full Name"
                    placeholder="John Doe"
                    register={register}
                    error={errors.fullName}
                    validation={{ required: 'Full name is required', minLength: 2 }}
                />

    <InputFields
                    name="email"
                    label="Email"
                    placeholder="sample@email.com"
                    register={register}
                    error={errors.email}
                    validation={{ required: 'Email name is required', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email address is required' }}
                />

                <InputFields
                    name="password"
                    label="Password"
                    placeholder="Enter a strong password"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ required: 'Password is required', minLength: 8 }}
                />

                <CountrySelectField
                    name="country"
                    label="Country"
                    control={control}
                    error={errors.country}
                    required
                />

                 <SelectField
                    name="investmentGoals"
                    label="Investment Goals"
                    placeholder="Select your investment goal"
                    options={INVESTMENT_GOALS}
                    control={control}
                    error={errors.investmentGoals}
                    required
                />

                <SelectField
                    name="riskTolerance"
                    label="Risk Tolerance"
                    placeholder="Select your risk level"
                    options={RISK_TOLERANCE_OPTIONS}
                    control={control}
                    error={errors.riskTolerance}
                    required
                />

                <SelectField
                    name="preferredIndustry"
                    label="Preferred Industry"
                    placeholder="Select your preferred industry"
                    options={PREFERRED_INDUSTRIES}
                    control={control}
                    error={errors.preferredIndustry}
                    required
                />


        <Button type='submit' disabled={isSubmitting} className='h-12 cursor-pointer bg-linear-to-b from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-gray-950 font-medium text-base rounded-lg shadow-lg disabled:opacity-50'>
          {isSubmitting ? 'Creating Account' : 'Start your Journey'}
        </Button>

        <FooterLink text='Already have an account?' linkText='Sign-in' href='/SignIn' />
    </form>

    </>
  )
}

export default SignUp
