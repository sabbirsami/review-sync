import SearchIcon from '@/components/icons/SearchIcon';
import { Settings } from 'lucide-react';

const Header = ({ title }: { title: string }) => {
  return (
    <section className="flex items-center justify-between border-b border-background pb-5 px-6 ">
      <h1 className="text-2xl font-semibold text-[#1B5551]">{title}</h1>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1B5551]/60 w-4 h-4" />
          <input
            type="text"
            placeholder="Type keywords to search..."
            className="pl-10 pr-4 py-3 border text-sm border-[#D1D9D8] rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-[#0B5C58] bg-white text-[#1B5551]"
          />
        </div>
        <button className="p-2 text-[#1B5551]/60 hover:text-[#1B5551]">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default Header;
