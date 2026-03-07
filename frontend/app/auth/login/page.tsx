
import LoginScreen from '@/components/auth/login/page';
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Login',
    description: '...',
}


export default function page() {


    return (
        <LoginScreen />

    )
}
