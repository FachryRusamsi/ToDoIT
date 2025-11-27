import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-4 md:px-8 sticky top-0 z-20">
      <div className="flex-1">
        <button
          onClick={() => navigate('/')}
          className="btn btn-ghost normal-case text-xl font-bold"
        >
          Deadline<span className="text-primary ml-1">Organizer</span>
        </button>
      </div>
      <div className="flex-none gap-2">
        <span className="hidden sm:inline text-sm text-base-content/70">
          {user.name}
        </span>
        <button
          onClick={() => navigate('/tasks/new')}
          className="btn btn-primary btn-sm"
        >
          + New Task
        </button>
        <button onClick={handleLogout} className="btn btn-ghost btn-sm">
          Logout
        </button>
      </div>
    </div>
  );
}
