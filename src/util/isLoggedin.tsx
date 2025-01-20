

export default function isLoggedin() {
  const token = localStorage.getItem("token");
  if (!token) return false;
  return true;
}