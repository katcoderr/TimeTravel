import { useNavigate } from "react-router-dom";
import ProfileInfo from "./Cards/ProfileInfo";

const Navbar = ({ userInfo }) => {

  const navigate = useNavigate()

  const onLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
      <h2 className="text-cyan-500">TimeTravel</h2>

      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
