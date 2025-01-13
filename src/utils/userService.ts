export const fetchSignUp = async (name: string, email: string, password: string) => {
    const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) {
        throw new Error('Failed to sign up');
    }
    return response.json();
};

export const fetchSignIn = async (email: string, password: string) => {
    const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        throw new Error('Failed to sign in');
    }
    return response.json();
}; 