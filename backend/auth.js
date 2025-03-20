import supabase from './supabase-client';

const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Logout failed:', error.message);
    }
};

export default handleLogout;
