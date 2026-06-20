export default function Logout() {
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    alert("Logout successful!");
    window.location.href = "/"; // Redirect to login page
  };


  
  return (
    <button onClick={handleLogout} className="buttonLogout">
      Logout
    </button>
  );
}