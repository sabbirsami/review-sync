import Sidebar from '@/components/share/sidebar/Sidebar';

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <section className="">
      <div className="grid grid-cols-12 ">
        <div className="col-span-2">
          <Sidebar />
        </div>
        <div className="col-span-10">{children}</div>
      </div>
    </section>
  );
};

export default layout;
