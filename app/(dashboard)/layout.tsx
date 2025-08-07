import Sidebar from '@/components/share/sidebar/Sidebar';

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <section className="">
      <div className="grid grid-cols-12 min-h-screen">
        <div className="col-span-2">
          <Sidebar />
        </div>
        <div className="col-span-10 bg-slate-50">{children}</div>
      </div>
      {/* <ChatSheet /> */}
    </section>
  );
};

export default layout;
