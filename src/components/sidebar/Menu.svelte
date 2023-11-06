<script>
    const logout = async () => {
        sessionStorage.removeItem('user');
        window.location.href = '/';
    }
</script>