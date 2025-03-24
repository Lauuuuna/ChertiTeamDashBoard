const supabaseUrl = 'https://ivriytixvxgntxkougjr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cml5dGl4dnhnbnR4a291Z2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NzY0NDgsImV4cCI6MjA1ODI1MjQ0OH0.hByLZ98uqgJaKLPvZ3jf6_-SnCDIkttG2S9RfgNahtE';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

let currentUserNickname = null; 

async function login() {
    const nickname = document.getElementById('nickname').value;
    const password = document.getElementById('password').value;

    const { data: userData, error: userError } = await supabaseClient
        .from('players')
        .select('*')
        .eq('nickname', nickname)
        .single();

    if (userError) {
        console.error('Error finding user:', userError);
        alert('User not found');
        return;
    }

    if (userData.password === password) {
        currentUserNickname = nickname; 
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('profile-section').style.display = 'block';
        loadCurrentProfileData(userData);
        alert('Login successful <3');
    } else {
        console.error('Invalid password </3');
        alert('Invalid password </3');
    }
}

async function loadCurrentProfileData(userData) {
    document.getElementById('current-nickname').textContent = userData.nickname;
    document.getElementById('current-avatar-url').textContent = userData.avatar_url;
    document.getElementById('current-banner-url').textContent = userData.banner_url;
    document.getElementById('current-about-me').textContent = userData.about_me;

    document.getElementById('new-nickname').value = userData.nickname;
    document.getElementById('avatar-url').value = userData.avatar_url;
    document.getElementById('banner-url').value = userData.banner_url;
    document.getElementById('about-me').value = userData.about_me;
}

async function updateProfile() {
    const newNickname = document.getElementById('new-nickname').value;
    const avatarUrl = document.getElementById('avatar-url').value;
    const bannerUrl = document.getElementById('banner-url').value;
    const aboutMe = document.getElementById('about-me').value;

    const { data, error } = await supabaseClient
        .from('players')
        .update({
            nickname: newNickname || currentUserNickname, 
            avatar_url: avatarUrl,
            banner_url: bannerUrl,
            about_me: aboutMe
        })
        .eq('nickname', currentUserNickname); 

    if (error) {
        console.error('Error updating profile </3', error);
        alert('Failed to update profile');
    } else {
        alert('Profile updated successfully <3');
        currentUserNickname = newNickname || currentUserNickname; 

        const { data: updatedUserData, error: fetchError } = await supabaseClient
            .from('players')
            .select('*')
            .eq('nickname', currentUserNickname)
            .single(); 

        if (fetchError) {
            console.error('Error fetching updated profile </3', fetchError);
            alert('Failed to fetch updated profile data </3');
        } else {
            loadCurrentProfileData(updatedUserData); 
        }
    }
}