import { useState, useEffect } from 'react';
import supabase from '../../../backend/supabase-client';

const useAuth = () => {
    const [session, setSession] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);

    useEffect(() => {
        const getSession = async () => {
            const { data: sessionData } = await supabase.auth.getSession();
            const session = sessionData?.session || null;
            setSession(session);

            if (session) {
                const { data: staffData, error } = await supabase
                    .from('staff')
                    .select('is_admin')
                    .eq('staff_id', session.user.id)
                    .single();

                if (error) {
                    console.error('Error fetching staff data:', error.message);
                } else {
                    setIsAdmin(staffData?.is_admin || false); 
                }
            }
        };

        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => authListener.subscription.unsubscribe();
    }, []);

    return { session, isAdmin };
};

export default useAuth;