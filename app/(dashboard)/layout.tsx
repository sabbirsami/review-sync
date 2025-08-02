import ChatBox from '@/components/chat/ChatBox';
import Sidebar from '@/components/share/sidebar/Sidebar';

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <section className="">
      <div className="grid grid-cols-12 ">
        <div className="col-span-2">
          <Sidebar />
        </div>
        <div className="col-span-7">{children}</div>
        <div className="col-span-3 ">
          <ChatBox />
        </div>
      </div>
    </section>
  );
};

export default layout;
