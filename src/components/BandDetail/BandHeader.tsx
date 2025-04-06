import { FaUser } from "react-icons/fa";
import Link from "next/link";
import UserPanel from "../UserPanel";
import { User } from "../../types/bandTypes";

interface BandHeaderProps {
  user: User | null;
  setShow: (show: boolean) => void;
  isUserPanelOpen: boolean;
  setIsUserPanelOpen: (open: boolean) => void;
  handleUpdateUser: (updatedUser: { username: string; avatarUrl: string | null }) => void;
  handleAvatarClick: () => void;
  bech32Address?: string;
  avatarRef: React.RefObject<HTMLDivElement>;
  panelRef: React.RefObject<HTMLDivElement>;
}

export const BandHeader = ({
  user,
  setShow,
  isUserPanelOpen,
  setIsUserPanelOpen,
  handleUpdateUser,
  handleAvatarClick,
  bech32Address,
  avatarRef,
  panelRef,
}: BandHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] bg-opacity-95 shadow-metal border-b border-[#3a1c1c]">
      <div className="container mx-auto flex justify-between items-center p-4 max-w-7xl">
        <div className="header-logo">
          <img src="/images/logo.jpg" alt="Metal Music Logo" className="h-12" />
        </div>
        <nav className="header-nav flex space-x-6">
          <ul className="flex space-x-6">
            <li><Link href="/" className="text-[#8a8a8a] hover:text-[#8a4a4a] transition duration-300 skull-hover">Home</Link></li>
            <li><Link href="/encyclopedia" className="text-[#8a8a8a] hover:text-[#8a4a4a] transition duration-300 skull-hover">Encyclopedia</Link></li>
            <li><Link href="#" className="text-[#8a8a8a] hover:text-[#8a4a4a] transition duration-300 skull-hover">Add Band</Link></li>
            <li><Link href="#" className="text-[#8a8a8a] hover:text-[#8a4a4a] transition duration-300 skull-hover">News</Link></li>
            <li><Link href="#" className="text-[#8a8a8a] hover:text-[#8a4a4a] transition duration-300 skull-hover">Roadmap</Link></li>
          </ul>
        </nav>
        <div className="web3-login relative">
          {user ? (
            <div ref={avatarRef} className="flex items-center justify-center cursor-pointer" onClick={handleAvatarClick}>
              <img
                src={user.avatarUrl || "/images/default-avatar.png"}
                alt="User Avatar"
                className="h-10 w-10 rounded-full border-2 border-[#3a1c1c] shadow-metal"
              />
            </div>
          ) : (
            <button
              onClick={() => setShow(true)}
              className="bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] hover:from-[#5a2e2e] hover:to-[#2a2a2a] text-[#d0d0d0] px-4 py-2 rounded-lg shadow-metal transition duration-300 font-unbounded uppercase tracking-wide"
            >
              CONNECT
            </button>
          )}
          {isUserPanelOpen && user && (
            <div ref={panelRef} className="absolute top-14 right-0 z-50">
              <UserPanel
                onViewAccount={() => setShow(true)}
                accountNumber={bech32Address || null}
                user={user}
                onUpdateUser={handleUpdateUser}
                onClose={() => setIsUserPanelOpen(false)}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};